import Link from "next/link";
import { Check } from "lucide-react";

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
          <h1 className="text-4xl font-extrabold text-gray-900">
            Tarifs simples, sans surprise
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            14 jours d&apos;essai gratuit sur tous les plans. Sans carte
            bancaire.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-6 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price} &euro;
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`mt-8 block w-full rounded-md px-4 py-3 text-center text-sm font-medium shadow-sm ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Questions fr&eacute;quentes
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                L&apos;essai est-il vraiment gratuit ?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Oui, 14 jours sans carte bancaire. Vous pouvez cr&eacute;er des
                devis et factures d&egrave;s votre inscription.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Puis-je changer de plan ?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Oui, vous pouvez passer du mensuel &agrave; l&apos;annuel (ou
                inversement) &agrave; tout moment depuis vos param&egrave;tres.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Comment annuler mon abonnement ?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
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
