"use client";

import { useRouter } from "next/navigation";
import { FactureActionsMenu } from "./FactureActionsMenu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { STATUS_BADGE_VARIANT } from "@/lib/status";

interface FactureCardProps {
  facture: {
    id: string;
    number: string;
    status: string;
    date: Date;
    clientId: string;
    client: { name: string };
    totalTTC: number;
  };
}

export function FactureCard({ facture }: FactureCardProps) {
  const router = useRouter();
  const statusInfo = STATUS_BADGE_VARIANT[facture.status];

  return (
    <Card
      className="p-4 transition-colors hover:bg-muted/50 active:bg-muted cursor-pointer"
      onClick={() => router.push(`/factures/${facture.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{facture.number}</p>
          <div className="mt-1">
            <Badge variant={statusInfo?.variant ?? "default"}>
              {statusInfo?.label ?? facture.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <FactureActionsMenu factureId={facture.id} status={facture.status} />
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{facture.client.name}</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {new Date(facture.date).toLocaleDateString("fr-FR")}
        </span>
        <span className="font-medium">{formatCurrency(facture.totalTTC)}</span>
      </div>
    </Card>
  );
}
