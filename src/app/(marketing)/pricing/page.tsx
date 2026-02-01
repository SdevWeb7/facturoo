import Link from "next/link";
import { Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: " €",
    description: "Pour d\u00e9marrer sans engagement.",
    features: [
      { text: "5 devis", included: true },
      { text: "5 factures", included: true },
      { text: "5 clients", included: true },
      { text: "G\u00e9n\u00e9ration PDF", included: true },
      { text: "Envoi par email", included: true },
      { text: "Dashboard basique", included: true },
      { text: "Export comptable", included: false },
      { text: "Dashboard avanc\u00e9", included: false },
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "4,90",
    period: " \u20ac/mois",
    badge: "Recommand\u00e9",
    description: "Pour les artisans qui se d\u00e9veloppent.",
    features: [
      { text: "Devis illimit\u00e9s", included: true },
      { text: "Factures illimit\u00e9es", included: true },
      { text: "Clients illimit\u00e9s", included: true },
      { text: "G\u00e9n\u00e9ration PDF", included: true },
      { text: "Envoi par email", included: true },
      { text: "Dashboard avanc\u00e9", included: true },
      { text: "Export comptable", included: true },
      { text: "Support prioritaire", included: true },
    ],
    cta: "Passer au Pro",
    highlighted: true,
  },
];

const faqs = [
  {
    question: "Le plan gratuit est-il vraiment gratuit ?",
    answer:
      "Oui, sans carte bancaire. Vous pouvez cr\u00e9er jusqu\u2019\u00e0 5 devis, 5 factures et 5 clients gratuitement, sans limite de dur\u00e9e.",
  },
  {
    question: "Que se passe-t-il si j\u2019atteins la limite gratuite ?",
    answer:
      "Vos donn\u00e9es restent accessibles. Vous pouvez toujours modifier et supprimer vos documents existants, mais la cr\u00e9ation de nouveaux sera bloqu\u00e9e jusqu\u2019au passage au Pro.",
  },
  {
    question: "Comment annuler mon abonnement Pro ?",
    answer:
      "En un clic depuis la page Param\u00e8tres. Votre acc\u00e8s Pro reste actif jusqu\u2019\u00e0 la fin de la p\u00e9riode pay\u00e9e, puis vous repassez en gratuit.",
  },
  {
    question: "Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es ?",
    answer:
      "Oui. Vos donn\u00e9es sont h\u00e9berg\u00e9es en Europe sur des serveurs s\u00e9curis\u00e9s, conform\u00e9ment au RGPD.",
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
            Commencez gratuitement avec 5 devis et 5 factures.
            Passez au Pro quand vous en avez besoin.
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

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div>
                  <span className="text-4xl font-extrabold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                      )}
                      <span className={`text-sm ${!feature.included ? "text-muted-foreground/60" : ""}`}>
                        {feature.text}
                      </span>
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
