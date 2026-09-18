import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { PackageSelector } from "@/components/marketplace/PackageSelector";
import { GigMarketplace } from "@/components/marketplace/GigMarketplace";
import { FaqAccordion } from "@/components/marketing/SocialProof";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Button, Card, SectionHeading } from "@/components/ui/primitives";
import {
  BACKLINK_SERVICES,
  getRelatedServices,
  getService,
  startingPrice,
} from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";
import { getGigFacets } from "@/lib/gigs/data";
import { GIG_TOPICS } from "@/lib/gigs/generator";
import { queryGigs } from "@/lib/gigs-query";

type Props = { params: Promise<{ slug: string }> };

// Renders on-demand instead of at build time: this page reads live gig
// facets from the database, so prerendering it during `next build` would
// require DATABASE_URL to be available at build time. Keeping it dynamic
// means the build never touches the database, while the page still shows
// fully up-to-date data on every request.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BACKLINK_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/backlinks/${service.slug}` },
    openGraph: { title: service.metaTitle, description: service.metaDescription, type: "website" },
  };
}

export default async function BacklinkServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.related);
  const gigFacets = await getGigFacets();
  const gigInitialData = await queryGigs({ category: service.nav, pageSize: 24 });
  const topicNames = Array.from(
    new Set(
      GIG_TOPICS.filter((topic) => topic.service.slug === service.slug).map(
        (topic) => topic.title,
      ),
    ),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.h1,
        description: service.metaDescription,
        serviceType: service.nav,
        provider: { "@type": "Organization", name: "Linkslo", url: "https://www.linkslo.com" },
        areaServed: "Worldwide",
        offers: service.packages.map((pkg) => ({
          "@type": "Offer",
          name: pkg.name,
          price: pkg.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.linkslo.com" },
          { "@type": "ListItem", position: 2, name: "Backlink Services", item: "https://www.linkslo.com/backlinks" },
          { "@type": "ListItem", position: 3, name: service.nav, item: `https://www.linkslo.com/backlinks/${service.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow={service.group}
        eyebrowIcon={service.icon}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Backlink Services", href: "/backlinks" },
          { label: service.nav },
        ]}
        title={service.h1}
        description={service.summary}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" icon="arrow-right">Request this service</Button>
            <Button href="/marketplace" variant="outline">Browse marketplace</Button>
          </div>
          <span className="text-[0.82rem] text-ink-500">
            From <strong className="text-ink-900">{formatCurrency(startingPrice(service))}</strong>
          </span>
        </div>
      </PageHero>

      <section className="border-b border-line bg-canvas py-14 sm:py-18">
        <div className="container-x">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone="brand">Service marketplace</Badge>
              <h2 className="mt-3 font-display text-[1.55rem] font-semibold text-ink-950">
                Compare {service.nav.toLowerCase()} packages and delivery options
              </h2>
              <p className="mt-2 max-w-2xl text-[0.92rem] leading-relaxed text-ink-500">
                Browse matching marketplace listings by topic, industry, country, language,
                delivery time and starting price.
              </p>
            </div>
            <Button
              href={`/marketplace?category=${encodeURIComponent(service.nav)}`}
              variant="outline"
              icon="arrow-right"
              className="shrink-0"
            >
              Open category marketplace
            </Button>
          </div>
          <div className="mt-8">
            <GigMarketplace facets={gigFacets} initialCategory={service.nav} initialData={gigInitialData} />
          </div>
        </div>
      </section>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_23rem] lg:items-start">
          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">
                What this service is
              </h2>
              {service.intro.map((paragraph, index) => (
                <p key={index} className="mt-4 text-[0.98rem] leading-[1.75] text-ink-600">
                  {paragraph}
                </p>
              ))}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {service.stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-line bg-canvas p-4">
                    <p className="font-display text-[1.15rem] font-semibold text-ink-950">{stat.value}</p>
                    <p className="mt-0.5 text-[0.74rem] text-ink-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              {topicNames.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
                    Browse every topic in this category
                  </p>
                  <p className="mt-1 text-[0.76rem] text-ink-400">
                    Each topic opens matching marketplace listings with Basic, Standard and Premium packages.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topicNames.map((topic) => (
                      <Link
                        key={topic}
                        href={`/marketplace?category=${encodeURIComponent(service.nav)}&subcategory=${encodeURIComponent(topic)}`}
                        className="rounded-full border border-line bg-white px-2.5 py-1 text-[0.76rem] text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      >
                        {topic}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">
                What you receive
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.included.map((item) => (
                  <li key={item} className="flex gap-2.5 rounded-xl border border-line bg-canvas p-4 text-[0.88rem] leading-relaxed text-ink-600">
                    <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">Key benefits</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <div key={benefit.title}>
                    <h3 className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink-950">
                      <Icon name="spark" size={16} className="text-brand-600" />
                      {benefit.title}
                    </h3>
                    <p className="mt-1.5 text-[0.87rem] leading-relaxed text-ink-500">{benefit.body}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.1rem] font-semibold text-ink-950">
                  <Icon name="link" size={18} className="text-brand-600" />
                  Link placement
                </h2>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-600">{service.placement}</p>
              </Card>
              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.1rem] font-semibold text-ink-950">
                  <Icon name="shield" size={18} className="text-brand-600" />
                  Quality and relevance
                </h2>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-600">{service.quality}</p>
              </Card>
            </div>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">
                How ordering works
              </h2>
              <ol className="mt-5 space-y-5">
                {service.process.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-[0.74rem] font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-[0.95rem] font-semibold text-ink-950">{step.title}</h3>
                      <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-500">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">
                Who this suits
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-2.5 text-[0.89rem] text-ink-600">
                    <Icon name="target" size={16} className="mt-0.5 shrink-0 text-brand-600" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </Card>

            <div>
              <h2 className="mb-4 font-display text-[1.35rem] font-semibold text-ink-950">
                Compare the three packages
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {service.packages.map((pkg) => (
                  <Card
                    key={pkg.tier}
                    className={`flex h-full flex-col p-5 ${pkg.recommended ? "border-brand-300 ring-1 ring-brand-200" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-700">
                        {pkg.tier}
                      </p>
                      {pkg.recommended && <Badge tone="brand">Popular</Badge>}
                    </div>
                    <p className="mt-2 font-display text-[1.05rem] font-semibold text-ink-950">{pkg.name}</p>
                    <p className="mt-1 font-display text-[1.5rem] font-semibold text-ink-950">
                      {formatCurrency(pkg.price)}
                    </p>
                    <p className="mt-1 text-[0.76rem] text-ink-400">{pkg.volume}</p>
                    <p className="mt-3 text-[0.83rem] leading-relaxed text-ink-500">{pkg.summary}</p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-[0.8rem] text-ink-600">
                          <Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-between border-t border-line pt-3 text-[0.76rem] text-ink-400">
                      <span>{pkg.deliveryDays} days</span>
                      <span>{pkg.revisions} revisions</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div id="faq">
              <h2 className="mb-4 font-display text-[1.35rem] font-semibold text-ink-950">
                {service.nav} questions
              </h2>
              <FaqAccordion
                items={service.faqs.map((faq, index) => ({
                  id: index + 1,
                  question: faq.question,
                  answer: faq.answer,
                  topic: service.nav,
                }))}
              />
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <PackageSelector
              packages={service.packages.map((pkg, index) => ({
                id: index,
                gigId: 0,
                tier: pkg.tier,
                name: pkg.name,
                tagline: pkg.volume,
                description: pkg.summary,
                price: pkg.price,
                deliveryDays: pkg.deliveryDays,
                revisions: pkg.revisions,
                deliverableCount: pkg.features.length,
                features: pkg.features,
                recommended: Boolean(pkg.recommended),
              }))}
              gigTitle={service.nav}
              serviceSlug={service.slug}
            />

            <Card className="p-5">
              <p className="text-[0.9rem] font-semibold text-ink-950">Related backlink services</p>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/backlinks/${item.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <Icon name={item.icon} size={16} className="text-brand-700" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.85rem] font-medium text-ink-900">{item.nav}</span>
                        <span className="block text-[0.7rem] text-ink-400">
                          From {formatCurrency(startingPrice(item))}
                        </span>
                      </span>
                      <Icon name="arrow-right" size={14} className="text-ink-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-ink-950 p-5 text-white">
              <p className="font-display text-[1rem] font-semibold">{service.cta.heading}</p>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-300">{service.cta.body}</p>
              <Button href="/contact" variant="soft" fullWidth className="mt-4" icon="arrow-right">
                Talk to a strategist
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Next step"
              eyebrowIcon="spark"
              title={service.cta.heading}
              description={service.cta.body}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/backlinks/${item.slug}`}
                  className="rounded-full border border-line px-3 py-1.5 text-[0.8rem] font-medium text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-800"
                >
                  {item.nav}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <LeadForm source={`backlink-${service.slug}`} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
