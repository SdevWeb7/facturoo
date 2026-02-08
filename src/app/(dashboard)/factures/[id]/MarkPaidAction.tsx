"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { MarkPaidDialog } from "../MarkPaidDialog";

export function MarkPaidAction({ factureId }: { factureId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-success/30 text-success hover:bg-success/10 hover:text-success"
        onClick={() => setOpen(true)}
      >
        <CheckCircle2 className="h-4 w-4" />
        Marquer encaissée
      </Button>
      <MarkPaidDialog
        factureId={factureId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
