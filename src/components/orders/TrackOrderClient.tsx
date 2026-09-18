"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, Card } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/format";

type TrackedOrder = {
  reference: string;
  serviceName: string;
  packageName: string;
  price: number;
  website: string;
  targetUrl: string;
  anchorPreference: string;
  market: string;
  status: string;
  deliveryNote: string;
  deliveryFiles: string[];
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

function humanStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TrackOrderClient() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setOrder(null);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; order?: TrackedOrder };

      if (!response.ok || !data.ok || !data.order) {
        setStatus("error");
        setMessage(data.message ?? "We could not find that order.");
        return;
      }

      setOrder(data.order);
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <Card className="p-6 sm:p-7">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-brand-700">Order access</p>
        <h2 className="mt-2 font-display text-[1.25rem] font-semibold text-ink-950">Track without creating an account</h2>
        <p className="mt-2 text-[0.86rem] leading-6 text-ink-500">
          Use the order reference shown after checkout and the email address used on the order.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-[0.76rem] font-semibold text-ink-700">Order reference</span>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value.toUpperCase())}
              placeholder="ASC-20260918-ABCDE"
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 font-mono text-[0.86rem] text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.76rem] font-semibold text-ink-700">Order email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[0.86rem] text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white"
            />
          </label>

          {status === "error" && (
            <p role="alert" className="rounded-xl bg-[#fdf4f5] px-4 py-3 text-[0.8rem] text-rose-accent">{message}</p>
          )}

          <Button type="submit" fullWidth size="lg" icon="arrow-right" disabled={status === "loading"}>
            {status === "loading" ? "Checking…" : "Track order"}
          </Button>
        </form>

        <div className="mt-5 flex gap-2.5 rounded-xl border border-line bg-canvas p-4">
          <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-brand-700" />
          <p className="text-[0.76rem] leading-5 text-ink-500">
            We only show an order when both the reference and email match. No registration or password is required.
          </p>
        </div>
      </Card>

      <Card className="min-h-[22rem] p-6 sm:p-7">
        {!order ? (
          <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Icon name="layers" size={21} /></span>
            <h2 className="mt-4 font-display text-[1.1rem] font-semibold text-ink-950">Your order status will appear here</h2>
            <p className="mt-2 max-w-md text-[0.82rem] leading-6 text-ink-500">Enter your reference and email to view the current status, target page and any delivery notes or files.</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="font-mono text-[0.72rem] font-semibold text-brand-700">{order.reference}</p>
                <h2 className="mt-1 font-display text-[1.18rem] font-semibold text-ink-950">{order.serviceName}</h2>
                <p className="mt-1 text-[0.78rem] text-ink-500">{order.packageName} · {formatCurrency(order.price)}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-[0.72rem] font-semibold text-brand-800">{humanStatus(order.status)}</span>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Website</dt><dd className="mt-1 text-[0.82rem] font-medium text-ink-800">{order.website}</dd></div>
              <div><dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Market</dt><dd className="mt-1 text-[0.82rem] font-medium text-ink-800">{order.market}</dd></div>
              <div className="sm:col-span-2"><dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Target URL</dt><dd className="mt-1 break-all text-[0.82rem] font-medium text-ink-800">{order.targetUrl}</dd></div>
              {order.anchorPreference && <div className="sm:col-span-2"><dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Anchor preference</dt><dd className="mt-1 text-[0.82rem] font-medium text-ink-800">{order.anchorPreference}</dd></div>}
            </dl>

            {(order.deliveryNote || order.deliveryFiles.length > 0) && (
              <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
                <p className="text-[0.78rem] font-semibold text-brand-900">Delivery</p>
                {order.deliveryNote && <p className="mt-2 text-[0.8rem] leading-6 text-brand-900/80">{order.deliveryNote}</p>}
                {order.deliveryFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {order.deliveryFiles.map((file) => (
                      <li key={file}><a href={file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-brand-800 hover:underline"><Icon name="arrow-up-right" size={13} />Open delivery file</a></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
