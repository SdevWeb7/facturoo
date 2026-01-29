import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { PLANS } from "@/lib/stripe";
import { SubscriptionActions } from "./SubscriptionActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nom</span>
              <p className="font-medium">{user.name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Entreprise</span>
              <p className="font-medium">{user.company || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">SIRET</span>
              <p className="font-medium">{user.siret || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Adresse</span>
              <p className="font-medium">{user.address || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Téléphone</span>
              <p className="font-medium">{user.phone || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {isTrialing && (
              <Alert>
                <AlertDescription>
                  Période d&apos;essai active jusqu&apos;au{" "}
                  <strong>
                    {new Date(user.trialEndsAt!).toLocaleDateString("fr-FR")}
                  </strong>
                </AlertDescription>
              </Alert>
            )}

            {user.stripeSubscriptionId && currentPlan && (
              <Alert>
                <AlertDescription>
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
                </AlertDescription>
              </Alert>
            )}

            {!isActive && !isTrialing && (
              <Alert variant="destructive">
                <AlertDescription>
                  Aucun abonnement actif. Souscrivez pour continuer à utiliser
                  Facturoo.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <SubscriptionActions
            hasSubscription={!!user.stripeSubscriptionId}
            isActive={isActive}
          />
        </CardContent>
      </Card>
    </div>
  );
}
