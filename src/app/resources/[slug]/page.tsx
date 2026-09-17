import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/marketing/Showcase";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedOn,
    author: { "@type": article.author === "Linkslo Editorial Team" ? "Organization" : "Person", name: article.author },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <header className="relative overflow-hidden border-b border-cyan-300/20 bg-gradient-to-br from-[#0872b8] via-[#0794d0] to-[#18b5e8] text-white">
        <div className="absolute -right-10 -top-16 select-none font-display text-[12rem] font-black leading-none text-white/[0.08]" aria-hidden="true">“</div>
        <div className="container-x relative py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <nav className="flex flex-wrap items-center gap-2 text-[0.73rem] font-medium text-white/70" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/resources" className="hover:text-white">Resources</Link>
              <span>/</span>
              <Link href={`/resources?category=${encodeURIComponent(article.category)}`} className="hover:text-white">{article.category}</Link>
            </nav>

            <p className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-cyan-100">{article.category}</p>
            <h1 className="mt-3 max-w-[19ch] font-display text-[clamp(2rem,5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.035em] text-white">
              {article.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[1rem] leading-7 text-white/80 sm:text-[1.06rem]">
              {article.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.78rem] text-white/80">
              <span className="inline-flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-[0.65rem] font-bold text-emerald-950">
                  {initials(article.author)}
                </span>
                <span>
                  <strong className="block text-white">{article.author}</strong>
                  <span className="text-[0.67rem] text-white/60">Linkslo editorial</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={13} />{formatDate(article.publishedOn)}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />{article.readingMinutes} min read</span>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-[#f6f8fb] py-10 sm:py-14 lg:py-16">
        <div className="container-x">
          <article className="mx-auto max-w-3xl">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="article-in-short">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Icon name="spark" size={14} /></span>
                <h2 id="article-in-short" className="font-display text-[0.98rem] font-semibold text-ink-950">In short</h2>
              </div>
              <p className="mt-3 text-[0.9rem] leading-6 text-ink-600">{article.excerpt}</p>
              {quickSections.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {quickSections.map((item) => (
                    <li key={item.id} className="flex gap-2.5 text-[0.84rem] leading-6 text-ink-600">
                      <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <a href={`#${item.id}`} className="hover:text-brand-700 hover:underline">{item.text}</a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="article-content mt-10 rounded-none bg-transparent" dangerouslySetInnerHTML={{ __html: html }} />

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

            <section className="mt-10 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-label="About the author">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[0.72rem] font-bold text-emerald-950">
                {initials(article.author)}
              </span>
              <div>
                <p className="font-display text-[0.95rem] font-semibold text-ink-950">{article.author}</p>
                <p className="mt-1 text-[0.78rem] leading-5 text-ink-500">
                  Research-led writing for Linkslo about link building, publisher evaluation, outreach and practical SEO decisions.
                </p>
              </div>
            </section>

            <section className="mt-5 rounded-2xl bg-[#07111f] p-6 text-white shadow-lg sm:p-7">
              <p className="font-display text-[1.05rem] font-semibold">Want to compare relevant options?</p>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-6 text-slate-300">
                Browse current backlink services and marketplace listings, compare scope and pricing, then choose only the placements that make sense for your page.
              </p>
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
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-brand-700">Related reading</p>
                <h2 className="mt-1 font-display text-[1.45rem] font-semibold text-ink-950">Keep reading</h2>
              </div>
              <Link href="/resources" className="text-[0.78rem] font-semibold text-brand-700 hover:underline">All articles →</Link>
            </div>
            <div className="mt-6">
              <ArticleGrid items={related} columns={3} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
