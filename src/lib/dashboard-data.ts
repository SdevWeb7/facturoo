import { prisma } from "@/lib/prisma";
import { computeTotals } from "@/lib/utils";

export interface MonthlyRevenue {
  month: string; // "Jan", "Fév", etc.
  totalTTC: number; // in cents
}

const MONTH_LABELS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

export async function getMonthlyRevenue(userId: string): Promise<MonthlyRevenue[]> {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const factures = await prisma.facture.findMany({
    where: {
      userId,
      deletedAt: null,
      date: { gte: twelveMonthsAgo },
    },
    include: { items: true },
  });

  // Initialize 12 months of data
  const result: MonthlyRevenue[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    result.push({
      month: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      totalTTC: 0,
    });
  }

  for (const f of factures) {
    const fDate = new Date(f.date);
    const diffMonths =
      (fDate.getFullYear() - twelveMonthsAgo.getFullYear()) * 12 +
      (fDate.getMonth() - twelveMonthsAgo.getMonth());
    if (diffMonths >= 0 && diffMonths < 12) {
      const items = f.items.map((i) => ({
        quantity: Number(i.quantity),
        unitPrice: i.unitPrice,
      }));
      const totals = computeTotals(items, Number(f.tvaRate));
      result[diffMonths].totalTTC += totals.totalTTC;
    }
  }

  return result;
}

export interface OverdueFacture {
  id: string;
  number: string;
  clientName: string;
  date: Date;
  totalTTC: number;
  daysOverdue: number;
}

export async function getOverdueFactures(userId: string): Promise<OverdueFacture[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const factures = await prisma.facture.findMany({
    where: {
      userId,
      deletedAt: null,
      status: "PENDING",
      date: { lte: thirtyDaysAgo },
    },
    include: { client: true, items: true },
    orderBy: { date: "asc" },
  });

  const now = new Date();
  return factures.map((f) => {
    const items = f.items.map((i) => ({
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice,
    }));
    const totals = computeTotals(items, Number(f.tvaRate));
    const daysOverdue = Math.floor(
      (now.getTime() - new Date(f.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      id: f.id,
      number: f.number,
      clientName: f.client.name,
      date: f.date,
      totalTTC: totals.totalTTC,
      daysOverdue,
    };
  });
}

export async function getConversionRate(userId: string): Promise<number> {
  const [total, invoiced] = await Promise.all([
    prisma.devis.count({ where: { userId } }),
    prisma.devis.count({ where: { userId, status: "INVOICED" } }),
  ]);

  if (total === 0) return 0;
  return Math.round((invoiced / total) * 100);
}

export interface TopClient {
  name: string;
  totalTTC: number;
  factureCount: number;
}

export async function getTopClients(userId: string): Promise<TopClient[]> {
  const factures = await prisma.facture.findMany({
    where: { userId, deletedAt: null },
    include: { client: true, items: true },
  });

  const clientMap = new Map<string, { name: string; totalTTC: number; count: number }>();

  for (const f of factures) {
    const items = f.items.map((i) => ({
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice,
    }));
    const totals = computeTotals(items, Number(f.tvaRate));
    const existing = clientMap.get(f.clientId) || {
      name: f.client.name,
      totalTTC: 0,
      count: 0,
    };
    existing.totalTTC += totals.totalTTC;
    existing.count += 1;
    clientMap.set(f.clientId, existing);
  }

  return Array.from(clientMap.values())
    .sort((a, b) => b.totalTTC - a.totalTTC)
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      totalTTC: c.totalTTC,
      factureCount: c.count,
    }));
}

export async function getPrevisionnel(userId: string): Promise<number> {
  const devis = await prisma.devis.findMany({
    where: { userId, status: "SENT" },
    include: { items: true },
  });

  return devis.reduce((sum, d) => {
    const items = d.items.map((i) => ({
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice,
    }));
    return sum + computeTotals(items, Number(d.tvaRate)).totalTTC;
  }, 0);
}
