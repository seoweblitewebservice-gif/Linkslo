import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon, type GlyphName } from "@/components/ui/Icon";
import { ToolDirectory } from "@/components/seo-tools/ToolDirectory";
import { SEO_TOOLS, SEO_TOOL_CATEGORIES } from "@/lib/seo-tools/catalog";

export const metadata: Metadata = {
  title: "50 Free Technical SEO Tools",
  description: "Use 50 practical technical SEO tools for robots.txt, canonicals, hreflang, redirects, sitemaps, schema, links, metadata and SERP previews.",
  alternates: { canonical: "/tools" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "50 Free Technical SEO Tools | Linkslo",
    description: "Practical SEO checkers, validators, generators and page-analysis tools with transparent results and no fake metrics.",
    type: "website",
  },
};

const LINK_BUILDING_TOOLS: { slug: string; icon: GlyphName; name: string; description: string; badge?: string }[] = [
  { slug: "guest-post-pricing-calculator", icon: "wallet", name: "Guest Post Pricing Calculator", description: "Estimate a practical placement price range from the inputs you provide." },
  { slug: "anchor-text-ratio-checker", icon: "chart", name: "Anchor Text Ratio Checker", description: "Review a pasted anchor list across branded, exact, partial and generic groups." },
  { slug: "link-building-budget-calculator", icon: "sliders", name: "Link Building Budget Calculator", description: "Turn a monthly budget into a transparent placement planning estimate." },
  { slug: "outreach-email-generator", icon: "mail", name: "Guest Post Outreach Email Generator", description: "Build a ready-to-edit outreach draft from your own campaign details." },
  { slug: "da-vs-dr-checker", icon: "gauge", name: "DA vs DR Explained", description: "Compare how third-party authority metrics differ and where both have limitations." },
  { slug: "link-gap-scout", icon: "compass", name: "Link Gap Scout", description: "Illustrative competitor-gap workflow with clearly labeled demonstration figures.", badge: "Demo" },
];

export default function ToolsPage() {
  return <>
    <PageHero
      eyebrow="SEO tools"
      eyebrowIcon="sliders"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}
      title="Practical technical SEO tools"
      description="Check crawl controls, canonicals, redirects, sitemaps, structured data, links, metadata and search previews with transparent logic instead of invented SEO scores."
    >
      <div className="flex flex-wrap gap-2 text-xs text-ink-500"><span className="rounded-full border border-line bg-white px-3 py-1.5">50 technical SEO tools</span><span className="rounded-full border border-line bg-white px-3 py-1.5">No paid SEO API required</span><span className="rounded-full border border-line bg-white px-3 py-1.5">No fake traffic or ranking data</span></div>
    </PageHero>

    <section className="bg-canvas py-12 sm:py-16">
      <div className="container-x">
        <ToolDirectory tools={SEO_TOOLS} categories={SEO_TOOL_CATEGORIES} />
      </div>
    </section>

    <section className="border-t border-line bg-white py-12 sm:py-16">
      <div className="container-x">
        <div className="mb-6 max-w-2xl"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-700">Link building utilities</p><h2 className="mt-1 font-display text-2xl font-semibold text-ink-950">Existing Linkslo campaign tools</h2><p className="mt-2 text-sm leading-6 text-ink-500">These six utilities remain separate from the 50 technical SEO tools above, so there are no duplicate routes or renamed copies.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINK_BUILDING_TOOLS.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-canvas p-5 transition hover:border-brand-300 hover:shadow-soft">
            <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-700"><Icon name={tool.icon} size={17} /></span>{tool.badge && <span className="rounded-full bg-white px-2.5 py-1 text-[0.63rem] font-semibold uppercase tracking-wide text-ink-400">{tool.badge}</span>}</div>
            <h3 className="mt-4 font-display text-base font-semibold text-ink-950 group-hover:text-brand-700">{tool.name}</h3><p className="mt-2 flex-1 text-[0.82rem] leading-6 text-ink-500">{tool.description}</p><span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">Open tool <Icon name="arrow-right" size={13} /></span>
          </Link>)}
        </div>
      </div>
    </section>
  </>;
}
