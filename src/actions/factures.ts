"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";
import { logAction } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, type ActionResult } from "@/lib/action-utils";

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

  try {
    await checkSubscription(session.user.id);
  } catch {
    return actionError("Abonnement requis");
  }

  const devis = await prisma.devis.findUnique({
    where: { id: devisId },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!devis || devis.userId !== session.user.id) {
    return actionError("Devis introuvable");
  }

  if (devis.status === "DRAFT") {
    return actionError("Le devis doit d'abord être envoyé avant d'être converti en facture");
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
