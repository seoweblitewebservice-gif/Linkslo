import Link from "next/link";
import type { Metadata } from "next";
import { BudgetCalculator } from "@/components/tools/BudgetCalculator";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Link Building Budget Calculator — Free Tool",
  description:
    "Turn a monthly link building budget into a realistic number of guest posts and niche edits, split by your campaign goal.",
  alternates: { canonical: "/tools/link-building-budget-calculator" },
  openGraph: {
    title: "Link Building Budget Calculator | Linkslo",
    description: "Turn a monthly budget into a realistic placement count and tier split.",
    type: "website",
  },
};

const faqs = [
  {
    q: "Why does the guest post/niche edit split change with my goal?",
    a: "A brand-new page with no existing links benefits more from fresh, purpose-written guest posts that establish initial relevance. A page that already has some coverage can stretch a budget further with lower-cost niche edits added to already-established, relevant articles.",
  },
  {
    q: "Are these average prices accurate for every site?",
    a: "They're rough averages across a wide range of authority and traffic levels. A single high-authority placement can cost far more than several smaller ones combined — use this as a planning starting point, then check real listings for your specific niche.",
  },
  {
    q: "Should I spend the whole budget every month?",
    a: "Not necessarily. A steadier, smaller monthly cadence often reads more naturally than one large burst, and gives you room to evaluate results before committing more budget.",
  },
];

export default function BudgetCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Free tool"
        eyebrowIcon="sliders"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Link Building Budget Calculator" }]}
        title="Link Building Budget Calculator"
        description="Set a monthly budget and a goal, and get a realistic split between guest posts and niche edits before you start ordering."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          <BudgetCalculator />

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">How to use this estimate</h2>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              Treat the output as a planning baseline, not a fixed order list. If your niche runs more expensive than
              average (finance, legal, SaaS), expect fewer total links for the same budget; if it runs cheaper, you
              may get more. See our full breakdown in{" "}
              <Link href="/resources/guest-posting-vs-niche-edits" className="text-brand-700 underline">
                guest posting vs. niche edits
              </Link>{" "}
              for how to decide the right mix for your specific page.
            </p>

            <h2 className="mt-8 font-display text-[1.2rem] font-semibold text-ink-950">FAQs</h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-line p-4">
                  <p className="text-[0.9rem] font-semibold text-ink-900">{f.q}</p>
                  <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-white p-6">
            <p className="font-display text-[1.05rem] font-semibold text-ink-950">Ready to place your first order?</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-500">
              Browse real, price-listed publishers and compare authority, traffic and delivery time.
            </p>
            <Button href="/marketplace" className="mt-5" icon="arrow-right">
              Browse the marketplace
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
