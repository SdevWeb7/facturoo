import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function FacturesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const factures = await prisma.facture.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Factures</h1>
      </div>

      {factures.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Aucune facture pour le moment.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Les factures sont créées à partir des devis envoyés.
          </p>
          <Link
            href="/devis"
            className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary/80"
          >
            Voir les devis
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Total TTC</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factures.map((facture) => {
                const itemsForCalc = facture.items.map((item) => ({
                  quantity: Number(item.quantity),
                  unitPrice: item.unitPrice,
                }));
                const totals = computeTotals(itemsForCalc, Number(facture.tvaRate));

                return (
                  <TableRow key={facture.id}>
                    <TableCell className="font-medium">
                      {facture.number}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {facture.client.name}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(totals.totalTTC)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(facture.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/factures/${facture.id}`}>Voir</Link>
                      </Button>
                      <a
                        href={`/api/pdf/facture/${facture.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 font-medium text-muted-foreground hover:text-foreground"
                      >
                        PDF
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
