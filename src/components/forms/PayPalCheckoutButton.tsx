"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-300 border-t-ink-600"
    />
  );
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (selector: string) => void;
      };
    };
  }
}

export type PayPalCheckoutButtonProps = {
  /** Amount charged, in the SDK's configured currency (USD). */
  amount: number;
  /** Human-readable name of what is being purchased, shown to the buyer on PayPal. */
  itemName: string;
  /** Where to send the buyer after a successful, captured payment. */
  successHref: string;
  className?: string;
};

/**
 * Renders a live PayPal "Buy Now" button. Order creation and capture both
 * happen client-side against PayPal's SDK using the public client ID loaded
 * in the root layout, so no server secret is required. On approval the buyer
 * is redirected to `successHref` with the PayPal order id attached.
 */
export function PayPalCheckoutButton({ amount, itemName, successHref, className = "" }: PayPalCheckoutButtonProps) {
  const containerId = `paypal-btn-${useId().replace(/[:]/g, "")}`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "processing">("loading");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const mount = () => {
      if (cancelled) return;
      if (!window.paypal) {
        attempts += 1;
        if (attempts > 100) {
          setStatus("error");
          return;
        }
        setTimeout(mount, 150);
        return;
      }
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      window.paypal
        .Buttons({
          style: { layout: "horizontal", color: "gold", shape: "pill", label: "paypal", height: 45, tagline: false },
          createOrder: (_data: unknown, actions: { order: { create: (opts: unknown) => Promise<string> } }) =>
            actions.order.create({
              purchase_units: [
                {
                  description: itemName.slice(0, 127),
                  amount: { currency_code: "USD", value: amount.toFixed(2) },
                },
              ],
            }),
          onApprove: async (_data: unknown, actions: { order: { capture: () => Promise<unknown> } }) => {
            setStatus("processing");
            try {
              const details = (await actions.order.capture()) as { id?: string };
              const orderId = details?.id ?? "";
              router.push(`${successHref}${successHref.includes("?") ? "&" : "?"}paypalOrderId=${encodeURIComponent(orderId)}`);
            } catch {
              setStatus("error");
            }
          },
          onError: () => setStatus("error"),
        })
        .render(`#${containerId}`);
      setStatus("ready");
    };

    mount();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, itemName]);

  return (
    <div className={className}>
      <div id={containerId} ref={containerRef} aria-live="polite" />
      {status === "loading" && (
        <div className="flex h-[45px] items-center justify-center gap-2 rounded-full border border-line bg-canvas text-[0.78rem] text-ink-400">
          <Spinner />
          Loading PayPal…
        </div>
      )}
      {status === "processing" && (
        <div className="mt-2 flex items-center justify-center gap-2 text-[0.76rem] text-ink-500">
          <Spinner />
          Confirming payment…
        </div>
      )}
      {status === "error" && (
        <p className="mt-2 text-center text-[0.76rem] text-rose-accent">
          PayPal could not load. Please refresh, or use the brief-first checkout below.
        </p>
      )}
      <p className="mt-2 text-center text-[0.68rem] text-ink-400">
        Secure checkout via PayPal · {formatCurrency(amount, "USD")} charged on approval
      </p>
    </div>
  );
}
