import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/primitives";
import type { GlyphName } from "@/components/ui/Icon";

export function PageHero({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  breadcrumbs,
  children,
  tone = "light",
}: {
  eyebrow?: string;
  eyebrowIcon?: GlyphName;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={`relative overflow-hidden border-b ${
        dark ? "border-white/10 bg-ink-950" : "border-line bg-white"
      }`}
    >
      <div className={`${dark ? "ink-aurora" : "aurora"} pointer-events-none absolute inset-0`} aria-hidden="true" />
      {!dark && <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />}
      <div className="container-x relative py-14 sm:py-18">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem]">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <Icon
                      name="chevron-down"
                      size={13}
                      className={`-rotate-90 ${dark ? "text-ink-500" : "text-ink-300"}`}
                    />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className={`transition-colors ${
                        dark ? "text-ink-300 hover:text-white" : "text-ink-400 hover:text-brand-700"
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={dark ? "text-white" : "text-ink-700"}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-3xl">
          {eyebrow && (
            <Eyebrow icon={eyebrowIcon} tone={dark ? "light" : "brand"}>
              {eyebrow}
            </Eyebrow>
          )}
          <h1
            className={`mt-5 font-display text-[clamp(2.05rem,4.2vw,3.1rem)] font-semibold leading-[1.08] ${
              dark ? "text-white" : "text-ink-950"
            }`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`mt-5 max-w-2xl text-[1.02rem] leading-relaxed ${
                dark ? "text-ink-300" : "text-ink-500"
              }`}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
