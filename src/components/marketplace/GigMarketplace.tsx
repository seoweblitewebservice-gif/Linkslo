"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/primitives";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { GigPackage } from "@/lib/gigs/types";

export type GigFacets = {
  categories: string[];
  subcategories: string[];
  industries: string[];
  countries: string[];
  languages: string[];
};

type GigCard = {
  id: number;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  industry: string;
  country: string;
  language: string;
  objective: string;
  summary: string;
  sellerName: string;
  sellerHandle: string;
  sellerInitials: string;
  sellerCountry: string;
  sellerLevel: string;
  sellerResponseHours: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  ordersCompleted: number;
  startingPrice: number;
  fastestDeliveryDays: number;
  packages: GigPackage[];
  featured: boolean;
};

type Filters = {
  q: string;
  category: string;
  subcategory: string;
  industry: string;
  country: string;
  language: string;
  sellerLevel: string;
  maxPrice: number;
  maxDelivery: number;
  minRating: number;
  verified: boolean;
  sort: string;
};

const DEFAULTS: Filters = {
  q: "",
  category: "",
  subcategory: "",
  industry: "",
  country: "",
  language: "",
  sellerLevel: "",
  maxPrice: 0,
  maxDelivery: 0,
  minRating: 0,
  verified: false,
  sort: "recommended",
};

const LEVELS = ["Level One", "Level Two", "Top Rated", "Pro Verified"];
const SORTS = [
  ["recommended", "Recommended"],
  ["bestselling", "Best selling"],
  ["rating-desc", "Highest rated"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["delivery-asc", "Fastest delivery"],
  ["newest", "Newest arrivals"],
] as const;

const COVER_STYLES = [
  "from-[#063b32] via-[#08745d] to-[#3dbd95]",
  "from-[#173159] via-[#2f67ae] to-[#6ea7f0]",
  "from-[#55330f] via-[#a96918] to-[#f0b45c]",
  "from-[#432472] via-[#6b49c6] to-[#a08bf1]",
  "from-[#5b233a] via-[#a94468] to-[#ed82a3]",
  "from-[#18333c] via-[#345e6b] to-[#75aab4]",
] as const;

function SelectFilter({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-line bg-white pl-3 pr-8 text-[0.82rem] text-ink-800 hover:border-ink-200 focus:border-brand-400"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
      </span>
    </label>
  );
}

function GigCardView({
  gig,
  saved,
  onSave,
}: {
  gig: GigCard;
  saved: boolean;
  onSave: () => void;
}) {
  const [tierIndex, setTierIndex] = useState(1);
  const pkg = gig.packages[tierIndex] ?? gig.packages[0];
  const cover = COVER_STYLES[gig.id % COVER_STYLES.length];

  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <Link
        href={`/marketplace/gigs/${gig.slug}`}
        className={`relative block h-40 overflow-hidden bg-gradient-to-br ${cover} p-5 text-white`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <span className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full border-[25px] border-white/10" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <Icon name={gig.category.includes("PR") || gig.category.includes("News") ? "megaphone" : gig.category.includes("Local") ? "pin" : gig.category.includes("Strategy") || gig.category.includes("Competitor") ? "compass" : "link"} size={20} />
            </span>
            {gig.featured && (
              <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>
          <div>
            <p className="text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-white/70">{gig.category}</p>
            <p className="mt-1 line-clamp-2 font-display text-[1.05rem] font-semibold leading-snug">{gig.subcategory}</p>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-[0.68rem] font-semibold text-white">
            {gig.sellerInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-[0.8rem] font-semibold text-ink-900">
              {gig.sellerName}
              {gig.verified && <Icon name="shield" size={13} className="shrink-0 text-brand-600" />}
            </p>
            <p className="truncate text-[0.68rem] text-ink-400">{gig.sellerLevel} · {gig.sellerCountry}</p>
          </div>
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            aria-label={`${saved ? "Remove" : "Save"} ${gig.title}`}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
              saved ? "border-brand-300 bg-brand-50 text-brand-700" : "border-line text-ink-400 hover:border-brand-200 hover:text-brand-700"
            }`}
          >
            <Icon name="star" size={14} filled={saved} />
          </button>
        </div>

        <h2 className="mt-4 line-clamp-2 font-display text-[0.98rem] font-semibold leading-snug text-ink-950">
          <Link href={`/marketplace/gigs/${gig.slug}`} className="transition-colors hover:text-brand-700">{gig.title}</Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-[0.79rem] leading-relaxed text-ink-500">{gig.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem]">
          <span className="inline-flex items-center gap-1 font-semibold text-ink-900">
            <Icon name="star" size={12} filled className="text-amber-accent" />
            {(gig.rating / 10).toFixed(1)}
            <span className="font-normal text-ink-400">({formatNumber(gig.reviewCount)})</span>
          </span>
          <span className="text-ink-400">{formatNumber(gig.ordersCompleted)} orders</span>
          <span className="inline-flex items-center gap-1 text-ink-400"><Icon name="clock" size={11} />~{gig.sellerResponseHours}h</span>
        </div>

        {pkg && (
          <div className="mt-4 rounded-xl border border-line bg-canvas/70 p-2.5">
            <div className="grid grid-cols-3 gap-1" role="tablist" aria-label={`${gig.title} packages`}>
              {gig.packages.map((item, index) => (
                <button
                  key={item.tier}
                  type="button"
                  role="tab"
                  aria-selected={tierIndex === index}
                  onClick={() => setTierIndex(index)}
                  className={`rounded-lg px-1 py-1.5 text-[0.67rem] font-semibold capitalize transition-colors ${
                    tierIndex === index ? "bg-white text-ink-950 shadow-sm" : "text-ink-400 hover:text-ink-700"
                  }`}
                >
                  {item.tier}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-end justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="truncate text-[0.72rem] font-semibold text-ink-800">{pkg.name}</p>
                <p className="text-[0.64rem] text-ink-400">{pkg.quantity} · {pkg.deliveryDays} days</p>
              </div>
              <p className="shrink-0 font-display text-[1.02rem] font-semibold text-ink-950">{formatCurrency(pkg.price)}</p>
            </div>
          </div>
        )}

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 border-t border-line pt-4">
          <Link href={`/marketplace/gigs/${gig.slug}`} className="inline-flex h-9 items-center justify-center rounded-lg border border-line px-3 text-[0.75rem] font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-800">
            View gig
          </Link>
          <Link href={`/order?gig=${gig.slug}&tier=${pkg?.tier ?? "standard"}`} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-ink-950 px-3.5 text-[0.75rem] font-semibold text-white transition-colors hover:bg-brand-700">
            Continue <Icon name="arrow-right" size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GigMarketplace({
  facets,
  initialCategory = "",
  initialSubcategory = "",
  initialIndustry = "",
  initialCountry = "",
}: {
  facets: GigFacets;
  initialCategory?: string;
  initialSubcategory?: string;
  initialIndustry?: string;
  initialCountry?: string;
}) {
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULTS,
    category: initialCategory,
    subcategory: initialSubcategory,
    industry: initialIndustry,
    country: initialCountry,
  });
  const [items, setItems] = useState<GigCard[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({ avgRating: 0, totalOrders: 0, medianPrice: 0, verifiedSellers: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const requestId = useRef(0);
  const pageSize = 24;

  const update = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sort: filters.sort });
      for (const key of ["q", "category", "subcategory", "industry", "country", "language", "sellerLevel"] as const) {
        if (filters[key]) params.set(key, filters[key]);
      }
      if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
      if (filters.maxDelivery) params.set("maxDelivery", String(filters.maxDelivery));
      if (filters.minRating) params.set("minRating", String(filters.minRating));
      if (filters.verified) params.set("verified", "true");
      try {
        const response = await fetch(`/api/gigs?${params}`, { signal: controller.signal });
        const data = (await response.json()) as { items?: GigCard[]; total?: number; summary?: typeof summary };
        if (requestId.current !== id) return;
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
        setSummary(data.summary ?? { avgRating: 0, totalOrders: 0, medianPrice: 0, verifiedSellers: 0 });
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        if (requestId.current === id) setLoading(false);
      }
    }, 230);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page]);

  const activeCount = useMemo(
    () => (Object.keys(DEFAULTS) as (keyof Filters)[]).filter((key) => key !== "sort" && filters[key] !== DEFAULTS[key]).length,
    [filters],
  );
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visibleSubcategories = facets.subcategories;

  const filterPanel = (
    <div className="space-y-5">
      <SelectFilter label="Service category" value={filters.category} options={facets.categories} placeholder="All categories" onChange={(value) => update("category", value)} />
      <SelectFilter label="Specific service" value={filters.subcategory} options={visibleSubcategories} placeholder="All service types" onChange={(value) => update("subcategory", value)} />
      <SelectFilter label="Industry" value={filters.industry} options={facets.industries} placeholder="All industries" onChange={(value) => update("industry", value)} />
      <SelectFilter label="Target country" value={filters.country} options={facets.countries} placeholder="All countries" onChange={(value) => update("country", value)} />
      <SelectFilter label="Content language" value={filters.language} options={facets.languages} placeholder="Any language" onChange={(value) => update("language", value)} />
      <SelectFilter label="Seller level" value={filters.sellerLevel} options={LEVELS} placeholder="Any level" onChange={(value) => update("sellerLevel", value)} />

      <div>
        <p className="mb-1.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-ink-400">Minimum rating</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 48, 49].map((rating) => (
            <button key={rating} type="button" onClick={() => update("minRating", rating)} className={`rounded-lg border px-1.5 py-1.5 text-[0.72rem] font-medium ${filters.minRating === rating ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600"}`}>
              {rating ? `${(rating / 10).toFixed(1)}+ ★` : "Any"}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 flex justify-between text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
          Maximum price <span className="font-mono normal-case tracking-normal text-ink-700">{filters.maxPrice ? formatCurrency(filters.maxPrice) : "Any"}</span>
        </span>
        <input type="range" min="0" max="1500" step="25" value={filters.maxPrice} onChange={(event) => update("maxPrice", Number(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-100" />
      </label>

      <div>
        <p className="mb-1.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-ink-400">Delivery time</p>
        <div className="flex flex-wrap gap-1.5">
          {[[0, "Any"], [7, "≤ 7 days"], [14, "≤ 14 days"], [21, "≤ 21 days"]].map(([value, label]) => (
            <button key={value} type="button" onClick={() => update("maxDelivery", Number(value))} className={`rounded-lg border px-2.5 py-1.5 text-[0.72rem] font-medium ${filters.maxDelivery === value ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600"}`}>{label}</button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-canvas px-3.5 py-3">
        <span>
          <span className="block text-[0.8rem] font-semibold text-ink-900">Verified sellers only</span>
          <span className="block text-[0.65rem] text-ink-400">Identity and delivery process reviewed</span>
        </span>
        <input type="checkbox" checked={filters.verified} onChange={(event) => update("verified", event.target.checked)} className="h-4 w-4 accent-brand-600" />
      </label>

      <button type="button" onClick={() => { setFilters(DEFAULTS); setPage(1); }} className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-ink-500 hover:text-brand-700">
        <Icon name="close" size={13} /> Reset all filters {activeCount > 0 && `(${activeCount})`}
      </button>
    </div>
  );

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => update("category", "")} className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.78rem] font-semibold ${!filters.category ? "border-ink-950 bg-ink-950 text-white" : "border-line bg-white text-ink-600"}`}>All gigs</button>
        {facets.categories.slice(0, 12).map((category) => (
          <button key={category} type="button" onClick={() => update("category", filters.category === category ? "" : category)} className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.78rem] font-semibold transition-colors ${filters.category === category ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600 hover:border-ink-200"}`}>{category}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="sliders" size={17} className="text-brand-600" />
              <h2 className="text-[0.9rem] font-semibold text-ink-950">Filter backlink gigs</h2>
            </div>
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search backlink gigs</span>
                <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="search" value={filters.q} onChange={(event) => update("q", event.target.value)} placeholder="Search 8,886 gigs by service, niche, country or seller…" className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-3 text-[0.86rem] hover:border-ink-200 focus:border-brand-400 focus:bg-white" />
              </label>
              <button type="button" onClick={() => setMobileFilters((value) => !value)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line px-3.5 text-[0.8rem] font-semibold text-ink-700 lg:hidden">
                <Icon name="filter" size={15} /> Filters {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-[0.64rem] text-white">{activeCount}</span>}
              </button>
              <label className="relative sm:w-48">
                <span className="sr-only">Sort gigs</span>
                <select value={filters.sort} onChange={(event) => update("sort", event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[0.8rem] font-medium text-ink-800">
                  {SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
              </label>
            </div>
            {mobileFilters && <div className="mt-4 animate-fade-scale rounded-xl border border-line bg-canvas p-4 lg:hidden">{filterPanel}</div>}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 text-[0.74rem] text-ink-500">
              <span><strong className="text-ink-950">{formatNumber(total)}</strong> gigs</span>
              <span><strong className="text-ink-950">{summary.verifiedSellers}</strong> verified specialists</span>
              <span><strong className="text-ink-950">{summary.avgRating.toFixed(1)}/5</strong> average rating</span>
              <span><strong className="text-ink-950">{formatNumber(summary.totalOrders)}</strong> completed orders</span>
              <span>Median from <strong className="text-ink-950">{formatCurrency(summary.medianPrice)}</strong></span>
              {loading && <span className="font-medium text-brand-700">Updating…</span>}
            </div>
          </div>

          {loading && !items.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[31rem] animate-pulse rounded-2xl border border-line bg-white"><div className="h-40 rounded-t-2xl bg-ink-100" /><div className="space-y-3 p-5"><div className="h-4 w-2/3 rounded bg-ink-100" /><div className="h-12 rounded bg-ink-50" /><div className="h-20 rounded bg-ink-50" /></div></div>)}
            </div>
          ) : (
            <div className={`mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
              {items.map((gig) => <GigCardView key={gig.id} gig={gig} saved={saved.includes(gig.id)} onSave={() => setSaved((current) => current.includes(gig.id) ? current.filter((id) => id !== gig.id) : [...current, gig.id])} />)}
            </div>
          )}

          {!items.length && !loading && (
            <div className="mt-5 rounded-2xl border border-dashed border-line bg-white p-12 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 text-ink-400"><Icon name="search" size={20} /></span>
              <h2 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">No gigs match those filters</h2>
              <p className="mt-1 text-[0.84rem] text-ink-500">Try a broader category, country or budget range.</p>
            </div>
          )}

          <nav aria-label="Gig pagination" className="mt-7 flex flex-col gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.78rem] text-ink-500">
              Page <strong className="text-ink-900">{page}</strong> of {totalPages} · showing {items.length} of {formatNumber(total)} gigs
            </p>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-9 rounded-lg border border-line px-3 text-[0.78rem] font-semibold text-ink-700 disabled:opacity-40">Previous</button>
              <span className="hidden text-[0.72rem] text-ink-400 sm:inline">{Math.max(1, page - 1)} · <strong className="text-brand-700">{page}</strong> · {Math.min(totalPages, page + 1)}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="h-9 rounded-lg border border-line px-3 text-[0.78rem] font-semibold text-ink-700 disabled:opacity-40">Next</button>
            </div>
          </nav>

          <p className="mt-3 text-center text-[0.68rem] text-ink-400">
            Seller profiles, order counts and reviews are representative marketplace data in this demonstration environment.
          </p>
        </div>
      </div>
    </div>
  );
}
