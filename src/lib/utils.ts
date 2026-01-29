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
