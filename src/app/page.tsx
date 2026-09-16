import type { Metadata } from "next";
import Link from "next/link";
import { Hero, TrustBar } from "@/components/marketing/Hero";
import { FeaturedGigs } from "@/components/marketing/FeaturedGigs";
import { ScoutPanel } from "@/components/marketing/ScoutPanel";
import { FinalCta, HowItWorks, ServicesGrid, WhyChooseUs } from "@/components/marketing/Sections";
import { ArticleGrid } from "@/components/marketing/Showcase";
import { FaqAccordion } from "@/components/marketing/SocialProof";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";
import { BRAND } from "@/lib/content";
import { BACKLINK_SERVICES } from "@/lib/backlinks";
import { getFeaturedMarketplaceGigs } from "@/lib/gigs/data";
import { getArticles, getFaqs } from "@/lib/queries";

export const dynamic = "force-dynamic";

const HOME_CATEGORIES = [
  {
    title: "Editorial placements",
    icon: "quill" as const,
    body: "Articles and mentions published through editorial workflows on relevant websites.",
    services: ["guest-post-backlinks", "editorial-backlinks", "premium-link-building"],
  },
  {
    title: "Contextual links",
    icon: "link" as const,
    body: "Links placed inside relevant body copy on new or established pages.",
    services: ["contextual-backlinks", "niche-edit-backlinks", "authority-backlinks"],
  },
  {
    title: "Digital PR & news",
    icon: "megaphone" as const,
    body: "Data-led stories, announcements and media outreach for relevant coverage opportunities.",
    services: ["digital-pr-backlinks", "press-release-news-backlinks", "brand-entity-link-building"],
  },
  {
    title: "Outreach campaigns",
    icon: "compass" as const,
    body: "Manual prospecting for resource, broken-link and visual-asset opportunities.",
    services: ["resource-link-building", "broken-link-building", "image-infographic-link-building"],
  },
  {
    title: "Local & foundation",
    icon: "pin" as const,
    body: "Local citations and supporting link types for broader profile coverage.",
    services: ["local-backlinks", "citation-directory-backlinks", "web-2-0-backlinks", "forum-community-backlinks"],
  },
  {
    title: "Strategy & ongoing",
    icon: "chart" as const,
    body: "Competitor analysis and managed programmes for ongoing link acquisition.",
    services: ["competitor-link-building", "monthly-link-building", "saas-software-backlinks", "edu-gov-resource-links"],
  },
];

export const metadata: Metadata = {
  title: "Backlink & Link Building Services",
  description:
    "Compare backlink services, guest post opportunities and link-building packages across industries and countries with transparent scope, pricing and delivery details.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Backlink & Link Building Services | Linkslo",
    description:
      "Compare backlink services, guest post opportunities and link-building packages with transparent scope and delivery details.",
    type: "website",
  },
};

export default async function HomePage() {
  const [faqs, articles, featuredGigs] = await Promise.all([
    getFaqs(),
    getArticles(4),
    getFeaturedMarketplaceGigs(6),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Hero />
      <TrustBar />

      <section className="border-b border-line bg-canvas py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Marketplace listings"
                eyebrowIcon="users"
                title="Compare backlink listings by service, niche and market"
                description="Review package scope, delivery time, target market and starting price before submitting an order. Availability is confirmed as part of the ordering process."
              />
              <Button href="/marketplace" variant="outline" icon="arrow-right" className="shrink-0">
                Browse marketplace
              </Button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10">
              <FeaturedGigs gigs={featuredGigs} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Browse by link type"
                eyebrowIcon="link"
                title="Start with the link type you actually need"
                description="Explore backlink services grouped by how the link is earned, with package scope and delivery details shown before ordering."
              />
              <Button href="/backlinks" variant="outline" icon="arrow-right" className="shrink-0">
                View all services
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
                  <h3 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">{category.title}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-500">{category.body}</p>
                  <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
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
        </div>
      </section>

      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />

      <section id="link-gap-scout" className="border-y border-line bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  eyebrow="Backlink intelligence"
                  eyebrowIcon="compass"
                  title="Size the backlink gap before you spend"
                  description="Use Link Gap Scout to explore a representative competitor-gap workflow and then validate live opportunities before starting a campaign."
                />
                <ul className="mt-7 space-y-3.5">
                  {[
                    "Competitor and referring-domain gap workflow",
                    "Content-gap prioritisation by intent",
                    "Service matching by category and market",
                    "A repeatable opportunity-review process",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.9rem] text-ink-600">
                      <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl border border-line bg-canvas p-4 text-[0.8rem] leading-relaxed text-ink-500">
                  Link Gap Scout currently uses demonstration figures for the interface. Live campaign decisions should be based on verified source data.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ScoutPanel />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Knowledge hub"
                eyebrowIcon="document"
                title="Link-building guides and practitioner notes"
                description="Long-form resources covering publisher evaluation, outreach, link quality and campaign planning."
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

      <section id="faq" className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  eyebrow="Questions"
                  eyebrowIcon="check"
                  title="Answers before you commit"
                  description="Review the service details first, or contact Linkslo if you need help matching a service to a specific target page."
                />
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/contact" icon="arrow-right">Talk to an expert</Button>
                  <Button href="/pricing" variant="outline">See pricing</Button>
                </div>
                <p className="mt-6 text-[0.85rem] text-ink-500">
                  Prefer email?{" "}
                  <Link href="/contact" className="font-semibold text-brand-700 hover:underline">{BRAND.email}</Link>
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
