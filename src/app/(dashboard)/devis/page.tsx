import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";
import { DeleteDevisButton } from "./DeleteDevisButton";
import { ConvertDevisButton } from "./ConvertDevisButton";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-gray-100 text-gray-700" },
  SENT: { label: "Envoyé", className: "bg-blue-100 text-blue-700" },
  INVOICED: { label: "Facturé", className: "bg-green-100 text-green-700" },
};

export default async function DevisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const devisList = await prisma.devis.findMany({
    where: { userId: session.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devis</h1>
        <Link
          href="/devis/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Nouveau devis
        </Link>
      </div>

      {devisList.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Aucun devis pour le moment.</p>
          <Link
            href="/devis/new"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Créer votre premier devis
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total TTC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {devisList.map((devis) => {
                const itemsForCalc = devis.items.map((item) => ({
                  quantity: Number(item.quantity),
                  unitPrice: item.unitPrice,
                }));
                const totals = computeTotals(itemsForCalc, Number(devis.tvaRate));
                const statusInfo = STATUS_LABELS[devis.status];

                return (
                  <tr key={devis.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {devis.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {devis.client.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(totals.totalTTC)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(devis.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <a
                        href={`/api/pdf/devis/${devis.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-600 hover:text-gray-500"
                      >
                        PDF
                      </a>
                      {devis.status !== "INVOICED" && (
                        <Link
                          href={`/devis/${devis.id}/edit`}
                          className="ml-4 font-medium text-blue-600 hover:text-blue-500"
                        >
                          Modifier
                        </Link>
                      )}
                      {devis.status === "SENT" && (
                        <ConvertDevisButton devisId={devis.id} />
                      )}
                      {devis.status !== "INVOICED" && (
                        <DeleteDevisButton devisId={devis.id} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
