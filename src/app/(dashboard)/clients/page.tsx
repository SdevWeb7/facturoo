import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Plus, FileText } from "lucide-react";
import { DeleteClientButton } from "./DeleteClientButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PER_PAGE = 10;

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalPages = Math.ceil(clients.length / PER_PAGE);
  const paginated = clients.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="h-4 w-4" />
            Nouveau client
          </Link>
        </Button>
      </div>

      {paginated.length === 0 && clients.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Users className="h-7 w-7" />}
            title="Aucun client"
            description="Commencez par ajouter votre premier client pour créer des devis."
            action={
              <Button asChild>
                <Link href="/clients/new">
                  <Plus className="h-4 w-4" />
                  Créer votre premier client
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
        {/* Mobile cards */}
        <div className="mt-6 space-y-3 md:hidden">
          {paginated.map((client) => (
            <Card key={client.id} className="p-4">
              <Link href={`/clients/${client.id}`} className="flex items-center gap-3 hover:opacity-80">
                <Avatar name={client.name} size="sm" />
                <span className="font-medium hover:underline">{client.name}</span>
              </Link>
              {client.email && (
                <p className="mt-1 text-sm text-muted-foreground">{client.email}</p>
              )}
              {client.phone && (
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/devis/new?clientId=${client.id}`}>
                    <FileText className="h-3.5 w-3.5" />
                    Nouveau devis
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/clients/${client.id}/edit`}>
                    Modifier
                  </Link>
                </Button>
                <DeleteClientButton clientId={client.id} />
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <Card className="mt-6 hidden overflow-hidden p-0 md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link href={`/clients/${client.id}`} className="flex items-center gap-3">
                      <Avatar name={client.name} size="sm" />
                      <span className="font-medium hover:underline">{client.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.phone || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/devis/new?clientId=${client.id}`}>
                        <FileText className="h-3.5 w-3.5" />
                        Nouveau devis
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/clients/${client.id}/edit`}>
                        Modifier
                      </Link>
                    </Button>
                    <DeleteClientButton clientId={client.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/clients" />
        </>
      )}
    </div>
  );
}
