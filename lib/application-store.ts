import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Keep the binding shape local so generated Cloudflare types are optional.
type Database = {
  prepare(sql: string): {
    bind(...values: (string | number)[]): {
      run(): Promise<{ success: boolean }>;
      first<T>(): Promise<T | null>;
    };
    all<T>(): Promise<{ success: boolean; results: T[] }>;
  };
};

export async function applicationDatabase(): Promise<Database> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as unknown as { APPLICATION_DB?: Database }).APPLICATION_DB;
  if (!db) throw new Error("Application database is not configured");
  return db;
}

export async function saveAcknowledgement(email: string) {
  const db = await applicationDatabase();
  const result = await db.prepare(
    "INSERT INTO application_acknowledgements (email, confirmed_at) VALUES (?, ?) ON CONFLICT(email) DO NOTHING",
  ).bind(email, new Date().toISOString()).run();
  if (!result.success) throw new Error("Could not save acknowledgement");
}

export async function listAcknowledgements() {
  const db = await applicationDatabase();
  const result = await db.prepare(
    "SELECT email, confirmed_at FROM application_acknowledgements ORDER BY confirmed_at DESC",
  ).all<{ email: string; confirmed_at: string }>();
  if (!result.success) throw new Error("Could not read acknowledgements");
  return result.results;
}
