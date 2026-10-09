import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Leader } from "./synapse";
import { weekStart } from "./synapse";
type Statement = { bind(...args: (string | number | null)[]): Statement; run(): Promise<{ success: boolean }>; first<T>(): Promise<T | null>; all<T>(): Promise<{ success: boolean; results: T[] }> };
export type GameDatabase = { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<{ success: boolean }[]> };
export async function gameDatabase(): Promise<GameDatabase> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as unknown as { APPLICATION_DB?: GameDatabase }).APPLICATION_DB;
  if (!db) throw new Error("Game database unavailable");
  return db;
}
export async function leaders(db: GameDatabase, day: string) {
  const result = await db.prepare(`SELECT p.nickname, SUM(s.score) AS points, COUNT(*) AS days, SUM(s.elapsed_ms) AS elapsed_ms
    FROM synapse_scores s JOIN synapse_players p ON p.id = s.player_id
    WHERE s.day >= ? AND s.day <= ? AND p.nickname IS NOT NULL
    GROUP BY s.player_id ORDER BY points DESC, elapsed_ms ASC, lower(p.nickname) ASC LIMIT 10`).bind(weekStart(day), day).all<Leader>();
  if (!result.success) throw new Error("Leaderboard unavailable");
  return result.results;
}
