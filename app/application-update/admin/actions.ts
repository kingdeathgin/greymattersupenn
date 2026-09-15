"use server";

import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, SESSION_SECONDS, createAdminSession, passwordsMatch } from "@/lib/application-admin";
import { applicationDatabase } from "@/lib/application-store";

export async function signInAdmin(_previous: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const password = formData.get("password");
  const secret = process.env.APPLICATION_ADMIN_PASSWORD;
  if (!secret) return { error: "Admin sign-in is not configured yet." };
  if (typeof password !== "string" || password.length > 256) return { error: "Enter your admin password." };
  try {
    const requestHeaders = await headers();
    const clientKey = createHash("sha256").update(requestHeaders.get("cf-connecting-ip") ?? "local").digest("hex");
    const now = Date.now();
    const db = await applicationDatabase();
    const attempt = await db.prepare(`
      INSERT INTO application_admin_attempts (client_key, attempts, window_start) VALUES (?, 1, ?)
      ON CONFLICT(client_key) DO UPDATE SET
        attempts = CASE WHEN window_start < ? THEN 1 ELSE attempts + 1 END,
        window_start = CASE WHEN window_start < ? THEN excluded.window_start ELSE window_start END
      RETURNING attempts
    `).bind(clientKey, now, now - 15 * 60 * 1000, now - 15 * 60 * 1000).first<{ attempts: number }>();
    if (!attempt || attempt.attempts > 10) return { error: "Too many sign-in attempts. Please try again in 15 minutes." };
    if (!passwordsMatch(password, secret)) return { error: "Incorrect password." };
    (await cookies()).set(ADMIN_COOKIE, createAdminSession(secret), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/application-update/admin", maxAge: SESSION_SECONDS,
    });
  } catch {
    return { error: "Sign-in is temporarily unavailable. Please try again." };
  }
  redirect("/application-update/admin");
}

export async function signOutAdmin() {
  (await cookies()).set(ADMIN_COOKIE, "", { path: "/application-update/admin", maxAge: 0 });
  redirect("/application-update");
}
