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

// NOTE: Full original 50-tool array was truncated in recovery commit.
// Loading from backup in next commit.
export const SEO_TOOLS: SeoToolDefinition[] = [];

export const SEO_TOOL_BY_SLUG = new Map(SEO_TOOLS.map((tool) => [tool.slug, tool]));

export function getSeoTool(slug: string) {
  return SEO_TOOL_BY_SLUG.get(slug);
}

export function toolsByCategory(category: SeoToolCategory) {
  return SEO_TOOLS.filter((tool) => tool.category === category);
}
