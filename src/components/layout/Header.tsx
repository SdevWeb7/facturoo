"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, Plus, FileText, Users, Receipt, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/clients": "Clients",
  "/clients/new": "Nouveau client",
  "/devis": "Devis",
  "/devis/new": "Nouveau devis",
  "/factures": "Factures",
  "/settings": "Paramètres",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.includes("/clients/") && pathname.includes("/edit")) return "Modifier le client";
  if (pathname.includes("/devis/") && pathname.includes("/edit")) return "Modifier le devis";
  if (pathname.includes("/factures/")) return "Détail facture";
  return "Facturoo";
}

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const userName = session?.user?.name || session?.user?.email || "Utilisateur";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/80 surface-glass px-4 lg:px-6 shadow-warm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <h2 className="text-lg font-semibold font-display">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Créer</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/clients/new" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nouveau client
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/devis/new" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nouveau devis
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <Avatar name={userName} size="sm" />
              <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                {session?.user?.name || session?.user?.email}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
