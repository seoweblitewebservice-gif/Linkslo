import type { Metadata } from "next";
import { TrackOrderClient } from "@/components/orders/TrackOrderClient";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track a Linkslo order using the order reference and email address used at checkout. No account or registration required.",
  alternates: { canonical: "/track-order" },
  robots: { index: false, follow: true },
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Order tracking"
        eyebrowIcon="layers"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Track order" }]}
        title="Track your order without an account"
        description="Enter the reference from your order confirmation and the email address used at checkout to see the latest status and delivery details."
      />
      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          <TrackOrderClient />
        </div>
      </section>
    </>
  );
}
