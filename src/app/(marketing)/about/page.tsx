import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire de Facturoo, l'outil de devis et factures créé par un développeur passionné pour simplifier la vie des artisans français.",
  alternates: {
    canonical: "https://facturoo.vercel.app/about",
  },
};

const values = [
  {
    icon: Zap,
    title: "Simplicité",
    description:
      "Pas de fonctionnalités inutiles. Juste ce dont vous avez besoin pour créer des devis et factures en quelques clics.",
  },
  {
    icon: Shield,
    title: "Conformité",
    description:
      "Numérotation séquentielle, mentions légales, TVA multi-taux : tout est pensé pour respecter la réglementation française.",
  },
  {
    icon: Heart,
    title: "Accessibilité",
    description:
      "Un prix juste à 9,90€/mois, sans engagement. Parce que les bons outils ne devraient pas coûter une fortune.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "À propos de Facturoo",
  description:
    "Facturoo est un outil de devis et factures créé pour simplifier la gestion administrative des artisans français.",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Facturoo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "9.90",
      priceCurrency: "EUR",
    },
  },
};

export default function AboutPage() {
  return (
    <main className="py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-6">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            L&apos;histoire de Facturoo
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Un outil simple, créé par un développeur qui en avait marre de voir
            des artisans perdre du temps sur Excel.
          </p>
        </div>

        {/* Story */}
        <div className="mt-16 space-y-8 text-muted-foreground leading-relaxed">
          <div className="rounded-2xl border bg-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Pourquoi Facturoo ?
            </h2>
            <p>
              J&apos;ai vu trop d&apos;artisans talentueux perdre des heures sur
              des tableurs Excel bricolés, des modèles Word qui se décalent, ou
              des logiciels usines à gaz à 50€/mois.
            </p>
            <p className="mt-4">
              Leur métier, c&apos;est de créer, de construire, de réparer.{" "}
              <strong className="text-foreground">
                Pas de se battre avec un logiciel de facturation.
              </strong>
            </p>
            <p className="mt-4">
              Facturoo est né de cette frustration : créer un outil qui fait une
              chose bien — des devis et factures professionnels, conformes à la
              loi française, en quelques clics.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Ma promesse
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>
                  <strong className="text-foreground">Rester simple.</strong>{" "}
                  Pas de fonctionnalités gadget. Chaque bouton a sa raison
                  d&apos;être.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>
                  <strong className="text-foreground">Prix honnête.</strong>{" "}
                  9,90€/mois, c&apos;est moins qu&apos;un café par semaine. Et un
                  plan gratuit pour démarrer.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>
                  <strong className="text-foreground">Écouter.</strong> Chaque
                  retour compte. Facturoo évolue avec vos besoins.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Nos valeurs
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Prêt à simplifier votre gestion ?</h2>
          <p className="mt-3 text-muted-foreground">
            Rejoignez les artisans qui ont choisi la simplicité.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
