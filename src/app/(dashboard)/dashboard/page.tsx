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
} from "lucide-react";

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

  const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    DRAFT: { label: "Brouillon", className: "bg-gray-100 text-gray-700" },
    SENT: { label: "Envoyé", className: "bg-blue-100 text-blue-700" },
    INVOICED: { label: "Facturé", className: "bg-green-100 text-green-700" },
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d&apos;ensemble de votre activité
          </p>
        </div>
        <Link
          href="/devis/new"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nouveau devis
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clientCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Devis</p>
              <p className="text-2xl font-bold text-gray-900">
                {devisList.length}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
              {devisDraft} brouillon{devisDraft > 1 ? "s" : ""}
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-600">
              {devisSent} envoyé{devisSent > 1 ? "s" : ""}
            </span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-600">
              {devisInvoiced} facturé{devisInvoiced > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Receipt className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Factures</p>
              <p className="text-2xl font-bold text-gray-900">
                {facturesList.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">CA facturé TTC</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(caFactures)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Devis */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Derniers devis</h2>
            <Link
              href="/devis"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
            >
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentDevis.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Aucun devis créé
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentDevis.map((devis) => {
                const items = devis.items.map((i) => ({
                  quantity: Number(i.quantity),
                  unitPrice: i.unitPrice,
                }));
                const totals = computeTotals(items, Number(devis.tvaRate));
                const statusInfo = STATUS_LABELS[devis.status];
                return (
                  <li
                    key={devis.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {devis.number}
                        <span className="ml-2 text-gray-400">&mdash;</span>
                        <span className="ml-2 text-gray-500">
                          {devis.client.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(devis.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(totals.totalTTC)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent Factures */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Dernières factures
            </h2>
            <Link
              href="/factures"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
            >
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentFactures.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Aucune facture créée
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentFactures.map((facture) => {
                const items = facture.items.map((i) => ({
                  quantity: Number(i.quantity),
                  unitPrice: i.unitPrice,
                }));
                const totals = computeTotals(items, Number(facture.tvaRate));
                return (
                  <li
                    key={facture.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {facture.number}
                        <span className="ml-2 text-gray-400">&mdash;</span>
                        <span className="ml-2 text-gray-500">
                          {facture.client.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(facture.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(totals.totalTTC)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Welcome block when empty */}
      {devisList.length === 0 && facturesList.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Bienvenue sur Facturoo
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Commencez par ajouter un client puis créez votre premier devis.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/clients/new"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Ajouter un client
            </Link>
            <Link
              href="/devis/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Créer un devis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
