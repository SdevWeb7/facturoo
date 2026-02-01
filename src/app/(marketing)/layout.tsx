import Link from "next/link";

import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar — sticky glass */}
      <header className="sticky top-0 z-50 border-b surface-glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-display">Facturoo</span>
          </Link>
          <MobileNav />
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Aide
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Connexion
            </Link>
            <Button size="sm" asChild>
              <Link href="/register">Essai gratuit</Link>
            </Button>
          </nav>
        </div>
      </header>

      {children}

      {/* Footer — multi-columns */}
      <footer className="border-t bg-muted/50 bg-texture">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-display">Facturoo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Devis et factures pour artisans français. Simple, rapide, conforme.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground transition-colors">
                    Essai gratuit
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    Aide / FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/mentions-legales" className="hover:text-foreground transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="hover:text-foreground transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="hover:text-foreground transition-colors">
                    CGV
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="cursor-default">support@facturoo.app</span>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Formulaire de contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8">
            <p className="text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Facturoo. Tous droits
              r&eacute;serv&eacute;s.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
