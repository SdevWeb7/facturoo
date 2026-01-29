"use client";

import { useActionState, useState } from "react";
import type { ActionResult } from "@/lib/action-utils";
import { LineItemsEditor, type LineItem } from "./LineItemsEditor";
import { TVA_RATES, computeTotals, formatCurrency } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
}

interface DevisFormProps {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  clients: Client[];
  defaultValues?: {
    clientId: string;
    tvaRate: number;
    items: LineItem[];
  };
  submitLabel: string;
}

export function DevisForm({
  action,
  clients,
  defaultValues,
  submitLabel,
}: DevisFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [items, setItems] = useState<LineItem[]>(
    defaultValues?.items ?? [{ designation: "", quantity: 1, unitPrice: 0 }]
  );
  const [tvaRate, setTvaRate] = useState(defaultValues?.tvaRate ?? 20);

  const totals = computeTotals(items, tvaRate);

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {/* Client */}
      <div>
        <label htmlFor="clientId" className="mb-1 block text-sm font-medium text-gray-700">
          Client *
        </label>
        <select
          id="clientId"
          name="clientId"
          defaultValue={defaultValues?.clientId ?? ""}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled>
            Sélectionner un client
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* TVA Rate */}
      <div>
        <label htmlFor="tvaRate" className="mb-1 block text-sm font-medium text-gray-700">
          Taux de TVA
        </label>
        <select
          id="tvaRate"
          name="tvaRate"
          value={tvaRate}
          onChange={(e) => setTvaRate(Number(e.target.value))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TVA_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate}%
            </option>
          ))}
        </select>
      </div>

      {/* Line Items */}
      <LineItemsEditor items={items} onChange={setItems} />

      {/* Totals */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total HT</span>
            <span className="font-medium">{formatCurrency(totals.totalHT)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">TVA ({tvaRate}%)</span>
            <span className="font-medium">{formatCurrency(totals.totalTVA)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1">
            <span className="font-semibold text-gray-900">Total TTC</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totals.totalTTC)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Envoi..." : submitLabel}
      </button>
    </form>
  );
}
