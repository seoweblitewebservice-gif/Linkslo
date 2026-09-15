import Link from "next/link";
import { AreaTrend, MiniColumns, ProgressBar } from "@/components/charts/Charts";
import { Icon } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/motion";
import { Badge, Button, Eyebrow, Stars } from "@/components/ui/primitives";
import { HeroSearch } from "@/components/marketing/HeroSearch";
import { TRUST_STATS } from "@/lib/content";
import { formatCompact } from "@/lib/format";

const TRAFFIC_SERIES = [82, 88, 96, 103, 99, 114, 126, 137, 133, 152, 168, 184];

const KPIS = [
  { label: "Authority score", value: "58", delta: "+6", tone: "brand" as const, series: [38, 41, 44, 47, 49, 52, 55, 58] },
  { label: "Organic traffic", value: "184.3k", delta: "+21%", tone: "sky" as const, series: [92, 104, 118, 126, 141, 155, 172, 184] },
  { label: "Referring domains", value: "2,140", delta: "+96", tone: "violet" as const, series: [1620, 1710, 1798, 1850, 1922, 1990, 2064, 2140] },
];

const OPPORTUNITIES = [
  { domain: "meridianreview.com", authority: 71, traffic: 184_000, price: 420, country: "US" },
  { domain: "latticedigest.io", authority: 64, traffic: 96_500, price: 295, country: "UK" },
  { domain: "nordicgazette.eu", authority: 58, traffic: 61_200, price: 240, country: "SE" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <Reveal>
              <Eyebrow icon="link">Backlink Services · Publishers · Reporting</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.4rem,5.2vw,3.9rem)] font-semibold leading-[1.04] text-ink-950">
                Backlinks built to
                <span className="relative ml-2 inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                    still count later
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 h-3 w-full text-brand-300"
                    viewBox="0 0 240 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8.5C58 3.5 118 2.5 238 6.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-ink-500">
                Guest posts, editorial links, niche edits and digital PR from publishers screened by
                people, not scripts. Twenty-two link building services, three clear packages each,
                and metrics you can verify before you spend. No PBNs, ever.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/marketplace" size="lg" icon="arrow-right">
                  Explore 8,886 Backlink Gigs
                </Button>
                <Button href="/contact" size="lg" variant="outline" iconLeft="users">
                  Talk to a Link Strategist
                </Button>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <HeroSearch />
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {["HB", "TF", "RA", "JM"].map((initials, index) => (
                      <span
                        key={initials}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[0.7rem] font-semibold text-white shadow-sm"
                        style={{
                          background: ["#098366", "#3f86f5", "#f0a441", "#8367f0"][index],
                        }}
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                  <div>
                    <Stars rating={5} />
                    <p className="mt-0.5 text-[0.78rem] text-ink-500">
                      <strong className="font-semibold text-ink-900">4.9/5</strong> from 1,240
                      verified reviews
                    </p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-line sm:block" />
                <p className="text-[0.82rem] leading-snug text-ink-500">
                  <strong className="font-semibold text-ink-900">38 markets</strong> · 15 native
                  languages
                  <br />
                  Publishers re-scored every quarter
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <HeroPanel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroPanel() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-6 -z-10 rounded-[2.6rem] bg-gradient-to-br from-brand-200/45 via-transparent to-[#3f86f5]/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_90px_-45px_rgba(6,20,25,0.45)]">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-canvas/70 px-5 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5b3b8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f0d3a6]" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-200" />
          </div>
          <p className="text-[0.74rem] font-medium text-ink-400">
            linkslo.com / northloop.io / overview
          </p>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-[0.66rem] font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            Live
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-3 gap-3">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-line bg-white p-3">
                <p className="text-[0.66rem] font-medium uppercase tracking-wide text-ink-400">
                  {kpi.label}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink-950">{kpi.value}</p>
                <div className="mt-1.5 flex items-end justify-between gap-2">
                  <span className="text-[0.68rem] font-semibold text-brand-600">{kpi.delta}</span>
                  <MiniColumns values={kpi.series} tone={kpi.tone} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.8rem] font-semibold text-ink-900">Organic sessions</p>
                <p className="text-[0.7rem] text-ink-400">Last 12 months · non-brand</p>
              </div>
              <div className="flex items-center gap-3 text-[0.68rem] text-ink-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-500" /> Sessions
                </span>
                <span className="rounded-md bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                  +124%
                </span>
              </div>
            </div>
            <div className="mt-3 h-32">
              <AreaTrend values={TRAFFIC_SERIES} uid="hero" height={140} width={520} />
            </div>
          </div>

          <div className="rounded-xl border border-line">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <p className="text-[0.8rem] font-semibold text-ink-900">Matched opportunities</p>
              <span className="text-[0.7rem] font-medium text-brand-700">42 in your niche</span>
            </div>
            <ul className="divide-y divide-line">
              {OPPORTUNITIES.map((item) => (
                <li
                  key={item.domain}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-brand-50/40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink-950 text-[0.62rem] font-bold uppercase text-white">
                    {item.domain.slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8rem] font-medium text-ink-900">{item.domain}</p>
                    <p className="text-[0.68rem] text-ink-400">
                      {item.country} · {formatCompact(item.traffic)} monthly visits
                    </p>
                  </div>
                  <Badge tone="brand">DR {item.authority}</Badge>
                  <span className="hidden text-[0.78rem] font-semibold text-ink-900 sm:block">
                    €{item.price}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[0.68rem] text-ink-400">
                  <span>Q1 Authority Sprint</span>
                  <span className="font-semibold text-ink-700">18 / 25 live</span>
                </div>
                <ProgressBar value={72} className="mt-1.5" />
              </div>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1 rounded-lg bg-ink-950 px-3 py-1.5 text-[0.72rem] font-semibold text-white transition-colors hover:bg-ink-800"
              >
                Browse
                <Icon name="arrow-right" size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating micro-cards */}
      <div className="pointer-events-none absolute -left-4 bottom-16 hidden animate-float-slow rounded-xl border border-line bg-white p-3 shadow-lift sm:block">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon name="check" size={16} />
          </span>
          <div>
            <p className="text-[0.74rem] font-semibold text-ink-900">Placement published</p>
            <p className="text-[0.66rem] text-ink-400">orbitwire.com · DR 82</p>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -right-3 top-24 hidden animate-float-slow rounded-xl border border-line bg-white p-3 shadow-lift md:block"
        style={{ animationDelay: "1.6s" }}
      >
        <p className="text-[0.66rem] font-medium uppercase tracking-wide text-ink-400">
          Keyword movement
        </p>
        <p className="mt-1 font-display text-base font-semibold text-ink-950">
          <Counter value={214} suffix=" terms" /> ↑
        </p>
        <p className="text-[0.66rem] text-brand-600">Top 10 in the last 90 days</p>
      </div>
    </div>
  );
}

export function TrustBar() {
  return (
    <section aria-label="Company credibility" className="border-y border-line bg-canvas">
      <div className="container-x py-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70}>
              <div className="flex flex-col gap-1">
                <dd className="font-display text-[1.9rem] font-semibold leading-none text-ink-950">
                  <Counter
                    value={stat.value}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                    suffix={stat.suffix}
                  />
                </dd>
                <dt className="text-[0.86rem] font-medium text-ink-800">{stat.label}</dt>
                <p className="text-[0.76rem] leading-snug text-ink-400">{stat.detail}</p>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
