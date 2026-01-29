import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, computeTotals } from "@/lib/utils";

export default async function FacturesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const factures = await prisma.facture.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Factures</h1>
      </div>

      {factures.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Aucune facture pour le moment.</p>
          <p className="mt-1 text-sm text-gray-400">
            Les factures sont créées à partir des devis envoyés.
          </p>
          <Link
            href="/devis"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Voir les devis
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
              {factures.map((facture) => {
                const itemsForCalc = facture.items.map((item) => ({
                  quantity: Number(item.quantity),
                  unitPrice: item.unitPrice,
                }));
                const totals = computeTotals(itemsForCalc, Number(facture.tvaRate));

                return (
                  <tr key={facture.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {facture.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {facture.client.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(totals.totalTTC)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(facture.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/factures/${facture.id}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Voir
                      </Link>
                      <a
                        href={`/api/pdf/facture/${facture.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 font-medium text-gray-600 hover:text-gray-500"
                      >
                        PDF
                      </a>
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
