"use client";

import { useMemo, useState } from "react";

const GOALS = {
  new_page: { label: "Launching a new page with no links yet", guestShare: 0.7 },
  scale_volume: { label: "Adding volume to a page with some links already", guestShare: 0.4 },
  balanced: { label: "General ongoing link building", guestShare: 0.55 },
};

const AVG_GUEST_POST_PRICE = 140;
const AVG_NICHE_EDIT_PRICE = 75;

export function BudgetCalculator() {
  const [budget, setBudget] = useState(1000);
  const [goal, setGoal] = useState<keyof typeof GOALS>("balanced");

  const result = useMemo(() => {
    const guestShare = GOALS[goal].guestShare;
    const guestBudget = budget * guestShare;
    const nicheBudget = budget * (1 - guestShare);
    const guestCount = Math.max(0, Math.floor(guestBudget / AVG_GUEST_POST_PRICE));
    const nicheCount = Math.max(0, Math.floor(nicheBudget / AVG_NICHE_EDIT_PRICE));
    return { guestCount, nicheCount, totalLinks: guestCount + nicheCount };
  }, [budget, goal]);

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div>
        <label className="text-[0.78rem] font-semibold text-ink-700">Monthly link building budget: ${budget.toLocaleString("en-US")}</label>
        <input
          type="range"
          min={100}
          max={10000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </div>

      <div className="mt-5">
        <label className="text-[0.78rem] font-semibold text-ink-700">What&apos;s the goal?</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-1">
          {(Object.keys(GOALS) as (keyof typeof GOALS)[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setGoal(key)}
              className={`rounded-xl border p-3 text-left text-[0.84rem] transition-colors ${
                goal === key ? "border-brand-400 bg-brand-50 text-brand-900" : "border-line bg-white text-ink-600 hover:border-ink-200"
              }`}
            >
              {GOALS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-canvas p-4 text-center">
          <p className="text-[0.68rem] uppercase tracking-wide text-ink-400">Guest posts</p>
          <p className="mt-1 font-display text-[1.6rem] font-semibold text-ink-950">{result.guestCount}</p>
          <p className="text-[0.72rem] text-ink-400">~${AVG_GUEST_POST_PRICE} avg. each</p>
        </div>
        <div className="rounded-xl border border-line bg-canvas p-4 text-center">
          <p className="text-[0.68rem] uppercase tracking-wide text-ink-400">Niche edits</p>
          <p className="mt-1 font-display text-[1.6rem] font-semibold text-ink-950">{result.nicheCount}</p>
          <p className="text-[0.72rem] text-ink-400">~${AVG_NICHE_EDIT_PRICE} avg. each</p>
        </div>
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-center">
          <p className="text-[0.68rem] uppercase tracking-wide text-brand-700">Total links / month</p>
          <p className="mt-1 font-display text-[1.6rem] font-semibold text-ink-950">{result.totalLinks}</p>
        </div>
      </div>

      <p className="mt-5 text-[0.76rem] leading-relaxed text-ink-400">
        Based on typical average prices across our marketplace. Real per-link cost varies by authority, traffic and
        niche — check live listings for exact numbers before finalising a plan.
      </p>
    </div>
  );
}
