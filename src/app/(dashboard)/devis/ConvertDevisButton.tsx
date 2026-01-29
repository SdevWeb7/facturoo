"use client";

import { convertDevisToFacture } from "@/actions/factures";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function ConvertDevisButton({ devisId }: { devisId: string }) {
  const [pending, startTransition] = useTransition();

  function handleConvert() {
    if (!confirm("Convertir ce devis en facture ? Cette action est irréversible.")) return;
    startTransition(() => {
      convertDevisToFacture(devisId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleConvert}
      disabled={pending}
      className="text-green-600 hover:text-green-500"
    >
      {pending ? "..." : "Facturer"}
    </Button>
  );
}
