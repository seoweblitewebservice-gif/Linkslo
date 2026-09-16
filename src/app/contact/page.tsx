import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/primitives";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact Linkslo",
  description:
    "Contact Linkslo about guest posts, editorial links, niche edits, digital PR, marketplace listings or an ongoing link-building campaign.",
  openGraph: {
    title: "Contact Linkslo — Link Building & Marketplace Support",
    description:
      "Contact Linkslo about backlink services, marketplace listings, order requirements or campaign planning.",
    type: "website",
  },
};

const CONTACT_BLOCKS = [
  {
    icon: "mail" as const,
    title: "Email",
    value: BRAND.email,
    href: `mailto:${BRAND.email}`,
    note: "For campaign, order and partnership questions",
  },
  {
    icon: "users" as const,
    title: "Telegram",
    value: "@SEOSERVICE9111",
    href: "https://t.me/SEOSERVICE9111",
    note: "Use Telegram for a quick project or order message",
  },
  {
    icon: "users" as const,
    title: "WhatsApp",
    value: "+1 530 303 7330",
    href: "https://wa.me/15303037330",
    note: "Include your target URL and the service you are considering",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        eyebrowIcon="users"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Talk to Linkslo about your link-building brief"
        description="Share the target page, market and service you are considering. The goal is to confirm fit, scope and availability before fulfilment begins."
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
                <a
                  href={block.href}
                  target={block.href.startsWith("http") ? "_blank" : undefined}
                  rel={block.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="mt-1 inline-block text-[0.88rem] font-medium text-brand-700 hover:underline"
                >
                  {block.value}
                </a>
                <p className="mt-1.5 text-[0.76rem] leading-relaxed text-ink-400">{block.note}</p>
              </Card>
            ))}

            <Card className="bg-ink-950 p-6 text-white">
              <p className="font-display text-[1.05rem] font-semibold">What to include in your message</p>
              <ol className="mt-4 space-y-3 text-[0.86rem] text-ink-200">
                {[
                  "The website or target page you want to strengthen.",
                  "The link type, market or publisher option you are considering.",
                  "Your preferred anchor text, timing and any placement constraints.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[0.72rem] font-semibold text-brand-300">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[0.76rem] leading-relaxed text-ink-400">
                Publisher availability and third-party editorial approval can change, so suitability is confirmed before a placement is treated as final.
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
