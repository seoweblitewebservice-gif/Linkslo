import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/primitives";

const LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Backlink Services", href: "/backlinks" },
  { label: "Free SEO Tools", href: "/tools" },
  { label: "Knowledge hub", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <LogoMark size={48} />
        <p className="mt-6 font-mono text-[0.8rem] font-semibold tracking-[0.2em] text-brand-700">
          ERROR 404
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold text-ink-950">
          That page has moved or never existed
        </h1>
        <p className="mt-4 max-w-lg text-[1rem] text-ink-500">
          The link may be outdated. Try one of the sections below, or head back to the marketplace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" icon="arrow-right">
            Back to home
          </Button>
          <Button href="/marketplace" variant="outline">
            Open marketplace
          </Button>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.84rem] font-medium text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-800"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
