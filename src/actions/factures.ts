"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { canCreate } from "@/lib/usage";
import { logAction } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";

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
        tvaRate: devis.tvaRate,
        userId: session.user.id,
        clientId: devis.clientId,
        items: {
          create: devis.items.map((item) => ({
            designation: item.designation,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
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
  factureId: string
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
    data: { status: "PAID" },
  });

  logAction("facture.markedAsPaid", session.user.id, {
    factureId,
    factureNumber: facture.number,
  });

  revalidatePath("/factures");
  return actionSuccess();
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
