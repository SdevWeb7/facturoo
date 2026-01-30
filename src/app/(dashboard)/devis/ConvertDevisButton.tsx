"use client";

import { convertDevisToFacture } from "@/actions/factures";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function ConvertDevisButton({ devisId }: { devisId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConvert() {
    if (!confirm("Convertir ce devis en facture ? Cette action est irréversible.")) return;
    setError(null);
    startTransition(async () => {
      const result = await convertDevisToFacture(devisId);
      if (result && !result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleConvert}
        disabled={pending}
        className="text-green-600 hover:text-green-500"
      >
        {pending ? "..." : "Facturer"}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
