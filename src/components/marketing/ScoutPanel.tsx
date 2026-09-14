"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { DonutGauge, ProgressBar } from "@/components/charts/Charts";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button } from "@/components/ui/primitives";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/format";

type ScoutResponse = {
  ok: boolean;
  result?: {
    domain: string;
    keyword: string;
    market: string;
    industry: string;
    opportunityScore: number;
    authorityEstimate: number;
    topicalRelevance: number;
    difficulty: number;
    referringDomainGap: number;
    estimatedTimeframe: string;
    summary: string;
    competitors: { domain: string; authority: number; referringDomains: number; sharedKeywords: number; overlap: number }[];
    contentGaps: { title: string; intent: string; difficulty: number; monthlyVolume: number }[];
    signals: { label: string; value: string; tone: "positive" | "neutral" | "watch" }[];
    opportunities: {
      id: number;
      domain: string;
      displayName: string;
      authority: number;
      organicTraffic: number;
      price: number;
      country: string;
      publicationType: string;
      relevance: number;
    }[];
  };
  errors?: Record<string, string>;
  message?: string;
};

const MARKETS = ["Global", "United States", "United Kingdom", "Germany", "France", "Netherlands", "Sweden", "Australia"];

const EXAMPLES = [
  { domain: "northloop.io", keyword: "product analytics platform" },
  { domain: "kestrelfinancial.com", keyword: "business bank account" },
  { domain: "verdantstudio.eu", keyword: "sustainable furniture" },
];

export function ScoutPanel({ compact = false }: { compact?: boolean }) {
  const [domain, setDomain] = useState("northloop.io");
  const [keyword, setKeyword] = useState("product analytics platform");
  const [market, setMarket] = useState("Global");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ScoutResponse["result"] | null>(null);
  const [notice, setNotice] = useState("");

  async function analyse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setNotice("");
    try {
      const response = await fetch("/api/link-gap-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, keyword, market }),
      });
      const data = (await response.json()) as ScoutResponse;
      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setNotice(data.message ?? "Check the fields above and try again.");
        setResult(null);
        return;
      }
      setResult(data.result ?? null);
    } catch {
      setNotice("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_-45px_rgba(6,20,25,0.4)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-canvas/70 px-5 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-white">
          <Icon name="compass" size={17} />
        </span>
        <div>
          <p className="text-[0.9rem] font-semibold text-ink-950">Link Gap Scout</p>
          <p className="text-[0.72rem] text-ink-400">Opportunity analysis · sample intelligence model</p>
        </div>
        <span className="ml-auto hidden rounded-full bg-brand-50 px-2.5 py-1 text-[0.68rem] font-semibold text-brand-700 sm:inline">
          Free to run
        </span>
      </div>

      <form onSubmit={analyse} noValidate className="grid gap-3 border-b border-line p-5 md:grid-cols-[1.1fr_1.3fr_0.8fr_auto]">
        <div>
          <label htmlFor="scout-domain" className="mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
            Your website
          </label>
          <input
            id="scout-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="yourdomain.com"
            aria-invalid={Boolean(errors.domain)}
            className={`h-11 w-full rounded-xl border px-3.5 text-[0.88rem] transition-colors focus:border-brand-400 ${
              errors.domain ? "border-rose-accent bg-[#fdf4f5]" : "border-line bg-canvas hover:border-ink-200"
            }`}
          />
          {errors.domain && <p className="mt-1 text-[0.72rem] text-rose-accent">{errors.domain}</p>}
        </div>
        <div>
          <label htmlFor="scout-keyword" className="mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
            Target keyword
          </label>
          <input
            id="scout-keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="e.g. project management software"
            aria-invalid={Boolean(errors.keyword)}
            className={`h-11 w-full rounded-xl border px-3.5 text-[0.88rem] transition-colors focus:border-brand-400 ${
              errors.keyword ? "border-rose-accent bg-[#fdf4f5]" : "border-line bg-canvas hover:border-ink-200"
            }`}
          />
          {errors.keyword && <p className="mt-1 text-[0.72rem] text-rose-accent">{errors.keyword}</p>}
        </div>
        <div>
          <label htmlFor="scout-market" className="mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
            Market
          </label>
          <div className="relative">
            <select
              id="scout-market"
              value={market}
              onChange={(event) => setMarket(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-line bg-canvas pl-3.5 pr-9 text-[0.88rem] hover:border-ink-200 focus:border-brand-400"
            >
              {MARKETS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>
        </div>
        <div className="flex items-end">
          <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto" icon={loading ? undefined : "spark"}>
            {loading ? "Analysing…" : "Run analysis"}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3 text-[0.76rem] text-ink-400">
        <span>Try:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.domain}
            type="button"
            onClick={() => {
              setDomain(example.domain);
              setKeyword(example.keyword);
            }}
            className="rounded-full border border-line px-2.5 py-1 font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
          >
            {example.keyword}
          </button>
        ))}
      </div>

      {notice && (
        <p role="alert" className="border-b border-line bg-[#fdf4f5] px-5 py-3 text-[0.82rem] text-rose-accent">
          {notice}
        </p>
      )}

      {!result && !loading && (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon name="search" size={22} />
          </div>
          <p className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">
            Run an analysis to see your opportunity map
          </p>
          <p className="mx-auto mt-1.5 max-w-md text-[0.86rem] text-ink-500">
            Link Gap Scout estimates your competitive position, surfaces missing content angles and
            matches screened publishers in your category.
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-3 p-6">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-14 animate-pulse rounded-xl bg-canvas" />
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="animate-rise divide-y divide-line">
          <div className="grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
            <div className="flex flex-col items-center">
              <DonutGauge value={result.opportunityScore} label={String(result.opportunityScore)} caption="Opportunity" size={124} />
              <Badge tone="brand" className="mt-2">
                {result.industry}
              </Badge>
            </div>
            <div>
              <p className="text-[0.95rem] leading-relaxed text-ink-700">{result.summary}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Authority estimate", value: String(result.authorityEstimate) },
                  { label: "Topical relevance", value: `${result.topicalRelevance}%` },
                  { label: "Difficulty", value: `${result.difficulty}/100` },
                  { label: "Est. timeframe", value: result.estimatedTimeframe },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-xl bg-canvas px-3 py-2.5">
                    <dt className="text-[0.64rem] uppercase tracking-wide text-ink-400">{metric.label}</dt>
                    <dd className="mt-0.5 font-display text-[1.02rem] font-semibold text-ink-950">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {!compact && (
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
                <h3 className="text-[0.88rem] font-semibold text-ink-950">Competing domains</h3>
                <ul className="mt-3 space-y-2.5">
                  {result.competitors.map((competitor) => (
                    <li key={competitor.domain} className="rounded-xl border border-line px-3.5 py-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-[0.84rem] font-medium text-ink-900">
                          {competitor.domain}
                        </span>
                        <Badge tone="neutral">DR {competitor.authority}</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[0.72rem] text-ink-400">
                        <span>{formatNumber(competitor.referringDomains)} referring domains</span>
                        <span>{formatNumber(competitor.sharedKeywords)} shared keywords</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ProgressBar value={competitor.overlap} tone="violet" className="flex-1" />
                        <span className="text-[0.68rem] text-ink-500">{competitor.overlap}% overlap</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5">
                <h3 className="text-[0.88rem] font-semibold text-ink-950">Content gaps to close</h3>
                <ul className="mt-3 space-y-2.5">
                  {result.contentGaps.map((gap) => (
                    <li
                      key={gap.title}
                      className="flex items-start justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.84rem] font-medium text-ink-900">{gap.title}</p>
                        <p className="text-[0.72rem] text-ink-400">
                          {gap.intent} · {formatNumber(gap.monthlyVolume)} monthly searches
                        </p>
                      </div>
                      <Badge tone={gap.difficulty > 60 ? "amber" : "brand"}>KD {gap.difficulty}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[0.88rem] font-semibold text-ink-950">
                Matched publishing opportunities
              </h3>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-brand-700 hover:text-brand-800"
              >
                See all in marketplace
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {result.opportunities.map((item) => (
                <div key={item.id} className="card-hover rounded-xl border border-line p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[0.84rem] font-semibold text-ink-950">{item.domain}</p>
                    <Badge tone="brand">DR {item.authority}</Badge>
                  </div>
                  <p className="mt-0.5 text-[0.72rem] text-ink-400">
                    {item.country} · {item.publicationType}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[0.76rem] text-ink-500">
                      {formatCompact(item.organicTraffic)} visits
                    </span>
                    <span className="font-display text-[0.95rem] font-semibold text-ink-950">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
              ))}
              {!result.opportunities.length && (
                <p className="text-[0.84rem] text-ink-500">
                  No inventory matched that category yet — our sourcing team can build it on request.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-canvas/70 px-5 py-3">
            {result.signals.map((signal) => (
              <span
                key={signal.label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-medium ${
                  signal.tone === "positive"
                    ? "border-brand-100 bg-brand-50 text-brand-800"
                    : signal.tone === "watch"
                      ? "border-[#f8e5c4] bg-[#fdf4e6] text-[#94620f]"
                      : "border-line bg-white text-ink-600"
                }`}
              >
                <strong className="font-semibold">{signal.label}:</strong> {signal.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
