"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { PayPalCheckoutButton } from "@/components/forms/PayPalCheckoutButton";
import { formatCurrency } from "@/lib/format";

export type GigPackageCard = {
  id: number;
  gigId: number;
  tier: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  deliverableCount: number;
  features: string[];
  recommended: boolean;
};

const TIER_LABELS: Record<string, string> = {
  basic: "Basic",
  growth: "Growth",
  scale: "Scale",
};

export function PackageSelector({
  packages,
  gigTitle,
  serviceSlug,
}: {
  packages: GigPackageCard[];
  gigTitle: string;
  serviceSlug: string;
}) {
  const recommendedIndex = Math.max(packages.findIndex((item) => item.recommended), 0);
  const [selected, setSelected] = useState(recommendedIndex);
  const current = packages[selected];

  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
      <div
        className="grid grid-cols-3 border-b border-line"
        role="tablist"
        aria-label={`Choose a ${gigTitle} package`}
      >
        {packages.map((pkg, index) => (
          <button
            key={pkg.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            onClick={() => setSelected(index)}
            className={`relative px-2 py-4 text-center transition-colors ${
              selected === index ? "bg-brand-50 text-brand-800" : "bg-white text-ink-500 hover:bg-canvas"
            }`}
          >
            {pkg.recommended && (
              <span className="absolute inset-x-0 top-0 h-0.5 bg-brand-500" />
            )}
            <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.08em]">
              {TIER_LABELS[pkg.tier] ?? pkg.tier}
            </span>
            {pkg.recommended && (
              <span className="mt-0.5 block text-[0.6rem] font-semibold text-brand-600">Recommended</span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[1.2rem] font-semibold text-ink-950">{current.name}</p>
            <p className="mt-1 text-[0.78rem] font-medium text-brand-700">{current.tagline}</p>
          </div>
          <p className="font-display text-[1.65rem] font-semibold text-ink-950">
            {formatCurrency(current.price)}
          </p>
        </div>

        <p className="mt-4 text-[0.88rem] leading-relaxed text-ink-500">{current.description}</p>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-canvas p-3 text-center">
          <div>
            <p className="text-[0.64rem] uppercase tracking-wide text-ink-400">Delivery</p>
            <p className="mt-0.5 text-[0.86rem] font-semibold text-ink-900">{current.deliveryDays} days</p>
          </div>
          <div>
            <p className="text-[0.64rem] uppercase tracking-wide text-ink-400">Revisions</p>
            <p className="mt-0.5 text-[0.86rem] font-semibold text-ink-900">{current.revisions}</p>
          </div>
          <div>
            <p className="text-[0.64rem] uppercase tracking-wide text-ink-400">Deliverables</p>
            <p className="mt-0.5 text-[0.86rem] font-semibold text-ink-900">{current.deliverableCount}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {current.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-[0.84rem] text-ink-600">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand-600" />
              {feature}
            </li>
          ))}
        </ul>

        <PayPalCheckoutButton
          amount={current.price}
          itemName={`${gigTitle} — ${current.name}`}
          successHref={`/order/success?service=${encodeURIComponent(serviceSlug)}&tier=${encodeURIComponent(current.tier)}&amount=${current.price}`}
          className="mt-6"
        />
        <div className="mt-3 flex items-center gap-3 text-[0.66rem] uppercase tracking-wide text-ink-300">
          <span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" />
        </div>
        <Button
          href={`/order?service=${encodeURIComponent(serviceSlug)}&tier=${encodeURIComponent(current.tier)}`}
          variant="outline"
          fullWidth
          className="mt-3"
          icon="arrow-right"
        >
          Submit brief first, pay after review
        </Button>
      </div>

      <div className="border-t border-line bg-canvas/60 px-6 py-3.5">
        <p className="flex items-center justify-center gap-1.5 text-[0.72rem] font-medium text-ink-500">
          <Icon name="shield" size={14} className="text-brand-600" />
          Scope protected by Linkslo delivery review
        </p>
      </div>
    </div>
  );
}

export function PackageComparison({ packages }: { packages: GigPackageCard[] }) {
  const allFeatures = Array.from(new Set(packages.flatMap((pkg) => pkg.features)));
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
      <table className="w-full min-w-[42rem] text-left">
        <caption className="sr-only">Compare the three service packages</caption>
        <thead>
          <tr className="border-b border-line bg-canvas/70">
            <th scope="col" className="w-[34%] px-5 py-4 text-[0.75rem] font-semibold uppercase tracking-wide text-ink-400">
              Included
            </th>
            {packages.map((pkg) => (
              <th key={pkg.id} scope="col" className="px-5 py-4">
                <span className="block text-[0.72rem] font-semibold uppercase tracking-wide text-brand-700">
                  {TIER_LABELS[pkg.tier] ?? pkg.tier}
                </span>
                <span className="mt-1 block font-display text-[1.05rem] font-semibold text-ink-950">
                  {formatCurrency(pkg.price)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-[0.82rem]">
          <tr>
            <th scope="row" className="px-5 py-3 font-medium text-ink-700">Delivery time</th>
            {packages.map((pkg) => <td key={pkg.id} className="px-5 py-3 text-ink-600">{pkg.deliveryDays} days</td>)}
          </tr>
          <tr>
            <th scope="row" className="px-5 py-3 font-medium text-ink-700">Core deliverables</th>
            {packages.map((pkg) => <td key={pkg.id} className="px-5 py-3 font-semibold text-ink-900">{pkg.deliverableCount}</td>)}
          </tr>
          <tr>
            <th scope="row" className="px-5 py-3 font-medium text-ink-700">Revision rounds</th>
            {packages.map((pkg) => <td key={pkg.id} className="px-5 py-3 text-ink-600">{pkg.revisions}</td>)}
          </tr>
          {allFeatures.slice(0, 7).map((feature) => (
            <tr key={feature}>
              <th scope="row" className="px-5 py-3 font-medium text-ink-700">{feature}</th>
              {packages.map((pkg) => (
                <td key={pkg.id} className="px-5 py-3">
                  {pkg.features.includes(feature) ? (
                    <Icon name="check" size={16} className="text-brand-600" />
                  ) : (
                    <span className="text-ink-300">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
