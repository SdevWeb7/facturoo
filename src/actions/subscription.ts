"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, PLANS } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { actionError, type ActionResult } from "@/lib/action-utils";
import { logAction } from "@/lib/logger";

export async function createCheckoutSession(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, stripeCustomerId: true },
  });

  if (!user) return actionError("Utilisateur introuvable");

  // Get or create Stripe Customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const priceId = PLANS.monthly.priceId;

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    metadata: { userId: session.user.id },
  });

  logAction("subscription.checkoutCreated", session.user.id, { plan: "monthly" });

  if (!checkoutSession.url) return actionError("Erreur Stripe");
  redirect(checkoutSession.url);
}

export async function createPortalSession(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return actionError("Aucun abonnement actif");
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  logAction("subscription.portalOpened", session.user.id);

  redirect(portalSession.url);
}
