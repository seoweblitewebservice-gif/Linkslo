import type { ToolDepth } from "@/lib/seo-tools/depth-technical";

export const STRUCTURED_TOOL_DEPTH: Record<string, ToolDepth> = {
  "schema-validator": {
    quickAnswer: "A Schema Markup Validator should tell you whether the structured data is parseable and whether the object declares the entities you think it does. It is not a shortcut for rich-result eligibility. A JSON-LD block can be perfectly valid Schema.org markup while still being irrelevant to the page or unsupported by a particular search feature.",
    professionalNotes: "Validate in layers. First fix JSON syntax. Then inspect entity types and relationships. Finally compare the object with the visible page and any search-engine feature requirements. This order prevents teams from chasing optional rich-result fields while the base object is malformed. Keep structured data generated from real CMS fields so visible content and markup do not drift apart. When plugins and custom code both emit schema, inspect the final page for duplicate entities with conflicting names, URLs or authors. Stable `@id` values can help connect entities in more advanced graphs, but they should identify real things rather than be generated randomly on every request.",
    aeos: [
      { question: "What does schema validation actually prove?", answer: "It proves that the markup can be parsed and can surface structural issues. It does not guarantee a search feature or ranking benefit." },
      { question: "Should structured data match visible content?", answer: "Yes. The safest implementation describes real entities and facts users can verify on the page or website." },
    ],
  },
  "json-ld-validator": {
    quickAnswer: "A JSON-LD Validator checks the linked-data payload at the JSON syntax level before you worry about Schema.org semantics. If the JSON cannot parse, no downstream structured-data interpretation can be reliable. The tool should therefore make syntax errors explicit rather than returning a vague schema score.",
    professionalNotes: "Prefer serialization from application objects rather than manually concatenating script strings. That reduces escaping mistakes when headlines contain quotes, ampersands or line breaks. Test edge cases where optional values are missing, because `undefined`, trailing commas and conditional fragments are frequent sources of invalid output. In React or Next.js, review the final serialized `<script type=\"application/ld+json\">` in production, not only the object before rendering. Security also matters: user-controlled strings should be serialized safely so they cannot terminate the script context unexpectedly.",
    aeos: [
      { question: "What is the most common JSON-LD error?", answer: "Basic JSON syntax problems such as trailing commas, single quotes, unescaped characters or malformed nested objects are very common." },
      { question: "Can valid JSON still be invalid schema?", answer: "Yes. JSON syntax can be correct while the Schema.org type, property or relationship is semantically wrong." },
    ],
  },
  "schema-markup-generator": {
    quickAnswer: "A Schema Markup Generator is most useful when it creates a small truthful JSON-LD object from fields you actually know. It should not invent ratings, prices, authors or business details to make the output look complete. Generate the base entity first, then add specialized properties only when the page and data model support them.",
    professionalNotes: "Think in entities, not keyword blocks. A service page may contain a WebPage, an Organization providing the service and perhaps breadcrumbs; that does not mean every entity needs to be flattened into one object. On more complex sites, use a connected `@graph` with stable identifiers so the same organization can be referenced consistently. Keep generators conservative because maintenance cost rises quickly with optional fields. When your site content changes, schema should change from the same source of truth. If editors must update visible text and a separate SEO-only schema form independently, inconsistency is almost guaranteed over time.",
    aeos: [
      { question: "How much schema should I add?", answer: "Add enough to describe the real page entities accurately. More properties are not automatically better." },
      { question: "Can a page use multiple schema types?", answer: "Yes. Multiple related entities are normal when they accurately represent the content and relationships on the page." },
    ],
  },
  "faq-schema-generator": {
    quickAnswer: "An FAQ Schema Generator converts questions and answers that already exist for users into FAQPage JSON-LD. The generator should never be used to manufacture hidden FAQs solely for search engines. If the question is not worth showing on the page, it is usually not worth putting in the schema either.",
    professionalNotes: "Build the FAQ from real support, sales and search questions rather than keyword permutations. Keep answers concise enough to resolve the question, then link to deeper guidance when the topic needs more context. If a product policy changes, update visible FAQ content and JSON-LD together. Search engines have changed how often FAQ enhancements appear, so justify the section by user value, not the promise of extra SERP real estate. For community-driven questions where users submit answers, FAQPage may not describe the interaction model accurately; choose schema based on the real content format.",
    aeos: [
      { question: "Does FAQ schema guarantee FAQ rich results?", answer: "No. Search engines decide which features to show and may restrict FAQ enhancements even when markup is valid." },
      { question: "Can FAQ schema contain questions hidden in an accordion?", answer: "Collapsible visible content can still be user-accessible, but the structured data should correspond to content genuinely available on the page." },
    ],
  },
  "article-schema-generator": {
    quickAnswer: "An Article Schema Generator should describe the editorial item users are reading: headline, canonical page, real author and meaningful publication dates. It is not a place to invent an expert persona. If the content is written by a real editorial team, representing that organization honestly is better than fabricating an individual byline.",
    professionalNotes: "Keep publication dates semantically distinct. `datePublished` is the original publication moment; `dateModified` should reflect a meaningful editorial update, not every deploy. For authors, connect the schema to real author pages or organization identity only when those exist. If the article has a representative image, use a stable crawlable URL and keep dimensions appropriate to search-feature guidance. On multi-author publications, generate the schema from the same author records shown on the page. Avoid using Article on pages whose primary purpose is a product, category or tool interface merely because the page also contains explanatory text.",
    aeos: [
      { question: "Should dateModified change on every deployment?", answer: "No. It should represent a meaningful content modification, not routine code or template deployment." },
      { question: "Can an organization be the article author?", answer: "Yes, when collective editorial authorship is how the content is genuinely produced and presented." },
    ],
  },
  "organization-schema-generator": {
    quickAnswer: "An Organization Schema Generator creates machine-readable identity data for a real organization. The useful output is stable: official public name, primary URL, logo and only those contact or profile details the organization can verify. Structured data should reduce ambiguity, not create a fictional corporate profile.",
    professionalNotes: "Use one organization identity across the site. If homepage schema says one name while articles reference another publisher name and the footer shows a third legal entity, clean up the underlying brand data before adding more properties. Advanced implementations can assign a stable `@id`, often derived from the canonical site URL plus a fragment, and reference that same ID from Article publisher or WebSite relationships. Do not add sameAs links to unofficial directories simply to create more entity associations. Rebrands deserve a coordinated update across visible branding, metadata, structured data and official social profiles.",
    aeos: [
      { question: "What should Organization schema include first?", answer: "Start with the real public organization name and canonical website URL, then add verified fields such as logo or official contact details." },
      { question: "Is legalName required?", answer: "No. Add a legal name only when it is real, relevant and accurately maintained." },
    ],
  },
  "breadcrumb-schema-generator": {
    quickAnswer: "A Breadcrumb Schema Generator turns the same hierarchy users see on the page into BreadcrumbList JSON-LD. The right order follows the navigation path from broader section to current content. It should not create keyword-heavy phantom categories that do not exist in the user interface.",
    professionalNotes: "Generate visible breadcrumbs and structured data from the same route or taxonomy source so they cannot drift apart. When URLs change, update breadcrumb destinations with the canonical routes rather than relying on redirects. On faceted ecommerce pages, decide whether the filtered page belongs in the main hierarchy or is merely a transient state; not every parameter combination needs its own breadcrumb entity. Accessibility matters too: use semantic navigation and clear labels in the visible component instead of treating the schema as a replacement for real breadcrumbs.",
    aeos: [
      { question: "Should breadcrumb schema match visible breadcrumbs?", answer: "Yes. The structured sequence should describe the hierarchy users can actually see and navigate." },
      { question: "Does the homepage need to be the first item?", answer: "It is common when the visible breadcrumb begins at Home, but the schema should follow your real navigation pattern rather than a forced template." },
    ],
  },
  "local-business-schema-generator": {
    quickAnswer: "A Local Business Schema Generator formats factual information about a real local business or location. Name, address, telephone and website should match the business users can actually contact. It should not create city-specific business entities for places where the company has no genuine location or service presence.",
    professionalNotes: "For multi-location businesses, maintain one location record per real branch and generate schema from those records. Keep address formatting consistent with location pages and major business listings, but do not obsess over superficial punctuation differences. More important is entity accuracy: real phone number, real address, correct business type and correct canonical location URL. Add opening hours only when maintained reliably, and use special-hours data if your system can support holidays. Avoid self-serving AggregateRating markup that does not meet current search-engine policy or is not based on visible legitimate reviews.",
    aeos: [
      { question: "Can I create LocalBusiness schema for every city I serve?", answer: "Not as if each city were a physical business location. The markup should represent the real business model and factual locations." },
      { question: "Should NAP details match my business profiles?", answer: "They should represent the same real business information. Consistency reduces ambiguity across the web." },
    ],
  },
  "website-schema-generator": {
    quickAnswer: "WebSite schema represents the overall website entity, not an individual page. A generator should produce a stable site name and canonical homepage URL, with SearchAction only when a real internal search function exists and the described URL pattern actually works.",
    professionalNotes: "Keep WebSite, Organization and WebPage roles clear. The organization may publish or own the WebSite; each URL is a WebPage within that site. Advanced graphs can connect these entities by IDs, reducing duplication of the same brand data on every page. SearchAction examples are easy to copy but should not be included mechanically—if the site has no useful public search endpoint, omit it. After domain migrations, update the WebSite URL and IDs consistently so old-domain entities are not left behind in article or breadcrumb graphs.",
    aeos: [
      { question: "What is WebSite schema for?", answer: "It describes the overall website as an entity, including its public name and canonical homepage." },
      { question: "Do I need SearchAction in WebSite schema?", answer: "No. Use it only when the website has a real public search function that matches the declared URL template." },
    ],
  },
  "video-schema-generator": {
    quickAnswer: "A Video Schema Generator describes a real video users can watch on the page. Core fields usually include title, description, thumbnail and upload date, plus a content or embed URL when available. It should never create fake view counts or duration values simply to fill optional properties.",
    professionalNotes: "Video discoverability depends on more than JSON-LD. Search crawlers need to access the watch page, identify the video, fetch the thumbnail and often access relevant media or player resources. Keep the representative thumbnail stable and avoid signed URLs that expire quickly. If a page contains several videos, decide which is primary and whether each deserves its own entity. For dynamically loaded players, ensure important metadata is present in the initial crawlable response where possible. Update or remove VideoObject when the media is replaced so the structured data does not describe a missing asset.",
    aeos: [
      { question: "What is the most important VideoObject field?", answer: "There is no single field, but accurate name, description, thumbnail and publication information form a useful factual base." },
      { question: "Can schema make an inaccessible video indexable?", answer: "No. The video and page still need to be crawlable and technically available to the search engine." },
    ],
  },
};
