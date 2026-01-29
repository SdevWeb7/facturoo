"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { resetPassword } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, null);

  if (state?.success) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Mot de passe modifié</h1>
        <p className="text-sm text-muted-foreground">
          Votre mot de passe a été réinitialisé avec succès.
        </p>
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Lien invalide</h1>
        <p className="text-sm text-muted-foreground">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-medium text-primary hover:text-primary/80"
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choisissez votre nouveau mot de passe
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        {state?.success === false && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">8 caractères minimum</p>
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Modification..." : "Modifier le mot de passe"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-sm text-muted-foreground">Chargement...</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
