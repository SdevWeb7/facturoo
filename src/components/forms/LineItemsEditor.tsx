"use client";

import { formatCurrency } from "@/lib/utils";

export interface LineItem {
  designation: string;
  quantity: number;
  unitPrice: number; // centimes
}

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
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
      if (field === "unitPrice") return { ...item, unitPrice: Math.round(parseFloat(value) * 100) || 0 };
      return item;
    });
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Lignes du devis
        </label>
        <button
          type="button"
          onClick={addItem}
          className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          + Ajouter une ligne
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-400">
          Aucune ligne. Cliquez sur &quot;Ajouter une ligne&quot;.
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label className="mb-1 block text-xs text-gray-500">
                Désignation
              </label>
              <input
                type="text"
                name={`items.${index}.designation`}
                value={item.designation}
                onChange={(e) => updateItem(index, "designation", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Description du poste"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-500">
                Quantité
              </label>
              <input
                type="number"
                name={`items.${index}.quantity`}
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs text-gray-500">
                Prix unitaire HT
              </label>
              <input
                type="number"
                name={`items.${index}.unitPrice`}
                value={(item.unitPrice / 100).toFixed(2)}
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="flex items-end sm:col-span-2">
              <div className="w-full">
                <label className="mb-1 block text-xs text-gray-500">
                  Total HT
                </label>
                <div className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700">
                  {formatCurrency(Math.round(item.quantity * item.unitPrice))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-xs font-medium text-red-600 hover:text-red-500"
            >
              Supprimer la ligne
            </button>
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
