import type { SeoToolDefinition } from "@/lib/seo-tools/catalog";
import type { ToolEditorial } from "@/lib/seo-tools/content";
import { TECHNICAL_TOOL_EDITORIAL } from "@/lib/seo-tools/content";
import { SITEMAP_TOOL_EDITORIAL } from "@/lib/seo-tools/content-sitemaps";
import { STRUCTURED_TOOL_EDITORIAL } from "@/lib/seo-tools/content-structured";
import { ONPAGE_TOOL_EDITORIAL } from "@/lib/seo-tools/content-onpage";
import { SOCIAL_TOOL_EDITORIAL } from "@/lib/seo-tools/content-social";
import { EXTRA_TOOL_EDITORIAL } from "@/lib/seo-tools/content-extra";

const ALL_TOOL_EDITORIAL: Record<string, ToolEditorial> = {
  ...TECHNICAL_TOOL_EDITORIAL,
  ...SITEMAP_TOOL_EDITORIAL,
  ...STRUCTURED_TOOL_EDITORIAL,
  ...ONPAGE_TOOL_EDITORIAL,
  ...SOCIAL_TOOL_EDITORIAL,
  ...EXTRA_TOOL_EDITORIAL,
};

export function getSeoToolEditorial(tool: SeoToolDefinition) {
  return ALL_TOOL_EDITORIAL[tool.slug] ?? null;
}

export const SEO_TOOL_EDITORIAL_COUNT = Object.keys(ALL_TOOL_EDITORIAL).length;
