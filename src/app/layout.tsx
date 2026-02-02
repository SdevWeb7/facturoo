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
    default: "Facturoo – Logiciel devis et factures pour artisans",
    template: "%s | Facturoo",
  },
  description:
    "Créez vos devis et factures en 2 minutes. Logiciel en ligne simple et conforme pour les artisans français. Gratuit pour commencer.",
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
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://facturoo.vercel.app",
    siteName: "Facturoo",
    title: "Facturoo – Logiciel devis et factures pour artisans",
    description:
      "Créez vos devis et factures en 2 minutes. Logiciel en ligne simple et conforme pour les artisans français.",
    images: [
      {
        url: "/images/og-facturoo.png",
        width: 1200,
        height: 630,
        alt: "Facturoo – Devis et factures pour artisans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Facturoo – Logiciel devis et factures pour artisans",
    description:
      "Créez vos devis et factures en 2 minutes. Logiciel en ligne simple et conforme pour les artisans français.",
    images: ["/images/og-facturoo.png"],
  },
  alternates: {
    canonical: "https://facturoo.vercel.app",
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
