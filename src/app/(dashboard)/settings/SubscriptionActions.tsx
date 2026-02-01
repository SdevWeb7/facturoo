"use client";

import { createCheckoutSession, createPortalSession } from "@/actions/subscription";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

interface SubscriptionActionsProps {
  hasSubscription: boolean;
  isActive: boolean;
}

export function SubscriptionActions({
  hasSubscription,
  isActive,
}: SubscriptionActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleCheckout() {
    startTransition(() => {
      createCheckoutSession();
    });
  }

  function handlePortal() {
    startTransition(() => {
      createPortalSession();
    });
  }

  return (
    <div className="mt-4">
      {hasSubscription ? (
        <Button
          onClick={handlePortal}
          disabled={pending}
        >
          {pending ? "Redirection..." : "Gérer mon abonnement"}
        </Button>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />Devis et factures illimités</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />Export comptable (CSV, PDF)</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />Envoi par email illimité</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />Clients illimités</li>
          </ul>
          <Button
            onClick={handleCheckout}
            disabled={pending}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            <Sparkles className="h-4 w-4" />
            {pending ? "Redirection..." : "Passer au Pro — 9,90 €/mois"}
          </Button>
        </div>
      )}
    </div>
  );
}
