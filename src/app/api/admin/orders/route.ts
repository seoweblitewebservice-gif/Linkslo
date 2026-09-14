import { currentUser } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { serviceOrders } from "@/db/schema";
import { ADMIN_EMAIL } from "@/lib/orders";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  return email === ADMIN_EMAIL.toLowerCase() ? user : null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ ok: false, orders: [] }, { status: 403 });

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
