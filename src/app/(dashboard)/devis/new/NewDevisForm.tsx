"use client";

import { DevisForm } from "@/components/forms/DevisForm";
import { createDevis } from "@/actions/devis";

interface NewDevisFormProps {
  clients: { id: string; name: string }[];
  defaultClientId?: string;
  defaultNotes?: string;
}

export function NewDevisForm({ clients, defaultClientId, defaultNotes }: NewDevisFormProps) {
  const defaultValues = {
    clientId: defaultClientId || "",
    items: [{ designation: "", quantity: 1, unitPrice: 0, tvaRate: 20 }],
    notes: defaultNotes || "",
  };

  return (
    <DevisForm
      action={createDevis}
      clients={clients}
      defaultValues={defaultClientId || defaultNotes ? defaultValues : undefined}
      submitLabel="Créer le devis"
    />
  );
}
