import Link from "next/link";
import { ClientForm } from "@/components/forms/ClientForm";
import { createClient } from "@/actions/clients";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/clients" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux clients
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nouveau client</h1>
      </div>

      <div className="max-w-lg rounded-lg border bg-card p-6">
        <ClientForm action={createClient} submitLabel="Créer le client" />
      </div>
    </div>
  );
}
