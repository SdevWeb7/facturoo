"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { actionError, actionSuccess, zodErrorMessage, type ActionResult } from "@/lib/action-utils";

const RegisterSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export async function register(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function requestPasswordReset(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  // TODO: send email with reset link (Phase 11)
  // For now, log the token in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`);
  }

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
