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
          { label: "Browse 8,886 Gigs", href: "/marketplace", description: "Compare sellers and 3 packages", icon: "users" },
          { label: "Guest Post Sites (6,686)", href: "/marketplace?category=Placement%20Services&subcategory=Guest%20Post%20Backlinks", description: "Named domains with real DA, DR, traffic & price", icon: "quill" },
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
      title: "Native writers in 15 languages",
      body: "We never translate. Every market gets content written by someone who works in that language daily.",
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
          { label: "Link Gap Scout", href: "/tools/link-gap-scout", description: "Free backlink gap analysis", icon: "compass" },
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
  { value: 4.9, suffix: "/5", label: "Average gig rating", detail: "Seller and package-level feedback" },
  { value: 8886, suffix: "", label: "Backlink gigs", detail: "Every legitimate link category" },
  { value: 160, suffix: "", label: "Verified specialists", detail: "Identity and process reviewed" },
  { value: 6600, suffix: "", label: "Package options", detail: "Basic, Standard and Premium" },
  { value: 38, suffix: "", label: "Markets served", detail: "15 native content languages" },
];

export const BENEFITS = [
  {
    icon: "shield" as GlyphName,
    title: "Publishers screened by people",
    body: "Every domain passes an eleven-point review covering traffic distribution, outbound behaviour, editorial continuity and disclosure practice.",
  },
  {
    icon: "target" as GlyphName,
    title: "Relevance before raw metrics",
    body: "We score topical fit against your subject and market, so a mid-authority niche publication can outrank a generic high-DR listing.",
  },
  {
    icon: "chart" as GlyphName,
    title: "Metrics you can verify",
    body: "Traffic, referring domains and trend data are refreshed continuously and shown before checkout, with no screenshots or hidden estimates.",
  },
  {
    icon: "users" as GlyphName,
    title: "Every campaign reviewed by a human",
    body: "A strategist checks anchor distribution, destination pages and publication mix before anything goes live.",
  },
  {
    icon: "layers" as GlyphName,
    title: "One workspace for every client",
    body: "Projects, budgets, approvals and link reports stay separated per brand, with permissions for internal and freelance teams.",
  },
  {
    icon: "clock" as GlyphName,
    title: "No PBNs, ever",
    body: "We do not build or sell private blog networks. Every link comes from a publication that exists for its readers first.",
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Add your website",
    body: "Connect a domain and we pull baseline authority, referring domains and anchor distribution into your workspace within minutes.",
    icon: "globe" as GlyphName,
  },
  {
    number: "02",
    title: "Choose your link objective",
    body: "Pick what the quarter should achieve: commercial page authority, topical coverage, local visibility or brand citations.",
    icon: "target" as GlyphName,
  },
  {
    number: "03",
    title: "Select placements or brief us",
    body: "Filter the publisher marketplace yourself, or hand the objective to a strategist and approve a proposed link plan.",
    icon: "filter" as GlyphName,
  },
  {
    number: "04",
    title: "Track every live link",
    body: "Watch placements go live, monitor anchor ratios and export link reports your stakeholders can actually read.",
    icon: "chart" as GlyphName,
  },
];

export const PRICING_PLANS = [
  {
    name: "Self-Serve",
    price: "€0",
    cadence: "platform fee",
    summary: "Browse publishers and order individual placements with transparent per-link pricing.",
    highlight: false,
    features: [
      "Full publisher marketplace access",
      "Live authority and traffic data",
      "1 project workspace",
      "Standard link reporting",
      "Email support within 24h",
    ],
    cta: { label: "Sign in to get started", href: "/login" },
  },
  {
    name: "Growth",
    price: "€349",
    cadence: "per month",
    summary: "For in-house teams running continuous link acquisition across several pages.",
    highlight: true,
    features: [
      "Everything in Self-Serve",
      "10 project workspaces",
      "Anchor distribution management",
      "Link Gap Scout unlimited scans",
      "Scheduled PDF and CSV reporting",
      "Named link strategist",
    ],
    cta: { label: "Sign in to get started", href: "/login" },
  },
  {
    name: "Agency",
    price: "€890",
    cadence: "per month",
    summary: "Multi-client link building with white-labelled reporting and team permissions.",
    highlight: false,
    features: [
      "Everything in Growth",
      "Unlimited client workspaces",
      "White-label link reports",
      "Role-based team permissions",
      "Volume placement pricing",
      "Priority publisher sourcing",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Backlink Services",
    links: [
      { label: "Guest Post Backlinks", href: "/backlinks/guest-post-backlinks" },
      { label: "Editorial Backlinks", href: "/backlinks/editorial-backlinks" },
      { label: "Contextual Backlinks", href: "/backlinks/contextual-backlinks" },
      { label: "Niche Edit Backlinks", href: "/backlinks/niche-edit-backlinks" },
      { label: "Authority Backlinks", href: "/backlinks/authority-backlinks" },
      { label: "Premium Link Building", href: "/backlinks/premium-link-building" },
    ],
  },
  {
    heading: "Outreach & PR",
    links: [
      { label: "Digital PR Backlinks", href: "/backlinks/digital-pr-backlinks" },
      { label: "Press Release Links", href: "/backlinks/press-release-news-backlinks" },
      { label: "Resource Link Building", href: "/backlinks/resource-link-building" },
      { label: "Broken Link Building", href: "/backlinks/broken-link-building" },
      { label: "Brand & Entity Links", href: "/backlinks/brand-entity-link-building" },
    ],
  },
  {
    heading: "By Industry",
    links: [
      { label: "SaaS Backlinks", href: "/backlinks/industry/saas" },
      { label: "Finance Backlinks", href: "/backlinks/industry/finance" },
      { label: "E-commerce Backlinks", href: "/backlinks/industry/ecommerce" },
      { label: "Health Backlinks", href: "/backlinks/industry/health" },
      { label: "All industries", href: "/backlinks/industry" },
    ],
  },
  {
    heading: "By Country",
    links: [
      { label: "USA Backlinks", href: "/backlinks/country/usa" },
      { label: "UK Backlinks", href: "/backlinks/country/uk" },
      { label: "German Backlinks", href: "/backlinks/country/germany" },
      { label: "International", href: "/backlinks/country/international" },
      { label: "All countries", href: "/backlinks/country" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/resources" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Legal Notice", href: "/legal/notice" },
    ],
  },
];

export const LEGAL_PAGES: Record<
  string,
  { title: string; updated: string; intro: string; sections: { heading: string; body: string }[] }
> = {
  privacy: {
    title: "Privacy Policy",
    updated: "2 March 2026",
    intro:
      "This policy explains what personal data Linkslo collects when you use our website, publisher marketplace and link reporting tools, why we collect it, and the choices you have.",
    sections: [
      { heading: "Data we collect", body: "Account details you provide (name, work email, company, billing address), the domains and target URLs you add to a workspace, campaign and order records, support correspondence, and technical data such as IP address, device type and pages visited. We do not buy personal data from third-party brokers." },
      { heading: "Why we process it", body: "To operate your account and deliver ordered placements, to produce the link reporting you request, to prevent fraud and abuse, to meet accounting and tax obligations, and, where you have opted in, to send research and product updates. Marketing emails always include a one-click unsubscribe." },
      { heading: "Sharing", body: "We share the minimum necessary data with payment processors, hosting and analytics providers, and publishers who need a destination URL to fulfil a placement. Each processor operates under a written agreement. We never sell personal data." },
      { heading: "Retention", body: "Account and campaign records are retained for the life of the account plus seven years where invoicing law requires it. Analytics data is aggregated after 14 months. You may request deletion of non-statutory records at any time." },
      { heading: "Your rights", body: "Under the GDPR and equivalent laws you can request access, correction, deletion, restriction, portability, or object to processing. Write to the contact address below and we will respond within 30 days." },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "2 March 2026",
    intro:
      "These terms govern access to the Linkslo platform, marketplace placements and link building services. By creating an account you agree to them.",
    sections: [
      { heading: "Accounts", body: "You are responsible for the accuracy of account information and for activity carried out under your credentials. Agency accounts may create client workspaces provided the agency remains responsible for those clients' use of the platform." },
      { heading: "Placement orders", body: "Prices shown at checkout are final for that order. Delivery windows are estimates based on each publisher's editorial calendar. If a publisher cannot fulfil an order, we offer a comparable alternative or a full refund of that item." },
      { heading: "Content and placements", body: "Content produced by Linkslo transfers to you on publication. Publishers retain editorial control over their own sites. We do not control third-party editorial decisions and we do not promise specific ranking positions, traffic figures or metric increases." },
      { heading: "Acceptable use", body: "The platform may not be used for content that is unlawful, deceptive, or that a reasonable publisher would consider harmful. We do not provide private blog networks, automated link generation or any service designed to disguise paid placement as independent endorsement." },
      { heading: "Liability", body: "Our aggregate liability for any claim is limited to the fees paid for the specific service giving rise to the claim in the preceding twelve months. Nothing in these terms limits liability that cannot lawfully be limited." },
    ],
  },
  cookies: {
    title: "Cookie Notice",
    updated: "2 March 2026",
    intro: "We use a deliberately small number of cookies. Non-essential cookies are only set after you accept them.",
    sections: [
      { heading: "Essential", body: "Session, authentication and security cookies that keep you signed in and protect forms from abuse. These cannot be switched off without breaking the product." },
      { heading: "Preferences", body: "Stores interface choices such as saved marketplace filters, table density and report defaults. Removing them resets your view to defaults." },
      { heading: "Analytics", body: "Aggregated, IP-truncated usage measurement that tells us which pages and features are used. Data is not shared with advertising networks." },
      { heading: "Managing cookies", body: "You can change your choice at any time from the cookie link in the footer, or clear cookies in your browser settings. Blocking essential cookies will prevent sign-in." },
    ],
  },
  notice: {
    title: "Legal Notice",
    updated: "2 March 2026",
    intro: "Company information published in accordance with European e-commerce disclosure requirements.",
    sections: [
      { heading: "Company", body: "Linkslo Technologies B.V., registered in Amsterdam, The Netherlands. Chamber of Commerce registration 87-4429-116. VAT NL004429116B01." },
      { heading: "Registered office", body: "Kalverstraat 112, 1012 PK Amsterdam, The Netherlands." },
      { heading: "Contact", body: "Email team@linkslo.com. Telephone +44 20 7946 0812. Responses within one business day, Monday to Friday." },
      { heading: "Dispute resolution", body: "The European Commission provides an online dispute resolution platform for consumers. We are not obliged to participate in consumer arbitration proceedings but will always attempt direct resolution first." },
      { heading: "Sample data disclosure", body: "Case studies, dashboard figures and demonstration statistics shown on this website use representative sample data and are labelled as such." },
    ],
  },
};

export const RESOURCE_CATEGORIES = [
  "Link Building",
  "Guest Posting",
  "Digital PR",
  "Outreach",
  "Anchor Text",
  "Link Audits",
  "Case Studies",
  "Industry News",
];
