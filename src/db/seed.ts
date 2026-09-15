import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { BLOG_POSTS } from "@/db/blog-posts";
import {
  articles,
  campaigns,
  caseStudies,
  faqs,
  placements,
  projects,
  publishers,
  testimonials,
} from "@/db/schema";

/* -------------------------------------------------------------------------- */
/*  Deterministic pseudo-random helpers                                       */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260417);
const pick = <T,>(items: readonly T[]) => items[Math.floor(rand() * items.length)] as T;
const between = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

/* -------------------------------------------------------------------------- */
/*  Marketplace inventory                                                      */
/* -------------------------------------------------------------------------- */

export const INDUSTRIES = [
  "SaaS & Technology",
  "Finance & Fintech",
  "Health & Wellness",
  "Marketing & Advertising",
  "Travel & Hospitality",
  "Home & Interior",
  "Ecommerce & Retail",
  "Education",
  "Automotive",
  "Real Estate",
  "Sustainability",
  "Food & Beverage",
  "Legal & Compliance",
  "HR & Recruitment",
] as const;

export const MARKETS = [
  { country: "United States", language: "English" },
  { country: "United Kingdom", language: "English" },
  { country: "Germany", language: "German" },
  { country: "France", language: "French" },
  { country: "Spain", language: "Spanish" },
  { country: "Netherlands", language: "Dutch" },
  { country: "Sweden", language: "Swedish" },
  { country: "Canada", language: "English" },
  { country: "Australia", language: "English" },
  { country: "Italy", language: "Italian" },
  { country: "Poland", language: "Polish" },
  { country: "Denmark", language: "Danish" },
  { country: "Ireland", language: "English" },
  { country: "Switzerland", language: "German" },
  { country: "Portugal", language: "Portuguese" },
] as const;

export const LINK_TYPES = ["Dofollow", "Nofollow", "Mixed"] as const;

export const PUBLICATION_TYPES = [
  "Guest Post",
  "Niche Edit",
  "Digital PR Feature",
  "News Placement",
  "Expert Roundup",
  "Product Review",
] as const;

const PREFIXES = [
  "north", "ember", "atlas", "vertex", "harbor", "lumen", "quarry", "signal", "meridian",
  "basalt", "orbit", "cadence", "fathom", "juniper", "kestrel", "lattice", "monarch",
  "nimbus", "opal", "pioneer", "quantum", "ridge", "solstice", "tandem", "umbra", "verdant",
  "willow", "zenith", "brightside", "clearwater", "dockside", "eastgate", "foundry",
  "granite", "highland", "ironwood", "keystone", "longview", "midtown", "nordic",
];

const SUFFIXES = [
  "journal", "review", "daily", "report", "digest", "insider", "weekly", "post", "wire",
  "desk", "lab", "notes", "brief", "press", "index", "monitor", "beacon", "gazette",
];

const TLDS = [".com", ".com", ".com", ".io", ".co", ".net", ".eu", ".org"];

function titleCase(value: string) {
  return value
    .split(/[\s-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildPublisherRows(count = 176) {
  const seen = new Set<string>();
  const rows: (typeof publishers.$inferInsert)[] = [];

  while (rows.length < count) {
    const prefix = pick(PREFIXES);
    const suffix = pick(SUFFIXES);
    const tld = pick(TLDS);
    const domain = `${prefix}${suffix}${tld}`;
    if (seen.has(domain)) continue;
    seen.add(domain);

    const market = pick(MARKETS);
    const authority = between(21, 88);
    const trafficBase = Math.round(
      (authority / 88) ** 2.1 * between(180_000, 460_000) + between(900, 14_000),
    );
    const publicationType = pick(PUBLICATION_TYPES);
    const linkType = rand() > 0.78 ? pick(["Nofollow", "Mixed"] as const) : "Dofollow";
    const priceRaw =
      45 +
      authority * between(4, 9) +
      Math.round(trafficBase / 900) +
      (publicationType === "Digital PR Feature" ? 320 : 0) +
      (publicationType === "News Placement" ? 180 : 0);

    rows.push({
      domain,
      displayName: `${titleCase(prefix)} ${titleCase(suffix)}`,
      industry: pick(INDUSTRIES),
      country: market.country,
      language: market.language,
      authority,
      organicTraffic: trafficBase,
      referringDomains: Math.round(trafficBase / between(9, 26)) + between(60, 900),
      price: Math.round(priceRaw / 5) * 5,
      linkType,
      publicationType,
      turnaroundDays: between(3, 24),
      spamScore: between(0, 6),
      trafficTrend: between(-9, 42),
      relevance: between(62, 99),
      featured: rand() > 0.88,
    });
  }

  return rows;
}

/* -------------------------------------------------------------------------- */
/*  Editorial + product demo content (all original)                            */
/* -------------------------------------------------------------------------- */

const PROJECT_ROWS: (typeof projects.$inferInsert)[] = [
  {
    name: "Northloop Analytics",
    domain: "northloop.io",
    industry: "SaaS & Technology",
    market: "United States",
    authorityScore: 58,
    organicTraffic: 184_300,
    referringDomains: 2_140,
    trackedKeywords: 1_860,
    trafficSeries: "82,91,97,104,118,126,139,148,157,166,175,184",
    keywordSeries: "310,338,352,401,436,470,512,548,596,641,688,742",
  },
  {
    name: "Kestrel Financial",
    domain: "kestrelfinancial.com",
    industry: "Finance & Fintech",
    market: "United Kingdom",
    authorityScore: 49,
    organicTraffic: 96_800,
    referringDomains: 1_308,
    trackedKeywords: 940,
    trafficSeries: "41,44,48,52,55,61,66,71,78,84,91,97",
    keywordSeries: "180,198,214,236,251,268,290,311,338,366,392,419",
  },
  {
    name: "Verdant Home Studio",
    domain: "verdantstudio.eu",
    industry: "Home & Interior",
    market: "Germany",
    authorityScore: 41,
    organicTraffic: 63_400,
    referringDomains: 806,
    trackedKeywords: 615,
    trafficSeries: "22,25,27,31,34,38,41,45,50,55,59,63",
    keywordSeries: "96,110,121,135,148,164,181,199,214,232,248,266",
  },
];

const CAMPAIGN_ROWS: (typeof campaigns.$inferInsert)[] = [
  { projectId: 1, name: "Q1 Authority Sprint", objective: "Guest posts", status: "Live", progress: 72, placementsLive: 18, placementsTotal: 25, budget: 14_500, startedOn: "2026-01-08" },
  { projectId: 1, name: "Product-Led Digital PR", objective: "Digital PR", status: "In review", progress: 45, placementsLive: 9, placementsTotal: 20, budget: 22_000, startedOn: "2026-02-02" },
  { projectId: 2, name: "Compare Pages Link Push", objective: "Niche edits", status: "Live", progress: 88, placementsLive: 22, placementsTotal: 25, budget: 11_250, startedOn: "2025-11-19" },
  { projectId: 2, name: "Regulatory Resource Links", objective: "Resource links", status: "Drafting", progress: 26, placementsLive: 4, placementsTotal: 16, budget: 8_400, startedOn: "2026-02-24" },
  { projectId: 3, name: "DACH Local Visibility", objective: "Local backlinks", status: "Live", progress: 61, placementsLive: 11, placementsTotal: 18, budget: 6_900, startedOn: "2026-01-27" },
];

const PLACEMENT_ROWS: (typeof placements.$inferInsert)[] = [
  { campaignId: 1, domain: "meridianreview.com", anchor: "product analytics platform", targetPath: "/platform", authority: 71, status: "Live", publishedOn: "2026-03-02" },
  { campaignId: 1, domain: "latticedigest.io", anchor: "customer journey reporting", targetPath: "/reports", authority: 64, status: "Live", publishedOn: "2026-02-25" },
  { campaignId: 1, domain: "signalmonitor.co", anchor: "self-serve analytics", targetPath: "/pricing", authority: 58, status: "Indexing", publishedOn: "2026-03-09" },
  { campaignId: 2, domain: "orbitwire.com", anchor: "Northloop research", targetPath: "/research/2026", authority: 82, status: "Live", publishedOn: "2026-02-18" },
  { campaignId: 2, domain: "fathombrief.eu", anchor: "retention benchmark study", targetPath: "/research/retention", authority: 69, status: "Scheduled", publishedOn: "2026-03-21" },
  { campaignId: 3, domain: "kestreldesk.co.uk", anchor: "best business accounts", targetPath: "/compare/business-accounts", authority: 66, status: "Live", publishedOn: "2026-01-30" },
  { campaignId: 3, domain: "granitejournal.com", anchor: "fintech onboarding guide", targetPath: "/guides/onboarding", authority: 61, status: "Live", publishedOn: "2026-02-11" },
  { campaignId: 4, domain: "keystonenotes.com", anchor: "open banking rules", targetPath: "/blog/open-banking", authority: 54, status: "Drafting", publishedOn: "—" },
  { campaignId: 5, domain: "nordicgazette.eu", anchor: "Einrichtungsideen Berlin", targetPath: "/de/showroom", authority: 47, status: "Live", publishedOn: "2026-02-06" },
  { campaignId: 5, domain: "juniperindex.de", anchor: "nachhaltige Möbel", targetPath: "/de/nachhaltigkeit", authority: 52, status: "Indexing", publishedOn: "2026-03-05" },
];

const RETIRED_ARTICLE_SLUGS = [
  "authority-compounding-model",
  "vetting-publishers-checklist",
  "digital-pr-without-gimmicks",
  "auditing-a-toxic-backlink-profile",
  "outreach-emails-that-get-replies",
  "brand-mentions-and-ai-answers",
  "link-building-reports-clients-trust",
  "local-link-building-multi-location",
];

const CASE_STUDY_ROWS: (typeof caseStudies.$inferInsert)[] = [
  {
    slug: "b2b-saas-authority-sprint",
    company: "Northloop Analytics (sample data)",
    industry: "B2B SaaS",
    market: "United States & Canada",
    headline: "Closing a 400-domain referring gap in three quarters",
    startingPoint:
      "A product analytics platform with strong retention but almost no organic pipeline. Domain authority sat in the low thirties and commercial pages had fewer than forty referring domains combined.",
    strategy:
      "Guest posts and niche edits aimed at comparison and integration templates rather than the homepage, followed by a digital PR campaign built on activation benchmark data. Anchors were kept brand-heavy throughout because the existing profile was already exact-match weighted.",
    outcome:
      "Organic sessions on commercial templates grew faster than blog traffic, and demo requests from organic search became the second largest acquisition channel.",
    trafficChange: 168,
    keywordChange: 214,
    referringDomainGrowth: 96,
    durationMonths: 9,
    series: "82,91,97,104,118,126,139,148,157,166,175,184",
  },
  {
    slug: "fintech-compare-pages",
    company: "Kestrel Financial (sample data)",
    industry: "Fintech",
    market: "United Kingdom & Ireland",
    headline: "Editorial links on finance trade press, no directories",
    startingPoint:
      "A business banking comparison site competing against publishers with fifteen years of history. Content quality was solid, but citations came almost entirely from low-relevance directories.",
    strategy:
      "We published a transparent scoring methodology to make the site citable, then ran editorial outreach to finance trade press and regional business media. Every placement pointed at a comparison template, and low-quality finance directories in the existing profile were left alone rather than disavowed.",
    outcome:
      "Comparison pages moved from page three to the first result block for several high-intent terms, and affiliate revenue from organic traffic more than doubled.",
    trafficChange: 137,
    keywordChange: 189,
    referringDomainGrowth: 74,
    durationMonths: 11,
    series: "41,44,48,52,55,61,66,71,78,84,91,97",
  },
  {
    slug: "dach-home-retail",
    company: "Verdant Home Studio (sample data)",
    industry: "Ecommerce & Retail",
    market: "Germany, Austria & Switzerland",
    headline: "Native German link building across three DACH markets",
    startingPoint:
      "A sustainable furniture retailer with a translated site, duplicated category copy and no market-specific coverage outside Germany.",
    strategy:
      "Separate prospect lists for Germany, Austria and Switzerland, with native writers in each market and links pointed at the matching language version rather than the German homepage. Regional guest placements were combined with trade association listings.",
    outcome:
      "Non-brand category traffic grew steadily across all three markets, with the strongest gains in Austria where competition was thinnest.",
    trafficChange: 112,
    keywordChange: 158,
    referringDomainGrowth: 63,
    durationMonths: 8,
    series: "22,25,27,31,34,38,41,45,50,55,59,63",
  },
];

const TESTIMONIAL_ROWS: (typeof testimonials.$inferInsert)[] = [
  { name: "Hanna Brecht", role: "Head of Growth", company: "Peregrine Cloud", quote: "The vetting is the part that saved us. We stopped arguing internally about which sites were safe and started shipping campaigns in the same week we planned them.", rating: 5, initials: "HB", accent: "brand" },
  { name: "Tomás Ferreira", role: "SEO Director", company: "Lumina Commerce", quote: "Filtering by market and relevance instead of raw metrics changed our results. Fewer placements, better pages, and reporting our CFO can follow without a translation layer.", rating: 5, initials: "TF", accent: "sky" },
  { name: "Rachel Aiken", role: "Founder", company: "Sandbar Studio", quote: "As a two-person agency we needed a workspace per client, not a spreadsheet. Campaign tracking and exportable reports made us look considerably bigger than we are.", rating: 5, initials: "RA", accent: "amber" },
  { name: "Jonas Meyer", role: "Performance Lead", company: "Fahrwerk Group", quote: "Their team pushed back on two placements we wanted and explained exactly why. That single conversation earned more trust than any pitch deck.", rating: 5, initials: "JM", accent: "violet" },
  { name: "Amara Diallo", role: "Content Manager", company: "Nordwell Health", quote: "The content briefs came with real search intent analysis. Our writers finally stopped guessing what the page needed to cover.", rating: 4, initials: "AD", accent: "brand" },
  { name: "Liam Corrigan", role: "Ecommerce Manager", company: "Highfield Supply", quote: "Delivery estimates were accurate, invoices were clean, and the dashboard told me what was live without an email thread. That is most of what I wanted.", rating: 5, initials: "LC", accent: "sky" },
];

const FAQ_ROWS: (typeof faqs.$inferInsert)[] = [
  { question: "What does Linkslo actually do?", answer: "We build backlinks, and nothing else. That covers guest posts, editorial placements, niche edits, contextual links, digital PR, resource and broken link outreach, local citations and ongoing monthly campaigns. You can order individual placements from the publisher marketplace or brief a strategist to run the campaign for you.", topic: "Services", sortOrder: 1 },
  { question: "How are websites evaluated before they are listed?", answer: "Every domain passes a multi-stage review: traffic distribution across pages rather than a single spike, keyword relevance to the stated category, outbound linking behaviour, editorial continuity, author transparency and disclosure practices. We re-score listings on a rolling quarterly cycle and remove domains whose quality drifts.", topic: "Quality", sortOrder: 2 },
  { question: "How does a link campaign actually work?", answer: "You add a website, choose the target pages and market, then either select publishers yourself or brief our team. We confirm relevance, produce or review the content, agree anchors against your existing distribution, coordinate publication with the editor, and record every live URL in your workspace with its metrics and date.", topic: "Campaigns", sortOrder: 3 },
  { question: "How long do placements usually take?", answer: "Most marketplace orders publish within seven to twenty-one days, depending on the publication's editorial calendar. Each listing shows its own estimated delivery window. Digital PR campaigns run longer because outreach, story development and journalist review add time.", topic: "Delivery", sortOrder: 4 },
  { question: "Can agencies manage multiple clients in one account?", answer: "Yes. Agency workspaces support unlimited client projects, separate budgets, per-project permissions and white-labelled reports. Team members can be scoped to individual clients so freelancers only see what they need to.", topic: "Agencies", sortOrder: 5 },
  { question: "Is reporting included?", answer: "Reporting is part of every plan. You get live campaign status, published URL logs with authority and traffic figures, anchor text distribution, month-over-month referring domain growth, and scheduled PDF or CSV exports. Reports can carry your own logo on agency plans.", topic: "Reporting", sortOrder: 6 },
  { question: "Do you sell PBN links?", answer: "No, and we will not under any label. Private blog networks depend on hiding ownership from search engines, which makes them a liability the moment the footprint is recognised. Every link we place comes from a site that exists for its readers and would still exist if link buyers disappeared tomorrow.", topic: "Quality", sortOrder: 7 },
  { question: "Which countries and languages are supported?", answer: "We currently work across 38 markets with native-language inventory in fifteen languages, concentrated in Europe and North America with growing coverage in Australia and Latin America. If a market is missing, our sourcing team can usually build inventory for it within a few weeks.", topic: "Coverage", sortOrder: 8 },
  { question: "How does billing work?", answer: "Marketplace orders are charged per placement, with the price locked at checkout. Subscription plans are billed monthly or annually and include platform access, reporting and support hours. All invoices are VAT-compliant and downloadable from the billing area.", topic: "Billing", sortOrder: 9 },
  { question: "Does a high DA or DR mean a good backlink?", answer: "Not on its own. DA, DR, Trust Flow and Citation Flow are third-party estimates from tool vendors, not signals search engines publish, and they can be inflated by buying cheap links. We use them to filter out obviously weak sites, then judge relevance, genuine traffic and editorial quality separately before recommending anything.", topic: "Quality", sortOrder: 10 },
  { question: "Can I pause or cancel a campaign?", answer: "You can pause a campaign at any time before content is submitted to a publisher, and unused budget stays in your account. Once an editor has scheduled a placement, that item is committed — but the rest of the campaign can still be paused or redirected.", topic: "Billing", sortOrder: 11 },
];

/* -------------------------------------------------------------------------- */
/*  Seeding                                                                    */
/* -------------------------------------------------------------------------- */

let seedPromise: Promise<void> | null = null;

async function runSeed() {
  const [publisherRows, projectRows, faqRows, caseRows, testimonialRows] =
    await Promise.all([
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(publishers),
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(projects),
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(faqs),
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(caseStudies),
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(testimonials),
    ]);

  if (publisherRows[0].n === 0) {
    await db.insert(publishers).values(buildPublisherRows()).onConflictDoNothing();
  }
  if (projectRows[0].n === 0) {
    await db.insert(projects).values(PROJECT_ROWS).onConflictDoNothing();
    await db.insert(campaigns).values(CAMPAIGN_ROWS).onConflictDoNothing();
    await db.insert(placements).values(PLACEMENT_ROWS).onConflictDoNothing();
  }
  // The original short demo articles have been retired in favour of long-form,
  // keyword-focused posts (see blog-posts.ts). Remove them if an older seed
  // already inserted them, and never re-insert them.
  await db.delete(articles).where(inArray(articles.slug, RETIRED_ARTICLE_SLUGS));
  // Blog posts (batch-added over time) are inserted independently of the
  // count check above, so new posts append instead of requiring a full wipe.
  await db.insert(articles).values(BLOG_POSTS).onConflictDoNothing();
  if (faqRows[0].n === 0) {
    await db.insert(faqs).values(FAQ_ROWS).onConflictDoNothing();
  }
  if (caseRows[0].n === 0) {
    await db.insert(caseStudies).values(CASE_STUDY_ROWS).onConflictDoNothing();
  }
  if (testimonialRows[0].n === 0) {
    await db.insert(testimonials).values(TESTIMONIAL_ROWS).onConflictDoNothing();
  }
}

/** Idempotent, memoised seeding so a fresh database fills itself on first use. */
export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

export const FALLBACK_FAQS = FAQ_ROWS;
export const FALLBACK_TESTIMONIALS = TESTIMONIAL_ROWS;
export const FALLBACK_CASE_STUDIES = CASE_STUDY_ROWS;
export const FALLBACK_ARTICLES = BLOG_POSTS;
