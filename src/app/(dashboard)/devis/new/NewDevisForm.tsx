"use client";

import { DevisForm } from "@/components/forms/DevisForm";
import { createDevis } from "@/actions/devis";

interface NewDevisFormProps {
  clients: { id: string; name: string }[];
  defaultClientId?: string;
}

export function NewDevisForm({ clients, defaultClientId }: NewDevisFormProps) {
  return (
    <DevisForm
      action={createDevis}
      clients={clients}
      defaultValues={defaultClientId ? { clientId: defaultClientId, items: [{ designation: "", quantity: 1, unitPrice: 0, tvaRate: 20 }] } : undefined}
      submitLabel="Créer le devis"
    />
  );
}
