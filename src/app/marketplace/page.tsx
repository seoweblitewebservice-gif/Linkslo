import type { Metadata } from "next";
import Link from "next/link";
import { GigMarketplace } from "@/components/marketplace/GigMarketplace";
import { ServiceShop } from "@/components/marketplace/ServiceShop";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";
import { BACKLINK_SERVICES } from "@/lib/backlinks";
import { getGigFacets } from "@/lib/gigs/data";
import { queryGigs } from "@/lib/gigs-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Backlink Marketplace: Compare Services and Gigs",
  description:
    "Compare backlink service categories and marketplace gigs across guest posts, editorial links, niche edits, digital PR, industries and countries. Review package scope, pricing and delivery details before ordering.",
  alternates: { canonical: "/marketplace" },
  openGraph: {
    title: "Backlink Marketplace | Linkslo",
    description:
      "Compare backlink service categories and marketplace gigs with transparent packages, pricing and delivery details.",
    type: "website",
  },
};

const GIG_STANDARDS = [
  { title: "Clear service scope", body: "Each listing explains the link type, target market, delivery approach and package scope before checkout." },
  { title: "Three package levels", body: "Basic, Standard and Premium options show price, quantity, delivery and revisions before ordering." },
  { title: "Brief-specific detail", body: "Listings combine a specific service, industry, target market and objective rather than relying on one generic description." },
  { title: "No private blog networks", body: "PBN placements and disguised networks are excluded from the service catalogue." },
  { title: "Relevance before metrics", body: "Authority metrics are treated as filters; topical fit, traffic, indexing and editorial context matter more." },
  { title: "Pre-delivery checks", body: "Availability and suitability are checked before a placement is treated as confirmed." },
];

const SERVICE_STANDARDS = [
  { title: "Clear package scope", body: "Every service offers three packages with a fixed price, delivery window and written deliverables." },
  { title: "Documented delivery", body: "The service page explains what is included, how delivery works and what quality checks apply." },
  { title: "Manual review", body: "Prospecting, page review and placement verification are described as manual quality-control steps." },
  { title: "No private blog networks", body: "PBN inventory is excluded from the advertised service catalogue." },
  { title: "Relevance before metrics", body: "Topical fit, genuine traffic and editorial quality are prioritised over authority scores alone." },
  { title: "Transparent ordering", body: "Package pricing and expected delivery are visible before an order is submitted." },
];

type Props = {
  searchParams: Promise<{
    view?: string;
    category?: string;
    subcategory?: string;
    industry?: string;
    country?: string;
    q?: string;
  }>;
};

export default async function MarketplacePage({ searchParams }: Props) {
  const [{ view, category, subcategory, industry, country, q }, gigFacets] = await Promise.all([
    searchParams,
    getGigFacets(),
  ]);

  const activeView = view === "services" ? "services" : "gigs";
  const gigInitialData =
    activeView === "gigs"
      ? await queryGigs({
          category: category || undefined,
          subcategory: subcategory || undefined,
          industry: industry || undefined,
          country: country || undefined,
          q: q || undefined,
          pageSize: 24,
        })
      : undefined;

  const standards = activeView === "gigs" ? GIG_STANDARDS : SERVICE_STANDARDS;
  const headline = activeView === "gigs"
    ? "Find a backlink service listing for your brief"
    : "Choose a backlink service, then compare packages";
  const description = activeView === "gigs"
    ? "Explore backlink listings across service types, industries and target countries. Compare package scope, delivery time and starting price, then confirm suitability before ordering."
    : "Browse provider-operated backlink service categories with clear package scope, pricing and delivery details.";

  return (
    <>
      <PageHero
        eyebrow="Backlink marketplace"
        eyebrowIcon="link"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Marketplace" }]}
        title={headline}
        description={description}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={activeView === "gigs" ? "/marketplace" : "/backlinks"} icon="arrow-right">
            {activeView === "gigs" ? "Browse all gigs" : "Compare service details"}
          </Button>
          <Button href="/contact" variant="outline" iconLeft="users">Ask for a recommendation</Button>
        </div>
      </PageHero>

      <nav className="sticky top-[4.5rem] z-30 border-b border-line bg-white/90 backdrop-blur-xl" aria-label="Marketplace views">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto py-2.5">
          <MarketTab href="/marketplace" active={activeView === "gigs"} icon="users" label="Backlink gigs" />
          <MarketTab href="/marketplace?view=services" active={activeView === "services"} icon="link" label="Service categories" />
        </div>
      </nav>

      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          {activeView === "gigs" ? (
            <GigMarketplace
              facets={gigFacets}
              initialCategory={category ?? ""}
              initialSubcategory={subcategory ?? ""}
              initialIndustry={industry ?? ""}
              initialCountry={country ?? ""}
              initialQuery={q ?? ""}
              initialData={gigInitialData}
            />
          ) : (
            <ServiceShop services={BACKLINK_SERVICES} />
          )}
        </div>
      </section>

      <section id="vetting" className="border-t border-line bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow={activeView === "gigs" ? "Marketplace standards" : "Service standard"}
              eyebrowIcon="shield"
              title={activeView === "gigs" ? "Compare scope before you order" : "Clear service scope from brief to delivery"}
              description={activeView === "gigs" ? "Each listing exposes the service type, market, package scope and delivery approach so you can compare options before submitting an order." : "Service pages document package scope, quality checks and delivery expectations in one place."}
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((standard, index) => (
              <Reveal key={standard.title} delay={(index % 3) * 70}>
                <div className="card-hover h-full rounded-2xl border border-line bg-white p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon name="check" size={18} /></span>
                  <h3 className="mt-4 text-[0.98rem] font-semibold text-ink-950">{standard.title}</h3>
                  <p className="mt-2 text-[0.87rem] leading-relaxed text-ink-500">{standard.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-line bg-canvas px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="font-display text-[1.05rem] font-semibold text-ink-950">Need help choosing?</p>
                <p className="mt-1 text-[0.88rem] text-ink-500">Send your target URL and goal. Linkslo can help narrow the service type and package that fits the brief.</p>
              </div>
              <Button href="/contact" variant="dark" icon="arrow-right">Get a recommendation</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function MarketTab({ href, active, icon, label }: { href: string; active: boolean; icon: "users" | "link"; label: string }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[0.82rem] font-semibold transition-colors ${active ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"}`}>
      <Icon name={icon} size={16} />
      {label}
    </Link>
  );
}
