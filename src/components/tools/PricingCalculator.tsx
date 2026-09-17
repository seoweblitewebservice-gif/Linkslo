"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const NICHE_MULTIPLIERS: Record<string, number> = {
  general: 1,
  saas: 1.35,
  finance: 1.5,
  legal: 1.45,
  health: 1.3,
  ecommerce: 1.1,
  travel: 0.95,
  lifestyle: 0.9,
};

const LINK_TYPE_MULTIPLIER: Record<string, number> = {
  dofollow: 1,
  nofollow: 0.75,
};

function formatUSD(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function PricingCalculator() {
  const [da, setDa] = useState(40);
  const [traffic, setTraffic] = useState(15000);
  const [niche, setNiche] = useState("general");
  const [linkType, setLinkType] = useState<"dofollow" | "nofollow">("dofollow");
  const [writingIncluded, setWritingIncluded] = useState(true);

  const result = useMemo(() => {
    // Base price scales with DA in three broad tiers, then adjusted by
    // traffic, niche commercial value, link type and whether writing is included.
    let base: number;
    if (da < 25) base = 45;
    else if (da < 40) base = 90;
    else if (da < 55) base = 170;
    else if (da < 70) base = 320;
    else base = 550;

    const trafficFactor = traffic > 100000 ? 1.5 : traffic > 25000 ? 1.2 : traffic > 5000 ? 1 : 0.85;
    const nicheFactor = NICHE_MULTIPLIERS[niche] ?? 1;
    const linkFactor = LINK_TYPE_MULTIPLIER[linkType] ?? 1;
    const writingFactor = writingIncluded ? 1.25 : 1;

    const mid = base * trafficFactor * nicheFactor * linkFactor * writingFactor;
    return { low: mid * 0.75, mid, high: mid * 1.35 };
  }, [da, traffic, niche, linkType, writingIncluded]);

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Domain Authority (DA): {da}</label>
          <input
            type="range"
            min={10}
            max={85}
            value={da}
            onChange={(e) => setDa(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">
            Est. monthly organic traffic: {traffic.toLocaleString("en-US")}
          </label>
          <input
            type="range"
            min={500}
            max={300000}
            step={500}
            value={traffic}
            onChange={(e) => setTraffic(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Niche</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[0.86rem]"
          >
            <option value="general">General / lifestyle</option>
            <option value="saas">SaaS / Software</option>
            <option value="finance">Finance</option>
            <option value="legal">Legal</option>
            <option value="health">Health</option>
            <option value="ecommerce">E-commerce</option>
            <option value="travel">Travel</option>
            <option value="lifestyle">Home & Lifestyle</option>
          </select>
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Link type</label>
          <select
            value={linkType}
            onChange={(e) => setLinkType(e.target.value as "dofollow" | "nofollow")}
            className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[0.86rem]"
          >
            <option value="dofollow">Dofollow</option>
            <option value="nofollow">Nofollow</option>
          </select>
        </div>
      </div>

      <label className="mt-5 flex items-center gap-2.5 text-[0.84rem] text-ink-700">
        <input type="checkbox" checked={writingIncluded} onChange={(e) => setWritingIncluded(e.target.checked)} className="h-4 w-4" />
        Article writing included in the price
      </label>

      <div className="mt-7 rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-brand-700">Suggested fair price range</p>
        <p className="mt-1 font-display text-[1.8rem] font-semibold text-ink-950">
          {formatUSD(result.low)} – {formatUSD(result.high)}
        </p>
        <p className="mt-1 text-[0.82rem] text-ink-600">Typical price: {formatUSD(result.mid)}</p>
        <p className="mt-3 flex items-start gap-2 text-[0.78rem] leading-relaxed text-ink-500">
          <Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand-600" />
          This is a modeled estimate based on typical marketplace pricing patterns, not a quote for a specific
          domain. Always check the site&apos;s actual, current metrics before paying.
        </p>
      </div>
    </div>
  );
}
