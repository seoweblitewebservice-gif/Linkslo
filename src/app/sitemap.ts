import type { MetadataRoute } from "next";
import { LEGAL_PAGES } from "@/lib/content";
import { BACKLINK_SERVICES, COUNTRY_PAGES, INDUSTRY_PAGES } from "@/lib/backlinks";
import { getArticles } from "@/lib/queries";
import { getGigSitemapRows } from "@/lib/gigs/data";

const BASE = "https://www.linkslo.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, gigs] = await Promise.all([
    getArticles(),
    getGigSitemapRows(),
  ]);

  // Keep only public, indexable routes in the sitemap. Authentication/account,
  // checkout and demonstration/sample routes are excluded because they are
  // intentionally noindex.
  const staticRoutes = [
    "",
    "/backlinks",
    "/backlinks/industry",
    "/backlinks/country",
    "/marketplace",
    "/pricing",
    "/resources",
    "/about",
    "/contact",
    "/tools",
    "/tools/guest-post-pricing-calculator",
    "/tools/anchor-text-ratio-checker",
    "/tools/link-building-budget-calculator",
    "/tools/outreach-email-generator",
    "/tools/da-vs-dr-checker",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/backlinks" ? 0.95 : path.startsWith("/tools/") ? 0.7 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...BACKLINK_SERVICES.map((service) => ({
      url: `${BASE}/backlinks/${service.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...INDUSTRY_PAGES.map((industry) => ({
      url: `${BASE}/backlinks/industry/${industry.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...COUNTRY_PAGES.map((country) => ({
      url: `${BASE}/backlinks/country/${country.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...articles.map((article) => ({
      url: `${BASE}/resources/${article.slug}`,
      lastModified: new Date(article.publishedOn),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...gigs.map((gig) => ({
      url: `${BASE}/marketplace/gigs/${gig.slug}`,
      lastModified: gig.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...Object.keys(LEGAL_PAGES).map((slug) => ({
      url: `${BASE}/legal/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
