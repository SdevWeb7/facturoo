import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, computeTotalsPerLine } from "@/lib/utils";
import { SendEmailButton } from "@/components/SendEmailButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import { DevisDetailActions } from "./DevisDetailActions";

export default async function DevisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const devis = await prisma.devis.findUnique({
    where: { id, userId: session.user.id },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });

  if (!devis) notFound();

  const itemsForCalc = devis.items.map((item) => ({
    quantity: Number(item.quantity),
    unitPrice: item.unitPrice,
    tvaRate: item.tvaRate / 100,
  }));
  const totals = computeTotalsPerLine(itemsForCalc);

  const statusInfo = STATUS_BADGE_VARIANT[devis.status];
  const isLocked = devis.status === "INVOICED";

  return (
    <div>
      <div className="mb-6">
        <Link href="/devis" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux devis
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Devis {devis.number}</h1>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <div className="flex gap-3">
            {!isLocked && (
              <SendEmailButton
                type="devis"
                id={devis.id}
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 disabled:opacity-50"
              />
            )}
            <Button asChild>
              <a
                href={`/api/pdf/devis/${devis.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Télécharger le PDF
              </a>
            </Button>
            {!isLocked && <DevisDetailActions devisId={devis.id} status={devis.status} />}
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Info */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <Link
                href={`/clients/${devis.clientId}`}
                className="mt-1 block text-sm font-medium text-primary hover:underline"
              >
                {devis.client.name}
              </Link>
              <p className="text-sm text-muted-foreground">{devis.client.email}</p>
              {devis.client.address && (
                <p className="text-sm text-muted-foreground">{devis.client.address}</p>
              )}
              {devis.client.addressComplement && (
                <p className="text-sm text-muted-foreground">{devis.client.addressComplement}</p>
              )}
              {(devis.client.postalCode || devis.client.city) && (
                <p className="text-sm text-muted-foreground">
                  {[devis.client.postalCode, devis.client.city].filter(Boolean).join(" ")}
                </p>
              )}
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="mt-1 text-sm">
                {new Date(devis.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Items table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Désignation</TableHead>
                <TableHead className="text-right">Qté</TableHead>
                <TableHead className="text-right">P.U. HT</TableHead>
                <TableHead className="text-right">TVA</TableHead>
                <TableHead className="text-right">Total HT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devis.items.map((item) => {
                const lineHT = Math.round(Number(item.quantity) * item.unitPrice);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.designation}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {Number(item.quantity)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {(item.tvaRate / 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(lineHT)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total HT</span>
                <span className="font-medium">{formatCurrency(totals.totalHT)}</span>
              </div>
              {Object.entries(totals.tvaByRate)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([rate, amount]) => (
                  <div key={rate} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA {Number(rate).toFixed(1)}%</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
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
