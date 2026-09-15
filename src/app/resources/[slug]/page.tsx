import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/marketing/Showcase";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Button, Card } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import { renderArticleBody } from "@/lib/markdown";
import { getArticle, getArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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
      authors: [article.author],
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
  const related = all.filter((item) => item.slug !== article.slug).slice(0, 3);
  const { html, toc } = renderArticleBody(article.body);
  const faqs = safeParseFaqs(article.faqs);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedOn,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Linkslo" },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

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
        <div className="flex flex-wrap items-center gap-4 text-[0.82rem] text-ink-500">
          <span className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-[0.7rem] font-semibold text-white">
              {article.author
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            {article.author}
          </span>
          <span>{formatDate(article.publishedOn)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" size={14} />
            {article.readingMinutes} min read
          </span>
        </div>
      </PageHero>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <article className="min-w-0 max-w-2xl">
            {toc.length > 3 && (
              <nav aria-label="Table of contents" className="mb-8 rounded-2xl border border-line bg-canvas p-5">
                <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-ink-400">On this page</p>
                <ol className="mt-3 space-y-1.5">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                      <a href={`#${item.id}`} className="text-[0.86rem] text-brand-700 hover:underline">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />

            {faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">Frequently asked questions</h2>
                <div className="mt-4 space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="rounded-xl border border-line p-4">
                      <p className="text-[0.92rem] font-semibold text-ink-900">{faq.question}</p>
                      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-line bg-canvas p-6">
              <p className="font-display text-[1.05rem] font-semibold text-ink-950">
                Put this into practice
              </p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-500">
                Browse real, price-listed guest post publishers and compare authority, traffic and turnaround
                before you order.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/marketplace" icon="arrow-right">
                  Browse guest post sites
                </Button>
                <Button href="/contact" variant="outline">
                  Ask a strategist
                </Button>
              </div>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="text-[0.88rem] font-semibold text-ink-950">Keep reading</p>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/resources/${item.slug}`}
                      className="block rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <span className="block text-[0.72rem] uppercase tracking-wide text-ink-400">
                        {item.category}
                      </span>
                      <span className="mt-0.5 block text-[0.85rem] font-medium leading-snug text-ink-900">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-ink-950 p-5 text-white">
              <p className="text-[0.9rem] font-semibold">Looking for publisher placements?</p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-300">
                Compare 6,686 real guest post sites by niche, authority, traffic and price.
              </p>
              <Button href="/marketplace" variant="soft" fullWidth className="mt-4">
                Browse guest post sites
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16">
        <div className="container-x">
          <h2 className="font-display text-[1.4rem] font-semibold text-ink-950">Related articles</h2>
          <div className="mt-6">
            <ArticleGrid items={related} columns={3} />
          </div>
        </div>
      </section>
    </>
  );
}
