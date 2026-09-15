"use client";

import { useActionState } from "react";
import { signInAdmin } from "./actions";

export function AdminLogin() {
  const [state, action, pending] = useActionState(signInAdmin, {});
  return (
    <form action={action} className="max-w-md mt-8">
      <p className="text-[var(--color-text-muted)] mb-6">Sign in to view application confirmations for elgin@sas.upenn.edu.</p>
      <label htmlFor="admin-password" className="block mb-3">Admin password</label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} className="w-full rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] px-5 py-4" />
      {state.error && <p role="alert" className="mt-4 text-[var(--color-accent-gold)]">{state.error}</p>}
      <button disabled={pending} className="mt-5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] px-6 py-3 disabled:opacity-60">{pending ? "Signing in…" : "View confirmations"}</button>
    </form>
  );
}
