import { and, asc, desc, eq, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { publishers } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

const SORTS = {
  relevance: [desc(publishers.relevance), desc(publishers.authority)],
  "authority-desc": [desc(publishers.authority)],
  "authority-asc": [asc(publishers.authority)],
  "traffic-desc": [desc(publishers.organicTraffic)],
  "price-asc": [asc(publishers.price)],
  "price-desc": [desc(publishers.price)],
  "delivery-asc": [asc(publishers.turnaroundDays)],
} as const;

type SortKey = keyof typeof SORTS;

export async function GET(request: Request) {
  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const params = url.searchParams;

    const query = params.get("q")?.trim() ?? "";
    const industry = params.get("industry") ?? "";
    const country = params.get("country") ?? "";
    const language = params.get("language") ?? "";
    const linkType = params.get("linkType") ?? "";
    const publicationType = params.get("publicationType") ?? "";
    const minAuthority = Number(params.get("minAuthority") ?? 0);
    const minTraffic = Number(params.get("minTraffic") ?? 0);
    const maxPrice = Number(params.get("maxPrice") ?? 0);
    const sort = (params.get("sort") ?? "relevance") as SortKey;
    const page = Math.max(Number(params.get("page") ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(params.get("pageSize") ?? 12), 1), 48);

    const filters: SQL[] = [];
    if (query) {
      const like = `%${query}%`;
      const search = or(
        ilike(publishers.domain, like),
        ilike(publishers.displayName, like),
        ilike(publishers.industry, like),
      );
      if (search) filters.push(search);
    }
    if (industry) filters.push(eq(publishers.industry, industry));
    if (country) filters.push(eq(publishers.country, country));
    if (language) filters.push(eq(publishers.language, language));
    if (linkType) filters.push(eq(publishers.linkType, linkType));
    if (publicationType) filters.push(eq(publishers.publicationType, publicationType));
    if (minAuthority > 0) filters.push(gte(publishers.authority, minAuthority));
    if (minTraffic > 0) filters.push(gte(publishers.organicTraffic, minTraffic));
    if (maxPrice > 0) filters.push(lte(publishers.price, maxPrice));

    const where = filters.length ? and(...filters) : undefined;
    const orderBy = SORTS[sort] ?? SORTS.relevance;

    const [items, totals] = await Promise.all([
      db
        .select()
        .from(publishers)
        .where(where)
        .orderBy(...orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({
          total: sql<number>`cast(count(*) as int)`,
          avgAuthority: sql<number>`coalesce(cast(round(avg(${publishers.authority})) as int), 0)`,
          medianPrice: sql<number>`coalesce(cast(percentile_disc(0.5) within group (order by ${publishers.price}) as int), 0)`,
          avgDelivery: sql<number>`coalesce(cast(round(avg(${publishers.turnaroundDays})) as int), 0)`,
        })
        .from(publishers)
        .where(where),
    ]);

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
