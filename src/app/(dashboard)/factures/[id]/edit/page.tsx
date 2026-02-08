import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EditFactureForm } from "./EditFactureForm";

export default async function EditFacturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const facture = await prisma.facture.findUnique({
    where: { id, userId: session.user.id, deletedAt: null },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!facture) notFound();

  if (facture.status === "PAID") {
    redirect("/factures");
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/factures" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux factures
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Modifier {facture.number}</h1>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
        <EditFactureForm
          factureId={facture.id}
          clients={clients}
          defaultValues={{
            clientId: facture.clientId,
            items: facture.items.map((item) => ({
              designation: item.designation,
              quantity: Number(item.quantity),
              unitPrice: item.unitPrice,
              tvaRate: item.tvaRate / 100, // Convert centièmes to percentage (2000 -> 20)
            })),
            notes: facture.notes || "",
          }}
        />
      </div>
    </div>
  );
}
