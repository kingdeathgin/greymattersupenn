"use server";

import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminSession, passwordsMatch, SESSION_SECONDS } from "@/lib/application-admin";
import { BUBBLE_ADMIN_COOKIE, bubblePassword, isBubbleAdmin } from "@/lib/bubble-admin";
import { SUBMISSION_COOKIE } from "@/lib/bubble-store";
import { applicationDatabase } from "@/lib/application-store";

export async function unlockGallery(_previous: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const secret = process.env.APPLICATION_ADMIN_PASSWORD;
  if (!secret) return { error: "The admin password hasn’t been configured yet." };
  const password = form.get("password");
  if (typeof password !== "string" || password.length > 256) return { error: "Enter your admin password." };
  try {
    const clientKey = "bubble:" + createHash("sha256").update((await headers()).get("cf-connecting-ip") ?? "local").digest("hex");
    const now = Date.now();
    const db = await applicationDatabase();
    const attempt = await db.prepare(`INSERT INTO application_admin_attempts (client_key, attempts, window_start) VALUES (?, 1, ?)
      ON CONFLICT(client_key) DO UPDATE SET
      attempts = CASE WHEN window_start < ? THEN 1 ELSE attempts + 1 END,
      window_start = CASE WHEN window_start < ? THEN excluded.window_start ELSE window_start END
      RETURNING attempts`).bind(clientKey, now, now - 900000, now - 900000).first<{ attempts: number }>();
    if (!attempt || attempt.attempts > 10) return { error: "Too many attempts. Try again in 15 minutes." };
    if (!passwordsMatch(password, bubblePassword())) return { error: "Incorrect password." };
    (await cookies()).set(BUBBLE_ADMIN_COOKIE, createAdminSession(`bubble:${secret}`), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/bubble", maxAge: SESSION_SECONDS });
  } catch { return { error: "Couldn’t open the gallery. Please try again." }; }
  redirect("/bubble/gallery");
}

export async function lockGallery() {
  (await cookies()).set(BUBBLE_ADMIN_COOKIE, "", { path: "/bubble", maxAge: 0 });
  redirect("/bubble");
}

export async function clearMap(): Promise<{ success?: boolean; error?: string }> {
  if (!(await isBubbleAdmin())) return { error: "Sign in as Elgin to clear the map." };
  try {
    const db = await applicationDatabase();
    const result = await db.prepare("DELETE FROM bubble_submissions").bind().run();
    if (!result.success) throw new Error("Clear failed");
    (await cookies()).set(SUBMISSION_COOKIE, "", { path: "/bubble", maxAge: 0 });
    revalidatePath("/bubble", "layout");
    return { success: true };
  } catch { return { error: "The map couldn’t be cleared. Please try again." }; }
}
