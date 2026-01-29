"use client";

import { ClientForm } from "@/components/forms/ClientForm";
import { updateClient } from "@/actions/clients";
import type { ActionResult } from "@/lib/action-utils";

interface EditClientFormProps {
  clientId: string;
  defaultValues: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
  };
}

export function EditClientForm({ clientId, defaultValues }: EditClientFormProps) {
  const boundAction = updateClient.bind(null, clientId);

  return (
    <ClientForm
      action={boundAction as (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>}
      defaultValues={defaultValues}
      submitLabel="Enregistrer"
    />
  );
}
