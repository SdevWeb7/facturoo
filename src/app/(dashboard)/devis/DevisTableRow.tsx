"use client";

import { useRouter } from "next/navigation";
import { DevisActionsMenu } from "./DevisActionsMenu";
import { SendDevisButton } from "./SendDevisButton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface DevisTableRowProps {
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

export function DevisTableRow({ devis }: DevisTableRowProps) {
  const router = useRouter();
  const statusInfo = STATUS_BADGE_VARIANT[devis.status];

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => router.push(`/devis/${devis.id}`)}
    >
      <TableCell className="font-medium">
        {devis.number}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(devis.date).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {devis.client.name}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
          {devis.status === "DRAFT" && (
            <SendDevisButton devisId={devis.id} />
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(devis.totalTTC)}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DevisActionsMenu devisId={devis.id} status={devis.status} />
      </TableCell>
    </TableRow>
  );
}
