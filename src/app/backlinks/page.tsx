import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Button, Card, SectionHeading, Stars } from "@/components/ui/primitives";
import {
  BACKLINK_SERVICES,
  COUNTRY_PAGES,
  INDUSTRY_PAGES,
  SERVICE_GROUPS,
  averageRating,
  servicesByGroup,
  startingPrice,
} from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/backlinks" },
  title: "Backlink Services | All Link Building Types",
  description:
    "Every backlink service in one place: guest posts, editorial links, niche edits, contextual links, digital PR, resource links, local citations and monthly campaigns.",
};

export default function BacklinksHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Backlink services"
        eyebrowIcon="link"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Backlink Services" }]}
        title="Every backlink type, one quality standard"
        description="We only do link building. Twenty-two consolidated services covering placements, outreach, digital PR, local citations and ongoing campaigns — each with transparent scope and three package sizes."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" icon="arrow-right">Get a link recommendation</Button>
          <Button href="/marketplace" variant="outline">Browse publishers</Button>
        </div>
      </PageHero>

      <section className="border-b border-line bg-canvas py-10">
        <div className="container-x grid gap-4 sm:grid-cols-3">
          {[
            { icon: "shield" as const, title: "No PBNs, no automation", body: "Every link comes from a site that exists for its readers, not for link buyers." },
            { icon: "target" as const, title: "Relevance over metrics", body: "DA and DR filter our inventory. Topical fit decides what we actually recommend." },
            { icon: "check" as const, title: "Honest about weak tactics", body: "We will tell you when comments or bookmarks are not worth your budget." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 rounded-2xl border border-line bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <p className="text-[0.9rem] font-semibold text-ink-950">{item.title}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x space-y-14">
          {SERVICE_GROUPS.map((group) => {
            const services = servicesByGroup(group);
            if (!services.length) return null;
            return (
              <div key={group}>
                <Reveal>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-4">
                    <h2 className="font-display text-[1.4rem] font-semibold text-ink-950">{group}</h2>
                    <span className="text-[0.78rem] text-ink-400">{services.length} services</span>
                  </div>
                </Reveal>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {services.map((service, index) => (
                    <Reveal key={service.slug} delay={(index % 3) * 60}>
                      <Card as="article" hover className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                            <Icon name={service.icon} size={19} />
                          </span>
                          <span className="text-right">
                            <span className="block text-[0.62rem] uppercase tracking-wide text-ink-400">From</span>
                            <span className="font-display text-[0.98rem] font-semibold text-ink-950">
                              {formatCurrency(startingPrice(service))}
                            </span>
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-[1.02rem] font-semibold leading-snug text-ink-950">
                          <Link href={`/backlinks/${service.slug}`} className="transition-colors hover:text-brand-700">
                            {service.nav}
                          </Link>
                        </h3>
                        <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-ink-500">
                          {service.summary}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.72rem] text-ink-400">
                          <Stars rating={averageRating(service)} size={12} />
                          <span>100 specialist gigs</span>
                          <span>·</span>
                          <span>300 package options</span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
                          <Link
                            href={`/backlinks/${service.slug}`}
                            className="inline-flex items-center justify-center rounded-lg border border-line px-2.5 py-2 text-[0.76rem] font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-800"
                          >
                            Service guide
                          </Link>
                          <Link
                            href={`/marketplace?category=${encodeURIComponent(service.nav)}`}
                            className="inline-flex items-center justify-center gap-1 rounded-lg bg-ink-950 px-2.5 py-2 text-[0.76rem] font-semibold text-white transition-colors hover:bg-brand-700"
                          >
                            Browse 100 gigs
                            <Icon name="arrow-right" size={13} />
                          </Link>
                        </div>
                      </Card>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-canvas py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="By industry"
              eyebrowIcon="layers"
              title="Backlinks for your sector"
              description="Each industry has its own publishers, anchor conventions and link opportunities. Eighteen sector pages with specific guidance."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {INDUSTRY_PAGES.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/backlinks/industry/${industry.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-[0.82rem] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  <Icon name={industry.icon} size={14} />
                  {industry.name}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              eyebrow="By country"
              eyebrowIcon="globe"
              title="Backlinks in your market"
              description="Native writers, local publishers and anchors in the right language. We never translate content between markets."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {COUNTRY_PAGES.map((country) => (
                <Link
                  key={country.slug}
                  href={`/backlinks/country/${country.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[0.82rem] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  <span className="font-mono text-[0.68rem] text-ink-400">{country.flagCode}</span>
                  {country.country}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <Reveal>
            <div className="rounded-2xl border border-line bg-canvas p-7">
              <Badge tone="brand">Our position</Badge>
              <h2 className="mt-3 font-display text-[1.3rem] font-semibold text-ink-950">
                What we will not sell you
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Private blog networks", body: "We do not build, own or resell PBNs under any label. The entire model depends on hiding ownership from search engines." },
                  { title: "Guaranteed rankings", body: "Nobody controls search results. We commit to placements, quality standards and reporting — never to a position." },
                  { title: "Automated link generation", body: "Bulk submissions and automated commenting produce volume, not value, and create cleanup work later." },
                  { title: "Metric-only quality claims", body: "A DA 70 domain with no relevance and no readers is not a good link, whatever the dashboard says." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                    <Icon name="close" size={17} className="mt-0.5 shrink-0 text-rose-accent" />
                    <div>
                      <p className="text-[0.88rem] font-semibold text-ink-950">{item.title}</p>
                      <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-500">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
