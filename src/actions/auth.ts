"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { actionError, actionSuccess, zodErrorMessage, type ActionResult } from "@/lib/action-utils";
import { authRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
}

const RegisterSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export async function register(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = await getClientIp();
  const { limited } = await checkRateLimit(authRateLimit, `auth:register:${ip}`);
  if (limited) {
    return actionError("Trop de tentatives. Réessayez dans quelques minutes.");
  }

  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return actionError("Un compte existe déjà avec cet email");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return actionSuccess();
}

const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function login(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = await getClientIp();
  const { limited } = await checkRateLimit(authRateLimit, `auth:login:${ip}`);
  if (limited) {
    return actionError("Trop de tentatives. Réessayez dans quelques minutes.");
  }

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // NextAuth throws AuthError on credential failures
    if (error instanceof AuthError) {
      return actionError("Email ou mot de passe incorrect");
    }
    // Everything else (including NEXT_REDIRECT on success) must be re-thrown
    throw error;
  }

  return actionSuccess();
}

const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  company: z.string().optional().default(""),
  siret: z.string().optional().default(""),
  address: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  businessEmail: z.string().email("Email invalide").optional().or(z.literal("")),
});

export async function updateProfile(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.id) {
    return actionError("Non authentifié");
  }

  const parsed = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    siret: formData.get("siret"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    businessEmail: formData.get("businessEmail"),
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  const { name, company, siret, address, phone, businessEmail } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      company: company || null,
      siret: siret || null,
      address: address || null,
      phone: phone || null,
      businessEmail: businessEmail || null,
    },
  });

  revalidatePath("/settings");
  return actionSuccess();
}

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function requestPasswordReset(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = await getClientIp();
  const { limited } = await checkRateLimit(authRateLimit, `auth:reset-request:${ip}`);
  if (limited) {
    return actionError("Trop de tentatives. Réessayez dans quelques minutes.");
  }

  const parsed = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  const { email } = parsed.data;

  // Always return success to not reveal if email exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return actionSuccess();
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] Reset link: ${resetUrl}`);
  }

  // Send password reset email
  try {
    const { sendMail } = await import("@/lib/email");

    await sendMail({
      to: email,
      subject: "Réinitialisation de votre mot de passe — Facturoo",
      text: `Réinitialisez votre mot de passe en cliquant sur ce lien :\n\n${resetUrl}\n\nSi vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.\n\nCe lien expire dans 1 heure.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Réinitialisation de mot de passe</h2>
          <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Réinitialiser mon mot de passe</a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
          <p style="color: #999; font-size: 12px;">Ce lien expire dans 1 heure.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[auth] Failed to send password reset email:", err instanceof Error ? err.message : "Unknown error");
  }

  return actionSuccess();
}

export async function deleteAccount(): Promise<ActionResult> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.id) {
    return actionError("Non authentifié");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true, image: true },
  });

  if (!user) {
    return actionError("Utilisateur introuvable");
  }

  if (user.stripeSubscriptionId) {
    try {
      const { getStripe } = await import("@/lib/stripe");
      await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
    } catch (err) {
      console.error("[auth] Failed to cancel Stripe subscription:", err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Delete logo blob if exists
  if (user.image) {
    try {
      const { del } = await import("@vercel/blob");
      await del(user.image);
    } catch (err) {
      console.error("[auth] Failed to delete logo blob:", err instanceof Error ? err.message : "Unknown error");
    }
  }

  await prisma.user.delete({ where: { id: session.user.id } });

  return actionSuccess();
}

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token manquant"),
  password: z.string().min(8, "8 caractères minimum"),
});

export async function resetPassword(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = await getClientIp();
  const { limited } = await checkRateLimit(authRateLimit, `auth:reset-password:${ip}`);
  if (limited) {
    return actionError("Trop de tentatives. Réessayez dans quelques minutes.");
  }

  const parsed = ResetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  const { token, password } = parsed.data;

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return actionError("Lien expiré ou invalide");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email: record.identifier },
    data: { hashedPassword },
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: record.identifier,
        token,
      },
    },
  });

  return actionSuccess();
}
