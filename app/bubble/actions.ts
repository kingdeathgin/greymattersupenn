"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { STATES, validDrawing, validThemes } from "@/lib/bubble";
import { applicationDatabase } from "@/lib/application-store";
import { currentSubmission, SUBMISSION_COOKIE } from "@/lib/bubble-store";

export async function submissionStillExists(): Promise<boolean> {
  return Boolean(await currentSubmission());
}

export async function submitBubble(form: FormData): Promise<{ error?: string; success?: boolean; name?: string; duplicate?: boolean }> {
  const rawName = form.get("name");
  const city = form.get("city");
  const rawThemes = form.get("themes");
  let themes: unknown;
  try { themes = JSON.parse(typeof rawThemes === "string" ? rawThemes : "null"); } catch { themes = null; }
  if (!validThemes(themes)) return { error: "Choose one to three themes shown in your drawing." };
  if (typeof city !== "string" || !city.trim() || city.trim().length > 100) return { error: "Enter your home city (up to 100 characters)." };
  const state = form.get("state");
  const drawing = form.get("drawing");
  if (typeof rawName !== "string" || !rawName.trim() || rawName.trim().length > 80) return { error: "Enter your name (up to 80 characters)." };
  if (typeof state !== "string" || !STATES.some((item) => item === state)) return { error: "Select your home state." };
  if (typeof drawing !== "string" || new TextEncoder().encode(drawing).length > 750000) return { error: "This drawing is too large. Remove some marks and try again." };
  try {
    if (!validDrawing(JSON.parse(drawing))) return { error: "Add your drawing before submitting." };
  } catch { return { error: "We couldn’t read this drawing. Please try again." }; }
  try {
    const id = randomUUID();
    const db = await applicationDatabase();
    // One atomic statement prevents concurrent requests from submitting the same name.
    // Existing submissions are never overwritten, even when this browser changes names.
    const result = await db.prepare(`INSERT INTO bubble_submissions (id, name, city, state, themes, drawing, submitted_at)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM bubble_submissions WHERE lower(trim(name)) = lower(trim(?)))
      RETURNING id`).bind(id, rawName.trim(), city.trim(), state, JSON.stringify(themes), drawing, new Date().toISOString(), rawName.trim()).first<{ id: string }>();
    if (!result) return { duplicate: true, error: "This name has already submitted. Enter a different name for a new submission." };
    (await cookies()).set(SUBMISSION_COOKIE, id, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/bubble", maxAge: 60 * 60 * 24 * 7 });
    return { success: true, name: rawName.trim() };
  } catch { return { error: "Your drawing wasn’t submitted. Please try again; your work is still here." }; }
}
