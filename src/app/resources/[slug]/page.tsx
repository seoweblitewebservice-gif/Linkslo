import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/marketing/Showcase";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Button, Card } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const all = await getArticles();
  const related = all.filter((item) => item.slug !== article.slug).slice(0, 3);
  const paragraphs = article.body.split("\n\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedOn,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Linkslo" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
          <article className="max-w-2xl">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-[1.02rem] leading-[1.75] text-ink-700 ${index > 0 ? "mt-5" : ""} ${
                  index === 0 ? "text-[1.1rem] text-ink-800" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-10 rounded-2xl border border-line bg-canvas p-6">
              <p className="font-display text-[1.05rem] font-semibold text-ink-950">
                Put this into practice
              </p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-500">
                Run an Link Gap Scout analysis on one of your commercial pages, then compare the
                content gaps against your current roadmap.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/tools/link-gap-scout" icon="arrow-right">
                  Open Link Gap Scout
                </Button>
                <Button href="/contact" variant="outline">
                  Ask a strategist
                </Button>
              </div>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="text-[0.88rem] font-semibold text-ink-950">In this series</p>
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
              <p className="text-[0.9rem] font-semibold">Monthly research digest</p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-300">
                One email a month with new research, teardowns and product notes.
              </p>
              <Button href="/login" variant="soft" fullWidth className="mt-4">
                Create free account
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16">
        <div className="container-x">
          <h2 className="font-display text-[1.4rem] font-semibold text-ink-950">Keep reading</h2>
          <div className="mt-6">
            <ArticleGrid items={related} columns={3} />
          </div>
        </div>
      </section>
    </>
  );
}
