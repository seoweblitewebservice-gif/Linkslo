import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/primitives";
import { BRAND, LEGAL_PAGES } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

function pageDescription(slug: string) {
  const page = LEGAL_PAGES[slug];
  if (!page) return "";
  return page.sections[0]?.body[0] ?? `${page.title} for Linkslo.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) return { title: "Not found", robots: { index: false, follow: true } };
  return {
    title: page.title,
    description: pageDescription(slug),
    alternates: { canonical: `/legal/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        eyebrowIcon="document"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
        title={page.title}
        description={pageDescription(slug)}
      />

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <div className="space-y-6">
            {page.sections.map((section, index) => (
              <Card key={section.heading} className="p-6 sm:p-7">
                <h2 className="font-display text-[1.15rem] font-semibold text-ink-950">
                  {index + 1}. {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[0.95rem] leading-relaxed text-ink-600">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="text-[0.72rem] uppercase tracking-wide text-ink-400">Last updated</p>
              <p className="text-[0.92rem] font-semibold text-ink-950">{page.updated}</p>
              <p className="mt-4 text-[0.72rem] uppercase tracking-wide text-ink-400">Service</p>
              <p className="text-[0.88rem] text-ink-700">{BRAND.name}</p>
              <p className="mt-4 text-[0.72rem] uppercase tracking-wide text-ink-400">Questions</p>
              <a href={`mailto:${BRAND.email}`} className="text-[0.88rem] font-semibold text-brand-700 hover:underline">
                {BRAND.email}
              </a>

              <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
                {Object.entries(LEGAL_PAGES).map(([key, value]) => (
                  <li key={key}>
                    <Link
                      href={`/legal/${key}`}
                      className={`text-[0.85rem] transition-colors hover:text-brand-700 ${
                        key === slug ? "font-semibold text-brand-700" : "text-ink-500"
                      }`}
                    >
                      {value.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
