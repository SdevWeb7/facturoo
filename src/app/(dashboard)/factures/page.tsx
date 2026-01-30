import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import { SortableTableHead } from "@/components/SortableTableHead";
import { FactureActionsMenu } from "./FactureActionsMenu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function FacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { sort, order } = await searchParams;

  const factures = await prisma.facture.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const facturesWithTotals = factures.map((facture) => {
    const itemsForCalc = facture.items.map((item) => ({
      quantity: Number(item.quantity),
      unitPrice: item.unitPrice,
    }));
    const totals = computeTotals(itemsForCalc, Number(facture.tvaRate));
    return { ...facture, totalTTC: totals.totalTTC };
  });

  const dir = order === "asc" ? 1 : -1;
  if (sort === "date") {
    facturesWithTotals.sort((a, b) => dir * (new Date(a.date).getTime() - new Date(b.date).getTime()));
  } else if (sort === "client") {
    facturesWithTotals.sort((a, b) => dir * a.client.name.localeCompare(b.client.name));
  } else if (sort === "totalTTC") {
    facturesWithTotals.sort((a, b) => dir * (a.totalTTC - b.totalTTC));
  } else if (sort === "status") {
    const statusOrder: Record<string, number> = { PENDING: 0, PAID: 1 };
    facturesWithTotals.sort((a, b) => dir * ((statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Factures</h1>
      </div>

      {facturesWithTotals.length === 0 ? (
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
                <SortableTableHead column="date">Date</SortableTableHead>
                <SortableTableHead column="client">Client</SortableTableHead>
                <SortableTableHead column="status">Statut</SortableTableHead>
                <SortableTableHead column="totalTTC" className="text-right">Total TTC</SortableTableHead>
                <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturesWithTotals.map((facture) => (
                <TableRow key={facture.id}>
                  <TableCell className="font-medium">
                    {facture.number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(facture.date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {facture.client.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANT[facture.status]?.variant ?? "default"}>
                      {STATUS_BADGE_VARIANT[facture.status]?.label ?? facture.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(facture.totalTTC)}
                  </TableCell>
                  <TableCell>
                    <FactureActionsMenu factureId={facture.id} status={facture.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
