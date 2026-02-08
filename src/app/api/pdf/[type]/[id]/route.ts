import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { DevisDocument } from "@/components/pdf/DevisDocument";
import { FactureDocument } from "@/components/pdf/FactureDocument";
import { createElement, type ReactElement } from "react";
import { pdfRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { limited } = await checkRateLimit(pdfRateLimit, `pdf:${session.user.id}`);
  if (limited) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const { type, id } = await params;

  if (type !== "devis" && type !== "facture") {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  // Load emitter (user)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      businessEmail: true,
      company: true,
      siret: true,
      address: true,
      phone: true,
      image: true,
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
    email: user.businessEmail || user.email,
    logoUrl: user.image,
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

      const docProps = {
        devis: {
          number: devis.number,
          date: devis.date,
          status: devis.status,
          notes: devis.notes,
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
      const buffer = await renderToBuffer(
        createElement(DevisDocument, docProps) as ReactElement<any>
      );

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${devis.number}.pdf"`,
        },
      });
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
        notes: facture.notes,
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
    const buffer = await renderToBuffer(
      createElement(FactureDocument, docProps) as ReactElement<any>
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${facture.number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
