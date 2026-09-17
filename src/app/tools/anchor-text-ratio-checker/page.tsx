import type { Metadata } from "next";
import { AnchorChecker } from "@/components/tools/AnchorChecker";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Anchor Text Ratio Checker — Free Tool",
  description:
    "Paste your backlink anchor texts to instantly see your exact-match, partial-match, branded, generic and naked-URL split.",
  alternates: { canonical: "/tools/anchor-text-ratio-checker" },
  openGraph: {
    title: "Anchor Text Ratio Checker | Linkslo",
    description: "See your exact-match, partial-match, branded, generic and naked-URL anchor split at a glance.",
    type: "website",
  },
};

const faqs = [
  {
    q: "What's a healthy anchor text ratio?",
    a: "There's no single official number, but most link profiles that avoid looking manipulated keep branded and naked-URL anchors as the largest share (roughly 40-60% combined), with exact-match anchors under about 10%, and the rest split across partial-match, generic and natural long-tail phrasing.",
  },
  {
    q: "Is a high branded percentage bad?",
    a: "No — a large branded share is normal and expected. Real sites naturally accumulate a lot of links that simply use the company or product name.",
  },
  {
    q: "Does this tool check my live backlinks automatically?",
    a: "No. You paste in anchor texts you've already collected (from a backlink tool export, a spreadsheet, or your own records) and this checker categorizes and ratios them for you instantly, entirely in your browser.",
  },
];

export default function AnchorCheckerPage() {
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
        eyebrowIcon="chart"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Anchor Text Ratio Checker" }]}
        title="Anchor Text Ratio Checker"
        description="Paste in the anchor texts from your backlink profile and see the split between exact-match, branded, generic and other anchor types — all processed in your browser."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          <AnchorChecker />

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">Why anchor text ratio matters</h2>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              A link profile dominated by exact-match commercial anchors (&quot;best accounting software&quot; repeated across
              dozens of links) is one of the more recognisable manipulation patterns search engines watch for. Real,
              organically earned links overwhelmingly use branded phrases, naked URLs, or natural sentence fragments —
              varying anchor text keeps a profile looking like something people actually wrote, rather than something
              built to a template.
            </p>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              Nothing you paste here leaves your browser — the categorisation runs entirely client-side.
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
            <p className="font-display text-[1.05rem] font-semibold text-ink-950">Need to diversify your anchors?</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-500">
              Order guest posts and niche edits across different domains and naturally varied phrasing.
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
