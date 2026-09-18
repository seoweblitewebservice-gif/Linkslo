import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { serviceOrders } from "@/db/schema";
import { EMAIL_PATTERN } from "@/lib/format";

export const dynamic = "force-dynamic";

function safeFiles(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { reference?: string; email?: string };
    const reference = (payload.reference ?? "").trim().toUpperCase();
    const email = (payload.email ?? "").trim().toLowerCase();

    if (!reference || !EMAIL_PATTERN.test(email)) {
      return Response.json({ ok: false, message: "Enter the order reference and the email used for the order." }, { status: 422 });
    }

    const rows = await db
      .select()
      .from(serviceOrders)
      .where(and(eq(serviceOrders.reference, reference), eq(serviceOrders.customerEmail, email)))
      .limit(1);

    const order = rows[0];
    if (!order) {
      return Response.json({ ok: false, message: "No order matched that reference and email." }, { status: 404 });
    }

    return Response.json({
      ok: true,
      order: {
        reference: order.reference,
        serviceName: order.serviceName,
        packageName: order.packageName,
        price: order.price,
        website: order.website,
        targetUrl: order.targetUrl,
        anchorPreference: order.anchorPreference,
        market: order.market,
        status: order.status,
        deliveryNote: order.deliveryNote,
        deliveryFiles: safeFiles(order.deliveryFiles),
        deliveredAt: order.deliveredAt,
        completedAt: order.completedAt,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("track order failed", error);
    return Response.json({ ok: false, message: "We could not load that order right now." }, { status: 500 });
  }
}
