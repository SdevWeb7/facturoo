"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { canCreate } from "@/lib/usage";
import { logAction } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, actionSuccess, zodErrorMessage, type ActionResult } from "@/lib/action-utils";
import { isValidTvaRate } from "@/lib/utils";

const FactureItemSchema = z.object({
  designation: z.string().min(1, "La désignation est requise"),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  unitPrice: z.coerce.number().int().min(0, "Le prix doit être positif"),
  tvaRate: z.coerce.number().refine(isValidTvaRate, "Taux de TVA invalide"),
});

const FactureSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  items: z.array(FactureItemSchema).min(1, "Au moins une ligne est requise"),
});

async function generateFactureNumber(userId: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `FAC-${year}-`;

  const lastFacture = await prisma.facture.findFirst({
    where: {
      userId,
      number: { startsWith: prefix },
    },
    orderBy: { number: "desc" },
  });

  let nextNum = 1;
  if (lastFacture) {
    const lastNum = parseInt(lastFacture.number.replace(prefix, ""), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(3, "0")}`;
}

export async function convertDevisToFacture(
  devisId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const { allowed, current, limit } = await canCreate(session.user.id, "factures");
  if (!allowed) {
    return actionError(
      `Limite de ${limit} factures atteinte (${current}/${limit}). Passez au plan Pro pour en créer davantage.`
    );
  }

  const devis = await prisma.devis.findUnique({
    where: { id: devisId },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!devis || devis.userId !== session.user.id) {
    return actionError("Devis introuvable");
  }

  if (devis.status === "INVOICED") {
    return actionError("Ce devis a déjà été converti en facture");
  }

  const number = await generateFactureNumber(session.user.id);

  // Transaction: create facture + copy items + update devis status
  await prisma.$transaction(async (tx) => {
    const facture = await tx.facture.create({
      data: {
        number,
        userId: session.user.id,
        clientId: devis.clientId,
        items: {
          create: devis.items.map((item) => ({
            designation: item.designation,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tvaRate: item.tvaRate,
            order: item.order,
          })),
        },
      },
    });

    await tx.devis.update({
      where: { id: devisId },
      data: {
        status: "INVOICED",
        factureId: facture.id,
      },
    });
  });

  logAction("devis.convertedToFacture", session.user.id, {
    devisId,
    factureNumber: number,
  });

  revalidatePath("/devis");
  revalidatePath("/factures");
  redirect("/factures");
}

export async function markFactureAsPaid(
  factureId: string,
  paymentDate?: Date,
  paymentMethod?: "VIREMENT" | "CHEQUE" | "ESPECES" | "CB" | "AUTRE"
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const facture = await prisma.facture.findUnique({
    where: { id: factureId },
  });

  if (!facture || facture.userId !== session.user.id) {
    return actionError("Facture introuvable");
  }

  if (facture.status === "PAID") {
    return actionError("Cette facture est déjà encaissée");
  }

  await prisma.facture.update({
    where: { id: factureId },
    data: {
      status: "PAID",
      paymentDate: paymentDate ?? new Date(),
      paymentMethod: paymentMethod ?? null,
    },
  });

  logAction("facture.markedAsPaid", session.user.id, {
    factureId,
    factureNumber: facture.number,
    paymentDate,
    paymentMethod,
  });

  revalidatePath("/factures");
  revalidatePath(`/factures/${factureId}`);
  return actionSuccess();
}

export async function updateFacture(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  // Check ownership and status guard
  const existing = await prisma.facture.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing || existing.userId !== session.user.id) {
    return actionError("Facture introuvable");
  }

  if (existing.status === "PAID") {
    return actionError("Une facture encaissée ne peut plus être modifiée");
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

  const parsed = FactureSchema.safeParse({
    clientId: formData.get("clientId"),
    items,
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
    prisma.factureItem.deleteMany({ where: { factureId: id } }),
    // Update facture + recreate items
    prisma.facture.update({
      where: { id },
      data: {
        clientId: parsed.data.clientId,
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

  logAction("facture.updated", session.user.id, { factureId: id });
  revalidatePath("/factures");
  revalidatePath(`/factures/${id}`);
  redirect("/factures");
}

export async function deleteFacture(
  factureId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return actionError("Non autorisé");

  const facture = await prisma.facture.findUnique({
    where: { id: factureId },
    include: { devis: true },
  });

  if (!facture || facture.userId !== session.user.id) {
    return actionError("Facture introuvable");
  }

  if (facture.status === "PAID") {
    return actionError("Une facture encaissée ne peut pas être supprimée");
  }

  await prisma.$transaction(async (tx) => {
    // Soft delete the facture
    await tx.facture.update({
      where: { id: factureId },
      data: { deletedAt: new Date() },
    });

    // If linked to a devis, revert devis status to SENT
    if (facture.devis) {
      await tx.devis.update({
        where: { id: facture.devis.id },
        data: { status: "SENT", factureId: null },
      });
    }
  });

  logAction("facture.deleted", session.user.id, {
    factureId,
    factureNumber: facture.number,
  });

  revalidatePath("/factures");
  revalidatePath("/devis");
  return actionSuccess();
}
