"use client";

import { useActionState, useState } from "react";
import type { ActionResult } from "@/lib/action-utils";
import { LineItemsEditor, type LineItem } from "./LineItemsEditor";
import { computeTotalsPerLine, formatCurrency } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Client {
  id: string;
  name: string;
}

interface FactureFormProps {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  clients: Client[];
  defaultValues?: {
    clientId: string;
    items: LineItem[];
  };
  submitLabel: string;
}

export function FactureForm({
  action,
  clients,
  defaultValues,
  submitLabel,
}: FactureFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [items, setItems] = useState<LineItem[]>(
    defaultValues?.items ?? [{ designation: "", quantity: 1, unitPrice: 0, tvaRate: 20 }]
  );

  const totals = computeTotalsPerLine(items);
  const sortedTvaRates = Object.keys(totals.tvaByRate)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Client */}
      <div className="space-y-2">
        <Label htmlFor="clientId">Client *</Label>
        <select
          id="clientId"
          name="clientId"
          defaultValue={defaultValues?.clientId ?? ""}
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

      {/* Line Items */}
      <LineItemsEditor items={items} onChange={setItems} />

      {/* Totals */}
      <Card>
        <CardContent className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total HT</span>
            <span className="font-medium">{formatCurrency(totals.totalHT)}</span>
          </div>
          {sortedTvaRates.map((rate) => (
            <div key={rate} className="flex justify-between">
              <span className="text-muted-foreground">TVA {rate}%</span>
              <span className="font-medium">{formatCurrency(totals.tvaByRate[rate])}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between pt-1">
            <span className="font-semibold">Total TTC</span>
            <span className="font-semibold">
              {formatCurrency(totals.totalTTC)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Envoi..." : submitLabel}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Les modifications seront enregistr&eacute;es imm&eacute;diatement.
        </p>
      </div>
    </form>
  );
}
