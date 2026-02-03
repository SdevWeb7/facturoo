"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw, LogOut } from "lucide-react";
import { resendVerificationEmail } from "@/actions/auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerificationPendingPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleResend() {
    setMessage(null);
    startTransition(async () => {
      const result = await resendVerificationEmail();
      if (result.success) {
        setMessage({ type: "success", text: "Email envoyé ! Vérifiez votre boîte de réception." });
      } else {
        setMessage({ type: "error", text: result.error || "Une erreur est survenue" });
      }
    });
  }

  async function handleSignOut() {
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Confirmez votre email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Un email de confirmation a été envoyé à votre adresse.
          Cliquez sur le lien pour activer votre compte.
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleResend}
          disabled={pending}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
          {pending ? "Envoi en cours..." : "Renvoyer l'email"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Vous n&apos;avez pas reçu l&apos;email ? Vérifiez votre dossier spam.
        </p>
      </div>

      <div className="pt-4 border-t">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
