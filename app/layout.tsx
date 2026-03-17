import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import JsonLdSchema from "@/components/JsonLdSchema";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
  verification: { other: { 'msvalidate.01': '4238BAC83D0A84184DB5C8AEF5C3CE14' } },
  robots: { index: true, follow: true },
  title: "Restaurant-Ruf in ChatGPT | GEO Scanner für Gastronomie",
  description:
    "Kostenloser GEO-Scan für die Gastronomie: Wie gut ist dein Restaurant-Ruf in ChatGPT, Perplexity und Google AI sichtbar?",
  openGraph: {
    title: "Restaurant-Ruf in ChatGPT | GEO Scanner für Gastronomie",
    description:
      "Kostenloser GEO-Scan für die Gastronomie: Wie gut ist dein Restaurant-Ruf in ChatGPT, Perplexity und Google AI sichtbar?",
    url: "https://geo-gastro.vercel.app",
    siteName: "GEO Gastro Scanner",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Restaurant-Ruf in ChatGPT | GEO Scanner für Gastronomie",
    description: "Kostenloser GEO-Scan für die Gastronomie: Wie gut ist dein Restaurant-Ruf in ChatGPT, Perplexity und Google AI sichtbar?",
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
        <GoogleAnalytics />
        <JsonLdSchema />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
