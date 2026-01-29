"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);

  if (state?.success) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Email envoyé</h1>
        <p className="text-sm text-muted-foreground">
          Si un compte existe avec cette adresse, vous recevrez un lien de
          réinitialisation dans quelques minutes.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-primary hover:text-primary/80"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <form action={action} className="space-y-4">
        {state?.success === false && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Envoi..." : "Envoyer le lien"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
