import { ADMIN_EMAIL } from "@/lib/orders";

/**
 * Sends the "new order" email to the store owner via Resend's HTTP API.
 * Requires RESEND_API_KEY (and optionally RESEND_FROM_EMAIL, which must be a
 * verified sender/domain in your Resend account) to actually send. Without a
 * key configured, this safely no-ops and logs to the server console instead
 * of throwing, so checkout never fails because of email delivery.
 */
export async function sendOrderNotificationEmail(order: {
  reference: string;
  serviceName: string;
  packageName: string;
  price: number;
  customerName: string;
  customerEmail: string;
  website: string;
  targetUrl: string;
  paypalOrderId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "orders@linkslo.com";

  if (!apiKey) {
    console.log(`[order email skipped — no RESEND_API_KEY set] New order ${order.reference} for ${order.serviceName}`);
    return;
  }

  const subject = `New order: ${order.serviceName} (${order.reference})`;
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#111;line-height:1.6">
      <h2 style="margin:0 0 12px">New order received</h2>
      <p><strong>Reference:</strong> ${order.reference}</p>
      <p><strong>Service:</strong> ${order.serviceName} — ${order.packageName}</p>
      <p><strong>Price:</strong> $${order.price}</p>
      <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
      <p><strong>Website:</strong> ${order.website}</p>
      <p><strong>Target URL:</strong> ${order.targetUrl}</p>
      <p><strong>PayPal order ID:</strong> ${order.paypalOrderId || "— (brief submitted, not yet paid)"}</p>
      <p style="margin-top:20px"><a href="https://linkslo.com/dashboard/admin">Open in admin dashboard</a></p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });
    if (!response.ok) {
      console.error("order notification email failed", response.status, await response.text());
    }
  } catch (error) {
    console.error("order notification email failed", error);
  }
}
