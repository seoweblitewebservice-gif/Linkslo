import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon, type GlyphName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Free Link Building & SEO Tools",
  description:
    "Free calculators and checkers for guest post pricing, anchor text ratios, link building budgets, outreach emails and DA vs DR — built by the Linkslo team.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Link Building & SEO Tools | Linkslo",
    description:
      "Free calculators and checkers for guest post pricing, anchor text ratios, link building budgets, outreach emails and DA vs DR.",
    type: "website",
  },
};

const TOOLS: { slug: string; icon: GlyphName; name: string; description: string; badge?: string }[] = [
  {
    slug: "guest-post-pricing-calculator",
    icon: "wallet",
    name: "Guest Post Pricing Calculator",
    description: "Enter a site's authority, traffic and niche to get a fair price range before you order or quote a placement.",
  },
  {
    slug: "anchor-text-ratio-checker",
    icon: "chart",
    name: "Anchor Text Ratio Checker",
    description: "Paste your backlink anchor list to see your branded, exact-match, partial-match and generic split at a glance.",
  },
  {
    slug: "link-building-budget-calculator",
    icon: "sliders",
    name: "Link Building Budget Calculator",
    description: "Turn a monthly budget into a realistic placement count and tier split across guest posts and niche edits.",
  },
  {
    slug: "outreach-email-generator",
    icon: "mail",
    name: "Guest Post Outreach Email Generator",
    description: "Answer four quick questions to generate a ready-to-edit outreach email for pitching a publisher.",
  },
  {
    slug: "da-vs-dr-checker",
    icon: "gauge",
    name: "DA vs DR Explained",
    description: "See how Domain Authority and Domain Rating differ, what each is good for, and where both fall short.",
  },
  {
    slug: "link-gap-scout",
    icon: "compass",
    name: "Link Gap Scout (Demo)",
    description: "A representative walkthrough of how a competitor backlink-gap review is structured, using illustrative figures.",
    badge: "Demo",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tools"
        eyebrowIcon="sliders"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}
        title="Free link building & SEO tools"
        description="Small, focused calculators built from the same pricing and quality logic Linkslo uses internally — no signup required."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, index) => (
              <Reveal key={tool.slug} delay={index * 60}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="card-hover flex h-full flex-col rounded-2xl border border-line bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon name={tool.icon} size={19} />
                    </span>
                    {tool.badge && (
                      <span className="rounded-full bg-canvas px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-wide text-ink-400">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">{tool.name}</p>
                  <p className="mt-2 flex-1 text-[0.87rem] leading-relaxed text-ink-500">{tool.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-brand-700">
                    Open tool
                    <Icon name="arrow-right" size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
