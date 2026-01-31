import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
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
    monthlyEquiv: "8,25 €/mois",
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

const faqs = [
  {
    question: "L'essai est-il vraiment gratuit ?",
    answer:
      "Oui, 14 jours sans carte bancaire. Vous pouvez créer des devis et factures dès votre inscription.",
  },
  {
    question: "Puis-je changer de plan ?",
    answer:
      "Oui, vous pouvez passer du mensuel à l'annuel (ou inversement) à tout moment depuis vos paramètres.",
  },
  {
    question: "Comment annuler mon abonnement ?",
    answer:
      "En un clic depuis la page Paramètres. Votre accès reste actif jusqu'à la fin de la période payée.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Vos données sont hébergées en Europe sur des serveurs sécurisés, conformément au RGPD.",
  },
];

export default function PricingPage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
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
                  ? "relative border-2 border-primary bg-primary/5 shadow-warm-lg card-hover-premium scale-[1.02]"
                  : "relative card-hover-premium"
              }
            >
              {plan.badge && (
                <Badge variant="default" className="absolute -top-3 right-6">
                  {plan.badge}
                </Badge>
              )}
              {plan.highlighted && (
                <Badge variant="secondary" className="absolute -top-3 left-6 text-xs">
                  Recommandé
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
                  {plan.monthlyEquiv && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      soit {plan.monthlyEquiv}
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-8 w-full ${plan.highlighted ? "bg-gradient-to-r from-primary to-primary-hover" : ""}`}
                  variant={plan.highlighted ? "default" : "secondary"}
                  size="lg"
                  asChild
                >
                  <Link href="/register">
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Questions fr&eacute;quentes
          </h2>
          <div className="mx-auto mt-10 max-w-3xl divide-y">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between font-semibold marker:content-[''] list-none">
                  {faq.question}
                  <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
