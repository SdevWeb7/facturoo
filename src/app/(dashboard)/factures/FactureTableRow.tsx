"use client";

import { useRouter } from "next/navigation";
import { FactureActionsMenu } from "./FactureActionsMenu";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface FactureTableRowProps {
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

export function FactureTableRow({ facture }: FactureTableRowProps) {
  const router = useRouter();
  const statusInfo = STATUS_BADGE_VARIANT[facture.status];

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => router.push(`/factures/${facture.id}`)}
    >
      <TableCell className="font-medium">
        {facture.number}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(facture.date).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {facture.client.name}
      </TableCell>
      <TableCell>
        <Badge variant={statusInfo?.variant ?? "default"}>
          {statusInfo?.label ?? facture.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(facture.totalTTC)}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <FactureActionsMenu factureId={facture.id} status={facture.status} />
      </TableCell>
    </TableRow>
  );
}
