import type { SeoToolDefinition } from "@/lib/seo-tools/catalog";
import type { ToolDepth } from "@/lib/seo-tools/depth-technical";
import { TECHNICAL_TOOL_DEPTH } from "@/lib/seo-tools/depth-technical";
import { SITEMAP_TOOL_DEPTH } from "@/lib/seo-tools/depth-sitemaps";
import { STRUCTURED_TOOL_DEPTH } from "@/lib/seo-tools/depth-structured";
import { ONPAGE_TOOL_DEPTH } from "@/lib/seo-tools/depth-onpage";
import { SOCIAL_TOOL_DEPTH } from "@/lib/seo-tools/depth-social";

const ALL_TOOL_DEPTH: Record<string, ToolDepth> = {
  ...TECHNICAL_TOOL_DEPTH,
  ...SITEMAP_TOOL_DEPTH,
  ...STRUCTURED_TOOL_DEPTH,
  ...ONPAGE_TOOL_DEPTH,
  ...SOCIAL_TOOL_DEPTH,
};

export function getSeoToolDepth(tool: SeoToolDefinition) {
  return ALL_TOOL_DEPTH[tool.slug] ?? null;
}

export const SEO_TOOL_DEPTH_COUNT = Object.keys(ALL_TOOL_DEPTH).length;
