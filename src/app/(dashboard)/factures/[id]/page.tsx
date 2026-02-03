import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { SendEmailButton } from "@/components/SendEmailButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Percent,
  FileText,
  Download,
  Mail,
  Pencil,
  Building2,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VIREMENT: "Virement bancaire",
  CHEQUE: "Cheque",
  ESPECES: "Especes",
  CB: "Carte bancaire",
  AUTRE: "Autre",
};

const PAYMENT_METHOD_ICONS: Record<string, React.ReactNode> = {
  VIREMENT: <Building2 className="h-3.5 w-3.5" />,
  CHEQUE: <FileText className="h-3.5 w-3.5" />,
  ESPECES: <CreditCard className="h-3.5 w-3.5" />,
  CB: <CreditCard className="h-3.5 w-3.5" />,
  AUTRE: <CreditCard className="h-3.5 w-3.5" />,
};

function formatClientAddress(client: {
  address?: string | null;
  addressComplement?: string | null;
  postalCode?: string | null;
  city?: string | null;
}): string[] {
  const lines: string[] = [];

  if (client.address) {
    lines.push(client.address);
  }

  // Only add addressComplement if it's different from address
  if (client.addressComplement && client.addressComplement !== client.address) {
    lines.push(client.addressComplement);
  }

  const cityLine = [client.postalCode, client.city].filter(Boolean).join(" ");
  if (cityLine) {
    lines.push(cityLine);
  }

  return lines;
}

export default async function FactureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const facture = await prisma.facture.findUnique({
    where: { id, userId: session.user.id, deletedAt: null },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });

  if (!facture) notFound();

  const itemsForCalc = facture.items.map((item) => ({
    quantity: Number(item.quantity),
    unitPrice: item.unitPrice,
  }));
  const totals = computeTotals(itemsForCalc, Number(facture.tvaRate));
  const addressLines = formatClientAddress(facture.client);
  const isPaid = facture.status === "PAID";

  return (
    <div className="animate-fade-in-up">
      {/* Navigation */}
      <Link
        href="/factures"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-6"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour aux factures
      </Link>

      {/* Header Card */}
      <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm overflow-hidden mb-6">
        {/* Status Banner */}
        <div
          className={`px-4 py-3 border-b sm:px-6 ${
            isPaid
              ? "bg-gradient-to-r from-success/10 via-success/5 to-transparent border-success/20"
              : "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {isPaid ? (
                <CheckCircle2 className="h-4 w-4 text-success sm:h-5 sm:w-5" />
              ) : (
                <Clock className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              )}
              <span className="text-sm font-medium">
                {isPaid ? "Facture encaissee" : "En attente de paiement"}
              </span>
            </div>
            <Badge variant={isPaid ? "paid" : "sent"}>
              {isPaid ? "Encaissee" : "En attente"}
            </Badge>
          </div>
        </div>

        {/* Header Content */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Title & Number */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Facture</p>
              <h1 className="text-3xl font-bold font-display tracking-tight">
                {facture.number}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(facture.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Percent className="h-4 w-4" />
                  TVA {Number(facture.tvaRate)}%
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {facture.status === "PENDING" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/factures/${facture.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
              )}
              <SendEmailButton
                type="facture"
                id={facture.id}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:text-secondary-foreground transition-all disabled:opacity-50 h-8"
              />
              <Button size="sm" asChild>
                <a
                  href={`/api/pdf/facture/${facture.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Telecharger PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column - Client & Payment Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Client Card */}
          <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm p-4 sm:p-6 overflow-hidden">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Client
            </h2>
            <div className="flex items-start gap-3 min-w-0">
              <Avatar name={facture.client.name} size="lg" className="shrink-0" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <Link
                  href={`/clients/${facture.clientId}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                >
                  {facture.client.name}
                </Link>
                <a
                  href={`mailto:${facture.client.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block truncate"
                >
                  {facture.client.email}
                </a>
              </div>
            </div>

            {addressLines.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-start gap-2 text-sm text-muted-foreground min-w-0">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0 overflow-hidden">
                    {addressLines.map((line, i) => (
                      <p key={i} className="truncate">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info Card - Only show if paid */}
          {isPaid && (facture.paymentDate || facture.paymentMethod) && (
            <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm p-4 sm:p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Paiement
              </h2>
              <div className="space-y-3">
                {facture.paymentDate && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-success/10">
                      <Calendar className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Date de paiement
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(facture.paymentDate).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {facture.paymentMethod && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-success/10">
                      {PAYMENT_METHOD_ICONS[facture.paymentMethod] || (
                        <CreditCard className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Methode</p>
                      <p className="text-sm font-medium">
                        {PAYMENT_METHOD_LABELS[facture.paymentMethod] ??
                          facture.paymentMethod}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Items & Totals */}
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm overflow-hidden">
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px]">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 sm:py-4">
                      Designation
                    </th>
                    <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-14 sm:px-4 sm:py-4 sm:w-20">
                      Qte
                    </th>
                    <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20 sm:px-4 sm:py-4 sm:w-28">
                      P.U. HT
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24 sm:px-6 sm:py-4 sm:w-32">
                      Total HT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {facture.items.map((item, index) => {
                    const lineTotal = Math.round(
                      Number(item.quantity) * item.unitPrice
                    );
                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors hover:bg-primary-subtle"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <span className="font-medium text-foreground text-sm sm:text-base">
                            {item.designation}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-right text-muted-foreground tabular-nums text-sm sm:px-4 sm:py-4">
                          {Number(item.quantity)}
                        </td>
                        <td className="px-2 py-3 text-right text-muted-foreground tabular-nums text-sm sm:px-4 sm:py-4">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold tabular-nums text-sm sm:px-6 sm:py-4">
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="border-t bg-gradient-to-br from-muted/30 via-muted/20 to-transparent p-4 sm:p-6">
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total HT</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(totals.totalHT)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      TVA ({Number(facture.tvaRate)}%)
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(totals.totalTVA)}
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total TTC</span>
                    <span
                      className={`text-xl font-bold tabular-nums ${
                        isPaid ? "text-success" : "text-foreground"
                      }`}
                    >
                      {formatCurrency(totals.totalTTC)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
