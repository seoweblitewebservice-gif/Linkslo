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

// FULL CONTENT TOO LARGE FOR SINGLE MESSAGE - SEE ARTIFACT
export const SEO_TOOLS: SeoToolDefinition[] = [];
