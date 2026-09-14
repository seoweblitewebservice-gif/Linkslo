import type { MetadataRoute } from "next";
import { LEGAL_PAGES } from "@/lib/content";
import { BACKLINK_SERVICES, COUNTRY_PAGES, INDUSTRY_PAGES } from "@/lib/backlinks";
import { getArticles, getCaseStudies } from "@/lib/queries";
import { getGigSitemapRows } from "@/lib/gigs/data";

const BASE = "https://linkslo.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, caseStudies, gigs] = await Promise.all([
    getArticles(),
    getCaseStudies(),
    getGigSitemapRows(),
  ]);
  const now = new Date();

  const staticRoutes = [
    "",
    "/backlinks",
    "/backlinks/industry",
    "/backlinks/country",
    "/marketplace",
    "/pricing",
    "/resources",
    "/case-studies",
    "/tools/link-gap-scout",
    "/dashboard",
    "/about",
    "/contact",
    "/login",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/backlinks" ? 0.95 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...BACKLINK_SERVICES.map((service) => ({
      url: `${BASE}/backlinks/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...INDUSTRY_PAGES.map((industry) => ({
      url: `${BASE}/backlinks/industry/${industry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...COUNTRY_PAGES.map((country) => ({
      url: `${BASE}/backlinks/country/${country.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...articles.map((article) => ({
      url: `${BASE}/resources/${article.slug}`,
      lastModified: new Date(article.publishedOn),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...caseStudies.map((study) => ({
      url: `${BASE}/case-studies/${study.slug}`,
      lastModified: now,
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
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
