import type { ToolDepth } from "@/lib/seo-tools/depth-technical";

export const SITEMAP_TOOL_DEPTH: Record<string, ToolDepth> = {
  "sitemap-validator": {
    quickAnswer: "An XML sitemap validator checks whether the file is actually parseable as a sitemap and whether its URLs are represented in a form search crawlers can understand. The useful outcome is a list of concrete structural problems: wrong root element, malformed `<loc>` values, mixed hosts or XML that is actually an HTML error page. Passing validation means the file is structurally usable; it does not mean every listed page deserves indexing.",
    professionalNotes: "Validate the published response, not only the generated file in your repository. Reverse proxies, CMS plugins and error handlers can return a branded HTML page at `/sitemap.xml` while still using status 200. On large sites, separate sitemap validity from sitemap quality: a perfectly valid file can still contain redirected, canonicalized or noindex URLs. Use sitemap validation after migrations, HTTPS changes, locale restructuring and CMS upgrades. When a file is huge, inspect generation logic as well as a sample of URLs because one bad encoding rule can affect thousands of entries even if the first page of the XML looks normal.",
    aeos: [
      { question: "What is the minimum valid XML sitemap structure?", answer: "A normal page sitemap uses a `<urlset>` root in the sitemap namespace with one or more `<url>` entries containing absolute `<loc>` URLs." },
      { question: "Can a sitemap be valid but bad for SEO?", answer: "Yes. It can be valid XML while listing redirects, duplicates, noindex pages or stale URLs that conflict with your canonical strategy." },
    ],
  },
  "sitemap-url-checker": {
    quickAnswer: "A Sitemap URL Checker audits the destinations inside a sitemap rather than only the XML wrapper. It is useful for spotting URLs that redirect, return errors or fail to resolve. Because a sitemap is supposed to represent preferred discovery targets, permanent redirects and broken destinations usually indicate that the generator is behind the live site architecture.",
    professionalNotes: "Use the tool as a sampling layer on large sitemaps, then escalate to a full crawler or server-side export when the sample reveals a pattern. Group failures by cause: old domain, old protocol, removed content, authentication, bot blocking or application error. If one category contains hundreds of redirected URLs, fix the generator instead of manually editing XML. During migrations, compare old and new sitemap URL counts and hostnames. A sudden count drop can be legitimate content pruning, but it can also expose route-generation failures that would otherwise remain invisible until crawl coverage declines.",
    aeos: [
      { question: "Should sitemap URLs return 200?", answer: "URLs listed as canonical indexable pages should normally resolve directly to successful final responses rather than redirects or errors." },
      { question: "Why does this tool sample URLs?", answer: "Sampling limits load and abuse risk while still revealing common sitemap-quality problems. Large sites should use a dedicated crawler for exhaustive checks." },
    ],
  },
  "sitemap-index-checker": {
    quickAnswer: "A Sitemap Index Checker verifies the file that points to child sitemaps. It should find a `<sitemapindex>` root, valid child `<loc>` URLs and no unnecessary duplicates. This matters when a site splits URLs by content type, locale or scale, because one stale child reference can quietly remove an entire section from the sitemap discovery path.",
    professionalNotes: "Use meaningful child grouping so coverage reports are easier to diagnose. Product, article and locale sitemaps can make sense; arbitrary splitting into hundreds of tiny files usually adds operational noise. When a child file is retired, remove its index entry rather than leaving a 404 for crawlers to rediscover indefinitely. Watch deployment order too: if the index updates before a newly generated child file becomes available, crawlers may briefly hit missing resources. On distributed systems, consider atomic publishing or stable object-storage paths so the index never references files that are not yet present.",
    aeos: [
      { question: "When do I need a sitemap index?", answer: "Use one when scale or organization requires multiple sitemap files. Small sites with one manageable sitemap do not need an index." },
      { question: "Can child sitemaps be grouped by category?", answer: "Yes, if the grouping reflects maintainable site structure and helps diagnostics. Search engines do not require arbitrary category splits." },
    ],
  },
  "sitemap-lastmod-checker": {
    quickAnswer: "A Sitemap Lastmod Checker reviews whether `<lastmod>` values look like real modification dates instead of decorative freshness signals. It checks date formatting and obvious future dates, but the deeper question is whether your application updates lastmod only when the referenced content meaningfully changes.",
    professionalNotes: "Teams often wire lastmod to `new Date()` because it is easy, which makes every URL look freshly changed every time the sitemap is generated. That destroys the information value of the field. Prefer a content record's real update timestamp when it reflects substantial edits. Be cautious with shared template changes: a footer copyright update usually should not make every article's lastmod today. If your CMS cannot distinguish meaningful content edits, omitting lastmod can be cleaner than publishing misleading data. Compare several values with editorial history before trusting an automated generator.",
    aeos: [
      { question: "Does lastmod make Google crawl a page faster?", answer: "Not automatically. Search engines decide crawl scheduling themselves and may discount lastmod values that appear unreliable." },
      { question: "Should lastmod include time?", answer: "It can. Use a valid ISO-style date or datetime and keep timezone handling consistent when including time." },
    ],
  },
  "sitemap-generator": {
    quickAnswer: "An XML Sitemap Generator turns a curated URL list into valid sitemap XML. The most important word is curated: include canonical public URLs you actually want discovered, not every route your application can render. A generator should not invent priority, changefreq or fake modification dates merely because those fields exist in examples.",
    professionalNotes: "For dynamic sites, treat manual generation as a prototype and move the final implementation into the application or CMS so it stays synchronized with content. Source URLs from the same data that drives canonical routing and filter out account pages, order flows, previews and intentional noindex content. When the site grows beyond protocol limits, split by a maintainable dimension and publish a sitemap index. Test generated output against production URL conventions: trailing slash, host, HTTPS and locale paths. A sitemap is most useful when it is boring, predictable and consistent with internal linking rather than a separate list maintained by SEO alone.",
    aeos: [
      { question: "What URLs should be in an XML sitemap?", answer: "Generally, canonical public URLs you want crawlers to discover and consider for indexing." },
      { question: "Should login or checkout pages be included?", answer: "Usually no. Utility and account routes generally do not belong in an organic-search sitemap." },
    ],
  },
};
