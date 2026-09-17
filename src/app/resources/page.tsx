import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCover, ArticleGrid } from "@/components/marketing/Showcase";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import { getArticles } from "@/lib/queries";

const RESOURCE_CATEGORIES = [
  "Link Building",
  "Guest Posting",
  "Digital PR",
  "Outreach",
  "Anchor Text",
  "Link Audits",
  "Local SEO",
  "Technical SEO",
  "Industry News",
] as const;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/resources" },
  title: "SEO knowledge hub",
  description:
    "Practical guides on link building, guest posting, publisher vetting, outreach, digital PR and the decisions behind sustainable backlink campaigns.",
  openGraph: {
    title: "SEO Knowledge Hub | Linkslo Resources",
    description:
      "Practical guides on link building, guest posting, publisher vetting, outreach, digital PR and sustainable backlink campaigns.",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ category?: string; q?: string }> };

export default async function ResourcesPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const all = await getArticles();
  const active = category && RESOURCE_CATEGORIES.includes(category as (typeof RESOURCE_CATEGORIES)[number]) ? category : "";
  const query = q?.trim().toLowerCase() ?? "";
  const categoryFiltered = active ? all.filter((article) => article.category === active) : all;
  const filtered = query
    ? categoryFiltered.filter((article) => [article.title, article.excerpt, article.category].join(" ").toLowerCase().includes(query))
    : categoryFiltered;
  const [lead, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Knowledge hub"
        eyebrowIcon="document"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        title="SEO, link building & publisher insights"
        description="Detailed guides written to help you judge opportunities, plan campaigns and make better SEO decisions without relying on metric-only shortcuts."
      >
        <form action="/resources" method="get" className="mt-6 flex max-w-xl gap-2 rounded-xl border border-line bg-white p-2 shadow-sm">
          {active && <input type="hidden" name="category" value={active} />}
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search resources</span>
            <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              name="q"
              defaultValue={q ?? ""}
              type="search"
              placeholder="Search link building, outreach, guest posts…"
              className="h-10 w-full rounded-lg border-0 bg-canvas pl-9 pr-3 text-[0.82rem] text-ink-900 outline-none ring-0 placeholder:text-ink-400"
            />
          </label>
          <button type="submit" className="inline-flex h-10 items-center rounded-lg bg-ink-950 px-4 text-[0.76rem] font-semibold text-white transition-colors hover:bg-brand-700">Search</button>
        </form>
      </PageHero>

      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          <nav aria-label="Article categories" className="flex flex-wrap gap-2">
            <Link href="/resources" className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors ${!active ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600 hover:border-ink-200"}`}>All topics</Link>
            {RESOURCE_CATEGORIES.map((item) => (
              <Link key={item} href={`/resources?category=${encodeURIComponent(item)}`} className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors ${active === item ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600 hover:border-ink-200"}`}>{item}</Link>
            ))}
          </nav>

          {query && (
            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-4 py-3 text-[0.8rem] text-ink-600">
              <span><strong className="text-ink-950">{filtered.length}</strong> result{filtered.length === 1 ? "" : "s"} for “{q}”</span>
              <Link href={active ? `/resources?category=${encodeURIComponent(active)}` : "/resources"} className="font-semibold text-brand-700 hover:underline">Clear search</Link>
            </div>
          )}

          {lead && !query && !active && (
            <Reveal>
              <Card hover className="mt-7 grid overflow-hidden p-0 lg:grid-cols-[1.12fr_0.88fr]">
                <Link href={`/resources/${lead.slug}`} className="block"><ArticleCover item={lead} /></Link>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-2"><Badge tone="brand">Featured</Badge><span className="text-[0.7rem] font-semibold uppercase tracking-[0.11em] text-ink-400">{lead.category}</span></div>
                  <h2 className="mt-4 font-display text-[clamp(1.45rem,3vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink-950">
                    <Link href={`/resources/${lead.slug}`} className="hover:text-brand-700">{lead.title}</Link>
                  </h2>
                  <p className="mt-4 text-[0.91rem] leading-7 text-ink-600">{lead.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] text-ink-400">
                    <span>{lead.author}</span><span>{formatDate(lead.publishedOn)}</span><span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />{lead.readingMinutes} min read</span>
                  </div>
                  <Button href={`/resources/${lead.slug}`} className="mt-6 self-start" icon="arrow-right">Read featured article</Button>
                </div>
              </Card>
            </Reveal>
          )}

          <div className="mt-9 flex items-end justify-between gap-5">
            <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-brand-700">Latest resources</p><h2 className="mt-1 font-display text-[1.35rem] font-semibold text-ink-950">Practical guides and field notes</h2></div>
            <p className="hidden max-w-md text-right text-[0.76rem] leading-5 text-ink-400 sm:block">Built around real questions buyers and SEO teams ask before they spend on links.</p>
          </div>

          <div className="mt-5">
            {filtered.length ? (
              <ArticleGrid items={query || active ? filtered : rest} columns={3} />
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white p-14 text-center">
                <p className="font-display text-[1.05rem] font-semibold text-ink-950">No articles matched that search</p>
                <p className="mt-2 text-[0.88rem] text-ink-500">Try a broader phrase or browse all resource topics.</p>
                <Button href="/resources" variant="outline" className="mt-5">View all articles</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
