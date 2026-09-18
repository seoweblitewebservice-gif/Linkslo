import { desc } from "drizzle-orm";
import { db } from "@/db";
import { serviceOrders } from "@/db/schema";
import { isAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) return Response.json({ ok: false, orders: [] }, { status: 403 });

  const rows = await db.select().from(serviceOrders).orderBy(desc(serviceOrders.createdAt));

  return Response.json({
    ok: true,
    orders: rows.map((row) => ({ ...row, deliveryFiles: safeParseFiles(row.deliveryFiles) })),
  });
}

function safeParseFiles(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
