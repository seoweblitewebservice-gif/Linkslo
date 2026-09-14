import Link from "next/link";
import { BarSeries, DonutGauge, ProgressBar } from "@/components/charts/Charts";
import { Icon } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/motion";
import { Button, Card, SectionHeading } from "@/components/ui/primitives";
import { BENEFITS, PROCESS_STEPS } from "@/lib/content";
import { BACKLINK_SERVICES, startingPrice } from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";

const ACCENTS = {
  brand: "bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white",
  sky: "bg-[#eef4fe] text-[#2563c9] group-hover:bg-[#3f86f5] group-hover:text-white",
  amber: "bg-[#fdf4e6] text-[#b8770f] group-hover:bg-[#f0a441] group-hover:text-white",
  violet: "bg-[#f2eefe] text-[#5a3fd0] group-hover:bg-[#8367f0] group-hover:text-white",
} as const;

const FEATURED_SLUGS = [
  "guest-post-backlinks",
  "editorial-backlinks",
  "niche-edit-backlinks",
  "contextual-backlinks",
  "digital-pr-backlinks",
  "authority-backlinks",
  "monthly-link-building",
  "premium-link-building",
];

const FEATURED = FEATURED_SLUGS.map(
  (slug) => BACKLINK_SERVICES.find((service) => service.slug === slug)!,
).filter(Boolean);

export function ServicesGrid() {
  return (
    <section id="services" className="bg-white py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Backlink services"
              eyebrowIcon="link"
              title="Every backlink type, one quality standard"
              description="We only build links. Twenty-two consolidated services across placements, outreach, digital PR, local citations and ongoing campaigns — each with three clear package sizes."
            />
            <Button href="/backlinks" variant="outline" icon="arrow-right" className="shrink-0">
              View all services
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURED.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 4) * 70}>
              <Card
                as="article"
                hover
                className="group flex h-full flex-col p-6 transition-colors"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ${ACCENTS[service.accent]}`}
                >
                  <Icon name={service.icon} size={21} />
                </span>
                <h3 className="mt-4 font-display text-[1.08rem] font-semibold text-ink-950">
                  {service.nav}
                </h3>
                <p className="mt-1 text-[0.78rem] font-medium uppercase tracking-[0.06em] text-brand-700">
                  {service.group}
                </p>
                <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-ink-500">
                  {service.summary}
                </p>
                <dl className="mt-5 flex items-end justify-between rounded-xl bg-canvas px-3.5 py-3">
                  <div>
                    <dt className="text-[0.66rem] uppercase tracking-[0.08em] text-ink-400">
                      Starting from
                    </dt>
                    <dd className="mt-0.5 font-display text-[1.15rem] font-semibold text-ink-950">
                      {formatCurrency(startingPrice(service))}
                    </dd>
                  </div>
                  <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[0.66rem] font-medium text-ink-500">
                    3 packages
                  </span>
                </dl>
                <Link
                  href={`/backlinks/${service.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-ink-900 transition-colors hover:text-brand-700"
                >
                  Learn more
                  <Icon name="arrow-right" size={15} />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section className="border-y border-line bg-canvas py-20 sm:py-24">
      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Why teams choose Linkslo"
                eyebrowIcon="shield"
                title="Quality control you can inspect, not just trust"
                description="We built the platform we wanted as practitioners: fewer questionable domains, clearer numbers, and a workflow that survives an agency's busiest month."
              />
            </Reveal>

            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {BENEFITS.map((benefit, index) => (
                <Reveal key={benefit.title} delay={index * 60} as="li">
                  <div className="flex gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-white text-brand-700 shadow-soft">
                      <Icon name={benefit.icon} size={18} />
                    </span>
                    <div>
                      <h3 className="text-[0.96rem] font-semibold text-ink-950">{benefit.title}</h3>
                      <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-500">
                        {benefit.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={120}>
            <QualityPanel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const SCREENING_CHECKS = [
  { label: "Traffic distribution", score: 94, note: "Spread across 1,280 URLs" },
  { label: "Topical relevance", score: 88, note: "Category match verified" },
  { label: "Outbound link hygiene", score: 79, note: "3.2 external links / post" },
  { label: "Editorial continuity", score: 91, note: "Publishing since 2016" },
];

function QualityPanel() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-5 -z-10 rounded-[2.4rem] bg-gradient-to-tr from-brand-200/40 via-transparent to-[#8367f0]/15 blur-2xl"
        aria-hidden="true"
      />
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-[0.9rem] font-semibold text-ink-950">Publisher screening report</p>
            <p className="text-[0.74rem] text-ink-400">meridianreview.com · re-scored 11 days ago</p>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-semibold text-brand-700">
            Approved
          </span>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="flex flex-col items-center gap-2">
            <DonutGauge value={88} label="88" caption="Quality" />
            <p className="text-[0.72rem] text-ink-400">11-point review</p>
          </div>
          <ul className="space-y-3.5">
            {SCREENING_CHECKS.map((check) => (
              <li key={check.label}>
                <div className="flex items-center justify-between text-[0.82rem]">
                  <span className="font-medium text-ink-800">{check.label}</span>
                  <span className="font-mono text-[0.78rem] text-ink-500">{check.score}</span>
                </div>
                <ProgressBar value={check.score} className="mt-1.5" />
                <p className="mt-1 text-[0.7rem] text-ink-400">{check.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-line bg-canvas/60 p-5">
          <div>
            <p className="text-[0.66rem] uppercase tracking-wide text-ink-400">Domains reviewed</p>
            <p className="font-display text-lg font-semibold text-ink-950">
              <Counter value={51800} suffix="+" />
            </p>
          </div>
          <div>
            <p className="text-[0.66rem] uppercase tracking-wide text-ink-400">Rejection rate</p>
            <p className="font-display text-lg font-semibold text-ink-950">
              <Counter value={37} suffix="%" />
            </p>
          </div>
          <div>
            <p className="text-[0.66rem] uppercase tracking-wide text-ink-400">Re-score cycle</p>
            <p className="font-display text-lg font-semibold text-ink-950">90 days</p>
          </div>
        </div>

        <div className="border-t border-line p-5">
          <div className="flex items-center justify-between">
            <p className="text-[0.82rem] font-semibold text-ink-900">Inventory added per quarter</p>
            <span className="text-[0.72rem] text-ink-400">Last 8 quarters</span>
          </div>
          <BarSeries
            className="mt-3"
            height={86}
            values={[620, 740, 810, 905, 980, 1120, 1340, 1810]}
            labels={["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"]}
          />
        </div>
      </Card>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            eyebrowIcon="compass"
            title="From first domain to measurable movement in four steps"
            description="No lengthy onboarding. Most teams place their first campaign within a day of creating an account."
            className="mx-auto"
          />
        </Reveal>

        <div className="relative mt-14">
          <div
            className="absolute left-6 top-4 hidden h-[calc(100%-2rem)] w-px bg-line sm:block lg:left-0 lg:top-[2.35rem] lg:h-px lg:w-full"
            aria-hidden="true"
          />
          <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 90} as="li">
                <div className="relative flex gap-5 lg:block">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-brand-700 shadow-soft transition-transform duration-300 hover:-translate-y-0.5">
                    <Icon name={step.icon} size={21} />
                  </div>
                  <div className="lg:mt-6">
                    <p className="font-mono text-[0.75rem] font-semibold tracking-[0.18em] text-brand-600">
                      {step.number}
                    </p>
                    <h3 className="mt-1.5 font-display text-[1.08rem] font-semibold text-ink-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-[0.88rem] leading-relaxed text-ink-500">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={200}>
          <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-line bg-canvas px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-display text-[1.05rem] font-semibold text-ink-950">
                Prefer someone else to run it?
              </p>
              <p className="mt-1 text-[0.88rem] text-ink-500">
                Monthly link building includes strategy, anchor management and a named strategist on
                every review call.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/backlinks/monthly-link-building" variant="outline">
                Monthly Link Building
              </Button>
              <Button href="/contact" icon="arrow-right">
                Book a consultation
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 sm:py-24">
      <div className="ink-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionHeading
              align="center"
              tone="dark"
              eyebrow="Start building"
              eyebrowIcon="spark"
              title="Turn relevant backlinks into durable authority"
              description="Build your next link campaign with screened publishers, clear package scope and a strategist who reviews relevance before outreach begins."
              className="mx-auto"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/marketplace" size="lg" icon="arrow-right">
                Start Exploring
              </Button>
              <Button
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:border-brand-400/60 hover:bg-white/10 hover:text-white"
              >
                Book a Consultation
              </Button>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[0.82rem] text-ink-300">
              {["No platform fee to browse", "Cancel campaigns any time", "Replacement guarantee on links"].map(
                (item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <Icon name="check" size={15} className="text-brand-400" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
