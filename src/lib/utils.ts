import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeTotals(
  items: { quantity: number; unitPrice: number }[],
  tvaRate: number
) {
  const totalHT = items.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPrice),
    0
  );
  const totalTVA = Math.round(totalHT * (tvaRate / 100));
  const totalTTC = totalHT + totalTVA;
  return { totalHT, totalTVA, totalTTC };
}

export function computeTotalsPerLine(
  items: { quantity: number; unitPrice: number; tvaRate: number }[]
) {
  let totalHT = 0;
  const tvaByRate: Record<number, number> = {};

  for (const item of items) {
    const lineHT = Math.round(item.quantity * item.unitPrice);
    totalHT += lineHT;
    const lineTVA = Math.round(lineHT * (item.tvaRate / 100));
    tvaByRate[item.tvaRate] = (tvaByRate[item.tvaRate] || 0) + lineTVA;
  }

  const totalTVA = Object.values(tvaByRate).reduce((sum, v) => sum + v, 0);
  const totalTTC = totalHT + totalTVA;

  return { totalHT, totalTVA, totalTTC, tvaByRate };
}

export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

export const TVA_RATES = [20, 10, 5.5, 2.1] as const;

export function isValidTvaRate(rate: number): boolean {
  return TVA_RATES.includes(rate as (typeof TVA_RATES)[number]);
}
