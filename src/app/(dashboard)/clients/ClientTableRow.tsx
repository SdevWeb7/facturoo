"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import { ClientActionsMenu } from "./ClientActionsMenu";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface ClientTableRowProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export function ClientTableRow({ client }: ClientTableRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => router.push(`/clients/${client.id}`)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar name={client.name} size="sm" />
          <span className="font-medium">{client.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {client.email}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {client.phone || "—"}
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
            <Link href={`/devis/new?clientId=${client.id}`}>
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline ml-1">Devis</span>
            </Link>
          </Button>
          <ClientActionsMenu clientId={client.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}
