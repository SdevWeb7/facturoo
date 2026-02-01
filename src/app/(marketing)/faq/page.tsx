import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Qu'est-ce que Facturoo ?",
    answer:
      "Facturoo est un logiciel en ligne de devis et factures conçu spécifiquement pour les artisans français. Il vous permet de créer, gérer et envoyer vos documents commerciaux en toute conformité.",
  },
  {
    question: "Le plan gratuit est-il vraiment gratuit ?",
    answer:
      "Oui, sans carte bancaire. Vous pouvez créer jusqu'à 5 devis, 5 factures et 5 clients gratuitement, sans limite de durée.",
  },
  {
    question: "Que se passe-t-il si j'atteins la limite gratuite ?",
    answer:
      "Vos données restent accessibles. Vous pouvez toujours modifier et supprimer vos documents existants, mais la création de nouveaux sera bloquée jusqu'au passage au Pro.",
  },
  {
    question: "Comment créer un devis ou une facture ?",
    answer:
      "Depuis votre tableau de bord, cliquez sur « Nouveau devis » ou « Nouvelle facture ». Remplissez les informations client, ajoutez vos lignes de prestation, puis enregistrez ou envoyez directement par email.",
  },
  {
    question: "Comment transformer un devis en facture ?",
    answer:
      "Ouvrez un devis au statut « Envoyé », puis cliquez sur « Convertir en facture ». Les informations du devis sont automatiquement reprises dans la nouvelle facture.",
  },
  {
    question: "Comment envoyer un document par email ?",
    answer:
      "Depuis la page d'un devis ou d'une facture, cliquez sur « Envoyer par email ». Le PDF est généré automatiquement et envoyé en pièce jointe à l'adresse email de votre client.",
  },
  {
    question: "La numérotation est-elle conforme ?",
    answer:
      "Oui. Les devis sont numérotés DEV-YYYY-NNN et les factures FAC-YYYY-NNN, avec une numérotation séquentielle par année, conforme à la réglementation française.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Vos données sont hébergées en Europe sur des serveurs sécurisés, conformément au RGPD. Les connexions sont chiffrées en HTTPS et l'authentification est sécurisée.",
  },
  {
    question: "Comment annuler mon abonnement Pro ?",
    answer:
      "En un clic depuis la page Paramètres. Votre accès Pro reste actif jusqu'à la fin de la période payée, puis vous repassez en gratuit sans perte de données.",
  },
  {
    question: "Puis-je exporter mes données ?",
    answer:
      "Oui. La fonctionnalité d'export vous permet de télécharger vos documents au format PDF. Avec le plan Pro, vous accédez également à l'export comptable complet.",
  },
];

export default function AidePage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Centre d&apos;aide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Retrouvez les réponses aux questions les plus fréquentes sur Facturoo.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 divide-y">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between font-semibold marker:content-[''] list-none">
                {faq.question}
                <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border bg-muted/50 p-8 text-center">
          <h2 className="text-xl font-bold">Vous ne trouvez pas votre réponse ?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous pour nous contacter directement depuis votre espace.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/login">
              Se connecter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
