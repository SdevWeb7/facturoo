import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EditDevisForm } from "./EditDevisForm";

export default async function EditDevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const devis = await prisma.devis.findUnique({
    where: { id, userId: session.user.id },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!devis) notFound();

  if (devis.status === "INVOICED") {
    redirect("/devis");
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/devis" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour aux devis
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Modifier {devis.number}</h1>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
        <EditDevisForm
          devisId={devis.id}
          clients={clients}
          defaultValues={{
            clientId: devis.clientId,
            tvaRate: Number(devis.tvaRate),
            items: devis.items.map((item) => ({
              designation: item.designation,
              quantity: Number(item.quantity),
              unitPrice: item.unitPrice,
            })),
          }}
        />
      </div>
    </div>
  );
}
