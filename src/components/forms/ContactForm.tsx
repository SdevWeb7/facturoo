"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { sendContact } from "@/actions/contact";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";

interface ContactFormProps {
  userName?: string;
  userEmail?: string;
}

const subjects = [
  "Question générale",
  "Problème technique",
  "Demande de fonctionnalité",
  "Facturation / Abonnement",
  "Autre",
];

export function ContactForm({ userName, userEmail }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendContact, null);
  const searchParams = useSearchParams();
  const defaultSubject = searchParams.get("subject") ?? "";

  useEffect(() => {
    if (window.location.hash === "#contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <form action={formAction} className="space-y-4">
      {state?.success === false && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.success === true && (
        <Alert variant="success">
          <Check className="h-4 w-4" />
          <AlertDescription>Message envoyé ! Nous vous répondrons rapidement.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nom {!userName && "*"}</Label>
          {userName ? (
            <Input
              id="contact-name"
              type="text"
              value={userName}
              disabled
              className="opacity-60"
            />
          ) : (
            <Input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Votre nom"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email {!userEmail && "*"}</Label>
          {userEmail ? (
            <Input
              id="contact-email"
              type="email"
              value={userEmail}
              disabled
              className="opacity-60"
            />
          ) : (
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="votre@email.com"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Sujet *</Label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue={subjects.includes(defaultSubject) ? defaultSubject : ""}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Sélectionnez un sujet</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          placeholder="Décrivez votre demande..."
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
      </div>
    </form>
  );
}
