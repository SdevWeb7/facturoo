import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pdfRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { hasActiveSubscription } from "@/lib/subscription";
import { computeTotals } from "@/lib/utils";
import { renderToBuffer } from "@react-pdf/renderer";
import { RecapMensuelDocument } from "@/components/pdf/RecapMensuelDocument";
import { createElement, type ReactElement } from "react";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { limited } = await checkRateLimit(pdfRateLimit, `export:${session.user.id}`);
  if (limited) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const active = await hasActiveSubscription(session.user.id);
  if (!active) {
    return NextResponse.json({ error: "Abonnement requis" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, company: true, siret: true },
  });

  const where: Record<string, unknown> = {
    userId: session.user.id,
    deletedAt: null,
  };

  if (from || to) {
    where.date = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const factures = await prisma.facture.findMany({
    where,
    include: { client: true, items: true },
    orderBy: { date: "asc" },
  });

  const factureRows = factures.map((f) => {
    const items = f.items.map((i) => ({
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice,
    }));
    const totals = computeTotals(items, Number(f.tvaRate));
    return {
      number: f.number,
      date: f.date,
      clientName: f.client.name,
      tvaRate: Number(f.tvaRate),
      totalHT: totals.totalHT,
      totalTVA: totals.totalTVA,
      totalTTC: totals.totalTTC,
      status: f.status,
    };
  });

  const fromDate = from ? new Date(from) : new Date();
  const toDate = to ? new Date(to) : new Date();

  const docProps = {
    companyName: user?.company || user?.name || "—",
    siret: user?.siret || null,
    from: fromDate,
    to: toDate,
    factures: factureRows,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      createElement(RecapMensuelDocument, docProps) as ReactElement<any>
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="recap-mensuel.pdf"`,
      },
    });
  } catch (error) {
    console.error("Recap PDF generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
