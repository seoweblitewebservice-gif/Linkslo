import type { Metadata } from "next";
import { CaseStudyGrid } from "@/components/marketing/Showcase";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/primitives";
import { getCaseStudies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/case-studies" },
  title: "Case studies",
  description:
    "Representative Linkslo engagements showing strategy, duration and measured change in traffic, keywords and referring domains.",
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        eyebrowIcon="chart"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
        title="Programmes, not one-off wins"
        description="Each example below uses clearly labelled sample data. We show the strategy and the shape of the result, including how long it actually took."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" icon="arrow-right">
            Discuss your scenario
          </Button>
          <Button href="/marketplace" variant="outline">
            Browse marketplace
          </Button>
        </div>
      </PageHero>

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x">
          <CaseStudyGrid items={caseStudies} />

          <Reveal delay={150}>
            <div className="mt-12 rounded-2xl border border-line bg-white p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name="shield" size={18} />
                </span>
                <div>
                  <p className="text-[0.98rem] font-semibold text-ink-950">
                    A note on how we present results
                  </p>
                  <p className="mt-2 max-w-3xl text-[0.9rem] leading-relaxed text-ink-500">
                    The figures on this page are representative sample data used for demonstration.
                    Real engagements vary widely by category, starting position and market maturity,
                    and organic performance depends on many factors outside any provider&apos;s
                    control. We never present a single strong month as a programme outcome, and we
                    do not promise ranking positions.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
