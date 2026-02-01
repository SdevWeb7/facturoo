import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { DevisActionsMenu } from "./DevisActionsMenu";
import { SortableTableHead } from "@/components/SortableTableHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import { SearchInput } from "@/components/ui/search-input";

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { sort, order, q } = await searchParams;

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

  const filtered = q
    ? devisWithTotals.filter((d) => {
        const search = q.toLowerCase();
        return (
          d.number.toLowerCase().includes(search) ||
          d.client.name.toLowerCase().includes(search) ||
          d.items.some((item) => item.designation.toLowerCase().includes(search))
        );
      })
    : devisWithTotals;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devis</h1>
        <Button asChild>
          <Link href="/devis/new">
            <Plus className="h-4 w-4" />
            Nouveau devis
          </Link>
        </Button>
      </div>

      {devisWithTotals.length > 0 && (
        <SearchInput placeholder="Rechercher par client, numéro, description…" className="mt-6 max-w-sm" />
      )}

      {devisWithTotals.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<FileText className="h-7 w-7" />}
            title="Aucun devis"
            description="Créez votre premier devis pour commencer à facturer vos clients."
            action={
              <Button asChild>
                <Link href="/devis/new">
                  <Plus className="h-4 w-4" />
                  Créer votre premier devis
                </Link>
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="Aucun résultat"
            description={`Aucun devis ne correspond à « ${q} ».`}
          />
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden p-0">
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
              {filtered.map((devis) => {
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
        </Card>
      )}
    </div>
  );
}
