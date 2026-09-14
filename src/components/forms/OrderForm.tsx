"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { PayPalCheckoutButton } from "@/components/forms/PayPalCheckoutButton";
import { formatCurrency } from "@/lib/format";

export type OrderPackage = {
  tier: string;
  name: string;
  price: number;
  deliveryDays: number;
  quantity: string;
  recommended: boolean;
};

export type OrderProduct = {
  kind: "service" | "gig";
  slug: string;
  serviceSlug: string;
  name: string;
  summary: string;
  packages: OrderPackage[];
};

const MARKETS = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Spain", "Italy", "Netherlands", "India", "International / multiple markets",
];

type Fields = {
  customerName: string;
  customerEmail: string;
  company: string;
  website: string;
  targetUrl: string;
  anchorPreference: string;
  market: string;
  notes: string;
};

const EMPTY: Fields = {
  customerName: "", customerEmail: "", company: "", website: "", targetUrl: "",
  anchorPreference: "", market: "", notes: "",
};

export function OrderForm({
  product,
  initialTier,
  paypalOrderId = "",
}: {
  product: OrderProduct;
  initialTier: string;
  paypalOrderId?: string;
}) {
  const initialIndex = Math.max(product.packages.findIndex((pkg) => pkg.tier === initialTier), 0);
  const [selected, setSelected] = useState(initialIndex);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const pkg = product.packages[selected] ?? product.packages[0];

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    if (status === "error") setStatus("idle");
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setMessage("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          serviceSlug: product.serviceSlug,
          gigSlug: product.kind === "gig" ? product.slug : "",
          packageTier: pkg.tier,
          paypalOrderId,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        errors?: Record<string, string>;
        message?: string;
        reference?: string;
      };
      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Please correct the highlighted fields.");
        setStatus("error");
        return;
      }
      setReference(data.reference ?? "");
      setMessage(data.message ?? "Order received.");
      setStatus("success");
      setFields(EMPTY);
    } catch {
      setMessage("Network error. Please try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white"><Icon name="check" size={22} /></span>
        <h2 className="mt-4 font-display text-[1.25rem] font-semibold text-ink-950">Order brief received</h2>
        <p className="mt-2 font-mono text-[0.78rem] font-semibold tracking-wide text-brand-700">{reference}</p>
        <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-ink-600">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/dashboard" icon="arrow-right">Open dashboard</Button>
          <Button href="/marketplace" variant="outline">Browse more gigs</Button>
        </div>
      </div>
    );
  }

  const inputClass = (name: string) =>
    `h-11 w-full rounded-xl border px-3.5 text-[0.88rem] text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-400 ${errors[name] ? "border-rose-accent bg-[#fdf4f5]" : "border-line bg-canvas hover:border-ink-200 focus:bg-white"}`;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {paypalOrderId && (
        <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"><Icon name="check" size={16} /></span>
          <div>
            <p className="text-[0.86rem] font-semibold text-brand-900">Payment confirmed via PayPal</p>
            <p className="mt-0.5 font-mono text-[0.7rem] text-brand-700">Order ID: {paypalOrderId}</p>
            <p className="mt-1 text-[0.76rem] leading-relaxed text-brand-800">Just fill in the delivery details below so the seller can start work.</p>
          </div>
        </div>
      )}

      {!paypalOrderId && (
        <div className="rounded-xl border border-line bg-canvas p-4">
          <p className="text-[0.78rem] font-semibold text-ink-700">Prefer to pay now?</p>
          <p className="mt-1 text-[0.76rem] leading-relaxed text-ink-500">Pay for the {pkg.name} package (${pkg.price}) with PayPal, then submit delivery details below — no separate invoice.</p>
          <PayPalCheckoutButton
            amount={pkg.price}
            itemName={`${product.name} — ${pkg.name}`}
            successHref={`/order/success?${product.kind === "gig" ? "gig" : "service"}=${encodeURIComponent(product.kind === "gig" ? product.slug : product.serviceSlug)}&tier=${pkg.tier}&amount=${pkg.price}`}
            className="mt-3"
          />
          <div className="mt-3 flex items-center gap-3 text-[0.62rem] uppercase tracking-wide text-ink-300">
            <span className="h-px flex-1 bg-line" />or submit the brief first<span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <fieldset>
        <legend className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink-400">1. Choose package</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {product.packages.map((item, index) => (
            <button key={item.tier} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} className={`relative rounded-xl border p-4 text-left transition-all ${selected === index ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200" : "border-line bg-white hover:border-ink-200"}`}>
              {item.recommended && <span className="absolute right-3 top-3 rounded-full bg-brand-600 px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-wide text-white">Popular</span>}
              <span className="block text-[0.66rem] font-semibold uppercase tracking-wide text-brand-700">{item.tier}</span>
              <span className="mt-1 block line-clamp-2 text-[0.86rem] font-semibold text-ink-950">{item.name}</span>
              <span className="mt-2 block font-display text-[1.2rem] font-semibold text-ink-950">{formatCurrency(item.price)}</span>
              <span className="mt-1 block text-[0.68rem] text-ink-400">{item.quantity} · {item.deliveryDays} days</span>
            </button>
          ))}
        </div>
      </fieldset>

      <FormSection title="2. Target details">
        <Field label="Your website" required error={errors.website}><input value={fields.website} onChange={(event) => update("website", event.target.value)} className={inputClass("website")} placeholder="company.com" autoComplete="url" /></Field>
        <Field label="Target page URL" required error={errors.targetUrl}><input value={fields.targetUrl} onChange={(event) => update("targetUrl", event.target.value)} className={inputClass("targetUrl")} placeholder="https://company.com/product" autoComplete="url" /></Field>
        <Field label="Primary market" required error={errors.market}><span className="relative block"><select value={fields.market} onChange={(event) => update("market", event.target.value)} className={`${inputClass("market")} appearance-none pr-9`}><option value="">Select a market</option>{MARKETS.map((market) => <option key={market}>{market}</option>)}</select><Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" /></span></Field>
        <Field label="Anchor preference" error={errors.anchorPreference}><input value={fields.anchorPreference} onChange={(event) => update("anchorPreference", event.target.value)} className={inputClass("anchorPreference")} placeholder="Optional — seller will review" /></Field>
      </FormSection>

      <FormSection title="3. Contact details">
        <Field label="Full name" required error={errors.customerName}><input value={fields.customerName} onChange={(event) => update("customerName", event.target.value)} className={inputClass("customerName")} placeholder="Alex Moreau" autoComplete="name" /></Field>
        <Field label="Work email" required error={errors.customerEmail}><input type="email" value={fields.customerEmail} onChange={(event) => update("customerEmail", event.target.value)} className={inputClass("customerEmail")} placeholder="alex@company.com" autoComplete="email" /></Field>
        <Field label="Company" error={errors.company}><input value={fields.company} onChange={(event) => update("company", event.target.value)} className={inputClass("company")} placeholder="Company name" autoComplete="organization" /></Field>
        <Field label="Notes or exclusions" error={errors.notes}><input value={fields.notes} onChange={(event) => update("notes", event.target.value)} className={inputClass("notes")} placeholder="Competitors, publishers, anchors…" /></Field>
      </FormSection>

      {message && <p role="alert" className="rounded-xl bg-[#fdf4f5] px-4 py-3 text-[0.82rem] text-rose-accent">{message}</p>}

      <div className="flex flex-col gap-4 rounded-xl border border-line bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-[0.7rem] text-ink-400">Order brief total</p><p className="font-display text-[1.35rem] font-semibold text-ink-950">{formatCurrency(pkg.price)}</p><p className="text-[0.66rem] text-ink-400">{paypalOrderId ? "Already paid via PayPal" : "Payment requested after target review"}</p></div>
        <Button type="submit" size="lg" disabled={status === "loading"} icon="arrow-right">{status === "loading" ? "Submitting…" : paypalOrderId ? "Submit delivery details" : "Submit order brief"}</Button>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink-400">{title}</h2><div className="mt-3 grid gap-4 sm:grid-cols-2">{children}</div></div>;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[0.76rem] font-semibold text-ink-700">{label} {required && <span className="text-rose-accent">*</span>}</span>{children}{error && <span className="mt-1 block text-[0.72rem] text-rose-accent">{error}</span>}</label>;
}
