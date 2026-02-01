import { ContactForm } from "@/components/forms/ContactForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
          <ContactForm />
        </CardContent>
      </Card>
    </main>
  );
}
