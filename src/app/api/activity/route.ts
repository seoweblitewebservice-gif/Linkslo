import { isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { ensureGigsSeeded } from "@/db/gig-seed";

export const dynamic = "force-dynamic";

// Common buyer locations shown in the activity feed. Kept separate from a
// specific gig's own market so the popup reads as "a recent buyer", not a
// claim about who bought that exact listing.
const BUYER_LOCATIONS = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "India", "Netherlands", "Singapore", "United Arab Emirates", "Ireland",
];

const FIRST_NAMES = [
  "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie",
  "Priya", "Daniel", "Sofia", "Liam", "Noah", "Emma", "Ravi", "Chloe",
];

/**
 * Returns a small batch of real, currently-listed gigs (name + price) that
 * the client cycles through as "recent activity" notifications. The gig and
 * price shown are always real, live catalogue items — only the buyer name,
 * location and elapsed time are randomised placeholders, not verified sales.
 */
export async function GET() {
  try {
    await ensureGigsSeeded();
    const rows = await db
      .select({
        title: backlinkGigs.title,
        domain: backlinkGigs.domain,
        price: backlinkGigs.startingPrice,
        slug: backlinkGigs.slug,
      })
      .from(backlinkGigs)
      .where(isNotNull(backlinkGigs.domain))
      .orderBy(sql`random()`)
      .limit(40);

    const items = rows.map((row, index) => ({
      id: index,
      slug: row.slug,
      domain: row.domain,
      price: row.price,
      buyerName: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
      buyerLocation: BUYER_LOCATIONS[Math.floor(Math.random() * BUYER_LOCATIONS.length)],
      minutesAgo: 2 + Math.floor(Math.random() * 55),
    }));

    return Response.json({ ok: true, items });
  } catch (error) {
    console.error("activity feed query failed", error);
    return Response.json({ ok: false, items: [] }, { status: 500 });
  }
}
