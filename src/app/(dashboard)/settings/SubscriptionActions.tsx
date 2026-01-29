"use client";

import { createCheckoutSession, createPortalSession } from "@/actions/subscription";
import { useTransition } from "react";
import { PLANS } from "@/lib/stripe";

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
        <button
          onClick={handlePortal}
          disabled={pending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "Redirection..." : "Gérer mon abonnement"}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choisissez votre formule :
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleCheckout("monthly")}
              disabled={pending}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-center shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <p className="text-sm font-semibold">{PLANS.monthly.name}</p>
              <p className="mt-1 text-lg font-bold text-blue-600">
                {PLANS.monthly.price}
              </p>
            </button>
            <button
              onClick={() => handleCheckout("yearly")}
              disabled={pending}
              className="flex-1 rounded-md border-2 border-blue-600 bg-blue-50 px-4 py-3 text-center shadow-sm hover:bg-blue-100 disabled:opacity-50"
            >
              <p className="text-sm font-semibold">{PLANS.yearly.name}</p>
              <p className="mt-1 text-lg font-bold text-blue-600">
                {PLANS.yearly.price}
              </p>
              <p className="mt-1 text-xs text-green-600 font-medium">
                2 mois offerts
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
