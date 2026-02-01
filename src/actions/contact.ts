"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { sendMail } from "@/lib/email";
import { emailRateLimit, checkRateLimit } from "@/lib/rate-limit";
import {
  actionError,
  actionSuccess,
  zodErrorMessage,
  type ActionResult,
} from "@/lib/action-utils";

const ContactSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  name: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
});

export async function sendContact(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  let userName: string;
  let userEmail: string;
  let rateLimitKey: string;

  if (session?.user?.id && session.user.email) {
    userName = session.user.name || "Utilisateur";
    userEmail = session.user.email;
    rateLimitKey = session.user.id;
  } else {
    const name = formData.get("name");
    const email = formData.get("email");

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return actionError("Le nom est requis");
    }
    if (!email || typeof email !== "string") {
      return actionError("L'email est requis");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return actionError("Email invalide");
    }

    userName = name.trim();
    userEmail = email.trim();
    rateLimitKey = `public:${userEmail}`;
  }

  const { limited } = await checkRateLimit(emailRateLimit, rateLimitKey);
  if (limited) {
    return actionError("Trop de messages envoyés. Réessayez plus tard.");
  }

  const parsed = ContactSchema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  try {
    await sendMail({
      to: process.env.SMTP_FROM || "support@facturoo.app",
      replyTo: userEmail,
      subject: `[Contact] ${parsed.data.subject}`,
      text: `Nouveau message de ${userName} (${userEmail})\n\nSujet : ${parsed.data.subject}\n\n${parsed.data.message}`,
    });
  } catch {
    return actionError("Erreur lors de l'envoi. Réessayez plus tard.");
  }

  return actionSuccess();
}
