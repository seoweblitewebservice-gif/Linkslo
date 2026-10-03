import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { EMAIL_PATTERN } from "@/lib/format";
import { isRateLimited, requestIp } from "@/lib/rate-limit";
import { createUserSession, hashPassword } from "@/lib/user-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (isRateLimited(`auth-register:${requestIp(request)}`, 5)) {
      return Response.json(
        { ok: false, message: "Too many attempts. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const password = String(payload.password ?? "");

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = "Enter your full name.";
    if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
    if (password.length < 8) errors.password = "Use at least 8 characters.";
    if (Object.keys(errors).length > 0) {
      return Response.json({ ok: false, errors }, { status: 422 });
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1);
    if (existing.length > 0) {
      return Response.json(
        { ok: false, message: "An account with this email already exists. Try signing in." },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash: await hashPassword(password) })
      .returning({ id: users.id });

    await createUserSession(created.id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("auth register failed", error);
    // The users/user_sessions tables are created by `npm run db:push`. If that
    // deploy step was skipped, surface a clear 503 instead of a generic 500.
    if (isMissingTableError(error)) {
      return Response.json(
        { ok: false, message: "Accounts are being set up right now. Please try again in a few minutes." },
        { status: 503 },
      );
    }
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

function isMissingTableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /relation "(users|user_sessions)" does not exist/i.test(message);
}
