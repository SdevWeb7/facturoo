import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Facturoo
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Tarifs
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Essai gratuit
            </Link>
          </nav>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">Facturoo</p>
              <p className="mt-1 text-sm text-gray-500">
                Devis et factures pour artisans.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/pricing" className="hover:text-gray-700">
                Tarifs
              </Link>
              <Link href="/login" className="hover:text-gray-700">
                Connexion
              </Link>
              <Link href="/register" className="hover:text-gray-700">
                Inscription
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Facturoo. Tous droits
            r&eacute;serv&eacute;s.
          </p>
        </div>
      </footer>
    </div>
  );
}
