"use client";

import { useTransition } from "react";
import { FileCheck, Loader2 } from "lucide-react";
import { convertDevisToFacture } from "@/actions/factures";
import { Button } from "@/components/ui/button";

interface DevisDetailActionsProps {
  devisId: string;
  status: string;
}

export function DevisDetailActions({ devisId, status }: DevisDetailActionsProps) {
  const [pending, startTransition] = useTransition();
  const isLocked = status === "INVOICED";

  function handleConvert() {
    if (!confirm("Convertir ce devis en facture ? Cette action est irréversible.")) return;
    startTransition(async () => {
      const result = await convertDevisToFacture(devisId);
      if (result && !result.success) {
        alert(result.error);
      }
    });
  }

  if (isLocked) return null;

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleConvert}
      disabled={pending}
      className="bg-success text-white hover:bg-success/90"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileCheck className="h-4 w-4" />
      )}
      Facturer
    </Button>
  );
}
