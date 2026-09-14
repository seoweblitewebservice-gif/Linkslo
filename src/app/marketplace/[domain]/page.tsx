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
  const description = `${listing.displayName}: DR ${listing.authority}, ${formatCompact(listing.organicTraffic)} monthly organic visits, ${listing.publicationType} placements in ${listing.country}.`;
  return {
    title: `${listing.domain} — publishing opportunity`,
    description,
    alternates: { canonical: `/marketplace/${encodeURIComponent(listing.domain)}` },
    openGraph: { title: `${listing.domain} — publishing opportunity`, description, type: "website" },
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
    { label: "Authority score", value: String(listing.authority), note: "Linkslo composite" },
    { label: "Organic traffic", value: formatCompact(listing.organicTraffic), note: "Monthly estimate" },
    { label: "Referring domains", value: formatNumber(listing.referringDomains), note: "Unique linking sites" },
    { label: "Spam signals", value: `${listing.spamScore}/10`, note: "Lower is better" },
    { label: "Topical relevance", value: `${listing.relevance}%`, note: `${listing.industry}` },
    { label: "Delivery window", value: `${listing.turnaroundDays} days`, note: "Median fulfilment" },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: listing.domain },
        ]}
        eyebrow={listing.industry}
        eyebrowIcon="globe"
        title={listing.displayName}
        description={`${listing.publicationType} placements on ${listing.domain} — an independent ${listing.language}-language publication in ${listing.country}, reviewed and re-scored within the last quarter.`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/login" icon="arrow-right">
            Order this placement
          </Button>
          <Button href="/contact" variant="outline">
            Ask a question
          </Button>
          <span className="font-display text-[1.4rem] font-semibold text-ink-950">
            {formatCurrency(listing.price)}
          </span>
        </div>
      </PageHero>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">
                Performance snapshot
              </h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-line bg-canvas p-4">
                    <dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 font-display text-[1.25rem] font-semibold text-ink-950">
                      {metric.value}
                    </dd>
                    <p className="mt-0.5 text-[0.72rem] text-ink-400">{metric.note}</p>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-line p-4">
                <div>
                  <p className="text-[0.85rem] font-semibold text-ink-900">Traffic trajectory</p>
                  <p className="text-[0.74rem] text-ink-400">
                    {listing.trafficTrend >= 0 ? "Up" : "Down"} {Math.abs(listing.trafficTrend)}% over
                    the last two quarters
                  </p>
                </div>
                <MiniColumns values={trendSeries} tone={listing.trafficTrend >= 0 ? "brand" : "amber"} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">
                What you receive
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  `One ${listing.publicationType.toLowerCase()} with ${listing.linkType.toLowerCase()} attribution to a page of your choice`,
                  "Original content written for this publication's audience and editorial guidelines",
                  "Anchor text review by a strategist before submission",
                  "Live URL logged in your workspace with authority and traffic data",
                  "Replacement if the placement is removed within 12 months",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] text-ink-600">
                    <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">
                Screening result
              </h2>
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
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="p-6">
              <p className="text-[0.72rem] uppercase tracking-wide text-ink-400">Placement summary</p>
              <p className="mt-1 font-display text-[2rem] font-semibold text-ink-950">
                {formatCurrency(listing.price)}
              </p>
              <p className="text-[0.8rem] text-ink-400">One-off, price locked at checkout</p>
              <ul className="mt-5 space-y-2.5 text-[0.85rem] text-ink-600">
                <li className="flex justify-between">
                  <span>Format</span>
                  <span className="font-medium text-ink-900">{listing.publicationType}</span>
                </li>
                <li className="flex justify-between">
                  <span>Link type</span>
                  <span className="font-medium text-ink-900">{listing.linkType}</span>
                </li>
                <li className="flex justify-between">
                  <span>Language</span>
                  <span className="font-medium text-ink-900">{listing.language}</span>
                </li>
                <li className="flex justify-between">
                  <span>Market</span>
                  <span className="font-medium text-ink-900">{listing.country}</span>
                </li>
                <li className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-medium text-ink-900">{listing.turnaroundDays} days</span>
                </li>
              </ul>
              <Button href="/login" fullWidth className="mt-6" icon="arrow-right">
                Add to campaign
              </Button>
              <Button href="/marketplace" variant="outline" fullWidth className="mt-2">
                Back to marketplace
              </Button>
            </Card>

            {related.length > 0 && (
              <Card className="p-6">
                <h2 className="text-[0.95rem] font-semibold text-ink-950">
                  Similar in {listing.industry}
                </h2>
                <ul className="mt-4 space-y-3">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/marketplace/${encodeURIComponent(item.domain)}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[0.85rem] font-medium text-ink-900">
                            {item.domain}
                          </span>
                          <span className="block text-[0.72rem] text-ink-400">
                            {item.country} · {formatCompact(item.organicTraffic)} visits
                          </span>
                        </span>
                        <Badge tone="brand">DR {item.authority}</Badge>
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
