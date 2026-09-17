import Link from "next/link";
import type { Metadata } from "next";
import { DaDrExplainer } from "@/components/tools/DaDrExplainer";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "DA vs DR: What's the Difference? — Free Tool",
  description:
    "See what a given Domain Authority or Domain Rating score roughly means, and why the two metrics rarely match exactly.",
  alternates: { canonical: "/tools/da-vs-dr-checker" },
  openGraph: {
    title: "DA vs DR Explained | Linkslo",
    description: "See what a given Domain Authority or Domain Rating score roughly means, and why they differ.",
    type: "website",
  },
};

const faqs = [
  {
    q: "Is DA or DR more accurate?",
    a: "Neither — both are third-party estimates from Moz and Ahrefs respectively, calculated from each tool's own backlink index using its own methodology. Google doesn't use either metric directly, and neither is a substitute for checking real traffic and content quality.",
  },
  {
    q: "Why do DA and DR sometimes differ a lot for the same site?",
    a: "The two tools crawl and index the web differently, so they see different (and differently-sized) sets of backlinks pointing to any given domain. A site with more links visible to Ahrefs' crawler than Moz's, for example, may show a notably higher DR than DA.",
  },
  {
    q: "Should I ignore DA and DR completely?",
    a: "No — they're still useful as a fast first filter to rule out obviously weak, unlinked domains. Just don't treat either number as a final verdict on a site's quality.",
  },
];

export default function DaDrPage() {
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
        eyebrowIcon="gauge"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "DA vs DR Explained" }]}
        title="DA vs DR: What's the Difference?"
        description="Move the sliders to see what a given Domain Authority or Domain Rating score roughly indicates, and why the two rarely land on the same number for the same site."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          <DaDrExplainer />

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">The short version</h2>
            <p className="text-[0.92rem] leading-relaxed text-ink-600">
              Domain Authority (Moz) and Domain Rating (Ahrefs) both try to estimate how strong a site&apos;s backlink
              profile is, on a 0-100 logarithmic scale. Neither is published or endorsed by Google, and both can be
              inflated by exactly the kind of low-quality links a careful buyer is trying to avoid — which is why we
              treat them as a first filter, not a final answer, in{" "}
              <Link href="/resources/vet-guest-post-site-before-you-buy" className="text-brand-700 underline">
                how to vet a guest post site before you buy
              </Link>
              .
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
            <p className="font-display text-[1.05rem] font-semibold text-ink-950">See real DA and DR on live listings</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-500">
              Every publisher on our marketplace shows its current authority, traffic and price upfront.
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
