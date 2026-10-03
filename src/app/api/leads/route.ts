import { db } from "@/db";
import { leads } from "@/db/schema";
import { EMAIL_PATTERN } from "@/lib/format";
import { isRateLimited, requestIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (isRateLimited(`leads:${requestIp(request)}`, 20)) {
      return Response.json(
        { ok: false, message: "Too many requests. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const payload = (await request.json()) as Record<string, string | undefined>;
    const name = (payload.name ?? "").trim();
    const email = (payload.email ?? "").trim();
    const company = (payload.company ?? "").trim();
    const website = (payload.website ?? "").trim();
    const objective = (payload.objective ?? "").trim();
    const budget = (payload.budget ?? "").trim();
    const message = (payload.message ?? "").trim();
    const source = (payload.source ?? "website").trim();

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = "Please enter your full name.";
    if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid work email address.";
    if (message.length > 0 && message.length < 10) {
      errors.message = "Add a little more detail (10 characters minimum).";
    }
    if (message.length > 2000) errors.message = "Please keep your message under 2000 characters.";

    if (Object.keys(errors).length) {
      return Response.json({ ok: false, errors }, { status: 422 });
    }

    await db.insert(leads).values({
      name,
      email,
      company,
      website,
      objective,
      budget,
      message,
      source,
    });

    return Response.json({
      ok: true,
      message: "Thanks — a strategist will reply within one business day.",
    });
  } catch (error) {
    console.error("lead capture failed", error);
    return Response.json(
      { ok: false, message: "We could not send that right now. Please try again." },
      { status: 500 },
    );
  }
}
