import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/subscription";
import { Badge } from "@/components/ui/badge";
import { ExportPanel } from "./ExportPanel";

export default async function ExportPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await hasActiveSubscription(session.user.id);
  if (!active) redirect("/settings");

  return (
    <div>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Export comptable</h1>
          <Badge variant="default" className="h-5 px-1.5 py-0 text-[10px]">
            Pro
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Gagnez du temps avec votre comptable : exportez tous vos documents en 1 clic.
        </p>
      </div>

      <div className="mt-8">
        <ExportPanel />
      </div>
    </div>
  );
}
