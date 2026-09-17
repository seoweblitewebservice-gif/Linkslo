import { BACKLINK_SERVICES, COUNTRY_PAGES, INDUSTRY_PAGES } from "@/lib/backlinks";
import type { GlyphName } from "@/components/ui/Icon";

export const BRAND = {
  name: "Linkslo",
  legalName: "Linkslo Technologies",
  tagline: "Backlink & link building platform",
  email: "team@linkslo.com",
  phone: "+44 20 7946 0812",
  addressLines: ["Kalverstraat 112", "1012 PK Amsterdam", "The Netherlands"],
  foundedYear: 2018,
};

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: GlyphName;
};

export type NavGroup = {
  label: string;
  href: string;
  columns?: { heading: string; items: NavItem[] }[];
  feature?: { title: string; body: string; href: string; cta: string };
  wide?: boolean;
};

const serviceNav = (slugs: string[]): NavItem[] =>
  slugs
    .map((slug) => BACKLINK_SERVICES.find((service) => service.slug === slug))
    .filter((service): service is (typeof BACKLINK_SERVICES)[number] => Boolean(service))
    .map((service) => ({
      label: service.nav,
      href: `/backlinks/${service.slug}`,
      icon: service.icon,
    }));

export const PRIMARY_NAV: NavGroup[] = [
  {
    label: "Backlink Services",
    href: "/backlinks",
    wide: true,
    columns: [
      {
        heading: "Placements",
        items: [
          { label: "Browse Marketplace", href: "/marketplace", description: "Compare scope, price and delivery", icon: "users" },
          { label: "Guest Post Sites", href: "/marketplace?category=Placement%20Services&subcategory=Guest%20Post%20Backlinks", description: "Named domains with listed metrics and price", icon: "quill" },
          ...serviceNav([
            "guest-post-backlinks",
            "editorial-backlinks",
            "contextual-backlinks",
            "niche-edit-backlinks",
            "premium-link-building",
            "authority-backlinks",
          ]),
        ],
      },
      {
        heading: "Outreach & PR",
        items: serviceNav([
          "digital-pr-backlinks",
          "press-release-news-backlinks",
          "resource-link-building",
          "broken-link-building",
          "image-infographic-link-building",
          "brand-entity-link-building",
        ]),
      },
      {
        heading: "Local & foundation",
        items: serviceNav([
          "local-backlinks",
          "citation-directory-backlinks",
          "web-2-0-backlinks",
          "forum-community-backlinks",
          "blog-comment-backlinks",
          "social-bookmarking-backlinks",
        ]),
      },
      {
        heading: "Specialist & ongoing",
        items: serviceNav([
          "saas-software-backlinks",
          "edu-gov-resource-links",
          "competitor-link-building",
          "monthly-link-building",
        ]),
      },
    ],
    feature: {
      title: "Not sure which link type?",
      body: "Send one target URL and we will recommend the mix that suits your current profile.",
      href: "/contact",
      cta: "Get a recommendation",
    },
  },
  {
    label: "By Industry",
    href: "/backlinks/industry",
    wide: true,
    columns: [
      {
        heading: "Technology & finance",
        items: ["saas", "technology", "finance", "crypto", "marketing"].map((slug) => {
          const industry = INDUSTRY_PAGES.find((item) => item.slug === slug)!;
          return { label: industry.name, href: `/backlinks/industry/${slug}`, icon: industry.icon };
        }),
      },
      {
        heading: "Commerce & lifestyle",
        items: ["ecommerce", "fashion", "food", "travel", "home-garden"].map((slug) => {
          const industry = INDUSTRY_PAGES.find((item) => item.slug === slug)!;
          return { label: industry.name, href: `/backlinks/industry/${slug}`, icon: industry.icon };
        }),
      },
      {
        heading: "Services & professional",
        items: ["legal", "business", "real-estate", "automotive", "education"].map((slug) => {
          const industry = INDUSTRY_PAGES.find((item) => item.slug === slug)!;
          return { label: industry.name, href: `/backlinks/industry/${slug}`, icon: industry.icon };
        }),
      },
      {
        heading: "Health & leisure",
        items: ["health", "fitness", "gaming"].map((slug) => {
          const industry = INDUSTRY_PAGES.find((item) => item.slug === slug)!;
          return { label: industry.name, href: `/backlinks/industry/${slug}`, icon: industry.icon };
        }),
      },
    ],
  },
  {
    label: "By Country",
    href: "/backlinks/country",
    columns: [
      {
        heading: "English-speaking markets",
        items: ["usa", "uk", "canada", "australia"].map((slug) => {
          const country = COUNTRY_PAGES.find((item) => item.slug === slug)!;
          return { label: country.country, href: `/backlinks/country/${slug}`, icon: "globe" as GlyphName, description: country.language };
        }),
      },
      {
        heading: "European & global",
        items: ["germany", "france", "spain", "italy", "netherlands", "india", "international"].map((slug) => {
          const country = COUNTRY_PAGES.find((item) => item.slug === slug)!;
          return { label: country.country, href: `/backlinks/country/${slug}`, icon: "globe" as GlyphName, description: country.language };
        }),
      },
    ],
    feature: {
      title: "Plan by target market",
      body: "Use the country guides to compare language, publisher landscape and recommended service types before ordering.",
      href: "/backlinks/country/international",
      cta: "See international link building",
    },
  },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "/resources",
    columns: [
      {
        heading: "Learn",
        items: [
          { label: "Link building blog", href: "/resources", description: "Guides, research and teardowns", icon: "document" },
          { label: "Case studies", href: "/case-studies", description: "Sample campaign outcomes", icon: "chart" },
          { label: "Free tools", href: "/tools", description: "Calculators, checkers & generators", icon: "sliders" },
        ],
      },
      {
        heading: "Company",
        items: [
          { label: "Campaign dashboard", href: "/dashboard", description: "See how links are tracked", icon: "layers" },
          { label: "Contact", href: "/contact", description: "Talk to a link strategist", icon: "users" },
          { label: "FAQ", href: "/#faq", description: "Common questions answered", icon: "check" },
        ],
      },
    ],
  },
];

export const TRUST_STATS = [
  { value: BACKLINK_SERVICES.length, suffix: "", label: "Service categories", detail: "Placement, outreach, PR and strategy options" },
  { value: 3, suffix: "", label: "Package tiers", detail: "Clear scope, price and delivery per service" },
  { value: INDUSTRY_PAGES.length, suffix: "", label: "Industry guides", detail: "Sector-specific link building guidance" },
  { value: COUNTRY_PAGES.length, suffix: "", label: "Country guides", detail: "Market and language-specific planning" },
  { value: 0, suffix: "", label: "PBN services", detail: "Private blog network services are not offered" },
];

export const BENEFITS = [
  {
    icon: "shield" as GlyphName,
    title: "Quality checks before fulfilment",
    body: "The target page, requested anchor and placement fit are reviewed before fulfilment begins.",
  },
  {
    icon: "target" as GlyphName,
    title: "Relevance before raw metrics",
    body: "Topical fit, market and page context are considered alongside third-party authority and traffic estimates.",
  },
  {
    icon: "chart" as GlyphName,
    title: "Metrics shown with context",
    body: "Named publisher listings show the available authority, traffic, link-type and price fields so you can compare options before ordering.",
  },
  {
    icon: "users" as GlyphName,
    title: "Brief reviewed before delivery",
    body: "Campaign requirements are checked for target-page fit, anchor choice and delivery feasibility before work starts.",
  },
  {
    icon: "layers" as GlyphName,
    title: "Order tracking in one workspace",
    body: "Account tools keep order requirements, status and delivered URLs together for easier campaign tracking.",
  },
  {
    icon: "clock" as GlyphName,
    title: "No PBN services",
    body: "Linkslo does not offer private blog network packages as part of the marketplace or direct service catalogue.",
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Choose a service or listing",
    body: "Browse by link type, industry, market, package scope, price and delivery window.",
    icon: "globe" as GlyphName,
  },
  {
    number: "02",
    title: "Share your target page",
    body: "Provide the destination URL, anchor preference and any campaign constraints needed to review fit.",
    icon: "target" as GlyphName,
  },
  {
    number: "03",
    title: "Confirm feasibility",
    body: "Linkslo reviews the brief and confirms placement feasibility or recommends a more suitable option where necessary.",
    icon: "filter" as GlyphName,
  },
  {
    number: "04",
    title: "Receive delivery details",
    body: "Completed work is reported with the relevant live URL and order information available in your workspace.",
    icon: "chart" as GlyphName,
  },
];

export const PRICING_PLANS = [
  {
    name: "Self-Serve",
    price: "€0",
    cadence: "platform fee",
    summary: "Browse marketplace listings and order individual packages with transparent pricing.",
    highlight: false,
    features: [
      "Marketplace browsing",
      "Package pricing and delivery details",
      "Order requirement submission",
      "Order status tracking",
      "Email support",
    ],
    cta: { label: "Sign in to get started", href: "/login" },
  },
  {
    name: "Growth",
    price: "€349",
    cadence: "per month",
    summary: "For in-house teams planning ongoing link acquisition across several pages.",
    highlight: true,
    features: [
      "Everything in Self-Serve",
      "Additional project organisation",
      "Campaign planning support",
      "Link Gap Scout access",
      "Reporting support",
      "Priority support",
    ],
    cta: { label: "Sign in to get started", href: "/login" },
  },
  {
    name: "Agency",
    price: "€890",
    cadence: "per month",
    summary: "For teams coordinating link-building work across multiple client projects.",
    highlight: false,
    features: [
      "Everything in Growth",
      "Multi-project organisation",
      "Client-oriented reporting support",
      "Team workflow support",
      "Volume planning",
      "Priority sourcing support",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
];

export const LEGAL_PAGES: Record<string, { title: string; updated: string; sections: { heading: string; body: string[] }[] }> = {
  privacy: {
    title: "Privacy Policy",
    updated: "September 2026",
    sections: [
      { heading: "Information we collect", body: ["We collect information you provide when creating an account, submitting an order, contacting support or using interactive tools on Linkslo."] },
      { heading: "How we use information", body: ["We use account and order information to operate the service, fulfil requests, provide support, maintain security and improve the product."] },
      { heading: "Data retention", body: ["We retain information only as long as reasonably necessary for service delivery, legal obligations, dispute resolution and legitimate business records."] },
      { heading: "Your choices", body: ["You may contact us to request access, correction or deletion of personal information, subject to applicable legal and record-keeping requirements."] },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "September 2026",
    sections: [
      { heading: "Service scope", body: ["Linkslo provides link-building marketplace listings, direct service packages, campaign planning tools and order management features."] },
      { heading: "Publisher approval", body: ["Publisher availability and editorial approval can change. An order does not guarantee publication on a third-party website until availability and editorial fit are confirmed."] },
      { heading: "Search results", body: ["Search rankings, traffic growth and other SEO outcomes depend on many factors outside Linkslo's control and are not guaranteed."] },
      { heading: "Acceptable use", body: ["You must not use the service for unlawful activity, deceptive content, malware, abuse or attempts to interfere with the service or third-party websites."] },
    ],
  },
  refunds: {
    title: "Refund Policy",
    updated: "September 2026",
    sections: [
      { heading: "Before fulfilment", body: ["If a selected placement cannot be fulfilled as described, we may offer an appropriate alternative or refund the affected undelivered item."] },
      { heading: "After delivery", body: ["Completed services are generally not refundable once the agreed deliverable has been provided, except where required by law or where the delivered item materially differs from the confirmed order scope."] },
      { heading: "Contact", body: ["Contact support with the order reference and relevant details so the request can be reviewed."] },
    ],
  },
};
