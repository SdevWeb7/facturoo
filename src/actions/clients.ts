"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { canCreate } from "@/lib/usage";
import { logAction } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  actionError,
  actionSuccess,
  zodErrorMessage,
  type ActionResult,
} from "@/lib/action-utils";

const ClientSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export async function createClient(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const { allowed, current, limit } = await canCreate(session.user.id, "clients");
  if (!allowed) {
    return actionError(
      `Limite de ${limit} clients atteinte (${current}/${limit}). Passez au plan Pro pour en créer davantage.`
    );
  }

  const parsed = ClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  const client = await prisma.client.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  logAction("client.created", session.user.id, { clientId: client.id });
  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const parsed = ClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  await prisma.client.update({
    where: { id, userId: session.user.id },
    data: parsed.data,
  });

  logAction("client.updated", session.user.id, { clientId: id });
  revalidatePath("/clients");
  redirect("/clients");
}

export async function deleteClient(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  await prisma.client.delete({
    where: { id, userId: session.user.id },
  });

  logAction("client.deleted", session.user.id, { clientId: id });
  revalidatePath("/clients");
  return actionSuccess();
}
