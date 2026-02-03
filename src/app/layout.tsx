import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://facturoo.vercel.app"),
  title: {
    default: "Facturoo — Devis & factures en 2 minutes",
    template: "%s | Facturoo",
  },
  description:
    "L'outil simple pour les artisans : créez, envoyez et gérez vos devis et factures sans Excel.",
  keywords: [
    "devis",
    "factures",
    "artisan",
    "logiciel facturation",
    "facturation en ligne",
    "devis artisan",
    "facture artisan",
    "logiciel devis",
    "gestion devis factures",
    "auto-entrepreneur",
  ],
  authors: [{ name: "Facturoo" }],
  creator: "Facturoo",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Facturoo — Devis et Factures pour Artisans | Simple et Rapide",
    description:
      "Créez vos devis et factures professionnels en 2 minutes. L'outil de facturation simple et conforme, pensé pour les artisans français. Essai gratuit.",
    url: "https://facturoo.vercel.app",
    siteName: "Facturoo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facturoo — Devis et Factures pour Artisans | Simple et Rapide",
    description:
      "Créez vos devis et factures professionnels en 2 minutes. L'outil de facturation simple et conforme, pensé pour les artisans français. Essai gratuit.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${plusJakartaSans.variable} ${dmSerifDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
