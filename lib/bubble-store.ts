import "server-only";
import { cookies } from "next/headers";
import { applicationDatabase } from "./application-store";
import type { Mark, Submission, Theme } from "./bubble";

export const SUBMISSION_COOKIE = "gm-bubble-submission";
export async function currentSubmission(): Promise<Submission | null> {
  const id = (await cookies()).get(SUBMISSION_COOKIE)?.value;
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) return null;
  const db = await applicationDatabase();
  const row = await db.prepare("SELECT id, name, city, state, themes, drawing, submitted_at FROM bubble_submissions WHERE id = ?").bind(id).first<{ id: string; name: string; city: string; state: string; themes: string; drawing: string; submitted_at: string }>();
  return row ? { id: row.id, name: row.name, city: row.city, state: row.state, themes: JSON.parse(row.themes) as Theme[], marks: JSON.parse(row.drawing) as Mark[], submittedAt: row.submitted_at } : null;
}

export async function allSubmissions(): Promise<Submission[]> {
  const db = await applicationDatabase();
  const result = await db.prepare("SELECT id, name, city, state, themes, drawing, submitted_at FROM bubble_submissions ORDER BY submitted_at").all<{ id: string; name: string; city: string; state: string; themes: string; drawing: string; submitted_at: string }>();
  if (!result.success) throw new Error("Could not load drawings");
  return result.results.map((row) => ({ id: row.id, name: row.name, city: row.city, state: row.state, themes: JSON.parse(row.themes) as Theme[], marks: JSON.parse(row.drawing), submittedAt: row.submitted_at }));
}
