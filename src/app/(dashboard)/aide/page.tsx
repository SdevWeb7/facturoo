import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const faqs = [
  {
    question: "Comment créer un devis ou une facture ?",
    answer:
      "Depuis le menu, cliquez sur « Devis » ou « Factures », puis sur le bouton « Nouveau ». Remplissez les informations et enregistrez.",
  },
  {
    question: "Comment transformer un devis en facture ?",
    answer:
      "Ouvrez un devis au statut « Envoyé » et cliquez sur « Convertir en facture ». Les données sont reprises automatiquement.",
  },
  {
    question: "Comment envoyer un document par email ?",
    answer:
      "Depuis la page d'un devis ou d'une facture, cliquez sur « Envoyer par email ». Le PDF est généré et envoyé en pièce jointe.",
  },
  {
    question: "Comment modifier mon profil ou mes coordonnées ?",
    answer:
      "Rendez-vous dans « Paramètres » depuis le menu. Vous pouvez y modifier votre nom, entreprise, SIRET et adresse.",
  },
  {
    question: "Comment passer au plan Pro ?",
    answer:
      "Depuis « Paramètres », cliquez sur « Passer au Pro ». Le paiement est sécurisé via Stripe.",
  },
  {
    question: "Comment exporter mes données ?",
    answer:
      "Cliquez sur « Export » dans le menu pour télécharger vos documents. L'export comptable complet est disponible avec le plan Pro.",
  },
];

export default async function AideDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || "Utilisateur";
  const userEmail = session.user.email || "";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Aide</h1>

      {/* FAQ rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
          <CardDescription>
            Retrouvez rapidement les réponses aux questions courantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold marker:content-[''] list-none">
                  {faq.question}
                  <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de contact */}
      <Card>
        <CardHeader>
          <CardTitle>Nous contacter</CardTitle>
          <CardDescription>
            Je lis et réponds personnellement à chaque message envoyé ici.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ContactForm userName={userName} userEmail={userEmail} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
