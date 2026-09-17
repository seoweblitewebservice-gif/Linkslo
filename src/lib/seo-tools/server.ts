import dns from "node:dns/promises";
import net from "node:net";

export type FetchHop = { url: string; status: number; location: string | null };
export type SafeFetchResult = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  body: string;
  contentType: string;
  hops: FetchHop[];
};

const MAX_REDIRECTS = 6;
const MAX_BYTES = 1_500_000;
const REQUEST_TIMEOUT_MS = 9_000;

function isPrivateIpv4(ip: string) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

function isPrivateIpv6(ip: string) {
  const v = ip.toLowerCase();
  return (
    v === "::" ||
    v === "::1" ||
    v.startsWith("fc") ||
    v.startsWith("fd") ||
    v.startsWith("fe8") ||
    v.startsWith("fe9") ||
    v.startsWith("fea") ||
    v.startsWith("feb") ||
    v.startsWith("::ffff:127.") ||
    v.startsWith("::ffff:10.") ||
    v.startsWith("::ffff:192.168.")
  );
}

function isPrivateIp(ip: string) {
  const version = net.isIP(ip);
  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);
  return true;
}

export async function assertPublicUrl(raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Enter a valid absolute URL, including https:// or http://.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http:// and https:// URLs are supported.");
  }
  if (url.username || url.password) throw new Error("URLs containing credentials are not allowed.");

  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "0.0.0.0"
  ) {
    throw new Error("Localhost and internal network URLs are not allowed.");
  }

  if (net.isIP(host) && isPrivateIp(host)) {
    throw new Error("Private, loopback and reserved IP addresses are not allowed.");
  }

  let addresses: { address: string; family: number }[];
  try {
    addresses = await dns.lookup(host, { all: true, verbatim: true });
  } catch {
    throw new Error("The hostname could not be resolved by DNS.");
  }
  if (!addresses.length) throw new Error("The hostname did not resolve to a public IP address.");
  if (addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error("The hostname resolves to a private, loopback or reserved network address.");
  }

  return url;
}

async function readLimited(response: Response) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      try { await reader.cancel(); } catch {}
      throw new Error(`The response exceeded the ${Math.round(MAX_BYTES / 1_000_000)} MB analysis limit.`);
    }
    output += decoder.decode(value, { stream: true });
  }
  output += decoder.decode();
  return output;
}

function headersObject(headers: Headers) {
  const output: Record<string, string> = {};
  headers.forEach((value, key) => { output[key.toLowerCase()] = value; });
  return output;
}

export async function safeFetch(raw: string, init?: { method?: "GET" | "HEAD"; userAgent?: string }): Promise<SafeFetchResult> {
  let current = (await assertPublicUrl(raw)).toString();
  const requestedUrl = current;
  const hops: FetchHop[] = [];

  for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
    await assertPublicUrl(current);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(current, {
        method: init?.method ?? "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": init?.userAgent || "LinksloTechnicalSEOTool/1.0 (+https://www.linkslo.com/tools)",
          accept: "text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.5",
        },
        cache: "no-store",
      });
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof Error && error.name === "AbortError") throw new Error("The request timed out before the server responded.");
      throw new Error(`The URL could not be fetched: ${error instanceof Error ? error.message : "network error"}`);
    }
    clearTimeout(timer);

    const location = response.headers.get("location");
    hops.push({ url: current, status: response.status, location });
    const isRedirect = response.status >= 300 && response.status < 400 && Boolean(location);

    if (isRedirect && location) {
      if (i === MAX_REDIRECTS) throw new Error(`The URL exceeded the ${MAX_REDIRECTS}-redirect safety limit.`);
      current = new URL(location, current).toString();
      continue;
    }

    const body = init?.method === "HEAD" ? "" : await readLimited(response);
    return {
      requestedUrl,
      finalUrl: current,
      status: response.status,
      headers: headersObject(response.headers),
      body,
      contentType: response.headers.get("content-type") ?? "",
      hops,
    };
  }

  throw new Error("The redirect path could not be resolved safely.");
}

export function decodeEntities(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function stripTags(value: string) {
  return decodeEntities(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

export function attr(tag: string, name: string) {
  const re = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = tag.match(re);
  return decodeEntities(m?.[1] ?? m?.[2] ?? m?.[3] ?? "");
}

export function tags(html: string, tagName: string) {
  const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(re) ?? [];
}

export function metaContent(html: string, key: string, by: "name" | "property" = "name") {
  for (const tag of tags(html, "meta")) {
    if (attr(tag, by).toLowerCase() === key.toLowerCase()) return attr(tag, "content");
  }
  return "";
}

export function titleText(html: string) {
  return stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
}

export function canonicalLinks(html: string, base: string) {
  const result: string[] = [];
  for (const tag of tags(html, "link")) {
    const rel = attr(tag, "rel").toLowerCase().split(/\s+/);
    if (!rel.includes("canonical")) continue;
    const href = attr(tag, "href");
    if (!href) continue;
    try { result.push(new URL(href, base).toString()); } catch { result.push(href); }
  }
  return result;
}

export function hreflangLinks(html: string, base: string) {
  const result: { hreflang: string; href: string }[] = [];
  for (const tag of tags(html, "link")) {
    const rel = attr(tag, "rel").toLowerCase().split(/\s+/);
    if (!rel.includes("alternate")) continue;
    const hreflang = attr(tag, "hreflang");
    const href = attr(tag, "href");
    if (!hreflang || !href) continue;
    try { result.push({ hreflang, href: new URL(href, base).toString() }); } catch { result.push({ hreflang, href }); }
  }
  return result;
}

export function extractLinks(html: string, base: string) {
  const result: { href: string; anchor: string; rel: string }[] = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = `<a ${m[1]}>`;
    const raw = attr(tag, "href");
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) continue;
    try {
      result.push({ href: new URL(raw, base).toString(), anchor: stripTags(m[2]), rel: attr(tag, "rel") });
    } catch {}
    if (result.length >= 500) break;
  }
  return result;
}

export function extractHeadings(html: string) {
  const result: { level: number; text: string }[] = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) result.push({ level: Number(m[1]), text: stripTags(m[2]) });
  return result.slice(0, 200);
}

export function extractImages(html: string, base: string) {
  return tags(html, "img").slice(0, 250).map((tag) => {
    const raw = attr(tag, "src");
    let src = raw;
    try { if (raw) src = new URL(raw, base).toString(); } catch {}
    return {
      src,
      alt: attr(tag, "alt"),
      hasAlt: /\balt\s*=/i.test(tag),
      width: attr(tag, "width"),
      height: attr(tag, "height"),
      loading: attr(tag, "loading"),
    };
  });
}

export function robotsMeta(html: string) {
  const entries: { name: string; content: string }[] = [];
  for (const tag of tags(html, "meta")) {
    const name = attr(tag, "name");
    if (!name) continue;
    if (name.toLowerCase() === "robots" || name.toLowerCase().includes("bot")) {
      entries.push({ name, content: attr(tag, "content") });
    }
  }
  return entries;
}

export function socialMeta(html: string) {
  const keys = ["og:title", "og:description", "og:image", "og:url", "og:type"];
  const twitter = ["twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:site"];
  return {
    openGraph: Object.fromEntries(keys.map((key) => [key, metaContent(html, key, "property")]).filter(([, v]) => v)),
    twitter: Object.fromEntries(twitter.map((key) => [key, metaContent(html, key, "name")]).filter(([, v]) => v)),
  };
}

export function findXmlValues(xml: string, tagName: string) {
  const result: string[] = [];
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    result.push(decodeEntities(m[1].trim()));
    if (result.length >= 5000) break;
  }
  return result;
}
