import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniColumns, ProgressBar } from "@/components/charts/Charts";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/format";
import { getListing, getRelatedListings } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  const listing = await getListing(decodeURIComponent(domain));
  if (!listing) return { title: "Opportunity not found", robots: { index: false, follow: true } };
  const description = `${listing.displayName}: demonstration publisher profile with representative authority, traffic, publication and delivery data.`;
  return {
    title: `${listing.domain} — publisher profile`,
    description,
    alternates: { canonical: `/marketplace/${encodeURIComponent(listing.domain)}` },
    robots: { index: false, follow: true },
    openGraph: { title: `${listing.domain} — publisher profile`, description, type: "website" },
  };
}

export default async function ListingPage({ params }: Props) {
  const { domain } = await params;
  const listing = await getListing(decodeURIComponent(domain));
  if (!listing) notFound();

  const related = await getRelatedListings(listing.industry, listing.id, 4);
  const trendSeries = [
    Math.round(listing.organicTraffic * 0.62),
    Math.round(listing.organicTraffic * 0.7),
    Math.round(listing.organicTraffic * 0.74),
    Math.round(listing.organicTraffic * 0.83),
    Math.round(listing.organicTraffic * 0.88),
    Math.round(listing.organicTraffic * 0.94),
    listing.organicTraffic,
  ];

  const metrics = [
    { label: "Authority score", value: String(listing.authority), note: "Demonstration value" },
    { label: "Organic traffic", value: formatCompact(listing.organicTraffic), note: "Representative estimate" },
    { label: "Referring domains", value: formatNumber(listing.referringDomains), note: "Representative value" },
    { label: "Spam signals", value: `${listing.spamScore}/10`, note: "Demonstration score" },
    { label: "Topical relevance", value: `${listing.relevance}%`, note: `${listing.industry}` },
    { label: "Delivery window", value: `${listing.turnaroundDays} days`, note: "Representative window" },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: listing.domain },
        ]}
        eyebrow={`${listing.industry} · Demonstration inventory`}
        eyebrowIcon="globe"
        title={listing.displayName}
        description={`This publisher profile uses representative marketplace data for interface demonstration and is not an independently verified live inventory listing.`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" icon="arrow-right">Ask about live publisher availability</Button>
          <Button href="/marketplace" variant="outline">Back to marketplace</Button>
        </div>
      </PageHero>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[0.85rem] leading-relaxed text-amber-900">
                Demonstration data only. Confirm the live domain, current metrics, availability and final price with Linkslo before ordering.
              </div>
              <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">Representative performance snapshot</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-line bg-canvas p-4">
                    <dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">{metric.label}</dt>
                    <dd className="mt-1 font-display text-[1.25rem] font-semibold text-ink-950">{metric.value}</dd>
                    <p className="mt-0.5 text-[0.72rem] text-ink-400">{metric.note}</p>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-line p-4">
                <div>
                  <p className="text-[0.85rem] font-semibold text-ink-900">Illustrative traffic trajectory</p>
                  <p className="text-[0.74rem] text-ink-400">Interface preview only; not a verified historical traffic series</p>
                </div>
                <MiniColumns values={trendSeries} tone={listing.trafficTrend >= 0 ? "brand" : "amber"} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">What a live placement can include</h2>
              <ul className="mt-4 space-y-3">
                {[
                  `A confirmed ${listing.publicationType.toLowerCase()} opportunity after a live availability check`,
                  "Content prepared or reviewed against the publisher's current editorial guidelines",
                  "Anchor and target-page review before submission",
                  "A live URL report after publication",
                  "Any replacement or monitoring terms confirmed before payment",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] text-ink-600">
                    <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">Screening framework</h2>
              <div className="mt-4 space-y-4">
                {[
                  { label: "Traffic distribution", score: Math.min(98, listing.relevance + 4) },
                  { label: "Editorial continuity", score: Math.min(96, listing.authority + 22) },
                  { label: "Outbound hygiene", score: Math.max(48, 100 - listing.spamScore * 9) },
                  { label: "Category relevance", score: listing.relevance },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-[0.84rem]">
                      <span className="font-medium text-ink-800">{row.label}</span>
                      <span className="font-mono text-[0.78rem] text-ink-500">{row.score}</span>
                    </div>
                    <ProgressBar value={row.score} className="mt-1.5" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[0.78rem] leading-relaxed text-ink-400">Scores above demonstrate the interface and screening dimensions. They are not claims about a live publisher until independently checked.</p>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="p-6">
              <Badge tone="brand">Demonstration profile</Badge>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-600">Current availability and pricing must be confirmed before an order is accepted.</p>
              <ul className="mt-5 space-y-2.5 text-[0.85rem] text-ink-600">
                <li className="flex justify-between"><span>Format</span><span className="font-medium text-ink-900">{listing.publicationType}</span></li>
                <li className="flex justify-between"><span>Link type</span><span className="font-medium text-ink-900">{listing.linkType}</span></li>
                <li className="flex justify-between"><span>Language</span><span className="font-medium text-ink-900">{listing.language}</span></li>
                <li className="flex justify-between"><span>Market</span><span className="font-medium text-ink-900">{listing.country}</span></li>
              </ul>
              <Button href="/contact" fullWidth className="mt-6" icon="arrow-right">Check live availability</Button>
              <Button href="/marketplace" variant="outline" fullWidth className="mt-2">Back to marketplace</Button>
            </Card>

            {related.length > 0 && (
              <Card className="p-6">
                <h2 className="text-[0.95rem] font-semibold text-ink-950">Other demonstration profiles</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link href={`/marketplace/${encodeURIComponent(item.domain)}`} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                        <span className="min-w-0">
                          <span className="block truncate text-[0.85rem] font-medium text-ink-900">{item.domain}</span>
                          <span className="block text-[0.72rem] text-ink-400">Demonstration inventory</span>
                        </span>
                        <Badge>{item.industry}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
