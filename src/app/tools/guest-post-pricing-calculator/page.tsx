import Link from "next/link";
import type { Metadata } from "next";
import { PricingCalculator } from "@/components/tools/PricingCalculator";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Guest Post Pricing Calculator — Free Tool",
  description:
    "Enter a publisher's DA, traffic and niche to get an instant, fair price range for a guest post before you order or send a quote.",
  alternates: { canonical: "/tools/guest-post-pricing-calculator" },
  openGraph: {
    title: "Guest Post Pricing Calculator | Linkslo",
    description: "Get an instant, fair price range for a guest post based on DA, traffic and niche.",
    type: "website",
  },
};

const faqs = [
  {
    q: "How accurate is this calculator?",
    a: "It models typical marketplace pricing patterns across thousands of real listings, so it's a solid starting reference — not a guarantee. Actual prices vary by seller, exact traffic, and how in-demand a specific site is.",
  },
  {
    q: "Why does niche change the price so much?",
    a: "Advertisers historically pay more to reach finance, legal, SaaS and health audiences, so publishers in those niches tend to price higher even at similar authority and traffic levels.",
  },
  {
    q: "Should I always pick the lowest price in the range?",
    a: "Not necessarily. Use the range as a sanity check — if a seller&apos;s quote is far above the high end, ask what justifies it (exclusivity, extra promotion, faster turnaround). If it's far below the low end, double-check the site's real traffic and editorial quality first.",
  },
];

export default function PricingCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Free tool"
        eyebrowIcon="wallet"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Guest Post Pricing Calculator" }]}
        title="Guest Post Pricing Calculator"
        description="Move the sliders to match a publisher's metrics and get an instant, fair price range — useful whether you're buying a placement or pricing one to sell."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          <PricingCalculator />

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">How this calculator works</h2>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              The estimate starts from a base price tied to Domain Authority tier, then adjusts for three factors that
              move real guest post prices the most: monthly organic traffic, niche (finance and SaaS command a premium
              over general lifestyle content), and whether the price includes the publisher writing the article for
              you. Dofollow links carry a premium over nofollow, since they pass a stronger authority signal.
            </p>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              This logic mirrors the pricing patterns we cover in detail in{" "}
              <Link href="/resources/how-much-should-you-pay-for-a-guest-post" className="text-brand-700 underline">
                how much you should pay for a guest post
              </Link>
              , and it&apos;s the same rough model publishers on our own marketplace tend to land in.
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
            <p className="font-display text-[1.05rem] font-semibold text-ink-950">
              Want real, price-listed sites instead of an estimate?
            </p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-500">
              Browse thousands of publishers with their actual current DA, traffic and price shown upfront.
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
