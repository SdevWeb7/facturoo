import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { DeleteDevisButton } from "./DeleteDevisButton";
import { ConvertDevisButton } from "./ConvertDevisButton";
import { SendEmailButton } from "@/components/SendEmailButton";
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

export default async function DevisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const devisList = await prisma.devis.findMany({
    where: { userId: session.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devis</h1>
        <Button asChild>
          <Link href="/devis/new">Nouveau devis</Link>
        </Button>
      </div>

      {devisList.length === 0 ? (
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
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Total TTC</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devisList.map((devis) => {
                const itemsForCalc = devis.items.map((item) => ({
                  quantity: Number(item.quantity),
                  unitPrice: item.unitPrice,
                }));
                const totals = computeTotals(itemsForCalc, Number(devis.tvaRate));
                const statusInfo = STATUS_BADGE_VARIANT[devis.status];

                return (
                  <TableRow key={devis.id}>
                    <TableCell className="font-medium">
                      {devis.number}
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
                      {formatCurrency(totals.totalTTC)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(devis.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`/api/pdf/devis/${devis.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-muted-foreground hover:text-foreground"
                      >
                        PDF
                      </a>
                      {devis.status !== "INVOICED" && (
                        <SendEmailButton type="devis" id={devis.id} />
                      )}
                      {devis.status !== "INVOICED" && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/devis/${devis.id}/edit`}>
                            Modifier
                          </Link>
                        </Button>
                      )}
                      {devis.status === "SENT" && (
                        <ConvertDevisButton devisId={devis.id} />
                      )}
                      {devis.status !== "INVOICED" && (
                        <DeleteDevisButton devisId={devis.id} />
                      )}
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
