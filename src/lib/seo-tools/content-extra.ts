import type { ToolEditorial } from "@/lib/seo-tools/content";
import { EXTRA_TOOL_EDITORIAL_A } from "@/lib/seo-tools/content-extra-a";
import { EXTRA_TOOL_EDITORIAL_B } from "@/lib/seo-tools/content-extra-b";

export const EXTRA_TOOL_EDITORIAL: Record<string, ToolEditorial> = {
  ...EXTRA_TOOL_EDITORIAL_A,
  ...EXTRA_TOOL_EDITORIAL_B,
};
