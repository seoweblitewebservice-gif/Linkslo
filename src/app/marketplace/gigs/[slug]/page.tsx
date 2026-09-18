import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GigPackagePanel } from "@/components/marketplace/GigPackagePanel";
import { FaqAccordion } from "@/components/marketing/SocialProof";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/format";
import { getGigBySlug, getRelatedMarketplaceGigs } from "@/lib/gigs/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gig = await getGigBySlug(slug);
  if (!gig) return { title: "Backlink gig not found", robots: { index: false, follow: true } };

  const isNamedPublisherListing = Boolean(gig.domain);

  return {
    title: gig.metaTitle,
    description: gig.metaDescription,
    alternates: { canonical: `/marketplace/gigs/${gig.slug}` },
    openGraph: { title: gig.metaTitle, description: gig.metaDescription, type: "website" },
    // Only named-publisher listings are submitted for organic indexing. Generic
    // generated marketplace variants remain browseable but do not compete as
    // thousands of near-template landing pages in search.
    robots: { index: isNamedPublisherListing, follow: true },
  };
}

export default async function MarketplaceGigPage({ params }: Props) {
  const { slug } = await params;
  const gig = await getGigBySlug(slug);
  if (!gig) notFound();
  const related = await getRelatedMarketplaceGigs(gig, 4);

  // Older seeded records include demonstration seller identities in their copy.
  // Keep the useful service/domain detail while presenting delivery truthfully as
  // a Linkslo-operated listing rather than implying a verified third-party seller.
  const publicDescription = gig.description
    .split(gig.sellerName)
    .join("The Linkslo delivery team");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: gig.title,
        description: gig.metaDescription,
        serviceType: gig.subcategory,
        areaServed: gig.country,
        provider: {
          "@type": "Organization",
          name: "Linkslo",
          url: "https://www.linkslo.com",
        },
        offers: gig.packages.map((pkg) => ({
          "@type": "Offer",
          name: `${pkg.tier} — ${pkg.name}`,
          price: pkg.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: gig.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.linkslo.com" },
          { "@type": "ListItem", position: 2, name: "Marketplace", item: "https://www.linkslo.com/marketplace" },
          {
            "@type": "ListItem",
            position: 3,
            name: gig.category,
            item: `https://www.linkslo.com/marketplace?category=${encodeURIComponent(gig.category)}`,
          },
          { "@type": "ListItem", position: 4, name: gig.title, item: `https://www.linkslo.com/marketplace/gigs/${gig.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={`${gig.category} · ${gig.country}`}
        eyebrowIcon="link"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: gig.category, href: `/marketplace?category=${encodeURIComponent(gig.category)}` },
          { label: gig.subcategory },
        ]}
        title={gig.title}
        description={gig.summary}
      >
        <div className="flex flex-wrap items-center gap-2.5 text-[0.78rem] text-ink-600">
          <Badge tone="brand">{gig.domain ? "Named publisher listing" : "Marketplace service"}</Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5">
            <Icon name="globe" size={13} className="text-brand-600" />
            {gig.country} · {gig.language}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5">
            <Icon name="clock" size={13} className="text-brand-600" />
            From {gig.fastestDeliveryDays} days
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-semibold text-ink-900">
            From {formatCurrency(gig.startingPrice)}
          </span>
        </div>
      </PageHero>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_23rem] lg:items-start">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative min-h-[19rem] overflow-hidden bg-gradient-to-br from-ink-950 via-[#0b6c58] to-brand-400 p-7 text-white sm:p-9">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
                <span className="absolute -bottom-28 -right-12 h-80 w-80 rounded-full border-[44px] border-white/10" />
                <div className="relative flex min-h-[14rem] flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"><Icon name="link" size={24} /></span>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Badge tone="brand">Quality-reviewed scope</Badge>
                      <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.68rem] font-semibold">{gig.language}</span>
                    </div>
                  </div>
                  <div className="max-w-2xl">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-200">{gig.industry} · {gig.objective}</p>
                    <p className="mt-2 font-display text-[clamp(1.45rem,3vw,2.15rem)] font-semibold leading-tight">{gig.subcategory}</p>
                    <p className="mt-3 max-w-xl text-[0.88rem] leading-relaxed text-ink-200">Basic, Standard and Premium options with market-specific placement review for {gig.country}.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.25rem] font-semibold text-ink-950">About this backlink gig</h2>
              {publicDescription.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mt-4 text-[0.94rem] leading-[1.75] text-ink-600">{paragraph}</p>
              ))}
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Service", gig.subcategory],
                  ["Industry", gig.industry],
                  ["Target market", gig.country],
                  ["Objective", gig.objective],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-line bg-canvas p-3.5">
                    <dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">{label}</dt>
                    <dd className="mt-1 text-[0.78rem] font-semibold text-ink-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.25rem] font-semibold text-ink-950">What you receive</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {gig.included.map((item) => (
                  <li key={item} className="flex gap-2.5 rounded-xl border border-line bg-canvas p-4 text-[0.84rem] leading-relaxed text-ink-600">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand-600" />{item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.25rem] font-semibold text-ink-950">Why this gig is useful</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {gig.benefits.map((benefit) => (
                  <div key={benefit.title}>
                    <h3 className="flex items-center gap-2 text-[0.9rem] font-semibold text-ink-950"><Icon name="spark" size={15} className="text-brand-600" />{benefit.title}</h3>
                    <p className="mt-1.5 text-[0.84rem] leading-relaxed text-ink-500">{benefit.body}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink-950"><Icon name="link" size={17} className="text-brand-600" />Placement information</h2>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-600">{gig.placement}</p>
              </Card>
              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink-950"><Icon name="shield" size={17} className="text-brand-600" />Quality requirements</h2>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-600">{gig.quality}</p>
              </Card>
            </div>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.25rem] font-semibold text-ink-950">How delivery works</h2>
              <ol className="mt-5 space-y-5">
                {gig.process.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-[0.7rem] font-semibold text-white">{index + 1}</span>
                    <div><h3 className="text-[0.9rem] font-semibold text-ink-950">{step.title}</h3><p className="mt-1 text-[0.84rem] leading-relaxed text-ink-500">{step.body}</p></div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-[1.25rem] font-semibold text-ink-950">Suitable use cases</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {gig.useCases.map((item) => <li key={item} className="flex gap-2.5 text-[0.86rem] text-ink-600"><Icon name="target" size={15} className="mt-0.5 shrink-0 text-brand-600" />{item}</li>)}
              </ul>
            </Card>

            <section>
              <h2 className="mb-4 font-display text-[1.25rem] font-semibold text-ink-950">Compare packages</h2>
              <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
                <table className="w-full min-w-[42rem] text-left">
                  <caption className="sr-only">Compare Basic, Standard and Premium packages</caption>
                  <thead><tr className="border-b border-line bg-canvas/70"><th className="px-5 py-4 text-[0.7rem] uppercase tracking-wide text-ink-400">Package</th>{gig.packages.map((pkg) => <th key={pkg.tier} className="px-5 py-4 capitalize"><span className="text-[0.72rem] font-semibold uppercase tracking-wide text-brand-700">{pkg.tier}</span><span className="mt-1 block font-display text-[1rem] font-semibold text-ink-950">{formatCurrency(pkg.price)}</span></th>)}</tr></thead>
                  <tbody className="divide-y divide-line text-[0.8rem]">
                    {[["Name", (pkg: typeof gig.packages[number]) => pkg.name], ["Quantity", (pkg: typeof gig.packages[number]) => pkg.quantity], ["Delivery", (pkg: typeof gig.packages[number]) => `${pkg.deliveryDays} days`], ["Revisions", (pkg: typeof gig.packages[number]) => String(pkg.revisions)]].map(([label, render]) => <tr key={String(label)}><th className="px-5 py-3 font-medium text-ink-700">{String(label)}</th>{gig.packages.map((pkg) => <td key={pkg.tier} className="px-5 py-3 text-ink-600">{typeof render === "function" ? render(pkg) : ""}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-display text-[1.25rem] font-semibold text-ink-950">Questions about this gig</h2>
              <FaqAccordion items={gig.faqs.map((faq, index) => ({ id: index + 1, question: faq.question, answer: faq.answer, topic: gig.subcategory }))} />
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <GigPackagePanel gigSlug={gig.slug} title={gig.title} packages={gig.packages} />
            <Card className="p-5">
              <h2 className="font-display text-[1rem] font-semibold text-ink-950">Order support</h2>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-500">
                Linkslo reviews the target URL, anchor preference and placement fit before fulfilment. Publisher availability and final editorial approval are confirmed during the order process.
              </p>
              <ul className="mt-4 space-y-2 text-[0.78rem] text-ink-600">
                <li className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand-600" />Target-page and anchor review</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand-600" />Placement feasibility confirmation</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand-600" />Live URL delivery reporting</li>
              </ul>
            </Card>
            <Card className="p-5">
              <p className="text-[0.88rem] font-semibold text-ink-950">Service foundation</p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-ink-500">This specialised gig follows the quality standard of our core {gig.category.toLowerCase()} service.</p>
              <Button href={`/backlinks/${gig.serviceSlug}`} variant="outline" fullWidth className="mt-4" icon="arrow-right">Read service standard</Button>
            </Card>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-16">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4"><div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-700">Similar gigs</p><h2 className="mt-1 font-display text-[1.35rem] font-semibold text-ink-950">More {gig.category.toLowerCase()} offers</h2></div><Button href={`/marketplace?category=${encodeURIComponent(gig.category)}`} variant="outline" icon="arrow-right">Browse category</Button></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link key={item.id} href={`/marketplace/gigs/${item.slug}`} className="card-hover flex flex-col rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-white"><Icon name="link" size={15} /></span>
                    <Badge tone="brand">{item.country}</Badge>
                  </div>
                  <h3 className="mt-4 line-clamp-3 font-display text-[0.9rem] font-semibold leading-snug text-ink-950">{item.title}</h3>
                  <p className="mt-2 text-[0.7rem] text-ink-400">{item.subcategory}</p>
                  <div className="mt-auto flex items-end justify-between border-t border-line pt-4"><span className="text-[0.68rem] text-ink-400">From</span><span className="font-display text-[0.95rem] font-semibold text-ink-950">{formatCurrency(item.startingPrice)}</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
