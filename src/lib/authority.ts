import { desc, eq, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { publishers } from "@/db/schema";
import { normaliseDomain } from "@/lib/format";

/* Deterministic hashing so identical inputs always return identical analysis. */
function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 2246822507);
    t = Math.imul(t ^ (t >>> 13), 3266489909);
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };
}

const INDUSTRY_HINTS: { industry: string; terms: string[] }[] = [
  { industry: "SaaS & Technology", terms: ["saas", "software", "app", "platform", "api", "cloud", "analytics", "crm", "devops", "ai", "automation"] },
  { industry: "Finance & Fintech", terms: ["bank", "finance", "loan", "invest", "credit", "insurance", "fintech", "payment", "tax", "accounting", "trading"] },
  { industry: "Health & Wellness", terms: ["health", "clinic", "supplement", "fitness", "therapy", "dental", "wellness", "nutrition", "medical"] },
  { industry: "Marketing & Advertising", terms: ["marketing", "seo", "ads", "agency", "brand", "content", "ppc", "email", "social"] },
  { industry: "Travel & Hospitality", terms: ["travel", "hotel", "flight", "tour", "holiday", "resort", "booking", "hostel"] },
  { industry: "Home & Interior", terms: ["furniture", "interior", "home", "kitchen", "garden", "renovation", "decor", "mattress"] },
  { industry: "Ecommerce & Retail", terms: ["shop", "store", "ecommerce", "retail", "product", "shipping", "checkout", "dropship"] },
  { industry: "Education", terms: ["course", "school", "learn", "training", "university", "bootcamp", "certification", "tutor"] },
  { industry: "Automotive", terms: ["car", "auto", "vehicle", "ev", "tyre", "motor", "lease", "garage"] },
  { industry: "Real Estate", terms: ["property", "estate", "rent", "mortgage", "apartment", "housing", "landlord"] },
  { industry: "Sustainability", terms: ["solar", "green", "carbon", "sustainable", "recycling", "energy", "climate"] },
  { industry: "Food & Beverage", terms: ["food", "recipe", "coffee", "restaurant", "wine", "beverage", "meal", "bakery"] },
  { industry: "Legal & Compliance", terms: ["legal", "lawyer", "compliance", "gdpr", "contract", "attorney", "patent"] },
  { industry: "HR & Recruitment", terms: ["hr", "recruit", "hiring", "payroll", "talent", "onboarding", "employee"] },
];

export function inferIndustry(keyword: string, domain: string) {
  const haystack = `${keyword} ${domain}`.toLowerCase();
  let best = { industry: "SaaS & Technology", score: 0 };
  for (const hint of INDUSTRY_HINTS) {
    const score = hint.terms.reduce((total, term) => (haystack.includes(term) ? total + 1 : total), 0);
    if (score > best.score) best = { industry: hint.industry, score };
  }
  if (best.score === 0) {
    const index = hash(haystack) % INDUSTRY_HINTS.length;
    return INDUSTRY_HINTS[index].industry;
  }
  return best.industry;
}

const COMPETITOR_SUFFIXES = ["hub", "labs", "group", "collective", "works", "central", "compare", "guide"];
const TLDS = [".com", ".io", ".co", ".net"];

export type ScoutResult = {
  domain: string;
  keyword: string;
  market: string;
  industry: string;
  opportunityScore: number;
  authorityEstimate: number;
  topicalRelevance: number;
  difficulty: number;
  referringDomainGap: number;
  estimatedTimeframe: string;
  summary: string;
  competitors: {
    domain: string;
    authority: number;
    referringDomains: number;
    sharedKeywords: number;
    overlap: number;
  }[];
  contentGaps: { title: string; intent: string; difficulty: number; monthlyVolume: number }[];
  signals: { label: string; value: string; tone: "positive" | "neutral" | "watch" }[];
  opportunities: {
    id: number;
    domain: string;
    displayName: string;
    authority: number;
    organicTraffic: number;
    price: number;
    country: string;
    publicationType: string;
    relevance: number;
  }[];
};

export async function runAuthorityScout(input: {
  domain: string;
  keyword: string;
  market?: string;
}): Promise<ScoutResult> {
  const domain = normaliseDomain(input.domain);
  const keyword = input.keyword.trim().toLowerCase();
  const market = input.market?.trim() || "Global";
  const industry = inferIndustry(keyword, domain);

  const seed = hash(`${domain}|${keyword}|${market}`);
  const rand = prng(seed);
  const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

  const authorityEstimate = int(18, 62);
  const difficulty = int(24, 88);
  const topicalRelevance = int(46, 96);
  const referringDomainGap = int(24, 380);
  const opportunityScore = Math.max(
    12,
    Math.min(
      97,
      Math.round(topicalRelevance * 0.45 + (100 - difficulty) * 0.35 + (authorityEstimate / 62) * 20),
    ),
  );

  const keywordRoot = keyword.split(/\s+/).filter(Boolean)[0] ?? "search";
  const competitors = Array.from({ length: 4 }).map((_, index) => {
    const suffix = COMPETITOR_SUFFIXES[(seed + index * 7) % COMPETITOR_SUFFIXES.length];
    const tld = TLDS[(seed + index * 3) % TLDS.length];
    return {
      domain: `${keywordRoot.replace(/[^a-z0-9]/g, "")}${suffix}${tld}`,
      authority: Math.min(92, authorityEstimate + int(6, 34)),
      referringDomains: int(320, 5400),
      sharedKeywords: int(40, 860),
      overlap: int(12, 68),
    };
  });

  const gapTemplates = [
    { title: `${keyword} pricing and cost breakdown`, intent: "Commercial" },
    { title: `How ${keyword} works: a practical explainer`, intent: "Informational" },
    { title: `Best ${keyword} alternatives compared`, intent: "Commercial" },
    { title: `${keyword} benchmarks for ${new Date().getFullYear()}`, intent: "Research" },
    { title: `${keyword} implementation checklist`, intent: "Informational" },
    { title: `${keyword} for small teams`, intent: "Transactional" },
  ];

  const contentGaps = gapTemplates.slice(0, 5).map((template, index) => ({
    ...template,
    difficulty: Math.max(8, Math.min(94, difficulty + int(-18, 14) - index * 2)),
    monthlyVolume: int(120, 8600),
  }));

  const signals: ScoutResult["signals"] = [
    {
      label: "Topical coverage",
      value: topicalRelevance > 72 ? "Strong for this theme" : "Partial — gaps remain",
      tone: topicalRelevance > 72 ? "positive" : "watch",
    },
    {
      label: "Referring domain gap",
      value: `${referringDomainGap} domains behind the leading result`,
      tone: referringDomainGap > 200 ? "watch" : "neutral",
    },
    {
      label: "Competition level",
      value: difficulty > 66 ? "High — expect a longer runway" : difficulty > 40 ? "Moderate" : "Approachable",
      tone: difficulty > 66 ? "watch" : "positive",
    },
    {
      label: "Recommended market",
      value: market === "Global" ? "Multi-market rollout viable" : `${market} first, then expand`,
      tone: "neutral",
    },
  ];

  let opportunities: ScoutResult["opportunities"] = [];
  try {
    const like = `%${keywordRoot}%`;
    const matcher: SQL | undefined = or(
      eq(publishers.industry, industry),
      sql`${publishers.displayName} ilike ${like}`,
    );
    const rows = await db
      .select({
        id: publishers.id,
        domain: publishers.domain,
        displayName: publishers.displayName,
        authority: publishers.authority,
        organicTraffic: publishers.organicTraffic,
        price: publishers.price,
        country: publishers.country,
        publicationType: publishers.publicationType,
        relevance: publishers.relevance,
      })
      .from(publishers)
      .where(matcher)
      .orderBy(desc(publishers.relevance), desc(publishers.authority))
      .limit(5);
    opportunities = rows;
  } catch (error) {
    console.error("scout opportunity lookup failed", error);
  }

  const timeframeMonths = difficulty > 70 ? "7–11 months" : difficulty > 45 ? "4–7 months" : "2–4 months";

  return {
    domain,
    keyword,
    market,
    industry,
    opportunityScore,
    authorityEstimate,
    topicalRelevance,
    difficulty,
    referringDomainGap,
    estimatedTimeframe: timeframeMonths,
    summary: `For “${keyword}”, ${domain} sits in a ${
      difficulty > 66 ? "competitive" : difficulty > 40 ? "contested but winnable" : "relatively open"
    } result set. Closing the ${referringDomainGap}-domain authority gap with ${industry.toLowerCase()} publications, alongside ${contentGaps.length} missing content angles, is the shortest credible route to visibility within ${timeframeMonths}.`,
    competitors,
    contentGaps,
    signals,
    opportunities,
  };
}
