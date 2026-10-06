import type { Metadata } from "next";
import "./globals.css";
import "./source-redesign.css";
import "./lhawta.css";
import "./lhawta-reference.css";

export const metadata: Metadata = {
  title: "LHAWTA — New tech. Clear choices.",
  description: "Brand-new smartphones, tablets and consumer electronics in Morocco, with clear prices, warranty, delivery and comparison.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
