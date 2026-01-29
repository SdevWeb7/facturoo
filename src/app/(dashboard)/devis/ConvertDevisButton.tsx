"use client";

import { convertDevisToFacture } from "@/actions/factures";
import { useTransition } from "react";

export function ConvertDevisButton({ devisId }: { devisId: string }) {
  const [pending, startTransition] = useTransition();

  function handleConvert() {
    if (!confirm("Convertir ce devis en facture ? Cette action est irréversible.")) return;
    startTransition(() => {
      convertDevisToFacture(devisId);
    });
  }

  return (
    <button
      onClick={handleConvert}
      disabled={pending}
      className="ml-4 font-medium text-green-600 hover:text-green-500 disabled:opacity-50"
    >
      {pending ? "..." : "Facturer"}
    </button>
  );
}
