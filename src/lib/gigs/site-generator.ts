import { slugify, normaliseDomain } from "@/lib/format";
import { sellerFor, reviewerFor, titleCase } from "@/lib/gigs/generator";
import type { GigBenefit, GigFaq, GigPackage, GigReview, GigStep } from "@/lib/gigs/types";
import type { GigInsert } from "@/lib/gigs/generator";
import siteData from "@/lib/gigs/site-guest-post-data.json";

type RawSite = {
  site: string;
  da: string | null;
  dr: string | null;
  traffic: string;
  price: number;
  linkType: string;
  category: string;
};

const RAW_SITES = siteData as RawSite[];

/** Number of real, price-listed publisher domains available as individual gigs. */
export const SITE_GIG_COUNT = RAW_SITES.length;

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  unverified: "General",
  technology: "Technology",
  "news & media": "News & Media",
  "food & beverage": "Food & Beverage",
  lifestyle: "Lifestyle",
  finance: "Finance",
  entertainment: "Entertainment",
  wedding: "Wedding",
  business: "Business",
  "art & culture": "Art & Culture",
};

function industryFor(rawCategory: string) {
  const key = rawCategory.trim().toLowerCase();
  const primary = key.split(",")[0]?.split("·")[0]?.trim() ?? key;
  return CATEGORY_LABELS[primary] ?? titleCase(primary || "general");
}

/** Rough TLD → market mapping so location and language read naturally instead of "International" 6,686 times. */
const TLD_MARKETS: Array<[string, { country: string; language: string }]> = [
  [".co.uk", { country: "United Kingdom", language: "English" }],
  [".org.uk", { country: "United Kingdom", language: "English" }],
  [".uk", { country: "United Kingdom", language: "English" }],
  [".com.au", { country: "Australia", language: "English" }],
  [".net.au", { country: "Australia", language: "English" }],
  [".au", { country: "Australia", language: "English" }],
  [".com.in", { country: "India", language: "English" }],
  [".co.in", { country: "India", language: "English" }],
  [".org.in", { country: "India", language: "English" }],
  [".in", { country: "India", language: "English" }],
  [".ca", { country: "Canada", language: "English" }],
  [".de", { country: "Germany", language: "German" }],
  [".fr", { country: "France", language: "French" }],
  [".es", { country: "Spain", language: "Spanish" }],
  [".it", { country: "Italy", language: "Italian" }],
  [".pt", { country: "Portugal", language: "Portuguese" }],
  [".nl", { country: "Netherlands", language: "Dutch" }],
  [".br", { country: "Brazil", language: "Portuguese" }],
  [".pk", { country: "Pakistan", language: "English" }],
  [".lat", { country: "Latin America", language: "Spanish" }],
  [".mx", { country: "Mexico", language: "Spanish" }],
  [".ie", { country: "Ireland", language: "English" }],
  [".co", { country: "United States", language: "English" }],
  [".us", { country: "United States", language: "English" }],
];

function marketFor(domain: string) {
  const lower = domain.toLowerCase();
  for (const [suffix, market] of TLD_MARKETS) {
    if (lower.endsWith(suffix)) return market;
  }
  return { country: "United States", language: "English" };
}

/** Converts traffic strings like "1.9M", "146.6K", "30 M", "1.2k", "500" into an approximate monthly-visit count. */
function parseTraffic(value: string): number {
  const cleaned = value.trim().replace(/\+$/, "").replace(/\s+/g, "");
  const match = cleaned.match(/^([\d.]+)([kKmM]?)$/);
  if (!match) return 500;
  const num = parseFloat(match[1]);
  if (Number.isNaN(num)) return 500;
  const unit = match[2].toLowerCase();
  if (unit === "m") return Math.round(num * 1_000_000);
  if (unit === "k") return Math.round(num * 1_000);
  return Math.round(num);
}

function formatTraffic(monthly: number): string {
  if (monthly >= 1_000_000) return `${(monthly / 1_000_000).toFixed(monthly % 1_000_000 === 0 ? 0 : 1)}M`;
  if (monthly >= 1_000) return `${(monthly / 1_000).toFixed(monthly % 1_000 === 0 ? 0 : 1)}K`;
  return String(monthly);
}

const DELIVERY_STEPS: GigStep[] = [
  { title: "Domain and brief check", body: "The exact publishing domain, its current organic traffic and indexing status are reconfirmed before the order is accepted, and your target page and anchor preference are reviewed for topical fit." },
  { title: "Content drafted or reviewed", body: "An original article is written to the publisher's editorial guidelines, or your supplied draft is checked against those guidelines and adjusted where required." },
  { title: "Editorial submission", body: "The article is submitted to the publisher's editorial team for approval. Publishers retain final editorial control, so minor wording changes can happen during this step." },
  { title: "Live URL and report", body: "Once published, the live URL, publish date and link attribution (dofollow or nofollow, as listed) are confirmed and delivered in your order report." },
];

function benefitsFor(domain: string, da: number | null, dr: number | null, industry: string): GigBenefit[] {
  return [
    { title: "Real, named publication", body: `You are ordering a placement on ${domain} specifically, not an undisclosed site swapped in after payment. The domain is confirmed before you order.` },
    { title: "Metrics shown upfront", body: `${domain} is listed with a Domain Authority of ${da ?? "N/A"}${dr !== null ? ` and a Domain Rating of ${dr}` : ""}, sourced from third-party SEO tools, so you can judge fit before ordering rather than after.` },
    { title: `${industry} relevance`, body: `${domain} is catalogued under ${industry.toLowerCase()}, which matters more for link value than authority scores alone.` },
    { title: "Editorial placement, not a link farm", body: "The article is written for the publication's own readers and submitted through its normal editorial process, not injected into an existing page." },
  ];
}

function faqsFor(domain: string, da: number | null, dr: number | null, trafficLabel: string, linkType: string, price: number, category: string): GigFaq[] {
  return [
    {
      question: `What are the current metrics for ${domain}?`,
      answer: `${domain} is currently listed with a Domain Authority of ${da ?? "not available"}${dr !== null ? ` and a Domain Rating of ${dr}` : ""}, and estimated organic traffic of around ${trafficLabel} visits per month. These figures come from third-party SEO tools (such as Moz and Ahrefs-style estimates), refresh periodically, and are provided as guidance rather than a guarantee, since publisher metrics move over time.`,
    },
    {
      question: `Will the backlink from ${domain} be dofollow or nofollow?`,
      answer: linkType === "nofollow"
        ? `${domain} currently attributes outbound editorial links as nofollow. The placement still delivers genuine referral traffic, brand exposure and topical association on a real ${category.toLowerCase()} publication, even though the link does not pass full authority signal the way a dofollow link would.`
        : `${domain} currently publishes contextual outbound links as dofollow. If the publisher's policy changes before delivery, you are notified and offered a comparable alternative or a partial refund for the difference.`,
    },
    {
      question: `What is included for $${price}?`,
      answer: `The $${price} placement includes topic approval, an original article written to ${domain}'s editorial guidelines (or review of your supplied draft), one contextual in-content link to your chosen target URL, and a delivery report with the live URL once it is published and indexed.`,
    },
    {
      question: `Is the guest post on ${domain} permanent?`,
      answer: `Placements are intended to stay live permanently under the publisher's normal retention policy. The URL is checked at delivery to confirm it is indexed and live; if it is removed by the publisher within the stated monitoring window, a replacement placement of comparable metrics is arranged.`,
    },
    {
      question: `Can I supply my own topic or article for ${domain}?`,
      answer: `Yes. You can propose the topic and target page, or supply your own draft. Either way, the content is checked against ${domain}'s editorial guidelines before submission, since publishers reserve final approval and unrelated or overly promotional drafts are typically declined.`,
    },
  ];
}

function packagesFor(domain: string, price: number, category: string): GigPackage[] {
  const basic = Math.max(20, price);
  const standardQty = 3;
  const premiumQty = 5;
  return [
    {
      tier: "basic",
      name: `1 Guest Post on ${domain}`,
      price: basic,
      deliveryDays: 10,
      revisions: 1,
      quantity: "1 placement",
      description: `One original guest post published on ${domain}, with one contextual link to your target page.`,
      features: [
        `1 guest post placement on ${domain}`,
        "Topic approved before writing begins",
        "900+ word original article",
        "1 contextual in-content link",
        "Live URL delivery report",
      ],
      recommended: false,
    },
    {
      tier: "standard",
      name: `${standardQty} Guest Posts incl. ${domain}`,
      price: Math.round((basic * 2.6) / 5) * 5,
      deliveryDays: 16,
      revisions: 2,
      quantity: `${standardQty} placements`,
      description: `A guest post on ${domain} plus two comparable ${category.toLowerCase()}-relevant publications, spreading anchors across three domains.`,
      features: [
        `Guest post on ${domain}`,
        `2 further placements on comparable ${category.toLowerCase()} domains`,
        "Anchor text distribution across all 3 links",
        "Priority editor scheduling",
        "Live URL report for every placement",
      ],
      recommended: true,
    },
    {
      tier: "premium",
      name: `${premiumQty} Guest Posts incl. ${domain}`,
      price: Math.round((basic * 4.4) / 5) * 5,
      deliveryDays: 24,
      revisions: 3,
      quantity: `${premiumQty} placements`,
      description: `A guest post on ${domain} as the anchor placement, plus four further vetted ${category.toLowerCase()} publications for a broader, more natural link profile.`,
      features: [
        `Guest post on ${domain}`,
        `4 further placements on vetted ${category.toLowerCase()} domains`,
        "Full anchor and target-page distribution plan",
        "Dedicated order updates",
        "90-day placement monitoring",
      ],
      recommended: false,
    },
  ];
}

function useCasesFor(domain: string, industry: string): string[] {
  return [
    `Brands in ${industry.toLowerCase()} who want a named, checkable placement instead of a blind bundle`,
    `Sites building topical relevance in the ${industry.toLowerCase()} space via ${domain}`,
    "Agencies that need one verifiable domain to report to a client, with a live URL as proof",
    "Buyers diversifying an existing backlink profile with one additional real publication",
  ];
}

function includedFor(domain: string, price: number): string[] {
  return [
    `Confirmed placement on ${domain}, checked for live status before your order is marked complete`,
    "Topic pitched and approved before writing begins",
    "Original 900+ word article written to the publisher's guidelines",
    "One contextual dofollow/nofollow link (as listed for this domain) to your target URL",
    `Delivery report with live URL, publish date and the $${price} order reference`,
  ];
}

export function generateSiteGuestPostGigs(): GigInsert[] {
  const rows: GigInsert[] = [];

  RAW_SITES.forEach((entry, index) => {
    const domain = normaliseDomain(entry.site);
    const da = entry.da !== null ? Number(entry.da) : null;
    const dr = entry.dr !== null ? Number(entry.dr) : null;
    const trafficMonthly = parseTraffic(entry.traffic);
    const trafficLabel = formatTraffic(trafficMonthly);
    const industry = industryFor(entry.category);
    const { country, language } = marketFor(domain);
    const linkType = entry.linkType === "nofollow" ? "nofollow" : "dofollow";
    const price = entry.price;
    const seller = sellerFor(3000 + index * 11, "Guest Post Backlinks");

    const title = `I Will Publish Guest Post on ${domain}`;
    const slug = `i-will-publish-guest-post-on-${slugify(domain)}`;

    const summary = `Publish a real, editorially placed guest post on ${domain} (DA ${da ?? "N/A"}${dr !== null ? `, DR ${dr}` : ""}, ~${trafficLabel} monthly visits), with one ${linkType} contextual link to your target page.`;

    const description = `This gig places one original guest post directly on ${domain}. The domain currently shows a Domain Authority of ${da ?? "N/A"}${dr !== null ? ` and a Domain Rating of ${dr}` : ""}, with estimated organic traffic of around ${trafficLabel} visits per month and is catalogued under ${industry.toLowerCase()}. Metrics are sourced from third-party SEO tools, refresh periodically, and are shown so you can judge fit before ordering rather than after.\n\n${seller.name} reviews your target page and requested anchor first, then pitches a topic that fits ${domain}'s existing content before any writing begins. The article is written specifically for this publication's audience — not recycled across unrelated domains — and the link is placed ${linkType === "dofollow" ? "as a dofollow, in-content contextual link" : "as a nofollow, in-content contextual link, since that is this publisher's current attribution policy"}. Once the publisher approves and the article goes live, you receive the URL, publish date and a short indexing check as part of delivery.\n\nNo private blog networks and no guaranteed rankings: this is a single, named, checkable placement on ${domain}, priced at $${price} for one article.`;

    const placement = `Links are placed inside the body of the article on ${domain}, in a sentence that gives the reader a reason to click through, rather than in an author bio, footer or sidebar. The final live URL on ${domain} is checked again before the order is marked complete.`;

    const quality = `${domain} is reviewed for topical overlap with ${industry.toLowerCase()} content, a working editorial process and a sane ratio of commercial to editorial outbound links. Domain Authority (${da ?? "N/A"}), Domain Rating (${dr ?? "N/A"}) and the ~${trafficLabel}/month traffic estimate are treated as a starting filter, not as a substitute for checking that the page is genuinely indexed and read.`;

    const rating = index % 19 === 0 ? 47 : index % 11 === 0 ? 48 : 49;
    const ordersCompleted = 4 + ((index * 37 + 13) % 420);
    const reviewCount = Math.max(1, Math.round(ordersCompleted * (0.15 + (index % 7) / 100)));

    const reviewer1 = reviewerFor(index * 2 + 5000);
    const reviewer2 = reviewerFor(index * 2 + 5001);
    const reviews: GigReview[] = [
      {
        name: reviewer1.name,
        initials: reviewer1.initials,
        country: marketFor(domain).country,
        rating: index % 9 === 0 ? 4 : 5,
        date: `2026-${String((index % 8) + 1).padStart(2, "0")}-${String(((index * 7) % 27) + 1).padStart(2, "0")}`,
        packageTier: "Basic",
        text: `Ordered the single placement on ${domain} to support a ${industry.toLowerCase()} page. The topic was agreed before writing started and the live URL matched what was promised.`,
      },
      {
        name: reviewer2.name,
        initials: reviewer2.initials,
        country: marketFor(domain).country,
        rating: index % 13 === 0 ? 4 : 5,
        date: `2026-${String(((index + 3) % 8) + 1).padStart(2, "0")}-${String(((index * 11) % 27) + 1).padStart(2, "0")}`,
        packageTier: "Standard",
        text: `${seller.name} confirmed ${domain}'s traffic and relevance before starting, which is more diligence than most guest post sellers offer. Delivered on schedule.`,
      },
    ];

    rows.push({
      slug,
      title,
      metaTitle: `Guest Post on ${domain} (DA ${da ?? "N/A"})`,
      metaDescription: `Publish a guest post on ${domain} — DA ${da ?? "N/A"}${dr !== null ? `, DR ${dr}` : ""}, ~${trafficLabel}/mo traffic, ${linkType} link. From $${price}.`,
      category: "Placement Services",
      subcategory: "Guest Post Backlinks",
      serviceSlug: "guest-post-backlinks",
      industry,
      country,
      language,
      objective: "Single-domain guest post placement",
      summary,
      description,
      placement,
      quality,
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
      ordersCompleted,
      startingPrice: price,
      fastestDeliveryDays: 10,
      packages: JSON.stringify(packagesFor(domain, price, industry)),
      included: JSON.stringify(includedFor(domain, price)),
      benefits: JSON.stringify(benefitsFor(domain, da, dr, industry)),
      process: JSON.stringify(DELIVERY_STEPS),
      useCases: JSON.stringify(useCasesFor(domain, industry)),
      faqs: JSON.stringify(faqsFor(domain, da, dr, trafficLabel, linkType, price, industry)),
      reviews: JSON.stringify(reviews),
      featured: (da ?? 0) >= 60 || index < 8,
      domain,
      authority: da,
      organicTraffic: trafficMonthly,
      linkType,
    });
  });

  return rows;
}
