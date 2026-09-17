import type { Metadata } from "next";
import { OutreachGenerator } from "@/components/tools/OutreachGenerator";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Guest Post Outreach Email Generator — Free Tool",
  description:
    "Answer a few quick questions to generate a ready-to-edit guest post outreach email in a friendly, professional or personal tone.",
  alternates: { canonical: "/tools/outreach-email-generator" },
  openGraph: {
    title: "Guest Post Outreach Email Generator | Linkslo",
    description: "Generate a ready-to-edit outreach email for pitching a guest post to a publisher.",
    type: "website",
  },
};

const faqs = [
  {
    q: "Should I send this email exactly as generated?",
    a: "No — treat it as a starting draft. The most effective outreach emails still reference something specific about the publisher's recent content, which only you can add.",
  },
  {
    q: "Which tone gets the best response rate?",
    a: "It depends on the publisher and your niche. Smaller, personal blogs often respond better to a warm, casual tone, while larger publications with formal submission processes usually expect something more direct and professional.",
  },
  {
    q: "What should I do if I don't hear back?",
    a: "One polite follow-up after 5-7 business days is normal and often effective. More than one or two follow-ups on the same pitch usually isn't worth it — move on to the next publisher instead.",
  },
];

export default function OutreachGeneratorPage() {
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
        eyebrowIcon="mail"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Outreach Email Generator" }]}
        title="Guest Post Outreach Email Generator"
        description="Fill in a few details and pick a tone to generate a ready-to-edit pitch email — copy it, personalise the specifics, and send."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          <OutreachGenerator />

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">What makes outreach actually work</h2>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              The single biggest factor in outreach response rates isn&apos;t tone — it&apos;s relevance. A well-targeted pitch
              to a site that genuinely covers your topic, referencing something specific from their recent content,
              consistently outperforms a perfectly worded template sent to hundreds of loosely related sites. Use this
              generator for the structure, then spend your remaining time on making the pitch feel personal.
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
            <p className="font-display text-[1.05rem] font-semibold text-ink-950">Prefer to skip outreach entirely?</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-500">
              Order directly from publishers who already accept guest posts, with pricing shown upfront.
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
