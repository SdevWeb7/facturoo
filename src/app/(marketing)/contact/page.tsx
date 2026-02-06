import { Suspense } from "react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe Facturoo. Une question, un retour ou une suggestion ? Nous répondons personnellement à chaque message.",
  alternates: {
    canonical: "https://facturoo.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Nous contacter</h1>
        <p className="mt-4 text-muted-foreground">
          Je réponds personnellement à chaque message.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envoyez-nous un message</CardTitle>
          <CardDescription>
            Une question, un retour, une suggestion ? N&apos;hésitez pas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ContactForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
