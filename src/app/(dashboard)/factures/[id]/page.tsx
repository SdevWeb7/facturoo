import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, computeTotals } from "@/lib/utils";

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

  return (
    <div>
      <div className="mb-6">
        <Link href="/factures" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour aux factures
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Facture {facture.number}</h1>
          <a
            href={`/api/pdf/facture/${facture.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Télécharger le PDF
          </a>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* Info */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Client</h3>
            <p className="mt-1 text-sm font-medium text-gray-900">{facture.client.name}</p>
            <p className="text-sm text-gray-500">{facture.client.email}</p>
            {facture.client.address && (
              <p className="text-sm text-gray-500">{facture.client.address}</p>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(facture.date).toLocaleDateString("fr-FR")}
            </p>
            <h3 className="mt-3 text-sm font-medium text-gray-500">TVA</h3>
            <p className="mt-1 text-sm text-gray-900">{Number(facture.tvaRate)}%</p>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Désignation
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Qté
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                P.U. HT
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Total HT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {facture.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{item.designation}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {Number(item.quantity)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(Math.round(Number(item.quantity) * item.unitPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total HT</span>
              <span className="font-medium">{formatCurrency(totals.totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">TVA ({Number(facture.tvaRate)}%)</span>
              <span className="font-medium">{formatCurrency(totals.totalTVA)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
              <span className="font-semibold">Total TTC</span>
              <span className="font-semibold">{formatCurrency(totals.totalTTC)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
