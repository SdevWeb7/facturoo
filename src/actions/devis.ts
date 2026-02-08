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
  zodErrorMessage,
  type ActionResult,
} from "@/lib/action-utils";
import { isValidTvaRate } from "@/lib/utils";

const DevisItemSchema = z.object({
  designation: z.string().min(1, "La désignation est requise"),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  unitPrice: z.coerce.number().int().min(0, "Le prix doit être positif"),
  tvaRate: z.coerce.number().refine(isValidTvaRate, "Taux de TVA invalide"),
});

const DevisSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  items: z.array(DevisItemSchema).min(1, "Au moins une ligne est requise"),
  notes: z.string().optional(),
});

async function generateDevisNumber(userId: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DEV-${year}-`;

  const lastDevis = await prisma.devis.findFirst({
    where: {
      userId,
      number: { startsWith: prefix },
    },
    orderBy: { number: "desc" },
  });

  let nextNum = 1;
  if (lastDevis) {
    const lastNum = parseInt(lastDevis.number.replace(prefix, ""), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(3, "0")}`;
}

export async function createDevis(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const { allowed, current, limit } = await canCreate(session.user.id, "devis");
  if (!allowed) {
    return actionError(
      `Limite de ${limit} devis atteinte (${current}/${limit}). Passez au plan Pro pour en créer davantage.`
    );
  }

  // Parse items from FormData
  const items: { designation: string; quantity: number; unitPrice: number; tvaRate: number }[] = [];
  let i = 0;
  while (formData.get(`items.${i}.designation`) !== null) {
    items.push({
      designation: formData.get(`items.${i}.designation`) as string,
      quantity: Number(formData.get(`items.${i}.quantity`)),
      unitPrice: Number(formData.get(`items.${i}.unitPrice`)),
      tvaRate: Number(formData.get(`items.${i}.tvaRate`)),
    });
    i++;
  }

  const notes = (formData.get("notes") as string) || undefined;

  const parsed = DevisSchema.safeParse({
    clientId: formData.get("clientId"),
    items,
    notes,
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  // Verify client belongs to the authenticated user
  const client = await prisma.client.findUnique({
    where: { id: parsed.data.clientId, userId: session.user.id },
  });
  if (!client) return actionError("Client introuvable");

  const number = await generateDevisNumber(session.user.id);

  const devis = await prisma.devis.create({
    data: {
      number,
      userId: session.user.id,
      clientId: parsed.data.clientId,
      notes: parsed.data.notes || null,
      items: {
        create: parsed.data.items.map((item, idx) => ({
          designation: item.designation,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tvaRate: Math.round(item.tvaRate * 100), // Convert percentage to centièmes (20 -> 2000)
          order: idx,
        })),
      },
    },
  });

  logAction("devis.created", session.user.id, { devisId: devis.id, number });
  revalidatePath("/devis");
  redirect("/devis");
}

export async function updateDevis(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  // Check ownership and status guard
  const existing = await prisma.devis.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return actionError("Devis introuvable");
  }

  if (existing.status === "INVOICED") {
    return actionError("Un devis facturé ne peut plus être modifié");
  }

  // Parse items from FormData
  const items: { designation: string; quantity: number; unitPrice: number; tvaRate: number }[] = [];
  let i = 0;
  while (formData.get(`items.${i}.designation`) !== null) {
    items.push({
      designation: formData.get(`items.${i}.designation`) as string,
      quantity: Number(formData.get(`items.${i}.quantity`)),
      unitPrice: Number(formData.get(`items.${i}.unitPrice`)),
      tvaRate: Number(formData.get(`items.${i}.tvaRate`)),
    });
    i++;
  }

  const notes = (formData.get("notes") as string) || undefined;

  const parsed = DevisSchema.safeParse({
    clientId: formData.get("clientId"),
    items,
    notes,
  });

  if (!parsed.success) {
    return actionError(zodErrorMessage(parsed.error));
  }

  // Verify client belongs to the authenticated user
  const client = await prisma.client.findUnique({
    where: { id: parsed.data.clientId, userId: session.user.id },
  });
  if (!client) return actionError("Client introuvable");

  await prisma.$transaction([
    // Delete existing items
    prisma.devisItem.deleteMany({ where: { devisId: id } }),
    // Update devis + recreate items
    prisma.devis.update({
      where: { id },
      data: {
        clientId: parsed.data.clientId,
        notes: parsed.data.notes || null,
        items: {
          create: parsed.data.items.map((item, idx) => ({
            designation: item.designation,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tvaRate: Math.round(item.tvaRate * 100), // Convert percentage to centièmes (20 -> 2000)
            order: idx,
          })),
        },
      },
    }),
  ]);

  logAction("devis.updated", session.user.id, { devisId: id });
  revalidatePath("/devis");
  redirect("/devis");
}

export async function deleteDevis(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const existing = await prisma.devis.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return actionError("Devis introuvable");
  }

  if (existing.status === "INVOICED") {
    return actionError("Un devis facturé ne peut pas être supprimé");
  }

  await prisma.devis.delete({ where: { id } });

  logAction("devis.deleted", session.user.id, { devisId: id });
  revalidatePath("/devis");
  return { success: true, data: undefined };
}
