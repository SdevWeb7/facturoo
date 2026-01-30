import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EditClientForm } from "./EditClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!client) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/clients" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux clients
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Modifier {client.name}</h1>
      </div>

      <div className="mx-auto max-w-lg rounded-lg border bg-card p-6 lg:mx-0">
        <EditClientForm
          clientId={client.id}
          defaultValues={{
            name: client.name,
            email: client.email,
            address: client.address ?? undefined,
            phone: client.phone ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
