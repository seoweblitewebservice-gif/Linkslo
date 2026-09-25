type Check = { status: "pass" | "warning" | "error" | "info"; label: string; detail: string; value?: unknown };
export type TextToolResult = { checks: Check[]; [key: string]: unknown };

/** Client-side analysis for text-mode SEO tools */
export function analyzeTextTool(slug: string, value: string): TextToolResult {
  const text = value.trim();
  if (!text) return { checks: [{ status: "error", label: "Empty input", detail: "Paste some text to analyze." }] };

  if (slug === "json-ld-validator" || slug === "schema-validator") {
    try {
      const parsed = JSON.parse(text);
      const checks: Check[] = [{ status: "pass", label: "Valid JSON", detail: "The supplied text parses as JSON." }];
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const contexts = items.filter((x) => x && typeof x === "object" && "@context" in x).length;
      const types = items.flatMap((x) => (x && typeof x === "object" && "@type" in x ? [String((x as Record<string, unknown>)["@type"])] : []));
      checks.push({ status: contexts ? "pass" : "warning", label: "@context", detail: contexts ? "A linked-data @context was detected." : "No @context field was detected." });
      checks.push({ status: types.length ? "pass" : "warning", label: "@type", detail: types.length ? `Detected type${types.length === 1 ? "" : "s"}: ${types.join(", ")}` : "No @type field was detected." });
      return { checks, parsed };
    } catch (error) {
      return { checks: [{ status: "error", label: "Invalid JSON", detail: error instanceof Error ? error.message : "The JSON could not be parsed." }] };
    }
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const lower = text.toLowerCase();

  if (slug === "word-count-analyzer" || slug === "content-length-checker") {
    return {
      checks: [
        { status: "info", label: "Words", detail: `${wordCount} words detected.`, value: wordCount },
        { status: "info", label: "Characters", detail: `${chars} characters including spaces.`, value: chars },
        {
          status: wordCount < 50 ? "warning" : wordCount < 300 ? "info" : "pass",
          label: "Length context",
          detail:
            wordCount < 50
              ? "Very short for most standalone content pages."
              : wordCount < 300
                ? "Short-to-moderate length. Evaluate against the search intent."
                : "Substantial length for many informational pages. Quality still matters more than count.",
        },
      ],
      wordCount,
      characters: chars,
    };
  }

  if (slug === "keyword-density-checker") {
    const freq = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase().replace(/[^a-z0-9'-]/g, "");
      if (k.length < 3) continue;
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    const dens = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([term, count]) => ({ term, count, density: wordCount ? +(100 * count / wordCount).toFixed(2) : 0 }));
    const high = dens.filter((d) => d.density >= 4);
    return {
      checks: [
        { status: "info", label: "Word count", detail: `${wordCount} words analyzed.`, value: wordCount },
        {
          status: high.length ? "warning" : "pass",
          label: "High density terms",
          detail: high.length
            ? `${high.length} term(s) appear at 4%+ density. Review for natural wording.`
            : "No term exceeded a 4% density threshold in this sample.",
        },
        {
          status: "info",
          label: "Top terms",
          detail: dens.slice(0, 5).map((d) => `${d.term} (${d.density}%)`).join(", ") || "No terms found.",
        },
      ],
      topTerms: dens,
    };
  }

  if (slug === "readability-score-checker" || slug === "sentence-complexity-checker") {
    const avgWords = sentences.length ? wordCount / sentences.length : wordCount;
    const longSentences = sentences.filter((s) => s.split(/\s+/).filter(Boolean).length > 25).length;
    return {
      checks: [
        { status: "info", label: "Sentences", detail: `${sentences.length} sentence-like segments detected.`, value: sentences.length },
        { status: avgWords > 22 ? "warning" : "pass", label: "Average words per sentence", detail: `${avgWords.toFixed(1)} words on average.`, value: +avgWords.toFixed(1) },
        {
          status: longSentences ? "warning" : "pass",
          label: "Long sentences",
          detail: longSentences ? `${longSentences} segment(s) exceed ~25 words.` : "No very long sentence segments detected.",
        },
      ],
      averageWordsPerSentence: +avgWords.toFixed(1),
      longSentences,
    };
  }

  if (slug === "paragraph-length-analyzer") {
    const longParas = paragraphs.filter((p) => p.split(/\s+/).filter(Boolean).length > 120).length;
    return {
      checks: [
        { status: "info", label: "Paragraphs", detail: `${paragraphs.length || 1} paragraph block(s) detected.`, value: paragraphs.length || 1 },
        {
          status: longParas ? "warning" : "pass",
          label: "Long paragraphs",
          detail: longParas ? `${longParas} block(s) look very long for web scanning.` : "Paragraph blocks look manageable for many web layouts.",
        },
      ],
    };
  }

  if (slug === "passive-voice-detector") {
    const passive = (text.match(/\b(?:is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
    return {
      checks: [
        {
          status: passive > 8 ? "warning" : "info",
          label: "Possible passive constructions",
          detail: `${passive} phrase pattern(s) resemble passive voice. Review manually; patterns are approximate.`,
          value: passive,
        },
      ],
      passiveMatches: passive,
    };
  }

  if (slug === "transition-words-checker") {
    const transitions = ["however", "therefore", "moreover", "furthermore", "meanwhile", "consequently", "additionally", "for example", "in contrast", "as a result", "on the other hand"];
    const found = transitions.filter((t) => lower.includes(t));
    return {
      checks: [
        {
          status: found.length ? "pass" : "info",
          label: "Transition phrases",
          detail: found.length ? `Found: ${found.join(", ")}` : "Few common transition phrases detected. That can be fine for short copy.",
        },
      ],
      found,
    };
  }

  if (slug === "duplicate-content-text-checker") {
    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const seen = new Map<string, number>();
    for (const line of lines) {
      const key = line.toLowerCase();
      if (key.length < 40) continue;
      seen.set(key, (seen.get(key) || 0) + 1);
    }
    const dups = [...seen.entries()].filter(([, c]) => c > 1);
    return {
      checks: [
        {
          status: dups.length ? "warning" : "pass",
          label: "Repeated long lines",
          detail: dups.length
            ? `${dups.length} long line(s) repeat inside this text.`
            : "No repeated long lines detected inside this pasted text.",
        },
        {
          status: "info",
          label: "Scope",
          detail: "This compares text against itself only. It does not crawl the web for external duplicates.",
        },
      ],
      duplicates: dups.slice(0, 20).map(([line, count]) => ({ line: line.slice(0, 180), count })),
    };
  }

  if (slug === "semantic-entity-checklist" || slug === "nap-consistency-checker") {
    const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
    const hasPhone = /\+?\d[\d\s().-]{7,}\d/.test(text);
    const hasUrl = /https?:\/\//i.test(text);
    return {
      checks: [
        { status: hasUrl ? "pass" : "info", label: "URL present", detail: hasUrl ? "At least one URL-like string was found." : "No URL detected in the pasted text." },
        { status: hasPhone ? "pass" : "info", label: "Phone-like string", detail: hasPhone ? "A phone-like pattern was found." : "No phone pattern detected." },
        { status: hasEmail ? "pass" : "info", label: "Email", detail: hasEmail ? "An email address was found." : "No email address detected." },
      ],
    };
  }

  return {
    checks: [
      { status: "info", label: "Words", detail: `${wordCount} words.`, value: wordCount },
      { status: "info", label: "Characters", detail: `${chars} characters.`, value: chars },
      { status: "info", label: "Analysis", detail: "Basic text metrics were calculated for this tool." },
    ],
    wordCount,
    characters: chars,
  };
}
