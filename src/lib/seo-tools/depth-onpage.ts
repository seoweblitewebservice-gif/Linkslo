import type { ToolDepth } from "@/lib/seo-tools/depth-technical";

export const ONPAGE_TOOL_DEPTH: Record<string, ToolDepth> = {
  "internal-link-checker": {
    quickAnswer: "An Internal Link Checker shows which same-site URLs a page points to and the anchor text attached to those links. Use it to answer practical questions: does this page help users reach the next useful resource, are important destinations linked directly, and are anchors understandable without forcing exact-match keywords? The goal is stronger navigation and topical connection, not maximizing a link count.",
    professionalNotes: "Interpret links by template. A category page naturally contains many product links; an editorial guide may have fewer but more contextual destinations. Separate site-wide navigation from body links before deciding a page is overlinked. During migrations, look for internal URLs that still pass through redirects because those are easy wins: update the source to the final canonical page. Also inspect pages with high search visibility for links to newly important content. Internal linking works best as an editorial workflow—when a new guide is published, update older relevant pages that genuinely benefit from referencing it rather than adding global footer links solely for SEO.",
    aeos: [
      { question: "What makes a good internal link?", answer: "A useful destination, a direct canonical URL and anchor text that helps the reader understand what they will find." },
      { question: "Can a page have too many internal links?", answer: "There is no fixed number, but excessive repetitive links can reduce usability and make the important paths harder to see." },
    ],
  },
  "internal-link-analyzer": {
    quickAnswer: "An Internal Link Analyzer looks at distribution rather than only inventory. It compares total link instances with unique destinations and repeated targets, helping you see whether a page's linking pattern is dominated by navigation, cards or a small number of URLs. That context is more useful than a generic 'internal link score'.",
    professionalNotes: "Use repeated-destination data to find template behavior, not automatically delete duplicates. A header and footer will naturally repeat key destinations. The more interesting question is whether body content contributes distinct, contextually relevant paths. For hub pages, broad distribution can be intentional; for conversion pages, a focused path may be better. Pair this analysis with click data when available: a heavily repeated link that users never click may not deserve its visual prominence. Across a site, deeper modeling requires crawling many pages, so treat one-page distribution as a local diagnostic that can reveal patterns worth investigating in a full crawl.",
    aeos: [
      { question: "What is link distribution?", answer: "It describes how a page's internal link instances are spread across unique destination URLs." },
      { question: "Should every important page receive a body link?", answer: "Not from every page. It should receive relevant internal links from pages where that connection helps users and reflects the site structure." },
    ],
  },
  "external-link-checker": {
    quickAnswer: "An External Link Checker inventories outbound links and their anchors and rel attributes. External links are not inherently harmful. The important checks are whether the destination supports the point being made, whether commercial relationships are qualified and disclosed appropriately, and whether the source still exists.",
    professionalNotes: "Review external links as part of editorial maintenance. Primary sources are preferable for regulation, statistics and technical standards because they reduce the risk of citing a secondary article that misstates the original. For affiliate, sponsored or user-generated links, use the rel values and disclosures appropriate to the relationship rather than applying nofollow to every external destination. Watch evergreen content: a research citation may move or a vendor may change ownership years after publication. For highly trusted guides, maintain a periodic source review and archive the reason each important citation was chosen so editors can replace it intelligently if it disappears.",
    aeos: [
      { question: "Should I remove external links to keep SEO authority?", answer: "No. Useful citations and references are a normal part of high-quality web content." },
      { question: "When is rel=sponsored appropriate?", answer: "Use it for paid or sponsored link relationships in line with current search-engine guidance." },
    ],
  },
  "broken-link-checker": {
    quickAnswer: "A Broken Link Checker tests whether destinations linked from a page still respond successfully. The result should distinguish real 4xx or 5xx errors from request failures, because DNS, bot protection and temporary timeouts are not the same as a permanently missing page. Prioritize broken links that interrupt user tasks or important internal navigation.",
    professionalNotes: "Fix links according to context, not status alone. If an external source moved, find the current primary source rather than linking to a random article with a similar title. If an internal page moved permanently, update the source link and keep the redirect for external users. For deleted content with no equivalent replacement, remove the link or rewrite the sentence instead of redirecting everything to the homepage. On large sites, recurring broken links often indicate a process issue: editors are publishing raw URLs without link monitoring, or migrations are happening without a redirect map. Solve that process after repairing individual pages.",
    aeos: [
      { question: "What counts as a broken link?", answer: "A destination that cannot be reached or returns an error such as 404, 410 or persistent server failure is a broken-link candidate." },
      { question: "Should I fix external 404s?", answer: "Yes when the reference matters. Replace it with the correct current source or remove the link if no suitable source exists." },
    ],
  },
  "anchor-text-analyzer": {
    quickAnswer: "An Anchor Text Analyzer helps you see the language used for links on a page. Useful anchors give readers enough context to predict the destination. The tool can identify generic phrases and URL-style anchors, but it should not pretend to calculate a full backlink anchor profile from one page.",
    professionalNotes: "Evaluate anchors inside their sentences. 'Canonical checker' can be a perfectly natural internal anchor when the sentence discusses checking canonical tags; repeating that exact phrase in every paragraph becomes awkward. Accessibility also matters: multiple 'read more' links can be difficult for screen-reader users when read out of context. For linked images or icons, ensure there is an accessible name through appropriate text or labels. Avoid anchor-ratio dogma for internal links. The better editorial rule is consistency of meaning without mechanical repetition. When updating old content, change vague anchors where a clearer phrase improves comprehension, not simply because an SEO spreadsheet labels them generic.",
    aeos: [
      { question: "What is descriptive anchor text?", answer: "Link text that gives the reader a useful idea of the destination or action before they follow the link." },
      { question: "Is 'click here' always bad?", answer: "No, but it is often less informative and less accessible than a contextual description of the destination." },
    ],
  },
  "heading-checker": {
    quickAnswer: "A Heading Checker extracts the H1-H6 outline so you can review semantic structure separately from visual design. The useful questions are whether the page has a clear main heading, whether major sections use logical levels and whether headings genuinely summarize the content beneath them.",
    professionalNotes: "Modern component libraries can accidentally create hierarchy problems when heading level is tied to component style. Build components that accept semantic level separately from typography so a card title does not become H2 simply because it looks large. One H1 is a simple maintainable convention for most pages, but do not treat multiple H1s as an automatic penalty. Focus on an outline that makes sense to users and assistive technology. When auditing long-form content, also look for fake headings—bold paragraphs used as section titles—which the checker cannot identify semantically because the markup itself is missing.",
    aeos: [
      { question: "Is one H1 required?", answer: "One clear H1 is a common best practice for maintainable page structure, though HTML itself can support more complex patterns." },
      { question: "Does heading order affect rankings?", answer: "Headings help structure and understanding, but there is no simple ranking formula based on heading levels." },
    ],
  },
  "image-alt-checker": {
    quickAnswer: "An Image Alt Text Checker identifies whether images have an alt attribute and flags empty or unusually long values for review. Missing alt and empty alt are different: empty alt can be correct for decoration, while meaningful content images usually need a concise description of their purpose in context.",
    professionalNotes: "Write alt text from the user's task. For a product photo, identify the product or distinguishing view if that information matters. For a chart, describe the takeaway rather than every pixel. For a decorative icon next to text that already communicates the same meaning, empty alt can prevent redundant screen-reader output. Avoid automated alt generation that blindly turns filenames into sentences. AI-generated descriptions can also hallucinate visual details, so if automation is used, keep human review for important content. Treat linked images separately: their accessible name may need to describe the destination or action rather than the image itself.",
    aeos: [
      { question: "What should alt text describe?", answer: "The image's meaning or function in the current context, in wording useful to someone who cannot see it." },
      { question: "When should alt be empty?", answer: "When the image is purely decorative and provides no additional information or function." },
    ],
  },
  "image-seo-checker": {
    quickAnswer: "An Image SEO Checker reviews HTML signals around images—alt text, source filenames, dimensions and loading attributes. These signals help with accessibility, stability and maintainability, but they do not reveal the full performance story. Actual file bytes, compression and rendering need browser performance testing.",
    professionalNotes: "Use the audit to separate markup work from asset-pipeline work. Missing width and height can contribute to layout movement, but adding attributes does not make a 4 MB hero image fast. Lazy loading can help below-the-fold galleries but may delay the Largest Contentful Paint image if applied indiscriminately. Responsive images with `srcset` and `sizes` often matter more than renaming every old file. If image search is important, keep stable crawlable image URLs and meaningful surrounding text. When using a CDN, make sure transformed image URLs remain accessible to crawlers and are not protected by short-lived signatures.",
    aeos: [
      { question: "What should I fix first for image SEO?", answer: "Start with accessibility and loading fundamentals: meaningful alt where needed, correct dimensions, appropriate sizing and crawlable image URLs." },
      { question: "Does a descriptive filename guarantee image rankings?", answer: "No. It can add context, but image relevance depends on many page and asset signals." },
    ],
  },
  "meta-title-checker": {
    quickAnswer: "A Meta Title Checker verifies that a page returns a usable `<title>` and gives you an editing signal for unusually short or long text. The title should distinguish the page and reflect intent. Character count is not a Google rule and should never be treated as a score that overrides clarity.",
    professionalNotes: "Audit titles by template and query intent. Ecommerce titles may need product plus a meaningful qualifier; tool pages should describe the task; editorial articles can use a compelling headline without repeating every entity. Brand suffixes are useful when recognition matters, but a long boilerplate suffix can make hundreds of pages look the same. Search engines sometimes rewrite title links using headings or anchor text, so investigate systematic rewrites as a signal that your titles or page structure may not match the query context. Keep title generation deterministic and test empty or unusually long CMS fields so fallback logic does not create duplicate 'Untitled | Brand' pages.",
    aeos: [
      { question: "What makes a strong title tag?", answer: "A concise description of the page's specific purpose that distinguishes it from other pages and reads naturally to a searcher." },
      { question: "Is 60 characters a hard limit?", answer: "No. Search display is width- and query-dependent, and titles can be rewritten." },
    ],
  },
  "meta-description-checker": {
    quickAnswer: "A Meta Description Checker confirms whether a description exists and helps you review its length and usefulness. The description is a candidate for search snippet copy, not a guaranteed display field. A strong description summarizes the page and gives the searcher a reason to visit without inventing claims.",
    professionalNotes: "Prioritize descriptions for pages that drive meaningful organic impressions rather than spending weeks manually writing low-value utility pages. For large catalogs, carefully designed templates are acceptable when they use real page data and avoid duplicate filler. Search engines rewrite snippets frequently, especially when a query needs a passage from the body, so do not treat rewrites as automatic failures. Analyze click-through rates alongside query mix before changing descriptions that already communicate intent. Avoid date or pricing claims that can become stale unless the metadata updates from the same source as the visible content.",
    aeos: [
      { question: "What should a meta description include?", answer: "A clear summary of what the page offers, written naturally for the searcher and consistent with the visible content." },
      { question: "Why is my meta description not shown?", answer: "Search engines can choose a different passage when it appears more relevant to the user's query." },
    ],
  },
  "meta-tag-checker": {
    quickAnswer: "A Meta Tag Checker gives you one place to review the final title, description, canonical, robots and social metadata delivered by a page. Its main value is catching conflicts between systems—CMS, framework, SEO plugin and CDN—rather than rewarding pages for having the largest number of tags.",
    professionalNotes: "Create a metadata ownership map for complex stacks. Decide which layer controls canonical, robots, Open Graph and Twitter/X fields, then disable duplicates elsewhere. This becomes especially important with headless CMS deployments where the editor's metadata exists but frontend code can override it. Test production source after hydration and route transitions because client navigation can sometimes leave stale head elements if implementation is incorrect. Do not add obsolete tags simply to make the report look complete. Modern SEO is better served by a few accurate tags than by a head full of legacy keywords and unverifiable claims.",
    aeos: [
      { question: "Which meta tags should I check first?", answer: "Start with title, robots directives and canonical behavior, then review description and social-sharing metadata." },
      { question: "Is meta keywords still important?", answer: "No for major modern search engines. It should not be treated as a required optimization field." },
    ],
  },
  "seo-slug-checker": {
    quickAnswer: "An SEO URL Slug Checker reviews the final readable portion of a URL. A good slug is stable, understandable and consistent with the site's routing conventions. It does not need to repeat the entire title or contain every keyword variation, and an older stable slug should not be changed casually just to become shorter.",
    professionalNotes: "Choose slugs at publication with future maintenance in mind. Headlines evolve; URLs should usually survive those editorial changes. Dates in slugs can be useful for time-based archives but can make evergreen content look stale if added mechanically. Numeric IDs are not inherently bad when the application needs them, though adding a descriptive component can improve usability. For multilingual sites, non-Latin slugs are legitimate; evaluate readability for the intended audience rather than enforcing English-only characters. If you do change a slug, update canonical, internal links and sitemap entries and keep a permanent redirect from the old URL.",
    aeos: [
      { question: "Should a slug match the page title exactly?", answer: "No. It can be a shorter stable representation of the topic while the title remains free to change editorially." },
      { question: "Are dates bad in URL slugs?", answer: "Not inherently. Use them when date is part of the durable information architecture, not by default on evergreen content." },
    ],
  },
};
