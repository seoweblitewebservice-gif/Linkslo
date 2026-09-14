import { db } from "@/db";
import { authorityScans } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { runAuthorityScout } from "@/lib/authority";
import { normaliseDomain } from "@/lib/format";

export const dynamic = "force-dynamic";

const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)+$/i;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      domain?: string;
      keyword?: string;
      market?: string;
    };

    const domain = normaliseDomain(payload.domain ?? "");
    const keyword = (payload.keyword ?? "").trim();
    const market = (payload.market ?? "Global").trim();

    const errors: Record<string, string> = {};
    if (!domain || !DOMAIN_PATTERN.test(domain)) {
      errors.domain = "Enter a valid domain, for example northloop.io";
    }
    if (keyword.length < 2) {
      errors.keyword = "Enter a target keyword with at least 2 characters.";
    }
    if (keyword.length > 80) {
      errors.keyword = "Keep the keyword under 80 characters.";
    }

    if (Object.keys(errors).length) {
      return Response.json({ ok: false, errors }, { status: 422 });
    }

    await ensureSeeded();
    const result = await runAuthorityScout({ domain, keyword, market });

    try {
      await db.insert(authorityScans).values({
        domain,
        keyword,
        market,
        opportunityScore: result.opportunityScore,
      });
    } catch (error) {
      console.error("scan log failed", error);
    }

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error("link gap scout failed", error);
    return Response.json({ ok: false, message: "Analysis failed. Please try again." }, { status: 500 });
  }
}
