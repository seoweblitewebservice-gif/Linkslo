import { BACKLINK_SERVICES, COUNTRY_PAGES, INDUSTRY_PAGES } from "@/lib/backlinks";
import type { BacklinkService } from "@/lib/backlinks";
import { slugify } from "@/lib/format";
import type { GigBenefit, GigFaq, GigPackage, GigReview, GigStep } from "@/lib/gigs/types";

export const GIG_COUNT = BACKLINK_SERVICES.length * 100;
export const GIGS_PER_SERVICE = 100;

export type GigInsert = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  subcategory: string;
  serviceSlug: string;
  industry: string;
  country: string;
  language: string;
  objective: string;
  summary: string;
  description: string;
  placement: string;
  quality: string;
  sellerName: string;
  sellerHandle: string;
  sellerInitials: string;
  sellerCountry: string;
  sellerLevel: string;
  sellerBio: string;
  sellerLanguages: string;
  sellerResponseHours: number;
  sellerSinceYear: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  ordersCompleted: number;
  startingPrice: number;
  fastestDeliveryDays: number;
  packages: string;
  included: string;
  benefits: string;
  process: string;
  useCases: string;
  faqs: string;
  reviews: string;
  featured: boolean;
  domain?: string | null;
  authority?: number | null;
  organicTraffic?: number | null;
  linkType?: string | null;
};

type Topic = {
  title: string;
  category: string;
  service: BacklinkService;
  fixedIndustry?: string;
  fixedCountry?: string;
};

const EXTRA_GUEST_TOPICS = [
  "SaaS Guest Posts",
  "Finance Guest Posts",
  "Health Guest Posts",
  "Technology Guest Posts",
  "Marketing Guest Posts",
  "Gaming Guest Posts",
  "Travel Guest Posts",
  "Real Estate Guest Posts",
  "CBD Guest Posts",
  "Local Guest Posts",
] as const;

const EXTRA_AUTHORITY_TOPICS = [
  "DA 30+ Backlinks",
  "DA 50+ Backlinks",
  "DA 70+ Backlinks",
  "DR 30+ Backlinks",
  "DR 50+ Backlinks",
  "DR 70+ Backlinks",
  "High Trust Flow Backlinks",
  "High Citation Flow Backlinks",
] as const;

/** Exact search-intent labels from the full brief that are not core page names. */
const EXTRA_REQUIRED_TOPICS = [
  ["Web 2.0 Link Building", "web-2-0-backlinks"],
  ["High Authority Backlinks", "authority-backlinks"],
  ["Premium Authority Backlinks", "authority-backlinks"],
  ["Map/Citation Links", "citation-directory-backlinks"],
  ["Forum Backlinks", "forum-community-backlinks"],
  ["Social Bookmarking Backlinks", "social-bookmarking-backlinks"],
  ["Press Release Backlinks", "press-release-news-backlinks"],
  ["Unlinked Brand Mention Link Building", "brand-entity-link-building"],
  ["Link Insertion", "niche-edit-backlinks"],
  ["Skyscraper Link Building", "resource-link-building"],
  ["Image Backlinks", "image-infographic-link-building"],
  ["Infographic Backlinks", "image-infographic-link-building"],
  ["Founder/Author Links", "brand-entity-link-building"],
  ["Digital PR", "digital-pr-backlinks"],
  ["Custom Monthly Link Building Campaigns", "monthly-link-building"],
  ["Premium Backlinks", "premium-link-building"],
  ["Premium Link Building Campaigns", "premium-link-building"],
] as const;

const OBJECTIVES = [
  { label: "Commercial page authority", phrase: "commercial pages", focus: "a revenue-focused landing page" },
  { label: "Topical authority", phrase: "topical authority", focus: "a supporting topic cluster" },
  { label: "Brand-led profile growth", phrase: "brand authority", focus: "a brand-led backlink profile" },
  { label: "New website launch", phrase: "a new website", focus: "an early-stage domain" },
  { label: "Competitor gap closing", phrase: "a competitor gap", focus: "a documented competitor link gap" },
  { label: "Category page growth", phrase: "category pages", focus: "high-intent category pages" },
  { label: "Local landing page growth", phrase: "local landing pages", focus: "a location-specific landing page" },
  { label: "International expansion", phrase: "market expansion", focus: "a market-specific language page" },
  { label: "Anchor profile diversification", phrase: "anchor diversity", focus: "a profile needing safer anchor variety" },
  { label: "Ongoing authority building", phrase: "monthly growth", focus: "a sustained acquisition roadmap" },
] as const;

const INDUSTRIES = INDUSTRY_PAGES.map((item) => item.name);
const COUNTRIES = COUNTRY_PAGES.map((item) => item.country);
const LANGUAGE_BY_COUNTRY = new Map(COUNTRY_PAGES.map((item) => [item.country, item.language]));

const SELLER_FIRST_NAMES = [
  "Elena", "Marcus", "Sofia", "Daniel", "Nina", "Liam", "Hanna", "Camille", "Mateo", "Rachel",
  "Tom", "Maya", "Oliver", "Priya", "Jonas", "Amara", "Leo", "Erin", "Alex", "Eleanor",
  "Noor", "Theo", "Isabel", "Ben", "Klara", "Lucas", "Grace", "Samir", "Julia", "Cian",
  "Petra", "Dominic", "Marisol", "Arne", "Fiona", "Emeka", "Clara", "Owen", "Ingrid", "Rafael",
] as const;

const SELLER_LAST_NAMES = [
  "Kovacs", "Reed", "Lind", "Okoye", "Patel", "Byrne", "Brecht", "Roux", "Silva", "Aiken",
  "Ferreira", "Chen", "Grant", "Raman", "Meyer", "Diallo", "Martin", "Walsh", "Moreno", "Price",
  "Hassan", "Campbell", "Costa", "Foster", "Novak", "Varga", "Kim", "Rahman", "Stein", "Murphy",
  "Lindgren", "Ashford", "Vega", "Boersma", "Mackay", "Nwosu", "Beaumont", "Pritchard", "Halvorsen", "Dominguez",
] as const;

const REVIEW_FIRST_NAMES = [
  "Ava", "Noah", "Mia", "Ethan", "Zoe", "Luca", "Sara", "Adam",
  "Iris", "Omar", "Lea", "Hugo", "Nora", "Felix", "Emma", "Ravi",
  "Lena", "Marco", "Chloe", "Jon", "Marta", "Louis", "Nadia", "Eric",
  "Sanne", "David", "Ana", "Tobias", "Maya", "Paul", "Yara", "Simon",
  "Karin", "Diego", "Tara", "Kenji", "Rosa", "Sam", "Ines", "Joel",
  "Lin", "Bruno", "Aisha", "Arjun", "Tess", "Gabe", "Eli", "June",
  "Aya", "Milo", "Cleo", "Ivan", "Suri", "Theo", "Mina", "Remy",
  "Ivy", "Nico", "Lina", "Otto", "Esme", "Dara", "Alba", "Kian",
] as const;

const REVIEW_LAST_NAMES = [
  "Anders", "Bennett", "Costa", "Dubois", "Evans", "Fischer", "Garcia", "Hughes",
  "Ivanov", "Jansen", "Khan", "Lopez", "Muller", "Nguyen", "Owens", "Pereira",
  "Quinn", "Rossi", "Singh", "Tanaka", "Urban", "Visser", "White", "Xu",
  "Young", "Zimmer", "Ahmed", "Bakker", "Clark", "Diaz", "Eriksen", "Ford",
  "Green", "Herrera", "Ito", "Jones", "Kaur", "Laurent", "Mendes", "Nolan",
  "Ortiz", "Park", "Reyes", "Smith", "Tran", "Vega", "Walker", "Yilmaz",
  "Adler", "Brown", "Cohen", "Davis", "Elias", "Franco", "Gupta", "Hart",
  "Ibrahim", "Jensen", "Klein", "Liu", "Moore", "Neri", "Olsen", "Price",
] as const;

const SELLER_COUNTRIES = [
  "Netherlands", "United Kingdom", "Sweden", "Ireland", "Canada", "Germany", "France", "Spain",
  "United States", "Portugal", "Australia", "Italy", "Poland", "India",
] as const;

const LEVELS = ["Level One", "Level Two", "Top Rated", "Pro Verified"] as const;

/** Affordable entry pricing calibrated to delivery effort, not inflated metrics. */
const AFFORDABLE_BASE_PRICES: Record<string, number> = {
  "guest-post-backlinks": 45,
  "editorial-backlinks": 65,
  "contextual-backlinks": 35,
  "niche-edit-backlinks": 40,
  "web-2-0-backlinks": 18,
  "authority-backlinks": 55,
  "local-backlinks": 35,
  "citation-directory-backlinks": 25,
  "forum-community-backlinks": 15,
  "blog-comment-backlinks": 10,
  "social-bookmarking-backlinks": 8,
  "press-release-news-backlinks": 75,
  "digital-pr-backlinks": 160,
  "resource-link-building": 55,
  "broken-link-building": 50,
  "image-infographic-link-building": 65,
  "saas-software-backlinks": 50,
  "edu-gov-resource-links": 70,
  "competitor-link-building": 35,
  "brand-entity-link-building": 40,
  "monthly-link-building": 95,
  "premium-link-building": 125,
};

const TITLE_ACTIONS: Record<string, string> = {
  "Placement Services": "secure",
  "Foundation Links": "build",
  "Authority & Metrics": "source",
  "Local & Directories": "create",
  "Community Links": "build manually",
  "PR & News": "earn",
  "Outreach Services": "run",
  "Specialist Programmes": "secure",
  "Strategy Services": "research and build",
  "Campaign Programmes": "manage",
};

const QUALITY_ANGLES = [
  "manual outreach",
  "traffic-screened publishers",
  "relevance-first prospecting",
  "editorial quality checks",
  "natural anchor planning",
  "page-level indexing checks",
  "audience-matched placements",
  "contextual placement review",
  "publisher ownership checks",
  "transparent live reporting",
] as const;

const PAGE_TARGETS = [
  "homepage",
  "commercial landing page",
  "category page",
  "resource page",
  "local landing page",
  "comparison page",
  "product page",
  "service page",
  "brand page",
  "topic cluster",
] as const;

/** Shorter labels used only inside <title> tags, to keep them closer to Google's ~60-char display limit. */
const PAGE_TARGET_TITLE_LABELS: Record<string, string> = {
  "homepage": "Homepage",
  "commercial landing page": "Landing Page",
  "category page": "Category Page",
  "resource page": "Resource Page",
  "local landing page": "Local Page",
  "comparison page": "Comparison Page",
  "product page": "Product Page",
  "service page": "Service Page",
  "brand page": "Brand Page",
  "topic cluster": "Topic Cluster",
};

function topicCatalog(): Topic[] {
  const topics: Topic[] = [];
  const seen = new Set<string>();
  const add = (topic: Topic) => {
    const key = `${topic.title.toLowerCase()}|${topic.fixedIndustry ?? ""}|${topic.fixedCountry ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    topics.push(topic);
  };

  for (const service of BACKLINK_SERVICES) {
    add({ title: service.nav, category: service.nav, service });
    for (const variant of service.variants) {
      add({ title: variant, category: service.nav, service });
    }
  }

  const guest = BACKLINK_SERVICES.find((item) => item.slug === "guest-post-backlinks")!;
  for (const title of EXTRA_GUEST_TOPICS) {
    const match = INDUSTRY_PAGES.find((item) => title.toLowerCase().startsWith(item.name.toLowerCase()));
    add({ title, category: guest.nav, service: guest, fixedIndustry: match?.name });
  }

  const authority = BACKLINK_SERVICES.find((item) => item.slug === "authority-backlinks")!;
  for (const title of EXTRA_AUTHORITY_TOPICS) {
    add({ title, category: authority.nav, service: authority });
  }

  for (const [title, serviceSlug] of EXTRA_REQUIRED_TOPICS) {
    const service = BACKLINK_SERVICES.find((item) => item.slug === serviceSlug)!;
    add({ title, category: service.nav, service });
  }

  const monthly = BACKLINK_SERVICES.find((item) => item.slug === "monthly-link-building")!;
  for (const industry of INDUSTRY_PAGES) {
    add({
      title: `${industry.name} Backlinks`,
      category: "Industry-Specific Backlinks",
      service: industry.slug === "saas"
        ? BACKLINK_SERVICES.find((item) => item.slug === "saas-software-backlinks")!
        : monthly,
      fixedIndustry: industry.name,
    });
  }

  for (const country of COUNTRY_PAGES.filter((item) => item.slug !== "international")) {
    add({
      title: `${country.country} Backlinks`,
      category: "Country-Specific Backlinks",
      service: monthly,
      fixedCountry: country.country,
    });
  }

  add({ title: "International Backlinks", category: "Country-Specific Backlinks", service: monthly });
  add({ title: "Country-Specific Backlinks", category: "Country-Specific Backlinks", service: monthly });
  add({ title: "Language-Specific Backlinks", category: "Country-Specific Backlinks", service: monthly });

  return topics;
}

export const GIG_TOPICS = topicCatalog();

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function sentenceCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export function sellerFor(index: number, category: string) {
  const sellerIndex = index % 160;
  const first = SELLER_FIRST_NAMES[sellerIndex % SELLER_FIRST_NAMES.length];
  const last = SELLER_LAST_NAMES[Math.floor(sellerIndex / SELLER_FIRST_NAMES.length) % SELLER_LAST_NAMES.length];
  const name = `${first} ${last}`;
  const country = SELLER_COUNTRIES[(sellerIndex * 7) % SELLER_COUNTRIES.length];
  const speciality = category.replace(" Backlinks", "").replace("Link Building", "outreach").toLowerCase();
  return {
    name,
    handle: `${first}.${last}`.toLowerCase(),
    initials: `${first[0]}${last[0]}`,
    country,
    level: LEVELS[(sellerIndex * 3) % LEVELS.length],
    languages: country === "Germany" ? "German, English" : country === "France" ? "French, English" : country === "Spain" ? "Spanish, English" : country === "Italy" ? "Italian, English" : "English",
    responseHours: 1 + (sellerIndex % 6),
    sinceYear: 2018 + (sellerIndex % 6),
    bio: `${name} is a ${speciality} specialist based in ${country}, with a manually reviewed delivery process focused on relevance, placement context and transparent reporting.`,
  };
}

export function reviewerFor(uniqueIndex: number) {
  const first = REVIEW_FIRST_NAMES[uniqueIndex % REVIEW_FIRST_NAMES.length];
  const last = REVIEW_LAST_NAMES[
    Math.floor(uniqueIndex / REVIEW_FIRST_NAMES.length) % REVIEW_LAST_NAMES.length
  ];
  const cycle = Math.floor(
    uniqueIndex / (REVIEW_FIRST_NAMES.length * REVIEW_LAST_NAMES.length),
  );
  const middle = cycle > 0 ? ` ${String.fromCharCode(64 + cycle)}.` : "";
  return {
    name: `${first}${middle} ${last}`,
    initials: `${first[0]}${last[0]}`,
  };
}

function packagesFor(
  service: BacklinkService,
  topic: Topic,
  industry: string,
  country: string,
  objective: string,
  index: number,
  qualityAngle: string,
  pageTarget: string,
): GigPackage[] {
  const base = AFFORDABLE_BASE_PRICES[service.slug] ?? 40;
  const marketFactor = [1.08, 1.05, 1.03, 1.04, 1.02, 1, 0.98, 1, 0.96, 0.82][COUNTRIES.indexOf(country)] ?? 1;
  const variance = 0.78 + ((index * 17) % 31) / 100;
  const basicPrice = Math.max(5, Math.round((base * marketFactor * variance) / 5) * 5);
  const quantities = [1 + (index % 3), 4 + (index % 5), 10 + (index % 9)];
  const tierNames = [
    `Focused ${topic.title}`,
    `${industry} Growth Campaign`,
    `${country} Authority Programme`,
  ];
  const multipliers = [1, 2.15, 4.4];

  return (["basic", "standard", "premium"] as const).map((tier, tierIndex) => {
    const quantity = quantities[tierIndex];
    const delivery = Math.max(4, service.packages[Math.min(tierIndex, 2)].deliveryDays + (index % 5) - 2);
    return {
      tier,
      name: tierNames[tierIndex],
      price: Math.round((basicPrice * multipliers[tierIndex]) / 5) * 5,
      deliveryDays: delivery,
      revisions: tierIndex + 1,
      quantity: `${quantity} ${quantity === 1 ? "core deliverable" : "core deliverables"}`,
      description:
        tierIndex === 0
          ? `A focused ${sentenceCase(topic.title)} order for one ${industry.toLowerCase()} ${pageTarget} in ${country}, delivered with ${qualityAngle}.`
          : tierIndex === 1
            ? `A balanced ${country} campaign supporting ${objective.toLowerCase()} for the ${industry.toLowerCase()} ${pageTarget}, with broader publisher and anchor variety plus ${qualityAngle}.`
            : `A multi-page ${country} programme extending ${qualityAngle} beyond the ${pageTarget}, with priority prospecting, deeper review and post-delivery monitoring.`, 
      features: [
        `${quantity} manually reviewed deliverables for ${industry}`,
        `${country} publisher and language matching`,
        `Placement context checked for ${topic.title.toLowerCase()}`,
        tierIndex >= 1 ? `Anchor distribution mapped to ${objective.toLowerCase()}` : "One target URL and anchor review",
        tierIndex >= 1 ? "Priority seller communication and progress updates" : "Final live URL delivery report",
        tierIndex === 2 ? `90-day monitoring for the ${country} campaign` : "Quality check before completion",
      ],
      recommended: tierIndex === 1,
    };
  });
}

function reviewsFor(
  index: number,
  topic: Topic,
  industry: string,
  country: string,
  objective: string,
  uniqueBrief: string,
  sellerName: string,
): GigReview[] {
  const first = reviewerFor(index * 2);
  const second = reviewerFor(index * 2 + 1);
  const firstCountry = COUNTRIES[(index * 3 + 2) % COUNTRIES.length];
  const secondCountry = COUNTRIES[(index * 7 + 5) % COUNTRIES.length];
  return [
    {
      name: first.name,
      initials: first.initials,
      country: firstCountry,
      rating: index % 9 === 0 ? 4 : 5,
      date: `2026-${String((index % 8) + 1).padStart(2, "0")}-${String((index * 7) % 27 + 1).padStart(2, "0")}`,
      packageTier: "Standard",
      text: `We hired ${sellerName} to ${sentenceCase(uniqueBrief)}. The shortlist explained why each option suited our ${objective.toLowerCase()} goal, and the ${country} placement report was clear enough to share internally.`, 
    },
    {
      name: second.name,
      initials: second.initials,
      country: secondCountry,
      rating: index % 13 === 0 ? 4 : 5,
      date: `2026-${String(((index + 3) % 8) + 1).padStart(2, "0")}-${String((index * 11) % 27 + 1).padStart(2, "0")}`,
      packageTier: index % 4 === 0 ? "Premium" : "Basic",
      text: `${sellerName} handled the brief to ${sentenceCase(uniqueBrief)} as a specific campaign, not a generic list with the market name changed. Communication covered placement context and anchor risk for our ${industry.toLowerCase()} page before delivery.`, 
    },
  ];
}

function faqsFor(
  index: number,
  topic: Topic,
  industry: string,
  country: string,
  objective: string,
  uniqueBrief: string,
): GigFaq[] {
  const brief = uniqueBrief;
  return [
    {
      question: `How are opportunities selected when I order this gig to ${brief}?`,
      answer: `When hired to ${brief}, the seller starts with ${industry.toLowerCase()} relevance, then checks the exact page for organic visibility, indexing, outbound-link behaviour and editorial context. The market and language are verified before the shortlist is submitted for approval.`, 
    },
    {
      question: `What buyer information is required before the seller can ${brief}?`,
      answer: `Before starting the work to ${brief}, you provide the destination page, competitors to avoid and any anchor preference. The seller reviews the existing profile, proposes natural wording and confirms whether this acquisition route is appropriate.`, 
    },
    {
      question: `Are authority metrics enough when the gig brief is to ${brief}?`,
      answer: `No. When the brief is to ${brief}, DA, DR, TF and CF remain third-party estimates rather than proof of quality. The exact page must also be indexed, topically aligned, supported by genuine traffic and placed naturally.`, 
    },
    {
      question: `Are PBN websites excluded when I hire the seller to ${brief}?`,
      answer: `Yes. Work to ${brief} excludes private blog networks and disguised network placements. Every proposed source must exist for its own audience and pass manual ownership, traffic and editorial-pattern review before delivery.`, 
    },
  ];
}

export function generateGigRows(count = GIG_COUNT): GigInsert[] {
  const rows: GigInsert[] = [];
  const topics = GIG_TOPICS;

  for (let index = 0; index < count; index += 1) {
    const serviceIndex = Math.floor(index / GIGS_PER_SERVICE) % BACKLINK_SERVICES.length;
    const localIndex = index % GIGS_PER_SERVICE;
    const service = BACKLINK_SERVICES[serviceIndex];
    const serviceTopics = topics.filter((item) => item.service.slug === service.slug);
    const topic = serviceTopics[localIndex % serviceTopics.length];
    const cycle = Math.floor(localIndex / serviceTopics.length);
    const industry = topic.fixedIndustry ?? INDUSTRIES[(serviceIndex * 5 + localIndex * 7 + cycle) % INDUSTRIES.length];
    const country = topic.fixedCountry ?? COUNTRIES[(serviceIndex * 3 + localIndex * 7 + cycle * 2) % COUNTRIES.length];
    const language = LANGUAGE_BY_COUNTRY.get(country) ?? "English";
    const objective = OBJECTIVES[(serviceIndex + localIndex * 3 + cycle) % OBJECTIVES.length];
    const seller = sellerFor(serviceIndex * 13 + localIndex * 7, service.nav);
    const action = TITLE_ACTIONS[service.group] ?? "deliver";
    const qualityAngle = QUALITY_ANGLES[localIndex % QUALITY_ANGLES.length];
    const pageTarget = PAGE_TARGETS[Math.floor(localIndex / QUALITY_ANGLES.length)];

    const uniqueBrief = `${action} ${topic.title.toLowerCase()} for your ${industry} ${pageTarget} in ${country} with ${qualityAngle}`;
    const title = `I will ${uniqueBrief}`;
    const slug = `${slugify(title)}-${String(index + 1).padStart(4, "0")}`;
    const packages = packagesFor(
      service,
      topic,
      industry,
      country,
      objective.label,
      index,
      qualityAngle,
      pageTarget,
    );
    const reviews = reviewsFor(
      index,
      topic,
      industry,
      country,
      objective.label,
      uniqueBrief,
      seller.name,
    );
    const faqs = faqsFor(
      index,
      topic,
      industry,
      country,
      objective.label,
      uniqueBrief,
    );
    const rating = index % 17 === 0 ? 47 : index % 7 === 0 ? 48 : 49;
    const orderCount = 6 + ((index * 47 + serviceIndex * 13 + localIndex * 5) % 1_180);
    const reviewCount = Math.max(2, Math.round(orderCount * (0.18 + (index % 9) / 100)));

    const included = service.included.slice(0, 5).map(
      (item, itemIndex) =>
        `${item} — adapted for the ${industry.toLowerCase()} ${pageTarget} in ${country} using ${qualityAngle}${itemIndex === 0 ? ` to support ${objective.label.toLowerCase()}` : ""}.`,
    );
    const benefits: GigBenefit[] = service.benefits.slice(0, 4).map((item, itemIndex) => ({
      title: item.title,
      body: `${item.body} This version applies ${qualityAngle} to a ${industry.toLowerCase()} ${pageTarget} in ${country}${itemIndex === 0 ? ` and supports ${objective.focus}` : ""}.`,
    }));
    const process: GigStep[] = service.process.map((step, stepIndex) => ({
      title: step.title,
      body: `${step.body} Stage ${stepIndex + 1} records how ${qualityAngle} is applied to the ${pageTarget} for this ${country} brief.`,
    }));
    const useCases = [
      `${industry} businesses strengthening ${objective.focus} with ${qualityAngle}`,
      `Agencies sourcing ${topic.title.toLowerCase()} for a ${country} ${pageTarget}`,
      `Teams that need ${language.toLowerCase()} publisher matching for a ${pageTarget}`,
      `Buyers who want ${qualityAngle} instead of an undisclosed link bundle`,
    ];

    rows.push({
      slug,
      title,
      metaTitle: `${titleCase(topic.title)} — ${industry} ${PAGE_TARGET_TITLE_LABELS[pageTarget] ?? titleCase(pageTarget)} (${country})`,
      metaDescription: `${topic.title} for a ${industry.toLowerCase()} ${pageTarget} in ${country}, using ${qualityAngle}. Basic, Standard & Premium packages.`,
      category: service.nav,
      subcategory: topic.title,
      serviceSlug: service.slug,
      industry,
      country,
      language,
      objective: objective.label,
      summary: `${topic.title} for a ${industry.toLowerCase()} ${pageTarget} targeting ${country}, with ${qualityAngle}, transparent placement checks and three affordable package levels.`,
      description: `This gig is designed to ${uniqueBrief}. ${seller.name} reviews the destination page first, maps the work to ${objective.focus}, and documents why each opportunity suits the requested page rather than reusing a generic prospect list.\n\nThe delivery combines ${language.toLowerCase()} publisher fit, page-level indexing, genuine traffic and natural link context instead of relying on authority scores alone. ${service.intro[index % service.intro.length]} Every option remains subject to publisher approval and no ranking position is promised.`,
      placement: `${service.placement} For the specific brief to ${uniqueBrief}, the surrounding context must serve the intended reader and the final URL is checked again before the order is marked complete.`,
      quality: `${service.quality} The review for work to ${uniqueBrief} also records language fit, topical overlap and whether the proposed source would remain useful without the backlink.`, 
      sellerName: seller.name,
      sellerHandle: seller.handle,
      sellerInitials: seller.initials,
      sellerCountry: seller.country,
      sellerLevel: seller.level,
      sellerBio: seller.bio,
      sellerLanguages: seller.languages,
      sellerResponseHours: seller.responseHours,
      sellerSinceYear: seller.sinceYear,
      verified: true,
      rating,
      reviewCount,
      ordersCompleted: orderCount,
      startingPrice: packages[0].price,
      fastestDeliveryDays: packages[0].deliveryDays,
      packages: JSON.stringify(packages),
      included: JSON.stringify(included),
      benefits: JSON.stringify(benefits),
      process: JSON.stringify(process),
      useCases: JSON.stringify(useCases),
      faqs: JSON.stringify(faqs),
      reviews: JSON.stringify(reviews),
      featured: index < 12 || index % 173 === 0,
    });
  }

  return rows;
}
