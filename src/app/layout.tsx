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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Facturoo",
    description:
      "Créez vos devis et factures en 2 minutes. Simple, rapide, pensé pour les artisans.",
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
    title: "Facturoo",
    description: "Devis & factures en 2 minutes, sans Excel.",
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
