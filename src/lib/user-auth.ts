import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { compare, genSalt, hash } from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { userSessions, users } from "@/db/schema";

/**
 * Self-hosted buyer auth: email + password with bcrypt hashes and opaque
 * session tokens stored in Postgres. No OAuth, no extra env vars — the
 * session cookie mirrors the discipline of the admin HMAC cookie
 * (httpOnly, secure in production, sameSite lax, path /).
 */

const COOKIE_NAME = "linkslo_session";
const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = 12;

/** A dummy hash so login timing does not reveal whether an email exists. */
const DUMMY_HASH = "$2b$12$KIXxQGv7Y8r3sT9uV0wXeOaBcDeFgHiJkLmNoPqRsTuVwXyZ01234";

export type CurrentUser = { id: string; name: string; email: string };

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(BCRYPT_ROUNDS);
  return hash(password, salt);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await compare(password, passwordHash);
  } catch {
    return false;
  }
}

/** Timing-safe dummy compare used when the email is not registered. */
export async function dummyPasswordCheck(password: string): Promise<void> {
  try {
    await compare(password, DUMMY_HASH);
  } catch {
    /* intentionally ignored */
  }
}

/** Returns the signed-in buyer, or null. Never throws. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value || "";
    if (!token) return null;
    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(and(eq(userSessions.id, token), gt(userSessions.expiresAt, new Date())))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Creates a 30-day session row and sets the session cookie. */
export async function createUserSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(userSessions).values({ id: token, userId, expiresAt });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/** Deletes the session row (if any) and clears the cookie. Never throws. */
export async function destroyUserSession(): Promise<void> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value || "";
    if (token) {
      await db.delete(userSessions).where(eq(userSessions.id, token));
    }
    store.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {
    /* logout must never fail loudly */
  }
}
