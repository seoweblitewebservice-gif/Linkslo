import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Icon } from "@/components/ui/Icon";
import { BRAND } from "@/lib/content";

const FOOTER_COLUMNS = [
  {
    heading: "Backlink Services",
    links: [
      { label: "Guest Post Backlinks", href: "/backlinks/guest-post-backlinks" },
      { label: "Editorial Backlinks", href: "/backlinks/editorial-backlinks" },
      { label: "Contextual Backlinks", href: "/backlinks/contextual-backlinks" },
      { label: "Niche Edit Backlinks", href: "/backlinks/niche-edit-backlinks" },
      { label: "Authority Backlinks", href: "/backlinks/authority-backlinks" },
      { label: "Premium Link Building", href: "/backlinks/premium-link-building" },
    ],
  },
  {
    heading: "Outreach & PR",
    links: [
      { label: "Digital PR Backlinks", href: "/backlinks/digital-pr-backlinks" },
      { label: "Press Release Links", href: "/backlinks/press-release-news-backlinks" },
      { label: "Resource Link Building", href: "/backlinks/resource-link-building" },
      { label: "Broken Link Building", href: "/backlinks/broken-link-building" },
      { label: "Brand & Entity Links", href: "/backlinks/brand-entity-link-building" },
    ],
  },
  {
    heading: "By Industry",
    links: [
      { label: "SaaS Backlinks", href: "/backlinks/industry/saas" },
      { label: "Finance Backlinks", href: "/backlinks/industry/finance" },
      { label: "E-commerce Backlinks", href: "/backlinks/industry/ecommerce" },
      { label: "Health Backlinks", href: "/backlinks/industry/health" },
      { label: "All industries", href: "/backlinks/industry" },
    ],
  },
  {
    heading: "By Country",
    links: [
      { label: "USA Backlinks", href: "/backlinks/country/usa" },
      { label: "UK Backlinks", href: "/backlinks/country/uk" },
      { label: "German Backlinks", href: "/backlinks/country/germany" },
      { label: "International", href: "/backlinks/country/international" },
      { label: "All countries", href: "/backlinks/country" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/resources" },
      { label: "Sample scenarios", href: "/case-studies" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Refunds", href: "/legal/refunds" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-200">
      <div className="ink-aurora pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative">
        <div className="container-x border-b border-white/10 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <LogoMark size={40} />
                <div>
                  <p className="font-display text-lg font-semibold text-white">{BRAND.name}</p>
                  <p className="text-[0.78rem] uppercase tracking-[0.18em] text-ink-400">
                    {BRAND.tagline}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink-300">
                Compare backlink services, marketplace listings, package scope, target markets and delivery details before placing an order.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.88rem] text-ink-300 transition-colors hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="container-x border-t border-white/10 py-7">
          <div className="flex flex-col gap-3 text-[0.8rem] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} {BRAND.name}</p>
            <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-300">
              <Icon name="mail" size={14} /> {BRAND.email}
            </a>
          </div>
          <p className="mt-5 text-[0.72rem] leading-relaxed text-ink-500">
            Publisher availability, editorial approval and third-party SEO metrics can change. Search rankings and traffic outcomes depend on many factors outside any provider&apos;s control and are not guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
