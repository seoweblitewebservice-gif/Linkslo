export type SeoToolCategory =
  | "Technical SEO"
  | "XML Sitemaps"
  | "Structured Data"
  | "On-Page SEO"
  | "Social & SERP";

export type SeoToolMode = "url" | "text" | "generator" | "preview";

export type SeoToolDefinition = {
  slug: string;
  name: string;
  category: SeoToolCategory;
  mode: SeoToolMode;
  summary: string;
  metaDescription: string;
  primaryEntity: string;
  relatedEntities: string[];
  actionLabel: string;
  inputLabel: string;
  placeholder: string;
  related: string[];
};

export const SEO_TOOL_CATEGORIES: SeoToolCategory[] = [
  "Technical SEO",
  "XML Sitemaps",
  "Structured Data",
  "On-Page SEO",
  "Social & SERP",
];

export const SEO_TOOLS: SeoToolDefinition[] = [
  {
    slug: "robots-txt-tester",
    name: "Robots.txt Tester",
    category: "Technical SEO",
    mode: "url",
    summary: "Test whether a specific URL is allowed or blocked for a crawler and see the robots.txt rule that controls the decision.",
    metaDescription: "Test robots.txt rules for any URL and crawler. See matched directives, crawl permission and practical technical SEO guidance.",
    primaryEntity: "robots.txt",
    relatedEntities: ["user-agent", "Disallow", "Allow", "crawler", "crawlability", "Googlebot", "path matching"],
    actionLabel: "Test robots.txt",
    inputLabel: "URL to test",
    placeholder: "https://example.com/private/page",
    related: ["robots-txt-validator", "robots-txt-generator", "noindex-checker", "x-robots-tag-checker", "indexability-checker"],
  },
  {
    slug: "robots-txt-validator",
    name: "Robots.txt Validator",
    category: "Technical SEO",
    mode: "url",
    summary: "Fetch and validate a site's robots.txt file for directive syntax, formatting problems and crawl-control mistakes.",
    metaDescription: "Validate a live robots.txt file for syntax, unsupported directives, formatting problems and common crawl configuration mistakes.",
    primaryEntity: "robots.txt validation",
    relatedEntities: ["robots.txt syntax", "User-agent", "Disallow", "Allow", "Sitemap", "crawl directives", "Googlebot"],
    actionLabel: "Validate robots.txt",
    inputLabel: "Website URL",
    placeholder: "https://example.com",
    related: ["robots-txt-tester", "robots-txt-generator", "sitemap-validator", "indexability-checker"],
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Technical SEO",
    mode: "generator",
    summary: "Build a clean robots.txt file from crawler rules, blocked paths and sitemap locations without hand-writing directives.",
    metaDescription: "Generate a valid robots.txt file with user-agent, Allow, Disallow and Sitemap directives, then copy the finished file.",
    primaryEntity: "robots.txt generation",
    relatedEntities: ["User-agent", "Disallow", "Allow", "Sitemap", "crawl rules", "Googlebot"],
    actionLabel: "Generate robots.txt",
    inputLabel: "Rules",
    placeholder: "Disallow paths, one per line",
    related: ["robots-txt-tester", "robots-txt-validator", "sitemap-generator", "indexability-checker"],
  },
  {
    slug: "canonical-url-checker",
    name: "Canonical URL Checker",
    category: "Technical SEO",
    mode: "url",
    summary: "Inspect a webpage's rel=canonical implementation, resolve the declared canonical URL and flag common conflicts.",
    metaDescription: "Check a page's canonical tag, preferred URL, status and common canonicalization conflicts with clear recommendations.",
    primaryEntity: "canonical URL",
    relatedEntities: ["rel=canonical", "canonical tag", "duplicate URLs", "preferred URL", "indexing", "redirects", "HTTPS"],
    actionLabel: "Check canonical",
    inputLabel: "Page URL",
    placeholder: "https://example.com/page",
    related: ["canonical-tag-generator", "redirect-checker", "indexability-checker", "url-structure-checker"],
  },
  {
    slug: "canonical-tag-generator",
    name: "Canonical Tag Generator",
    category: "Technical SEO",
    mode: "generator",
    summary: "Generate a correctly formatted rel=canonical link element for the preferred version of a page.",
    metaDescription: "Create a valid rel=canonical HTML tag for your preferred URL and avoid common canonical formatting mistakes.",
    primaryEntity: "canonical tag",
    relatedEntities: ["rel=canonical", "preferred URL", "duplicate content", "HTML head", "absolute URL"],
    actionLabel: "Generate canonical tag",
    inputLabel: "Preferred URL",
    placeholder: "https://example.com/preferred-page",
    related: ["canonical-url-checker", "url-structure-checker", "indexability-checker"],
  },
  {
    slug: "hreflang-checker",
    name: "Hreflang Checker",
    category: "Technical SEO",
    mode: "url",
    summary: "Inspect hreflang tags, language-region codes, duplicate entries and reciprocal references on multilingual pages.",
    metaDescription: "Check hreflang implementation, language and region codes, x-default, duplicates and return-link issues on a live page.",
    primaryEntity: "hreflang",
    relatedEntities: ["hreflang attribute", "language code", "region code", "x-default", "international SEO", "return link"],
    actionLabel: "Check hreflang",
    inputLabel: "Page URL",
    placeholder: "https://example.com/en/page",
    related: ["hreflang-generator", "canonical-url-checker", "sitemap-validator"],
  },
  {
    slug: "hreflang-generator",
    name: "Hreflang Generator",
    category: "Technical SEO",
    mode: "generator",
    summary: "Create valid hreflang link elements for language and regional page variants, including optional x-default markup.",
    metaDescription: "Generate valid hreflang tags for multilingual or multi-region pages using language-region codes and absolute URLs.",
    primaryEntity: "hreflang tag",
    relatedEntities: ["language code", "region code", "x-default", "alternate URL", "international SEO"],
    actionLabel: "Generate hreflang tags",
    inputLabel: "Language and URL pairs",
    placeholder: "en-US | https://example.com/us/page",
    related: ["hreflang-checker", "canonical-url-checker", "sitemap-generator"],
  },
  {
    slug: "redirect-checker",
    name: "Redirect Checker",
    category: "Technical SEO",
    mode: "url",
    summary: "Follow a URL request and show each HTTP redirect until the final destination, including response status at every hop.",
    metaDescription: "Check URL redirects, status codes and final destination with a clear redirect path and practical SEO interpretation.",
    primaryEntity: "HTTP redirect",
    relatedEntities: ["301", "302", "307", "308", "Location header", "final URL", "HTTP status"],
    actionLabel: "Check redirects",
    inputLabel: "URL",
    placeholder: "https://example.com/old-page",
    related: ["redirect-chain-checker", "redirect-loop-checker", "http-status-code-checker", "canonical-url-checker"],
  },
  {
    slug: "redirect-chain-checker",
    name: "Redirect Chain Checker",
    category: "Technical SEO",
    mode: "url",
    summary: "Reveal multi-hop redirect chains so you can find unnecessary hops, mixed protocols and inefficient destination paths.",
    metaDescription: "Find redirect chains and view every URL and HTTP status in the sequence from the starting URL to the final page.",
    primaryEntity: "redirect chain",
    relatedEntities: ["redirect hop", "301", "302", "HTTP status", "Location header", "crawl efficiency"],
    actionLabel: "Check redirect chain",
    inputLabel: "Starting URL",
    placeholder: "https://example.com/old-url",
    related: ["redirect-checker", "redirect-loop-checker", "http-status-code-checker"],
  },
  {
    slug: "redirect-loop-checker",
    name: "Redirect Loop Checker",
    category: "Technical SEO",
    mode: "url",
    summary: "Detect circular redirect behavior and identify the URLs involved before browsers or crawlers hit a redirect limit.",
    metaDescription: "Detect redirect loops, inspect repeated URLs and identify where a redirect path becomes circular or fails to resolve.",
    primaryEntity: "redirect loop",
    relatedEntities: ["too many redirects", "HTTP redirect", "301", "302", "Location header", "circular redirect"],
    actionLabel: "Check redirect loop",
    inputLabel: "URL",
    placeholder: "https://example.com/page",
    related: ["redirect-checker", "redirect-chain-checker", "http-status-code-checker"],
  },
];

export const SEO_TOOL_BY_SLUG = new Map(SEO_TOOLS.map((tool) => [tool.slug, tool]));

export function getSeoTool(slug: string) {
  return SEO_TOOL_BY_SLUG.get(slug);
}

export function toolsByCategory(category: SeoToolCategory) {
  return SEO_TOOLS.filter((tool) => tool.category === category);
}
