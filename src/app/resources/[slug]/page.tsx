import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCover, ArticleGrid } from "@/components/marketing/Showcase";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Button, Card } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import { renderArticleBody } from "@/lib/markdown";
import { getArticle, getArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type Reference = { label: string; href: string; note: string };

const GOOGLE_SEARCH_ESSENTIALS: Reference = {
  label: "Google Search Essentials",
  href: "https://developers.google.com/search/docs/essentials",
  note: "Google's baseline guidance for creating search-friendly websites.",
};
const GOOGLE_SPAM_POLICIES: Reference = {
  label: "Google Search spam policies",
  href: "https://developers.google.com/search/docs/essentials/spam-policies",
  note: "Useful context when evaluating manipulative link patterns and scaled tactics.",
};
const GOOGLE_LINK_QUALIFICATION: Reference = {
  label: "Qualify outbound links",
  href: "https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links",
  note: "Google's documentation on rel=sponsored, rel=nofollow and user-generated links.",
};
const FTC_ENDORSEMENTS: Reference = {
  label: "FTC endorsements, influencers and reviews guidance",
  href: "https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews",
  note: "Disclosure guidance for paid endorsements, sponsored relationships and reviews.",
};

function referencesFor(category: string): Reference[] {
  if (category === "Guest Posting") return [GOOGLE_LINK_QUALIFICATION, GOOGLE_SPAM_POLICIES, FTC_ENDORSEMENTS];
  if (category === "Link Building" || category === "Anchor Text" || category === "Link Audits") return [GOOGLE_SEARCH_ESSENTIALS, GOOGLE_SPAM_POLICIES, GOOGLE_LINK_QUALIFICATION];
  if (category === "Outreach" || category === "Digital PR") return [FTC_ENDORSEMENTS, GOOGLE_LINK_QUALIFICATION];
  if (category === "Technical SEO" || category === "Local SEO") return [GOOGLE_SEARCH_ESSENTIALS, GOOGLE_SPAM_POLICIES];
  return [GOOGLE_SEARCH_ESSENTIALS];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found", robots: { index: false, follow: true } };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/resources/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedOn,
      authors: ["Linkslo Editorial Team"],
    },
  };
}

function safeParseFaqs(raw: string | undefined): { question: string; answer: string }[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const all = await getArticles();
  const sameCategory = all.filter((item) => item.slug !== article.slug && item.category === article.category);
  const others = all.filter((item) => item.slug !== article.slug && item.category !== article.category);
  const related = [...sameCategory, ...others].slice(0, 3);
  const { html, toc } = renderArticleBody(article.body);
  const faqs = safeParseFaqs(article.faqs);
  const quickSections = toc.filter((item) => item.level === 2).slice(0, 3);
  const references = referencesFor(article.category);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedOn,
    author: { "@type": "Organization", name: "Linkslo Editorial Team" },
    publisher: { "@type": "Organization", name: "Linkslo", url: "https://www.linkslo.com" },
    mainEntityOfPage: `https://www.linkslo.com/resources/${article.slug}`,
  };

  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.linkslo.com" },
      { "@type": "ListItem", position: 2, name: "Resources", item: "https://www.linkslo.com/resources" },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category,
        item: `https://www.linkslo.com/resources?category=${encodeURIComponent(article.category)}`,
      },
      { "@type": "ListItem", position: 4, name: article.title, item: `https://www.linkslo.com/resources/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <PageHero
        eyebrow={article.category}
        eyebrowIcon="document"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: article.category, href: `/resources?category=${encodeURIComponent(article.category)}` },
        ]}
        title={article.title}
        description={article.excerpt}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-ink-500">
          <span className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[0.62rem] font-bold text-brand-800">LE</span>
            <strong className="font-semibold text-ink-800">Linkslo Editorial Team</strong>
          </span>
          <span>{formatDate(article.publishedOn)}</span>
          <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />{article.readingMinutes} min read</span>
        </div>
      </PageHero>

      <main className="bg-canvas py-10 sm:py-14 lg:py-16">
        <div className="container-x">
          <article className="mx-auto max-w-3xl">
            <Card className="overflow-hidden p-0">
              <ArticleCover item={article} />
            </Card>

            <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6" aria-labelledby="article-in-short">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Icon name="spark" size={14} /></span>
                <h2 id="article-in-short" className="font-display text-[0.98rem] font-semibold text-ink-950">In short</h2>
              </div>
              <p className="mt-3 text-[0.9rem] leading-6 text-ink-600">{article.excerpt}</p>
              {quickSections.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {quickSections.map((item) => (
                    <li key={item.id} className="flex gap-2.5 text-[0.84rem] leading-6 text-ink-600">
                      <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      <a href={`#${item.id}`} className="hover:text-brand-700 hover:underline">{item.text}</a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="article-content mt-10" dangerouslySetInnerHTML={{ __html: html }} />

            {faqs.length > 0 && (
              <section className="mt-12" aria-labelledby="article-faqs">
                <h2 id="article-faqs" className="font-display text-[1.55rem] font-semibold tracking-tight text-ink-950">Frequently asked questions</h2>
                <div className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group p-5 open:bg-canvas/50">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.94rem] font-semibold text-ink-950">
                        <span>{faq.question}</span>
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-ink-500 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 max-w-2xl text-[0.88rem] leading-7 text-ink-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-6" aria-labelledby="useful-references">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-brand-700">External reading</p>
              <h2 id="useful-references" className="mt-1 font-display text-[1.15rem] font-semibold text-ink-950">Useful references</h2>
              <p className="mt-2 text-[0.82rem] leading-6 text-ink-500">These are primary or regulator sources worth checking when a decision depends on search policy, disclosure or link treatment.</p>
              <ul className="mt-4 space-y-3">
                {references.map((reference) => (
                  <li key={reference.href} className="rounded-xl bg-canvas p-4">
                    <a href={reference.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-brand-700 hover:underline">{reference.label}<Icon name="arrow-up-right" size={13} /></a>
                    <p className="mt-1 text-[0.78rem] leading-5 text-ink-500">{reference.note}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6" aria-label="About the author">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[0.7rem] font-bold text-brand-800">LE</span>
              <div>
                <p className="font-display text-[0.95rem] font-semibold text-ink-950">Linkslo Editorial Team</p>
                <p className="mt-1 text-[0.78rem] leading-5 text-ink-500">Practical guides on publisher evaluation, outreach, link building and the decisions that sit behind a sustainable campaign.</p>
              </div>
            </section>

            <section className="mt-5 rounded-2xl bg-ink-950 p-6 text-white shadow-lg sm:p-7">
              <p className="font-display text-[1.05rem] font-semibold">Want to compare relevant options?</p>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-6 text-ink-300">Browse current backlink services and marketplace listings, compare scope and pricing, then choose only the placements that make sense for your page.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/marketplace" icon="arrow-right">Browse marketplace</Button>
                <Button href="/backlinks" variant="soft">View backlink services</Button>
              </div>
            </section>
          </article>
        </div>
      </main>

      <section className="border-t border-line bg-white py-14 sm:py-16">
        <div className="container-x">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-brand-700">Related reading</p><h2 className="mt-1 font-display text-[1.45rem] font-semibold text-ink-950">Keep reading</h2></div>
              <Link href="/resources" className="text-[0.78rem] font-semibold text-brand-700 hover:underline">All articles →</Link>
            </div>
            <div className="mt-6"><ArticleGrid items={related} columns={3} /></div>
          </div>
        </div>
      </section>
    </>
  );
}
