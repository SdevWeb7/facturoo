"use client";

import { deleteDevis } from "@/actions/devis";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function DeleteDevisButton({ devisId }: { devisId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Supprimer ce devis ?")) return;
    startTransition(() => {
      deleteDevis(devisId);
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
