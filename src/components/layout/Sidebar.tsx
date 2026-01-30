"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  { href: "/settings", label: "Paramètres", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
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
              "w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isActive && "bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Link href={item.href} onClick={onNavigate}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function Sidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="text-xl font-bold text-sidebar-foreground font-display">
            Facturoo
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile/tablet drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <SheetHeader className="flex h-16 items-center border-b border-sidebar-border px-6">
            <SheetTitle className="text-xl font-bold text-sidebar-foreground font-display">
              Facturoo
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
