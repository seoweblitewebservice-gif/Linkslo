import { slugify, normaliseDomain } from "@/lib/format";
import { titleCase } from "@/lib/gigs/generator";
import type { GigBenefit, GigFaq, GigPackage, GigStep } from "@/lib/gigs/types";
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

/** Number of named, price-listed publisher domains available as individual gigs. */
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

/** Country-code TLDs provide a useful market hint; generic TLDs remain International. */
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
  [".us", { country: "United States", language: "English" }],
];

function marketFor(domain: string) {
  const lower = domain.toLowerCase();
  for (const [suffix, market] of TLD_MARKETS) {
    if (lower.endsWith(suffix)) return market;
  }
  return { country: "International", language: "English" };
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
  { title: "Availability and brief check", body: "The named domain, listed placement details, target page and anchor preference are reviewed before fulfilment begins. Publisher availability can change, so the placement is not treated as final until confirmed." },
  { title: "Content requirements", body: "The required topic, content format and supplied or newly written article are aligned with the confirmed placement requirements before submission." },
  { title: "Editorial submission", body: "The content is submitted only after the placement requirements are confirmed. Third-party publishers retain final editorial approval and may request changes or decline a submission." },
  { title: "Delivery report", body: "If publication is approved and goes live, the live URL and the observed link attribution are recorded in the delivery information." },
];

function benefitsFor(domain: string, da: number | null, dr: number | null, industry: string): GigBenefit[] {
  return [
    { title: "Named-domain listing", body: `The listing identifies ${domain} before ordering rather than presenting an undisclosed publisher bundle.` },
    { title: "Metrics shown upfront", body: `${domain} is listed with a Domain Authority of ${da ?? "N/A"}${dr !== null ? ` and a Domain Rating of ${dr}` : ""}. These are third-party comparison metrics and can change over time.` },
    { title: `${industry} category context`, body: `${domain} is catalogued under ${industry.toLowerCase()} in the source inventory so you can compare it with other listings in the same category.` },
    { title: "Availability checked before fulfilment", body: "The listing is a request for the named placement. Publisher availability, editorial fit and final link treatment are reconfirmed before the placement is treated as confirmed." },
  ];
}

function faqsFor(domain: string, da: number | null, dr: number | null, trafficLabel: string, linkType: string, price: number, category: string): GigFaq[] {
  return [
    {
      question: `What metrics are listed for ${domain}?`,
      answer: `${domain} is listed with a Domain Authority of ${da ?? "not available"}${dr !== null ? ` and a Domain Rating of ${dr}` : ""}, plus estimated organic traffic of around ${trafficLabel} visits per month. These are inventory snapshots from third-party SEO metrics, not guarantees, and should be rechecked when making a time-sensitive decision.`,
    },
    {
      question: `Is the listed link type for ${domain} guaranteed?`,
      answer: `${domain} is currently catalogued as a ${linkType} opportunity. Publisher policies can change, so link attribution and editorial requirements are reconfirmed before fulfilment. If the confirmed terms materially differ from the listing, you can review an alternative before the affected item is fulfilled.`,
    },
    {
      question: `What does the $${price} listing price represent?`,
      answer: `The listed starting price is the base price stored for this ${category.toLowerCase()} placement opportunity. The selected package shows the requested quantity, content scope and delivery window; publisher availability and editorial approval are confirmed before fulfilment begins.`,
    },
    {
      question: `Is a guest post on ${domain} permanent?`,
      answer: `No third-party publication can be guaranteed to remain live permanently. If a placement is approved and published, Linkslo records the live URL at delivery, but later edits, removals or policy changes remain under the publisher's control.`,
    },
    {
      question: `Can I supply my own topic or article for ${domain}?`,
      answer: `You can provide a proposed topic, target page and draft when relevant. Acceptance depends on the confirmed placement requirements and the publisher's editorial decision, so supplied content may require changes or may not be accepted.`,
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
      description: `One requested guest post placement on ${domain}, subject to current publisher availability and editorial approval.`,
      features: [
        `1 requested guest post placement on ${domain}`,
        "Availability and editorial-fit check",
        "Content requirement review",
        "1 contextual link request",
        "Live URL report if published",
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
      description: `A requested placement on ${domain} plus two category-relevant placement requests, with final domains and availability confirmed before fulfilment.`,
      features: [
        `Requested placement on ${domain}`,
        `2 additional ${category.toLowerCase()} placement requests`,
        "Anchor and target-page planning",
        "Availability confirmation before fulfilment",
        "Live URL report for published placements",
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
      description: `A requested placement on ${domain} plus four category-relevant placement requests, with final availability and editorial requirements confirmed before fulfilment.`,
      features: [
        `Requested placement on ${domain}`,
        `4 additional ${category.toLowerCase()} placement requests`,
        "Anchor and target-page planning",
        "Order progress updates",
        "Live URL report for published placements",
      ],
      recommended: false,
    },
  ];
}

function useCasesFor(domain: string, industry: string): string[] {
  return [
    `Brands in ${industry.toLowerCase()} comparing a named-domain opportunity instead of an undisclosed publisher bundle`,
    `Sites evaluating whether ${domain} is relevant to a target page before committing to fulfilment`,
    "Agencies that need a named listing, package scope and delivery record for client planning",
    "Buyers comparing one additional publisher opportunity with their existing backlink mix",
  ];
}

function includedFor(domain: string, price: number): string[] {
  return [
    `Availability check for the requested ${domain} placement before fulfilment`,
    "Topic, target-page and anchor requirement review",
    "Content scope based on the selected package and confirmed publisher requirements",
    "Requested contextual link type based on the current listing, rechecked before fulfilment",
    `Order record showing the $${price} starting price and live URL details if publication is completed`,
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

    const title = `Guest Post on ${domain}`;
    const slug = `i-will-publish-guest-post-on-${slugify(domain)}`;

    const summary = `Guest post listing for ${domain} with listed DA ${da ?? "N/A"}${dr !== null ? `, DR ${dr}` : ""}, approximately ${trafficLabel} monthly organic visits and a ${linkType} link classification in the source inventory.`;

    const description = `This listing is for a requested guest post opportunity on ${domain}. The source inventory currently lists Domain Authority ${da ?? "N/A"}${dr !== null ? `, Domain Rating ${dr}` : ""}, estimated organic traffic of around ${trafficLabel} visits per month, a ${linkType} link classification and the ${industry.toLowerCase()} category. These metrics and classifications are comparison data, can change over time and should not be treated as guarantees.\n\nBefore fulfilment, Linkslo reviews the target page, anchor preference, current publisher availability and the placement requirements. The named domain is not treated as confirmed until availability and editorial fit have been checked. Third-party publishers retain final approval over content, placement and link treatment.\n\nIf publication is approved and completed, the delivery record includes the live URL and the observed link attribution. Search rankings, indexing duration and permanent retention are not guaranteed.`;

    const placement = `The listing requests an in-content contextual link on ${domain}. Exact page location, wording, attribution and publication acceptance remain subject to the publisher's current editorial requirements and are reconfirmed before fulfilment.`;

    const quality = `${domain} is catalogued under ${industry.toLowerCase()} with listed DA ${da ?? "N/A"}, DR ${dr ?? "N/A"} and approximately ${trafficLabel} monthly organic visits. These fields are used for marketplace comparison; Linkslo does not treat authority or traffic estimates as proof of editorial quality or guaranteed SEO performance.`;

    rows.push({
      slug,
      title,
      metaTitle: `Guest Post on ${domain} (DA ${da ?? "N/A"})`,
      metaDescription: `${domain} guest post listing — DA ${da ?? "N/A"}${dr !== null ? `, DR ${dr}` : ""}, ~${trafficLabel}/mo estimated traffic, ${linkType} classification. From $${price}; availability confirmed before fulfilment.`,
      category: "Placement Services",
      subcategory: "Guest Post Backlinks",
      serviceSlug: "guest-post-backlinks",
      industry,
      country,
      language,
      objective: "Named-domain guest post request",
      summary,
      description,
      placement,
      quality,
      // The schema predates the current Linkslo-operated marketplace model and
      // still requires seller/review fields. Keep them neutral instead of
      // generating fictional people, ratings, review counts or order history.
      sellerName: "Linkslo",
      sellerHandle: "linkslo",
      sellerInitials: "LS",
      sellerCountry: "International",
      sellerLevel: "Platform listing",
      sellerBio: "Linkslo-operated marketplace listing. Publisher availability and editorial approval are confirmed before fulfilment.",
      sellerLanguages: language,
      sellerResponseHours: 0,
      sellerSinceYear: 0,
      verified: false,
      rating: 0,
      reviewCount: 0,
      ordersCompleted: 0,
      startingPrice: price,
      fastestDeliveryDays: 10,
      packages: JSON.stringify(packagesFor(domain, price, industry)),
      included: JSON.stringify(includedFor(domain, price)),
      benefits: JSON.stringify(benefitsFor(domain, da, dr, industry)),
      process: JSON.stringify(DELIVERY_STEPS),
      useCases: JSON.stringify(useCasesFor(domain, industry)),
      faqs: JSON.stringify(faqsFor(domain, da, dr, trafficLabel, linkType, price, industry)),
      reviews: "[]",
      featured: (da ?? 0) >= 60 || index < 8,
      domain,
      authority: da,
      organicTraffic: trafficMonthly,
      linkType,
    });
  });

  return rows;
}
