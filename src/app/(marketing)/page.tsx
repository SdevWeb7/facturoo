import Link from "next/link";
import {
  FileText,
  Send,
  CreditCard,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
        <h1 className="animate-fade-in-up text-5xl font-extrabold tracking-tight sm:text-6xl">
          Vos devis et factures
          <br />
          <span className="text-primary">en 2 minutes</span>
        </h1>
        <p className="animate-fade-in-up animate-stagger-2 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          L&apos;outil simple et efficace pour les artisans fran&ccedil;ais.
          Cr&eacute;ez vos devis, envoyez-les par email, convertissez-les en
          factures. Sans prise de t&ecirc;te.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Essayer gratuitement 14 jours</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/pricing">Voir les tarifs</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Sans carte bancaire. Sans engagement.
        </p>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Facturoo centralise la gestion de vos devis et factures dans un
            outil simple, rapide et conforme.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={feature.title} className={`card-hover animate-fade-in-up animate-stagger-${Math.min(i + 1, 5)}`}>
                <CardContent>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <feature.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Pr&ecirc;t &agrave; simplifier votre facturation ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Rejoignez les artisans qui gagnent du temps avec Facturoo.
            14 jours d&apos;essai gratuit, sans engagement.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/register">Commencer maintenant</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
