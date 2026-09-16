import { sql } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { GIG_COUNT, generateGigRows } from "@/lib/gigs/generator";
import { SITE_GIG_COUNT, generateSiteGuestPostGigs } from "@/lib/gigs/site-generator";

let gigSeedPromise: Promise<void> | null = null;

/** Total catalogue size: the templated service gigs plus one named-domain guest-post listing per source domain. */
const TOTAL_GIG_COUNT = GIG_COUNT + SITE_GIG_COUNT;

function buildAllGigRows() {
  // Named-domain guest post listings are seeded first so their ids stay low and stable.
  return [...generateSiteGuestPostGigs(), ...generateGigRows(GIG_COUNT)];
}

async function seedGigs() {
  await db.transaction(async (tx) => {
    // Serialises seeding across concurrent cold starts.
    await tx.execute(sql`select pg_advisory_xact_lock(22002026)`);
    const [result] = await tx
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(backlinkGigs);
    const firstRows = await tx
      .select({
        slug: backlinkGigs.slug,
        domain: backlinkGigs.domain,
        sellerName: backlinkGigs.sellerName,
        rating: backlinkGigs.rating,
        reviewCount: backlinkGigs.reviewCount,
        ordersCompleted: backlinkGigs.ordersCompleted,
        verified: backlinkGigs.verified,
      })
      .from(backlinkGigs)
      .orderBy(backlinkGigs.id)
      .limit(1);
    const expectedFirstSlug = generateSiteGuestPostGigs()[0]?.slug ?? generateGigRows(1)[0].slug;

    // The seed sentinel intentionally includes the neutral Linkslo-operated values.
    // This forces older databases containing generated seller identities, ratings,
    // review counts or order history to refresh once after the cleanup release.
    const first = firstRows[0];
    const alreadyCurrent =
      result.count === TOTAL_GIG_COUNT &&
      first?.slug === expectedFirstSlug &&
      Boolean(first?.domain) &&
      first?.sellerName === "Linkslo" &&
      first?.rating === 0 &&
      first?.reviewCount === 0 &&
      first?.ordersCompleted === 0 &&
      first?.verified === false;

    if (alreadyCurrent) return;

    await tx.delete(backlinkGigs);
    const rows = buildAllGigRows();
    const batchSize = 125;
    for (let offset = 0; offset < rows.length; offset += batchSize) {
      await tx.insert(backlinkGigs).values(rows.slice(offset, offset + batchSize));
    }
  });
}

/** Keeps the catalogue aligned with the current generated data model. */
export async function ensureGigsSeeded() {
  if (!gigSeedPromise) {
    gigSeedPromise = seedGigs().catch((error) => {
      gigSeedPromise = null;
      throw error;
    });
  }
  return gigSeedPromise;
}
