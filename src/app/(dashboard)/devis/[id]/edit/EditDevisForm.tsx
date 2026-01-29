"use client";

import { DevisForm } from "@/components/forms/DevisForm";
import { updateDevis } from "@/actions/devis";
import type { ActionResult } from "@/lib/action-utils";
import type { LineItem } from "@/components/forms/LineItemsEditor";

interface EditDevisFormProps {
  devisId: string;
  clients: { id: string; name: string }[];
  defaultValues: {
    clientId: string;
    tvaRate: number;
    items: LineItem[];
  };
}

export function EditDevisForm({
  devisId,
  clients,
  defaultValues,
}: EditDevisFormProps) {
  const boundAction = updateDevis.bind(null, devisId);

  return (
    <DevisForm
      action={boundAction as (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>}
      clients={clients}
      defaultValues={defaultValues}
      submitLabel="Enregistrer"
    />
  );
}
