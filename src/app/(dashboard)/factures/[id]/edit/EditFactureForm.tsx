"use client";

import { FactureForm } from "@/components/forms/FactureForm";
import { updateFacture } from "@/actions/factures";
import type { ActionResult } from "@/lib/action-utils";
import type { LineItem } from "@/components/forms/LineItemsEditor";

interface EditFactureFormProps {
  factureId: string;
  clients: { id: string; name: string }[];
  defaultValues: {
    clientId: string;
    items: LineItem[];
    notes?: string;
  };
}

export function EditFactureForm({
  factureId,
  clients,
  defaultValues,
}: EditFactureFormProps) {
  const boundAction = updateFacture.bind(null, factureId);

  return (
    <FactureForm
      action={boundAction as (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>}
      clients={clients}
      defaultValues={defaultValues}
      submitLabel="Enregistrer"
    />
  );
}
