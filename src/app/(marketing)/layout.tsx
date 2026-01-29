import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-primary font-display">
            Facturoo
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Tarifs
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
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

      {/* Footer */}
      <footer className="border-t bg-muted/50 bg-texture">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold font-display">Facturoo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Devis et factures pour artisans.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-foreground">
                Tarifs
              </Link>
              <Link href="/login" className="hover:text-foreground">
                Connexion
              </Link>
              <Link href="/register" className="hover:text-foreground">
                Inscription
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Facturoo. Tous droits
            r&eacute;serv&eacute;s.
          </p>
        </div>
      </footer>
    </div>
  );
}
