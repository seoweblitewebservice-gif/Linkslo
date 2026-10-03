import { sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { isRateLimited, requestIp } from "@/lib/rate-limit";
import { createUserSession, dummyPasswordCheck, verifyPassword } from "@/lib/user-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (isRateLimited(`auth-login:${requestIp(request)}`, 10)) {
      return Response.json(
        { ok: false, message: "Too many attempts. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = String(payload.email ?? "").trim().toLowerCase();
    const password = String(payload.password ?? "");

    if (!email || !password) {
      return Response.json({ ok: false, message: "Incorrect email or password." }, { status: 401 });
    }

    const rows = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1);

    if (rows.length === 0) {
      // Same-cost bcrypt work so timing does not reveal unregistered emails.
      await dummyPasswordCheck(password);
      return Response.json({ ok: false, message: "Incorrect email or password." }, { status: 401 });
    }

    const ok = await verifyPassword(password, rows[0].passwordHash);
    if (!ok) {
      return Response.json({ ok: false, message: "Incorrect email or password." }, { status: 401 });
    }

    await createUserSession(rows[0].id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("auth login failed", error);
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
