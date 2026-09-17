export type ToolDepth = {
  quickAnswer: string;
  professionalNotes: string;
  aeos: { question: string; answer: string }[];
};

export const TECHNICAL_TOOL_DEPTH: Record<string, ToolDepth> = {
  "robots-txt-tester": {
    quickAnswer: "Use a robots.txt tester when you need to answer one precise question: can this crawler request this exact path under the site's published robots rules? The useful result is not a generic green score. It is the selected user-agent group, the path being tested, the rule that matched and the resulting allow or disallow decision. That distinction matters because robots.txt works at crawl level. It does not make a URL private, and it is not a dependable replacement for noindex when the real goal is removal from search results.",
    professionalNotes: "During migrations, test more than the homepage. Include a normal article, category page, faceted URL, JavaScript or CSS asset, internal search path and any directory intentionally blocked. Large mistakes usually happen at pattern boundaries: an overly broad `/search` block catches a valid `/search-guides/` folder, or a wildcard copied from another crawler behaves differently from the team's assumption. Keep a small regression list of business-critical URLs and rerun it whenever robots.txt, CDN routing or CMS deployment logic changes. When the tester reports a fetch failure, diagnose that separately from rule matching; DNS, TLS, firewall or bot protection can stop a request before robots directives are relevant.",
    aeos: [
      { question: "What should I test first in robots.txt?", answer: "Start with URLs that generate organic traffic or sit inside directories affected by a recent robots change. Test the exact production URL with the crawler you care about." },
      { question: "Can a URL be blocked by robots.txt but still appear in Google?", answer: "Yes. A blocked URL can still be discovered through links and may appear without normally fetched page content. Robots.txt controls crawling, not guaranteed index removal." },
    ],
  },
  "robots-txt-validator": {
    quickAnswer: "A robots.txt validator is for reviewing the file as a whole rather than deciding one URL. It helps surface malformed lines, rules that appear outside a user-agent group, unsupported indexing directives and sitemap declarations that point to the wrong host. A file can be syntactically simple yet strategically dangerous, so validation should be followed by URL-level testing on the sections that matter most.",
    professionalNotes: "Treat validation as release QA. Save the old production robots.txt before a migration and compare it with the new file line by line. Pay special attention to environment-specific values: staging domains in Sitemap directives, temporary Disallow rules left behind after development, and paths that changed when a framework moved from one routing structure to another. Avoid turning the file into a policy encyclopedia. Short, explainable rules are easier to audit and less likely to cause accidental crawl suppression. If a line is crawler-specific, document why it exists and which crawler documentation supports it instead of copying syntax from a forum post.",
    aeos: [
      { question: "What makes a robots.txt file invalid?", answer: "Malformed directives, missing user-agent context and unusable values can make lines ineffective. Some unknown directives are simply ignored rather than making the whole file invalid." },
      { question: "Should robots.txt contain noindex?", answer: "No. Modern indexing control should use meta robots or X-Robots-Tag. Robots.txt is primarily for crawl permissions." },
    ],
  },
  "robots-txt-generator": {
    quickAnswer: "A robots.txt generator should produce the smallest file that expresses your real crawl policy. Choose a user-agent, list only paths you intentionally want blocked or explicitly allowed, and add the sitemap URL if useful. Do not start with a giant template copied from another CMS because every extra rule is another opportunity to block something your site actually needs crawled.",
    professionalNotes: "Before publishing generated output, review it against real route families. If you block `/admin/`, confirm public help pages are not nested beneath it. If you block query patterns, verify that the rule will not suppress canonical product or category URLs. For ecommerce and JavaScript-heavy sites, be especially careful with asset directories: blocking resources can make rendering harder for crawlers. Keep production and staging policies separate at deployment level so a staging-wide Disallow cannot leak into the live environment. After upload, fetch `/robots.txt` publicly and run representative URL tests rather than assuming the file saved by the CMS is the file users and crawlers actually receive.",
    aeos: [
      { question: "What is the safest default robots.txt?", answer: "If you have nothing specific to block, a minimal file that does not disallow public content is safer than adding speculative restrictions." },
      { question: "Where must robots.txt be located?", answer: "At the root of the host it controls, such as `https://example.com/robots.txt`." },
    ],
  },
  "canonical-url-checker": {
    quickAnswer: "A canonical URL checker tells you what preferred URL the page declares and whether that declaration looks internally consistent with the fetched page. The strongest practical checks are simple: is there one canonical, is it absolute, does it use the right production host and protocol, and does it point to a URL that represents substantially equivalent content? A different canonical is not automatically wrong; it is wrong when the consolidation does not match the site's real content strategy.",
    professionalNotes: "Audit canonicals as a cluster of signals, not a single tag. Compare the canonical with internal links, sitemap entries, redirects and hreflang. If all internal links point to URL A while the page canonicals to URL B and the sitemap lists URL C, the problem is inconsistency even if each element is valid HTML. Ecommerce filters deserve page-type decisions: some parameters are true duplicates, others create useful category states with distinct demand. During migrations, sample old and new templates because canonicals are often generated from environment variables and can quietly preserve staging hosts or legacy domains. Search engines may select a different canonical when stronger signals disagree, so use the checker to reduce ambiguity rather than to claim a guaranteed selection.",
    aeos: [
      { question: "Should every indexable page have a self-canonical?", answer: "Self-referencing canonicals are a common clean implementation for indexable pages, especially when duplicate URL variants can exist." },
      { question: "Can canonical and redirect be used together?", answer: "Yes, but they serve different roles. If a URL permanently moves, redirect users and crawlers. Canonical is mainly for accessible duplicate or near-duplicate versions." },
    ],
  },
  "canonical-tag-generator": {
    quickAnswer: "A canonical tag generator creates one HTML link element pointing to the preferred absolute URL. The syntax is simple; the strategic decision is not. Generate the tag only after deciding which version of the content should be treated as primary, then place it in the document head and verify the live page does not output a second conflicting canonical from another plugin or framework layer.",
    professionalNotes: "Use the generator as part of implementation QA rather than as proof that the canonical strategy is correct. If a URL contains campaign parameters, sort orders or tracking IDs, the clean canonical is often the stable content URL, but not every parameter represents a duplicate. For multi-region sites, keep canonicals aligned with the corresponding localized page instead of collapsing every locale to one language by default. When a CMS can output canonicals automatically, prefer configuring that source rather than hard-coding tags into individual pages. The most common enterprise problem is duplication of responsibility: framework metadata, SEO plugin and server-side template all try to emit the same tag.",
    aeos: [
      { question: "What should the canonical href contain?", answer: "Usually the complete absolute preferred URL, including the intended HTTPS protocol, hostname and path." },
      { question: "Can a canonical tag point to a redirected URL?", answer: "It can, but that creates unnecessary ambiguity. Prefer pointing directly to the final stable canonical destination." },
    ],
  },
  "hreflang-checker": {
    quickAnswer: "An hreflang checker is used to verify that equivalent language or regional pages identify one another correctly. The core questions are: are the codes valid, are the target URLs real and indexable, does the cluster include reciprocal references, and do canonical tags keep each localized page inside the same intended set? Hreflang is not a translation system and does not make weak localization relevant by itself.",
    professionalNotes: "Check full page families, not one homepage. International implementations often work at the root but break on product, article or category templates because localized routes are missing or generated from different databases. Watch for country-language confusion: `en-GB` is language plus region, while a country alone is not a complete hreflang language target. Reciprocal validation is particularly important after one market is retired; leaving stale alternates causes incomplete clusters. Also compare server redirects by geography. If a crawler requesting the French URL is automatically redirected to English based on IP, the hreflang markup may be technically present but practically difficult to crawl as intended.",
    aeos: [
      { question: "Does hreflang prevent duplicate content?", answer: "Hreflang helps search engines serve the appropriate localized version. It is not a replacement for canonicalization and does not simply erase duplicate-content concerns." },
      { question: "Do all pages in an hreflang cluster need to reference each other?", answer: "Reciprocal references are an important implementation pattern. Each equivalent page should normally describe the same alternate set." },
    ],
  },
  "hreflang-generator": {
    quickAnswer: "A hreflang generator converts a known localization map into consistent alternate link tags. Provide one language or language-region code and one absolute equivalent URL per entry. The generator solves formatting; it cannot decide whether the pages are actually equivalent, translated well or appropriate for the same cluster.",
    professionalNotes: "Keep the source list in a data structure your application can reuse for HTML, sitemap or header implementations instead of maintaining separate manual lists. That reduces one of the most common hreflang problems: page A knows about B and C, while page B knows only about A. Do not create region variants simply because the generator allows them. If the content is the same Spanish page for several markets, a language-level `es` target may be more maintainable than unsupported country pages. Use x-default only for a real fallback such as a selector or global page. After generating, test actual live alternates for status, canonical and reciprocal markup.",
    aeos: [
      { question: "Should I use `en` or `en-US`?", answer: "Use the least specific value that matches your real content targeting. Add a region only when the page is genuinely regionalized." },
      { question: "Is x-default mandatory?", answer: "No. It is optional and useful when you have a meaningful fallback page for unmatched users." },
    ],
  },
  "redirect-checker": {
    quickAnswer: "A redirect checker shows what happens between the URL you enter and the final response. It records each HTTP status and Location destination instead of hiding intermediate hops like a browser normally does. Use it to confirm permanent versus temporary behavior, discover unexpected host or protocol changes and verify that legacy URLs end at the most relevant current page.",
    professionalNotes: "Redirect quality is about intent as much as status code. A clean 301 from an old product to its direct replacement is useful; a 301 from thousands of unrelated deleted URLs to the homepage is not the same thing just because the status is permanent. Test important inbound-link destinations after migrations and update internal links to the final URL so users do not pay the latency cost repeatedly. Where multiple infrastructure layers can redirect—CDN, reverse proxy, framework middleware and application routing—document ownership. That prevents teams from fixing one rule while another layer silently recreates the hop.",
    aeos: [
      { question: "When should I use a 301 redirect?", answer: "Use a permanent redirect when the resource has genuinely moved and the new destination is the appropriate long-term replacement." },
      { question: "Is a 302 bad for SEO?", answer: "No. A temporary redirect is correct when the move is genuinely temporary. Status semantics should reflect reality." },
    ],
  },
  "redirect-chain-checker": {
    quickAnswer: "A redirect chain checker focuses on URLs that move through more than one redirect before reaching a final response. One hop can be normal; several historical hops usually mean migration rules were layered over time. The goal is to identify where the chain can be collapsed without breaking legitimate legacy URLs.",
    professionalNotes: "Prioritize chains that appear in internal navigation, sitemaps, canonical tags or important backlinks. A chain reachable only from an ancient unlinked URL is less urgent than one every visitor hits on the homepage. When collapsing, preserve intent: old HTTP and www variants can often go directly to the modern canonical path, but unrelated content should not be forced to a generic destination merely to eliminate a 404. Track redirect maps in version control or migration documentation so future teams can understand why a rule exists. After simplification, check analytics and logs for unexpected traffic to intermediate URLs before removing them entirely.",
    aeos: [
      { question: "How many redirect hops are acceptable?", answer: "There is no magic ranking threshold, but unnecessary hops add latency and failure points. Direct is generally better when you control the URLs." },
      { question: "Should sitemap URLs ever be in redirect chains?", answer: "Prefer listing final canonical URLs directly in sitemaps rather than sending crawlers through redirect chains." },
    ],
  },
  "redirect-loop-checker": {
    quickAnswer: "A redirect loop checker helps diagnose paths where URL A eventually sends the request back to a URL already seen. The browser error is usually obvious, but the tool's value is showing the sequence so you can identify whether protocol, hostname, slash, locale or authentication rules are fighting one another.",
    professionalNotes: "Loops often live across infrastructure boundaries. A CDN may believe the origin request is HTTP while the origin believes it should force HTTPS; a framework may add a trailing slash while the proxy removes it; a locale layer may add `/en/` while another rewrite strips it. Fixing the symptom in one layer without understanding the request headers can produce a new loop. Reproduce with clean cookies, inspect forwarded-protocol headers and test both the canonical host and common legacy variants. Add automated checks for these routes after the fix because redirect loops are classic regression bugs during infrastructure changes.",
    aeos: [
      { question: "What is the first thing to check in a redirect loop?", answer: "Look for repeated URL patterns in the path, then identify which system owns each redirect: CDN, server, framework or application." },
      { question: "Can redirect loops affect only logged-in users?", answer: "Yes. Authentication and cookie logic can create conditional loops that anonymous checks do not see." },
    ],
  },
  "http-status-code-checker": {
    quickAnswer: "An HTTP status checker tells you how the server categorizes the request: successful 2xx, redirecting 3xx, client-error 4xx or server-error 5xx. That status is part of the resource's meaning. A beautifully designed error page that returns 200 can still miscommunicate to crawlers and monitoring systems.",
    professionalNotes: "Read status codes together with page intent. A removed resource with no replacement can legitimately return 404 or 410. A temporarily unavailable service may use 503. A permanent move should redirect to the closest relevant destination. Avoid treating every non-200 as a defect, because redirects and missing-resource statuses are necessary parts of a healthy web application. For SEO audits, pay special attention to soft errors: pages that say 'not found' in the content while returning 200, or blanket redirects that send unrelated missing URLs to the homepage. Those patterns hide problems rather than solving them.",
    aeos: [
      { question: "What status should a healthy webpage return?", answer: "A normal accessible page generally returns a successful 2xx status, most commonly 200." },
      { question: "Is 410 better than 404?", answer: "Both can accurately represent missing content. Use the status that matches your server behavior and content-removal intent rather than chasing a perceived SEO advantage." },
    ],
  },
  "indexability-checker": {
    quickAnswer: "An indexability checker evaluates whether the current response contains obvious technical reasons a search engine should not index the page. It can inspect status, noindex directives, canonical signals and crawl controls. It cannot truthfully answer 'Is this page in Google?' without first-party index data, so the result should be described as technical eligibility rather than actual index status.",
    professionalNotes: "Use a layered diagnosis. First confirm the final URL returns the expected status. Then inspect meta robots and X-Robots-Tag. Next compare canonical, robots.txt and sitemap intent. Finally, use Google Search Console or another first-party webmaster platform to see how the search engine actually processed the URL. This order prevents common mistakes such as asking for indexing while an HTTP header still sends noindex. For templated sites, sample several URLs per template; one page may be correct while a conditional CMS field adds noindex to another group. During migrations, compare old and new hosts because accidental canonical targets are as common as accidental noindex tags.",
    aeos: [
      { question: "What is the difference between indexable and indexed?", answer: "Indexable means no obvious technical exclusion was found. Indexed means a search engine has actually chosen to store and potentially serve the URL." },
      { question: "Can a 200 page still be non-indexable?", answer: "Yes. It can carry noindex, canonicalize elsewhere or be blocked from effective crawling." },
    ],
  },
  "noindex-checker": {
    quickAnswer: "A noindex checker answers a narrow but high-impact question: does this response explicitly contain a noindex instruction in HTML or an X-Robots-Tag header? That is different from checking whether the page ranks or is currently indexed. It is a configuration audit for one exclusion signal.",
    professionalNotes: "When noindex appears unexpectedly, trace it to the layer that created it before simply deleting markup. CMS settings, page-level fields, environment flags, reverse proxies and CDNs can all inject directives. If HTML looks clean but the checker still reports noindex, inspect response headers. If the page is also blocked in robots.txt, remember that crawlers may need access to fetch and observe the noindex directive. On large sites, accidental template-level noindex can affect thousands of pages, so verify counts by template and deploy a monitored fix rather than changing pages one by one.",
    aeos: [
      { question: "How do I remove a noindex page from noindex?", answer: "Remove the directive from every layer that sends it, allow crawlers to fetch the page, then wait for recrawling or request inspection through a webmaster tool." },
      { question: "Can X-Robots-Tag noindex override a clean HTML page?", answer: "Yes. Header-level noindex is a real indexing directive and must be checked alongside meta robots." },
    ],
  },
  "meta-robots-checker": {
    quickAnswer: "A meta robots checker reads page-level crawler instructions from HTML and makes them explicit. The main value is finding restrictions that are invisible in the rendered page: noindex, nofollow and snippet controls. It should also show crawler-specific tags rather than assuming the generic robots tag is the only one that matters.",
    professionalNotes: "Avoid policy sprawl. If a page emits a generic `robots` tag and separate Googlebot or Bingbot tags, document why those differences exist. Conflicting directives often come from stacked SEO plugins or framework metadata layers. For sponsored links, do not use page-level nofollow simply because one link is paid; qualify the individual link where appropriate. For staging, noindex is useful but not a security control—protect private environments with authentication. During launch QA, check both rendered HTML and headers because a CDN can preserve a restrictive policy after application code has been corrected.",
    aeos: [
      { question: "Is meta robots required on indexable pages?", answer: "No. In the absence of restrictive directives, normal indexing and following behavior can apply." },
      { question: "Can meta robots block crawling?", answer: "No. Crawlers generally need to fetch the page to read meta robots. Robots.txt handles crawl permission." },
    ],
  },
  "x-robots-tag-checker": {
    quickAnswer: "An X-Robots-Tag checker inspects indexing directives sent in HTTP response headers. It is essential for PDFs, images and other non-HTML resources because those files cannot carry an HTML meta robots tag, and it is useful for webpages because infrastructure can inject restrictions outside the application template.",
    professionalNotes: "Header directives deserve infrastructure ownership. Record whether they come from nginx, Apache, a CDN rule, object storage metadata or application middleware. Broad file-extension rules can unintentionally affect entire asset libraries; for example, a rule created to noindex private PDFs may later catch a public research report. Cache invalidation matters too: after removing a header at origin, a CDN can continue serving the old directive until purged. Include X-Robots checks in deployment tests whenever you change proxy or caching configuration, especially on document-heavy sites where valuable resources are not HTML pages.",
    aeos: [
      { question: "Why use X-Robots-Tag instead of meta robots?", answer: "It can control indexing for non-HTML resources and can be applied at HTTP-header level by servers or CDNs." },
      { question: "Can a PDF be noindexed?", answer: "Yes. Sending `X-Robots-Tag: noindex` with the PDF response is a common method." },
    ],
  },
  "url-structure-checker": {
    quickAnswer: "A URL structure checker reviews the address as a piece of information architecture: protocol, hostname, path depth, parameters, encoding and readability. It should not assign a magical SEO score. The practical question is whether the URL is stable, understandable and consistent with the site's canonical conventions.",
    professionalNotes: "Do not redesign URLs just to make an audit report prettier. Existing URLs may have backlinks, bookmarks and years of search history. Change them when the architecture genuinely benefits, then redirect carefully. Parameter handling deserves a separate strategy: tracking parameters usually do not represent unique content, while ecommerce filters sometimes do. Keep internal links consistent with the canonical form so the application does not manufacture unnecessary variants. For international sites, percent encoding or non-Latin characters are not automatically errors; readability should be evaluated for the actual language and technical stack. The best URL scheme is one your team can maintain predictably for years.",
    aeos: [
      { question: "Does URL length affect rankings?", answer: "There is no simple ranking threshold. Extremely long URLs can be harder to share, debug and maintain, so clarity is the more useful goal." },
      { question: "Should I remove all URL parameters?", answer: "No. Parameters can represent legitimate state. Decide which ones change content and which are tracking or duplicate variants." },
    ],
  },
};
