import type { Metadata } from "next";
import { ScoutPanel } from "@/components/marketing/ScoutPanel";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/link-gap-scout" },
  title: "Link Gap Scout | Free Backlink Gap Analysis",
  description:
    "Enter a domain and target keyword to estimate your backlink gap, see competing domains, content angles and matched publishers for link acquisition.",
  openGraph: {
    title: "Link Gap Scout | Free Backlink Gap Analysis",
    description:
      "Enter a domain and target keyword to estimate your backlink gap, see competing domains, content angles and matched publishers for link acquisition.",
    type: "website",
  },
};

const STEPS = [
  {
    icon: "globe" as const,
    title: "Enter a domain and keyword",
    body: "Link Gap Scout profiles the theme, infers your category and sets a competitive baseline for the term.",
  },
  {
    icon: "target" as const,
    title: "See the referring domain gap",
    body: "Competing domains, their link counts and how far behind your profile currently sits.",
  },
  {
    icon: "link" as const,
    title: "Get matched publishers",
    body: "Relevant marketplace publishers are pulled in so you can move from analysis to placement.",
  },
];

export default function LinkGapScoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Free backlink tool"
        eyebrowIcon="compass"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Link Gap Scout" }]}
        title="Link Gap Scout"
        description="A fast way to size up a keyword before committing link budget: who is ahead of you, how large the referring domain gap is, and which publishers could realistically close it."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x">
          <ScoutPanel />

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <div className="card-hover h-full rounded-2xl border border-line bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={step.icon} size={19} />
                  </span>
                  <p className="mt-4 font-display text-[1.02rem] font-semibold text-ink-950">
                    {step.title}
                  </p>
                  <p className="mt-2 text-[0.87rem] leading-relaxed text-ink-500">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Methodology"
              eyebrowIcon="shield"
              title="How the gap score works"
              description="Four inputs combine into a single 0–100 opportunity score so you can compare keywords consistently before allocating link budget."
            />
            <ul className="mt-7 space-y-4">
              {[
                { label: "Topical relevance (45%)", body: "How closely your existing coverage matches the theme a linking page would need to discuss." },
                { label: "Competitive difficulty (35%)", body: "Strength and consistency of the referring domain profiles currently ranking for the term." },
                { label: "Authority baseline (20%)", body: "Your current link profile relative to the result set." },
                { label: "Publisher availability", body: "Whether relevant, screened publications exist to close the gap at a sensible cost." },
              ].map((item) => (
                <li key={item.label} className="rounded-xl border border-line bg-canvas p-4">
                  <p className="text-[0.9rem] font-semibold text-ink-950">{item.label}</p>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-500">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-canvas p-7">
              <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">
                Want the connected version?
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-500">
                The public tool runs on a demonstration model with representative figures. On Growth
                and Agency plans, Link Gap Scout connects to your live backlink data, stores scans
                per project and tracks the gap closing over time.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Saved scans and quarter-over-quarter comparison",
                  "Competitor link alerts when rivals gain new domains",
                  "Direct hand-off from analysis to campaign brief",
                  "Exportable gap reports for stakeholders",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.88rem] text-ink-600">
                    <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/pricing" icon="arrow-right">Compare plans</Button>
                <Button href="/contact" variant="outline">Request a demo</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
