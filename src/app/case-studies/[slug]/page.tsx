import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaTrend } from "@/components/charts/Charts";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/motion";
import { Button, Card, SectionHeading } from "@/components/ui/primitives";
import { parseSeries } from "@/lib/format";
import { getCaseStudies, getCaseStudy } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Sample scenario not found", robots: { index: false, follow: true } };
  return {
    title: `Sample scenario — ${study.headline}`,
    description: `Representative demonstration scenario: ${study.startingPoint}`,
    alternates: { canonical: `/case-studies/${study.slug}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `Sample scenario — ${study.headline}`,
      description: "Representative link-building scenario using demonstration data rather than client results.",
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const others = (await getCaseStudies()).filter((item) => item.slug !== study.slug);

  const metrics = [
    { label: "Organic traffic", value: study.trafficChange, suffix: "%", prefix: "+" },
    { label: "Keyword growth", value: study.keywordChange, suffix: "%", prefix: "+" },
    { label: "Referring domains", value: study.referringDomainGrowth, suffix: "", prefix: "+" },
    { label: "Programme length", value: study.durationMonths, suffix: " months", prefix: "" },
  ];

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow={`Sample scenario · ${study.industry} · ${study.market}`}
        eyebrowIcon="chart"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sample Scenarios", href: "/case-studies" },
          { label: study.company },
        ]}
        title={study.headline}
        description={study.startingPoint}
      >
        <dl className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-white/12 bg-white/5 p-4">
              <dt className="text-[0.66rem] uppercase tracking-wide text-ink-400">{metric.label}</dt>
              <dd className="mt-1 font-display text-[1.4rem] font-semibold text-white">
                <Counter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="bg-white py-14 sm:py-18">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">Scenario starting point</h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-600">{study.startingPoint}</p>
            </div>
            <div>
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">Example strategy</h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-600">{study.strategy}</p>
            </div>
            <div>
              <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">Illustrative outcome</h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-600">{study.outcome}</p>
            </div>

            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="text-[0.9rem] font-semibold text-ink-950">Illustrative monthly organic sessions</p>
                <span className="text-[0.74rem] text-ink-400">{study.durationMonths}-month sample</span>
              </div>
              <div className="h-56 p-4">
                <AreaTrend values={parseSeries(study.series)} uid={`study-${study.id}`} height={200} width={720} showDots />
              </div>
            </Card>

            <div className="rounded-2xl border border-line bg-canvas p-6">
              <p className="flex items-center gap-2 text-[0.88rem] font-semibold text-ink-900">
                <Icon name="shield" size={17} className="text-brand-700" />
                Sample data notice
              </p>
              <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-500">
                This page uses representative demonstration figures. It illustrates a possible programme structure and reporting format rather than a specific client&apos;s results. Rankings and traffic are not guaranteed.
              </p>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="text-[0.72rem] uppercase tracking-wide text-ink-400">Sample profile</p>
              <p className="mt-1 font-display text-[1.15rem] font-semibold text-ink-950">{study.company}</p>
              <ul className="mt-4 space-y-2.5 text-[0.87rem] text-ink-600">
                <li className="flex justify-between"><span>Industry</span><span className="font-medium text-ink-900">{study.industry}</span></li>
                <li className="flex justify-between"><span>Market</span><span className="font-medium text-ink-900">{study.market}</span></li>
                <li className="flex justify-between"><span>Duration</span><span className="font-medium text-ink-900">{study.durationMonths} months</span></li>
              </ul>
              <Button href="/contact" fullWidth className="mt-5" icon="arrow-right">Discuss your own brief</Button>
            </Card>

            {others.length > 0 && (
              <Card className="p-6">
                <p className="text-[0.92rem] font-semibold text-ink-950">More sample scenarios</p>
                <ul className="mt-3 space-y-2">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <a href={`/case-studies/${item.slug}`} className="block rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                        <span className="block text-[0.72rem] uppercase tracking-wide text-ink-400">{item.industry}</span>
                        <span className="mt-0.5 block text-[0.85rem] font-medium leading-snug text-ink-900">{item.headline}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Your brief"
              eyebrowIcon="spark"
              title="Plan from your real starting point"
              description="Share your target page, market and constraints so the recommendation can be based on your actual campaign rather than sample figures."
            />
          </Reveal>
          <Reveal delay={100}>
            <LeadForm source={`case-study-${study.slug}`} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
