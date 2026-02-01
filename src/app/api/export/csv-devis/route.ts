import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pdfRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { hasActiveSubscription } from "@/lib/subscription";
import { computeTotals, formatCurrency } from "@/lib/utils";

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

  const where: Record<string, unknown> = {
    userId: session.user.id,
  };

  if (from || to) {
    where.date = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const devis = await prisma.devis.findMany({
    where,
    include: { client: true, items: true },
    orderBy: { date: "asc" },
  });

  const BOM = "\uFEFF";
  const header = "Numéro;Date;Client;Statut;HT;TVA;TTC";

  const rows = devis.map((d) => {
    const items = d.items.map((i) => ({
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice,
    }));
    const totals = computeTotals(items, Number(d.tvaRate));
    return [
      d.number,
      new Date(d.date).toLocaleDateString("fr-FR"),
      `"${d.client.name}"`,
      d.status,
      formatCurrency(totals.totalHT),
      formatCurrency(totals.totalTVA),
      formatCurrency(totals.totalTTC),
    ].join(";");
  });

  const csv = BOM + header + "\n" + rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="devis-export.csv"`,
    },
  });
}
