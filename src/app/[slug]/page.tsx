import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolRunner } from "@/components/seo-tools/ToolRunner";
import { PageHero } from "@/components/site/PageHero";
import { getSeoTool, SEO_TOOLS } from "@/lib/seo-tools/catalog";
import { getSeoToolEditorial } from "@/lib/seo-tools/editorial";
import { getSeoToolDepth } from "@/lib/seo-tools/depth";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_TOOLS.map((tool) => ({ slug: tool.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getSeoTool(slug);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: true } };
  return {
    title: `${tool.name} - Free Technical SEO Tool`,
    description: tool.metaDescription,
    alternates: { canonical: `/${tool.slug}/` },
    robots: { index: true, follow: true },
    openGraph: { title: `${tool.name} | Linkslo`, description: tool.metaDescription, type: "website", url: `/${tool.slug}/` },
    twitter: { card: "summary", title: `${tool.name} | Linkslo`, description: tool.metaDescription },
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-10"><h2 className="font-display text-[1.45rem] font-semibold tracking-tight text-ink-950">{title}</h2><div className="mt-4 space-y-4 text-[0.94rem] leading-7 text-ink-600">{children}</div></section>;
}

export default async function SeoToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getSeoTool(slug);
  if (!tool) notFound();
  const editorial = getSeoToolEditorial(tool);
  const depth = getSeoToolDepth(tool);
  if (!editorial || !depth) notFound();
  const related = tool.related.map((item) => getSeoTool(item)).filter(Boolean);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: editorial.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.linkslo.com/" },
      { "@type": "ListItem", position: 2, name: "SEO Tools", item: "https://www.linkslo.com/tools" },
      { "@type": "ListItem", position: 3, name: tool.name, item: `https://www.linkslo.com/${tool.slug}/` },
    ],
  };
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tool.name,
    description: tool.metaDescription,
    url: `https://www.linkslo.com/${tool.slug}/`,
    isPartOf: { "@type": "WebSite", name: "Linkslo", url: "https://www.linkslo.com/" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

    <PageHero
      eyebrow={tool.category}
      eyebrowIcon="sliders"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "SEO Tools", href: "/tools" }, { label: tool.name }]}
      title={tool.name}
      description={tool.summary}
    >
      <div className="flex flex-wrap gap-2">
        {tool.relatedEntities.slice(0, 5).map((entity) => <span key={entity} className="rounded-full border border-line bg-white px-3 py-1.5 text-[0.72rem] font-medium text-ink-600">{entity}</span>)}
      </div>
    </PageHero>

    <main className="bg-canvas py-10 sm:py-14">
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <ToolRunner tool={tool} />

          <article className="mx-auto max-w-3xl pb-6 pt-10 sm:pt-14">
            <section className="rounded-2xl border border-brand-200 bg-brand-50/70 p-5 sm:p-6" aria-labelledby="quick-answer-heading">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-700">Quick answer</p>
              <h2 id="quick-answer-heading" className="mt-1 font-display text-[1.2rem] font-semibold text-ink-950">What this tool is useful for</h2>
              <p className="mt-3 text-[0.92rem] leading-7 text-ink-700">{depth.quickAnswer}</p>
            </section>

            <Section title={`What is ${tool.name}?`}><p>{editorial.definition}</p><p>{editorial.whyItMatters}</p></Section>
            <Section title={`How to use the ${tool.name}`}><ol className="space-y-3">{editorial.howToUse.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">{index + 1}</span><span>{item}</span></li>)}</ol></Section>
            <Section title="Understanding the results"><ul className="space-y-3">{editorial.interpretation.map((item) => <li key={item} className="flex gap-2.5"><span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" /><span>{item}</span></li>)}</ul></Section>
            <Section title="Common problems"><ul className="space-y-3">{editorial.commonProblems.map((item) => <li key={item} className="flex gap-2.5"><span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /><span>{item}</span></li>)}</ul></Section>
            <Section title="How to fix them"><ul className="space-y-3">{editorial.fixes.map((item) => <li key={item} className="flex gap-2.5"><span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /><span>{item}</span></li>)}</ul></Section>
            <Section title={`${tool.primaryEntity} best practices`}><ul className="space-y-3">{editorial.bestPractices.map((item) => <li key={item} className="flex gap-2.5"><span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" /><span>{item}</span></li>)}</ul></Section>

            <Section title="Professional SEO notes"><p>{depth.professionalNotes}</p></Section>

            <Section title="Direct answers"><div className="grid gap-3">{depth.aeos.map((item) => <div key={item.question} className="rounded-2xl border border-line bg-white p-5"><h3 className="font-display text-[0.98rem] font-semibold text-ink-950">{item.question}</h3><p className="mt-2 text-[0.88rem] leading-7 text-ink-600">{item.answer}</p></div>)}</div></Section>

            <Section title="Practical example"><div className="rounded-2xl border border-line bg-white p-5 text-ink-700">{editorial.example}</div></Section>
            <Section title="What this tool cannot tell you"><p>{editorial.limitations}</p></Section>

            <Section title="Frequently asked questions"><div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">{editorial.faqs.map((faq) => <details key={faq.question} className="group p-5 open:bg-canvas/50"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink-950"><span>{faq.question}</span><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-ink-500 transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 text-[0.88rem] leading-7 text-ink-600">{faq.answer}</p></details>)}</div></Section>

            <Section title="Related SEO tools"><div className="grid gap-3 sm:grid-cols-2">{related.map((item) => item && <Link key={item.slug} href={`/${item.slug}/`} className="rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-soft"><p className="font-semibold text-ink-950">{item.name}</p><p className="mt-1 text-[0.8rem] leading-5 text-ink-500">{item.summary}</p></Link>)}</div></Section>
          </article>
        </div>
      </div>
    </main>
  </>;
}
