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
import { COUNTRY_PAGES, getCountry, getRelatedServices, startingPrice } from "@/lib/backlinks";
import { formatCurrency, formatDate } from "@/lib/format";
import { getGigFacets } from "@/lib/gigs/data";

type Props = { params: Promise<{ slug: string }> };

// See src/app/backlinks/[slug]/page.tsx for why this is force-dynamic.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return COUNTRY_PAGES.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) return { title: "Market not found" };
  return {
    title: country.metaTitle,
    description: country.metaDescription,
    keywords: country.keywords,
    alternates: { canonical: `/backlinks/country/${country.slug}` },
  };
}

export default async function CountryBacklinkPage({ params }: Props) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const services = getRelatedServices(country.recommendedServices);
  const others = COUNTRY_PAGES.filter((item) => item.slug !== country.slug);
  const gigFacets = await getGigFacets();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: country.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow={`${country.country} · ${country.language}`}
        eyebrowIcon="globe"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Backlink Services", href: "/backlinks" },
          { label: "By Country", href: "/backlinks/country" },
          { label: country.country },
        ]}
        title={country.h1}
        description={country.summary}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" icon="arrow-right">Plan a {country.country} campaign</Button>
          <Button href="/marketplace" variant="outline">Filter publishers by market</Button>
        </div>
      </PageHero>

      <section className="border-b border-line bg-canvas py-14 sm:py-18">
        <div className="container-x">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone="brand">200+ market gigs</Badge>
              <h2 className="mt-3 font-display text-[1.5rem] font-semibold text-ink-950">
                Hire a backlink specialist for {country.country}
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ink-500">
                Compare {country.language.toLowerCase()} backlink gigs across all service types,
                industries, seller levels and package sizes for this market.
              </p>
            </div>
            <Button href={`/marketplace?country=${encodeURIComponent(country.country)}`} variant="outline" icon="arrow-right" className="shrink-0">
              Open {country.country} marketplace
            </Button>
          </div>
          <div className="mt-8">
            <GigMarketplace facets={gigFacets} initialCountry={country.country} />
          </div>
        </div>
      </section>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_20rem] lg:items-start">
          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                The {country.country} link market
              </h2>
              {country.intro.map((paragraph, index) => (
                <p key={index} className="mt-4 text-[0.98rem] leading-[1.75] text-ink-600">
                  {paragraph}
                </p>
              ))}
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">Publisher landscape</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {country.publisherLandscape.map((item) => (
                  <li key={item} className="flex gap-2.5 rounded-xl border border-line bg-canvas p-3.5 text-[0.87rem] text-ink-600">
                    <Icon name="document" size={16} className="mt-0.5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                What we do differently in this market
              </h2>
              <div className="mt-5 space-y-5">
                {country.localSignals.map((signal) => (
                  <div key={signal.title} className="flex gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon name="check" size={17} />
                    </span>
                    <div>
                      <h3 className="text-[0.95rem] font-semibold text-ink-950">{signal.title}</h3>
                      <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-500">{signal.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink-950">
                <Icon name="quote" size={17} className="text-brand-600" />
                Anchor text in {country.country}
              </h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-600">{country.anchorGuidance}</p>
            </Card>

            <div>
              <h2 className="mb-4 font-display text-[1.3rem] font-semibold text-ink-950">
                {country.country} backlink questions
              </h2>
              <FaqAccordion
                items={country.faqs.map((faq, index) => ({
                  id: index + 1,
                  question: faq.question,
                  answer: faq.answer,
                  topic: country.country,
                }))}
              />
            </div>

            <div>
              <h2 className="mb-4 font-display text-[1.3rem] font-semibold text-ink-950">
                Feedback from this market
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {country.reviews.map((review) => (
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
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-ink-950 px-2 py-1 font-mono text-[0.7rem] font-semibold text-white">
                  {country.flagCode}
                </span>
                <div>
                  <p className="text-[0.88rem] font-semibold text-ink-950">{country.country}</p>
                  <p className="text-[0.72rem] text-ink-400">{country.language}</p>
                </div>
              </div>
              <p className="mt-4 text-[0.88rem] font-semibold text-ink-950">Best services here</p>
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
              <p className="text-[0.9rem] font-semibold text-ink-950">Other markets</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {others.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/backlinks/country/${item.slug}`}
                    className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-800"
                  >
                    {item.country}
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
              eyebrowIcon="globe"
              title={`Build links in ${country.country}`}
              description="Tell us your target pages and language versions. We will propose native publishers and a realistic acquisition pace for this market."
            />
          </Reveal>
          <Reveal delay={100}>
            <LeadForm source={`country-${country.slug}`} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
