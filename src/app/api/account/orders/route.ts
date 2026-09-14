import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { serviceOrders } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ ok: false, orders: [] }, { status: 401 });

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";

  // Match by Clerk user id, and also by email so a guest checkout made with
  // the same address before signing up still shows up once the buyer logs in.
  const condition = email
    ? or(eq(serviceOrders.userId, userId), eq(serviceOrders.customerEmail, email))
    : eq(serviceOrders.userId, userId);

  const rows = await db
    .select()
    .from(serviceOrders)
    .where(condition)
    .orderBy(desc(serviceOrders.createdAt));

  return Response.json({
    ok: true,
    orders: rows.map((row) => ({
      ...row,
      deliveryFiles: safeParseFiles(row.deliveryFiles),
    })),
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
