import { and, asc, desc, eq, gte, ilike, isNotNull, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { ensureGigsSeeded } from "@/db/gig-seed";

/**
 * Shared query behind the "Find the right publisher" explorer (real,
 * price-listed guest post inventory — backlinkGigs rows with a non-null
 * `domain`). Used both by the client-side /api/marketplace route (for live
 * filter changes) and directly from server components (so the first page of
 * results is present in the initial server-rendered HTML for crawlers).
 */
const SORTS = {
  relevance: [sql`${backlinkGigs.authority} DESC NULLS LAST`, desc(backlinkGigs.rating)],
  "authority-desc": [sql`${backlinkGigs.authority} DESC NULLS LAST`],
  "authority-asc": [sql`${backlinkGigs.authority} ASC NULLS LAST`],
  "traffic-desc": [sql`${backlinkGigs.organicTraffic} DESC NULLS LAST`],
  "price-asc": [asc(backlinkGigs.startingPrice)],
  "price-desc": [desc(backlinkGigs.startingPrice)],
  "delivery-asc": [asc(backlinkGigs.fastestDeliveryDays)],
} as const;

export type MarketplaceSortKey = keyof typeof SORTS;

export type MarketplaceQueryParams = {
  q?: string;
  industry?: string;
  country?: string;
  language?: string;
  linkType?: string;
  minAuthority?: number;
  minTraffic?: number;
  maxPrice?: number;
  sort?: MarketplaceSortKey;
  page?: number;
  pageSize?: number;
};

export type MarketplaceListing = {
  id: number;
  slug: string;
  domain: string;
  displayName: string;
  industry: string;
  country: string;
  language: string;
  authority: number;
  organicTraffic: number;
  price: number;
  linkType: string;
  publicationType: string;
  turnaroundDays: number;
  relevance: number;
  reviewCount: number;
  featured: boolean;
};

export type MarketplaceQueryResult = {
  items: MarketplaceListing[];
  total: number;
  page: number;
  pageSize: number;
  summary: { avgAuthority: number; medianPrice: number; avgDelivery: number };
};

export async function queryMarketplaceListings(params: MarketplaceQueryParams): Promise<MarketplaceQueryResult> {
  await ensureGigsSeeded();

  const query = params.q?.trim() ?? "";
  const industry = params.industry ?? "";
  const country = params.country ?? "";
  const language = params.language ?? "";
  const linkType = params.linkType ?? "";
  const minAuthority = params.minAuthority ?? 0;
  const minTraffic = params.minTraffic ?? 0;
  const maxPrice = params.maxPrice ?? 0;
  const sort = params.sort ?? "relevance";
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 12, 1), 48);

  const filters: SQL[] = [isNotNull(backlinkGigs.domain)];
  if (query) {
    const like = `%${query}%`;
    const search = or(
      ilike(backlinkGigs.domain, like),
      ilike(backlinkGigs.title, like),
      ilike(backlinkGigs.industry, like),
    );
    if (search) filters.push(search);
  }
  if (industry) filters.push(eq(backlinkGigs.industry, industry));
  if (country) filters.push(eq(backlinkGigs.country, country));
  if (language) filters.push(eq(backlinkGigs.language, language));
  if (linkType) filters.push(eq(backlinkGigs.linkType, linkType));
  if (minAuthority > 0) filters.push(gte(backlinkGigs.authority, minAuthority));
  if (minTraffic > 0) filters.push(gte(backlinkGigs.organicTraffic, minTraffic));
  if (maxPrice > 0) filters.push(lte(backlinkGigs.startingPrice, maxPrice));

  const where = and(...filters);
  const orderBy = SORTS[sort] ?? SORTS.relevance;

  const [rows, totals] = await Promise.all([
    db
      .select({
        id: backlinkGigs.id,
        slug: backlinkGigs.slug,
        domain: backlinkGigs.domain,
        industry: backlinkGigs.industry,
        country: backlinkGigs.country,
        language: backlinkGigs.language,
        authority: backlinkGigs.authority,
        organicTraffic: backlinkGigs.organicTraffic,
        price: backlinkGigs.startingPrice,
        linkType: backlinkGigs.linkType,
        turnaroundDays: backlinkGigs.fastestDeliveryDays,
        rating: backlinkGigs.rating,
        reviewCount: backlinkGigs.reviewCount,
        featured: backlinkGigs.featured,
      })
      .from(backlinkGigs)
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({
        total: sql<number>`cast(count(*) as int)`,
        avgAuthority: sql<number>`coalesce(cast(round(avg(${backlinkGigs.authority})) as int), 0)`,
        medianPrice: sql<number>`coalesce(cast(percentile_disc(0.5) within group (order by ${backlinkGigs.startingPrice}) as int), 0)`,
        avgDelivery: sql<number>`coalesce(cast(round(avg(${backlinkGigs.fastestDeliveryDays})) as int), 0)`,
      })
      .from(backlinkGigs)
      .where(where),
  ]);

  const items: MarketplaceListing[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    domain: row.domain ?? "",
    displayName: row.domain ?? "",
    industry: row.industry,
    country: row.country,
    language: row.language,
    authority: row.authority ?? 0,
    organicTraffic: row.organicTraffic ?? 0,
    price: row.price,
    linkType: row.linkType ?? "dofollow",
    publicationType: "Guest Post",
    turnaroundDays: row.turnaroundDays,
    relevance: row.rating,
    reviewCount: row.reviewCount,
    featured: row.featured,
  }));

  return {
    items,
    total: totals[0]?.total ?? 0,
    page,
    pageSize,
    summary: {
      avgAuthority: totals[0]?.avgAuthority ?? 0,
      medianPrice: totals[0]?.medianPrice ?? 0,
      avgDelivery: totals[0]?.avgDelivery ?? 0,
    },
  };
}
