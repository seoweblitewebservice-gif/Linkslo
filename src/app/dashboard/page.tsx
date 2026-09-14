import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { AccountShell } from "@/components/account/AccountShell";
import { PageHero } from "@/components/site/PageHero";
import { ADMIN_EMAIL } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My account",
  description: "Track your orders, delivery status and completed work.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: true },
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/login?redirect_url=/dashboard");

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <>
      <PageHero
        eyebrow="My account"
        eyebrowIcon="layers"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My account" }]}
        title="Track your orders and delivery"
        description="Everything about your purchases — status, payment, delivery files and reports — lives here."
      />

      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          <AccountShell name={displayName} email={email} imageUrl={user.imageUrl || null} isAdmin={isAdmin} />
        </div>
      </section>
    </>
  );
}
