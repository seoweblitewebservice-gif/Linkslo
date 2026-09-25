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

function fallbackDepth(tool: SeoToolDefinition): ToolDepth {
  return {
    quickAnswer: `${tool.summary} Use the results to guide practical fixes, then verify the live page after changes ship.`,
    professionalNotes: `Professionals use the ${tool.name} as a scoped diagnostic. Start with pages that drive revenue or rankings, interpret warnings in template context, and avoid treating any single metric as a ranking guarantee. When the same issue repeats, fix the system that creates it—content guidelines, CMS defaults or shared components—rather than only patching one URL.`,
    aeos: [
      {
        question: `When should I use the ${tool.name}?`,
        answer: "Use it while creating or updating important pages, after template changes, and during technical or content QA cycles.",
      },
      {
        question: "What should I do with a warning result?",
        answer: "Read the detail, decide whether the issue affects users or clarity on that template, fix high-impact cases first, and re-test.",
      },
    ],
  };
}

export function getSeoToolDepth(tool: SeoToolDefinition) {
  return ALL_TOOL_DEPTH[tool.slug] ?? fallbackDepth(tool);
}

export const SEO_TOOL_DEPTH_COUNT = Object.keys(ALL_TOOL_DEPTH).length;
