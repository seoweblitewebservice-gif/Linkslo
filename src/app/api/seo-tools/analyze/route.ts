import { NextRequest, NextResponse } from "next/server";
import { getSeoTool } from "@/lib/seo-tools/catalog";
import {
  safeFetch,
  assertPublicUrl,
  attr,
  canonicalLinks,
  extractHeadings,
  extractImages,
  extractLinks,
  findXmlValues,
  hreflangLinks,
  metaContent,
  robotsMeta,
  socialMeta,
  tags,
  titleText,
} from "@/lib/seo-tools/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Check = {
  status: "pass" | "warning" | "error" | "info";
  label: string;
  detail: string;
  value?: string | number | boolean | null;
};

const bucket = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string) {
  const now = Date.now();
  const current = bucket.get(ip);
  if (!current || current.reset < now) {
    bucket.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 25;
}

function result(checks: Check[], extra: Record<string, unknown> = {}) {
  return { checks, ...extra };
}

function htmlOnly(contentType: string) {
  return /text\/html|application\/xhtml\+xml/i.test(contentType);
}

function statusCheck(status: number): Check {
  if (status >= 200 && status < 300) return { status: "pass", label: `HTTP ${status}`, detail: "The final request returned a successful response." };
  if (status >= 300 && status < 400) return { status: "warning", label: `HTTP ${status}`, detail: "The final response is a redirect and should be reviewed." };
  if (status >= 400 && status < 500) return { status: "error", label: `HTTP ${status}`, detail: "The server returned a client error for this URL." };
  return { status: "error", label: `HTTP ${status}`, detail: "The server returned a server-side error." };
}

function normalizePath(value: string) {
  try {
    const u = new URL(value);
    return `${u.pathname}${u.search}` || "/";
  } catch {
    return value;
  }
}

function robotsDecision(text: string, requestedUrl: string, userAgent: string) {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/\s*#.*$/, "").trim()).filter(Boolean);
  const groups: { agents: string[]; rules: { type: "allow" | "disallow"; path: string }[] }[] = [];
  let current: { agents: string[]; rules: { type: "allow" | "disallow"; path: string }[] } | null = null;
  let seenRule = false;
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!current || seenRule) {
        current = { agents: [], rules: [] };
        groups.push(current);
        seenRule = false;
      }
      current.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && current) {
      current.rules.push({ type: key, path: value });
      seenRule = true;
    }
  }

  const ua = userAgent.toLowerCase();
  const matching = groups.filter((g) => g.agents.some((a) => a === "*" || ua.includes(a)));
  const specific = matching.filter((g) => g.agents.some((a) => a !== "*" && ua.includes(a)));
  const chosen = specific.length ? specific : matching.filter((g) => g.agents.includes("*"));
  const path = normalizePath(requestedUrl);
  const rules = chosen.flatMap((g) => g.rules).filter((r) => r.path !== "" && path.startsWith(r.path.replace(/\*$/, "")));
  rules.sort((a, b) => b.path.length - a.path.length || (a.type === "allow" ? -1 : 1));
  const matched = rules[0] ?? null;
  return { allowed: matched?.type !== "disallow", matched, path, groups: groups.length };
}

function validateRobots(text: string): Check[] {
  const checks: Check[] = [];
  const lines = text.split(/\r?\n/);
  let haveAgent = false;
  let agents = 0;
  let sitemaps = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i].replace(/\s*#.*$/, "").trim();
    if (!raw) continue;
    const idx = raw.indexOf(":");
    if (idx === -1) {
      checks.push({ status: "warning", label: `Line ${i + 1}`, detail: `No directive separator found: ${raw}` });
      continue;
    }
    const key = raw.slice(0, idx).trim().toLowerCase();
    const value = raw.slice(idx + 1).trim();
    if (key === "user-agent") { haveAgent = true; agents += 1; if (!value) checks.push({ status: "error", label: `Line ${i + 1}`, detail: "User-agent is empty." }); }
    else if (key === "allow" || key === "disallow") {
      if (!haveAgent) checks.push({ status: "error", label: `Line ${i + 1}`, detail: `${key} appears before a User-agent group.` });
      if (/^https?:\/\//i.test(value)) checks.push({ status: "warning", label: `Line ${i + 1}`, detail: `${key} normally expects a path rather than an absolute URL.` });
    } else if (key === "sitemap") {
      sitemaps += 1;
      try { new URL(value); } catch { checks.push({ status: "error", label: `Line ${i + 1}`, detail: "Sitemap value should be an absolute URL." }); }
    } else if (key === "noindex") {
      checks.push({ status: "warning", label: `Line ${i + 1}`, detail: "Noindex in robots.txt is not a supported modern indexing control. Use meta robots or X-Robots-Tag." });
    } else if (!new Set(["crawl-delay", "host", "clean-param"]).has(key)) {
      checks.push({ status: "info", label: `Line ${i + 1}`, detail: `Unrecognized or crawler-specific directive: ${key}` });
    }
  }
  checks.unshift({ status: agents ? "pass" : "warning", label: "User-agent groups", detail: agents ? `${agents} User-agent directive${agents === 1 ? "" : "s"} detected.` : "No User-agent directive was found.", value: agents });
  checks.push({ status: "info", label: "Sitemap declarations", detail: `${sitemaps} Sitemap directive${sitemaps === 1 ? "" : "s"} detected.`, value: sitemaps });
  return checks;
}

function parseSitemap(xml: string) {
  const trimmed = xml.replace(/^\uFEFF/, "").trim();
  const root = /<sitemapindex\b/i.test(trimmed) ? "sitemapindex" : /<urlset\b/i.test(trimmed) ? "urlset" : "unknown";
  return { root, locs: findXmlValues(xml, "loc"), lastmods: findXmlValues(xml, "lastmod") };
}

function validLastmod(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}(?:T[^\s]+)?$/.test(value)) return false;
  return !Number.isNaN(Date.parse(value));
}

async function sampleStatuses(urls: string[], limit = 15) {
  const sampled = urls.slice(0, limit);
  const rows: { url: string; status: number | null; finalUrl?: string; error?: string }[] = [];
  for (const url of sampled) {
    try {
      await assertPublicUrl(url);
      const r = await safeFetch(url, { method: "HEAD" });
      rows.push({ url, status: r.status, finalUrl: r.finalUrl });
    } catch (error) {
      rows.push({ url, status: null, error: error instanceof Error ? error.message : "Request failed" });
    }
  }
  return rows;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (rateLimit(ip)) return NextResponse.json({ error: "Too many tool requests. Please wait about a minute and try again." }, { status: 429 });

  let payload: { tool?: string; url?: string; userAgent?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const tool = payload.tool ? getSeoTool(payload.tool) : undefined;
  if (!tool || tool.mode !== "url") return NextResponse.json({ error: "Unknown or unsupported URL-analysis tool." }, { status: 400 });
  if (!payload.url) return NextResponse.json({ error: "Enter a URL to analyze." }, { status: 400 });

  try {
    if (tool.slug === "robots-txt-tester" || tool.slug === "robots-txt-validator") {
      const input = await assertPublicUrl(payload.url);
      const robotsUrl = new URL("/robots.txt", input.origin).toString();
      const r = await safeFetch(robotsUrl, { userAgent: payload.userAgent });
      if (tool.slug === "robots-txt-validator") {
        return NextResponse.json(result([statusCheck(r.status), ...validateRobots(r.body)], { robotsUrl, source: r.body.slice(0, 100_000) }));
      }
      const decision = robotsDecision(r.body, input.toString(), payload.userAgent || "Googlebot");
      const checks: Check[] = [
        statusCheck(r.status),
        { status: decision.allowed ? "pass" : "warning", label: decision.allowed ? "Allowed by robots.txt" : "Blocked by robots.txt", detail: decision.matched ? `Matched ${decision.matched.type.toUpperCase()}: ${decision.matched.path}` : "No matching Allow/Disallow rule was found, so the path is allowed by default." },
        { status: "info", label: "Tested path", detail: decision.path },
      ];
      return NextResponse.json(result(checks, { robotsUrl, decision, source: r.body.slice(0, 100_000) }));
    }

    const r = await safeFetch(payload.url);
    const common = { requestedUrl: r.requestedUrl, finalUrl: r.finalUrl, status: r.status, hops: r.hops, contentType: r.contentType };

    if (["redirect-checker", "redirect-chain-checker", "redirect-loop-checker", "http-status-code-checker"].includes(tool.slug)) {
      const urls = r.hops.map((h) => h.url);
      const duplicate = urls.find((u, i) => urls.indexOf(u) !== i);
      const checks: Check[] = [statusCheck(r.status)];
      if (tool.slug === "redirect-chain-checker") checks.unshift({ status: r.hops.length > 2 ? "warning" : "pass", label: "Redirect hops", detail: `${Math.max(0, r.hops.length - 1)} redirect hop${r.hops.length - 1 === 1 ? "" : "s"} before the final response.`, value: Math.max(0, r.hops.length - 1) });
      if (tool.slug === "redirect-loop-checker") checks.unshift({ status: duplicate ? "error" : "pass", label: duplicate ? "Repeated URL detected" : "No loop observed", detail: duplicate ? `The redirect path repeated ${duplicate}.` : `The request reached a final response in ${r.hops.length} request${r.hops.length === 1 ? "" : "s"}.` });
      return NextResponse.json(result(checks, common));
    }

    if (tool.slug.startsWith("sitemap-")) {
      const parsed = parseSitemap(r.body);
      if (tool.slug === "sitemap-validator") {
        const checks: Check[] = [statusCheck(r.status), { status: parsed.root === "unknown" ? "error" : "pass", label: "Sitemap root element", detail: parsed.root === "unknown" ? "No <urlset> or <sitemapindex> root element was detected." : `Detected <${parsed.root}>.`, value: parsed.root }, { status: parsed.locs.length ? "pass" : "warning", label: "URL entries", detail: `${parsed.locs.length} <loc> value${parsed.locs.length === 1 ? "" : "s"} found.`, value: parsed.locs.length }];
        const invalid = parsed.locs.filter((u) => { try { const x = new URL(u); return !/^https?:$/.test(x.protocol); } catch { return true; } });
        if (invalid.length) checks.push({ status: "error", label: "Invalid loc values", detail: `${invalid.length} loc value${invalid.length === 1 ? " is" : "s are"} not a valid HTTP(S) absolute URL.` });
        return NextResponse.json(result(checks, { ...common, root: parsed.root, locs: parsed.locs.slice(0, 100), lastmods: parsed.lastmods.slice(0, 100) }));
      }
      if (tool.slug === "sitemap-index-checker") {
        const checks: Check[] = [statusCheck(r.status), { status: parsed.root === "sitemapindex" ? "pass" : "warning", label: "Sitemap index root", detail: parsed.root === "sitemapindex" ? "A <sitemapindex> root was detected." : `Detected ${parsed.root}; this does not appear to be a sitemap index.` }, { status: parsed.locs.length ? "pass" : "warning", label: "Child sitemaps", detail: `${parsed.locs.length} child sitemap URL${parsed.locs.length === 1 ? "" : "s"} detected.`, value: parsed.locs.length }];
        const duplicates = parsed.locs.filter((u, i) => parsed.locs.indexOf(u) !== i);
        if (duplicates.length) checks.push({ status: "warning", label: "Duplicate child sitemaps", detail: `${new Set(duplicates).size} duplicate sitemap URL${new Set(duplicates).size === 1 ? "" : "s"} detected.` });
        return NextResponse.json(result(checks, { ...common, root: parsed.root, locs: parsed.locs.slice(0, 200) }));
      }
      if (tool.slug === "sitemap-lastmod-checker") {
        const invalid = parsed.lastmods.filter((v) => !validLastmod(v));
        const future = parsed.lastmods.filter((v) => validLastmod(v) && Date.parse(v) > Date.now() + 86_400_000);
        const checks: Check[] = [statusCheck(r.status), { status: parsed.lastmods.length ? "pass" : "info", label: "Lastmod values", detail: `${parsed.lastmods.length} <lastmod> value${parsed.lastmods.length === 1 ? "" : "s"} found.`, value: parsed.lastmods.length }, { status: invalid.length ? "error" : "pass", label: "Date formatting", detail: invalid.length ? `${invalid.length} lastmod value${invalid.length === 1 ? " is" : "s are"} not recognized as ISO-style dates.` : "Detected lastmod values use recognizable ISO-style date formatting." }];
        if (future.length) checks.push({ status: "warning", label: "Future lastmod dates", detail: `${future.length} value${future.length === 1 ? " is" : "s are"} dated in the future.` });
        return NextResponse.json(result(checks, { ...common, lastmods: parsed.lastmods.slice(0, 200) }));
      }
      const rows = await sampleStatuses(parsed.locs, 15);
      const bad = rows.filter((x) => x.status === null || (x.status ?? 0) >= 400);
      const redirected = rows.filter((x) => x.finalUrl && x.finalUrl !== x.url);
      return NextResponse.json(result([statusCheck(r.status), { status: parsed.locs.length ? "pass" : "warning", label: "Sitemap URLs", detail: `${parsed.locs.length} URLs were found; up to 15 were sampled to keep the check responsible.`, value: parsed.locs.length }, { status: bad.length ? "error" : "pass", label: "Sampled errors", detail: bad.length ? `${bad.length} sampled URL${bad.length === 1 ? " failed or returned" : "s failed or returned"} an error status.` : "No error status was detected in the sampled URLs." }, { status: redirected.length ? "warning" : "pass", label: "Sampled redirects", detail: redirected.length ? `${redirected.length} sampled sitemap URL${redirected.length === 1 ? " redirects" : "s redirect"}. Sitemaps should normally contain final canonical URLs.` : "No redirects were observed in the sampled sitemap URLs." }], { ...common, rows, totalUrls: parsed.locs.length }));
    }

    if (!htmlOnly(r.contentType)) {
      const checks: Check[] = [statusCheck(r.status), { status: "info", label: "Content type", detail: r.contentType || "No Content-Type header was returned." }];
      if (tool.slug === "x-robots-tag-checker" || tool.slug === "noindex-checker" || tool.slug === "indexability-checker") {
        const xr = r.headers["x-robots-tag"] || "";
        checks.push({ status: /noindex/i.test(xr) ? "warning" : "pass", label: "X-Robots-Tag", detail: xr || "No X-Robots-Tag header was detected.", value: xr || null });
      }
      return NextResponse.json(result(checks, { ...common, headers: r.headers }));
    }

    const html = r.body;
    const title = titleText(html);
    const description = metaContent(html, "description");
    const canonicals = canonicalLinks(html, r.finalUrl);
    const robots = robotsMeta(html);
    const xr = r.headers["x-robots-tag"] || "";
    const headings = extractHeadings(html);
    const links = extractLinks(html, r.finalUrl);
    const images = extractImages(html, r.finalUrl);
    const social = socialMeta(html);
    const hreflangs = hreflangLinks(html, r.finalUrl);
    const baseHost = new URL(r.finalUrl).hostname;
    const internal = links.filter((l) => { try { return new URL(l.href).hostname === baseHost; } catch { return false; } });
    const external = links.filter((l) => { try { return new URL(l.href).hostname !== baseHost; } catch { return false; } });

    switch (tool.slug) {
      case "canonical-url-checker": {
        const checks: Check[] = [statusCheck(r.status), { status: canonicals.length === 1 ? "pass" : canonicals.length === 0 ? "warning" : "error", label: "Canonical declarations", detail: canonicals.length === 1 ? `Canonical: ${canonicals[0]}` : canonicals.length === 0 ? "No rel=canonical link was detected." : `${canonicals.length} canonical links were detected; use one clear declaration.`, value: canonicals.length }];
        if (canonicals[0]) checks.push({ status: canonicals[0] === r.finalUrl ? "pass" : "info", label: canonicals[0] === r.finalUrl ? "Self-referencing canonical" : "Canonical points elsewhere", detail: canonicals[0] === r.finalUrl ? "The canonical matches the final fetched URL." : `The page declares ${canonicals[0]} as preferred.` });
        return NextResponse.json(result(checks, { ...common, canonicals }));
      }
      case "hreflang-checker": {
        const seen = new Set<string>();
        const duplicateCodes = hreflangs.filter((x) => { const k = x.hreflang.toLowerCase(); const dup = seen.has(k); seen.add(k); return dup; });
        const invalid = hreflangs.filter((x) => !/^(?:x-default|[a-z]{2,3}(?:-[A-Z]{2})?)$/.test(x.hreflang));
        return NextResponse.json(result([statusCheck(r.status), { status: hreflangs.length ? "pass" : "warning", label: "Hreflang annotations", detail: `${hreflangs.length} alternate hreflang link${hreflangs.length === 1 ? "" : "s"} detected.`, value: hreflangs.length }, { status: invalid.length ? "warning" : "pass", label: "Language-region format", detail: invalid.length ? `${invalid.length} hreflang value${invalid.length === 1 ? " needs" : "s need"} manual code review.` : "Detected codes use a conventional language or language-region pattern." }, { status: duplicateCodes.length ? "warning" : "pass", label: "Duplicate language targets", detail: duplicateCodes.length ? `${duplicateCodes.length} repeated hreflang value${duplicateCodes.length === 1 ? " was" : "s were"} found.` : "No duplicate hreflang values were detected." }], { ...common, hreflangs, canonicals }));
      }
      case "indexability-checker": {
        const directives = `${robots.map((x) => x.content).join(",")},${xr}`.toLowerCase();
        const noindex = /(?:^|[,\s])noindex(?:$|[,\s])/.test(directives);
        return NextResponse.json(result([statusCheck(r.status), { status: noindex ? "error" : "pass", label: noindex ? "Noindex detected" : "No noindex directive detected", detail: noindex ? "The current response contains an explicit noindex directive." : "No meta/header noindex directive was observed in this response." }, { status: canonicals.length <= 1 ? "pass" : "error", label: "Canonical signal", detail: canonicals.length === 0 ? "No canonical tag was detected; this is not automatically an error." : canonicals.length === 1 ? `Canonical: ${canonicals[0]}` : "Multiple canonical declarations were detected." }], { ...common, robots, xRobotsTag: xr, canonicals, note: "This reports technical eligibility signals, not Google's actual index state." }));
      }
      case "noindex-checker": {
        const entries = [...robots.map((x) => `${x.name}: ${x.content}`), ...(xr ? [`X-Robots-Tag: ${xr}`] : [])];
        const noindex = entries.some((x) => /noindex/i.test(x));
        return NextResponse.json(result([statusCheck(r.status), { status: noindex ? "error" : "pass", label: noindex ? "Noindex detected" : "No noindex detected", detail: noindex ? entries.filter((x) => /noindex/i.test(x)).join(" | ") : "No noindex directive was found in meta robots or X-Robots-Tag." }], { ...common, robots, xRobotsTag: xr }));
      }
      case "meta-robots-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: robots.length ? "pass" : "info", label: "Robots meta tags", detail: robots.length ? `${robots.length} robots-related meta tag${robots.length === 1 ? "" : "s"} detected.` : "No robots meta tag was detected; default crawler behavior may apply.", value: robots.length }], { ...common, robots }));
      case "x-robots-tag-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: /noindex/i.test(xr) ? "warning" : "pass", label: "X-Robots-Tag", detail: xr || "No X-Robots-Tag response header was detected.", value: xr || null }], { ...common, xRobotsTag: xr, headers: r.headers }));
      case "url-structure-checker":
      case "seo-slug-checker": {
        const u = new URL(r.requestedUrl);
        const slug = u.pathname.split("/").filter(Boolean).at(-1) || "";
        const checks: Check[] = [
          { status: u.protocol === "https:" ? "pass" : "warning", label: "Protocol", detail: `URL uses ${u.protocol.replace(":", "").toUpperCase()}.` },
          { status: r.requestedUrl.length <= 100 ? "pass" : "warning", label: "URL length", detail: `${r.requestedUrl.length} characters. Length alone is not a ranking score, but very long URLs can be harder to maintain.`, value: r.requestedUrl.length },
          { status: u.searchParams.size <= 2 ? "pass" : "warning", label: "Query parameters", detail: `${u.searchParams.size} parameter${u.searchParams.size === 1 ? "" : "s"} detected.`, value: u.searchParams.size },
          { status: /[_\s]/.test(slug) ? "warning" : "pass", label: "Slug separators", detail: slug ? `Final slug: ${decodeURIComponent(slug)}` : "The URL points to the host root." },
        ];
        return NextResponse.json(result(checks, { ...common, parsed: { protocol: u.protocol, host: u.host, pathname: u.pathname, search: u.search, slug } }));
      }
      case "internal-link-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: internal.length ? "pass" : "warning", label: "Internal links", detail: `${internal.length} internal link${internal.length === 1 ? "" : "s"} found in the fetched HTML.`, value: internal.length }, { status: internal.some((l) => !l.anchor) ? "warning" : "pass", label: "Empty internal anchors", detail: `${internal.filter((l) => !l.anchor).length} internal link${internal.filter((l) => !l.anchor).length === 1 ? " has" : "s have"} no text anchor in the parsed HTML.` }], { ...common, links: internal.slice(0, 200) }));
      case "internal-link-analyzer": {
        const counts = new Map<string, number>(); internal.forEach((l) => counts.set(l.href, (counts.get(l.href) ?? 0) + 1));
        const repeated = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
        return NextResponse.json(result([statusCheck(r.status), { status: "info", label: "Internal link count", detail: `${internal.length} internal link instances point to ${counts.size} unique destinations.`, value: internal.length }, { status: "info", label: "Unique destinations", detail: `${counts.size} unique internal destinations detected.`, value: counts.size }], { ...common, links: internal.slice(0, 250), repeated }));
      }
      case "external-link-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: "info", label: "External links", detail: `${external.length} external link${external.length === 1 ? "" : "s"} found.`, value: external.length }, { status: "info", label: "Qualified links", detail: `${external.filter((l) => /\b(?:nofollow|sponsored|ugc)\b/i.test(l.rel)).length} external link${external.filter((l) => /\b(?:nofollow|sponsored|ugc)\b/i.test(l.rel)).length === 1 ? " has" : "s have"} nofollow, sponsored or ugc rel values.` }], { ...common, links: external.slice(0, 200) }));
      case "broken-link-checker": {
        const unique = [...new Set(links.map((l) => l.href))].slice(0, 15);
        const rows = await sampleStatuses(unique, 15);
        const broken = rows.filter((x) => x.status === null || (x.status ?? 0) >= 400);
        return NextResponse.json(result([statusCheck(r.status), { status: broken.length ? "warning" : "pass", label: "Sampled broken links", detail: broken.length ? `${broken.length} of ${rows.length} sampled destination${rows.length === 1 ? "" : "s"} failed or returned an error status.` : `No error status was observed in ${rows.length} sampled destinations.` }, { status: "info", label: "Scope", detail: `${links.length} link instances were found. To avoid abusive crawling, this check samples at most 15 unique destinations per run.` }], { ...common, rows, totalLinks: links.length }));
      }
      case "anchor-text-analyzer": {
        const anchors = links.map((l) => l.anchor.trim()).filter(Boolean);
        const genericWords = /^(click here|here|read more|learn more|website|link|more)$/i;
        const urlLike = /^https?:\/\//i;
        return NextResponse.json(result([statusCheck(r.status), { status: "info", label: "Anchors analyzed", detail: `${anchors.length} non-empty text anchors detected.`, value: anchors.length }, { status: anchors.some((a) => genericWords.test(a)) ? "warning" : "pass", label: "Generic anchors", detail: `${anchors.filter((a) => genericWords.test(a)).length} generic anchor${anchors.filter((a) => genericWords.test(a)).length === 1 ? " was" : "s were"} detected.` }, { status: "info", label: "URL anchors", detail: `${anchors.filter((a) => urlLike.test(a)).length} URL-style anchor${anchors.filter((a) => urlLike.test(a)).length === 1 ? " was" : "s were"} detected.` }], { ...common, anchors: anchors.slice(0, 250) }));
      }
      case "heading-checker": {
        const h1 = headings.filter((h) => h.level === 1);
        let jumps = 0; for (let i = 1; i < headings.length; i += 1) if (headings[i].level - headings[i - 1].level > 1) jumps += 1;
        return NextResponse.json(result([statusCheck(r.status), { status: h1.length === 1 ? "pass" : "warning", label: "H1 count", detail: `${h1.length} H1 heading${h1.length === 1 ? "" : "s"} detected.`, value: h1.length }, { status: jumps ? "warning" : "pass", label: "Heading level jumps", detail: jumps ? `${jumps} abrupt level jump${jumps === 1 ? " was" : "s were"} detected in document order.` : "No abrupt heading-level jumps were detected." }], { ...common, headings }));
      }
      case "image-alt-checker": {
        const missing = images.filter((i) => !i.hasAlt); const empty = images.filter((i) => i.hasAlt && !i.alt); const long = images.filter((i) => i.alt.length > 180);
        return NextResponse.json(result([statusCheck(r.status), { status: missing.length ? "warning" : "pass", label: "Missing alt attributes", detail: `${missing.length} image${missing.length === 1 ? " is" : "s are"} missing an alt attribute.`, value: missing.length }, { status: "info", label: "Empty alt attributes", detail: `${empty.length} image${empty.length === 1 ? " uses" : "s use"} alt=\"\". This can be correct for decorative images.`, value: empty.length }, { status: long.length ? "warning" : "pass", label: "Very long alt text", detail: `${long.length} alt value${long.length === 1 ? " exceeds" : "s exceed"} 180 characters and deserves manual review.` }], { ...common, images }));
      }
      case "image-seo-checker": {
        const missingDimensions = images.filter((i) => !i.width || !i.height);
        const genericNames = images.filter((i) => /(?:^|\/)(?:img|image|photo|dsc|untitled)[-_]?\d*\.(?:jpe?g|png|webp|gif|avif)(?:$|\?)/i.test(i.src));
        return NextResponse.json(result([statusCheck(r.status), { status: images.length ? "pass" : "info", label: "Images", detail: `${images.length} image element${images.length === 1 ? "" : "s"} found.`, value: images.length }, { status: missingDimensions.length ? "warning" : "pass", label: "Width/height attributes", detail: `${missingDimensions.length} image${missingDimensions.length === 1 ? " lacks" : "s lack"} an explicit width or height attribute.` }, { status: genericNames.length ? "warning" : "pass", label: "Generic filenames", detail: `${genericNames.length} image source${genericNames.length === 1 ? " looks" : "s look"} generically named.` }], { ...common, images }));
      }
      case "meta-title-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: title ? "pass" : "error", label: "Title tag", detail: title || "No title tag text was detected." }, { status: title.length >= 20 && title.length <= 70 ? "pass" : "warning", label: "Title length", detail: `${title.length} characters. Character count is a writing aid, not a guaranteed SERP display limit.`, value: title.length }], { ...common, title }));
      case "meta-description-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: description ? "pass" : "warning", label: "Meta description", detail: description || "No meta description was detected." }, { status: description.length >= 70 && description.length <= 180 ? "pass" : "warning", label: "Description length", detail: `${description.length} characters. Search engines may rewrite snippets regardless of length.`, value: description.length }], { ...common, description }));
      case "meta-tag-checker":
        return NextResponse.json(result([statusCheck(r.status), { status: title ? "pass" : "warning", label: "Title", detail: title || "Missing" }, { status: description ? "pass" : "warning", label: "Meta description", detail: description || "Missing" }, { status: canonicals.length === 1 ? "pass" : "warning", label: "Canonical", detail: canonicals[0] || "No single canonical detected" }, { status: "info", label: "Robots metadata", detail: robots.length ? robots.map((x) => `${x.name}: ${x.content}`).join(" | ") : "No robots meta tag detected" }], { ...common, title, description, canonicals, robots, social }));
      case "og-tag-checker": {
        const og = social.openGraph as Record<string, string>;
        return NextResponse.json(result([statusCheck(r.status), ...["og:title", "og:description", "og:image", "og:url"].map((key) => ({ status: og[key] ? "pass" as const : "warning" as const, label: key, detail: og[key] || "Not detected" }))], { ...common, openGraph: og }));
      }
      case "twitter-card-checker": {
        const tw = social.twitter as Record<string, string>;
        return NextResponse.json(result([statusCheck(r.status), ...["twitter:card", "twitter:title", "twitter:description", "twitter:image"].map((key) => ({ status: tw[key] ? "pass" as const : "warning" as const, label: key, detail: tw[key] || "Not detected" }))], { ...common, twitter: tw }));
      }
      case "seo-page-analyzer": {
        const directives = `${robots.map((x) => x.content).join(",")},${xr}`.toLowerCase();
        const checks: Check[] = [statusCheck(r.status), { status: title ? "pass" : "error", label: "Title tag", detail: title || "Missing title tag." }, { status: description ? "pass" : "warning", label: "Meta description", detail: description || "No meta description detected." }, { status: canonicals.length === 1 ? "pass" : "warning", label: "Canonical", detail: canonicals[0] || "No single canonical detected." }, { status: /noindex/.test(directives) ? "error" : "pass", label: "Indexing directive", detail: /noindex/.test(directives) ? "Noindex was detected." : "No noindex directive was detected." }, { status: headings.filter((h) => h.level === 1).length === 1 ? "pass" : "warning", label: "H1", detail: `${headings.filter((h) => h.level === 1).length} H1 element${headings.filter((h) => h.level === 1).length === 1 ? "" : "s"} detected.` }, { status: "info", label: "Links", detail: `${internal.length} internal and ${external.length} external link instances found.` }, { status: images.some((i) => !i.hasAlt) ? "warning" : "pass", label: "Image alt attributes", detail: `${images.filter((i) => !i.hasAlt).length} image${images.filter((i) => !i.hasAlt).length === 1 ? " is" : "s are"} missing an alt attribute.` }];
        return NextResponse.json(result(checks, { ...common, title, description, canonicals, robots, xRobotsTag: xr, headings: headings.slice(0, 100), linkCounts: { internal: internal.length, external: external.length }, imageCount: images.length, social }));
      }
      default:
        return NextResponse.json(result([statusCheck(r.status)], { ...common }));
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The analysis failed." }, { status: 400 });
  }
}
