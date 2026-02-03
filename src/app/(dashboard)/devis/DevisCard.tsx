"use client";

import { useRouter } from "next/navigation";
import { DevisActionsMenu } from "./DevisActionsMenu";
import { SendDevisButton } from "./SendDevisButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { STATUS_BADGE_VARIANT } from "@/lib/status";

interface DevisCardProps {
  devis: {
    id: string;
    number: string;
    status: string;
    date: Date;
    clientId: string;
    client: { name: string };
    totalTTC: number;
  };
}

export function DevisCard({ devis }: DevisCardProps) {
  const router = useRouter();
  const statusInfo = STATUS_BADGE_VARIANT[devis.status];

  return (
    <Card
      className="p-4 transition-colors hover:bg-muted/50 active:bg-muted cursor-pointer"
      onClick={() => router.push(`/devis/${devis.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{devis.number}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={statusInfo.variant}>
              {statusInfo.label}
            </Badge>
            {devis.status === "DRAFT" && (
              <div onClick={(e) => e.stopPropagation()}>
                <SendDevisButton devisId={devis.id} />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <DevisActionsMenu devisId={devis.id} status={devis.status} />
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{devis.client.name}</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {new Date(devis.date).toLocaleDateString("fr-FR")}
        </span>
        <span className="font-medium">{formatCurrency(devis.totalTTC)}</span>
      </div>
    </Card>
  );
}
