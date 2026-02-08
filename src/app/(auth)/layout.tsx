import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary via-primary to-primary-hover p-12 text-primary-foreground">
        <div>
          <Link href="/" className="text-2xl font-bold font-display">
            Facturoo
          </Link>
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display leading-snug">
            Vos devis et factures
            <br />
            en 2 minutes, sans Excel.
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 leading-relaxed">
            L&apos;outil pensé pour les artisans fran&ccedil;ais.
            Cr&eacute;ez, envoyez et g&eacute;rez en toute confiance.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-primary-foreground/60">
          <Shield className="h-4 w-4" />
          <span>Vos données sont sécurisées et hébergées en Europe</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 min-w-0 flex-col items-center justify-center bg-muted bg-texture px-6 py-8">
        <div className="mb-8 lg:hidden">
          <Link href="/" className="text-2xl font-bold text-primary font-display">
            Facturoo
          </Link>
        </div>
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="rounded-2xl bg-card p-8 shadow-warm ring-1 ring-border/50">
            {children}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Vos données sont sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}
