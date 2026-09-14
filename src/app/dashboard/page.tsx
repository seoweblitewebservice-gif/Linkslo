import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { DashboardApp } from "@/components/dashboard/DashboardApp";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { getWorkspaceData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product dashboard",
  description:
    "Explore the Linkslo workspace: projects, campaigns, marketplace orders, reporting, content pipeline and billing.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: true },
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/login?redirect_url=/dashboard");

  const workspace = await getWorkspaceData();
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Signed in";
  const email = user.emailAddresses[0]?.emailAddress ?? "";

  return (
    <>
      <PageHero
        eyebrow="Signed in with Google"
        eyebrowIcon="layers"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        title="The workspace your campaigns run in"
        description="This is the real interface, loaded with sample workspace data. Switch projects, move between tabs and inspect how campaigns, placements and reporting fit together."
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-soft">
            {user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt={displayName} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-[0.7rem] font-semibold text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="text-[0.82rem]">
              <span className="block font-semibold text-ink-950">{displayName}</span>
              <span className="block text-[0.72rem] text-ink-400">{email}</span>
            </span>
          </div>
          <SignOutButton redirectUrl="/">
            <Button variant="outline" icon="arrow-right">
              Sign out
            </Button>
          </SignOutButton>
        </div>
      </PageHero>

      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          <DashboardApp
            projects={workspace.projects}
            campaigns={workspace.campaigns}
            placements={workspace.placements}
            listings={workspace.listings}
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: "users" as const,
                title: "Built for teams",
                body: "Invite colleagues or freelancers with scoped permissions per client project.",
              },
              {
                icon: "document" as const,
                title: "Reports on a schedule",
                body: "PDF, CSV and XLSX exports generated automatically and delivered to stakeholders.",
              },
              {
                icon: "wallet" as const,
                title: "Budget visibility",
                body: "Track committed and remaining budget per project, with VAT-compliant invoices.",
              },
            ].map((item) => (
              <div key={item.title} className="card-hover rounded-2xl border border-line bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name={item.icon} size={18} />
                </span>
                <p className="mt-3.5 text-[0.95rem] font-semibold text-ink-950">{item.title}</p>
                <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
