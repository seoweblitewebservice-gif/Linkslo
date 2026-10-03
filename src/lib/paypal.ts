/**
 * PayPal JS SDK client ID (public identifier, safe to ship in client-side code —
 * this is not a secret key). Used to render Buy Now buttons that create and
 * capture a PayPal order entirely in the browser.
 */
export const PAYPAL_CLIENT_ID =
  "BAAuTWFMvROziaGuxjd5eMTcS9YHb1Yuzh0ily3fZTSOr48HLGcjMmboB-Xlf_sUyICaAKqk4QeasV_AXQ";

export const PAYPAL_CURRENCY = "USD";

export const PAYPAL_SDK_SRC = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${PAYPAL_CURRENCY}&intent=capture&components=buttons`;

/* -------------------------------------------------------------------------- */
/* Server-side payment verification (PayPal REST API)                          */
/*                                                                             */
/* The browser checkout only *reports* a PayPal order id, so the server must   */
/* confirm with PayPal that the order was actually captured for the expected   */
/* amount before an order is created. Requires PAYPAL_CLIENT_SECRET.            */
/* Optional: PAYPAL_API_BASE (defaults to live; use                             */
/* https://api-m.sandbox.paypal.com for sandbox testing).                      */
/* -------------------------------------------------------------------------- */

const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE?.replace(/\/$/, "") || "https://api-m.paypal.com";

export type PayPalVerification =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "unconfigured"
        | "auth_failed"
        | "not_found"
        | "not_completed"
        | "not_captured"
        | "amount_mismatch"
        | "error";
    };

async function getPayPalAccessToken(): Promise<string | null> {
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) return null;
  try {
    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

type PayPalOrderResponse = {
  status?: string;
  purchase_units?: Array<{
    amount?: { currency_code?: string; value?: string };
    payments?: { captures?: Array<{ status?: string }> };
  }>;
};

/**
 * Verify that a PayPal order id refers to a COMPLETED order with a COMPLETED
 * capture whose amount matches the expected USD price. Fail-closed: any
 * uncertainty returns ok:false.
 */
export async function verifyPayPalCapture(
  orderId: string,
  expectedAmountUsd: number,
): Promise<PayPalVerification> {
  if (!process.env.PAYPAL_CLIENT_SECRET) return { ok: false, reason: "unconfigured" };
  const token = await getPayPalAccessToken();
  if (!token) return { ok: false, reason: "auth_failed" };
  try {
    const res = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        cache: "no-store",
      },
    );
    if (res.status === 404) return { ok: false, reason: "not_found" };
    if (!res.ok) return { ok: false, reason: "error" };
    const order = (await res.json()) as PayPalOrderResponse;
    if (order.status !== "COMPLETED") return { ok: false, reason: "not_completed" };
    const units = order.purchase_units ?? [];
    const captured = units.some((unit) =>
      (unit.payments?.captures ?? []).some((capture) => capture.status === "COMPLETED"),
    );
    if (!captured) return { ok: false, reason: "not_captured" };
    const amountOk = units.some((unit) => {
      const value = parseFloat(unit.amount?.value ?? "NaN");
      return (
        unit.amount?.currency_code === PAYPAL_CURRENCY &&
        Number.isFinite(value) &&
        Math.abs(value - expectedAmountUsd) < 0.01
      );
    });
    if (!amountOk) return { ok: false, reason: "amount_mismatch" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
