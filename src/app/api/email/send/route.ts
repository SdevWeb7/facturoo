import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDocumentEmail } from "@/lib/email";
import { renderToBuffer } from "@react-pdf/renderer";
import { DevisDocument } from "@/components/pdf/DevisDocument";
import { FactureDocument } from "@/components/pdf/FactureDocument";
import { createElement, type ReactElement } from "react";
import { checkRateLimit, emailRateLimit } from "@/lib/rate-limit";
import { logAction } from "@/lib/logger";

const SendEmailSchema = z.object({
  type: z.enum(["devis", "facture"]),
  id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Rate limiting
  if (emailRateLimit) {
    const { limited } = await checkRateLimit(emailRateLimit, session.user.id);
    if (limited) {
      return NextResponse.json(
        { error: "Trop d'emails envoyés. Réessayez plus tard." },
        { status: 429 }
      );
    }
  }

  const body = await request.json();
  const parsed = SendEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { type, id } = parsed.data;

  // Load emitter
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      company: true,
      siret: true,
      address: true,
      phone: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const emitter = {
    name: user.name,
    company: user.company,
    siret: user.siret,
    address: user.address,
    phone: user.phone,
    email: user.email,
  };

  try {
    if (type === "devis") {
      const devis = await prisma.devis.findUnique({
        where: { id, userId: session.user.id },
        include: {
          client: { select: { name: true, email: true, address: true, addressComplement: true, postalCode: true, city: true } },
          items: { orderBy: { order: "asc" } },
        },
      });

      if (!devis) {
        return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
      }

      if (devis.status === "INVOICED") {
        return NextResponse.json(
          { error: "Un devis facturé ne peut pas être envoyé" },
          { status: 400 }
        );
      }

      const docProps = {
        devis: {
          number: devis.number,
          date: devis.date,
          status: devis.status,
          items: devis.items.map((item) => ({
            designation: item.designation,
            quantity: Number(item.quantity),
            unitPrice: item.unitPrice,
            tvaRate: item.tvaRate,
            order: item.order,
          })),
        },
        client: devis.client,
        emitter,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfBuffer = await renderToBuffer(
        createElement(DevisDocument, docProps) as ReactElement<any>
      );

      await sendDocumentEmail({
        to: devis.client.email,
        subject: `Devis ${devis.number} - ${emitter.company || emitter.name}`,
        text: `Bonjour ${devis.client.name},\n\nVeuillez trouver ci-joint le devis ${devis.number}.\n\nCordialement,\n${emitter.company || emitter.name}`,
        pdfBuffer: Buffer.from(pdfBuffer),
        pdfFilename: `${devis.number}.pdf`,
      });

      // Mark devis as SENT if currently DRAFT
      if (devis.status === "DRAFT") {
        await prisma.devis.update({
          where: { id },
          data: { status: "SENT" },
        });
      }

      logAction("email.devisSent", session.user.id, {
        devisId: id,
        to: devis.client.email,
      });

      return NextResponse.json({ success: true });
    }

    // Facture
    const facture = await prisma.facture.findUnique({
      where: { id, userId: session.user.id },
      include: {
        client: { select: { name: true, email: true, address: true, addressComplement: true, postalCode: true, city: true } },
        items: { orderBy: { order: "asc" } },
      },
    });

    if (!facture) {
      return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
    }

    const docProps = {
      facture: {
        number: facture.number,
        date: facture.date,
        items: facture.items.map((item) => ({
          designation: item.designation,
          quantity: Number(item.quantity),
          unitPrice: item.unitPrice,
          tvaRate: item.tvaRate,
          order: item.order,
        })),
      },
      client: facture.client,
      emitter,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      createElement(FactureDocument, docProps) as ReactElement<any>
    );

    await sendDocumentEmail({
      to: facture.client.email,
      subject: `Facture ${facture.number} - ${emitter.company || emitter.name}`,
      text: `Bonjour ${facture.client.name},\n\nVeuillez trouver ci-joint la facture ${facture.number}.\n\nCordialement,\n${emitter.company || emitter.name}`,
      pdfBuffer: Buffer.from(pdfBuffer),
      pdfFilename: `${facture.number}.pdf`,
    });

    logAction("email.factureSent", session.user.id, {
      factureId: id,
      to: facture.client.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);

    let message = "Erreur lors de l'envoi de l'email.";
    if (error instanceof Error) {
      if (error.message.includes("Invalid login") || error.message.includes("EAUTH")) {
        message = "Échec d'authentification SMTP. Vérifiez vos identifiants email (SMTP_USER / SMTP_PASS) dans la configuration.";
      } else if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
        message = "Impossible de se connecter au serveur email. Vérifiez SMTP_HOST et SMTP_PORT.";
      } else if (error.message.includes("EENVELOPE") || error.message.includes("No recipients")) {
        message = "Adresse email du destinataire invalide.";
      }
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
