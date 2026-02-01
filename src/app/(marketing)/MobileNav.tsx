"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/pricing", label: "Tarifs" },
  { href: "/faq", label: "Aide" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Connexion" },
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="mt-8 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
          <Button size="sm" asChild className="mt-2">
            <Link href="/register" onClick={() => setOpen(false)}>
              Essai gratuit
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
