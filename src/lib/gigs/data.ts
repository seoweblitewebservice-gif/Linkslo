import { asc, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs, type BacklinkGig } from "@/db/schema";
import { ensureGigsSeeded } from "@/db/gig-seed";
import type {
  GigBenefit,
  GigFaq,
  GigPackage,
  GigReview,
  GigStep,
  HydratedGig,
} from "@/lib/gigs/types";

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function hydrateGig(row: BacklinkGig): HydratedGig {
  return {
    ...row,
    packages: parseJson<GigPackage[]>(row.packages, []),
    included: parseJson<string[]>(row.included, []),
    benefits: parseJson<GigBenefit[]>(row.benefits, []),
    process: parseJson<GigStep[]>(row.process, []),
    useCases: parseJson<string[]>(row.useCases, []),
    faqs: parseJson<GigFaq[]>(row.faqs, []),
    reviews: parseJson<GigReview[]>(row.reviews, []),
  };
}

export async function getGigBySlug(slug: string) {
  await ensureGigsSeeded();
  const rows = await db.select().from(backlinkGigs).where(eq(backlinkGigs.slug, slug)).limit(1);
  return rows[0] ? hydrateGig(rows[0]) : null;
}

export async function getRelatedMarketplaceGigs(gig: HydratedGig, limit = 4) {
  await ensureGigsSeeded();
  const rows = await db
    .select()
    .from(backlinkGigs)
    .where(eq(backlinkGigs.category, gig.category))
    .orderBy(desc(backlinkGigs.featured), asc(backlinkGigs.startingPrice), desc(backlinkGigs.id))
    .limit(limit + 1);
  return rows
    .filter((row) => row.id !== gig.id)
    .slice(0, limit)
    .map(hydrateGig);
}

export async function getGigFacets() {
  await ensureGigsSeeded();
  const [categories, subcategories, industries, countries, languages] = await Promise.all([
    db.selectDistinct({ value: backlinkGigs.category }).from(backlinkGigs).orderBy(asc(backlinkGigs.category)),
    db.selectDistinct({ value: backlinkGigs.subcategory }).from(backlinkGigs).orderBy(asc(backlinkGigs.subcategory)),
    db.selectDistinct({ value: backlinkGigs.industry }).from(backlinkGigs).orderBy(asc(backlinkGigs.industry)),
    db.selectDistinct({ value: backlinkGigs.country }).from(backlinkGigs).orderBy(asc(backlinkGigs.country)),
    db.selectDistinct({ value: backlinkGigs.language }).from(backlinkGigs).orderBy(asc(backlinkGigs.language)),
  ]);
  return {
    categories: categories.map((row) => row.value),
    subcategories: subcategories.map((row) => row.value),
    industries: industries.map((row) => row.value),
    countries: countries.map((row) => row.value),
    languages: languages.map((row) => row.value),
  };
}

export async function getFeaturedMarketplaceGigs(limit = 6) {
  await ensureGigsSeeded();
  const rows = await db
    .select()
    .from(backlinkGigs)
    .orderBy(desc(backlinkGigs.featured), asc(backlinkGigs.startingPrice), desc(backlinkGigs.id))
    .limit(limit);
  return rows.map(hydrateGig);
}

export async function getGigSitemapRows() {
  await ensureGigsSeeded();
  // Only named-domain guest-post inventory is currently eligible for XML
  // sitemap discovery. Generic generated marketplace variants remain
  // browseable internally but are not proactively submitted to search engines.
  return db
    .select({ slug: backlinkGigs.slug, createdAt: backlinkGigs.createdAt })
    .from(backlinkGigs)
    .where(isNotNull(backlinkGigs.domain))
    .orderBy(asc(backlinkGigs.id));
}
