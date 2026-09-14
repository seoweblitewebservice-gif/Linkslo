import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { EMAIL_PATTERN } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: string };
    const email = (payload.email ?? "").trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        { ok: false, message: "Enter a valid email address." },
        { status: 422 },
      );
    }

    await db.insert(subscribers).values({ email }).onConflictDoNothing();

    return Response.json({ ok: true, message: "Subscribed — the next digest lands on the 1st." });
  } catch (error) {
    console.error("newsletter signup failed", error);
    return Response.json(
      { ok: false, message: "Subscription failed. Please try again shortly." },
      { status: 500 },
    );
  }
}
