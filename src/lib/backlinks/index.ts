import { SERVICES_A } from "@/lib/backlinks/services-a";
import { SERVICES_B } from "@/lib/backlinks/services-b";
import { INDUSTRY_PAGES } from "@/lib/backlinks/industries";
import { COUNTRY_PAGES } from "@/lib/backlinks/countries";
import type { BacklinkService, CountryPage, IndustryPage } from "@/lib/backlinks/types";

export * from "@/lib/backlinks/types";

const SERVICE_ENTRY_PRICES: Record<string, number> = {
  "guest-post-backlinks": 45,
  "editorial-backlinks": 65,
  "contextual-backlinks": 35,
  "niche-edit-backlinks": 40,
  "web-2-0-backlinks": 18,
  "authority-backlinks": 55,
  "local-backlinks": 35,
  "citation-directory-backlinks": 25,
  "forum-community-backlinks": 15,
  "blog-comment-backlinks": 10,
  "social-bookmarking-backlinks": 8,
  "press-release-news-backlinks": 75,
  "digital-pr-backlinks": 160,
  "resource-link-building": 55,
  "broken-link-building": 50,
  "image-infographic-link-building": 65,
  "saas-software-backlinks": 50,
  "edu-gov-resource-links": 70,
  "competitor-link-building": 35,
  "brand-entity-link-building": 40,
  "monthly-link-building": 95,
  "premium-link-building": 125,
};

const DIRECT_PACKAGE_MULTIPLIERS = [1, 3.6, 8.5] as const;

export const BACKLINK_SERVICES: BacklinkService[] = [...SERVICES_A, ...SERVICES_B].map(
  (service) => ({
    ...service,
    packages: service.packages.map((pkg, index) => ({
      ...pkg,
      price:
        Math.round(
          ((SERVICE_ENTRY_PRICES[service.slug] ?? pkg.price) *
            DIRECT_PACKAGE_MULTIPLIERS[index]) /
            5,
        ) * 5 || 5,
    })),
  }),
);

export const SERVICE_BY_SLUG = new Map(BACKLINK_SERVICES.map((item) => [item.slug, item]));
export const INDUSTRY_BY_SLUG = new Map(INDUSTRY_PAGES.map((item) => [item.slug, item]));
export const COUNTRY_BY_SLUG = new Map(COUNTRY_PAGES.map((item) => [item.slug, item]));

export { INDUSTRY_PAGES, COUNTRY_PAGES };

/** Service groups used for navigation and the hub page. */
export const SERVICE_GROUPS = [
  "Placement Services",
  "Foundation Links",
  "Authority & Metrics",
  "Local & Directories",
  "Community Links",
  "PR & News",
  "Outreach Services",
  "Specialist Programmes",
  "Strategy Services",
  "Campaign Programmes",
] as const;

export function servicesByGroup(group: string) {
  return BACKLINK_SERVICES.filter((service) => service.group === group);
}

export function getService(slug: string) {
  return SERVICE_BY_SLUG.get(slug) ?? null;
}

export function getIndustry(slug: string) {
  return INDUSTRY_BY_SLUG.get(slug) ?? null;
}

export function getCountry(slug: string) {
  return COUNTRY_BY_SLUG.get(slug) ?? null;
}

export function getRelatedServices(slugs: string[]) {
  return slugs
    .map((slug) => SERVICE_BY_SLUG.get(slug))
    .filter((item): item is BacklinkService => Boolean(item));
}

/** Lowest package price across a service, used for "from" pricing. */
export function startingPrice(service: BacklinkService) {
  return Math.min(...service.packages.map((pkg) => pkg.price));
}

export function averageRating(service: BacklinkService) {
  if (!service.reviews.length) return 5;
  const total = service.reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / service.reviews.length;
}

export type { BacklinkService, IndustryPage, CountryPage };
