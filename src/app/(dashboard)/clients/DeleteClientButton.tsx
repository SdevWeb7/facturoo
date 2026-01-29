"use client";

import { deleteClient } from "@/actions/clients";
import { useTransition } from "react";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Supprimer ce client ? Ses devis et factures seront aussi supprimés.")) {
      return;
    }
    startTransition(() => {
      deleteClient(clientId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="ml-4 font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
    >
      {pending ? "..." : "Supprimer"}
    </button>
  );
}
