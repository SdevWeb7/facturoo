import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { computeTotals } from "@/lib/utils";
import { DevisCard } from "./DevisCard";
import { DevisTableRow } from "./DevisTableRow";
import { SortableTableHead } from "@/components/SortableTableHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";

const PER_PAGE = 10;

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string; q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { sort, order, q, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

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

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const paginationSearchParams: Record<string, string> = {};
  if (sort) paginationSearchParams.sort = sort;
  if (order) paginationSearchParams.order = order;
  if (q) paginationSearchParams.q = q;

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
        <>
        {/* Mobile cards */}
        <div className="mt-6 space-y-3 md:hidden">
          {paginated.map((devis) => (
            <DevisCard key={devis.id} devis={devis} />
          ))}
        </div>

        {/* Desktop table */}
        <Card className="mt-6 hidden overflow-hidden p-0 md:block">
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
              {paginated.map((devis) => (
                <DevisTableRow key={devis.id} devis={devis} />
              ))}
            </TableBody>
          </Table>
        </Card>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/devis" searchParams={paginationSearchParams} />
        </>
      )}
    </div>
  );
}
