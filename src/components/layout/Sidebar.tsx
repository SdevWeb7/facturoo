"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Download,
  HelpCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/devis", label: "Devis", icon: FileText },
  { href: "/factures", label: "Factures", icon: Receipt },
  { href: "/export", label: "Export", icon: Download, pro: true },
  { href: "/aide", label: "Aide", icon: HelpCircle },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || session?.user?.email || "Utilisateur";

  return (
    <div className="flex h-full flex-col">
      {/* User section */}
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={userName} size="sm" className="bg-sidebar-accent text-sidebar-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {session?.user?.name || "Mon compte"}
            </p>
            {session?.user?.email && (
              <p className="truncate text-xs text-sidebar-foreground/60">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start gap-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isActive && "border-l-2 border-white bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent font-semibold"
              )}
            >
              <Link href={item.href} onClick={onNavigate}>
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.pro && (
                  <Badge variant="default" className="ml-auto h-5 px-1.5 py-0 text-[10px]">
                    Pro
                  </Badge>
                )}
                {item.href === "/aide" && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <Button
          variant="ghost"
          asChild
          className={cn(
            "w-full justify-start gap-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            (pathname === "/settings" || pathname.startsWith("/settings/")) &&
              "border-l-2 border-white bg-sidebar-accent text-sidebar-foreground font-semibold"
          )}
        >
          <Link href="/settings" onClick={onNavigate}>
            <Settings className="h-5 w-5" />
            Paramètres
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar bg-gradient-to-b from-sidebar to-sidebar/95">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo_facturoo.png" alt="Facturoo" width={635} height={172} className="h-8 w-auto brightness-0 invert" />
          </Link>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
            Pro
          </Badge>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile/tablet drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <SheetHeader className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <SheetTitle>
              <Image src="/logo_facturoo.png" alt="Facturoo" width={635} height={172} className="h-8 w-auto brightness-0 invert" />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation principale
            </SheetDescription>
          </SheetHeader>
          <SidebarContent onNavigate={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
