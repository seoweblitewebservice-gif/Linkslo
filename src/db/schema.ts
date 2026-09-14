import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Marketplace inventory: vetted publishing opportunities. */
export const publishers = pgTable(
  "publishers",
  {
    id: serial("id").primaryKey(),
    domain: text("domain").notNull(),
    displayName: text("display_name").notNull(),
    industry: text("industry").notNull(),
    country: text("country").notNull(),
    language: text("language").notNull(),
    authority: integer("authority").notNull(),
    organicTraffic: integer("organic_traffic").notNull(),
    referringDomains: integer("referring_domains").notNull(),
    price: integer("price").notNull(),
    linkType: text("link_type").notNull(),
    publicationType: text("publication_type").notNull(),
    turnaroundDays: integer("turnaround_days").notNull(),
    spamScore: integer("spam_score").notNull(),
    trafficTrend: integer("traffic_trend").notNull(),
    relevance: integer("relevance").notNull(),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    domainIdx: uniqueIndex("publishers_domain_idx").on(table.domain),
  }),
);

/** Fiverr-style specialist backlink gigs. Rich sections are stored as JSON text. */
export const backlinkGigs = pgTable(
  "backlink_gigs",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    category: text("category").notNull(),
    subcategory: text("subcategory").notNull(),
    serviceSlug: text("service_slug").notNull(),
    industry: text("industry").notNull(),
    country: text("country").notNull(),
    language: text("language").notNull(),
    objective: text("objective").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    placement: text("placement").notNull(),
    quality: text("quality").notNull(),
    sellerName: text("seller_name").notNull(),
    sellerHandle: text("seller_handle").notNull(),
    sellerInitials: text("seller_initials").notNull(),
    sellerCountry: text("seller_country").notNull(),
    sellerLevel: text("seller_level").notNull(),
    sellerBio: text("seller_bio").notNull(),
    sellerLanguages: text("seller_languages").notNull(),
    sellerResponseHours: integer("seller_response_hours").notNull(),
    sellerSinceYear: integer("seller_since_year").notNull(),
    verified: boolean("verified").notNull().default(true),
    rating: integer("rating").notNull(),
    reviewCount: integer("review_count").notNull(),
    ordersCompleted: integer("orders_completed").notNull(),
    startingPrice: integer("starting_price").notNull(),
    fastestDeliveryDays: integer("fastest_delivery_days").notNull(),
    packages: text("packages").notNull(),
    included: text("included").notNull(),
    benefits: text("benefits").notNull(),
    process: text("process").notNull(),
    useCases: text("use_cases").notNull(),
    faqs: text("faqs").notNull(),
    reviews: text("reviews").notNull(),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("backlink_gigs_slug_idx").on(table.slug),
    categoryIdx: index("backlink_gigs_category_idx").on(table.category),
    subcategoryIdx: index("backlink_gigs_subcategory_idx").on(table.subcategory),
    industryIdx: index("backlink_gigs_industry_idx").on(table.industry),
    countryIdx: index("backlink_gigs_country_idx").on(table.country),
    priceIdx: index("backlink_gigs_price_idx").on(table.startingPrice),
    ratingIdx: index("backlink_gigs_rating_idx").on(table.rating),
  }),
);

/** Demo workspace projects powering the product dashboard. */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  industry: text("industry").notNull(),
  market: text("market").notNull(),
  authorityScore: integer("authority_score").notNull(),
  organicTraffic: integer("organic_traffic").notNull(),
  referringDomains: integer("referring_domains").notNull(),
  trackedKeywords: integer("tracked_keywords").notNull(),
  trafficSeries: text("traffic_series").notNull(),
  keywordSeries: text("keyword_series").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").notNull(),
  placementsLive: integer("placements_live").notNull(),
  placementsTotal: integer("placements_total").notNull(),
  budget: integer("budget").notNull(),
  startedOn: text("started_on").notNull(),
});

export const placements = pgTable("placements", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  domain: text("domain").notNull(),
  anchor: text("anchor").notNull(),
  targetPath: text("target_path").notNull(),
  authority: integer("authority").notNull(),
  status: text("status").notNull(),
  publishedOn: text("published_on").notNull(),
});

/** Knowledge hub articles. */
export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
    author: text("author").notNull(),
    readingMinutes: integer("reading_minutes").notNull(),
    publishedOn: text("published_on").notNull(),
    featured: boolean("featured").notNull().default(false),
  },
  (table) => ({
    slugIdx: uniqueIndex("articles_slug_idx").on(table.slug),
  }),
);

export const caseStudies = pgTable(
  "case_studies",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    company: text("company").notNull(),
    industry: text("industry").notNull(),
    market: text("market").notNull(),
    headline: text("headline").notNull(),
    startingPoint: text("starting_point").notNull(),
    strategy: text("strategy").notNull(),
    outcome: text("outcome").notNull(),
    trafficChange: integer("traffic_change").notNull(),
    keywordChange: integer("keyword_change").notNull(),
    referringDomainGrowth: integer("referring_domain_growth").notNull(),
    durationMonths: integer("duration_months").notNull(),
    series: text("series").notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("case_studies_slug_idx").on(table.slug),
  }),
);

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull(),
  initials: text("initials").notNull(),
  accent: text("accent").notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  topic: text("topic").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

/** Package orders created from backlink service pages. */
export const serviceOrders = pgTable("service_orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull(),
  serviceSlug: text("service_slug").notNull(),
  gigSlug: text("gig_slug").notNull().default(""),
  serviceName: text("service_name").notNull(),
  packageTier: text("package_tier").notNull(),
  packageName: text("package_name").notNull(),
  price: integer("price").notNull(),
  website: text("website").notNull(),
  targetUrl: text("target_url").notNull(),
  anchorPreference: text("anchor_preference").notNull().default(""),
  market: text("market").notNull(),
  notes: text("notes").notNull().default(""),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  company: text("company").notNull().default(""),
  status: text("status").notNull().default("Brief review"),
  paypalOrderId: text("paypal_order_id").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Inbound consultation / contact requests. */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull().default(""),
  website: text("website").notNull().default(""),
  objective: text("objective").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull().default(""),
  source: text("source").notNull().default("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable(
  "subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("subscribers_email_idx").on(table.email),
  }),
);

/** Link Gap Scout lookups (stored so the tool can show recent activity). */
export const authorityScans = pgTable("authority_scans", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  keyword: text("keyword").notNull(),
  market: text("market").notNull().default("Global"),
  opportunityScore: integer("opportunity_score").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Publisher = typeof publishers.$inferSelect;
export type BacklinkGig = typeof backlinkGigs.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Placement = typeof placements.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type ServiceOrder = typeof serviceOrders.$inferSelect;
