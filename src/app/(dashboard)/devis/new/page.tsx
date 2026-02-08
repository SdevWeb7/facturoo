import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { NewDevisForm } from "./NewDevisForm";

export default async function NewDevisPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { clientId } = await searchParams;

  const [user, clients] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { company: true, siret: true, address: true, phone: true, defaultNotes: true },
    }),
    prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const profileIncomplete = !user?.company || !user?.siret || !user?.address;

  return (
    <div>
      <div className="mb-6">
        <Link href="/devis" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux devis
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nouveau devis</h1>
      </div>

      {profileIncomplete && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profil incomplet</AlertTitle>
          <AlertDescription>
            Vos informations professionnelles (entreprise, SIRET, adresse) apparaissent sur vos devis.{" "}
            <Link href="/settings" className="font-medium underline underline-offset-2 hover:text-warning">
              Compléter mon profil
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {clients.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">
            Vous devez d&apos;abord créer un client.
          </p>
          <Link
            href="/clients/new"
            className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary/80"
          >
            Créer un client
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 lg:mx-0">
          <NewDevisForm clients={clients} defaultClientId={clientId} defaultNotes={user?.defaultNotes || ""} />
        </div>
      )}
    </div>
  );
}
