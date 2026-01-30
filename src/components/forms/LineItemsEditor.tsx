"use client";

import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface LineItem {
  designation: string;
  quantity: number;
  unitPrice: number; // centimes
}

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  tvaInclusive?: boolean;
  tvaRate?: number;
}

export function LineItemsEditor({ items, onChange, tvaInclusive = false, tvaRate = 20 }: LineItemsEditorProps) {
  function addItem() {
    onChange([...items, { designation: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      if (field === "designation") return { ...item, designation: value };
      if (field === "quantity") return { ...item, quantity: parseFloat(value) || 0 };
      if (field === "unitPrice") {
        const euros = parseFloat(value) || 0;
        const centimes = tvaInclusive
          ? Math.round((euros * 100) / (1 + tvaRate / 100))
          : Math.round(euros * 100);
        return { ...item, unitPrice: centimes };
      }
      return item;
    });
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
            <div className="sm:col-span-5">
              <Label className="mb-1 text-xs text-muted-foreground">
                Désignation
              </Label>
              <Input
                type="text"
                value={item.designation}
                onChange={(e) => updateItem(index, "designation", e.target.value)}
                placeholder="Description du poste"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1 text-xs text-muted-foreground">
                Quantité
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
            <div className="sm:col-span-3">
              <Label className="mb-1 text-xs text-muted-foreground">
                {tvaInclusive ? "Prix unitaire TTC" : "Prix unitaire HT"}
              </Label>
              <Input
                type="number"
                value={
                  tvaInclusive
                    ? (item.unitPrice * (1 + tvaRate / 100) / 100).toFixed(2)
                    : (item.unitPrice / 100).toFixed(2)
                }
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="flex items-end sm:col-span-2">
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
              className="text-xs text-destructive hover:text-destructive"
            >
              Supprimer la ligne
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
        </div>
      ))}
    </div>
  );
}
