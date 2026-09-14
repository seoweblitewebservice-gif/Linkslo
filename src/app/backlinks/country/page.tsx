import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, Card } from "@/components/ui/primitives";
import { COUNTRY_PAGES } from "@/lib/backlinks";

export const metadata: Metadata = {
  alternates: { canonical: "/backlinks/country" },
  title: "Backlinks by Country | International Link Building",
  description:
    "Country-specific backlink services for the USA, UK, Canada, Australia, Germany, France, Spain, Italy, Netherlands, India and international campaigns.",
};

export default function CountryIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Backlinks by country"
        eyebrowIcon="globe"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Backlink Services", href: "/backlinks" },
          { label: "By Country" },
        ]}
        title="Native link building in every market you sell in"
        description="We never translate content between markets. Each country gets native writers, local publishers and anchors pointed at the correct language version."
      >
        <Button href="/contact" icon="arrow-right">Plan a multi-market campaign</Button>
      </PageHero>

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRY_PAGES.map((country, index) => (
            <Reveal key={country.slug} delay={(index % 3) * 60}>
              <Card as="article" hover className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-ink-950 px-2 py-1 font-mono text-[0.7rem] font-semibold text-white">
                    {country.flagCode}
                  </span>
                  <span className="text-[0.74rem] text-ink-400">{country.language}</span>
                </div>
                <h2 className="mt-4 font-display text-[1.08rem] font-semibold text-ink-950">
                  <Link href={`/backlinks/country/${country.slug}`} className="transition-colors hover:text-brand-700">
                    {country.country} Backlinks
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-ink-500">{country.summary}</p>
                <Link
                  href={`/backlinks/country/${country.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[0.84rem] font-semibold text-ink-900 transition-colors hover:text-brand-700"
                >
                  View {country.country} guide
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
