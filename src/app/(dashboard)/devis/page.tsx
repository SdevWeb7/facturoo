import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { DevisActionsMenu } from "./DevisActionsMenu";
import { SortableTableHead } from "@/components/SortableTableHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_BADGE_VARIANT } from "@/lib/status";

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { sort, order } = await searchParams;

  const devisList = await prisma.devis.findMany({
    where: { userId: session.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const devisWithTotals = devisList.map((devis) => {
    const itemsForCalc = devis.items.map((item) => ({
      quantity: Number(item.quantity),
      unitPrice: item.unitPrice,
    }));
    const totals = computeTotals(itemsForCalc, Number(devis.tvaRate));
    return { ...devis, totalTTC: totals.totalTTC };
  });

  const dir = order === "asc" ? 1 : -1;
  if (sort === "date") {
    devisWithTotals.sort((a, b) => dir * (new Date(a.date).getTime() - new Date(b.date).getTime()));
  } else if (sort === "client") {
    devisWithTotals.sort((a, b) => dir * a.client.name.localeCompare(b.client.name));
  } else if (sort === "totalTTC") {
    devisWithTotals.sort((a, b) => dir * (a.totalTTC - b.totalTTC));
  } else if (sort === "status") {
    const statusOrder: Record<string, number> = { DRAFT: 0, SENT: 1, INVOICED: 2 };
    devisWithTotals.sort((a, b) => dir * ((statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devis</h1>
        <Button asChild>
          <Link href="/devis/new">Nouveau devis</Link>
        </Button>
      </div>

      {devisWithTotals.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Aucun devis pour le moment.</p>
          <Link
            href="/devis/new"
            className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary/80"
          >
            Créer votre premier devis
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
              {devisWithTotals.map((devis) => {
                const statusInfo = STATUS_BADGE_VARIANT[devis.status];

                return (
                  <TableRow key={devis.id}>
                    <TableCell className="font-medium">
                      {devis.number}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(devis.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {devis.client.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(devis.totalTTC)}
                    </TableCell>
                    <TableCell>
                      <DevisActionsMenu devisId={devis.id} status={devis.status} />
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
