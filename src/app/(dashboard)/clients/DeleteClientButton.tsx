"use client";

import { deleteClient } from "@/actions/clients";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
      className="text-destructive hover:text-destructive"
    >
      {pending ? "..." : "Supprimer"}
    </Button>
  );
}
