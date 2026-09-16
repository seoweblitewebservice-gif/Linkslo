import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { FaqAccordion } from "@/components/marketing/SocialProof";
import { GigMarketplace } from "@/components/marketplace/GigMarketplace";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Button, Card, SectionHeading, Stars } from "@/components/ui/primitives";
import { INDUSTRY_PAGES, getIndustry, getRelatedServices, startingPrice } from "@/lib/backlinks";
import { formatCurrency, formatDate } from "@/lib/format";
import { getGigFacets } from "@/lib/gigs/data";

type Props = { params: Promise<{ slug: string }> };

// See src/app/backlinks/[slug]/page.tsx for why this is force-dynamic.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return INDUSTRY_PAGES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industry not found" };
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    alternates: { canonical: `/backlinks/industry/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const services = getRelatedServices(industry.recommendedServices);
  const others = INDUSTRY_PAGES.filter((item) => item.slug !== industry.slug);
  const gigFacets = await getGigFacets();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: industry.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow={`${industry.name} link building`}
        eyebrowIcon={industry.icon}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Backlink Services", href: "/backlinks" },
          { label: "By Industry", href: "/backlinks/industry" },
          { label: industry.name },
        ]}
        title={industry.h1}
        description={industry.summary}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" icon="arrow-right">Discuss your sector</Button>
          <Button href="/backlinks" variant="outline">All backlink services</Button>
        </div>
      </PageHero>

      <section className="border-b border-line bg-canvas py-14 sm:py-18">
        <div className="container-x">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone="brand">100+ industry gigs</Badge>
              <h2 className="mt-3 font-display text-[1.5rem] font-semibold text-ink-950">
                Hire a {industry.name.toLowerCase()} backlink specialist
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ink-500">
                Compare specialists across guest posts, editorial links, niche edits, outreach,
                PR and recurring campaigns created specifically for {industry.name.toLowerCase()} websites.
              </p>
            </div>
            <Button href={`/marketplace?industry=${encodeURIComponent(industry.name)}`} variant="outline" icon="arrow-right" className="shrink-0">
              Open industry marketplace
            </Button>
          </div>
          <div className="mt-8">
            <GigMarketplace facets={gigFacets} initialIndustry={industry.name} />
          </div>
        </div>
      </section>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_20rem] lg:items-start">
          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                Link building in {industry.name.toLowerCase()}
              </h2>
              {industry.intro.map((paragraph, index) => (
                <p key={index} className="mt-4 text-[0.98rem] leading-[1.75] text-ink-600">
                  {paragraph}
                </p>
              ))}
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                Where {industry.name.toLowerCase()} links come from
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {industry.publisherTypes.map((type) => (
                  <li key={type} className="flex gap-2.5 rounded-xl border border-line bg-canvas p-3.5 text-[0.87rem] text-ink-600">
                    <Icon name="globe" size={16} className="mt-0.5 shrink-0 text-brand-600" />
                    {type}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                Link opportunities specific to this sector
              </h2>
              <div className="mt-5 space-y-5">
                {industry.opportunities.map((opportunity, index) => (
                  <div key={opportunity.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-[0.76rem] font-semibold text-brand-700">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-[0.95rem] font-semibold text-ink-950">{opportunity.title}</h3>
                      <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-500">{opportunity.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink-950">
                  <Icon name="quote" size={17} className="text-brand-600" />
                  Anchor text guidance
                </h2>
                <p className="mt-3 text-[0.89rem] leading-relaxed text-ink-600">{industry.anchorGuidance}</p>
              </Card>
              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink-950">
                  <Icon name="shield" size={17} className="text-brand-600" />
                  Quality considerations
                </h2>
                <p className="mt-3 text-[0.89rem] leading-relaxed text-ink-600">{industry.qualityNote}</p>
              </Card>
            </div>

            <div>
              <h2 className="mb-4 font-display text-[1.3rem] font-semibold text-ink-950">
                {industry.name} backlink questions
              </h2>
              <FaqAccordion
                items={industry.faqs.map((faq, index) => ({
                  id: index + 1,
                  question: faq.question,
                  answer: faq.answer,
                  topic: industry.name,
                }))}
              />
            </div>

            <div>
              <h2 className="mb-4 font-display text-[1.3rem] font-semibold text-ink-950">
                What {industry.name.toLowerCase()} clients say
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {industry.reviews.map((review) => (
                  <li key={review.name}>
                    <Card className="h-full p-5">
                      <Stars rating={review.rating} size={13} />
                      <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-600">“{review.text}”</p>
                      <div className="mt-4 border-t border-line pt-3">
                        <p className="text-[0.84rem] font-semibold text-ink-950">{review.name}</p>
                        <p className="text-[0.74rem] text-ink-400">
                          {review.role}, {review.country} · {formatDate(review.date)}
                        </p>
                        <Badge className="mt-2">{review.tier}</Badge>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card className="p-5">
              <p className="text-[0.9rem] font-semibold text-ink-950">Recommended services</p>
              <ul className="mt-3 space-y-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/backlinks/${service.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <Icon name={service.icon} size={16} className="text-brand-700" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.85rem] font-medium text-ink-900">{service.nav}</span>
                        <span className="block text-[0.7rem] text-ink-400">
                          From {formatCurrency(startingPrice(service))}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <p className="text-[0.9rem] font-semibold text-ink-950">Other industries</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {others.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/backlinks/industry/${item.slug}`}
                    className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Get started"
              eyebrowIcon="spark"
              title={`Plan a ${industry.name.toLowerCase()} link campaign`}
              description="Tell us your target pages and market. We will come back with the publisher types, link mix and realistic volumes for your sector."
            />
          </Reveal>
          <Reveal delay={100}>
            <LeadForm source={`industry-${industry.slug}`} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
