import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/primitives";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description:
    "Talk to an Linkslo strategist about guest posts, editorial links, niche edits, digital PR or an ongoing monthly link building campaign.",
  openGraph: {
    title: "Contact Linkslo — Talk to a Link Building Strategist",
    description:
      "Talk to an Linkslo strategist about guest posts, editorial links, niche edits, digital PR or an ongoing monthly link building campaign.",
    type: "website",
  },
};

const CONTACT_BLOCKS = [
  {
    icon: "mail" as const,
    title: "Email",
    lines: [BRAND.email],
    note: "Replies within one business day",
  },
  {
    icon: "users" as const,
    title: "Talk to sales",
    lines: [BRAND.phone],
    note: "Mon–Fri, 09:00–18:00 CET",
  },
  {
    icon: "pin" as const,
    title: "Office",
    lines: BRAND.addressLines,
    note: "Visits by appointment",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        eyebrowIcon="users"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Talk to a link building strategist"
        description="Tell us the pages you want to strengthen and we will come back with an honest assessment, including whether you need us at all."
      />

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <LeadForm source="contact-page" />

          <aside className="space-y-5">
            {CONTACT_BLOCKS.map((block) => (
              <Card key={block.title} className="p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name={block.icon} size={18} />
                </span>
                <p className="mt-3.5 text-[0.95rem] font-semibold text-ink-950">{block.title}</p>
                {block.lines.map((line) => (
                  <p key={line} className="text-[0.88rem] text-ink-600">
                    {line}
                  </p>
                ))}
                <p className="mt-1.5 text-[0.76rem] text-ink-400">{block.note}</p>
              </Card>
            ))}

            <Card className="bg-ink-950 p-6 text-white">
              <p className="font-display text-[1.05rem] font-semibold">What happens next</p>
              <ol className="mt-4 space-y-3 text-[0.86rem] text-ink-200">
                {[
                  "We review your current backlink profile and target pages before the call.",
                  "A 30-minute conversation about objectives, constraints and timing.",
                  "A written recommendation with indicative scope and budget ranges.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[0.72rem] font-semibold text-brand-300">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
