import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/subscription";

export const FREE_LIMITS = {
  clients: 5,
  devis: 5,
  factures: 5,
} as const;

export type ResourceType = keyof typeof FREE_LIMITS;

export interface Usage {
  clients: number;
  devis: number;
  factures: number;
}

export interface CanCreateResult {
  allowed: boolean;
  current: number;
  limit: number;
}

export async function getUserUsage(userId: string): Promise<Usage> {
  const [clients, devis, factures] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.devis.count({ where: { userId } }),
    prisma.facture.count({ where: { userId, deletedAt: null } }),
  ]);

  return { clients, devis, factures };
}

export async function canCreate(
  userId: string,
  type: ResourceType
): Promise<CanCreateResult> {
  const isPro = await hasActiveSubscription(userId);
  if (isPro) {
    return { allowed: true, current: 0, limit: Infinity };
  }

  const usage = await getUserUsage(userId);
  const current = usage[type];
  const limit = FREE_LIMITS[type];

  return { allowed: current < limit, current, limit };
}

export function isProUser(userId: string): Promise<boolean> {
  return hasActiveSubscription(userId);
}
