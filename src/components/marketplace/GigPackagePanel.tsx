"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PayPalCheckoutButton } from "@/components/forms/PayPalCheckoutButton";
import { formatCurrency } from "@/lib/format";
import type { GigPackage } from "@/lib/gigs/types";

export function GigPackagePanel({
  gigSlug,
  title,
  packages,
}: {
  gigSlug: string;
  title: string;
  packages: GigPackage[];
}) {
  const [selected, setSelected] = useState(1);
  const pkg = packages[selected] ?? packages[0];
  if (!pkg) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
      <div className="grid grid-cols-3 border-b border-line" role="tablist" aria-label={`${title} packages`}>
        {packages.map((item, index) => (
          <button
            key={item.tier}
            type="button"
            role="tab"
            aria-selected={selected === index}
            onClick={() => setSelected(index)}
            className={`relative px-1.5 py-4 text-center text-[0.7rem] font-semibold capitalize transition-colors ${selected === index ? "bg-brand-50 text-brand-800" : "text-ink-500 hover:bg-canvas"}`}
          >
            {item.recommended && <span className="absolute inset-x-0 top-0 h-0.5 bg-brand-500" />}
            {item.tier}
            {item.recommended && <span className="mt-0.5 block text-[0.56rem] uppercase tracking-wide text-brand-600">Most popular</span>}
          </button>
        ))}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.05rem] font-semibold text-ink-950">{pkg.name}</h2>
            <p className="mt-1 text-[0.72rem] font-medium text-brand-700">{pkg.quantity}</p>
          </div>
          <p className="font-display text-[1.5rem] font-semibold text-ink-950">{formatCurrency(pkg.price)}</p>
        </div>
        <p className="mt-4 text-[0.84rem] leading-relaxed text-ink-500">{pkg.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-canvas p-3 text-center">
          <div>
            <p className="text-[0.62rem] uppercase tracking-wide text-ink-400">Delivery</p>
            <p className="mt-0.5 text-[0.82rem] font-semibold text-ink-900">{pkg.deliveryDays} days</p>
          </div>
          <div>
            <p className="text-[0.62rem] uppercase tracking-wide text-ink-400">Revisions</p>
            <p className="mt-0.5 text-[0.82rem] font-semibold text-ink-900">{pkg.revisions}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2.5">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-[0.8rem] leading-relaxed text-ink-600">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-brand-600" />
              {feature}
            </li>
          ))}
        </ul>
        <PayPalCheckoutButton
          amount={pkg.price}
          itemName={`${title} — ${pkg.name}`}
          successHref={`/order/success?gig=${encodeURIComponent(gigSlug)}&tier=${pkg.tier}&amount=${pkg.price}`}
          className="mt-6"
        />
      </div>
      <div className="border-t border-line bg-canvas/60 px-5 py-3">
        <p className="flex items-center justify-center gap-1.5 text-[0.7rem] font-medium text-ink-500">
          <Icon name="shield" size={13} className="text-brand-600" />
          Order protected by marketplace delivery review
        </p>
      </div>
    </div>
  );
}
