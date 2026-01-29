"use client";

import { useState } from "react";

interface SendEmailButtonProps {
  type: "devis" | "facture";
  id: string;
  className?: string;
}

export function SendEmailButton({ type, id, className }: SendEmailButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSend() {
    if (!confirm(`Envoyer ce ${type} par email au client ?`)) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'envoi");
        setStatus("error");
        return;
      }

      setStatus("sent");
      // Reload to reflect status change (DRAFT → SENT)
      window.location.reload();
    } catch {
      alert("Erreur réseau");
      setStatus("error");
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={status === "sending" || status === "sent"}
      className={
        className ??
        "ml-4 font-medium text-purple-600 hover:text-purple-500 disabled:opacity-50"
      }
    >
      {status === "sending"
        ? "Envoi..."
        : status === "sent"
          ? "Envoyé"
          : "Envoyer"}
    </button>
  );
}
