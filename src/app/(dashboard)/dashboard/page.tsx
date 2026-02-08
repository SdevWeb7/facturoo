import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { hasActiveSubscription } from "@/lib/subscription";
import {
  Users,
  FileText,
  Receipt,
  TrendingUp,
  ArrowRight,
  Plus,
  UserPlus,
  AlertTriangle,
  BarChart3,
  Target,
  Clock,
  Crown,
  Sparkles,
  Lock,
  User,
  CheckCircle2,
  Circle,
  Send,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import {
  getMonthlyRevenue,
  getOverdueFactures,
  getConversionRate,
  getTopClients,
  getPrevisionnel,
} from "@/lib/dashboard-data";
import { RevenueChartWrapper } from "@/components/dashboard/RevenueChartWrapper";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const isPro = await hasActiveSubscription(userId);

  const [user, clientCount, devisList, facturesList] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { company: true, siret: true, address: true, phone: true },
    }),
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

  const hasProfile = !!(user?.company && user?.siret && user?.address);

  // Pro-only advanced stats
  const [monthlyRevenue, overdueFactures, conversionRate, topClients, previsionnel] = isPro
    ? await Promise.all([
        getMonthlyRevenue(userId),
        getOverdueFactures(userId),
        getConversionRate(userId),
        getTopClients(userId),
        getPrevisionnel(userId),
      ])
    : [null, null, null, null, null];

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

  const overdueTotal = overdueFactures
    ? overdueFactures.reduce((sum, f) => sum + f.totalTTC, 0)
    : 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            G&eacute;rez vos devis et factures simplement, sans Excel.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href="/clients/new">
              <UserPlus className="h-4 w-4" />
              Nouveau client
            </Link>
          </Button>
          <Button asChild>
            <Link href="/devis/new">
              <Plus className="h-4 w-4" />
              Créer un devis
            </Link>
          </Button>
        </div>
      </div>

      {/* Onboarding checklist */}
      {(() => {
        const hasClient = clientCount > 0;
        const hasDevis = devisList.length > 0;
        const hasSentDevis = devisList.some((d) => d.status === "SENT" || d.status === "INVOICED");
        const hasFacture = facturesList.length > 0;
        const completedSteps = [hasProfile, hasClient, hasDevis, hasSentDevis, hasFacture].filter(Boolean).length;
        const allDone = completedSteps === 5;

        if (allDone) return null;

        const steps = [
          {
            done: hasProfile,
            label: "Compléter mon profil",
            href: "/settings",
            icon: <User className="h-4 w-4" />,
          },
          {
            done: hasClient,
            label: "Ajouter un client",
            href: "/clients/new",
            icon: <UserPlus className="h-4 w-4" />,
          },
          {
            done: hasDevis,
            label: "Créer un devis",
            href: "/devis/new",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            done: hasSentDevis,
            label: "Envoyer un devis",
            href: hasDevis ? `/devis/${devisList[0]?.id}` : "/devis",
            icon: <Send className="h-4 w-4" />,
          },
          {
            done: hasFacture,
            label: "Créer une facture",
            href: "/factures/new",
            icon: <Receipt className="h-4 w-4" />,
          },
        ];

        return (
          <Card className="mt-6 animate-fade-in-up">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="font-semibold font-display">Bienvenue sur Facturoo 👋</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Cr&eacute;ez votre premier devis en moins de 2 minutes.
                </p>
              </div>
              <Badge variant="sent">{completedSteps}/5</Badge>
            </div>
            <CardContent>
              {/* Progress bar */}
              <div className="mb-5 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(completedSteps / 5) * 100}%` }}
                />
              </div>

              <ul className="space-y-1">
                {steps.map((step) => {
                  const nextTodo = steps.find((s) => !s.done);
                  const isNext = !step.done && step === nextTodo;

                  return (
                    <li key={step.label}>
                      <Link
                        href={step.done ? "#" : step.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                          step.done
                            ? "text-muted-foreground"
                            : isNext
                              ? "bg-primary/5 text-foreground hover:bg-primary/10"
                              : "text-muted-foreground/60 hover:bg-muted/50"
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                        ) : (
                          <Circle className={`h-5 w-5 shrink-0 ${isNext ? "text-primary" : "text-border"}`} />
                        )}
                        <span className="flex items-center gap-2">
                          {step.icon}
                          <span className={step.done ? "line-through" : isNext ? "font-medium" : ""}>
                            {step.label}
                          </span>
                        </span>
                        {isNext && (
                          <ArrowRight className="ml-auto h-4 w-4 text-primary shrink-0" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        );
      })()}

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
                {devisSent} envoy&eacute;{devisSent > 1 ? "s" : ""}
              </Badge>
              <Badge variant="invoiced">
                {devisInvoiced} factur&eacute;{devisInvoiced > 1 ? "s" : ""}
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
                <p className="text-sm text-muted-foreground">CA factur&eacute; TTC</p>
                {caFactures > 0 ? (
                  <p className="text-2xl font-bold">
                    {formatCurrency(caFactures)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/80 italic">
                    Apparaîtra ici
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro-only: Overdue warning */}
      {isPro && overdueFactures && overdueFactures.length > 0 && (
        <Card className="mt-6 border-warning/30 bg-warning/5">
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {overdueFactures.length} facture{overdueFactures.length > 1 ? "s" : ""} impay&eacute;e{overdueFactures.length > 1 ? "s" : ""} (+30 jours)
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Montant total : {formatCurrency(overdueTotal)}
                </p>
                <div className="mt-3 space-y-1.5">
                  {overdueFactures.slice(0, 3).map((f) => (
                    <div key={f.id} className="flex items-center justify-between text-sm">
                      <span>
                        <Link href={`/factures/${f.id}`} className="text-primary hover:underline font-medium">
                          {f.number}
                        </Link>
                        <span className="text-muted-foreground ml-2">{f.clientName}</span>
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(f.totalTTC)} &mdash; {f.daysOverdue}j
                      </span>
                    </div>
                  ))}
                  {overdueFactures.length > 3 && (
                    <Link href="/factures" className="text-sm text-primary hover:underline">
                      Voir toutes les factures impay&eacute;es
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro-only: Revenue Chart */}
      {isPro && monthlyRevenue && (devisList.length > 0 || facturesList.length > 0) && (
        <Card className="mt-6">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold font-display">CA mensuel (12 mois)</h2>
          </div>
          <CardContent>
            <RevenueChartWrapper data={monthlyRevenue} />
          </CardContent>
        </Card>
      )}

      {/* Pro-only: Advanced stats grid */}
      {isPro && (devisList.length > 0 || facturesList.length > 0) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Conversion rate */}
          <Card className="card-hover">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-4/10">
                  <Target className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversion devis</p>
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Taux de devis transform&eacute;s en factures
              </p>
            </CardContent>
          </Card>

          {/* Previsionnel */}
          <Card className="card-hover">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pr&eacute;visionnel</p>
                  <p className="text-2xl font-bold">{formatCurrency(previsionnel!)}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Somme TTC des devis envoy&eacute;s en attente
              </p>
            </CardContent>
          </Card>

          {/* Top clients */}
          <Card className="card-hover sm:col-span-2 lg:col-span-1">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-semibold">Top clients</p>
              </div>
              {topClients!.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donn&eacute;e</p>
              ) : (
                <ul className="space-y-2">
                  {topClients!.map((c, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={c.name} size="sm" />
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="font-medium text-xs whitespace-nowrap ml-2">
                        {formatCurrency(c.totalTTC)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upsell block for free users */}
      {!isPro && (devisList.length > 0 || facturesList.length > 0) && (
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  Passez au Pro pour voir vos stats avanc&eacute;es
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Graphique CA, taux de conversion, top clients, pr&eacute;visionnel et factures impay&eacute;es.
                </p>
                <Button size="sm" className="mt-3" asChild>
                  <Link href="/settings">
                    <Lock className="h-3.5 w-3.5" />
                    D&eacute;bloquer &mdash; 9,90 &euro;/mois
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Devis */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
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
              Aucun devis cr&eacute;&eacute;
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
                    className="px-4 py-3 hover:bg-primary-subtle transition-colors sm:px-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{devis.number}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(devis.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate mr-2">
                        {devis.client.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {formatCurrency(totals.totalTTC)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Recent Factures */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
            <h2 className="font-semibold font-display">
              Derni&egrave;res factures
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
              Aucune facture cr&eacute;&eacute;e
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
                    className="px-4 py-3 hover:bg-primary-subtle transition-colors sm:px-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{facture.number}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(facture.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate mr-2">
                        {facture.client.name}
                      </span>
                      <span className="text-sm font-medium whitespace-nowrap">
                        {formatCurrency(totals.totalTTC)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* CTA — Demande de fonctionnalité */}
      <Card className="mt-8 card-hover border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardContent>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 animate-pulse-subtle">
              <Lightbulb className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">On a besoin de vous !</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Vous voulez une fonctionnalit&eacute; ? Aidez-nous &agrave; am&eacute;liorer Facturoo.
              </p>
            </div>
            <Button variant="accent" asChild className="shrink-0">
              <Link href="/aide?subject=Demande+de+fonctionnalit%C3%A9#contact">
                Je donne mon avis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
