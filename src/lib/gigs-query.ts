import { and, asc, desc, eq, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { ensureGigsSeeded } from "@/db/gig-seed";
import type { GigPackage } from "@/lib/gigs/types";
import { publicGigTitle } from "@/lib/gigs/public-title";

/** Shared query for server-rendered and client-filtered marketplace listings. */
const SORTS = {
  recommended: [desc(backlinkGigs.featured), asc(backlinkGigs.startingPrice), desc(backlinkGigs.id)],
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
  maxPrice?: number;
  maxDelivery?: number;
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

const TLD_MARKETS: Array<[string, string]> = [
  [".co.uk", "United Kingdom"],
  [".org.uk", "United Kingdom"],
  [".uk", "United Kingdom"],
  [".com.au", "Australia"],
  [".net.au", "Australia"],
  [".au", "Australia"],
  [".com.in", "India"],
  [".co.in", "India"],
  [".org.in", "India"],
  [".in", "India"],
  [".ca", "Canada"],
  [".de", "Germany"],
  [".fr", "France"],
  [".es", "Spain"],
  [".it", "Italy"],
  [".pt", "Portugal"],
  [".nl", "Netherlands"],
  [".br", "Brazil"],
  [".pk", "Pakistan"],
  [".lat", "Latin America"],
  [".mx", "Mexico"],
  [".ie", "Ireland"],
  [".us", "United States"],
];

function publicCountry(domain: string | null, storedCountry: string) {
  if (!domain) return storedCountry;
  const lower = domain.toLowerCase();
  for (const [suffix, country] of TLD_MARKETS) {
    if (lower.endsWith(suffix)) return country;
  }
  return "International";
}

function countryFilter(country: string): SQL {
  if (country === "United States") {
    return sql`(
      (${backlinkGigs.domain} is null and ${backlinkGigs.country} = ${country})
      or lower(${backlinkGigs.domain}) like '%.us'
    )`;
  }

  if (country === "International") {
    return sql`(
      ${backlinkGigs.country} = ${country}
      or (
        ${backlinkGigs.domain} is not null
        and lower(${backlinkGigs.domain}) not like '%.co.uk'
        and lower(${backlinkGigs.domain}) not like '%.org.uk'
        and lower(${backlinkGigs.domain}) not like '%.uk'
        and lower(${backlinkGigs.domain}) not like '%.com.au'
        and lower(${backlinkGigs.domain}) not like '%.net.au'
        and lower(${backlinkGigs.domain}) not like '%.au'
        and lower(${backlinkGigs.domain}) not like '%.com.in'
        and lower(${backlinkGigs.domain}) not like '%.co.in'
        and lower(${backlinkGigs.domain}) not like '%.org.in'
        and lower(${backlinkGigs.domain}) not like '%.in'
        and lower(${backlinkGigs.domain}) not like '%.ca'
        and lower(${backlinkGigs.domain}) not like '%.de'
        and lower(${backlinkGigs.domain}) not like '%.fr'
        and lower(${backlinkGigs.domain}) not like '%.es'
        and lower(${backlinkGigs.domain}) not like '%.it'
        and lower(${backlinkGigs.domain}) not like '%.pt'
        and lower(${backlinkGigs.domain}) not like '%.nl'
        and lower(${backlinkGigs.domain}) not like '%.br'
        and lower(${backlinkGigs.domain}) not like '%.pk'
        and lower(${backlinkGigs.domain}) not like '%.lat'
        and lower(${backlinkGigs.domain}) not like '%.mx'
        and lower(${backlinkGigs.domain}) not like '%.ie'
        and lower(${backlinkGigs.domain}) not like '%.us'
      )
    )`;
  }

  return eq(backlinkGigs.country, country);
}

export async function queryGigs(params: GigQueryParams) {
  await ensureGigsSeeded();

  const query = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const subcategory = params.subcategory ?? "";
  const industry = params.industry ?? "";
  const country = params.country ?? "";
  const language = params.language ?? "";
  const maxPrice = params.maxPrice ?? 0;
  const maxDelivery = params.maxDelivery ?? 0;
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
      ilike(backlinkGigs.language, like),
    );
    if (search) filters.push(search);
  }
  if (category) filters.push(eq(backlinkGigs.category, category));
  if (subcategory) filters.push(eq(backlinkGigs.subcategory, subcategory));
  if (industry) filters.push(eq(backlinkGigs.industry, industry));
  if (country) filters.push(countryFilter(country));
  if (language) filters.push(eq(backlinkGigs.language, language));
  if (maxPrice > 0) filters.push(lte(backlinkGigs.startingPrice, maxPrice));
  if (maxDelivery > 0) filters.push(lte(backlinkGigs.fastestDeliveryDays, maxDelivery));

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
        startingPrice: backlinkGigs.startingPrice,
        fastestDeliveryDays: backlinkGigs.fastestDeliveryDays,
        packages: backlinkGigs.packages,
        featured: backlinkGigs.featured,
        domain: backlinkGigs.domain,
      })
      .from(backlinkGigs)
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({
        total: sql<number>`cast(count(*) as int)`,
        medianPrice: sql<number>`coalesce(cast(percentile_disc(0.5) within group (order by ${backlinkGigs.startingPrice}) as int), 0)`,
        namedPublishers: sql<number>`cast(count(*) filter (where ${backlinkGigs.domain} is not null) as int)`,
      })
      .from(backlinkGigs)
      .where(where),
  ]);

  return {
    items: rows.map((row) => {
      const resolvedCountry = publicCountry(row.domain, row.country);
      return {
        ...row,
        title: publicGigTitle({
          domain: row.domain,
          subcategory: row.subcategory,
          category: row.category,
          industry: row.industry,
          country: resolvedCountry,
        }),
        country: resolvedCountry,
        packages: parsePackages(row.packages),
      };
    }),
    page,
    pageSize,
    total: totals[0]?.total ?? 0,
    summary: {
      medianPrice: totals[0]?.medianPrice ?? 0,
      namedPublishers: totals[0]?.namedPublishers ?? 0,
    },
  };
}