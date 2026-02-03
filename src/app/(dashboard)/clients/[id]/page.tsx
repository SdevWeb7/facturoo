import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, computeTotalsPerLine } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { FileText, Receipt, Plus, Pencil, Mail, Phone, MapPin } from "lucide-react";
import { STATUS_BADGE_VARIANT } from "@/lib/status";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id, userId: session.user.id },
    include: {
      devis: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      factures: {
        where: { deletedAt: null },
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!client) notFound();

  const devisCount = await prisma.devis.count({
    where: { clientId: client.id, userId: session.user.id },
  });

  const facturesCount = await prisma.facture.count({
    where: { clientId: client.id, userId: session.user.id, deletedAt: null },
  });

  const devisWithTotals = client.devis.map((devis) => {
    const items = devis.items.map((item) => ({
      quantity: Number(item.quantity),
      unitPrice: item.unitPrice,
      tvaRate: item.tvaRate / 100,
    }));
    const totals = computeTotalsPerLine(items);
    return { ...devis, totalTTC: totals.totalTTC };
  });

  const facturesWithTotals = client.factures.map((facture) => {
    const items = facture.items.map((item) => ({
      quantity: Number(item.quantity),
      unitPrice: item.unitPrice,
      tvaRate: item.tvaRate / 100,
    }));
    const totals = computeTotalsPerLine(items);
    return { ...facture, totalTTC: totals.totalTTC };
  });

  const hasAddress = client.address || client.postalCode || client.city;

  return (
    <div>
      <div className="mb-6">
        <Link href="/clients" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux clients
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={client.name} size="lg" />
            <h1 className="text-2xl font-bold">{client.name}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/clients/${client.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Modifier
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/devis/new?clientId=${client.id}`}>
                <Plus className="h-4 w-4" />
                Nouveau devis
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations client */}
        <Card className="lg:col-span-1">
          <CardContent>
            <h2 className="mb-4 font-semibold">Informations</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${client.phone}`} className="hover:underline">
                    {client.phone}
                  </a>
                </div>
              )}
              {hasAddress && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    {client.address && <p>{client.address}</p>}
                    {client.addressComplement && <p>{client.addressComplement}</p>}
                    {(client.postalCode || client.city) && (
                      <p>{[client.postalCode, client.city].filter(Boolean).join(" ")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {client.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="whitespace-pre-wrap text-sm">{client.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Devis et factures */}
        <div className="space-y-6 lg:col-span-2">
          {/* Devis */}
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">
                  Devis ({devisCount})
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/devis?q=${encodeURIComponent(client.name)}`}>
                    Voir tous
                  </Link>
                </Button>
              </div>

              {devisWithTotals.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-6 w-6" />}
                  title="Aucun devis"
                  description="Ce client n'a pas encore de devis."
                  action={
                    <Button size="sm" asChild>
                      <Link href={`/devis/new?clientId=${client.id}`}>
                        <Plus className="h-4 w-4" />
                        Créer un devis
                      </Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-2">
                  {devisWithTotals.map((devis) => {
                    const statusInfo = STATUS_BADGE_VARIANT[devis.status];
                    return (
                      <Link
                        key={devis.id}
                        href={`/devis/${devis.id}`}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{devis.number}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(devis.date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          <span className="font-medium">{formatCurrency(devis.totalTTC)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Factures */}
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">
                  Factures ({facturesCount})
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/factures?q=${encodeURIComponent(client.name)}`}>
                    Voir toutes
                  </Link>
                </Button>
              </div>

              {facturesWithTotals.length === 0 ? (
                <EmptyState
                  icon={<Receipt className="h-6 w-6" />}
                  title="Aucune facture"
                  description="Ce client n'a pas encore de facture."
                />
              ) : (
                <div className="space-y-2">
                  {facturesWithTotals.map((facture) => {
                    const statusInfo = STATUS_BADGE_VARIANT[facture.status];
                    return (
                      <Link
                        key={facture.id}
                        href={`/factures/${facture.id}`}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{facture.number}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(facture.date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          <span className="font-medium">{formatCurrency(facture.totalTTC)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
