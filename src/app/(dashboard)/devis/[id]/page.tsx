import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, computeTotalsPerLine } from "@/lib/utils";
import { SendEmailButton } from "@/components/SendEmailButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_BADGE_VARIANT } from "@/lib/status";
import { DevisDetailActions } from "./DevisDetailActions";
import {
  ArrowLeft,
  Calendar,
  Download,
  MapPin,
  FileText,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";

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

const STATUS_ICONS: Record<string, React.ReactNode> = {
  DRAFT: <FileText className="h-5 w-5" />,
  SENT: <Send className="h-5 w-5" />,
  INVOICED: <CheckCircle2 className="h-5 w-5" />,
};

const STATUS_MESSAGES: Record<string, string> = {
  DRAFT: "Brouillon en cours d'edition",
  SENT: "Devis envoye au client",
  INVOICED: "Devis converti en facture",
};

export default async function DevisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const devis = await prisma.devis.findUnique({
    where: { id, userId: session.user.id },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });

  if (!devis) notFound();

  const itemsForCalc = devis.items.map((item) => ({
    quantity: Number(item.quantity),
    unitPrice: item.unitPrice,
    tvaRate: item.tvaRate / 100,
  }));
  const totals = computeTotalsPerLine(itemsForCalc);

  const statusInfo = STATUS_BADGE_VARIANT[devis.status];
  const isLocked = devis.status === "INVOICED";
  const addressLines = formatClientAddress(devis.client);

  // Determine status color scheme
  const statusColorClass =
    devis.status === "INVOICED"
      ? "from-success/10 via-success/5 to-transparent border-success/20"
      : devis.status === "SENT"
        ? "from-primary/10 via-primary/5 to-transparent border-primary/20"
        : "from-muted/50 via-muted/30 to-transparent border-border";

  const statusIconColor =
    devis.status === "INVOICED"
      ? "text-success"
      : devis.status === "SENT"
        ? "text-primary"
        : "text-muted-foreground";

  return (
    <div className="animate-fade-in-up">
      {/* Navigation */}
      <Link
        href="/devis"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-6"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour aux devis
      </Link>

      {/* Header Card */}
      <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm overflow-hidden mb-6">
        {/* Status Banner */}
        <div
          className={`px-6 py-3 border-b bg-gradient-to-r ${statusColorClass}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={statusIconColor}>
                {STATUS_ICONS[devis.status]}
              </span>
              <span className="text-sm font-medium">
                {STATUS_MESSAGES[devis.status]}
              </span>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </div>

        {/* Header Content */}
        <div className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Title & Number */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Devis</p>
              <h1 className="text-3xl font-bold font-display tracking-tight">
                {devis.number}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(devis.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {!isLocked && (
                <SendEmailButton
                  type="devis"
                  id={devis.id}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:text-secondary-foreground transition-all disabled:opacity-50 h-8"
                />
              )}
              <Button size="sm" variant="outline" asChild>
                <a
                  href={`/api/pdf/devis/${devis.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Telecharger PDF
                </a>
              </Button>
              {!isLocked && (
                <DevisDetailActions devisId={devis.id} status={devis.status} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Client Info */}
        <div className="space-y-6">
          {/* Client Card */}
          <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Client
            </h2>
            <div className="flex items-start gap-3">
              <Avatar name={devis.client.name} size="lg" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/clients/${devis.clientId}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                >
                  {devis.client.name}
                </Link>
                <a
                  href={`mailto:${devis.client.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block truncate"
                >
                  {devis.client.email}
                </a>
              </div>
            </div>

            {addressLines.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    {addressLines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Items & Totals */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-2xl border ring-1 ring-border/50 shadow-warm overflow-hidden">
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Designation
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16">
                      Qte
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">
                      P.U. HT
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16">
                      TVA
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-28">
                      Total HT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {devis.items.map((item, index) => {
                    const lineHT = Math.round(
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
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">
                            {item.designation}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-muted-foreground tabular-nums">
                          {Number(item.quantity)}
                        </td>
                        <td className="px-4 py-4 text-right text-muted-foreground tabular-nums">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-4 text-right text-muted-foreground tabular-nums">
                          {(item.tvaRate / 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-right font-semibold tabular-nums">
                          {formatCurrency(lineHT)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="border-t bg-gradient-to-br from-muted/30 via-muted/20 to-transparent p-6">
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total HT</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(totals.totalHT)}
                    </span>
                  </div>
                  {Object.entries(totals.tvaByRate)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([rate, amount]) => (
                      <div
                        key={rate}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          TVA {Number(rate).toFixed(1)}%
                        </span>
                        <span className="font-medium tabular-nums">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    ))}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total TTC</span>
                    <span
                      className={`text-xl font-bold tabular-nums ${
                        isLocked ? "text-success" : "text-foreground"
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
