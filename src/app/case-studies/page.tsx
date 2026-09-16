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
  title: "Sample Link Building Scenarios",
  description:
    "Representative link-building scenarios showing how a campaign can be structured over time. Figures are sample data for demonstration, not client results.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Sample Link Building Scenarios | Linkslo",
    description:
      "Representative link-building scenarios using clearly labelled sample data for demonstration.",
    type: "website",
  },
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <PageHero
        eyebrow="Sample scenarios"
        eyebrowIcon="chart"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sample Scenarios" }]}
        title="How a link-building programme can develop over time"
        description="Every example below uses representative sample data. These pages illustrate campaign structure and reporting format rather than claiming confidential client results."
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
                    Sample data only
                  </p>
                  <p className="mt-2 max-w-3xl text-[0.9rem] leading-relaxed text-ink-500">
                    The figures on this page are representative demonstration data. Real campaigns
                    vary by category, starting position, content quality, technical SEO, competition
                    and market conditions. Linkslo does not promise ranking positions or a specific
                    traffic outcome.
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
