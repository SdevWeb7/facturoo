"use client";

import { createCheckoutSession, createPortalSession } from "@/actions/subscription";
import { useTransition } from "react";
import { PLANS } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionActionsProps {
  hasSubscription: boolean;
  isActive: boolean;
}

export function SubscriptionActions({
  hasSubscription,
  isActive,
}: SubscriptionActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleCheckout(plan: "monthly" | "yearly") {
    startTransition(() => {
      createCheckoutSession(plan);
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
          <p className="text-sm text-muted-foreground">
            Choisissez votre formule :
          </p>
          <div className="flex gap-3">
            <Card
              className="flex-1 cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => !pending && handleCheckout("monthly")}
            >
              <CardContent className="text-center">
                <p className="text-sm font-semibold">{PLANS.monthly.name}</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {PLANS.monthly.price}
                </p>
              </CardContent>
            </Card>
            <Card
              className="flex-1 cursor-pointer border-2 border-primary bg-primary/5 transition-colors hover:bg-primary/10"
              onClick={() => !pending && handleCheckout("yearly")}
            >
              <CardContent className="text-center">
                <p className="text-sm font-semibold">{PLANS.yearly.name}</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {PLANS.yearly.price}
                </p>
                <Badge variant="invoiced" className="mt-1">
                  2 mois offerts
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
