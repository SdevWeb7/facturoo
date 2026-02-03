"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import { ClientActionsMenu } from "./ClientActionsMenu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export function ClientCard({ client }: ClientCardProps) {
  const router = useRouter();

  return (
    <Card
      className="p-4 transition-colors hover:bg-muted/50 active:bg-muted cursor-pointer"
      onClick={() => router.push(`/clients/${client.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={client.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium truncate">{client.name}</p>
            {client.email && (
              <p className="text-sm text-muted-foreground truncate">{client.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/devis/new?clientId=${client.id}`}>
              <FileText className="h-4 w-4" />
              <span className="sr-only">Nouveau devis</span>
            </Link>
          </Button>
          <ClientActionsMenu clientId={client.id} />
        </div>
      </div>
      {client.phone && (
        <p className="mt-1 ml-11 text-sm text-muted-foreground">{client.phone}</p>
      )}
    </Card>
  );
}
