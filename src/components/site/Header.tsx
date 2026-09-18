"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { PRIMARY_NAV } from "@/lib/content";

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || openMenu || mobileOpen
          ? "border-b border-line bg-white/90 shadow-[0_1px_0_rgba(6,20,25,0.04)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const hasPanel = Boolean(item.columns);
            const active = isActive(item.href);
            if (!hasPanel) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`hidden rounded-lg px-3 py-2 text-[0.87rem] font-medium transition-colors xl:block ${
                    active ? "text-brand-700" : "text-ink-600 hover:text-ink-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            const open = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu(item.label);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(open ? null : item.label)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[0.87rem] font-medium transition-colors ${
                    open || active ? "text-brand-700" : "text-ink-600 hover:text-ink-950"
                  }`}
                >
                  {item.label}
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={`transition-transform duration-250 ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/track-order" size="sm" icon="arrow-right">
            Track Order
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {PRIMARY_NAV.filter((item) => item.columns).map((item) => {
        const open = openMenu === item.label;
        if (!open) return null;
        return (
          <div
            key={item.label}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full hidden lg:block"
          >
            <div className="container-x pb-6 pt-2">
              <div className="animate-fade-scale overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_80px_-40px_rgba(6,20,25,0.35)]">
                <div
                  className={`grid gap-0 ${
                    item.wide
                      ? "lg:grid-cols-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_0.85fr]"
                      : "md:grid-cols-[1fr_1fr_0.9fr]"
                  }`}
                >
                  {item.columns?.map((column) => (
                    <div key={column.heading} className="border-r border-line p-6 last:border-r-0">
                      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-400">
                        {column.heading}
                      </p>
                      <ul className="space-y-1">
                        {column.items.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-brand-50/70"
                            >
                              {link.icon && (
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-600 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700">
                                  <Icon name={link.icon} size={16} />
                                </span>
                              )}
                              <span>
                                <span className="block text-[0.88rem] font-semibold text-ink-900">
                                  {link.label}
                                </span>
                                {link.description && (
                                  <span className="block text-[0.78rem] leading-snug text-ink-500">
                                    {link.description}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {item.feature && (
                    <div className="relative overflow-hidden bg-ink-950 p-6 text-white">
                      <div className="ink-aurora absolute inset-0 opacity-90" />
                      <div className="relative">
                        <p className="font-display text-lg font-semibold">{item.feature.title}</p>
                        <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-200">{item.feature.body}</p>
                        <Link
                          href={item.feature.href}
                          className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand-300 hover:text-brand-200"
                        >
                          {item.feature.cta}
                          <Icon name="arrow-right" size={15} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <div className="container-x flex min-h-full flex-col gap-6 py-6">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => {
                if (!item.columns) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-xl px-3 py-3 text-[1rem] font-medium text-ink-800 hover:bg-ink-50"
                    >
                      {item.label}
                    </Link>
                  );
                }
                const open = mobileSection === item.label;
                return (
                  <div key={item.label} className="border-b border-line/70 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setMobileSection(open ? null : item.label)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[1rem] font-medium text-ink-800"
                    >
                      {item.label}
                      <Icon
                        name="chevron-down"
                        size={17}
                        className={`text-ink-400 transition-transform duration-250 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <ul className="space-y-0.5 pb-3 pl-3">
                          {item.columns.flatMap((column) => column.items).map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.92rem] text-ink-600 hover:bg-brand-50/70 hover:text-brand-800"
                              >
                                {link.icon && <Icon name={link.icon} size={16} />}
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pb-8">
              <Button href="/track-order" size="lg" fullWidth icon="arrow-right">
                Track your order
              </Button>
              <p className="text-center text-[0.78rem] text-ink-400">
                No account or registration required
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
