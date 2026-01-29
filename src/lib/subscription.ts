import { prisma } from "@/lib/prisma";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeCurrentPeriodEnd: true,
      trialEndsAt: true,
    },
  });

  if (!user) return false;

  const now = new Date();

  if (user.trialEndsAt && user.trialEndsAt > now) return true;
  if (user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd > now) return true;

  return false;
}

export async function checkSubscription(userId: string): Promise<void> {
  const active = await hasActiveSubscription(userId);
  if (!active) {
    throw new Error("Abonnement requis. Veuillez souscrire un abonnement pour continuer.");
  }
}
