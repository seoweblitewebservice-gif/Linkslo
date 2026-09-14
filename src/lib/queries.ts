import { asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  backlinkGigs,
  campaigns,
  caseStudies,
  faqs,
  placements,
  projects,
  publishers,
  testimonials,
} from "@/db/schema";
import {
  ensureSeeded,
  FALLBACK_ARTICLES,
  FALLBACK_CASE_STUDIES,
  FALLBACK_FAQS,
  FALLBACK_TESTIMONIALS,
  INDUSTRIES,
  LINK_TYPES,
  MARKETS,
  PUBLICATION_TYPES,
} from "@/db/seed";
import type { Facets } from "@/components/marketplace/MarketplaceExplorer";
import { parseSeries } from "@/lib/format";

const STATIC_FACETS: Facets = {
  industries: [...INDUSTRIES].sort(),
  countries: [...new Set(MARKETS.map((market) => market.country))].sort(),
  languages: [...new Set(MARKETS.map((market) => market.language))].sort(),
  linkTypes: [...LINK_TYPES],
  publicationTypes: [...PUBLICATION_TYPES],
};

export async function getFacets(): Promise<Facets> {
  try {
    await ensureSeeded();
    const realOnly = isNotNull(backlinkGigs.domain);
    const [industryRows, countryRows, languageRows, linkTypeRows] = await Promise.all([
      db.selectDistinct({ value: backlinkGigs.industry }).from(backlinkGigs).where(realOnly).orderBy(asc(backlinkGigs.industry)),
      db.selectDistinct({ value: backlinkGigs.country }).from(backlinkGigs).where(realOnly).orderBy(asc(backlinkGigs.country)),
      db.selectDistinct({ value: backlinkGigs.language }).from(backlinkGigs).where(realOnly).orderBy(asc(backlinkGigs.language)),
      db.selectDistinct({ value: backlinkGigs.linkType }).from(backlinkGigs).where(realOnly).orderBy(asc(backlinkGigs.linkType)),
    ]);
    return {
      industries: industryRows.map((row) => row.value).filter((v): v is string => Boolean(v)),
      countries: countryRows.map((row) => row.value).filter((v): v is string => Boolean(v)),
      languages: languageRows.map((row) => row.value).filter((v): v is string => Boolean(v)),
      linkTypes: linkTypeRows.map((row) => row.value).filter((v): v is string => Boolean(v)),
      publicationTypes: ["Guest Post"],
    };
  } catch (error) {
    console.error("facet query failed", error);
    return STATIC_FACETS;
  }
}

export async function getTestimonials() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(testimonials).orderBy(asc(testimonials.id));
    if (rows.length) return rows;
  } catch (error) {
    console.error("testimonial query failed", error);
  }
  return FALLBACK_TESTIMONIALS.map((row, index) => ({ ...row, id: index + 1 }));
}

export async function getFaqs() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
    if (rows.length) return rows;
  } catch (error) {
    console.error("faq query failed", error);
  }
  return FALLBACK_FAQS.map((row, index) => ({ ...row, id: index + 1 }));
}

export async function getCaseStudies() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(caseStudies).orderBy(asc(caseStudies.id));
    if (rows.length) return rows;
  } catch (error) {
    console.error("case study query failed", error);
  }
  return FALLBACK_CASE_STUDIES.map((row, index) => ({ ...row, id: index + 1, outcome: row.outcome }));
}

export async function getCaseStudy(slug: string) {
  const all = await getCaseStudies();
  return all.find((item) => item.slug === slug) ?? null;
}

export async function getArticles(limit?: number) {
  try {
    await ensureSeeded();
    const query = db.select().from(articles).orderBy(desc(articles.publishedOn));
    const rows = limit ? await query.limit(limit) : await query;
    if (rows.length) return rows;
  } catch (error) {
    console.error("article query failed", error);
  }
  const fallback = FALLBACK_ARTICLES.map((row, index) => ({ ...row, id: index + 1 }));
  return limit ? fallback.slice(0, limit) : fallback;
}

export async function getArticle(slug: string) {
  const all = await getArticles();
  return all.find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedListings(limit = 6) {
  try {
    await ensureSeeded();
    return await db
      .select({
        id: publishers.id,
        domain: publishers.domain,
        industry: publishers.industry,
        authority: publishers.authority,
        organicTraffic: publishers.organicTraffic,
        price: publishers.price,
        country: publishers.country,
      })
      .from(publishers)
      .orderBy(desc(publishers.relevance), desc(publishers.authority))
      .limit(limit);
  } catch (error) {
    console.error("listing query failed", error);
    return [];
  }
}

export async function getListing(domain: string) {
  try {
    await ensureSeeded();
    const rows = await db.select().from(publishers).where(eq(publishers.domain, domain)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("listing detail query failed", error);
    return null;
  }
}

export async function getRelatedListings(industry: string, excludeId: number, limit = 4) {
  try {
    return await db
      .select()
      .from(publishers)
      .where(sql`${publishers.industry} = ${industry} and ${publishers.id} <> ${excludeId}`)
      .orderBy(desc(publishers.relevance))
      .limit(limit);
  } catch (error) {
    console.error("related listing query failed", error);
    return [];
  }
}

export async function getWorkspaceData() {
  try {
    await ensureSeeded();
    const [projectRows, campaignRows, placementRows, listingRows] = await Promise.all([
      db.select().from(projects).orderBy(asc(projects.id)),
      db.select().from(campaigns).orderBy(asc(campaigns.id)),
      db.select().from(placements).orderBy(asc(placements.id)),
      getFeaturedListings(6),
    ]);

    return {
      projects: projectRows.map((row) => ({
        ...row,
        trafficSeries: parseSeries(row.trafficSeries),
        keywordSeries: parseSeries(row.keywordSeries),
      })),
      campaigns: campaignRows,
      placements: placementRows,
      listings: listingRows,
    };
  } catch (error) {
    console.error("workspace query failed", error);
    return { projects: [], campaigns: [], placements: [], listings: [] };
  }
}
