import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL } from "@/lib/orders";

const COOKIE_NAME = "linkslo_admin_session";
const SESSION_HOURS = 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(expiry: string) {
  return createHmac("sha256", getSecret()).update(`${ADMIN_EMAIL.toLowerCase()}:${expiry}`).digest("hex");
}

export function verifyAdminCredentials(email: string, password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD || "";
  if (!configuredPassword || password.length < 1) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === configuredPassword;
}

export async function createAdminSession() {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  const expiry = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  const token = `${expiry}.${sign(expiry)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function isAdminSession() {
  const secret = getSecret();
  if (!secret) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value || "";
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature || Number(expiry) <= Date.now()) return false;
  const expected = sign(expiry);
  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
