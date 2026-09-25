import type { SeoToolDefinition } from "@/lib/seo-tools/catalog";
import type { ToolEditorial } from "@/lib/seo-tools/content";
import { TECHNICAL_TOOL_EDITORIAL } from "@/lib/seo-tools/content";
import { SITEMAP_TOOL_EDITORIAL } from "@/lib/seo-tools/content-sitemaps";
import { STRUCTURED_TOOL_EDITORIAL } from "@/lib/seo-tools/content-structured";
import { ONPAGE_TOOL_EDITORIAL } from "@/lib/seo-tools/content-onpage";
import { SOCIAL_TOOL_EDITORIAL } from "@/lib/seo-tools/content-social";

const ALL_TOOL_EDITORIAL: Record<string, ToolEditorial> = {
  ...TECHNICAL_TOOL_EDITORIAL,
  ...SITEMAP_TOOL_EDITORIAL,
  ...STRUCTURED_TOOL_EDITORIAL,
  ...ONPAGE_TOOL_EDITORIAL,
  ...SOCIAL_TOOL_EDITORIAL,
};

function fallbackEditorial(tool: SeoToolDefinition): ToolEditorial {
  const name = tool.name;
  const summary = tool.summary;
  const modeHelp =
    tool.mode === "text"
      ? [
          `Paste the content you want to inspect into the ${name}.`,
          "Run the analysis and review the summary checks first.",
          "Open detailed metrics and examples highlighted by the tool.",
          "Revise based on clarity and structure rather than a single score.",
          "Re-run after edits to confirm the improvement.",
        ]
      : tool.mode === "generator"
        ? [
            `Fill in the fields required by the ${name}.`,
            "Generate the output and review it before publishing.",
            "Copy only the parts you need into your CMS or workflow.",
            "Adapt the result to your brand voice and page intent.",
            "Document when this output should be reused for consistency.",
          ]
        : [
            `Enter the page URL you want to inspect with the ${name}.`,
            "Run the check and review pass, warning and error results.",
            "Open technical details for the exact signals detected.",
            "Fix high-impact issues first, especially those that affect users or crawl clarity.",
            "Re-test the URL after deployment to confirm the change is live.",
          ];

  return {
    definition: `The ${name} is a free Linkslo SEO utility for ${tool.category.toLowerCase()} work. ${summary}`,
    whyItMatters:
      "Focused checks help teams verify one signal clearly before broader changes. Template-level mistakes often repeat across many URLs, so catching them early protects both users and crawl efficiency.",
    howToUse: modeHelp,
    interpretation: [
      "Treat results as evidence for a specific question, not a final ranking score.",
      "Context matters: a warning can be acceptable on some templates and urgent on others.",
      "Compare important commercial or informational URLs against known good examples on your site.",
      "Combine this check with manual review when the page serves a unique business purpose.",
    ],
    commonProblems: [
      "Issues are ignored until rankings move, then fixed incompletely under pressure.",
      "Template mistakes get copied across many URLs.",
      "Scores are optimized while user clarity is ignored.",
      "Changes are deployed without a re-test of the live URL.",
    ],
    fixes: [
      "Prioritize issues that affect users, crawl paths or clear content understanding.",
      "Fix shared templates once so corrections apply broadly.",
      "Document the preferred pattern for writers and developers.",
      "Re-run the tool after release and keep a short before/after note for stakeholders.",
    ],
    bestPractices: [
      `Use the ${name} during content production and technical QA, not only after problems appear.`,
      "Keep standards written and shared so freelancers and agencies follow the same rules.",
      "Pair automated checks with human review of the rendered page.",
      "Track recurring issues so the root cause can be fixed in the CMS or design system.",
    ],
    example: `A team runs the ${name} on a priority page, fixes the highest-impact issue, then re-tests the live URL before marking the task complete.`,
    limitations: `The ${name} inspects the signals available from the input you provide. It cannot see Google's private index state, every JavaScript-only experience beyond the fetched response, or every business constraint unique to your site.`,
    faqs: [
      { question: `What does the ${name} check?`, answer: summary },
      { question: `Is the ${name} free?`, answer: "Yes. Linkslo provides this tool free for practical SEO checks and education." },
      { question: "Can one tool replace a full SEO audit?", answer: "No. Focused tools answer specific questions. Full audits combine many signals, analytics and business context." },
      { question: "How often should I run this tool?", answer: "Use it when publishing or updating important pages, after template changes, and during periodic QA." },
      { question: "Why did my result change after a redesign?", answer: "Templates, markup and content structure often change during redesigns. Re-test priority URLs after major releases." },
    ],
  };
}

export function getSeoToolEditorial(tool: SeoToolDefinition) {
  return ALL_TOOL_EDITORIAL[tool.slug] ?? fallbackEditorial(tool);
}

export const SEO_TOOL_EDITORIAL_COUNT = Object.keys(ALL_TOOL_EDITORIAL).length;
