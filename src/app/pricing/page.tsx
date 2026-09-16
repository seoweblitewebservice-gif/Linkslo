import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Button, Card, SectionHeading } from "@/components/ui/primitives";
import { PRICING_PLANS } from "@/lib/content";
import { BACKLINK_SERVICES, startingPrice } from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing",
  description:
    "Transparent platform plans and per-placement marketplace pricing. Browse for free, upgrade when you need multiple workspaces or white-labelled reporting.",
  openGraph: {
    title: "Linkslo Pricing — Platform Plans & Marketplace Rates",
    description:
      "Transparent platform plans and per-placement marketplace pricing. Browse for free, upgrade when you need multiple workspaces or white-labelled reporting.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        eyebrowIcon="wallet"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        title="Transparent plans, per-placement pricing"
        description="No mandatory retainers to access inventory. Platform plans add workspaces, automation and reporting depth as your programme grows."
      />

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-3">
            {PRICING_PLANS.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 80}>
                <Card
                  className={`flex h-full flex-col p-7 ${
                    plan.highlight
                      ? "border-brand-300 shadow-[0_30px_70px_-40px_rgba(9,131,102,0.55)] ring-1 ring-brand-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[1.2rem] font-semibold text-ink-950">
                      {plan.name}
                    </h2>
                    {plan.highlight && <Badge tone="brand">Most popular</Badge>}
                  </div>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-display text-[2.4rem] font-semibold leading-none text-ink-950">
                      {plan.price}
                    </span>
                    <span className="text-[0.85rem] text-ink-400">{plan.cadence}</span>
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-500">{plan.summary}</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-[0.88rem] text-ink-600">
                        <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={plan.cta.href}
                    variant={plan.highlight ? "primary" : "outline"}
                    fullWidth
                    className="mt-7"
                    icon="arrow-right"
                  >
                    {plan.cta.label}
                  </Button>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-12">
              <SectionHeading
                eyebrow="Service pricing"
                eyebrowIcon="layers"
                title="Indicative starting prices"
                description="Final pricing depends on market, language, publication authority and volume. Every quote is itemised."
              />
              <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <table className="w-full text-left">
                  <caption className="sr-only">Starting prices by service</caption>
                  <thead>
                    <tr className="border-b border-line bg-canvas/70 text-[0.7rem] uppercase tracking-[0.08em] text-ink-400">
                      <th scope="col" className="px-5 py-3 font-semibold">Service</th>
                      <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">
                        Typical timeline
                      </th>
                      <th scope="col" className="px-5 py-3 text-right font-semibold">From</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {BACKLINK_SERVICES.map((service) => (
                      <tr key={service.slug} className="transition-colors hover:bg-canvas/60">
                        <td className="px-5 py-3.5">
                          <a href={`/backlinks/${service.slug}`} className="flex items-center gap-2.5 hover:text-brand-700">
                            <Icon name={service.icon} size={17} className="text-brand-700" />
                            <span className="text-[0.9rem] font-medium text-ink-900">
                              {service.nav}
                            </span>
                          </a>
                        </td>
                        <td className="hidden px-5 py-3.5 text-[0.85rem] text-ink-500 sm:table-cell">
                          {service.packages[0].deliveryDays}–{service.packages[2].deliveryDays} days
                        </td>
                        <td className="px-5 py-3.5 text-right text-[0.9rem] font-semibold text-ink-950">
                          {formatCurrency(startingPrice(service))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                { icon: "wallet" as const, title: "No lock-in", body: "Monthly plans can be cancelled before the next renewal. Annual plans include two months free." },
                { icon: "shield" as const, title: "Price locked at checkout", body: "Marketplace prices are fixed when you order, even if the publisher revises rates later." },
                { icon: "document" as const, title: "VAT-compliant invoicing", body: "Automatic invoices with reverse-charge handling for EU business customers." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <p className="mt-3.5 text-[0.95rem] font-semibold text-ink-950">{item.title}</p>
                  <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-500">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
