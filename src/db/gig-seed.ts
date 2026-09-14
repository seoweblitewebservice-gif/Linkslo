import { sql } from "drizzle-orm";
import { db } from "@/db";
import { backlinkGigs } from "@/db/schema";
import { GIG_COUNT, generateGigRows } from "@/lib/gigs/generator";
import { SITE_GIG_COUNT, generateSiteGuestPostGigs } from "@/lib/gigs/site-generator";

let gigSeedPromise: Promise<void> | null = null;

/** Total catalogue size: the templated service gigs plus one real, price-listed gig per publisher domain. */
const TOTAL_GIG_COUNT = GIG_COUNT + SITE_GIG_COUNT;

function buildAllGigRows() {
  // Real per-domain guest post gigs are seeded first so their ids stay low and stable.
  return [...generateSiteGuestPostGigs(), ...generateGigRows(GIG_COUNT)];
}

async function seedGigs() {
  await db.transaction(async (tx) => {
    // Serialises seeding across Next build workers and concurrent cold starts.
    await tx.execute(sql`select pg_advisory_xact_lock(22002026)`);
    const [result] = await tx
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(backlinkGigs);
    const firstRows = await tx
      .select({ slug: backlinkGigs.slug })
      .from(backlinkGigs)
      .orderBy(backlinkGigs.id)
      .limit(1);
    const expectedFirstSlug = generateSiteGuestPostGigs()[0]?.slug ?? generateGigRows(1)[0].slug;

    if (result.count === TOTAL_GIG_COUNT && firstRows[0]?.slug === expectedFirstSlug) return;

    await tx.delete(backlinkGigs);
    const rows = buildAllGigRows();
    const batchSize = 125;
    for (let offset = 0; offset < rows.length; offset += batchSize) {
      await tx.insert(backlinkGigs).values(rows.slice(offset, offset + batchSize));
    }
  });
}

/** Keeps the catalogue at exactly GIG_COUNT templated gigs plus SITE_GIG_COUNT real per-domain guest post gigs. */
export async function ensureGigsSeeded() {
  if (!gigSeedPromise) {
    gigSeedPromise = seedGigs().catch((error) => {
      gigSeedPromise = null;
      throw error;
    });
  }
  return gigSeedPromise;
}
