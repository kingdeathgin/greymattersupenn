"use client";

import { useActionState } from "react";
import { acknowledgeApplication } from "./actions";

export function AcknowledgementForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(acknowledgeApplication.bind(null, email), {});

  return (
    <div className="mt-9 mx-auto max-w-xl rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-surface)] p-6 text-left">
      {state.success ? (
        <p role="status" className="font-body text-[var(--color-accent)]">✓ Thank you! Your confirmation has been saved.</p>
      ) : (
        <form action={action}>
          <label className="flex items-start gap-3 font-body text-[var(--color-text-primary)]">
            <input type="checkbox" name="acknowledged" value="yes" required disabled={pending} onChange={(event) => { if (event.currentTarget.checked) event.currentTarget.form?.requestSubmit(); }} className="mt-1 size-5 shrink-0 accent-[var(--color-accent)]" />
            <span>I confirm that I have read my application update.</span>
          </label>
          <p aria-live="polite" className="mt-3 font-body text-sm text-[var(--color-text-muted)]">{pending ? "Saving your confirmation…" : "Checking this box saves your confirmation for Elgin to see."}</p>
          {state.error && <>
            <p role="alert" className="mt-4 font-body text-sm text-[var(--color-accent-gold)]">{state.error}</p>
            <button disabled={pending} className="mt-4 underline text-[var(--color-accent)]">Try saving again</button>
          </>}
        </form>
      )}
    </div>
  );
}
