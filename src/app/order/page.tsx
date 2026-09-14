import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderForm, type OrderProduct } from "@/components/forms/OrderForm";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Badge, Card } from "@/components/ui/primitives";
import { getService } from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";
import { getGigBySlug } from "@/lib/gigs/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order a Backlink Gig or Service Package",
  description:
    "Choose a backlink package and submit your target page for quality review before payment and publisher outreach begin.",
  alternates: { canonical: "/order" },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ service?: string; gig?: string; tier?: string }> };

export default async function OrderPage({ searchParams }: Props) {
  const { service: serviceSlug, gig: gigSlug, tier } = await searchParams;
  const gig = gigSlug ? await getGigBySlug(gigSlug) : null;
  const service = !gig && serviceSlug ? getService(serviceSlug) : null;
  if (!gig && !service) notFound();

  const product: OrderProduct = gig
    ? {
        kind: "gig",
        slug: gig.slug,
        serviceSlug: gig.serviceSlug,
        name: gig.title,
        summary: gig.summary,
        packages: gig.packages.map((pkg) => ({
          tier: pkg.tier,
          name: pkg.name,
          price: pkg.price,
          deliveryDays: pkg.deliveryDays,
          quantity: pkg.quantity,
          recommended: pkg.recommended,
        })),
      }
    : {
        kind: "service",
        slug: service!.slug,
        serviceSlug: service!.slug,
        name: service!.nav,
        summary: service!.summary,
        packages: service!.packages.map((pkg) => ({
          tier: pkg.tier,
          name: pkg.name,
          price: pkg.price,
          deliveryDays: pkg.deliveryDays,
          quantity: pkg.volume,
          recommended: Boolean(pkg.recommended),
        })),
      };

  const validTiers = product.packages.map((pkg) => pkg.tier);
  const initialTier = tier && validTiers.includes(tier) ? tier : product.packages.find((pkg) => pkg.recommended)?.tier ?? product.packages[0].tier;
  const selectedPackage = product.packages.find((pkg) => pkg.tier === initialTier) ?? product.packages[0];
  const detailHref = gig ? `/marketplace/gigs/${gig.slug}` : `/backlinks/${service!.slug}`;

  return (
    <>
      <PageHero
        eyebrow={gig ? "Marketplace gig order" : "Direct service order"}
        eyebrowIcon="wallet"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: gig ? gig.subcategory : service!.nav, href: detailHref },
          { label: "Order" },
        ]}
        title={`Order ${product.name}`}
        description="Choose the package, share the page you want to strengthen, and submit the brief. The seller or Linkslo strategist checks relevance and feasibility before payment is requested."
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_20rem] lg:items-start">
          <Card className="p-6 sm:p-8">
            <OrderForm product={product} initialTier={initialTier} />
          </Card>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card className="p-5">
              <Badge tone="brand">{gig ? "Selected gig" : "Selected service"}</Badge>
              <h2 className="mt-3 font-display text-[1rem] font-semibold leading-snug text-ink-950">{product.name}</h2>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-500">{product.summary}</p>
              {gig && (
                <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-[0.66rem] font-semibold text-white">{gig.sellerInitials}</span>
                  <div><p className="flex items-center gap-1 text-[0.78rem] font-semibold text-ink-900">{gig.sellerName}<Icon name="shield" size={12} className="text-brand-600" /></p><p className="text-[0.66rem] text-ink-400">{gig.sellerLevel} · {gig.sellerCountry}</p></div>
                </div>
              )}
              <div className="mt-4 rounded-xl bg-canvas p-3.5">
                <p className="text-[0.66rem] font-semibold uppercase tracking-wide text-ink-400">Preselected package</p>
                <p className="mt-1 text-[0.86rem] font-semibold text-ink-950">{selectedPackage.name}</p>
                <p className="mt-0.5 font-display text-[1.15rem] font-semibold text-brand-700">{formatCurrency(selectedPackage.price)}</p>
              </div>
              <Link href={detailHref} className="mt-4 inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-brand-700 hover:text-brand-800"><Icon name="arrow-right" size={13} className="rotate-180" />Back to details</Link>
            </Card>

            <Card className="p-5">
              <p className="text-[0.88rem] font-semibold text-ink-950">What happens next</p>
              <ol className="mt-4 space-y-3">
                {[
                  "The target page and current backlink profile are reviewed.",
                  "Seller confirms the gig and package are appropriate.",
                  "You receive final scope, delivery date and secure payment request.",
                  "Publisher outreach starts only after approval.",
                ].map((step, index) => <li key={step} className="flex gap-2.5 text-[0.78rem] leading-relaxed text-ink-600"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[0.62rem] font-semibold text-brand-700">{index + 1}</span>{step}</li>)}
              </ol>
            </Card>

            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <p className="flex items-center gap-2 text-[0.82rem] font-semibold text-brand-900"><Icon name="shield" size={15} />No blind checkout</p>
              <p className="mt-2 text-[0.76rem] leading-relaxed text-brand-800">Payment is not taken for a target that has not been reviewed. Poor-fit orders are redirected or declined.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
