import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { PLANS } from "@/lib/stripe";
import { SubscriptionActions } from "./SubscriptionActions";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      company: true,
      siret: true,
      address: true,
      phone: true,
      trialEndsAt: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) redirect("/login");

  const isActive = await hasActiveSubscription(session.user.id);
  const isTrialing =
    !user.stripeSubscriptionId &&
    user.trialEndsAt &&
    new Date(user.trialEndsAt) > new Date();

  const currentPlan = user.stripePriceId
    ? Object.values(PLANS).find((p) => p.priceId === user.stripePriceId)
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Profile */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Profil</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nom</span>
            <p className="font-medium">{user.name || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Entreprise</span>
            <p className="font-medium">{user.company || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">SIRET</span>
            <p className="font-medium">{user.siret || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">Adresse</span>
            <p className="font-medium">{user.address || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">Téléphone</span>
            <p className="font-medium">{user.phone || "—"}</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Abonnement</h2>

        <div className="mt-4">
          {isTrialing && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
              Période d&apos;essai active jusqu&apos;au{" "}
              <strong>
                {new Date(user.trialEndsAt!).toLocaleDateString("fr-FR")}
              </strong>
            </div>
          )}

          {user.stripeSubscriptionId && currentPlan && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              Abonnement <strong>{currentPlan.name}</strong> actif
              {user.stripeCurrentPeriodEnd && (
                <>
                  {" "}— prochain renouvellement le{" "}
                  <strong>
                    {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString(
                      "fr-FR"
                    )}
                  </strong>
                </>
              )}
            </div>
          )}

          {!isActive && !isTrialing && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Aucun abonnement actif. Souscrivez pour continuer à utiliser
              Facturoo.
            </div>
          )}
        </div>

        <SubscriptionActions
          hasSubscription={!!user.stripeSubscriptionId}
          isActive={isActive}
        />
      </div>
    </div>
  );
}
