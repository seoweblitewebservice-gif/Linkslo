"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { SeoToolDefinition, SeoToolCategory } from "@/lib/seo-tools/catalog";

const CATEGORY_DESCRIPTIONS: Record<SeoToolCategory, string> = {
  "Technical SEO": "Robots, canonicals, hreflang, redirects, status codes and indexability signals.",
  "XML Sitemaps": "Validate, inspect and generate XML sitemap files and sitemap indexes.",
  "Structured Data": "Validate JSON-LD and generate factual Schema.org markup.",
  "On-Page SEO": "Links, headings, images, metadata and URL structure checks.",
  "Social & SERP": "Open Graph, X Cards, robots directives and search-snippet previews.",
};

export function ToolDirectory({ tools, categories }: { tools: SeoToolDefinition[]; categories: SeoToolCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SeoToolCategory | "All">("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (category !== "All" && tool.category !== category) return false;
      if (!q) return true;
      return [tool.name, tool.summary, tool.primaryEntity, ...tool.relatedEntities].join(" ").toLowerCase().includes(q);
    });
  }, [tools, query, category]);

  return <>
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative block">
          <span className="sr-only">Search SEO tools</span>
          <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search canonical, redirect, schema, sitemap…" className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Tool categories">
          {["All", ...categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item as SeoToolCategory | "All")} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${category === item ? "bg-ink-950 text-white" : "border border-line bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700"}`}>{item}</button>)}
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-400">Showing {visible.length} of {tools.length} technical SEO tools.</p>
    </div>

    <div className="mt-8 space-y-10">
      {categories.map((group) => {
        const items = visible.filter((tool) => tool.category === group);
        if (!items.length) return null;
        return <section key={group}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><h2 className="font-display text-xl font-semibold text-ink-950">{group}</h2><p className="mt-1 text-sm text-ink-500">{CATEGORY_DESCRIPTIONS[group]}</p></div><span className="text-xs font-semibold text-ink-400">{items.length} tool{items.length === 1 ? "" : "s"}</span></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((tool) => <Link key={tool.slug} href={`/${tool.slug}/`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon name={tool.category === "XML Sitemaps" || tool.category === "Structured Data" ? "document" : tool.category === "Social & SERP" ? "search" : "sliders"} size={17} /></span><span className="rounded-full bg-canvas px-2.5 py-1 text-[0.63rem] font-semibold uppercase tracking-wide text-ink-400">Free</span></div>
              <h3 className="mt-4 font-display text-[1rem] font-semibold text-ink-950 transition group-hover:text-brand-700">{tool.name}</h3>
              <p className="mt-2 flex-1 text-[0.82rem] leading-6 text-ink-500">{tool.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">Open tool <Icon name="arrow-right" size={13} /></span>
            </Link>)}
          </div>
        </section>;
      })}
      {!visible.length && <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center"><p className="font-semibold text-ink-900">No matching tools</p><p className="mt-1 text-sm text-ink-500">Try a broader term such as “canonical”, “schema”, “redirect” or “meta”.</p></div>}
    </div>
  </>;
}
