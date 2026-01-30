"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6 shadow-warm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm text-muted-foreground">
          {session?.user?.name || session?.user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </header>
  );
}
