import type { ToolDepth } from "@/lib/seo-tools/depth-technical";

export const SOCIAL_TOOL_DEPTH: Record<string, ToolDepth> = {
  "og-tag-checker": {
    quickAnswer: "An Open Graph Tag Checker tells you what social-sharing metadata the page declares for title, description, image and canonical sharing URL. Use it to catch stale branding, missing images and template fallbacks before people share the page. A passed check means the tags exist and look structurally usable; it does not guarantee that every social platform will display them exactly the same way.",
    professionalNotes: "Treat social metadata as editorial packaging, not a duplicate of your SEO fields by default. A search title may prioritize query clarity while an Open Graph title can be written for recognition in a feed, as long as both represent the same page honestly. Images deserve special QA: verify dimensions, crop safety and public accessibility from outside your login session. Avoid temporary signed CDN URLs or preview-host assets. When a platform shows old metadata after you fix the page, remember that cache invalidation is separate from HTML correctness. Use the platform's official debugger or rescrape workflow where available instead of repeatedly changing tags that are already correct.",
    aeos: [
      { question: "Which Open Graph tags matter most?", answer: "For ordinary sharing, og:title, og:description, og:image and og:url are the most practical fields to check first." },
      { question: "Why does a social platform still show my old image?", answer: "Platforms cache preview data. If the live metadata is correct, use the platform's refresh or debugging tool to request a new scrape." },
    ],
  },
  "twitter-card-checker": {
    quickAnswer: "A Twitter/X Card Checker reviews the card type, title, description and image metadata the page provides for X-compatible previews. It is useful when social cards look incomplete or when a site relies on Open Graph fallbacks and you want to know which Twitter-specific fields are actually present.",
    professionalNotes: "Keep X metadata aligned with the real page and brand account. Remove legacy `twitter:site` handles after rebrands rather than leaving a stale association for years. If you choose `summary_large_image`, make sure the page has a real image designed for that treatment; do not declare a large card while serving a tiny logo. As with Open Graph, platform caching can hide a successful fix. Validate the source first, then refresh the platform cache. If your framework can generate both Open Graph and X metadata from one content record, use shared source data while allowing copy differences where social context genuinely benefits from them.",
    aeos: [
      { question: "Do I need Twitter-specific tags if I already have Open Graph?", answer: "Not always, because platforms may use fallbacks, but dedicated fields give you clearer control over the intended card." },
      { question: "What card type should I use?", answer: "Use the card type that matches the media you actually provide. Large-image cards make sense when a strong representative image exists." },
    ],
  },
  "meta-robots-generator": {
    quickAnswer: "A Meta Robots Generator turns an explicit indexing policy into a valid HTML meta tag. Decide the policy first—index or noindex, follow behavior and any preview restrictions—then generate the syntax. The tool should not decide which pages deserve indexing automatically because that depends on the role of the page in your site.",
    professionalNotes: "Centralize robots logic in your application. Page-by-page hand edits are fragile, especially when staging, account, search, faceted and campaign pages have different rules. Keep private pages protected by authentication rather than relying on noindex. Be careful with blanket nofollow: individual sponsored or user-generated links can be qualified at link level without changing every link on the page. If a page is accidentally noindexed at both HTML and header level, fixing only the meta tag will not solve the issue. Always verify the final production response with a checker after generating or changing directives.",
    aeos: [
      { question: "What robots tag should a normal public page use?", answer: "Often no explicit restrictive tag is needed. If you generate one, `index, follow` states the default intent but is not mandatory." },
      { question: "Is noindex enough to protect private data?", answer: "No. Noindex is a crawler instruction, not access control. Use authentication and authorization for private information." },
    ],
  },
  "seo-snippet-preview": {
    quickAnswer: "An SEO Search Snippet Preview lets you read a proposed title, URL and description together in a search-like layout. It is best used as an editorial review tool: does the result explain the page clearly, does the title distinguish it, and does the description add useful context? It cannot promise the exact search result because engines can rewrite titles and snippets for individual queries.",
    professionalNotes: "Use the preview during content QA rather than only after publication. Compare competing pages on your own site: if five tools all begin with 'Free SEO Tool Online', the meaningful entity may be buried. Make the page task recognizable early without forcing an exact character count. Descriptions should complement the title and can mention scope, limitations or a concrete benefit. For AEO-oriented pages, answer the core intent in the visible page content as well; snippet metadata cannot compensate for weak or vague body content. After indexing, use Search Console query and click data to refine wording based on real impressions rather than relying entirely on preview aesthetics.",
    aeos: [
      { question: "Can a snippet preview show exactly what Google will display?", answer: "No. It is a visual approximation; Google can rewrite titles and descriptions based on the query and page signals." },
      { question: "What should I look for in a preview?", answer: "Clarity, distinctiveness, readable URL context and a description that adds useful information rather than repeating the title." },
    ],
  },
  "serp-title-pixel-checker": {
    quickAnswer: "A SERP Title Pixel Checker estimates the rendered width of title text because different characters occupy different space. It provides more visual context than character count alone, but there is no universal Google pixel cutoff. Use the result to spot crowded titles, then edit for clarity rather than targeting an exact number.",
    professionalNotes: "Pixel tools are useful when teams understand their limits. Browser canvas measurement may use a similar but not identical font to the live SERP, and search layouts change across devices and features. Wide words, uppercase text and symbols can alter width dramatically. If a title exceeds a common working range, remove redundant branding and repeated modifiers first—not the page's central entity. Conversely, do not shorten a precise technical title until it becomes vague just to earn a green result. Track real title-link rewrites over time; frequent rewrites across a template can be a stronger signal than the pre-publication width estimate.",
    aeos: [
      { question: "Is there a fixed Google title pixel limit?", answer: "No fixed guaranteed limit. Display varies by layout, device, font and query, and Google can rewrite the title." },
      { question: "Why check pixels instead of characters?", answer: "Letters and symbols have different widths, so two titles with the same character count can occupy very different visual space." },
    ],
  },
  "meta-description-pixel-checker": {
    quickAnswer: "A Meta Description Pixel Checker estimates how wide description text may render. It is an editing aid, not a compliance test. Search engines frequently choose different snippets from the page body, so the strongest description is one that communicates the page value naturally even if its exact text is not always displayed.",
    professionalNotes: "Use width estimation to remove obvious excess, not to force every page into identical sentence length. Descriptions for tools, ecommerce products and editorial articles have different jobs. A tool description should explain the check and its value; a product description can highlight distinguishing facts; an article can summarize the answer. Avoid stale dynamic values such as 'updated today' unless the source actually updates them. When descriptions are generated at scale, test edge cases with long product names or multilingual text because visual width and grammar can break even when the template passes on a short example.",
    aeos: [
      { question: "What is a good meta description width?", answer: "There is no guaranteed universal width. Use the estimate to keep copy concise and readable rather than targeting an exact pixel number." },
      { question: "Will a short description always be shown?", answer: "No. Search engines may select different page text when it better answers the query." },
    ],
  },
  "seo-page-analyzer": {
    quickAnswer: "An SEO Page Analyzer is a triage tool. It combines major observable signals—response status, title, description, canonical, robots, headings, links, images and social metadata—so you can find obvious technical or on-page regressions quickly. It deliberately avoids fake authority, keyword-volume or 0-100 SEO scores when those data are not available.",
    professionalNotes: "Prioritize findings by consequence. An accidental noindex or 500 response matters more than a description that is slightly wider than a common guideline. Use the analyzer to decide which specialist tool to open next, then investigate the root cause. Page-level analysis does not replace a site crawl: orphan pages, duplicate titles across thousands of URLs, crawl depth and redirect networks require multi-URL data. It also does not replace first-party performance and index data. Combine it with Search Console, analytics, server logs and real user metrics for a complete diagnosis. For release QA, save a representative set of URLs by template and rerun the analyzer after major frontend or CMS changes.",
    aeos: [
      { question: "What should I fix first in an SEO page audit?", answer: "Start with failed responses, accidental noindex, serious canonical conflicts and other issues that can prevent the page from being crawled or selected correctly." },
      { question: "Why does this analyzer not give an SEO score?", answer: "A single score hides context and encourages arbitrary weighting. Transparent individual checks are more actionable and honest." },
    ],
  },
};
