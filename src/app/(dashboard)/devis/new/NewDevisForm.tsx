"use client";

import { DevisForm } from "@/components/forms/DevisForm";
import { createDevis } from "@/actions/devis";

interface NewDevisFormProps {
  clients: { id: string; name: string }[];
}

export function NewDevisForm({ clients }: NewDevisFormProps) {
  return (
    <DevisForm
      action={createDevis}
      clients={clients}
      submitLabel="Créer le devis"
    />
  );
}
