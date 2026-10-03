import { db } from "@/db";
import { serviceOrders } from "@/db/schema";
import { getService } from "@/lib/backlinks";
import { EMAIL_PATTERN, normaliseDomain } from "@/lib/format";
import { getGigBySlug } from "@/lib/gigs/data";
import { sendOrderNotificationEmail } from "@/lib/mail";
import { verifyPayPalCapture } from "@/lib/paypal";
import { isRateLimited, requestIp } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/user-auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const URL_PATTERN = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

function makeReference() {
  const date = new Date();
  const stamp = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ASC-${stamp}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(`orders:${requestIp(request)}`, 10)) {
      return Response.json(
        { ok: false, message: "Too many order attempts. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const payload = (await request.json()) as Record<string, string | undefined>;
    const serviceSlug = (payload.serviceSlug ?? "").trim();
    const gigSlug = (payload.gigSlug ?? "").trim();
    const packageTier = (payload.packageTier ?? "").trim();
    const customerName = (payload.customerName ?? "").trim();
    const customerEmail = (payload.customerEmail ?? "").trim().toLowerCase();
    const company = (payload.company ?? "").trim();
    const website = normaliseDomain(payload.website ?? "");
    const targetUrl = (payload.targetUrl ?? "").trim();
    const anchorPreference = (payload.anchorPreference ?? "").trim();
    const market = (payload.market ?? "").trim();
    const notes = (payload.notes ?? "").trim();
    const paypalOrderId = (payload.paypalOrderId ?? "").trim();

    const gig = gigSlug ? await getGigBySlug(gigSlug) : null;
    const service = !gig ? getService(serviceSlug) : null;
    const gigPackage = gig?.packages.find((pkg) => pkg.tier === packageTier);
    const servicePackage = service?.packages.find((pkg) => pkg.tier === packageTier);
    const selectedPackage = gigPackage ?? servicePackage;
    const errors: Record<string, string> = {};

    if ((!gig && !service) || !selectedPackage) errors.package = "That gig package is no longer available.";
    if (!paypalOrderId) errors.paypalOrderId = "Payment is required before an order can be created.";
    if (customerName.length < 2) errors.customerName = "Enter your full name.";
    if (!EMAIL_PATTERN.test(customerEmail)) errors.customerEmail = "Enter a valid work email address.";
    if (!URL_PATTERN.test(website)) errors.website = "Enter a valid website, for example company.com.";
    if (!URL_PATTERN.test(targetUrl)) errors.targetUrl = "Enter the page you want the links to support.";
    if (!market) errors.market = "Choose the primary target market.";
    if (anchorPreference.length > 160) errors.anchorPreference = "Keep anchor guidance under 160 characters.";
    if (notes.length > 1800) errors.notes = "Keep notes under 1,800 characters.";

    if (Object.keys(errors).length || (!gig && !service) || !selectedPackage) {
      return Response.json({ ok: false, errors }, { status: 422 });
    }

    // A single PayPal payment must not fund two orders.
    const duplicate = await db
      .select({ id: serviceOrders.id })
      .from(serviceOrders)
      .where(eq(serviceOrders.paypalOrderId, paypalOrderId))
      .limit(1);
    if (duplicate.length > 0) {
      return Response.json(
        { ok: false, errors: { paypalOrderId: "This PayPal payment has already been used for an order." } },
        { status: 409 },
      );
    }

    // The browser only reports the PayPal order id, so confirm with PayPal that
    // it was actually captured for this package price before creating the order.
    // Fail closed: without a verified capture no order is created.
    const verification = await verifyPayPalCapture(paypalOrderId, selectedPackage.price);
    if (!verification.ok) {
      if (verification.reason === "unconfigured") {
        console.error("PayPal verification is not configured: set PAYPAL_CLIENT_SECRET.");
        return Response.json(
          { ok: false, message: "Payment verification is not configured. Please contact support to complete your order." },
          { status: 503 },
        );
      }
      console.warn("PayPal verification failed", { paypalOrderId, reason: verification.reason });
      return Response.json(
        {
          ok: false,
          errors: {
            paypalOrderId:
              "We could not verify this PayPal payment. If you were charged, contact support — otherwise please complete the payment again.",
          },
        },
        { status: 402 },
      );
    }

    const reference = makeReference();

    // Link the order to the buyer's account when signed in. Guest checkout
    // must never fail because of auth, so any error here falls back to "".
    const sessionUser = await getCurrentUser().catch(() => null);

    await db.insert(serviceOrders).values({
      reference,
      userId: sessionUser?.id ?? "",
      serviceSlug: gig?.serviceSlug ?? service!.slug,
      gigSlug: gig?.slug ?? "",
      serviceName: gig?.title ?? service!.nav,
      packageTier,
      packageName: selectedPackage.name,
      price: selectedPackage.price,
      website,
      targetUrl,
      anchorPreference,
      market,
      notes,
      customerName,
      customerEmail,
      company,
      paypalOrderId,
      status: "in_progress",
    });

    await sendOrderNotificationEmail({
      reference,
      serviceName: gig?.title ?? service!.nav,
      packageName: selectedPackage.name,
      price: selectedPackage.price,
      customerName,
      customerEmail,
      website,
      targetUrl,
      paypalOrderId,
    });

    return Response.json({
      ok: true,
      reference,
      message: sessionUser
        ? `Payment confirmed. Your order is now being processed. Track it anytime from your dashboard.`
        : `Payment confirmed. Your order is now being processed. Save reference ${reference} — we also emailed it to ${customerEmail}.`,
    });
  } catch (error) {
    console.error("backlink order failed", error);
    return Response.json(
      { ok: false, message: "We could not save the order. Please try again." },
      { status: 500 },
    );
  }
}
