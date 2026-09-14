import { and, asc, desc, eq, gte, ilike, isNotNull, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { ensureGigsSeeded } from "@/db/gig-seed";

export const dynamic = "force-dynamic";

/**
 * Backs the "Find the right publisher" explorer with the real, price-listed
 * guest post inventory (backlinkGigs rows with a non-null `domain`), instead
 * of the earlier generated `publishers` demo table. Every row here is a
 * live, purchasable gig at /marketplace/gigs/{slug}.
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

type SortKey = keyof typeof SORTS;

export async function GET(request: Request) {
  try {
    await ensureGigsSeeded();
    const url = new URL(request.url);
    const params = url.searchParams;

    const query = params.get("q")?.trim() ?? "";
    const industry = params.get("industry") ?? "";
    const country = params.get("country") ?? "";
    const language = params.get("language") ?? "";
    const linkType = params.get("linkType") ?? "";
    const minAuthority = Number(params.get("minAuthority") ?? 0);
    const minTraffic = Number(params.get("minTraffic") ?? 0);
    const maxPrice = Number(params.get("maxPrice") ?? 0);
    const sort = (params.get("sort") ?? "relevance") as SortKey;
    const page = Math.max(Number(params.get("page") ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(params.get("pageSize") ?? 12), 1), 48);

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

    const items = rows.map((row) => ({
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

    return Response.json({
      ok: true,
      items,
      page,
      pageSize,
      total: totals[0]?.total ?? 0,
      summary: {
        avgAuthority: totals[0]?.avgAuthority ?? 0,
        medianPrice: totals[0]?.medianPrice ?? 0,
        avgDelivery: totals[0]?.avgDelivery ?? 0,
      },
    });
  } catch (error) {
    console.error("marketplace query failed", error);
    return Response.json({ ok: false, items: [], total: 0 }, { status: 500 });
  }
}
