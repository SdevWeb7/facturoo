"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { deleteClient } from "@/actions/clients";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientActionsMenuProps {
  clientId: string;
}

export function ClientActionsMenu({ clientId }: ClientActionsMenuProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Supprimer ce client ? Ses devis et factures seront aussi supprimés.")) {
      return;
    }
    startTransition(() => {
      deleteClient(clientId);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="size-8 p-0" disabled={pending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/clients/${clientId}`}>
            <Eye />
            Voir le détail
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/devis/new?clientId=${clientId}`}>
            <FileText />
            Nouveau devis
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/clients/${clientId}/edit`}>
            <Pencil />
            Modifier
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
