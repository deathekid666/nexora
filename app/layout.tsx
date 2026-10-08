import type { Metadata } from "next";
import "./globals.css";
import "./source-redesign.css";
import "./lhawta.css";
import "./lhawta-reference.css";
import "./phase5.css";
import "./mobile-rebuild.css";
import "./mobile-hero-redesign.css";
import "./mobile-native-home.css";

export const metadata: Metadata = {
  title: "LHAWTA — New tech. Clear choices.",
  description: "Smartphones, tablettes, consoles et électronique au Maroc. Commandez chez LHAWTA sur WhatsApp, avec livraison et paiement à la réception.",
  openGraph: { title: "LHAWTA | High-tech au Maroc", description: "Découvrez les nouveautés high-tech et commandez sur WhatsApp.", type: "website", locale: "fr_MA" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
