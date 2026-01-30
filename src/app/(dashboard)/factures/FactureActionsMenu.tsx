"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, FileDown, Mail, Eye, CircleCheck, Trash2 } from "lucide-react";
import { markFactureAsPaid, deleteFacture } from "@/actions/factures";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FactureActionsMenuProps {
  factureId: string;
  status: string;
}

export function FactureActionsMenu({ factureId, status }: FactureActionsMenuProps) {
  const [pending, startTransition] = useTransition();
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSendEmail() {
    if (!confirm("Envoyer cette facture par email au client ?")) return;
    setSendStatus("sending");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "facture", id: factureId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'envoi");
        setSendStatus("idle");
        return;
      }
      setSendStatus("sent");
      window.location.reload();
    } catch {
      alert("Erreur réseau");
      setSendStatus("idle");
    }
  }

  function handleDelete() {
    if (!confirm("Supprimer cette facture ?")) return;
    startTransition(async () => {
      const result = await deleteFacture(factureId);
      if (result && !result.success) {
        alert(result.error);
      }
    });
  }

  function handleMarkPaid() {
    startTransition(async () => {
      const result = await markFactureAsPaid(factureId);
      if (result && !result.success) {
        alert(result.error);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 p-0" disabled={pending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a
            href={`/api/pdf/facture/${factureId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileDown />
            Télécharger PDF
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSendEmail}
          disabled={sendStatus !== "idle"}
        >
          <Mail />
          {sendStatus === "sending" ? "Envoi..." : sendStatus === "sent" ? "Envoyé" : "Envoyer par email"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/factures/${factureId}`}>
            <Eye />
            Voir le détail
          </Link>
        </DropdownMenuItem>

        {status === "PENDING" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMarkPaid}>
              <CircleCheck className="text-success" />
              <span className="text-success">Marquer encaissée</span>
            </DropdownMenuItem>
          </>
        )}

        {status !== "PAID" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
