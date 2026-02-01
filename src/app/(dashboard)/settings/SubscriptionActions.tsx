"use client";

import { createCheckoutSession, createPortalSession } from "@/actions/subscription";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
          {pending ? "Redirection..." : "G\u00e9rer mon abonnement"}
        </Button>
      ) : (
        <Button
          onClick={handleCheckout}
          disabled={pending}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Sparkles className="h-4 w-4" />
          {pending ? "Redirection..." : "Passer au Pro \u2014 4,90 \u20ac/mois"}
        </Button>
      )}
    </div>
  );
}
