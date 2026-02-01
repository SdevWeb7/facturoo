"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
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
      <SheetContent side="right" className="w-72 px-6 pt-12" aria-describedby={undefined}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Menu de navigation principal</SheetDescription>
        <nav className="flex flex-col gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
          <Button asChild className="mt-4">
            <Link href="/register" onClick={() => setOpen(false)}>
              Essai gratuit
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
