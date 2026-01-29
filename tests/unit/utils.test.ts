import { describe, it, expect } from "vitest";
import {
  computeTotals,
  formatCurrency,
  isValidTvaRate,
  cn,
} from "@/lib/utils";

describe("computeTotals", () => {
  it("computes correct totals for basic items", () => {
    const items = [
      { quantity: 2, unitPrice: 10000 }, // 2 × 100,00 €
      { quantity: 1, unitPrice: 5000 }, // 1 × 50,00 €
    ];
    const result = computeTotals(items, 20);
    expect(result.totalHT).toBe(25000);
    expect(result.totalTVA).toBe(5000);
    expect(result.totalTTC).toBe(30000);
  });

  it("computes 0 for empty items", () => {
    const result = computeTotals([], 20);
    expect(result.totalHT).toBe(0);
    expect(result.totalTVA).toBe(0);
    expect(result.totalTTC).toBe(0);
  });

  it("applies 10% TVA correctly", () => {
    const items = [{ quantity: 1, unitPrice: 10000 }];
    const result = computeTotals(items, 10);
    expect(result.totalHT).toBe(10000);
    expect(result.totalTVA).toBe(1000);
    expect(result.totalTTC).toBe(11000);
  });

  it("applies 5.5% TVA correctly", () => {
    const items = [{ quantity: 1, unitPrice: 10000 }];
    const result = computeTotals(items, 5.5);
    expect(result.totalHT).toBe(10000);
    expect(result.totalTVA).toBe(550);
    expect(result.totalTTC).toBe(10550);
  });

  it("handles fractional quantities", () => {
    const items = [{ quantity: 1.5, unitPrice: 10000 }];
    const result = computeTotals(items, 20);
    expect(result.totalHT).toBe(15000);
    expect(result.totalTVA).toBe(3000);
    expect(result.totalTTC).toBe(18000);
  });

  it("rounds TVA amounts", () => {
    const items = [{ quantity: 1, unitPrice: 333 }];
    const result = computeTotals(items, 20);
    expect(result.totalHT).toBe(333);
    expect(result.totalTVA).toBe(67); // Math.round(333 * 0.2) = 67
    expect(result.totalTTC).toBe(400);
  });
});

describe("formatCurrency", () => {
  it("formats cents to EUR", () => {
    const result = formatCurrency(12345);
    // fr-FR format: 123,45 €
    expect(result).toContain("123,45");
    expect(result).toContain("€");
  });

  it("formats 0", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0,00");
    expect(result).toContain("€");
  });

  it("formats large amounts", () => {
    const result = formatCurrency(1000000);
    expect(result).toContain("10");
    expect(result).toContain("000");
    expect(result).toContain("€");
  });
});

describe("isValidTvaRate", () => {
  it("accepts valid french TVA rates", () => {
    expect(isValidTvaRate(20)).toBe(true);
    expect(isValidTvaRate(10)).toBe(true);
    expect(isValidTvaRate(5.5)).toBe(true);
    expect(isValidTvaRate(2.1)).toBe(true);
  });

  it("rejects invalid TVA rates", () => {
    expect(isValidTvaRate(0)).toBe(false);
    expect(isValidTvaRate(15)).toBe(false);
    expect(isValidTvaRate(19.6)).toBe(false);
    expect(isValidTvaRate(25)).toBe(false);
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden")).toBe("base");
    expect(cn("base", true && "visible")).toBe("base visible");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });
});
