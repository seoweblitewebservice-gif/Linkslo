"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/primitives";
import type { BacklinkService } from "@/lib/backlinks";
import { averageRating, startingPrice } from "@/lib/backlinks";
import { formatCurrency } from "@/lib/format";

const TIER_LABELS = {
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
} as const;

const GROUP_META: Record<string, { gradient: string; description: string }> = {
  "Placement Services": {
    gradient: "from-[#063b32] via-[#08745d] to-[#3dbd95]",
    description: "Publisher placements",
  },
  "Foundation Links": {
    gradient: "from-[#133b57] via-[#2b6b98] to-[#69addc]",
    description: "Supporting link layer",
  },
  "Authority & Metrics": {
    gradient: "from-[#55330f] via-[#a96918] to-[#f0b45c]",
    description: "Metric-qualified links",
  },
  "Local & Directories": {
    gradient: "from-[#193c34] via-[#397263] to-[#84b9a7]",
    description: "Geographic signals",
  },
  "Community Links": {
    gradient: "from-[#432472] via-[#6b49c6] to-[#a08bf1]",
    description: "Manual participation",
  },
  "PR & News": {
    gradient: "from-[#5b233a] via-[#a94468] to-[#ed82a3]",
    description: "Earned media links",
  },
  "Outreach Services": {
    gradient: "from-[#173159] via-[#2f67ae] to-[#6ea7f0]",
    description: "Manual acquisition",
  },
  "Specialist Programmes": {
    gradient: "from-[#353018] via-[#777026] to-[#c8bd5b]",
    description: "Specialist link sources",
  },
  "Strategy Services": {
    gradient: "from-[#18333c] via-[#345e6b] to-[#75aab4]",
    description: "Analysis-led campaigns",
  },
  "Campaign Programmes": {
    gradient: "from-[#252748] via-[#51518e] to-[#8887cc]",
    description: "Ongoing link building",
  },
};

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "delivery", label: "Fastest delivery" },
  { value: "rating", label: "Highest rated" },
] as const;

function ServiceCard({ service }: { service: BacklinkService }) {
  const recommended = Math.max(service.packages.findIndex((pkg) => pkg.recommended), 0);
  const [selected, setSelected] = useState(recommended);
  const current = service.packages[selected] ?? service.packages[0];
  const meta = GROUP_META[service.group] ?? GROUP_META["Placement Services"];
  const rating = averageRating(service);

  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <Link
        href={`/backlinks/${service.slug}`}
        className={`relative block h-36 overflow-hidden bg-gradient-to-br ${meta.gradient} p-5 text-white`}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <span className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full border-[25px] border-white/10" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <Icon name={service.icon} size={20} />
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.66rem] font-semibold backdrop-blur-sm">
              3 packages
            </span>
          </div>
          <div>
            <span className="block text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-white/70">
              {meta.description}
            </span>
            <span className="mt-1 block font-display text-[1.05rem] font-semibold leading-snug">
              {service.nav}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[0.74rem] font-semibold text-ink-800">
            <Icon name="star" size={13} filled className="text-amber-accent" />
            {rating.toFixed(1)}
            <span className="font-normal text-ink-400">({service.reviews.length} verified reviews)</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-brand-700">
            <Icon name="shield" size={13} />
            Quality reviewed
          </span>
        </div>

        <h2 className="mt-3 font-display text-[1rem] font-semibold leading-snug text-ink-950">
          <Link href={`/backlinks/${service.slug}`} className="transition-colors hover:text-brand-700">
            {service.h1}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-[0.82rem] leading-relaxed text-ink-500">
          {service.summary}
        </p>

        <div className="mt-4 rounded-xl border border-line bg-canvas/70 p-2.5">
          <div className="grid grid-cols-3 gap-1" role="tablist" aria-label={`${service.nav} packages`}>
            {service.packages.map((pkg, index) => (
              <button
                key={pkg.tier}
                type="button"
                role="tab"
                aria-selected={selected === index}
                onClick={() => setSelected(index)}
                className={`rounded-lg px-1 py-1.5 text-[0.68rem] font-semibold capitalize transition-colors ${
                  selected === index
                    ? "bg-white text-ink-950 shadow-sm"
                    : "text-ink-400 hover:text-ink-700"
                }`}
              >
                {TIER_LABELS[pkg.tier]}
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex items-end justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="truncate text-[0.76rem] font-semibold text-ink-800">{current.name}</p>
              <p className="mt-0.5 text-[0.66rem] text-ink-400">
                {current.volume} · {current.deliveryDays} days
              </p>
            </div>
            <p className="shrink-0 font-display text-[1.05rem] font-semibold text-ink-950">
              {formatCurrency(current.price)}
            </p>
          </div>
        </div>

        <ul className="mt-3 space-y-1.5">
          {current.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex gap-2 text-[0.75rem] text-ink-600">
              <Icon name="check" size={13} className="mt-0.5 shrink-0 text-brand-600" />
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 border-t border-line pt-4">
          <Link
            href={`/backlinks/${service.slug}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-line px-3 text-[0.76rem] font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-800"
          >
            View details
          </Link>
          <Link
            href={`/order?service=${service.slug}&tier=${current.tier}`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-ink-950 px-3.5 text-[0.76rem] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Order package
            <Icon name="arrow-right" size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceShop({ services }: { services: BacklinkService[] }) {
  const groups = Array.from(new Set(services.map((service) => service.group)));
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxDelivery, setMaxDelivery] = useState(0);
  const [sort, setSort] = useState("recommended");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = services.filter((service) => {
      const haystack = [
        service.nav,
        service.h1,
        service.summary,
        service.group,
        ...service.variants,
        ...service.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!needle || haystack.includes(needle)) &&
        (!group || service.group === group) &&
        (!maxPrice || startingPrice(service) <= maxPrice) &&
        (!maxDelivery || service.packages[0].deliveryDays <= maxDelivery)
      );
    });

    return result.sort((a, b) => {
      if (sort === "price-low") return startingPrice(a) - startingPrice(b);
      if (sort === "price-high") return startingPrice(b) - startingPrice(a);
      if (sort === "delivery") return a.packages[0].deliveryDays - b.packages[0].deliveryDays;
      if (sort === "rating") return averageRating(b) - averageRating(a);
      const priority = [
        "guest-post-backlinks",
        "authority-backlinks",
        "niche-edit-backlinks",
        "contextual-backlinks",
        "digital-pr-backlinks",
        "monthly-link-building",
      ];
      const rank = (slug: string) => {
        const index = priority.indexOf(slug);
        return index === -1 ? priority.length + services.findIndex((item) => item.slug === slug) : index;
      };
      return rank(a.slug) - rank(b.slug);
    });
  }, [services, query, group, maxPrice, maxDelivery, sort]);

  const activeFilters = Number(Boolean(query)) + Number(Boolean(group)) + Number(Boolean(maxPrice)) + Number(Boolean(maxDelivery));

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_1fr_0.8fr_0.8fr_0.9fr]">
          <label className="relative">
            <span className="sr-only">Search backlink services</span>
            <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search guest posts, niche edits, PR…"
              className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-3 text-[0.85rem] hover:border-ink-200 focus:border-brand-400 focus:bg-white"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Service category</span>
            <select value={group} onChange={(event) => setGroup(event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[0.82rem] text-ink-800">
              <option value="">All categories</option>
              {groups.map((item) => <option key={item}>{item}</option>)}
            </select>
            <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </label>
          <label className="relative">
            <span className="sr-only">Maximum starting price</span>
            <select value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[0.82rem] text-ink-800">
              <option value="0">Any budget</option>
              <option value="100">Under €100</option>
              <option value="250">Under €250</option>
              <option value="500">Under €500</option>
              <option value="1000">Under €1,000</option>
            </select>
            <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </label>
          <label className="relative">
            <span className="sr-only">Maximum delivery time</span>
            <select value={maxDelivery} onChange={(event) => setMaxDelivery(Number(event.target.value))} className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[0.82rem] text-ink-800">
              <option value="0">Any delivery</option>
              <option value="7">Up to 7 days</option>
              <option value="14">Up to 14 days</option>
              <option value="21">Up to 21 days</option>
              <option value="30">Up to 30 days</option>
            </select>
            <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </label>
          <label className="relative">
            <span className="sr-only">Sort services</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[0.82rem] text-ink-800">
              {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-[0.78rem] text-ink-500">
            <strong className="text-ink-950">{filtered.length}</strong> backlink services · every service has 3 packages
          </p>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroup("");
                setMaxPrice(0);
                setMaxDelivery(0);
              }}
              className="inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-brand-700 hover:text-brand-800"
            >
              <Icon name="close" size={13} /> Clear {activeFilters} filters
            </button>
          )}
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setGroup("")}
          className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.78rem] font-semibold transition-colors ${!group ? "border-ink-950 bg-ink-950 text-white" : "border-line bg-white text-ink-600 hover:border-ink-200"}`}
        >
          All services
        </button>
        {groups.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setGroup(group === item ? "" : item)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.78rem] font-semibold transition-colors ${group === item ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600 hover:border-ink-200"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => <ServiceCard key={service.slug} service={service} />)}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 text-ink-400"><Icon name="search" size={20} /></span>
          <h2 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">No services match those filters</h2>
          <p className="mt-1 text-[0.85rem] text-ink-500">Try a higher budget, longer delivery window or a broader search.</p>
        </div>
      )}
    </div>
  );
}
