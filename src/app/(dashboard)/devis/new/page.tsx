import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NewDevisForm } from "./NewDevisForm";

export default async function NewDevisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/devis" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux devis
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nouveau devis</h1>
      </div>

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
        <div className="max-w-2xl rounded-lg border bg-card p-6">
          <NewDevisForm clients={clients} />
        </div>
      )}
    </div>
  );
}
