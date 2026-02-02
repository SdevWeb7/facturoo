import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Send,
  CreditCard,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Server,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Logiciel devis et factures pour artisans | Facturoo",
  description:
    "Créez vos devis et factures en 2 minutes. Logiciel en ligne simple, conforme et gratuit pour les artisans français. PDF, envoi email, numérotation automatique.",
  alternates: {
    canonical: "https://facturoo.vercel.app",
  },
};

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

const steps = [
  {
    number: "1",
    title: "Créez votre compte",
    description: "Inscription en 30 secondes. Ajoutez vos informations d'entreprise.",
  },
  {
    number: "2",
    title: "Rédigez vos devis",
    description: "Ajoutez vos clients, créez vos devis avec lignes de prestations et TVA.",
  },
  {
    number: "3",
    title: "Facturez en un clic",
    description: "Convertissez vos devis en factures et envoyez-les par email avec PDF.",
  },
];

const trustItems: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  link?: string;
}[] = [
  {
    icon: CheckCircle2,
    title: "Conforme normes FR",
    description: "Numérotation séquentielle, mentions légales obligatoires",
  },
  {
    icon: Server,
    title: "Données en Europe",
    description: "Hébergement sécurisé, conforme RGPD",
  },
  {
    icon: Headphones,
    title: "Support réactif",
    description: "Je lis et réponds personnellement à chaque message",
    link: "/contact",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Facturoo",
    url: "https://facturoo.vercel.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Logiciel en ligne de devis et factures pour artisans français. Créez, envoyez et gérez vos documents commerciaux en toute conformité.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        name: "Gratuit",
        description: "5 devis, 5 factures, 5 clients",
      },
      {
        "@type": "Offer",
        price: "9.90",
        priceCurrency: "EUR",
        name: "Pro",
        description: "Devis et factures illimités, export comptable",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Facturoo",
    url: "https://facturoo.vercel.app",
    logo: "https://facturoo.vercel.app/favicon_facturoo.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@facturoo.app",
      contactType: "customer service",
      availableLanguage: "French",
    },
  },
];

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
          <Badge variant="secondary" className="animate-fade-in-up mb-6 text-sm px-4 py-1.5">
            Gratuit — 5 devis offerts
          </Badge>

          <h1 className="animate-fade-in-up animate-stagger-2 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Vos devis et factures
            <br />
            <span className="text-gradient">en 2 minutes</span>
          </h1>

          <p className="animate-fade-in-up animate-stagger-3 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            L&apos;outil simple et efficace pour les artisans fran&ccedil;ais.
            Cr&eacute;ez vos devis, envoyez-les par email, convertissez-les en
            factures. Sans prise de t&ecirc;te.
          </p>

          <div className="animate-fade-in-up animate-stagger-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-hover hover:shadow-warm-lg">
              <Link href="/register">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </div>

          <p className="animate-fade-in-up animate-stagger-5 mt-4 text-sm text-muted-foreground">
            Gratuit jusqu&apos;&agrave; 5 devis. Sans carte bancaire.
          </p>

          {/* Dashboard preview screenshot */}
          <div className="animate-fade-in-up animate-stagger-5 mt-16 mx-auto max-w-4xl">
            <div className="rounded-2xl border bg-card shadow-warm-lg p-2 sm:p-3" style={{ transform: "perspective(1200px) rotateX(2deg)" }}>
              <Image
                src="/images/dashboard-preview.png"
                alt="Aperçu du tableau de bord Facturoo"
                width={1200}
                height={680}
                priority
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section className="border-t bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Comment &ccedil;a marche
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Trois étapes simples pour gérer vos devis et factures.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className={`relative text-center animate-fade-in-up animate-stagger-${Math.min(i + 1, 5)}`}>
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white text-xl font-bold shadow-warm">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] border-t-2 border-dashed border-border" />
                )}
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Facturoo centralise la gestion de vos devis et factures dans un
            outil simple, rapide et conforme.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={feature.title} className={`card-hover-premium animate-fade-in-up animate-stagger-${Math.min(i + 1, 5)}`}>
                <CardContent>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
                    <feature.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Vous &ecirc;tes entre de bonnes mains
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10">
                  <item.icon className="h-6 w-6 text-success" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                {item.link && (
                  <Link href={item.link} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                    Nous contacter →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pr&ecirc;t &agrave; simplifier votre facturation ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Rejoignez les artisans qui gagnent du temps avec Facturoo.
            Gratuit pour commencer, Pro quand vous grandissez.
          </p>
          <Button size="lg" className="mt-8 bg-gradient-to-r from-primary to-primary-hover hover:shadow-warm-lg" asChild>
            <Link href="/register">
              Commencer maintenant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Pas de carte bancaire requise. 5 devis gratuits.
          </p>
        </div>
      </section>
    </main>
  );
}
