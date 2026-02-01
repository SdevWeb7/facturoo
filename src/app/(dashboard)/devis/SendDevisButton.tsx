"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SendDevisButtonProps {
  devisId: string;
}

export function SendDevisButton({ devisId }: SendDevisButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSend(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Envoyer ce devis par email au client ?")) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "devis", id: devisId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'envoi");
        setStatus("idle");
        return;
      }
      setStatus("sent");
      window.location.reload();
    } catch {
      alert("Erreur réseau");
      setStatus("idle");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 gap-1 px-2 text-xs text-primary hover:text-primary"
      onClick={handleSend}
      disabled={status !== "idle"}
    >
      {status === "sending" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Send className="h-3 w-3" />
      )}
      {status === "sending" ? "Envoi…" : status === "sent" ? "Envoyé !" : "Envoyer"}
    </Button>
  );
}
