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

const SEO_TOOLS_CORE: SeoToolDefinition[] = [];

export const SEO_TOOLS: SeoToolDefinition[] = [
  ...SEO_TOOLS_CORE,
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
