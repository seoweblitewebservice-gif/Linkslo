import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, Card } from "@/components/ui/primitives";
import { INDUSTRY_PAGES } from "@/lib/backlinks";

export const metadata: Metadata = {
  alternates: { canonical: "/backlinks/industry" },
  title: "Backlinks by Industry | Sector Link Building",
  description:
    "Backlink services for 18 industries including SaaS, finance, crypto, e-commerce, health, legal and travel. Sector-specific publishers, anchors and opportunities.",
};

export default function IndustryIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Backlinks by industry"
        eyebrowIcon="layers"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Backlink Services", href: "/backlinks" },
          { label: "By Industry" },
        ]}
        title="Link building shaped around your sector"
        description="Publishers, anchor conventions and realistic opportunities differ enormously between industries. Each page below covers what actually works in that market."
      >
        <Button href="/contact" icon="arrow-right">Discuss your industry</Button>
      </PageHero>

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_PAGES.map((industry, index) => (
            <Reveal key={industry.slug} delay={(index % 3) * 60}>
              <Card as="article" hover className="flex h-full flex-col p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name={industry.icon} size={19} />
                </span>
                <h2 className="mt-4 font-display text-[1.08rem] font-semibold text-ink-950">
                  <Link href={`/backlinks/industry/${industry.slug}`} className="transition-colors hover:text-brand-700">
                    {industry.name} Backlinks
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-ink-500">{industry.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {industry.publisherTypes.slice(0, 2).map((type) => (
                    <span key={type} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[0.7rem] text-ink-500">
                      {type}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/backlinks/industry/${industry.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[0.84rem] font-semibold text-ink-900 transition-colors hover:text-brand-700"
                >
                  View {industry.name} guide
                  <Icon name="arrow-right" size={14} />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
