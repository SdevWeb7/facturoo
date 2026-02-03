import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { SendEmailButton } from "@/components/SendEmailButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function FactureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const facture = await prisma.facture.findUnique({
    where: { id, userId: session.user.id, deletedAt: null },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });

  if (!facture) notFound();

  const itemsForCalc = facture.items.map((item) => ({
    quantity: Number(item.quantity),
    unitPrice: item.unitPrice,
  }));
  const totals = computeTotals(itemsForCalc, Number(facture.tvaRate));

  return (
    <div>
      <div className="mb-6">
        <Link href="/factures" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux factures
        </Link>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Facture {facture.number}</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <SendEmailButton
              type="facture"
              id={facture.id}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            />
            <Button asChild>
              <a
                href={`/api/pdf/facture/${facture.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Télécharger le PDF
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Info */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p className="mt-1 text-sm font-medium">{facture.client.name}</p>
              <p className="text-sm text-muted-foreground">{facture.client.email}</p>
              {facture.client.address && (
                <p className="text-sm text-muted-foreground">{facture.client.address}</p>
              )}
              {facture.client.addressComplement && (
                <p className="text-sm text-muted-foreground">{facture.client.addressComplement}</p>
              )}
              {(facture.client.postalCode || facture.client.city) && (
                <p className="text-sm text-muted-foreground">
                  {[facture.client.postalCode, facture.client.city].filter(Boolean).join(" ")}
                </p>
              )}
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="mt-1 text-sm">
                {new Date(facture.date).toLocaleDateString("fr-FR")}
              </p>
              <h3 className="mt-3 text-sm font-medium text-muted-foreground">TVA</h3>
              <p className="mt-1 text-sm">{Number(facture.tvaRate)}%</p>
            </div>
          </div>

          {/* Items table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Désignation</TableHead>
                <TableHead className="text-right">Qté</TableHead>
                <TableHead className="text-right">P.U. HT</TableHead>
                <TableHead className="text-right">Total HT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facture.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {Number(item.quantity)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Math.round(Number(item.quantity) * item.unitPrice))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total HT</span>
                <span className="font-medium">{formatCurrency(totals.totalHT)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TVA ({Number(facture.tvaRate)}%)</span>
                <span className="font-medium">{formatCurrency(totals.totalTVA)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total TTC</span>
                <span className="font-semibold">{formatCurrency(totals.totalTTC)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
