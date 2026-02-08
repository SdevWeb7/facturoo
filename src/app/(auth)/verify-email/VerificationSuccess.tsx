"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VerificationSuccess() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleContinue() {
    setIsRedirecting(true);
    // Sign out to destroy the stale JWT, then redirect to login with fresh session
    await signOut({ redirectTo: "/login?verified=true" });
  }

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleContinue();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-success/10 p-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Email confirmé !</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre adresse email a été vérifiée avec succès.
          Vous allez être redirigé automatiquement...
        </p>
      </div>

      <Button onClick={handleContinue} disabled={isRedirecting} className="w-full">
        {isRedirecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirection...
          </>
        ) : (
          "Continuer"
        )}
      </Button>
    </div>
  );
}
