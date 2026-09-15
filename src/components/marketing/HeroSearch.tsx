"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Keyword search on the homepage. Submits straight into the full marketplace
 * search (which already matches gig title, summary, category, industry,
 * country and seller), so any relevant gig — guest post or service — that
 * matches the keyword shows up, not just one category.
 */
export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : "/marketplace");
  }

  return (
    <form onSubmit={submit} className="relative mt-2 w-full max-w-md">
      <Icon name="search" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        type="search"
        placeholder="Search any gig — e.g. guest post, niche edit, SaaS…"
        className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-28 text-[0.9rem] text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-ink-950 px-4 text-[0.8rem] font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  );
}
