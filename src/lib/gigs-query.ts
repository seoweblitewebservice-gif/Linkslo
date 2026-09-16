import { and, asc, desc, eq, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { ensureGigsSeeded } from "@/db/gig-seed";
import type { GigPackage } from "@/lib/gigs/types";

/**
 * Shared query behind the full gig marketplace (GigMarketplace.tsx). Used by
 * both the client-side /api/gigs route (for live filter changes) and
 * directly from server components, so the first page renders in the initial
 * server HTML instead of an empty "Updating…" state for crawlers.
 */
const SORTS = {
  recommended: [desc(backlinkGigs.featured), desc(backlinkGigs.rating), desc(backlinkGigs.ordersCompleted)],
  bestselling: [desc(backlinkGigs.ordersCompleted), desc(backlinkGigs.reviewCount)],
  "rating-desc": [desc(backlinkGigs.rating), desc(backlinkGigs.reviewCount)],
  "price-asc": [asc(backlinkGigs.startingPrice)],
  "price-desc": [desc(backlinkGigs.startingPrice)],
  "delivery-asc": [asc(backlinkGigs.fastestDeliveryDays)],
  newest: [desc(backlinkGigs.id)],
} as const;

export type GigSortKey = keyof typeof SORTS;

export type GigQueryParams = {
  q?: string;
  category?: string;
  subcategory?: string;
  industry?: string;
  country?: string;
  language?: string;
  sellerLevel?: string;
  maxPrice?: number;
  maxDelivery?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  sort?: GigSortKey;
  page?: number;
  pageSize?: number;
};

function parsePackages(value: string) {
  try {
    return JSON.parse(value) as GigPackage[];
  } catch {
    return [];
  }
}

export async function queryGigs(params: GigQueryParams) {
  await ensureGigsSeeded();

  const query = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const subcategory = params.subcategory ?? "";
  const industry = params.industry ?? "";
  const country = params.country ?? "";
  const language = params.language ?? "";
  const sellerLevel = params.sellerLevel ?? "";
  const maxPrice = params.maxPrice ?? 0;
  const maxDelivery = params.maxDelivery ?? 0;
  const minRating = params.minRating ?? 0;
  const verifiedOnly = params.verifiedOnly ?? false;
  const sort = params.sort ?? "recommended";
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 24, 1), 48);

  const filters: SQL[] = [];
  if (query) {
    const like = `%${query}%`;
    const search = or(
      ilike(backlinkGigs.title, like),
      ilike(backlinkGigs.summary, like),
      ilike(backlinkGigs.category, like),
      ilike(backlinkGigs.subcategory, like),
      ilike(backlinkGigs.industry, like),
      ilike(backlinkGigs.country, like),
      ilike(backlinkGigs.sellerName, like),
    );
    if (search) filters.push(search);
  }
  if (category) filters.push(eq(backlinkGigs.category, category));
  if (subcategory) filters.push(eq(backlinkGigs.subcategory, subcategory));
  if (industry) filters.push(eq(backlinkGigs.industry, industry));
  if (country) filters.push(eq(backlinkGigs.country, country));
  if (language) filters.push(eq(backlinkGigs.language, language));
  if (sellerLevel) filters.push(eq(backlinkGigs.sellerLevel, sellerLevel));
  if (maxPrice > 0) filters.push(lte(backlinkGigs.startingPrice, maxPrice));
  if (maxDelivery > 0) filters.push(lte(backlinkGigs.fastestDeliveryDays, maxDelivery));
  if (minRating > 0) filters.push(gte(backlinkGigs.rating, minRating));
  if (verifiedOnly) filters.push(eq(backlinkGigs.verified, true));

  const where = filters.length ? and(...filters) : undefined;
  const orderBy = SORTS[sort] ?? SORTS.recommended;

  const [rows, totals] = await Promise.all([
    db
      .select({
        id: backlinkGigs.id,
        slug: backlinkGigs.slug,
        title: backlinkGigs.title,
        category: backlinkGigs.category,
        subcategory: backlinkGigs.subcategory,
        industry: backlinkGigs.industry,
        country: backlinkGigs.country,
        language: backlinkGigs.language,
        objective: backlinkGigs.objective,
        summary: backlinkGigs.summary,
        sellerName: backlinkGigs.sellerName,
        sellerHandle: backlinkGigs.sellerHandle,
        sellerInitials: backlinkGigs.sellerInitials,
        sellerCountry: backlinkGigs.sellerCountry,
        sellerLevel: backlinkGigs.sellerLevel,
        sellerResponseHours: backlinkGigs.sellerResponseHours,
        verified: backlinkGigs.verified,
        rating: backlinkGigs.rating,
        reviewCount: backlinkGigs.reviewCount,
        ordersCompleted: backlinkGigs.ordersCompleted,
        startingPrice: backlinkGigs.startingPrice,
        fastestDeliveryDays: backlinkGigs.fastestDeliveryDays,
        packages: backlinkGigs.packages,
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
        avgRating: sql<number>`coalesce(cast(round(avg(${backlinkGigs.rating})) as int), 0)`,
        totalOrders: sql<number>`coalesce(cast(sum(${backlinkGigs.ordersCompleted}) as bigint), 0)`,
        medianPrice: sql<number>`coalesce(cast(percentile_disc(0.5) within group (order by ${backlinkGigs.startingPrice}) as int), 0)`,
        verifiedSellers: sql<number>`cast(count(distinct ${backlinkGigs.sellerHandle}) as int)`,
      })
      .from(backlinkGigs)
      .where(where),
  ]);

  return {
    items: rows.map((row) => ({ ...row, packages: parsePackages(row.packages) })),
    page,
    pageSize,
    total: totals[0]?.total ?? 0,
    summary: {
      avgRating: (totals[0]?.avgRating ?? 0) / 10,
      totalOrders: Number(totals[0]?.totalOrders ?? 0),
      medianPrice: totals[0]?.medianPrice ?? 0,
      verifiedSellers: totals[0]?.verifiedSellers ?? 0,
    },
  };
}
