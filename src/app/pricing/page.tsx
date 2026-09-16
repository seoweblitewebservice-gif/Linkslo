import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, Card, SectionHeading } from "@/components/ui/primitives";
import { BACKLINK_SERVICES, startingPrice } from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Backlink Service Pricing",
  description:
    "Compare starting prices, package scope and delivery windows across Linkslo backlink services. Final publisher availability and third-party editorial approval are confirmed before fulfilment.",
  openGraph: {
    title: "Backlink Service Pricing | Linkslo",
    description:
      "Compare starting prices, package scope and delivery windows across Linkslo backlink services.",
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
        title="Compare backlink service pricing"
        description="Start with the listed package price and delivery window, then confirm publisher availability, target-page fit and any third-party editorial requirements before fulfilment begins."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/marketplace" icon="arrow-right">Browse marketplace</Button>
          <Button href="/contact" variant="outline">Ask about a campaign</Button>
        </div>
      </PageHero>

      <section className="bg-canvas py-14 sm:py-18">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Service pricing"
              eyebrowIcon="layers"
              title="Starting prices by backlink service"
              description="Each service page shows three package tiers with scope, price, delivery time, revisions and included deliverables."
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <table className="w-full text-left">
                <caption className="sr-only">Starting prices by backlink service</caption>
                <thead>
                  <tr className="border-b border-line bg-canvas/70 text-[0.7rem] uppercase tracking-[0.08em] text-ink-400">
                    <th scope="col" className="px-5 py-3 font-semibold">Service</th>
                    <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">Delivery range</th>
                    <th scope="col" className="hidden px-5 py-3 font-semibold md:table-cell">Packages</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">From</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {BACKLINK_SERVICES.map((service) => (
                    <tr key={service.slug} className="transition-colors hover:bg-canvas/60">
                      <td className="px-5 py-3.5">
                        <Link href={`/backlinks/${service.slug}`} className="flex items-center gap-2.5 hover:text-brand-700">
                          <Icon name={service.icon} size={17} className="text-brand-700" />
                          <span>
                            <span className="block text-[0.9rem] font-medium text-ink-900">{service.nav}</span>
                            <span className="mt-0.5 block text-[0.72rem] text-ink-400">{service.group}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="hidden px-5 py-3.5 text-[0.85rem] text-ink-500 sm:table-cell">
                        {Math.min(...service.packages.map((pkg) => pkg.deliveryDays))}–{Math.max(...service.packages.map((pkg) => pkg.deliveryDays))} days
                      </td>
                      <td className="hidden px-5 py-3.5 text-[0.82rem] text-ink-500 md:table-cell">
                        {service.packages.map((pkg) => pkg.tier).join(" · ")}
                      </td>
                      <td className="px-5 py-3.5 text-right text-[0.9rem] font-semibold text-ink-950">
                        {formatCurrency(startingPrice(service))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: "document" as const,
                title: "Scope shown before ordering",
                body: "Package pages list the deliverables, quantity, revisions and expected delivery window before an order is submitted.",
              },
              {
                icon: "shield" as const,
                title: "Availability is confirmed",
                body: "Third-party publisher availability and editorial approval can change, so suitability is confirmed before a placement is treated as final.",
              },
              {
                icon: "target" as const,
                title: "No ranking guarantee",
                body: "Backlinks are one SEO input. Rankings, traffic and indexing depend on many factors outside any link provider's control.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <Card className="h-full p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <h2 className="mt-3.5 text-[0.95rem] font-semibold text-ink-950">{item.title}</h2>
                  <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-500">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-12 rounded-2xl border border-line bg-white p-7 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <h2 className="font-display text-[1.1rem] font-semibold text-ink-950">Need help choosing a package?</h2>
                <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-ink-500">
                  Share the target URL, niche, country and preferred link type. Linkslo can help narrow the relevant service and package before you place the order.
                </p>
              </div>
              <Button href="/contact" variant="dark" className="mt-5 shrink-0 sm:mt-0" icon="arrow-right">Contact Linkslo</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
