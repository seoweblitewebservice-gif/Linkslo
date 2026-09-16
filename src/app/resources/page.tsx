import type { Metadata } from "next";
import Link from "next/link";
import { ArticleGrid } from "@/components/marketing/Showcase";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { RESOURCE_CATEGORIES } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/resources" },
  title: "SEO knowledge hub",
  description:
    "Guides, research and practitioner notes on guest posting, digital PR, publisher vetting, outreach, anchor text and link audits.",
  openGraph: {
    title: "SEO Knowledge Hub | Linkslo Resources",
    description:
      "Guides, research and practitioner notes on guest posting, digital PR, publisher vetting, outreach, anchor text and link audits.",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ResourcesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const all = await getArticles();
  const active = category && RESOURCE_CATEGORIES.includes(category) ? category : "";
  const filtered = active ? all.filter((article) => article.category === active) : all;
  const [lead, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Knowledge hub"
        eyebrowIcon="document"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        title="Field notes from people who run campaigns"
        description="No recycled listicles. Each piece comes from work we have actually done — including the parts that did not go to plan."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x">
          <nav aria-label="Article categories" className="flex flex-wrap gap-2">
            <Link
              href="/resources"
              className={`rounded-full border px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors ${
                !active
                  ? "border-brand-300 bg-brand-50 text-brand-800"
                  : "border-line bg-white text-ink-600 hover:border-ink-200"
              }`}
            >
              All topics
            </Link>
            {RESOURCE_CATEGORIES.map((item) => (
              <Link
                key={item}
                href={`/resources?category=${encodeURIComponent(item)}`}
                className={`rounded-full border px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors ${
                  active === item
                    ? "border-brand-300 bg-brand-50 text-brand-800"
                    : "border-line bg-white text-ink-600 hover:border-ink-200"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {lead && !active && (
            <Reveal>
              <Card hover className="mt-8 grid gap-0 overflow-hidden lg:grid-cols-2">
                <div className="relative min-h-[15rem] overflow-hidden bg-ink-950 p-8">
                  <div className="ink-aurora absolute inset-0 opacity-90" aria-hidden="true" />
                  <div className="relative flex h-full flex-col justify-between">
                    <Badge tone="brand">Featured</Badge>
                    <div>
                      <p className="text-[0.76rem] uppercase tracking-[0.16em] text-brand-300">
                        {lead.category}
                      </p>
                      <p className="mt-3 font-display text-[1.6rem] font-semibold leading-tight text-white">
                        {lead.title}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8">
                  <p className="text-[0.95rem] leading-relaxed text-ink-600">{lead.excerpt}</p>
                  <div className="mt-6 flex items-center gap-4 text-[0.78rem] text-ink-400">
                    <span>{lead.author}</span>
                    <span>{formatDate(lead.publishedOn)}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="clock" size={13} />
                      {lead.readingMinutes} min
                    </span>
                  </div>
                  <Button href={`/resources/${lead.slug}`} className="mt-6 self-start" icon="arrow-right">
                    Read Article
                  </Button>
                </div>
              </Card>
            </Reveal>
          )}

          <div className="mt-8">
            {filtered.length ? (
              <ArticleGrid items={active ? filtered : rest} />
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white p-14 text-center">
                <p className="font-display text-[1.05rem] font-semibold text-ink-950">
                  Nothing published in this topic yet
                </p>
                <p className="mt-2 text-[0.9rem] text-ink-500">
                  We publish two to four pieces a month. Subscribe below to get the next one.
                </p>
                <Button href="/resources" variant="outline" className="mt-5">
                  View all topics
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
