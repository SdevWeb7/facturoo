import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import {
  Users,
  FileText,
  Receipt,
  TrendingUp,
  ArrowRight,
  Plus,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_BADGE_VARIANT } from "@/lib/status";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [clientCount, devisList, facturesList] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.devis.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.facture.findMany({
      where: { userId, deletedAt: null },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const devisDraft = devisList.filter((d) => d.status === "DRAFT").length;
  const devisSent = devisList.filter((d) => d.status === "SENT").length;
  const devisInvoiced = devisList.filter((d) => d.status === "INVOICED").length;

  const caFactures = facturesList.reduce((sum, f) => {
    const items = f.items.map((i) => ({
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice,
    }));
    return sum + computeTotals(items, Number(f.tvaRate)).totalTTC;
  }, 0);

  const recentDevis = devisList.slice(0, 5);
  const recentFactures = facturesList.slice(0, 5);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vue d&apos;ensemble de votre activité
          </p>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          <Button variant="outline" asChild className="flex-1 sm:flex-initial">
            <Link href="/clients/new">
              <UserPlus className="h-4 w-4" />
              Nouveau client
            </Link>
          </Button>
          <Button asChild className="flex-1 sm:flex-initial">
            <Link href="/devis/new">
              <Plus className="h-4 w-4" />
              Nouveau devis
            </Link>
          </Button>
        </div>
      </div>

      {/* Welcome block when empty */}
      {devisList.length === 0 && facturesList.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<FileText className="h-7 w-7" />}
            title="Bienvenue sur Facturoo"
            description="Commencez par ajouter un client puis créez votre premier devis."
            action={
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/clients/new">
                    <UserPlus className="h-4 w-4" />
                    Ajouter un client
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/devis/new">
                    <Plus className="h-4 w-4" />
                    Créer un devis
                  </Link>
                </Button>
              </div>
            }
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up animate-stagger-1 card-hover">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold">{clientCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-stagger-2 card-hover">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-4/10">
                <FileText className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devis</p>
                <p className="text-2xl font-bold">
                  {devisList.length}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge variant="draft">
                {devisDraft} brouillon{devisDraft > 1 ? "s" : ""}
              </Badge>
              <Badge variant="sent">
                {devisSent} envoyé{devisSent > 1 ? "s" : ""}
              </Badge>
              <Badge variant="invoiced">
                {devisInvoiced} facturé{devisInvoiced > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-stagger-3 card-hover">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
                <Receipt className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Factures</p>
                <p className="text-2xl font-bold">
                  {facturesList.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-stagger-4 card-hover">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CA facturé TTC</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(caFactures)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Devis */}
        <Card>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold font-display">Derniers devis</h2>
            <Link
              href="/devis"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentDevis.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Aucun devis créé
            </div>
          ) : (
            <ul className="divide-y">
              {recentDevis.map((devis) => {
                const items = devis.items.map((i) => ({
                  quantity: Number(i.quantity),
                  unitPrice: i.unitPrice,
                }));
                const totals = computeTotals(items, Number(devis.tvaRate));
                const statusInfo = STATUS_BADGE_VARIANT[devis.status];
                return (
                  <li
                    key={devis.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-primary-subtle transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={devis.client.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {devis.number}
                          <span className="ml-2 text-muted-foreground">
                            {devis.client.name}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(devis.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                      <span className="text-sm font-medium">
                        {formatCurrency(totals.totalTTC)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Recent Factures */}
        <Card>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold font-display">
              Dernières factures
            </h2>
            <Link
              href="/factures"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentFactures.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Aucune facture créée
            </div>
          ) : (
            <ul className="divide-y">
              {recentFactures.map((facture) => {
                const items = facture.items.map((i) => ({
                  quantity: Number(i.quantity),
                  unitPrice: i.unitPrice,
                }));
                const totals = computeTotals(items, Number(facture.tvaRate));
                return (
                  <li
                    key={facture.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-primary-subtle transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={facture.client.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {facture.number}
                          <span className="ml-2 text-muted-foreground">
                            {facture.client.name}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(facture.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(totals.totalTTC)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

    </div>
  );
}
