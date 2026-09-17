"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Category = "Exact match" | "Partial match" | "Branded" | "Naked URL" | "Generic" | "Other";

const GENERIC_PHRASES = ["click here", "read more", "this article", "learn more", "this page", "here", "this post", "check this out", "source", "this link", "website", "our site"];

function classify(anchor: string, brand: string, keyword: string): Category {
  const a = anchor.trim().toLowerCase();
  if (!a) return "Other";
  if (/^(https?:\/\/|www\.)/.test(a) || /\.(com|net|org|io|co)(\/|$)/.test(a)) return "Naked URL";
  if (GENERIC_PHRASES.some((g) => a === g || a.includes(g))) return "Generic";
  if (brand && a.includes(brand.trim().toLowerCase())) return "Branded";
  if (keyword) {
    const kw = keyword.trim().toLowerCase();
    if (a === kw) return "Exact match";
    const kwWords = kw.split(/\s+/).filter(Boolean);
    const overlap = kwWords.filter((w) => a.includes(w)).length;
    if (kwWords.length > 0 && overlap / kwWords.length >= 0.5) return "Partial match";
  }
  return "Other";
}

const CATEGORY_COLOR: Record<Category, string> = {
  "Exact match": "bg-rose-100 text-rose-700",
  "Partial match": "bg-amber-100 text-amber-700",
  Branded: "bg-emerald-100 text-emerald-700",
  "Naked URL": "bg-sky-100 text-sky-700",
  Generic: "bg-ink-100 text-ink-600",
  Other: "bg-brand-50 text-brand-700",
};

const SAFE_RANGES: Record<Category, string> = {
  "Exact match": "Keep under ~10%",
  "Partial match": "10–25% is common",
  Branded: "30–50% is typical for a healthy profile",
  "Naked URL": "10–25% is common",
  Generic: "5–15% is fine",
  Other: "Remaining long-tail/topical anchors",
};

export function AnchorChecker() {
  const [brand, setBrand] = useState("");
  const [keyword, setKeyword] = useState("");
  const [raw, setRaw] = useState("");

  const anchors = useMemo(() => raw.split("\n").map((l) => l.trim()).filter(Boolean), [raw]);

  const results = useMemo(() => {
    const counts: Record<Category, number> = {
      "Exact match": 0,
      "Partial match": 0,
      Branded: 0,
      "Naked URL": 0,
      Generic: 0,
      Other: 0,
    };
    anchors.forEach((a) => {
      counts[classify(a, brand, keyword)] += 1;
    });
    const total = anchors.length || 1;
    return (Object.keys(counts) as Category[]).map((cat) => ({
      category: cat,
      count: counts[cat],
      pct: Math.round((counts[cat] / total) * 100),
    }));
  }, [anchors, brand, keyword]);

  const exactPct = results.find((r) => r.category === "Exact match")?.pct ?? 0;

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Your brand name (optional)</label>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Linkslo"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-[0.86rem]"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Primary target keyword (optional)</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. project management software"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-[0.86rem]"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-[0.78rem] font-semibold text-ink-700">Paste your anchor texts, one per line</label>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          placeholder={"project management software\nclick here\nAcme Corp\nhttps://acme.com\nhow Acme helps teams ship faster"}
          className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 font-mono text-[0.82rem]"
        />
      </div>

      {anchors.length > 0 && (
        <div className="mt-6">
          <p className="text-[0.78rem] font-semibold uppercase tracking-wide text-ink-400">
            {anchors.length} anchors analysed
          </p>
          <div className="mt-3 space-y-2.5">
            {results
              .filter((r) => r.count > 0)
              .sort((a, b) => b.count - a.count)
              .map((r) => (
                <div key={r.category} className="flex items-center gap-3">
                  <span className={`w-32 shrink-0 rounded-full px-2.5 py-1 text-center text-[0.68rem] font-semibold ${CATEGORY_COLOR[r.category]}`}>
                    {r.category}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-canvas">
                    <div className="h-full rounded-full bg-ink-950" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-[0.8rem] font-semibold text-ink-800">
                    {r.pct}% ({r.count})
                  </span>
                  <span className="hidden w-40 shrink-0 text-[0.7rem] text-ink-400 sm:block">{SAFE_RANGES[r.category]}</span>
                </div>
              ))}
          </div>

          {exactPct > 15 && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Icon name="target" size={16} className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-[0.82rem] leading-relaxed text-amber-800">
                Exact-match anchors make up {exactPct}% of this list, above the ~10% range most healthy profiles stay
                under. Consider varying more of these toward branded or partial-match phrasing.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
