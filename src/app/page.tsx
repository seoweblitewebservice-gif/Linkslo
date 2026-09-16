import type { Metadata } from "next";
import Link from "next/link";
import { DashboardApp } from "@/components/dashboard/DashboardApp";
import { Hero, TrustBar } from "@/components/marketing/Hero";
import { FeaturedGigs } from "@/components/marketing/FeaturedGigs";
import { ScoutPanel } from "@/components/marketing/ScoutPanel";
import { FinalCta, HowItWorks, ServicesGrid, WhyChooseUs } from "@/components/marketing/Sections";
import { ArticleGrid, CaseStudyGrid } from "@/components/marketing/Showcase";
import { FaqAccordion, TestimonialCarousel } from "@/components/marketing/SocialProof";
import { MarketplaceExplorer } from "@/components/marketplace/MarketplaceExplorer";
import { queryMarketplaceListings } from "@/lib/marketplace-query";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";
import { BRAND } from "@/lib/content";
import { BACKLINK_SERVICES } from "@/lib/backlinks";
import { getFeaturedMarketplaceGigs } from "@/lib/gigs/data";
import {
  getArticles,
  getCaseStudies,
  getFacets,
  getFaqs,
  getTestimonials,
  getWorkspaceData,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const HOME_CATEGORIES = [
  {
    title: "Editorial placements",
    icon: "quill" as const,
    body: "Articles and mentions published on sites with genuine readers and a working editorial process.",
    services: ["guest-post-backlinks", "editorial-backlinks", "premium-link-building"],
  },
  {
    title: "Contextual links",
    icon: "link" as const,
    body: "Links inside body copy that already discusses your subject, on new or established pages.",
    services: ["contextual-backlinks", "niche-edit-backlinks", "authority-backlinks"],
  },
  {
    title: "Digital PR & news",
    icon: "megaphone" as const,
    body: "Data-led stories and announcements pitched to journalists who cover your category.",
    services: ["digital-pr-backlinks", "press-release-news-backlinks", "brand-entity-link-building"],
  },
  {
    title: "Outreach campaigns",
    icon: "compass" as const,
    body: "Manual prospecting where the link is earned by solving a problem for the publisher.",
    services: ["resource-link-building", "broken-link-building", "image-infographic-link-building"],
  },
  {
    title: "Local & foundation",
    icon: "pin" as const,
    body: "Location signals, citations and supporting layers that broaden an otherwise narrow profile.",
    services: ["local-backlinks", "citation-directory-backlinks", "web-2-0-backlinks", "forum-community-backlinks"],
  },
  {
    title: "Strategy & ongoing",
    icon: "chart" as const,
    body: "Competitor gap analysis and managed monthly programmes with anchor and velocity control.",
    services: ["competitor-link-building", "monthly-link-building", "saas-software-backlinks", "edu-gov-resource-links"],
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [facets, workspace, caseStudies, testimonials, faqs, articles, featuredGigs, publisherPreview] = await Promise.all([
    getFacets(),
    getWorkspaceData(),
    getCaseStudies(),
    getTestimonials(),
    getFaqs(),
    getArticles(4),
    getFeaturedMarketplaceGigs(6),
    queryMarketplaceListings({ pageSize: 6 }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        legalName: `${BRAND.legalName} B.V.`,
        url: "https://www.linkslo.com",
        email: BRAND.email,
        foundingDate: String(BRAND.foundedYear),
        address: {
          "@type": "PostalAddress",
          streetAddress: BRAND.addressLines[0],
          addressLocality: "Amsterdam",
          addressCountry: "NL",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "1240",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <TrustBar />

      {/* Fiverr-style backlink gig marketplace ----------------------------- */}
      <section className="border-b border-line bg-canvas py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="8,886 specialist gigs"
                eyebrowIcon="users"
                title="A backlink gig for the exact service, niche and market"
                description="Compare verified specialists across every legitimate backlink type. Each gig has Basic, Standard and Premium packages, seller history, delivery times, unique FAQs and buyer feedback."
              />
              <Button href="/marketplace" variant="outline" icon="arrow-right" className="shrink-0">
                Browse all 8,886 gigs
              </Button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10">
              <FeaturedGigs gigs={featuredGigs} />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              {[
                ["8,886", "Backlink gigs"],
                ["160", "Verified specialists"],
                ["6,600", "Package options"],
                ["0", "PBN services"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-line bg-white px-4 py-3 text-center">
                  <p className="font-display text-[1.2rem] font-semibold text-ink-950">{value}</p>
                  <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-ink-400">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Backlink service categories --------------------------------------- */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Browse by link type"
                eyebrowIcon="link"
                title="Start with the link type you actually need"
                description="Twenty-two consolidated backlink services grouped by how the link is earned. Each has three package sizes, a unique FAQ and verified buyer reviews."
              />
              <Button href="/backlinks" variant="outline" icon="arrow-right" className="shrink-0">
                View all 22 services
              </Button>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_CATEGORIES.map((category, index) => (
              <Reveal key={category.title} delay={(index % 3) * 70}>
                <div className="card-hover flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={category.icon} size={19} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-500">{category.body}</p>
                  <ul className="mt-4 flex flex-1 flex-wrap gap-1.5 content-start">
                    {category.services.map((slug) => {
                      const service = BACKLINK_SERVICES.find((item) => item.slug === slug);
                      if (!service) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/backlinks/${slug}`}
                            className="inline-block rounded-full border border-line bg-canvas px-2.5 py-1 text-[0.75rem] font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                          >
                            {service.nav}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 rounded-2xl border border-line bg-canvas px-5 py-4 text-[0.8rem] text-ink-600">
              <span className="inline-flex items-center gap-1.5"><Icon name="shield" size={15} className="text-brand-600" /> Publishers screened by people</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="layers" size={15} className="text-brand-600" /> 3 packages on every service</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="check" size={15} className="text-brand-600" /> No PBNs or automated links</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="chart" size={15} className="text-brand-600" /> Every link tracked in your dashboard</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Publisher marketplace preview -------------------------------------- */}
      <section id="marketplace" className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Live marketplace"
                eyebrowIcon="search"
                title="Find the right publisher"
                description="Filter screened publishers by industry, market, authority, traffic, link type and price. Every listing shows the same data our strategists use."
              />
              <Button href="/marketplace" variant="outline" icon="arrow-right" className="shrink-0">
                View all inventory
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10">
              <MarketplaceExplorer facets={facets} variant="preview" initialData={publisherPreview} />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: "shield" as const, title: "Eleven-point screening", body: "Traffic spread, outbound hygiene, editorial continuity and disclosure are checked before listing." },
                { icon: "globe" as const, title: "38 markets, 15 languages", body: "Native-language inventory across Europe, North America and Australia." },
                { icon: "clock" as const, title: "Delivery you can plan around", body: "Each listing carries its own publication window, updated from real fulfilment data." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3 rounded-2xl border border-line bg-canvas p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-soft">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <div>
                    <p className="text-[0.9rem] font-semibold text-ink-950">{item.title}</p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-500">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />

      {/* Product dashboard --------------------------------------------------- */}
      <section id="platform" className="border-y border-line bg-canvas py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="The workspace"
                eyebrowIcon="layers"
                title="Every link tracked in one workspace"
                description="Projects, link campaigns, live placements, anchor ratios and invoices in one place, with exports your stakeholders can actually read."
              />
              <Button href="/dashboard" variant="outline" icon="arrow-up-right" className="shrink-0">
                Open the live demo
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10">
              <DashboardApp
                projects={workspace.projects}
                campaigns={workspace.campaigns}
                placements={workspace.placements}
                listings={workspace.listings}
                variant="embedded"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Link Gap Scout ----------------------------------------------------- */}
      <section id="link-gap-scout" className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  eyebrow="Backlink intelligence"
                  eyebrowIcon="compass"
                  title="Link Gap Scout sizes up the gap before you spend"
                  description="Enter a domain and target keyword. Link Gap Scout estimates the referring-domain gap, compares competing profiles and matches screened publishers in the same category."
                />
                <ul className="mt-7 space-y-3.5">
                  {[
                    "Competitor domains with referring-domain and overlap estimates",
                    "Content gaps ranked by intent and difficulty",
                    "Publisher matches drawn from live marketplace inventory",
                    "Opportunity score you can track quarter over quarter",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.9rem] text-ink-600">
                      <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl border border-line bg-canvas p-4 text-[0.8rem] leading-relaxed text-ink-500">
                  Link Gap Scout runs on a demonstration intelligence model with representative
                  figures. Connected data sources are available on Growth and Agency plans.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <ScoutPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Case studies -------------------------------------------------------- */}
      <section id="case-studies" className="border-y border-line bg-canvas py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Sample outcomes"
                eyebrowIcon="chart"
                title="What a disciplined programme looks like"
                description="Three representative engagements with demonstration data, showing the shape of results rather than a highlight reel."
              />
              <Button href="/case-studies" variant="outline" icon="arrow-right" className="shrink-0">
                All case studies
              </Button>
            </div>
          </Reveal>
          <div className="mt-10">
            <CaseStudyGrid items={caseStudies} />
          </div>
        </div>
      </section>

      {/* Testimonials -------------------------------------------------------- */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Customer voices"
              eyebrowIcon="users"
              title="Teams that stopped guessing which links were safe"
              description="Feedback from in-house teams, agencies and founders using Linkslo day to day."
              className="mx-auto"
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12">
              <TestimonialCarousel items={testimonials} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Knowledge hub ------------------------------------------------------- */}
      <section className="border-y border-line bg-canvas py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Knowledge hub"
                eyebrowIcon="document"
                title="Research, teardowns and practitioner notes"
                description="Written by the strategists who run campaigns — no recycled listicles."
              />
              <Button href="/resources" variant="outline" icon="arrow-right" className="shrink-0">
                Browse all resources
              </Button>
            </div>
          </Reveal>
          <div className="mt-10">
            <ArticleGrid items={articles} />
          </div>
        </div>
      </section>

      {/* FAQ ----------------------------------------------------------------- */}
      <section id="faq" className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  eyebrow="Questions"
                  eyebrowIcon="check"
                  title="Answers before you commit"
                  description="Still unsure? A strategist will walk you through the platform and tell you honestly whether we are the right fit."
                />
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/contact" icon="arrow-right">
                    Talk to an expert
                  </Button>
                  <Button href="/pricing" variant="outline">
                    See pricing
                  </Button>
                </div>
                <p className="mt-6 text-[0.85rem] text-ink-500">
                  Prefer email?{" "}
                  <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
                    {BRAND.email}
                  </Link>
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <FaqAccordion items={faqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
