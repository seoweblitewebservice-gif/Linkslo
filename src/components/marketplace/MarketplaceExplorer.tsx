"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button } from "@/components/ui/primitives";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/format";

export type Listing = {
  id: number;
  slug: string;
  domain: string;
  displayName: string;
  industry: string;
  country: string;
  language: string;
  authority: number;
  organicTraffic: number;
  price: number;
  linkType: string;
  publicationType: string;
  turnaroundDays: number;
  relevance: number;
  featured: boolean;
};

export type Facets = {
  industries: string[];
  countries: string[];
  languages: string[];
  linkTypes: string[];
  publicationTypes: string[];
};

type Filters = {
  q: string;
  industry: string;
  country: string;
  language: string;
  linkType: string;
  publicationType: string;
  minAuthority: number;
  minTraffic: number;
  maxPrice: number;
  sort: string;
};

const DEFAULTS: Filters = {
  q: "",
  industry: "",
  country: "",
  language: "",
  linkType: "",
  publicationType: "",
  minAuthority: 0,
  minTraffic: 0,
  maxPrice: 0,
  sort: "relevance",
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Best match" },
  { value: "authority-desc", label: "Authority: high to low" },
  { value: "authority-asc", label: "Authority: low to high" },
  { value: "traffic-desc", label: "Traffic: high to low" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "delivery-asc", label: "Fastest delivery" },
];

const COUNTRY_CODES: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "UK",
  Germany: "DE",
  France: "FR",
  Spain: "ES",
  Netherlands: "NL",
  Sweden: "SE",
  Canada: "CA",
  Australia: "AU",
  Italy: "IT",
  Poland: "PL",
  Denmark: "DK",
  Ireland: "IE",
  Switzerland: "CH",
  Portugal: "PT",
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-line bg-white pl-3 pr-8 text-[0.85rem] text-ink-800 transition-colors hover:border-ink-200 focus:border-brand-400"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={15}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400"
        />
      </div>
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
        {label}
        <span className="font-mono text-[0.74rem] normal-case tracking-normal text-ink-700">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-100"
        aria-label={label}
      />
    </label>
  );
}

export function MarketplaceExplorer({
  facets,
  variant = "full",
  initialFilters,
  initialData,
}: {
  facets: Facets;
  variant?: "full" | "preview";
  initialFilters?: Partial<Filters>;
  /** Server-fetched first page, so crawlers and no-JS clients see real results immediately instead of an empty "Updating…" state. */
  initialData?: { items: Listing[]; total: number; summary: { avgAuthority: number; medianPrice: number; avgDelivery: number } };
}) {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULTS, ...initialFilters });
  const [items, setItems] = useState<Listing[]>(initialData?.items ?? []);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [summary, setSummary] = useState(initialData?.summary ?? { avgAuthority: 0, medianPrice: 0, avgDelivery: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(!initialData);
  const [panelOpen, setPanelOpen] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const requestId = useRef(0);
  const skippedFirstFetch = useRef(false);

  const pageSize = variant === "preview" ? 6 : 12;

  const update = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  useEffect(() => {
    if (initialData && !skippedFirstFetch.current) {
      skippedFirstFetch.current = true;
      return;
    }
    const controller = new AbortController();
    const id = requestId.current + 1;
    requestId.current = id;

    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sort: filters.sort,
      });
      if (filters.q) params.set("q", filters.q);
      if (filters.industry) params.set("industry", filters.industry);
      if (filters.country) params.set("country", filters.country);
      if (filters.language) params.set("language", filters.language);
      if (filters.linkType) params.set("linkType", filters.linkType);
      if (filters.publicationType) params.set("publicationType", filters.publicationType);
      if (filters.minAuthority) params.set("minAuthority", String(filters.minAuthority));
      if (filters.minTraffic) params.set("minTraffic", String(filters.minTraffic));
      if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));

      try {
        const response = await fetch(`/api/marketplace?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          items: Listing[];
          total: number;
          summary: typeof summary;
        };
        if (requestId.current !== id) return;
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
        setSummary(data.summary ?? { avgAuthority: 0, medianPrice: 0, avgDelivery: 0 });
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        if (requestId.current === id) setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // initialData is intentionally read only once via the skippedFirstFetch ref guard above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  const activeCount = useMemo(
    () =>
      (Object.keys(DEFAULTS) as (keyof Filters)[]).filter(
        (key) => key !== "sort" && filters[key] !== DEFAULTS[key],
      ).length,
    [filters],
  );

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const filterPanel = (
    <div className="space-y-5">
      <SelectField
        label="Industry"
        value={filters.industry}
        onChange={(value) => update("industry", value)}
        options={facets.industries}
        placeholder="All industries"
      />
      <SelectField
        label="Country"
        value={filters.country}
        onChange={(value) => update("country", value)}
        options={facets.countries}
        placeholder="All countries"
      />
      <SelectField
        label="Language"
        value={filters.language}
        onChange={(value) => update("language", value)}
        options={facets.languages}
        placeholder="All languages"
      />
      <SelectField
        label="Publication type"
        value={filters.publicationType}
        onChange={(value) => update("publicationType", value)}
        options={facets.publicationTypes}
        placeholder="All formats"
      />
      <div>
        <span className="mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
          Link type
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["", ...facets.linkTypes].map((type) => (
            <button
              key={type || "any"}
              type="button"
              onClick={() => update("linkType", type)}
              aria-pressed={filters.linkType === type}
              className={`rounded-lg border px-2.5 py-1.5 text-[0.78rem] font-medium transition-colors ${
                filters.linkType === type
                  ? "border-brand-300 bg-brand-50 text-brand-800"
                  : "border-line bg-white text-ink-600 hover:border-ink-200"
              }`}
            >
              {type || "Any"}
            </button>
          ))}
        </div>
      </div>
      <RangeField
        label="Min. authority"
        value={filters.minAuthority}
        min={0}
        max={90}
        step={5}
        format={(value) => (value ? `DR ${value}+` : "Any")}
        onChange={(value) => update("minAuthority", value)}
      />
      <RangeField
        label="Min. organic traffic"
        value={filters.minTraffic}
        min={0}
        max={200000}
        step={5000}
        format={(value) => (value ? `${formatCompact(value)}+` : "Any")}
        onChange={(value) => update("minTraffic", value)}
      />
      <RangeField
        label="Max. price"
        value={filters.maxPrice}
        min={0}
        max={2500}
        step={50}
        format={(value) => (value ? `≤ €${formatNumber(value)}` : "Any")}
        onChange={(value) => update("maxPrice", value)}
      />
      <button
        type="button"
        onClick={() => {
          setFilters({ ...DEFAULTS, sort: filters.sort });
          setPage(1);
        }}
        className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-ink-500 transition-colors hover:text-brand-700"
      >
        <Icon name="close" size={14} />
        Reset filters {activeCount > 0 && `(${activeCount})`}
      </button>
    </div>
  );

  return (
    <div className={variant === "full" ? "grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]" : ""}>
      {variant === "full" && (
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="sliders" size={17} className="text-brand-600" />
              <h3 className="text-[0.92rem] font-semibold text-ink-950">Refine results</h3>
            </div>
            {filterPanel}
          </div>
        </aside>
      )}

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                type="search"
                value={filters.q}
                onChange={(event) => update("q", event.target.value)}
                placeholder="Search domains, publications or niches…"
                aria-label="Search marketplace"
                className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-3 text-[0.9rem] text-ink-900 transition-colors placeholder:text-ink-400 hover:border-ink-200 focus:border-brand-400 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              {variant === "full" && (
                <button
                  type="button"
                  onClick={() => setPanelOpen((value) => !value)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:border-ink-200 lg:hidden"
                  aria-expanded={panelOpen}
                >
                  <Icon name="filter" size={16} />
                  Filters
                  {activeCount > 0 && (
                    <span className="rounded-full bg-brand-600 px-1.5 text-[0.68rem] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
              )}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={filters.sort}
                  onChange={(event) => update("sort", event.target.value)}
                  aria-label="Sort results"
                  className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3.5 pr-9 text-[0.85rem] font-medium text-ink-800 transition-colors hover:border-ink-200 focus:border-brand-400"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
              </div>
            </div>
          </div>

          {variant === "preview" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {facets.industries.slice(0, 5).map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => update("industry", filters.industry === industry ? "" : industry)}
                  aria-pressed={filters.industry === industry}
                  className={`rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition-colors ${
                    filters.industry === industry
                      ? "border-brand-300 bg-brand-50 text-brand-800"
                      : "border-line bg-white text-ink-600 hover:border-ink-200"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          )}

          {variant === "full" && panelOpen && (
            <div className="mt-4 animate-fade-scale rounded-xl border border-line bg-canvas p-4 lg:hidden">
              {filterPanel}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line pt-3 text-[0.78rem] text-ink-500">
            <span>
              <strong className="font-semibold text-ink-900">{formatNumber(total)}</strong>{" "}
              opportunities
            </span>
            <span>
              Avg. authority{" "}
              <strong className="font-semibold text-ink-900">DR {summary.avgAuthority}</strong>
            </span>
            <span>
              Median price{" "}
              <strong className="font-semibold text-ink-900">
                {formatCurrency(summary.medianPrice)}
              </strong>
            </span>
            <span>
              Avg. delivery{" "}
              <strong className="font-semibold text-ink-900">{summary.avgDelivery} days</strong>
            </span>
            {loading && <span className="text-brand-600">Updating…</span>}
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Available publishing opportunities</caption>
            <thead>
              <tr className="border-b border-line bg-canvas/70 text-[0.7rem] uppercase tracking-[0.08em] text-ink-400">
                <th scope="col" className="px-4 py-3 font-semibold">Website</th>
                <th scope="col" className="px-3 py-3 font-semibold">Industry</th>
                <th scope="col" className="px-3 py-3 font-semibold">Authority</th>
                <th scope="col" className="px-3 py-3 font-semibold">Traffic</th>
                <th scope="col" className="px-3 py-3 font-semibold">Country</th>
                <th scope="col" className="px-3 py-3 font-semibold">Delivery</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Price</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="group transition-colors hover:bg-brand-50/35">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-[0.65rem] font-bold uppercase text-white">
                        {item.domain.slice(0, 2)}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-[0.86rem] font-semibold text-ink-950">
                            {item.domain}
                          </span>
                          {item.featured && <Badge tone="amber">Featured</Badge>}
                        </span>
                        <span className="block text-[0.72rem] text-ink-400">
                          {item.publicationType} · {item.linkType}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[0.8rem] text-ink-600">{item.industry}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="font-mono text-[0.82rem] font-semibold text-ink-900">
                        {item.authority}
                      </span>
                      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className="block h-full rounded-full bg-brand-500"
                          style={{ width: `${item.authority}%` }}
                        />
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[0.82rem] font-medium text-ink-800">
                      {formatCompact(item.organicTraffic)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[0.8rem] text-ink-600">
                    {COUNTRY_CODES[item.country] ?? item.country}
                  </td>
                  <td className="px-3 py-3 text-[0.8rem] text-ink-600">{item.turnaroundDays} days</td>
                  <td className="px-3 py-3 text-right font-display text-[0.92rem] font-semibold text-ink-950">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSaved((current) =>
                            current.includes(item.id)
                              ? current.filter((id) => id !== item.id)
                              : [...current, item.id],
                          )
                        }
                        aria-pressed={saved.includes(item.id)}
                        aria-label={`Save ${item.domain}`}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                          saved.includes(item.id)
                            ? "border-brand-300 bg-brand-50 text-brand-700"
                            : "border-line text-ink-400 hover:border-ink-200 hover:text-ink-700"
                        }`}
                      >
                        <Icon name="star" size={14} filled={saved.includes(item.id)} />
                      </button>
                      <Link
                        href={`/marketplace/gigs/${encodeURIComponent(item.slug)}`}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-[0.76rem] font-semibold text-ink-800 transition-colors group-hover:border-brand-300 group-hover:bg-brand-600 group-hover:text-white"
                      >
                        View
                        <Icon name="arrow-right" size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <p className="font-display text-base font-semibold text-ink-900">
                      No opportunities match those filters
                    </p>
                    <p className="mt-1 text-[0.85rem] text-ink-500">
                      Try widening authority or price, or clear a filter to see more inventory.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="mt-4 space-y-3 md:hidden">
          {items.map((item) => (
            <li key={item.id} className="card-hover rounded-2xl border border-line bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[0.92rem] font-semibold text-ink-950">{item.domain}</p>
                  <p className="text-[0.75rem] text-ink-400">
                    {item.industry} · {COUNTRY_CODES[item.country] ?? item.country}
                  </p>
                </div>
                <span className="font-display text-[1.05rem] font-semibold text-ink-950">
                  {formatCurrency(item.price)}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-canvas p-3 text-center">
                <div>
                  <dt className="text-[0.64rem] uppercase tracking-wide text-ink-400">Authority</dt>
                  <dd className="text-[0.86rem] font-semibold text-ink-900">{item.authority}</dd>
                </div>
                <div>
                  <dt className="text-[0.64rem] uppercase tracking-wide text-ink-400">Traffic</dt>
                  <dd className="text-[0.86rem] font-semibold text-ink-900">
                    {formatCompact(item.organicTraffic)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.64rem] uppercase tracking-wide text-ink-400">Delivery</dt>
                  <dd className="text-[0.86rem] font-semibold text-ink-900">
                    {item.turnaroundDays}d
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="brand">{item.linkType}</Badge>
                  <Badge>{item.publicationType}</Badge>
                </div>
                <Link
                  href={`/marketplace/gigs/${encodeURIComponent(item.slug)}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-ink-950 px-3 py-2 text-[0.78rem] font-semibold text-white"
                >
                  View
                  <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {variant === "full" ? (
          <nav
            aria-label="Pagination"
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft"
          >
            <p className="text-[0.82rem] text-ink-500">
              Page <strong className="text-ink-900">{page}</strong> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                disabled={page <= 1}
                className="inline-flex h-9 items-center rounded-lg border border-line px-3 text-[0.82rem] font-semibold text-ink-700 transition-colors hover:border-ink-200 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                disabled={page >= totalPages}
                className="inline-flex h-9 items-center rounded-lg border border-line px-3 text-[0.82rem] font-semibold text-ink-700 transition-colors hover:border-ink-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </nav>
        ) : (
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-[0.85rem] text-ink-500">
              Showing {items.length} of {formatNumber(total)} matching opportunities.
            </p>
            <Button href="/marketplace" icon="arrow-right">
              Open full marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
