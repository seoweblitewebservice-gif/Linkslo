import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/motion";
import { Button, Card, SectionHeading } from "@/components/ui/primitives";
import { BACKLINK_SERVICES, COUNTRY_PAGES, INDUSTRY_PAGES } from "@/lib/backlinks";
import { BRAND, TRUST_STATS } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Linkslo",
  description:
    "Learn how Linkslo organises backlink services, marketplace listings, industry guidance and country-specific link building options with clear package scope and ordering details.",
  openGraph: {
    title: "About Linkslo — Backlink Marketplace & Link Building Services",
    description:
      "Learn how Linkslo organises backlink services, marketplace listings and planning guides with clear package scope and ordering details.",
    type: "website",
  },
};

const PRINCIPLES = [
  {
    icon: "document" as const,
    title: "Clear scope before checkout",
    body: "Service pages explain what is included, package pricing, expected delivery windows and the information needed to start an order.",
  },
  {
    icon: "target" as const,
    title: "Relevance before headline metrics",
    body: "Authority and traffic estimates can help with comparison, but topical fit, target market, page context and placement type matter too.",
  },
  {
    icon: "shield" as const,
    title: "Confirm suitability before fulfilment",
    body: "Publisher availability and editorial approval can change, so placement fit and feasibility are confirmed before a third-party publication is treated as final.",
  },
  {
    icon: "chart" as const,
    title: "No ranking promises",
    body: "Backlinks are one part of SEO. Rankings and traffic depend on many factors outside any link provider's control, so Linkslo does not promise a specific search result.",
  },
];

const WORKFLOW = [
  {
    number: "01",
    title: "Choose the link type",
    body: "Start with guest posts, editorial links, niche edits, digital PR, local links or another service category that matches the campaign goal.",
  },
  {
    number: "02",
    title: "Narrow the context",
    body: "Use industry and country guides to understand market-specific considerations, then compare relevant marketplace listings or service packages.",
  },
  {
    number: "03",
    title: "Submit the brief",
    body: "Provide the destination URL, anchor preference and any campaign constraints required to review the order.",
  },
  {
    number: "04",
    title: "Track the delivery",
    body: "Order status, requirements and delivered URLs stay together in the account workflow so each item can be followed from brief to completion.",
  },
];

const COVERAGE = [
  {
    title: "Backlink service catalogue",
    body: `${BACKLINK_SERVICES.length} service categories with package scope, pricing, delivery details, FAQs and related options.`,
    href: "/backlinks",
    icon: "link" as const,
  },
  {
    title: "Industry planning guides",
    body: `${INDUSTRY_PAGES.length} sector-specific pages covering common publisher types, link opportunities, anchor considerations and recommended services.`,
    href: "/backlinks/industry",
    icon: "layers" as const,
  },
  {
    title: "Country and market guides",
    body: `${COUNTRY_PAGES.length} market pages covering language, publisher landscape and practical considerations for international link building.`,
    href: "/backlinks/country",
    icon: "globe" as const,
  },
  {
    title: "Marketplace comparison",
    body: "Filter listings by service type, industry, target country, language, price and delivery window before opening the full package detail.",
    href: "/marketplace",
    icon: "filter" as const,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Linkslo"
        eyebrowIcon="compass"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="A clearer way to compare backlink services"
        description={`${BRAND.name} brings service scope, package pricing, market guidance and order requirements into one place so buyers can compare options before committing to a link-building order.`}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/marketplace" icon="arrow-right">Browse marketplace</Button>
          <Button href="/contact" variant="outline">Ask about a campaign</Button>
        </div>
      </PageHero>

      <section className="border-b border-line bg-canvas py-12">
        <div className="container-x">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[1.7rem] font-semibold text-ink-950">
                  <Counter value={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} suffix={stat.suffix} />
                </dd>
                <dt className="mt-1 text-[0.82rem] font-medium text-ink-700">{stat.label}</dt>
                <p className="mt-1 text-[0.74rem] leading-relaxed text-ink-400">{stat.detail}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="How we approach the catalogue"
              eyebrowIcon="shield"
              title="Useful comparison without invented proof"
              description="Linkslo focuses on service details a buyer can evaluate: scope, price, delivery, market fit, requirements and stated quality checks."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((item, index) => (
              <Reveal key={item.title} delay={(index % 2) * 70}>
                <Card hover className="h-full p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={item.icon} size={19} />
                  </span>
                  <h2 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-500">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-canvas py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Ordering workflow"
              eyebrowIcon="clock"
              title="From comparison to delivery"
              description="The workflow is designed to keep the target page, anchor requirements and delivery details attached to the order instead of scattered across messages."
            />
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-2">
            {WORKFLOW.map((item, index) => (
              <Reveal key={item.number} delay={(index % 2) * 70} as="li">
                <Card className="h-full p-6">
                  <span className="font-mono text-[0.76rem] font-semibold tracking-[0.14em] text-brand-700">{item.number}</span>
                  <h2 className="mt-2 font-display text-[1.05rem] font-semibold text-ink-950">{item.title}</h2>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-500">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="What you can explore"
              eyebrowIcon="layers"
              title="Services, industries, countries and marketplace listings"
              description="Use the structured pages below to move from broad link-building research to a specific package or order brief."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COVERAGE.map((item, index) => (
              <Reveal key={item.title} delay={(index % 4) * 60}>
                <Link href={item.href} className="card-hover block h-full rounded-2xl border border-line bg-white p-6 shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={item.icon} size={19} />
                  </span>
                  <h2 className="mt-4 font-display text-[1rem] font-semibold text-ink-950">{item.title}</h2>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-500">{item.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-brand-700">
                    Explore <Icon name="arrow-right" size={13} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 rounded-2xl border border-line bg-canvas p-7 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">Publisher or service partner?</h2>
                <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ink-500">
                  Use the contact page to share your website, service scope and current availability. Listing or partnership suitability can then be reviewed from the information you provide.
                </p>
              </div>
              <Button href="/contact" variant="dark" className="mt-5 shrink-0 sm:mt-0" icon="arrow-right">
                Contact Linkslo
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
