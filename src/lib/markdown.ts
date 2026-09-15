import { marked } from "marked";

export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Renders article markdown to HTML and injects id attributes on H2/H3
 * headings so the table of contents can deep-link to each section.
 */
export function renderArticleBody(markdown: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();

  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ("text" in t ? t.text : "")).join("");
    if (depth !== 2 && depth !== 3) {
      return `<h${depth}>${text}</h${depth}>`;
    }
    let id = slugify(text);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugify(text)}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    toc.push({ id, text, level: depth as 2 | 3 });
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  const html = marked.parse(markdown, { renderer, gfm: true, breaks: false }) as string;
  return { html, toc };
}
