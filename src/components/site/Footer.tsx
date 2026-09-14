import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Icon } from "@/components/ui/Icon";
import { BRAND, FOOTER_COLUMNS } from "@/lib/content";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    path: "M6.2 9.4h2.9v9.2H6.2V9.4Zm1.45-4.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM11 9.4h2.8v1.3h.05c.39-.72 1.35-1.48 2.78-1.48 2.97 0 3.52 1.9 3.52 4.37v5h-2.9v-4.43c0-1.06-.02-2.42-1.5-2.42-1.5 0-1.73 1.15-1.73 2.34v4.51H11V9.4Z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M5 5h3.4l3.3 4.6L15.5 5H19l-5.3 6.4L19.4 19H16l-3.6-5-4.2 5H4.7l5.7-6.9L5 5Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M21 12s0-3-.4-4.4a2.2 2.2 0 0 0-1.6-1.6C17.6 5.6 12 5.6 12 5.6s-5.6 0-7 .4A2.2 2.2 0 0 0 3.4 7.6C3 9 3 12 3 12s0 3 .4 4.4c.2.8.8 1.4 1.6 1.6 1.4.4 7 .4 7 .4s5.6 0 7-.4a2.2 2.2 0 0 0 1.6-1.6C21 15 21 12 21 12Zm-10.7 2.8V9.2L15 12l-4.7 2.8Z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    path: "M12 4a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2 .4-2.5-.5-2.7-1-.1-.3-.6-1-1-1.2-.3-.2-.8-.6 0-.6.7 0 1.2.7 1.4 1 .8 1.3 2 1 2.5.7.1-.6.3-1 .6-1.2-2-.2-3.9-1-3.9-4.3 0-1 .3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9a8 8 0 0 1 4.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.3.3.3.6.8.6 1.7v2.5c0 .2.1.5.5.4A8 8 0 0 0 12 4Z",
  },
];

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
                A specialist backlink marketplace for teams that treat link building as long-term
                infrastructure — screened publishers, three transparent packages per service, and
                every placement reviewed by a person before it goes live.
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
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1 text-[0.8rem] text-ink-400">
              <p>
                © {year} {BRAND.legalName} B.V. · {BRAND.addressLines.join(" · ")}
              </p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mail" size={14} /> {BRAND.email}
                </span>
                <span>{BRAND.phone}</span>
                <span className="inline-flex items-center gap-1.5 text-brand-300">
                  <Icon name="shield" size={14} /> GDPR compliant
                </span>
              </p>
            </div>
            <ul className="flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-ink-200 transition-colors hover:border-brand-400/60 hover:bg-brand-500/15 hover:text-brand-200"
                  >
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 text-[0.72rem] leading-relaxed text-ink-500">
            Metrics, case studies, dashboard figures and testimonials shown on this site use
            representative sample data for demonstration. Search results depend on many factors
            outside any provider&apos;s control — we do not promise specific rankings.
          </p>
        </div>
      </div>
    </footer>
  );
}
