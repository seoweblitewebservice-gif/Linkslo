"use client";

import { useMemo, useState } from "react";
import type { SeoToolDefinition } from "@/lib/seo-tools/catalog";
import { analyzeTextTool } from "@/components/seo-tools/local-text-tools";

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
  "meta-description-pixel-checker": [{ key: "text", label: "Description text", placeholder: "Check a page's canonical tag, preferred URL and common canonical conflicts.", multiline: true }],
  "content-outline-generator": [{ key: "topic", label: "Topic", placeholder: "How to check canonical tags" }],
  "faq-section-generator": [{ key: "topic", label: "Topic", placeholder: "XML sitemaps" }],
  "local-faq-generator": [{ key: "topic", label: "Local topic", placeholder: "emergency plumbing in Austin" }],
  "howto-outline-generator": [{ key: "topic", label: "Task", placeholder: "migrate a WordPress site" }],
  "comparison-page-outline-generator": [{ key: "topic", label: "Comparison", placeholder: "Ahrefs vs Semrush" }],
  "service-area-page-outline-generator": [{ key: "topic", label: "City + service", placeholder: "Roof repair in Denver" }],
  "local-citation-checklist": [{ key: "topic", label: "Business type", placeholder: "Dental clinic", defaultValue: "Local business" }],
  "mobile-performance-checklist": [{ key: "topic", label: "Page type", placeholder: "Product page", defaultValue: "Landing page" }],
  "performance-budget-generator": [{ key: "topic", label: "Site type", placeholder: "Content site", defaultValue: "Marketing site" }],
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
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
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
      const url = values.url?.trim();
      if (!validHttpUrl(url || "")) throw new Error("Enter an absolute http:// or https:// canonical URL.");
      const safeUrl = (url || "").split('"').join("'");
      return "<link rel=\"canonical\" href=\"" + safeUrl + "\" />";
    }
    case "hreflang-generator": {
      const rows = pairLines(values.pairs || "");
      if (!rows.length) throw new Error("Add at least one language and URL pair.");
      return rows
        .map(([code, url]) => {
          if (!/^(?:x-default|[a-zA-Z]{2,3}(?:-[a-zA-Z]{2})?)$/.test(code)) throw new Error(`Review hreflang code: ${code}`);
          if (!validHttpUrl(url)) throw new Error(`Review URL for ${code}.`);
          return '<link rel="alternate" hreflang="' + code + '" href="' + url + '" />';
        })
        .join("\n");
    }
    case "sitemap-generator": {
      const urls = splitLines(values.urls || "");
      if (!urls.length) throw new Error("Add at least one URL.");
      urls.forEach((u) => {
        if (!validHttpUrl(u)) throw new Error(`Invalid URL: ${u}`);
      });
      const escaped = (v: string) => {
        const a = String.fromCharCode(38) + "amp;";
        const l = String.fromCharCode(38) + "lt;";
        const g = String.fromCharCode(38) + "gt;";
        const q = String.fromCharCode(38) + "quot;";
        return v.split("&").join(a).split("<").join(l).split(">").join(g).split('"').join(q);
      };
      return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" +
        urls.map((u) => "  <url>\n    <loc>" + escaped(u) + "</loc>\n  </url>").join("\n") +
        "\n</urlset>"
      );
    }
    case "schema-markup-generator": {
      if (!values.type?.trim()) throw new Error("Enter a Schema.org type.");
      const out: Record<string, string> = { "@context": "https://schema.org", "@type": values.type.trim() };
      if (values.name?.trim()) out.name = values.name.trim();
      if (values.url?.trim()) out.url = values.url.trim();
      if (values.description?.trim()) out.description = values.description.trim();
      return json(out);
    }
    case "faq-schema-generator": {
      const rows = pairLines(values.pairs || "").filter(([q, a]) => q && a);
      if (!rows.length) throw new Error("Add at least one question and answer separated by |.");
      return json({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: rows.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      });
    }
    case "article-schema-generator": {
      if (!values.headline?.trim() || !values.url?.trim()) throw new Error("Headline and article URL are required.");
      const out: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: values.headline.trim(),
        mainEntityOfPage: values.url.trim(),
      };
      if (values.author?.trim()) out.author = { "@type": "Person", name: values.author.trim() };
      if (values.datePublished?.trim()) out.datePublished = values.datePublished.trim();
      if (values.dateModified?.trim()) out.dateModified = values.dateModified.trim();
      return json(out);
    }
    case "organization-schema-generator": {
      if (!values.name?.trim() || !values.url?.trim()) throw new Error("Organization name and URL are required.");
      const out: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: values.name.trim(),
        url: values.url.trim(),
      };
      if (values.logo?.trim()) out.logo = values.logo.trim();
      if (values.phone?.trim()) out.telephone = values.phone.trim();
      return json(out);
    }
    case "breadcrumb-schema-generator": {
      const rows = pairLines(values.pairs || "").filter(([n, u]) => n && u);
      if (!rows.length) throw new Error("Add breadcrumb label and URL pairs.");
      rows.forEach(([, u]) => {
        if (!validHttpUrl(u)) throw new Error(`Invalid breadcrumb URL: ${u}`);
      });
      return json({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: rows.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
      });
    }
    case "local-business-schema-generator": {
      if (!values.name?.trim() || !values.url?.trim()) throw new Error("Business name and URL are required.");
      return json({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: values.name.trim(),
        url: values.url.trim(),
        ...(values.phone?.trim() ? { telephone: values.phone.trim() } : {}),
        address: {
          "@type": "PostalAddress",
          ...(values.street?.trim() ? { streetAddress: values.street.trim() } : {}),
          ...(values.city?.trim() ? { addressLocality: values.city.trim() } : {}),
          ...(values.region?.trim() ? { addressRegion: values.region.trim() } : {}),
          ...(values.postal?.trim() ? { postalCode: values.postal.trim() } : {}),
          ...(values.country?.trim() ? { addressCountry: values.country.trim() } : {}),
        },
      });
    }
    case "website-schema-generator": {
      if (!values.name?.trim() || !values.url?.trim()) throw new Error("Website name and homepage URL are required.");
      const out: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: values.name.trim(),
        url: values.url.trim(),
      };
      if (values.search?.trim()) {
        out.potentialAction = {
          "@type": "SearchAction",
          target: values.search.trim(),
          "query-input": "required name=search_term_string",
        };
      }
      return json(out);
    }
    case "video-schema-generator": {
      if (!values.name?.trim() || !values.description?.trim() || !values.thumbnail?.trim() || !values.uploadDate?.trim()) {
        throw new Error("Video title, description, thumbnail and upload date are required.");
      }
      return json({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: values.name.trim(),
        description: values.description.trim(),
        thumbnailUrl: values.thumbnail.trim(),
        uploadDate: values.uploadDate.trim(),
        ...(values.contentUrl?.trim() ? { contentUrl: values.contentUrl.trim() } : {}),
      });
    }
    case "meta-robots-generator": {
      const directives = (values.directives || "").split(",").map((v) => v.trim()).filter(Boolean);
      if (!directives.length) throw new Error("Enter at least one robots directive.");
      return '<meta name="robots" content="' + directives.join(", ") + '" />';
    }
    case "content-outline-generator": {
      const topic = values.topic?.trim() || "Your topic";
      return (
        "# " +
        topic +
        "\n\n## Introduction\n- Problem and why it matters\n- Who this guide is for\n\n## Core concepts\n- Definition\n- Key terms\n\n## Step-by-step process\n1. Step one\n2. Step two\n3. Step three\n\n## Common mistakes\n- Mistake and fix\n\n## FAQ\n- Question one\n- Question two\n\n## Next actions\n- Practical checklist"
      );
    }
    case "faq-section-generator":
    case "local-faq-generator": {
      const topic = values.topic?.trim() || "this service";
      return [
        "What is " + topic + "?",
        "Who is " + topic + " for?",
        "How does " + topic + " work?",
        "How long does " + topic + " take?",
        "What does " + topic + " cost?",
      ]
        .map((q, i) => "Q" + (i + 1) + ". " + q + "\nA" + (i + 1) + ". Write a clear, specific answer in plain language.")
        .join("\n\n");
    }
    case "howto-outline-generator": {
      const topic = values.topic?.trim() || "complete this task";
      return (
        "# How to " +
        topic +
        "\n\n## Before you start\n- Requirements\n- Tools needed\n\n## Steps\n1. Prepare\n2. Execute\n3. Verify\n\n## Troubleshooting\n- Common issue and fix\n\n## Checklist\n- [ ] Done criteria"
      );
    }
    case "comparison-page-outline-generator":
      return "# Option A vs Option B\n\n## Quick summary\n## Who each option is for\n## Feature comparison table\n## Pricing considerations\n## Pros and cons\n## Recommendation scenarios\n## FAQ";
    case "service-area-page-outline-generator":
      return "# Service in [City]\n\n## Local introduction\n## Services offered\n## Why local customers choose us\n## Process\n## Service areas\n## Reviews / proof\n## FAQ\n## Contact CTA";
    case "local-citation-checklist":
    case "mobile-performance-checklist":
    case "performance-budget-generator": {
      const items =
        slug === "local-citation-checklist"
          ? [
              "Google Business Profile",
              "Apple Business Connect",
              "Bing Places",
              "Primary industry directory",
              "Local chamber listing",
              "Consistent NAP on website footer",
              "Consistent NAP on contact page",
            ]
          : slug === "mobile-performance-checklist"
            ? [
                "Responsive layout",
                "Tap targets large enough",
                "Compress hero images",
                "Defer non-critical scripts",
                "Avoid intrusive interstitials",
                "Test on a mid-tier phone",
              ]
            : [
                "HTML budget",
                "CSS budget",
                "JS budget",
                "Image budget",
                "Font budget",
                "Third-party script budget",
                "Total page weight target",
              ];
      return items.map((item, i) => i + 1 + ". [ ] " + item).join("\n");
    }
    default:
      return values.topic?.trim() || values.text?.trim() || "Add the required fields and generate again.";
  }
}

function localValidate(slug: string, value: string): ApiResult {
  const fromModule = analyzeTextTool(slug, value);
  if (fromModule && Array.isArray(fromModule.checks) && fromModule.checks.length) {
    return fromModule as ApiResult;
  }
  if (slug === "json-ld-validator" || slug === "schema-validator") {
    try {
      const parsed = JSON.parse(value);
      const checks: Check[] = [{ status: "pass", label: "Valid JSON", detail: "The supplied text parses as JSON." }];
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const contexts = items.filter((x) => x && typeof x === "object" && "@context" in x).length;
      const types = items.flatMap((x) =>
        x && typeof x === "object" && "@type" in x ? [String((x as Record<string, unknown>)["@type"])] : []
      );
      checks.push({
        status: contexts ? "pass" : "warning",
        label: "@context",
        detail: contexts ? "A linked-data @context was detected." : "No @context field was detected.",
      });
      checks.push({
        status: types.length ? "pass" : "warning",
        label: "@type",
        detail: types.length
          ? "Detected type" + (types.length === 1 ? "" : "s") + ": " + types.join(", ")
          : "No @type field was detected.",
      });
      return { checks, parsed };
    } catch (error) {
      return {
        checks: [
          {
            status: "error",
            label: "Invalid JSON",
            detail: error instanceof Error ? error.message : "The JSON could not be parsed.",
          },
        ],
      };
    }
  }
  return { checks: [{ status: "info", label: "Text received", detail: "No specialized checks are configured for this tool yet." }] };
}

function pixelWidth(text: string, font = "20px Arial") {
  if (typeof document === "undefined") return 0;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return Math.round(ctx.measureText(text).width);
}

function statusClasses(status: Check["status"]) {
  if (status === "pass") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (status === "warning") return "border-amber-200 bg-amber-50 text-amber-950";
  if (status === "error") return "border-red-200 bg-red-50 text-red-950";
  return "border-sky-200 bg-sky-50 text-sky-950";
}

function label(status: Check["status"]) {
  return status === "pass" ? "Passed" : status === "warning" ? "Warning" : status === "error" ? "Error" : "Information";
}

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
    setError("");
    setResult(null);
    setOutput("");
    try {
      if (tool.mode === "url") {
        if (!url.trim()) throw new Error("Enter a URL first.");
        setLoading(true);
        const response = await fetch("/api/seo-tools/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ tool: tool.slug, url: url.trim(), userAgent }),
        });
        const data = (await response.json()) as ApiResult;
        if (!response.ok || data.error) throw new Error(data.error || "The analysis failed.");
        setResult(data);
      } else if (tool.mode === "text") {
        if (!text.trim()) throw new Error("Paste the text you want to analyze.");
        setResult(localValidate(tool.slug, text));
      } else if (tool.mode === "preview") {
        if (tool.slug === "seo-snippet-preview") {
          setOutput("preview");
        } else {
          const width = pixelWidth(values.text || "", tool.slug === "serp-title-pixel-checker" ? "20px Arial" : "14px Arial");
          setResult({
            checks: [
              {
                status: "info",
                label: "Estimated rendered width",
                detail:
                  width +
                  "px. This is an approximation based on browser canvas text measurement, not a guaranteed search-engine cutoff.",
                value: width,
              },
              {
                status: width > (tool.slug === "serp-title-pixel-checker" ? 600 : 920) ? "warning" : "pass",
                label: "Practical review",
                detail:
                  width > (tool.slug === "serp-title-pixel-checker" ? 600 : 920)
                    ? "The text is relatively wide and may be more likely to truncate or be rewritten depending on device and query."
                    : "The estimated width is within a commonly workable desktop range, but search engines can still rewrite snippets.",
              },
            ],
          });
        }
      } else {
        setOutput(generate(tool.slug, values));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const checks = result?.checks ?? [];

  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7" aria-labelledby="tool-interface-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-700">Live tool</p>
          <h2 id="tool-interface-heading" className="mt-1 font-display text-xl font-semibold text-ink-950">
            {tool.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Results come from the input you provide. The tool does not invent traffic, rankings, backlinks or index status.
          </p>
        </div>
        <span className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink-600">No paid SEO API required</span>
      </div>

      <div className="mt-6 space-y-4">
        {tool.mode === "url" && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">{tool.inputLabel}</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={tool.placeholder}
                inputMode="url"
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            {tool.slug.includes("robots-txt") && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-800">User-agent (optional)</span>
                <input
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </label>
            )}
          </>
        )}
        {tool.mode === "text" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-800">{tool.inputLabel}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={tool.placeholder}
              rows={10}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        )}
        {(tool.mode === "generator" || tool.mode === "preview") && (
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.multiline ? "sm:col-span-2 block" : "block"}>
                <span className="mb-1.5 block text-sm font-semibold text-ink-800">{field.label}</span>
                {field.multiline ? (
                  <textarea
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={5}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                ) : (
                  <input
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                )}
              </label>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Working…" : tool.actionLabel}
          </button>
        </div>
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {checks.length > 0 && (
          <div className="grid gap-3">
            {checks.map((check) => (
              <div key={check.label + check.detail} className={"rounded-2xl border px-4 py-3 " + statusClasses(check.status)}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{check.label}</p>
                  <span className="text-[0.7rem] font-bold uppercase tracking-wide">{label(check.status)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 opacity-90">{check.detail}</p>
              </div>
            ))}
          </div>
        )}
        {output && output !== "preview" && (
          <pre className="overflow-x-auto rounded-2xl border border-line bg-canvas p-4 text-[0.82rem] leading-6 text-ink-800">{output}</pre>
        )}
        {output === "preview" && (
          <div className="rounded-2xl border border-line bg-canvas p-5">
            <p className="text-[0.75rem] text-ink-500">{values.url || "example.com"}</p>
            <p className="mt-1 text-[1.15rem] font-medium text-[#1a0dab]">{values.title || "Page title"}</p>
            <p className="mt-1 text-sm leading-6 text-ink-600">{values.description || "Meta description preview"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
