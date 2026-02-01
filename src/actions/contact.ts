"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
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
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContact(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return actionError("Non autorisé");
  }

  const { limited } = await checkRateLimit(emailRateLimit, session.user.id);
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

  const userName = session.user.name || "Utilisateur";
  const userEmail = session.user.email;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@facturoo.fr",
      to: process.env.SMTP_FROM || "noreply@facturoo.fr",
      replyTo: userEmail,
      subject: `[Contact] ${parsed.data.subject}`,
      text: `Nouveau message de ${userName} (${userEmail})\n\nSujet : ${parsed.data.subject}\n\n${parsed.data.message}`,
    });
  } catch {
    return actionError("Erreur lors de l'envoi. Réessayez plus tard.");
  }

  return actionSuccess();
}
