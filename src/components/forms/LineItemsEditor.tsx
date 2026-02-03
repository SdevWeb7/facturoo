"use client";

import { useState, useEffect, useRef } from "react";
import { formatCurrency, TVA_RATES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface LineItem {
  designation: string;
  quantity: number;
  unitPrice: number; // centimes
  tvaRate: number;   // pourcentage (20, 10, 5.5, 2.1)
}

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  tvaInclusive?: boolean;
}

function euroFromCentimes(centimes: number, tvaInclusive: boolean, tvaRate: number): string {
  if (centimes === 0) return "";
  const euros = tvaInclusive
    ? (centimes * (1 + tvaRate / 100)) / 100
    : centimes / 100;
  return euros.toFixed(2);
}

function centimesFromEuro(euroStr: string, tvaInclusive: boolean, tvaRate: number): number {
  const euros = parseFloat(euroStr);
  if (isNaN(euros) || euros <= 0) return 0;
  return tvaInclusive
    ? Math.round((euros * 100) / (1 + tvaRate / 100))
    : Math.round(euros * 100);
}

function PriceInput({
  value,
  tvaInclusive,
  tvaRate,
  onChange,
  label,
}: {
  value: number;
  tvaInclusive: boolean;
  tvaRate: number;
  onChange: (centimes: number) => void;
  label: string;
}) {
  const [display, setDisplay] = useState(() => euroFromCentimes(value, tvaInclusive, tvaRate));
  const [isFocused, setIsFocused] = useState(false);
  const lastCommittedRef = useRef(value);

  // Sync display when value or TVA settings change (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setDisplay(euroFromCentimes(value, tvaInclusive, tvaRate));
      lastCommittedRef.current = value;
    }
  }, [value, tvaInclusive, tvaRate, isFocused]);

  function handleChange(raw: string) {
    // Normalize: replace comma with dot, strip non-numeric except dot
    const normalized = raw.replace(",", ".").replace(/[^\d.]/g, "");
    setDisplay(normalized);
    // Update parent live for real-time total
    const centimes = centimesFromEuro(normalized, tvaInclusive, tvaRate);
    lastCommittedRef.current = centimes;
    onChange(centimes);
  }

  function handleBlur() {
    setIsFocused(false);
    const centimes = centimesFromEuro(display, tvaInclusive, tvaRate);
    lastCommittedRef.current = centimes;
    onChange(centimes);
    // Format nicely on blur
    setDisplay(centimes === 0 ? "" : euroFromCentimes(centimes, tvaInclusive, tvaRate));
  }

  return (
    <div>
      <Label className="mb-1 text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          value={display}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="0.00"
          className="pr-8"
          required
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          €
        </span>
      </div>
    </div>
  );
}

export function LineItemsEditor({ items, onChange, tvaInclusive = false }: LineItemsEditorProps) {
  function addItem() {
    onChange([...items, { designation: "", quantity: 1, unitPrice: 0, tvaRate: 20 }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: "designation" | "quantity" | "tvaRate", value: string | number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      if (field === "designation") return { ...item, designation: value as string };
      if (field === "quantity") return { ...item, quantity: parseFloat(value as string) || 0 };
      if (field === "tvaRate") return { ...item, tvaRate: value as number };
      return item;
    });
    onChange(updated);
  }

  function updatePrice(index: number, centimes: number) {
    const updated = items.map((item, i) => (i === index ? { ...item, unitPrice: centimes } : item));
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Lignes du devis</Label>
        <Button type="button" variant="secondary" size="sm" onClick={addItem}>
          + Ajouter une ligne
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucune ligne. Cliquez sur &quot;Ajouter une ligne&quot;.
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border bg-muted/50 p-3"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <Label className="mb-1 text-xs text-muted-foreground">
                Désignation
              </Label>
              <Input
                type="text"
                value={item.designation}
                onChange={(e) => updateItem(index, "designation", e.target.value)}
                placeholder="Ex : Main d'œuvre – installation porte"
                required
              />
            </div>
            <div className="sm:col-span-1">
              <Label className="mb-1 text-xs text-muted-foreground">
                Qté
              </Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <PriceInput
                value={item.unitPrice}
                tvaInclusive={tvaInclusive}
                tvaRate={item.tvaRate}
                onChange={(centimes) => updatePrice(index, centimes)}
                label={tvaInclusive ? "P.U. TTC" : "P.U. HT"}
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1 text-xs text-muted-foreground">
                TVA
              </Label>
              <select
                value={item.tvaRate}
                onChange={(e) => updateItem(index, "tvaRate", Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {TVA_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}%
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end sm:col-span-3">
              <div className="w-full">
                <Label className="mb-1 text-xs text-muted-foreground">
                  Total HT
                </Label>
                <div className="rounded-md bg-background px-3 py-2 text-sm font-medium">
                  {formatCurrency(Math.round(item.quantity * item.unitPrice))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-right">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          </div>
        </div>
      ))}

      {/* Hidden inputs for form submission */}
      {items.map((item, index) => (
        <div key={`hidden-${index}`} className="hidden">
          <input type="hidden" name={`items.${index}.designation`} value={item.designation} />
          <input type="hidden" name={`items.${index}.quantity`} value={item.quantity} />
          <input type="hidden" name={`items.${index}.unitPrice`} value={item.unitPrice} />
          <input type="hidden" name={`items.${index}.tvaRate`} value={item.tvaRate} />
        </div>
      ))}
    </div>
  );
}
