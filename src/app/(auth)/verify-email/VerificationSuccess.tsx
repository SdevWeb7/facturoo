"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VerificationSuccess() {
  const router = useRouter();
  const { update } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleContinue() {
    setIsRedirecting(true);
    // Update the session to refresh the JWT token with new emailVerified status
    await update();
    // Small delay to ensure token is refreshed
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/dashboard");
  }

  // Auto-redirect after a few seconds
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
          "Accéder à mon compte"
        )}
      </Button>
    </div>
  );
}
