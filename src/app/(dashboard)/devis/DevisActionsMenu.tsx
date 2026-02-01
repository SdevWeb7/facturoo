"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, FileDown, Mail, Pencil, FileCheck, Trash2 } from "lucide-react";
import { deleteDevis } from "@/actions/devis";
import { convertDevisToFacture } from "@/actions/factures";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DevisActionsMenuProps {
  devisId: string;
  status: string;
}

export function DevisActionsMenu({ devisId, status }: DevisActionsMenuProps) {
  const [pending, startTransition] = useTransition();
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const isLocked = status === "INVOICED";

  async function handleSendEmail() {
    if (!confirm("Envoyer ce devis par email au client ?")) return;
    setSendStatus("sending");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "devis", id: devisId }),
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
    if (!confirm("Supprimer ce devis ?")) return;
    startTransition(() => {
      deleteDevis(devisId);
    });
  }

  function handleConvert() {
    if (!confirm("Convertir ce devis en facture ? Cette action est irréversible.")) return;
    startTransition(async () => {
      const result = await convertDevisToFacture(devisId);
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
            href={`/api/pdf/devis/${devisId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileDown />
            Télécharger PDF
          </a>
        </DropdownMenuItem>

        {!isLocked && (
          <DropdownMenuItem
            onClick={handleSendEmail}
            disabled={sendStatus !== "idle"}
          >
            <Mail />
            {sendStatus === "sending" ? "Envoi..." : sendStatus === "sent" ? "Envoyé" : "Envoyer par email"}
          </DropdownMenuItem>
        )}

        {!isLocked && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/devis/${devisId}/edit`}>
                <Pencil />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleConvert}>
              <FileCheck className="text-success" />
              <span className="text-success">Facturer ce devis</span>
            </DropdownMenuItem>
          </>
        )}

        {!isLocked && (
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
