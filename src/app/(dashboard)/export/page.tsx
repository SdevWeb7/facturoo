import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/subscription";
import { ExportPanel } from "./ExportPanel";

export default async function ExportPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await hasActiveSubscription(session.user.id);
  if (!active) redirect("/settings");

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Export comptable</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exportez vos factures et devis au format CSV ou PDF
        </p>
      </div>

      <div className="mt-8">
        <ExportPanel />
      </div>
    </div>
  );
}
