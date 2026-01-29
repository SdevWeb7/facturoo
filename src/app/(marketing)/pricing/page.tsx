import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Mensuel",
    price: "9,90",
    period: "/mois",
    description: "Pour tester sans engagement.",
    features: [
      "Devis et factures illimités",
      "Envoi par email avec PDF",
      "Conversion devis → facture",
      "Numérotation conforme",
      "Taux TVA français",
      "Export PDF professionnel",
    ],
    cta: "Commencer l'essai gratuit",
    highlighted: false,
  },
  {
    name: "Annuel",
    price: "99",
    period: "/an",
    badge: "2 mois offerts",
    description: "Le meilleur rapport qualité-prix.",
    features: [
      "Tout le plan mensuel",
      "Devis et factures illimités",
      "Envoi par email avec PDF",
      "Conversion devis → facture",
      "Numérotation conforme",
      "Support prioritaire",
    ],
    cta: "Commencer l'essai gratuit",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">
            Tarifs simples, sans surprise
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            14 jours d&apos;essai gratuit sur tous les plans. Sans carte
            bancaire.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative border-2 border-primary bg-primary/5 shadow-lg"
                  : "relative"
              }
            >
              {plan.badge && (
                <Badge variant="invoiced" className="absolute -top-3 right-6">
                  {plan.badge}
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div>
                  <span className="text-4xl font-extrabold">
                    {plan.price} &euro;
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "secondary"}
                  asChild
                >
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-center text-2xl font-bold">
            Questions fr&eacute;quentes
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-6">
            <div>
              <h3 className="font-semibold">
                L&apos;essai est-il vraiment gratuit ?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Oui, 14 jours sans carte bancaire. Vous pouvez cr&eacute;er des
                devis et factures d&egrave;s votre inscription.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                Puis-je changer de plan ?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Oui, vous pouvez passer du mensuel &agrave; l&apos;annuel (ou
                inversement) &agrave; tout moment depuis vos param&egrave;tres.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                Comment annuler mon abonnement ?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                En un clic depuis la page Param&egrave;tres. Votre acc&egrave;s
                reste actif jusqu&apos;à la fin de la p&eacute;riode pay&eacute;e.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
