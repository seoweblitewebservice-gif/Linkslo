import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BRAND } from "@/lib/content";
import { PAYPAL_SDK_SRC } from "@/lib/paypal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://linkslo.com"),
  title: {
    default: `${BRAND.name} — 8,886 Backlink Gigs & Link Building Marketplace`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Browse 8,886 backlink gigs from 160 verified specialists, including 6,686 real named guest post publishers. Compare Basic, Standard and Premium packages across guest posts, niche edits, editorial links, digital PR, industries and countries.",
  keywords: [
    "backlink services",
    "link building services",
    "guest post backlinks",
    "niche edit backlinks",
    "editorial backlinks",
    "digital PR backlinks",
    "backlink marketplace",
  ],
  applicationName: BRAND.name,
  authors: [{ name: BRAND.legalName }],
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} — 8,886 backlink gigs, three packages each`,
    description:
      "Compare backlink specialists, service categories, industries and countries with transparent packages and no private blog networks.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Backlink & link building services`,
    description:
      "Screened publishers, verifiable metrics, and every campaign reviewed by a person before it goes live.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#061419",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-white text-ink-900 antialiased">
          <Script src={PAYPAL_SDK_SRC} strategy="afterInteractive" />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
