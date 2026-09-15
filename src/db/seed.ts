import { sql } from "drizzle-orm";
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

const ARTICLE_ROWS: (typeof articles.$inferInsert)[] = [
  {
    slug: "authority-compounding-model",
    title: "The compounding model behind durable search authority",
    category: "Link Building",
    excerpt:
      "Authority is not a single number you buy. It is the accumulated result of relevance, consistency and editorial trust — here is how to model it.",
    body: "Most teams treat authority as a metric to chase. A more useful framing is to treat it as a balance sheet: every relevant placement, every refreshed page and every earned mention adds a small amount of durable equity, while thin tactics quietly add liabilities.\n\nStart by mapping the three inputs that actually compound. The first is topical coverage — the share of your category's questions you answer credibly. The second is editorial trust, measured through the quality and independence of the publications that reference you. The third is technical reliability: crawl efficiency, page experience and internal linking that lets equity flow where it matters.\n\nWhen you model those inputs quarterly rather than weekly, the picture changes. Campaigns stop looking like isolated purchases and start looking like contributions to a portfolio. Teams that review placements against topical coverage gaps typically need fewer links to move the same commercial terms.\n\nA practical starting point: list your ten highest-intent pages, score each one on coverage, trust and technical health, then direct the next campaign at the lowest-scoring dimension instead of the loudest one.",
    author: "Marta Ellison",
    readingMinutes: 7,
    publishedOn: "2026-03-12",
    featured: true,
  },
  {
    slug: "vetting-publishers-checklist",
    title: "A practical checklist for vetting publishers before you buy",
    category: "Link Building",
    excerpt:
      "Traffic screenshots are easy to fake. These eleven signals separate genuine editorial sites from low-value link farms.",
    body: "Publisher vetting is the highest-leverage skill in link acquisition, and it is mostly unglamorous work. Begin with traffic distribution rather than traffic volume: a healthy site earns visits across hundreds of pages, not three viral posts from 2019.\n\nNext, look at the outbound pattern. Sites that publish twelve sponsored posts per week across unrelated industries are optimising for volume, not readership. Check whether commercial content is disclosed, whether authors have verifiable bylines, and whether the editorial calendar has continuity.\n\nFinally, examine relevance from the reader's perspective. If a reasonable person browsing that site would find your page useful, the placement is doing its job. If the only connection is a keyword, you are paying for a footprint rather than an endorsement.\n\nWe apply a version of this checklist to every domain in the marketplace, and we re-run it quarterly because sites change hands more often than most buyers assume.",
    author: "Daniel Okoye",
    readingMinutes: 6,
    publishedOn: "2026-03-04",
    featured: false,
  },
  {
    slug: "digital-pr-without-gimmicks",
    title: "Digital PR without gimmicks: building stories journalists actually use",
    category: "Digital PR",
    excerpt:
      "Newsworthiness is a craft, not a budget line. How to source data, frame an angle and earn coverage that survives editorial review.",
    body: "The fastest way to waste a digital PR budget is to start with the link and work backwards. Editors are not evaluating your anchor text; they are evaluating whether a story helps their readers.\n\nStrong campaigns usually begin with proprietary data: anonymised product usage, survey work with a defensible sample, or public datasets recombined in a way nobody has bothered to do. The angle should be explainable in a single sentence, and it should hold up if a sceptical reporter asks how you got the numbers.\n\nDistribution matters as much as the asset. Tiered outreach — a small exclusive window, then a wider regional push, then trade publications — usually outperforms a single mass send. Expect a meaningful share of coverage to arrive without a followed link; brand mentions still influence how models and search engines associate your name with a topic.\n\nMeasure campaigns on syndication depth, referring domain quality and assisted conversions, not on raw placement counts.",
    author: "Sofia Lindqvist",
    readingMinutes: 8,
    publishedOn: "2026-02-26",
    featured: true,
  },
  {
    slug: "auditing-a-toxic-backlink-profile",
    title: "Auditing a backlink profile without panicking about every link",
    category: "Link Audits",
    excerpt:
      "Most link audits over-diagnose. A triage order for deciding what to disavow, what to reclaim and what to leave alone.",
    body: "Most backlink audits start from the wrong assumption: that every unfamiliar link is a threat. In practice, search engines ignore the overwhelming majority of low-quality links rather than penalising the sites they point at. Treating an audit as a cleanup exercise usually wastes more time than it saves.\n\nTriage in this order. First, separate links you or a previous agency acquired from links that simply appeared. Paid placements from a network you once used are worth reviewing; scraper sites copying your content are not. Second, look for patterns rather than individual URLs — hundreds of identical anchors from one footprint matter, a single odd directory does not. Third, check what you have lost: broken references and redirected pages are a far more common cause of declining performance than anything toxic.\n\nDisavow sparingly and only where you have evidence of a deliberate scheme you cannot get removed manually. The file is a blunt instrument and over-use has cost sites real equity. In most audits we run, the recoverable value in lost and unlinked mentions exceeds anything gained by disavowing.",
    author: "Priya Raman",
    readingMinutes: 9,
    publishedOn: "2026-02-14",
    featured: false,
  },
  {
    slug: "outreach-emails-that-get-replies",
    title: "Why most outreach emails fail, and the few patterns that work",
    category: "Outreach",
    excerpt:
      "Response rates collapse when every email looks the same. What actually separates a 2% campaign from a 20% one.",
    body: "Editors receive dozens of link requests a week and almost all of them read identically: a compliment about the blog, a vague claim of relevance, a request for a link. The volume is why response rates sit in low single digits for most campaigns.\n\nThree things move the number. The first is specificity: name the article, name the paragraph, and explain what your resource adds that the current reference does not. The second is doing something for them first — reporting a broken link, correcting an outdated statistic, offering a chart they can embed. The third is brevity, because a busy editor decides within two sentences whether to keep reading.\n\nWhat does not work is volume. Sending three thousand templated emails produces a handful of low-quality placements and burns contacts you may want later. We consistently see higher returns from two hundred researched emails than from ten times that number sent blind.\n\nTrack declines as carefully as acceptances. The reasons people say no are the fastest route to improving the next campaign.",
    author: "Marta Ellison",
    readingMinutes: 6,
    publishedOn: "2026-02-03",
    featured: false,
  },
  {
    slug: "brand-mentions-and-ai-answers",
    title: "Why unlinked brand mentions matter more than they used to",
    category: "Digital PR",
    excerpt:
      "Systems that summarise the web rely on how independent sources describe you. Consistency is now a link building concern.",
    body: "Assistant-style results change the shape of discovery without changing the fundamentals. Systems that summarise the web still need sources they can parse, verify and attribute.\n\nThree things help. Be unambiguous about who you are: consistent entity information across your site, profiles and citations reduces the chance of being confused with a similarly named company. Be specific with facts: dates, figures and named methods are easier to quote than marketing adjectives. Be citable: original research, clear definitions and well-structured comparisons get referenced far more often than promotional pages.\n\nBrand mentions matter more in this environment, even without links. When multiple independent sources describe your company in similar terms, models are more likely to reproduce that description. Track how you are summarised, not only where you rank.",
    author: "Daniel Okoye",
    readingMinutes: 7,
    publishedOn: "2026-01-22",
    featured: true,
  },
  {
    slug: "link-building-reports-clients-trust",
    title: "Link building reports that clients actually trust",
    category: "Industry News",
    excerpt:
      "A list of live URLs is not a report. How to connect placements, anchor distribution and referring-domain growth to outcomes.",
    body: "Most link building reports fail for the same reason: they are delivery logs pretending to be analysis. A spreadsheet of URLs proves the links exist, but it does not explain whether the profile became more relevant, more diverse or more capable of supporting commercial pages.\n\nA report that survives client review has four layers. Start with referring-domain growth and the share that is topically relevant. Then show anchor distribution, split across brand, descriptive and exact-match phrases. Then list placements with page-level traffic, attribution and target URL. Finally connect the work to movement on the pages receiving links, while being honest that correlation is not attribution.\n\nKeep the same definitions for at least four quarters so trends remain comparable. Record metric snapshots at publication because third-party scores change constantly, and annotate removed or replaced links rather than quietly deleting them.\n\nClients trust reports they can verify. Give them live URLs, a methodology and a clear explanation of what did not work as well as what did.",
    author: "Sofia Lindqvist",
    readingMinutes: 5,
    publishedOn: "2026-01-09",
    featured: false,
  },
  {
    slug: "local-link-building-multi-location",
    title: "Local link building for multi-location businesses",
    category: "Link Building",
    excerpt:
      "Sending every regional link to one homepage wastes the geographic signal. How to structure local acquisition per branch.",
    body: "The most common mistake in multi-location link building is treating the company as one entity. Every regional newspaper mention, every chamber of commerce listing and every local sponsorship gets pointed at the homepage, and the geographic signal dissolves.\n\nStructure it per branch instead. Each location needs its own prospect list drawn from its actual catchment: the regional press, community organisations, local suppliers, event calendars and industry bodies operating in that area. Each of those links should point at that location's page, not the homepage, because that is the page a reader following the link would want.\n\nConsistency matters as much as volume here. Where business details differ between sources — an old phone number, a former address, an abbreviated street name — the value of those references is diluted. Auditing and correcting existing listings frequently produces more movement than adding new ones.\n\nRegional sources are also considerably cheaper than national placements and far harder for a competitor to replicate at scale, because the relationships are genuinely local.",
    author: "Priya Raman",
    readingMinutes: 6,
    publishedOn: "2025-12-18",
    featured: false,
  },
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
  const [publisherRows, projectRows, articleRows, faqRows, caseRows, testimonialRows] =
    await Promise.all([
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(publishers),
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(projects),
      db.select({ n: sql<number>`cast(count(*) as int)` }).from(articles),
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
  if (articleRows[0].n === 0) {
    await db.insert(articles).values(ARTICLE_ROWS).onConflictDoNothing();
  }
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
export const FALLBACK_ARTICLES = [...ARTICLE_ROWS, ...BLOG_POSTS];
