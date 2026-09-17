"use client";

import { useMemo, useState } from "react";
import type { SeoToolDefinition } from "@/lib/seo-tools/catalog";

type Check = { status: "pass" | "warning" | "error" | "info"; label: string; detail: string; value?: unknown };
type ApiResult = { checks?: Check[]; error?: string; [key: string]: unknown };

type Field = { key: string; label: string; placeholder: string; multiline?: boolean; defaultValue?: string };

const fieldsBySlug: Record<string, Field[]> = {
  "robots-txt-generator": [
    { key: "userAgent", label: "User-agent", placeholder: "*", defaultValue: "*" },
    { key: "disallow", label: "Disallow paths", placeholder: "/admin/\n/internal-search/", multiline: true },
    { key: "allow", label: "Allow exceptions", placeholder: "/admin/help/", multiline: true },
    { key: "sitemap", label: "Sitemap URL", placeholder: "https://example.com/sitemap.xml" },
  ],
  "canonical-tag-generator": [{ key: "url", label: "Preferred canonical URL", placeholder: "https://example.com/preferred-page/" }],
  "hreflang-generator": [{ key: "pairs", label: "Language and URL pairs", placeholder: "en-US | https://example.com/us/page\nfr-FR | https://example.com/fr/page\nx-default | https://example.com/choose-region", multiline: true }],
  "sitemap-generator": [{ key: "urls", label: "URLs", placeholder: "https://example.com/\nhttps://example.com/about/\nhttps://example.com/contact/", multiline: true }],
  "schema-markup-generator": [
    { key: "type", label: "Schema type", placeholder: "WebPage", defaultValue: "WebPage" },
    { key: "name", label: "Name", placeholder: "Technical SEO Tools" },
    { key: "url", label: "URL", placeholder: "https://example.com/tools/" },
    { key: "description", label: "Description", placeholder: "A practical collection of technical SEO tools.", multiline: true },
  ],
  "faq-schema-generator": [{ key: "pairs", label: "Questions and answers", placeholder: "What is a canonical tag? | A canonical tag identifies the preferred URL.\nCan it point to another domain? | Yes, when the content is genuinely equivalent.", multiline: true }],
  "article-schema-generator": [
    { key: "headline", label: "Headline", placeholder: "How to Audit Canonical Tags" },
    { key: "url", label: "Article URL", placeholder: "https://example.com/guides/canonical-tags/" },
    { key: "author", label: "Author", placeholder: "Editorial Team" },
    { key: "datePublished", label: "Date published", placeholder: "2026-09-18" },
    { key: "dateModified", label: "Date modified", placeholder: "2026-09-18" },
  ],
  "organization-schema-generator": [
    { key: "name", label: "Organization name", placeholder: "Example Ltd" },
    { key: "url", label: "Website URL", placeholder: "https://example.com/" },
    { key: "logo", label: "Logo URL", placeholder: "https://example.com/logo.png" },
    { key: "phone", label: "Phone (optional)", placeholder: "+1 555 123 4567" },
  ],
  "breadcrumb-schema-generator": [{ key: "pairs", label: "Breadcrumb label and URL", placeholder: "Home | https://example.com/\nGuides | https://example.com/guides/\nCanonical Tags | https://example.com/guides/canonical-tags/", multiline: true }],
  "local-business-schema-generator": [
    { key: "name", label: "Business name", placeholder: "Example Dental" },
    { key: "url", label: "Website URL", placeholder: "https://example.com/" },
    { key: "phone", label: "Telephone", placeholder: "+1 555 123 4567" },
    { key: "street", label: "Street address", placeholder: "123 Main Street" },
    { key: "city", label: "City", placeholder: "Austin" },
    { key: "region", label: "Region / state", placeholder: "TX" },
    { key: "postal", label: "Postal code", placeholder: "78701" },
    { key: "country", label: "Country code", placeholder: "US" },
  ],
  "website-schema-generator": [
    { key: "name", label: "Website name", placeholder: "Example" },
    { key: "url", label: "Homepage URL", placeholder: "https://example.com/" },
    { key: "search", label: "Site search URL template (optional)", placeholder: "https://example.com/search?q={search_term_string}" },
  ],
  "video-schema-generator": [
    { key: "name", label: "Video title", placeholder: "Canonical Tags Explained" },
    { key: "description", label: "Video description", placeholder: "A practical walkthrough of canonical URL implementation.", multiline: true },
    { key: "thumbnail", label: "Thumbnail URL", placeholder: "https://example.com/video-thumb.jpg" },
    { key: "uploadDate", label: "Upload date", placeholder: "2026-09-18" },
    { key: "contentUrl", label: "Video or embed URL", placeholder: "https://example.com/video.mp4" },
  ],
  "meta-robots-generator": [{ key: "directives", label: "Robots directives", placeholder: "index, follow, max-image-preview:large", defaultValue: "index, follow" }],
  "seo-snippet-preview": [
    { key: "title", label: "Title", placeholder: "Canonical URL Checker - Test Canonical Tags" },
    { key: "url", label: "Display URL", placeholder: "https://example.com/canonical-url-checker/" },
    { key: "description", label: "Description", placeholder: "Check a page's canonical tag and identify common canonicalization problems.", multiline: true },
  ],
  "serp-title-pixel-checker": [{ key: "text", label: "Title text", placeholder: "Canonical URL Checker - Test Canonical Tags" }],
  "meta-description-pixel-checker": [{ key: "text", label: "Description text", placeholder: "Check a page's canonical tag, preferred URL and common canonical conflicts." , multiline: true}],
};

function splitLines(value: string) {
  return value.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
}

function pairLines(value: string) {
  return splitLines(value).map((line) => {
    const idx = line.indexOf("|");
    return idx === -1 ? [line.trim(), ""] : [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
  });
}

function validHttpUrl(value: string) {
  try { const u = new URL(value); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function generate(slug: string, values: Record<string, string>) {
  switch (slug) {
    case "robots-txt-generator": {
      const ua = values.userAgent?.trim() || "*";
      const lines = [`User-agent: ${ua}`];
      splitLines(values.disallow || "").forEach((p) => lines.push(`Disallow: ${p.startsWith("/") ? p : `/${p}`}`));
      splitLines(values.allow || "").forEach((p) => lines.push(`Allow: ${p.startsWith("/") ? p : `/${p}`}`));
      if (values.sitemap?.trim()) {
        if (!validHttpUrl(values.sitemap.trim())) throw new Error("Sitemap must be an absolute http:// or https:// URL.");
        lines.push("", `Sitemap: ${values.sitemap.trim()}`);
      }
      return lines.join("\n");
    }
    case "canonical-tag-generator": {
      const url = values.url?.trim(); if (!validHttpUrl(url)) throw new Error("Enter an absolute http:// or https:// canonical URL.");
      return `<link rel="canonical" href="${url.replace(/"/g, "&quot;")}" />`;
    }
    case "hreflang-generator": {
      const rows = pairLines(values.pairs || ""); if (!rows.length) throw new Error("Add at least one language and URL pair.");
      return rows.map(([code, url]) => {
        if (!/^(?:x-default|[a-zA-Z]{2,3}(?:-[a-zA-Z]{2})?)$/.test(code)) throw new Error(`Review hreflang code: ${code}`);
        if (!validHttpUrl(url)) throw new Error(`Review URL for ${code}.`);
        return `<link rel="alternate" hreflang="${code}" href="${url}" />`;
      }).join("\n");
    }
    case "sitemap-generator": {
      const urls = splitLines(values.urls || ""); if (!urls.length) throw new Error("Add at least one URL.");
      urls.forEach((u) => { if (!validHttpUrl(u)) throw new Error(`Invalid URL: ${u}`); });
      const escaped = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url>\n    <loc>${escaped(u)}</loc>\n  </url>`).join("\n")}\n</urlset>`;
    }
    case "schema-markup-generator": {
      if (!values.type?.trim()) throw new Error("Enter a Schema.org type.");
      const out: Record<string, string> = { "@context": "https://schema.org", "@type": values.type.trim() };
      if (values.name?.trim()) out.name = values.name.trim(); if (values.url?.trim()) out.url = values.url.trim(); if (values.description?.trim()) out.description = values.description.trim();
      return json(out);
    }
    case "faq-schema-generator": {
      const rows = pairLines(values.pairs || "").filter(([q, a]) => q && a); if (!rows.length) throw new Error("Add at least one question and answer separated by |.");
      return json({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: rows.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
    }
    case "article-schema-generator": {
      if (!values.headline?.trim() || !values.url?.trim()) throw new Error("Headline and article URL are required.");
      const out: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Article", headline: values.headline.trim(), mainEntityOfPage: values.url.trim() };
      if (values.author?.trim()) out.author = { "@type": "Person", name: values.author.trim() }; if (values.datePublished?.trim()) out.datePublished = values.datePublished.trim(); if (values.dateModified?.trim()) out.dateModified = values.dateModified.trim();
      return json(out);
    }
    case "organization-schema-generator": {
      if (!values.name?.trim() || !values.url?.trim()) throw new Error("Organization name and URL are required.");
      const out: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Organization", name: values.name.trim(), url: values.url.trim() };
      if (values.logo?.trim()) out.logo = values.logo.trim(); if (values.phone?.trim()) out.telephone = values.phone.trim(); return json(out);
    }
    case "breadcrumb-schema-generator": {
      const rows = pairLines(values.pairs || "").filter(([n, u]) => n && u); if (!rows.length) throw new Error("Add breadcrumb label and URL pairs.");
      rows.forEach(([, u]) => { if (!validHttpUrl(u)) throw new Error(`Invalid breadcrumb URL: ${u}`); });
      return json({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: rows.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) });
    }
    case "local-business-schema-generator": {
      if (!values.name?.trim() || !values.url?.trim()) throw new Error("Business name and URL are required.");
      return json({ "@context": "https://schema.org", "@type": "LocalBusiness", name: values.name.trim(), url: values.url.trim(), ...(values.phone?.trim() ? { telephone: values.phone.trim() } : {}), address: { "@type": "PostalAddress", ...(values.street?.trim() ? { streetAddress: values.street.trim() } : {}), ...(values.city?.trim() ? { addressLocality: values.city.trim() } : {}), ...(values.region?.trim() ? { addressRegion: values.region.trim() } : {}), ...(values.postal?.trim() ? { postalCode: values.postal.trim() } : {}), ...(values.country?.trim() ? { addressCountry: values.country.trim() } : {}) } });
    }
    case "website-schema-generator": {
      if (!values.name?.trim() || !values.url?.trim()) throw new Error("Website name and homepage URL are required.");
      const out: Record<string, unknown> = { "@context": "https://schema.org", "@type": "WebSite", name: values.name.trim(), url: values.url.trim() };
      if (values.search?.trim()) out.potentialAction = { "@type": "SearchAction", target: values.search.trim(), "query-input": "required name=search_term_string" }; return json(out);
    }
    case "video-schema-generator": {
      if (!values.name?.trim() || !values.description?.trim() || !values.thumbnail?.trim() || !values.uploadDate?.trim()) throw new Error("Video title, description, thumbnail and upload date are required.");
      return json({ "@context": "https://schema.org", "@type": "VideoObject", name: values.name.trim(), description: values.description.trim(), thumbnailUrl: values.thumbnail.trim(), uploadDate: values.uploadDate.trim(), ...(values.contentUrl?.trim() ? { contentUrl: values.contentUrl.trim() } : {}) });
    }
    case "meta-robots-generator": {
      const directives = (values.directives || "").split(",").map((v) => v.trim()).filter(Boolean); if (!directives.length) throw new Error("Enter at least one robots directive.");
      return `<meta name="robots" content="${directives.join(", ")}" />`;
    }
    default: return "";
  }
}

function localValidate(slug: string, value: string): ApiResult {
  if (slug === "json-ld-validator" || slug === "schema-validator") {
    try {
      const parsed = JSON.parse(value);
      const checks: Check[] = [{ status: "pass", label: "Valid JSON", detail: "The supplied text parses as JSON." }];
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const contexts = items.filter((x) => x && typeof x === "object" && "@context" in x).length;
      const types = items.flatMap((x) => x && typeof x === "object" && "@type" in x ? [String((x as Record<string, unknown>)["@type"])] : []);
      checks.push({ status: contexts ? "pass" : "warning", label: "@context", detail: contexts ? "A linked-data @context was detected." : "No @context field was detected." });
      checks.push({ status: types.length ? "pass" : "warning", label: "@type", detail: types.length ? `Detected type${types.length === 1 ? "" : "s"}: ${types.join(", ")}` : "No @type field was detected." });
      return { checks, parsed };
    } catch (error) { return { checks: [{ status: "error", label: "Invalid JSON", detail: error instanceof Error ? error.message : "The JSON could not be parsed." }] }; }
  }
  return { checks: [] };
}

function pixelWidth(text: string, font = "20px Arial") {
  if (typeof document === "undefined") return 0;
  const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d"); if (!ctx) return 0; ctx.font = font; return Math.round(ctx.measureText(text).width);
}

function statusClasses(status: Check["status"]) {
  if (status === "pass") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (status === "warning") return "border-amber-200 bg-amber-50 text-amber-950";
  if (status === "error") return "border-red-200 bg-red-50 text-red-950";
  return "border-sky-200 bg-sky-50 text-sky-950";
}

function label(status: Check["status"]) { return status === "pass" ? "Passed" : status === "warning" ? "Warning" : status === "error" ? "Error" : "Information"; }

export function ToolRunner({ tool }: { tool: SeoToolDefinition }) {
  const [url, setUrl] = useState("");
  const [userAgent, setUserAgent] = useState("Googlebot");
  const fields = fieldsBySlug[tool.slug] ?? [];
  const initialValues = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""])), [fields]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [text, setText] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setError(""); setResult(null); setOutput("");
    try {
      if (tool.mode === "url") {
        if (!url.trim()) throw new Error("Enter a URL first.");
        setLoading(true);
        const response = await fetch("/api/seo-tools/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tool: tool.slug, url: url.trim(), userAgent }) });
        const data = await response.json() as ApiResult;
        if (!response.ok || data.error) throw new Error(data.error || "The analysis failed.");
        setResult(data);
      } else if (tool.mode === "text") {
        if (!text.trim()) throw new Error("Paste the markup you want to validate."); setResult(localValidate(tool.slug, text));
      } else if (tool.mode === "preview") {
        if (tool.slug === "seo-snippet-preview") { setOutput("preview"); }
        else {
          const width = pixelWidth(values.text || "", tool.slug === "serp-title-pixel-checker" ? "20px Arial" : "14px Arial");
          setResult({ checks: [{ status: "info", label: "Estimated rendered width", detail: `${width}px. This is an approximation based on browser canvas text measurement, not a guaranteed search-engine cutoff.`, value: width }, { status: width > (tool.slug === "serp-title-pixel-checker" ? 600 : 920) ? "warning" : "pass", label: "Practical review", detail: width > (tool.slug === "serp-title-pixel-checker" ? 600 : 920) ? "The text is relatively wide and may be more likely to truncate or be rewritten depending on device and query." : "The estimated width is within a commonly workable desktop range, but search engines can still rewrite snippets." }] });
        }
      } else {
        setOutput(generate(tool.slug, values));
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  const checks = result?.checks ?? [];

  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7" aria-labelledby="tool-interface-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-700">Live tool</p><h2 id="tool-interface-heading" className="mt-1 font-display text-xl font-semibold text-ink-950">{tool.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">Results come from the input you provide. The tool does not invent traffic, rankings, backlinks or index status.</p></div>
        <span className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink-600">No paid SEO API required</span>
      </div>

      <div className="mt-6 space-y-4">
        {tool.mode === "url" && <>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-ink-800">{tool.inputLabel}</span><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={tool.placeholder} inputMode="url" className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" /></label>
          {tool.slug === "robots-txt-tester" && <label className="block max-w-sm"><span className="mb-1.5 block text-sm font-semibold text-ink-800">Crawler / user-agent</span><input value={userAgent} onChange={(e) => setUserAgent(e.target.value)} className="h-11 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-brand-400" /></label>}
        </>}
        {tool.mode === "text" && <label className="block"><span className="mb-1.5 block text-sm font-semibold text-ink-800">{tool.inputLabel}</span><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={tool.placeholder} rows={12} className="w-full rounded-xl border border-line bg-white p-4 font-mono text-xs leading-6 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" /></label>}
        {(tool.mode === "generator" || tool.mode === "preview") && <div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className={field.multiline ? "block sm:col-span-2" : "block"}><span className="mb-1.5 block text-sm font-semibold text-ink-800">{field.label}</span>{field.multiline ? <textarea rows={5} value={values[field.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} placeholder={field.placeholder} className="w-full rounded-xl border border-line p-4 text-sm leading-6 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" /> : <input value={values[field.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} placeholder={field.placeholder} className="h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />}</label>)}</div>}

        <button onClick={run} disabled={loading} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60">{loading ? "Analyzing…" : tool.actionLabel}</button>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><strong>Could not run the tool.</strong> {error}</div>}
      </div>

      {tool.slug === "seo-snippet-preview" && output === "preview" && <div className="mt-7 rounded-2xl border border-line bg-white p-5"><p className="truncate text-[0.82rem] text-[#202124]">{values.url || "https://example.com/page"}</p><p className="mt-1 text-[1.25rem] leading-7 text-[#1a0dab]">{values.title || "Example search result title"}</p><p className="mt-1 max-w-2xl text-[0.9rem] leading-6 text-[#4d5156]">{values.description || "Add a meta description to preview the text here. Search engines may choose different snippet text for a real query."}</p><p className="mt-3 text-xs text-ink-400">Visual approximation only. Search engines can rewrite titles and descriptions.</p></div>}

      {output && output !== "preview" && <div className="mt-7"><div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-display text-base font-semibold text-ink-950">Generated output</h3><button type="button" onClick={() => navigator.clipboard?.writeText(output)} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700">Copy output</button></div><pre className="max-h-[30rem] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-ink-950 p-5 text-xs leading-6 text-ink-100">{output}</pre></div>}

      {checks.length > 0 && <div className="mt-7" aria-live="polite"><h3 className="font-display text-base font-semibold text-ink-950">Results</h3><div className="mt-3 grid gap-3">{checks.map((check, index) => <div key={`${check.label}-${index}`} className={`rounded-xl border p-4 ${statusClasses(check.status)}`}><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">{check.label}</p><span className="rounded-full bg-white/70 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide">{label(check.status)}</span></div><p className="mt-1.5 text-sm leading-6 opacity-85">{check.detail}</p></div>)}</div></div>}

      {result && Object.keys(result).some((key) => !["checks", "error"].includes(key)) && <details className="mt-5 rounded-xl border border-line bg-canvas p-4"><summary className="cursor-pointer text-sm font-semibold text-ink-800">Technical details</summary><pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-ink-600">{JSON.stringify(Object.fromEntries(Object.entries(result).filter(([key]) => !["checks", "error"].includes(key))), null, 2)}</pre></details>}
    </section>
  );
}
