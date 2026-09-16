import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/motion";
import { Badge, Button, Eyebrow } from "@/components/ui/primitives";
import { HeroSearch } from "@/components/marketing/HeroSearch";
import { TRUST_STATS } from "@/lib/content";
import { BACKLINK_SERVICES } from "@/lib/backlinks";
import { formatCurrency, formatNumber } from "@/lib/format";

const PREVIEW_SERVICES = BACKLINK_SERVICES.slice(0, 6);

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <Reveal>
              <Eyebrow icon="link">Backlink Services · Marketplace · Reporting</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.4rem,5.2vw,3.9rem)] font-semibold leading-[1.04] text-ink-950">
                Compare backlink services
                <span className="relative ml-2 inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                    before you order
                  </span>
                  <svg className="absolute -bottom-1 left-0 h-3 w-full text-brand-300" viewBox="0 0 240 12" fill="none" aria-hidden="true">
                    <path d="M2 8.5C58 3.5 118 2.5 238 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="mt-2 block text-[clamp(1.1rem,2.2vw,1.4rem)] font-medium text-ink-500">
                  Guest posts, outreach, PR and link-building packages
                </span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-ink-500">
                Compare service scope, target market, package price and delivery window before submitting an order.
                Named guest-post listings also show the available domain metrics and link type for easier comparison.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/marketplace" size="lg" icon="arrow-right">
                  Explore Marketplace
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
              <div className="mt-9 flex flex-wrap gap-2.5 text-[0.8rem] text-ink-600">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5"><Icon name="check" size={13} className="text-brand-600" />Transparent package pricing</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5"><Icon name="globe" size={13} className="text-brand-600" />Industry & country browsing</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5"><Icon name="shield" size={13} className="text-brand-600" />No PBN services</span>
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
      <div className="absolute -inset-6 -z-10 rounded-[2.6rem] bg-gradient-to-br from-brand-200/45 via-transparent to-[#3f86f5]/20 blur-2xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_90px_-45px_rgba(6,20,25,0.45)]">
        <div className="flex items-center gap-3 border-b border-line bg-canvas/70 px-5 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5b3b8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f0d3a6]" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-200" />
          </div>
          <p className="text-[0.74rem] font-medium text-ink-400">linkslo.com / marketplace</p>
          <span className="ml-auto rounded-full bg-brand-50 px-2 py-0.5 text-[0.66rem] font-semibold text-brand-700">Service preview</span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">Browse by service</p>
              <h2 className="mt-1 font-display text-[1.25rem] font-semibold text-ink-950">Compare scope, price and delivery</h2>
            </div>
            <Badge tone="brand">{BACKLINK_SERVICES.length} categories</Badge>
          </div>

          <ul className="mt-5 divide-y divide-line rounded-2xl border border-line">
            {PREVIEW_SERVICES.map((service) => {
              const fromPrice = Math.min(...service.packages.map((pkg) => pkg.price));
              const fastest = Math.min(...service.packages.map((pkg) => pkg.deliveryDays));
              return (
                <li key={service.slug}>
                  <Link href={`/backlinks/${service.slug}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50/40">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-white"><Icon name={service.icon} size={16} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.82rem] font-semibold text-ink-900">{service.nav}</span>
                      <span className="block text-[0.68rem] text-ink-400">3 packages · from {fastest} days</span>
                    </span>
                    <span className="font-display text-[0.9rem] font-semibold text-ink-950">{formatCurrency(fromPrice)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
            <p className="text-[0.76rem] text-ink-500">Browse all service, industry and country filters in the marketplace.</p>
            <Link href="/marketplace" className="ml-4 inline-flex shrink-0 items-center gap-1 text-[0.74rem] font-semibold text-brand-700">Browse <Icon name="arrow-right" size={13} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustBar() {
  return (
    <section aria-label="Marketplace coverage" className="border-y border-line bg-canvas">
      <div className="container-x py-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70}>
              <div className="flex flex-col gap-1">
                <dd className="font-display text-[1.9rem] font-semibold leading-none text-ink-950">
                  <Counter value={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} suffix={stat.suffix} />
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
