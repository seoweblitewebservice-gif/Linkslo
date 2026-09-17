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
import { SocialSidebar } from "@/components/site/SocialSidebar";
import { BRAND } from "@/lib/content";
import { PAYPAL_SDK_SRC } from "@/lib/paypal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.linkslo.com"),
  title: {
    default: `${BRAND.name} — Backlink & Link Building Services`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Compare backlink services, guest post opportunities and link-building packages across industries and countries, with transparent scope, pricing and delivery details.",
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  verification: {
    google: "LQzmGTCMcchihYnjzHkVH9NlUCAuT5pfk79_M9lrPvQ",
  },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} — Backlink & Link Building Services`,
    description:
      "Compare backlink services, service categories, industries and countries with transparent packages and documented delivery details.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#061419",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: "https://www.linkslo.com",
    email: BRAND.email,
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-white text-ink-900 antialiased">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <Script src={PAYPAL_SDK_SRC} strategy="afterInteractive" />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SocialSidebar />
        </body>
      </html>
    </ClerkProvider>
  );
}
