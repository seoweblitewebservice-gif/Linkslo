"use client";

import { useMemo, useState } from "react";

function interpret(score: number, kind: "DA" | "DR") {
  if (score < 20) return `A ${kind} in this range usually means a very new or small site with a light backlink profile. Not disqualifying on its own — check traffic and content quality.`;
  if (score < 40) return `A common range for smaller, established niche sites. Plenty of genuinely good publishers sit here.`;
  if (score < 60) return `A solid, established site by most standards — often a small-to-mid publication or a well-run niche authority.`;
  if (score < 80) return `A strong, well-known site with a substantial backlink history — usually a recognised publication or major niche authority.`;
  return `A very high score typically seen on major, widely-linked-to sites — news outlets, large platforms, or long-established domains.`;
}

export function DaDrExplainer() {
  const [da, setDa] = useState(45);
  const [dr, setDr] = useState(45);

  const gap = useMemo(() => Math.abs(da - dr), [da, dr]);

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Domain Authority (Moz): {da}</label>
          <input type="range" min={1} max={100} value={da} onChange={(e) => setDa(Number(e.target.value))} className="mt-2 w-full" />
          <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-500">{interpret(da, "DA")}</p>
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Domain Rating (Ahrefs): {dr}</label>
          <input type="range" min={1} max={100} value={dr} onChange={(e) => setDr(Number(e.target.value))} className="mt-2 w-full" />
          <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-500">{interpret(dr, "DR")}</p>
        </div>
      </div>

      {gap >= 15 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[0.84rem] leading-relaxed text-amber-800">
          A {gap}-point gap between DA and DR is common — the two tools use different methodologies and data sets, so
          they rarely match exactly. Neither number is &quot;more correct&quot;; use both as a rough sanity check, then look at
          real traffic and content quality to make the actual decision.
        </div>
      )}
    </div>
  );
}
