import Link from "next/link";
import {
  FileText,
  Send,
  CreditCard,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Devis professionnels",
    description:
      "Créez des devis en quelques clics avec vos lignes de prestations, TVA et totaux calculés automatiquement.",
  },
  {
    icon: Send,
    title: "Envoi par email",
    description:
      "Envoyez vos devis et factures en PDF directement par email à vos clients, en un clic.",
  },
  {
    icon: CreditCard,
    title: "Conversion en facture",
    description:
      "Transformez un devis accepté en facture instantanément. Numérotation automatique conforme.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description:
      "Fini les tableurs et les modèles Word. Tout est centralisé et accessible en ligne.",
  },
  {
    icon: Shield,
    title: "Conforme",
    description:
      "Numérotation séquentielle, taux TVA légaux français, PDF aux normes pour vos clients.",
  },
  {
    icon: Zap,
    title: "Simple et rapide",
    description:
      "Interface intuitive pensée pour les artisans. Pas besoin de formation comptable.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Vos devis et factures
          <br />
          <span className="text-blue-600">en 2 minutes</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          L&apos;outil simple et efficace pour les artisans fran&ccedil;ais.
          Cr&eacute;ez vos devis, envoyez-les par email, convertissez-les en
          factures. Sans prise de t&ecirc;te.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Essayer gratuitement 14 jours
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Voir les tarifs
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Sans carte bancaire. Sans engagement.
        </p>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Facturoo centralise la gestion de vos devis et factures dans un
            outil simple, rapide et conforme.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Pr&ecirc;t &agrave; simplifier votre facturation ?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Rejoignez les artisans qui gagnent du temps avec Facturoo.
            14 jours d&apos;essai gratuit, sans engagement.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
