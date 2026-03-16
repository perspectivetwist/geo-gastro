import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "GEO Scanner – Wirst du von KI gefunden?",
  description:
    "Kostenloses Tool: prüfe ob deine Website in ChatGPT, Perplexity und Google AI Overviews sichtbar ist. GEO-Score in 20 Sekunden.",
  openGraph: {
    title: "GEO Scanner – Wirst du von KI gefunden?",
    description:
      "GEO-Score kostenlos messen. Finde heraus wie sichtbar deine Website für KI-Suchmaschinen ist.",
    url: "https://geo-transformer.vercel.app",
    siteName: "GEO Scanner",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GEO Scanner – KI-Sichtbarkeit prüfen",
    description: "Kostenloser GEO-Score für deine Website.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
