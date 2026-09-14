import type { Metadata } from "next";
import Link from "next/link";
import { GigMarketplace } from "@/components/marketplace/GigMarketplace";
import { MarketplaceExplorer } from "@/components/marketplace/MarketplaceExplorer";
import { ServiceShop } from "@/components/marketplace/ServiceShop";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";
import { BACKLINK_SERVICES } from "@/lib/backlinks";
import { getGigFacets } from "@/lib/gigs/data";
import { getFacets } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "8,886 Backlink Gigs | Link Building Marketplace",
  description:
    "Browse 8,886 backlink service gigs, including 6,686 real named guest post publishers with listed price and traffic, plus editorial links, niche edits, digital PR, industries and countries. Compare verified sellers and three packages.",
  alternates: { canonical: "/marketplace" },
};

const GIG_STANDARDS = [
  { title: "Seller identity reviewed", body: "Every specialist has a consistent profile, service history, response time and visible package scope." },
  { title: "Three packages per gig", body: "Basic, Standard and Premium packages show price, quantity, delivery and revisions before checkout." },
  { title: "A genuinely different brief", body: "Each gig combines a specific link type, industry, target market and objective rather than repeating one generic listing." },
  { title: "No private blog networks", body: "PBN placements and disguised networks are prohibited across every seller and service category." },
  { title: "Relevance before metrics", body: "DA and DR help filter; page context, traffic, indexing and editorial quality determine approval." },
  { title: "Order reviewed before payment", body: "The seller reviews your target page and confirms that the selected gig fits before outreach begins." },
];

const SERVICE_STANDARDS = [
  { title: "Clear package scope", body: "Every service offers three packages with a fixed price, delivery window and written deliverables." },
  { title: "Provider-operated delivery", body: "Linkslo owns the quality standard and delivery process from brief to final URL reporting." },
  { title: "Manual work only", body: "Prospecting, page review, outreach and placement verification are handled by people." },
  { title: "No private blog networks", body: "Every publication exists for readers independently of Linkslo or its customers." },
  { title: "Relevance before metrics", body: "Topical fit, genuine traffic and editorial quality determine whether a source is approved." },
  { title: "Replacement protection", body: "Qualifying placements are monitored for twelve months and replaced if removed." },
];

const PUBLISHER_STANDARDS = [
  { title: "Traffic distribution", body: "Visits must be spread across a maintained archive rather than one old viral post." },
  { title: "Topical consistency", body: "The publication must genuinely cover the category it is listed under." },
  { title: "Outbound behaviour", body: "Sites publishing high volumes of unrelated commercial links are rejected." },
  { title: "Editorial signals", body: "Named authors, publishing cadence and a visible editorial process are checked." },
  { title: "Disclosure practice", body: "Commercial content must follow the publication's stated disclosure policy." },
  { title: "Quarterly re-scoring", body: "Every domain is reviewed at least every 90 days; quality drift means delisting." },
];

type Props = {
  searchParams: Promise<{
    view?: string;
    category?: string;
    subcategory?: string;
    industry?: string;
    country?: string;
  }>;
};

export default async function MarketplacePage({ searchParams }: Props) {
  const [{ view, category, subcategory, industry, country }, publisherFacets, gigFacets] = await Promise.all([
    searchParams,
    getFacets(),
    getGigFacets(),
  ]);
  const activeView = view === "services" ? "services" : view === "publishers" ? "publishers" : "gigs";
  const standards = activeView === "gigs" ? GIG_STANDARDS : activeView === "services" ? SERVICE_STANDARDS : PUBLISHER_STANDARDS;

  const headline =
    activeView === "gigs"
      ? "Find the right backlink gig for your exact brief"
      : activeView === "services"
        ? "Choose a backlink service, then choose your package"
        : "Choose the publishers yourself";
  const description =
    activeView === "gigs"
      ? "Explore 8,886 service gigs, including 6,686 individually named guest post publishers, across every legitimate backlink type, industry and target country. Compare sellers, verified reviews, delivery time and Basic, Standard and Premium packages."
      : activeView === "services"
        ? "Twenty-two provider-operated service categories with clear Starter, Growth and Scale packages and direct Linkslo delivery."
        : "For self-service teams: filter screened publishers by industry, market, authority, traffic, format and price.";

  return (
    <>
      <PageHero
        eyebrow="Backlink marketplace"
        eyebrowIcon={activeView === "publishers" ? "globe" : "link"}
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
          <MarketTab href="/marketplace" active={activeView === "gigs"} icon="users" label="Backlink gigs" count="8,886" />
          <MarketTab href="/marketplace?view=services" active={activeView === "services"} icon="link" label="Service categories" count="22" />
          <MarketTab href="/marketplace?view=publishers" active={activeView === "publishers"} icon="globe" label="Publisher inventory" count="176" />
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
            />
          ) : activeView === "services" ? (
            <ServiceShop services={BACKLINK_SERVICES} />
          ) : (
            <MarketplaceExplorer facets={publisherFacets} variant="full" />
          )}
        </div>
      </section>

      <section id="vetting" className="border-t border-line bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow={activeView === "gigs" ? "Marketplace protection" : activeView === "services" ? "Service standard" : "Publisher quality control"}
              eyebrowIcon="shield"
              title={activeView === "gigs" ? "Fiverr-style choice, with backlink-specific controls" : activeView === "services" ? "A service shop with one accountable provider" : "How a publisher earns a place in the inventory"}
              description={activeView === "gigs" ? "Broad choice should not mean anonymous quality. Every gig exposes seller history, market, scope, packages and the exact quality method before you order." : activeView === "services" ? "You buy from Linkslo directly. Scope, quality control and reporting stay with one provider." : "Roughly 37% of submitted domains never get listed. These checks decide it."}
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
                <p className="font-display text-[1.05rem] font-semibold text-ink-950">Still not sure which route fits?</p>
                <p className="mt-1 text-[0.88rem] text-ink-500">Send one target URL. A strategist will recommend a gig, direct service or publisher shortlist without pushing the highest price.</p>
              </div>
              <Button href="/contact" variant="dark" icon="arrow-right">Get a recommendation</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function MarketTab({ href, active, icon, label, count }: { href: string; active: boolean; icon: "users" | "link" | "globe"; label: string; count: string }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[0.82rem] font-semibold transition-colors ${active ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"}`}>
      <Icon name={icon} size={16} />
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[0.62rem] ${active ? "bg-white/15" : "bg-brand-50 text-brand-700"}`}>{count}</span>
    </Link>
  );
}
