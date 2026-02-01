import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getUserUsage, FREE_LIMITS } from "@/lib/usage";
import { PLANS } from "@/lib/stripe";
import { SubscriptionActions } from "./SubscriptionActions";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, Sparkles } from "lucide-react";

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
      stripeCancelAtPeriodEnd: true,
    },
  });

  if (!user) redirect("/login");

  const isActive = await hasActiveSubscription(session.user.id);
  const isTrialing =
    !user.stripeSubscriptionId &&
    user.trialEndsAt &&
    new Date(user.trialEndsAt) > new Date();

  const isPro = !!user.stripeSubscriptionId && isActive;
  const isFree = !isActive && !isTrialing;

  const currentPlan = user.stripePriceId
    ? Object.values(PLANS).find((p) => p.priceId === user.stripePriceId)
    : null;

  const usage = await getUserUsage(session.user.id);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Param\u00e8tres</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Vos informations personnelles et professionnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              name: user.name || "",
              email: user.email,
              company: user.company || "",
              siret: user.siret || "",
              address: user.address || "",
              phone: user.phone || "",
            }}
          />
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            G\u00e9rez votre formule et votre facturation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status card */}
          <div className="rounded-xl border p-5">
            {isTrialing && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">P\u00e9riode d&apos;essai</p>
                    <Badge variant="sent">Active</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Votre essai est actif jusqu&apos;au{" "}
                    <strong>
                      {new Date(user.trialEndsAt!).toLocaleDateString("fr-FR")}
                    </strong>
                  </p>
                </div>
              </div>
            )}

            {user.stripeSubscriptionId && currentPlan && (
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${user.stripeCancelAtPeriodEnd ? "bg-destructive/10" : "bg-success/10"}`}>
                  {user.stripeCancelAtPeriodEnd ? (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{currentPlan.name}</p>
                    <Badge variant={user.stripeCancelAtPeriodEnd ? "destructive" : "invoiced"}>
                      {user.stripeCancelAtPeriodEnd ? "Annul\u00e9" : "Actif"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {user.stripeCancelAtPeriodEnd
                      ? `Actif jusqu'au ${new Date(user.stripeCurrentPeriodEnd!).toLocaleDateString("fr-FR")}`
                      : `Prochain renouvellement le ${user.stripeCurrentPeriodEnd ? new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("fr-FR") : "\u2014"}`}
                  </p>
                </div>
              </div>
            )}

            {user.stripeSubscriptionId && !currentPlan && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Abonnement actif</p>
                    <Badge variant="invoiced">Actif</Badge>
                  </div>
                  {user.stripeCurrentPeriodEnd && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Prochain renouvellement le{" "}
                      <strong>
                        {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("fr-FR")}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            )}

            {isFree && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Plan Gratuit</p>
                    <Badge variant="secondary">Gratuit</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Passez au Pro pour cr\u00e9er en illimit\u00e9 et acc\u00e9der aux stats avanc\u00e9es.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Usage for free users */}
          {!isPro && (
            <div className="mt-4 rounded-xl border p-5">
              <p className="text-sm font-semibold mb-3">Utilisation</p>
              <div className="space-y-3">
                {(["clients", "devis", "factures"] as const).map((type) => {
                  const current = usage[type];
                  const limit = FREE_LIMITS[type];
                  const pct = Math.min((current / limit) * 100, 100);
                  const label = type.charAt(0).toUpperCase() + type.slice(1);
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{label}</span>
                        <span className="text-muted-foreground">
                          {current}/{limit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <SubscriptionActions
            hasSubscription={!!user.stripeSubscriptionId}
            isActive={isActive}
          />
        </CardContent>
      </Card>
    </div>
  );
}
