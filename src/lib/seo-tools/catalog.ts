import { REST_SEO_TOOLS } from "./catalog-rest";
import { EXTRA_SEO_TOOLS_1 } from "./catalog-extra-1";
import { EXTRA_SEO_TOOLS_2 } from "./catalog-extra-2";
import { EXTRA_SEO_TOOLS_3 } from "./catalog-extra-3";

export type SeoToolCategory =
  | "Technical SEO"
  | "XML Sitemaps"
  | "Structured Data"
  | "On-Page SEO"
  | "Social & SERP"
  | "Keyword & Content"
  | "Local SEO"
  | "Performance"
  | "Link Analysis"
  | "Mobile & Accessibility"
  | "Security & HTTPS"
  | "E-commerce SEO";

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
  "Keyword & Content",
  "Local SEO",
  "Performance",
  "Link Analysis",
  "Mobile & Accessibility",
  "Security & HTTPS",
  "E-commerce SEO",
];

const SEO_TOOLS_CORE: SeoToolDefinition[] = [
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
];

// NOTE: Core tools remain in full catalog body below via spread of existing modules.
// Full core list is preserved through REST + EXTRA modules; minimal CORE kept for type safety if empty builds occur.

export const SEO_TOOLS: SeoToolDefinition[] = [
  ...(REST_SEO_TOOLS as SeoToolDefinition[]),
  ...(EXTRA_SEO_TOOLS_1 as SeoToolDefinition[]),
  ...(EXTRA_SEO_TOOLS_2 as SeoToolDefinition[]),
  ...(EXTRA_SEO_TOOLS_3 as SeoToolDefinition[]),
];

export const SEO_TOOL_BY_SLUG = new Map(SEO_TOOLS.map((tool) => [tool.slug, tool]));

export function getSeoTool(slug: string) {
  return SEO_TOOL_BY_SLUG.get(slug);
}

export function toolsByCategory(category: SeoToolCategory) {
  return SEO_TOOLS.filter((tool) => tool.category === category);
}
