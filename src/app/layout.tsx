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
import { ActivityNotifications } from "@/components/site/ActivityNotifications";
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
    "Browse 8,886 backlink gigs from 160 verified specialists, including 6,686 real named guest post publishers. Compare Basic, Standard and Premium packages across guest posts, niche edits, editorial links, digital PR, industries and countries.",
  applicationName: BRAND.name,
  authors: [{ name: BRAND.legalName }],
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} — Backlink & Link Building Services`,
    description:
      "Compare backlink specialists, service categories, industries and countries with transparent packages and no private blog networks.",
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
    legalName: BRAND.legalName,
    url: "https://www.linkslo.com",
    logo: "https://www.linkslo.com/favicon.svg",
    email: BRAND.email,
    telephone: BRAND.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.addressLines[0],
      addressLocality: "Amsterdam",
      postalCode: BRAND.addressLines[1]?.split(" ")[0],
      addressCountry: "NL",
    },
    sameAs: [
      "https://www.linkedin.com",
      "https://x.com",
      "https://youtube.com",
      "https://github.com",
    ],
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
          <ActivityNotifications />
        </body>
      </html>
    </ClerkProvider>
  );
}
