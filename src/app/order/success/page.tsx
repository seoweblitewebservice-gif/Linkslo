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
  title: "Payment Confirmed — Submit Delivery Details",
  description: "Your PayPal payment was received. Submit the target page and contact details so the seller can start work.",
  alternates: { canonical: "/order/success" },
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ service?: string; gig?: string; tier?: string; amount?: string; paypalOrderId?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { service: serviceSlug, gig: gigSlug, tier, amount, paypalOrderId } = await searchParams;
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
  const initialTier = tier && validTiers.includes(tier) ? tier : product.packages[0].tier;
  const selectedPackage = product.packages.find((pkg) => pkg.tier === initialTier) ?? product.packages[0];
  const detailHref = gig ? `/marketplace/gigs/${gig.slug}` : `/backlinks/${service!.slug}`;
  const paidAmount = amount ? Number(amount) : selectedPackage.price;

  return (
    <>
      <PageHero
        eyebrow="Payment received"
        eyebrowIcon="check"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: gig ? gig.subcategory : service!.nav, href: detailHref },
          { label: "Payment confirmed" },
        ]}
        title={`Payment confirmed for ${product.name}`}
        description="PayPal has confirmed your payment. Submit the delivery details below so the seller can start work straight away — no separate invoice or extra step required."
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3.5 py-1.5 text-[0.78rem] font-semibold text-white">
            <Icon name="check" size={14} />
            {formatCurrency(paidAmount, "USD")} paid via PayPal
          </span>
          {paypalOrderId && <span className="font-mono text-[0.74rem] text-ink-400">Order ID: {paypalOrderId}</span>}
        </div>
      </PageHero>

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_20rem] lg:items-start">
          <Card className="p-6 sm:p-8">
            <OrderForm product={product} initialTier={initialTier} paypalOrderId={paypalOrderId ?? ""} />
          </Card>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card className="p-5">
              <Badge tone="brand">{gig ? "Paid gig" : "Paid service"}</Badge>
              <h2 className="mt-3 font-display text-[1rem] font-semibold leading-snug text-ink-950">{product.name}</h2>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-500">{product.summary}</p>
              {gig && (
                <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-[0.66rem] font-semibold text-white">{gig.sellerInitials}</span>
                  <div><p className="flex items-center gap-1 text-[0.78rem] font-semibold text-ink-900">{gig.sellerName}<Icon name="shield" size={12} className="text-brand-600" /></p><p className="text-[0.66rem] text-ink-400">{gig.sellerLevel} · {gig.sellerCountry}</p></div>
                </div>
              )}
              <div className="mt-4 rounded-xl bg-canvas p-3.5">
                <p className="text-[0.66rem] font-semibold uppercase tracking-wide text-ink-400">Package paid</p>
                <p className="mt-1 text-[0.86rem] font-semibold text-ink-950">{selectedPackage.name}</p>
                <p className="mt-0.5 font-display text-[1.15rem] font-semibold text-brand-700">{formatCurrency(paidAmount, "USD")}</p>
              </div>
              <Link href={detailHref} className="mt-4 inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-brand-700 hover:text-brand-800"><Icon name="arrow-right" size={13} className="rotate-180" />Back to details</Link>
            </Card>

            <Card className="p-5">
              <p className="text-[0.88rem] font-semibold text-ink-950">What happens next</p>
              <ol className="mt-4 space-y-3">
                {[
                  "Submit your target page and contact details in the form.",
                  "The seller confirms scope against the paid package.",
                  "Outreach and content work begins immediately.",
                  "You receive the live URL report on delivery.",
                ].map((step, index) => <li key={step} className="flex gap-2.5 text-[0.78rem] leading-relaxed text-ink-600"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[0.62rem] font-semibold text-brand-700">{index + 1}</span>{step}</li>)}
              </ol>
            </Card>

            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <p className="flex items-center gap-2 text-[0.82rem] font-semibold text-brand-900"><Icon name="shield" size={15} />Keep this order ID</p>
              <p className="mt-2 text-[0.76rem] leading-relaxed text-brand-800">Your PayPal receipt and this order ID are your proof of payment. Contact support with either if you need help with this order.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
