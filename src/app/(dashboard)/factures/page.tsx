import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { computeTotals } from "@/lib/utils";
import { FactureCard } from "./FactureCard";
import { FactureTableRow } from "./FactureTableRow";
import { SortableTableHead } from "@/components/SortableTableHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Receipt, Search } from "lucide-react";
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

export default async function FacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string; q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { sort, order, q, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

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

  const filtered = q
    ? facturesWithTotals.filter((f) => {
        const search = q.toLowerCase();
        return (
          f.number.toLowerCase().includes(search) ||
          f.client.name.toLowerCase().includes(search) ||
          f.items.some((item) => item.designation.toLowerCase().includes(search))
        );
      })
    : facturesWithTotals;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const paginationSearchParams: Record<string, string> = {};
  if (sort) paginationSearchParams.sort = sort;
  if (order) paginationSearchParams.order = order;
  if (q) paginationSearchParams.q = q;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Factures</h1>
      </div>

      {facturesWithTotals.length > 0 && (
        <SearchInput placeholder="Rechercher par client, numéro, description…" className="mt-6 max-w-sm" />
      )}

      {facturesWithTotals.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Receipt className="h-7 w-7" />}
            title="Aucune facture"
            description="Les factures sont créées à partir des devis envoyés."
            action={
              <Button asChild>
                <Link href="/devis">Voir les devis</Link>
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="Aucun résultat"
            description={`Aucune facture ne correspond à « ${q} ».`}
          />
        </div>
      ) : (
        <>
        {/* Mobile cards */}
        <div className="mt-6 space-y-3 md:hidden">
          {paginated.map((facture) => (
            <FactureCard key={facture.id} facture={facture} />
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
              {paginated.map((facture) => (
                <FactureTableRow key={facture.id} facture={facture} />
              ))}
            </TableBody>
          </Table>
        </Card>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/factures" searchParams={paginationSearchParams} />
        </>
      )}
    </div>
  );
}
