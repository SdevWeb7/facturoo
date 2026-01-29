import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);

        const userId =
          session.metadata?.userId ??
          (
            await prisma.user.findUnique({
              where: { stripeCustomerId: session.customer as string },
              select: { id: true },
            })
          )?.id;

        if (!userId) {
          console.error("Webhook: user not found for session", session.id);
          break;
        }

        // current_period_end is now on subscription items in Stripe 2026 API
        const periodEnd =
          subscription.items.data[0]?.current_period_end ?? null;

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: periodEnd
              ? new Date(periodEnd * 1000)
              : null,
            stripeCustomerId: session.customer as string,
          },
        });

        console.log(`[stripe] checkout.session.completed for user ${userId}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        // In Stripe 2026 API, subscription info is in parent.subscription_details
        const subId =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (invoice as any).subscription ??
          (invoice.parent as any)?.subscription_details?.subscription;

        if (!subId) break;

        const subscriptionId = typeof subId === "string" ? subId : subId.id;
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);

        const periodEnd =
          subscription.items.data[0]?.current_period_end ?? null;

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeCurrentPeriodEnd: periodEnd
              ? new Date(periodEnd * 1000)
              : null,
            stripePriceId: subscription.items.data[0]?.price.id,
          },
        });

        console.log(
          `[stripe] invoice.payment_succeeded for sub ${subscription.id}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });

        console.log(
          `[stripe] customer.subscription.deleted for sub ${subscription.id}`
        );
        break;
      }

      default:
        console.log(`[stripe] Unhandled event: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
