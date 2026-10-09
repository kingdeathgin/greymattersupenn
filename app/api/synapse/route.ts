import { NextRequest, NextResponse } from "next/server";
import { easternDay, validNickname, validGuess, feedback, MAX_GUESSES, scoreFor, weekStart, type Guess } from "@/lib/synapse";
import { dailySecret } from "@/lib/synapse-secret";
import { gameDatabase, leaders } from "@/lib/synapse-store";
export const dynamic = "force-dynamic";
const COOKIE = "gm-synapse-player";
const validId = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id);
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
type Run = { id: string; day: string; started_at: number; finished_at: number | null; score: number | null; moves: number | null; elapsed_ms: number | null; guesses: string };
function publicRound(run: Run) {
  const guesses: Guess[] = JSON.parse(run.guesses);
  const won = guesses.at(-1)?.exact === 5;
  return { runId: run.id, guesses, won, finished: run.finished_at !== null, score: run.score, elapsedMs: run.elapsed_ms, ...(run.finished_at !== null ? { answer: dailySecret(run.day).answer } : {}) };
}
export async function GET(request: NextRequest) {
  const day = easternDay(), { puzzle } = dailySecret(day);
  try {
    const db = await gameDatabase(), id = request.cookies.get(COOKIE)?.value;
    const [board, profile, best, run] = await Promise.all([
      leaders(db, day),
      validId(id) ? db.prepare("SELECT nickname FROM synapse_players WHERE id = ?").bind(id).first<{ nickname: string | null }>() : null,
      validId(id) ? db.prepare("SELECT score, moves, elapsed_ms FROM synapse_scores WHERE player_id = ? AND day = ?").bind(id, day).first() : null,
      validId(id) ? db.prepare("SELECT * FROM synapse_runs WHERE player_id = ? AND day = ? ORDER BY started_at ASC LIMIT 1").bind(id, day).first<Run>() : null,
    ]);
    return json({ puzzle, leaderboard: board, week: weekStart(day), nickname: profile?.nickname ?? "", best, round: run ? publicRound(run) : null });
  } catch { return json({ puzzle, leaderboard: [], week: weekStart(day), nickname: "", best: null, round: null, unavailable: true }); }
}
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Please play from this website." }, 403);
  if (Number(request.headers.get("content-length")) > 10000) return json({ error: "That request is too large." }, 413);
  let body;
  try { const raw = await request.text(); if (raw.length > 10000) return json({ error: "That request is too large." }, 413); body = JSON.parse(raw); } catch { return json({ error: "That request is invalid." }, 400); }
  if (!body || typeof body !== "object") return json({ error: "That request is invalid." }, 400);
  const day = easternDay(), now = Date.now();
  try {
    const db = await gameDatabase(); let playerId = request.cookies.get(COOKIE)?.value;
    if (body.action === "start") {
      if (!validId(playerId) || !await db.prepare("SELECT id FROM synapse_players WHERE id = ?").bind(playerId).first()) {
        playerId = crypto.randomUUID();
        await db.prepare("INSERT INTO synapse_players (id, created_at) VALUES (?, ?)").bind(playerId, now).run();
      }
      const existing = await db.prepare("SELECT * FROM synapse_runs WHERE player_id = ? AND day = ? ORDER BY started_at ASC LIMIT 1").bind(playerId, day).first<Run>();
      let run = existing;
      if (!run) {
        const address = `${day}:${request.headers.get("cf-connecting-ip") ?? "local"}`;
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(address));
        const key = Array.from(new Uint8Array(digest)).map(n => n.toString(16).padStart(2, "0")).join("");
        const runId = crypto.randomUUID();
        run = await db.prepare(`INSERT INTO synapse_runs (id, player_id, day, started_at, network_key)
          SELECT ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM synapse_runs WHERE player_id = ? AND day = ?)
          AND (SELECT COUNT(*) FROM synapse_runs WHERE network_key = ? AND started_at > ?) < 60 RETURNING *`)
          .bind(runId, playerId, day, now, key, playerId, day, key, now - 60000).first<Run>();
        if (!run) run = await db.prepare("SELECT * FROM synapse_runs WHERE player_id = ? AND day = ? ORDER BY started_at ASC LIMIT 1").bind(playerId, day).first<Run>();
      }
      if (!run) return json({ error: "New rounds are temporarily limited. Try again shortly." }, 429);
      const response = json({ puzzle: dailySecret(day).puzzle, round: publicRound(run) });
      response.cookies.set(COOKIE, playerId, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
    if (!validId(playerId) || !validId(body.runId)) return json({ error: "Start today’s puzzle first." }, 400);
    const run = await db.prepare("SELECT * FROM synapse_runs WHERE id = ? AND player_id = ?").bind(body.runId, playerId).first<Run>();
    if (!run) return json({ error: "That round was not found. Refresh to resume." }, 404);
    if (run.day !== day) return json({ error: "A new daily puzzle is here. Refresh to start." }, 409);
    if (body.action === "guess") {
      if (run.finished_at !== null) return json({ round: publicRound(run) });
      if (!validGuess(body.signals)) return json({ error: "Choose five different signals." }, 400);
      const guesses: Guess[] = JSON.parse(run.guesses);
      if (body.turn !== guesses.length) return json({ error: "Your round changed in another tab. Refresh to resume." }, 409);
      if (guesses.some(g => g.signals.join() === body.signals.join())) return json({ error: "You already tried that sequence. Use what you learned." }, 400);
      const next = feedback(dailySecret(day).answer, body.signals);
      guesses.push(next);
      const finished = next.exact === 5 || guesses.length === MAX_GUESSES;
      const score = next.exact === 5 ? scoreFor(guesses.length) : finished ? 100 : null;
      const updated = await db.prepare(`UPDATE synapse_runs SET guesses = ?, finished_at = ?, score = ?, moves = ?, elapsed_ms = ?
        WHERE id = ? AND guesses = ? AND finished_at IS NULL RETURNING *`)
        .bind(JSON.stringify(guesses), finished ? now : null, score, guesses.length, finished ? Math.max(0, now - run.started_at) : null, run.id, run.guesses).first<Run>();
      if (!updated) return json({ error: "Your round changed in another tab. Refresh to resume." }, 409);
      return json({ round: publicRound(updated) });
    }
    if (body.action === "publish") {
      if (!run.finished_at || JSON.parse(run.guesses).at(-1)?.exact !== 5) return json({ error: "Decode the sequence before posting a score." }, 400);
      if (!validNickname(body.nickname)) return json({ error: "Use a nickname of 2–20 letters, numbers, spaces, dots, underscores, or hyphens." }, 400);
      const nickname = body.nickname.trim();
      const owner = await db.prepare("SELECT id FROM synapse_players WHERE lower(nickname) = lower(?) AND id != ?").bind(nickname, playerId).first();
      if (owner) return json({ error: "That nickname is already in use. Choose another." }, 409);
      const results = await db.batch([
        db.prepare("UPDATE synapse_players SET nickname = ? WHERE id = ?").bind(nickname, playerId),
        db.prepare(`INSERT INTO synapse_scores (day, player_id, score, moves, elapsed_ms) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(day, player_id) DO NOTHING`).bind(run.day, playerId, run.score, run.moves, run.elapsed_ms),
      ]);
      if (results.some(r => !r.success)) throw new Error("Score save failed");
      return json({ saved: true });
    }
    return json({ error: "Choose a valid game action." }, 400);
  } catch (error) {
    if (error instanceof Error && error.message.includes("synapse_nickname_unique")) return json({ error: "That nickname is already in use. Choose another." }, 409);
    return json({ error: "The game is temporarily unavailable. Your guesses are saved; try again shortly." }, 503);
  }
}
