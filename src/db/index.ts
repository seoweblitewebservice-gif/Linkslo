import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzleDb?: NodePgDatabase;
};

/**
 * Lazily creates (and caches) the real `pg` Pool. This function only runs the
 * first time a database call is actually made, never at module import time —
 * so importing this file (which `next build` does while collecting page data
 * for every route) never requires `DATABASE_URL` to be set. The env var is
 * only required once a request actually needs the database, at runtime.
 */
function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) return globalForDb.__arenaNextJsPostgresqlPool;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Set it in your environment (.env in development, " +
        "your host's environment variables in production) before making a database call.",
    );
  }

  // Timeouts are fail-safes, not performance tuning: without them a hung or
  // unreachable database stalls the awaiting request forever (pg defaults to
  // no connection timeout), which surfaced as pages that "get stuck" on click.
  const newPool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    // Fail fast when the database is unreachable instead of hanging the page.
    connectionTimeoutMillis: 10_000,
    // Reclaim idle connections so a quiet instance does not hold them.
    idleTimeoutMillis: 30_000,
  });
  // Cache in every environment. The lazy proxies below call getPool() on each
  // property access, so skipping the cache in production created a brand-new
  // pool (10 connections) per database call without ever closing it — leaking
  // connections until Postgres refused new ones and page loads hung.
  globalForDb.__arenaNextJsPostgresqlPool = newPool;
  return newPool;
}

function getDb(): NodePgDatabase {
  if (globalForDb.__arenaNextJsDrizzleDb) return globalForDb.__arenaNextJsDrizzleDb;
  const instance = drizzle(getPool());
  globalForDb.__arenaNextJsDrizzleDb = instance;
  return instance;
}

/**
 * Proxy that forwards every property/method access to the real Pool,
 * creating it on first use. Functions are bound to the real instance (not
 * the proxy) so internal `this` references — including private class
 * fields — behave exactly as if you were holding the real Pool directly.
 */
export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop, _receiver) {
    const real = getPool();
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

/**
 * Same lazy-proxy pattern for the Drizzle database client. All existing call
 * sites (`db.select()`, `db.insert()`, `db.transaction()`, etc.) keep working
 * unchanged — the only difference is *when* the connection is created.
 */
export const db: NodePgDatabase = new Proxy({} as NodePgDatabase, {
  get(_target, prop, _receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
