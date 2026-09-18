import { eq } from "drizzle-orm";
import { db } from "@/db";
import { serviceOrders } from "@/db/schema";
import { isAdminSession } from "@/lib/admin-auth";
import { isOrderStatus, type DeliveryFile } from "@/lib/orders";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) return Response.json({ ok: false }, { status: 403 });

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) return Response.json({ ok: false, message: "Invalid order id" }, { status: 400 });

  const payload = (await request.json()) as {
    status?: string;
    deliveryNote?: string;
    deliveryFiles?: DeliveryFile[];
  };

  const updates: Partial<typeof serviceOrders.$inferInsert> = {};

  if (payload.status) {
    if (!isOrderStatus(payload.status)) {
      return Response.json({ ok: false, message: "Unknown status" }, { status: 422 });
    }
    updates.status = payload.status;
    if (payload.status === "delivered") updates.deliveredAt = new Date();
    if (payload.status === "completed") updates.completedAt = new Date();
  }

  if (typeof payload.deliveryNote === "string") {
    updates.deliveryNote = payload.deliveryNote.slice(0, 4000);
  }

  if (Array.isArray(payload.deliveryFiles)) {
    const cleanFiles = payload.deliveryFiles
      .filter((file) => file && typeof file.url === "string" && file.url.trim())
      .map((file) => ({ name: (file.name || "Delivered file").slice(0, 200), url: file.url.trim().slice(0, 2000) }))
      .slice(0, 20);
    updates.deliveryFiles = JSON.stringify(cleanFiles);
    if (cleanFiles.length && !payload.status) {
      updates.status = "delivered";
      updates.deliveredAt = new Date();
    }
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ ok: false, message: "Nothing to update" }, { status: 400 });
  }

  await db.update(serviceOrders).set(updates).where(eq(serviceOrders.id, orderId));

  return Response.json({ ok: true });
}
