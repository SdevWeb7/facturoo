"use client";

import { useTransition } from "react";
import { markFactureAsPaid } from "@/actions/factures";
import { Button } from "@/components/ui/button";

export function MarkPaidButton({ factureId }: { factureId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await markFactureAsPaid(factureId);
        });
      }}
    >
      {isPending ? "..." : "Encaisser"}
    </Button>
  );
}
