"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { checkApplication } from "./actions";
import styles from "./celebration.module.css";
import { AcknowledgementForm } from "./AcknowledgementForm";

export function ApplicationUpdateForm() {
  const [attempt, setAttempt] = useState(0);
  return <UpdateForm key={attempt} onReset={() => setAttempt((value) => value + 1)} />;
}

function UpdateForm({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(checkApplication, {});
  const heading = useRef<HTMLHeadingElement>(null);
  const member = state.member;
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    if (member || state.declinedName) heading.current?.focus();
  }, [member, state.declinedName]);

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 md:px-8 md:py-28 min-h-[75vh] flex items-center justify-center">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at 20% 30%, rgba(0,229,255,0.12), transparent 60%), radial-gradient(ellipse at 80% 65%, rgba(155,93,229,0.18), transparent 60%)" }} />
      {state.declinedName ? (
        <div className="max-w-xl w-full">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] mb-5">Application update</p>
          <h1 ref={heading} tabIndex={-1} className="font-display text-4xl md:text-5xl text-[var(--color-text-primary)] outline-none">Thank you, {state.declinedName}.</h1>
          <div className="font-body text-lg text-[var(--color-text-muted)] mt-7 space-y-5">
            <p>Thank you for taking the time to apply to Grey Matters at Penn and share your work with us.</p>
            <p>Unfortunately, we are unable to offer you a position this time. We appreciate your interest in the club and the effort you put into your application.</p>
            <p>Thank you again,<br />Elgin Tawiah<br />Editor-in-Chief, Grey Matters at Penn</p>
          </div>
          {state.email && <AcknowledgementForm email={state.email} />}
          <div className="flex flex-wrap gap-6 mt-9 font-mono text-sm">
            <Link href="/contact" className="text-[var(--color-accent)] underline underline-offset-4">Contact us</Link>
            <button type="button" onClick={onReset} className="text-[var(--color-text-muted)] underline underline-offset-4">Check another email</button>
          </div>
        </div>
      ) : member ? (
        <div className="max-w-3xl w-full text-center">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 36 }, (_, index) => (
              <span key={index} className={styles.confetti} style={{ left: `${(index * 37) % 100}%`, backgroundColor: ["#00E5FF", "#9B5DE5", "#F4D35E"][index % 3], animationDelay: `${(index % 9) * 0.12}s`, animationDuration: `${3 + (index % 4) * 0.3}s` }} />
            ))}
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent-gold)] mb-6">{member.returning ? "A new chapter, together" : "You’re in!"}</p>
          <h1 ref={heading} tabIndex={-1} className="font-display text-4xl md:text-6xl leading-tight text-[var(--color-text-primary)] outline-none">
            {member.returning ? "Welcome back," : "Congratulations,"}<br />{member.name}!
          </h1>
          <figure className="mt-7 motion-reduce:hidden">
            {showGif && (
              <Image
                src="https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif"
                alt="Minions cheering excitedly in celebration."
                width={245}
                height={245}
                unoptimized
                className="mx-auto h-auto w-full max-w-[245px] rounded-2xl"
              />
            )}
            <figcaption className="mt-3 flex justify-center gap-4 font-mono text-xs text-[var(--color-text-muted)]">
              <button type="button" onClick={() => setShowGif((visible) => !visible)} className="underline underline-offset-4">{showGif ? "Hide GIF" : "Show GIF"}</button>
              <a href="https://giphy.com/gifs/11sBLVxNs7v6WA" target="_blank" rel="noreferrer" className="underline underline-offset-4">GIF via GIPHY</a>
            </figcaption>
          </figure>
          <p className="font-body text-lg md:text-xl text-[var(--color-text-muted)] mt-7 max-w-xl mx-auto">
            {member.returning ? "We’re so glad to have you back at Penn Grey Matters. Here’s to another chapter of curiosity, creativity, and sharing science together." : "I (Elgin Tawiah) have read your application and I would like to congratulate you on getting a position in Grey Matters at Penn. Your response stood out from other applicants, and your artifact was an amazing demonstration of qualities relevant to the very purpose of this club."}
          </p>
          <div className="inline-block rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] px-10 py-6 mt-9">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">You have been assigned:</p>
            <p className="font-display text-2xl text-[var(--color-accent)]">{member.role}</p>
          </div>
          <p className="font-body text-lg text-[var(--color-text-muted)] mt-8 max-w-xl mx-auto">
            We are hosting our first GBM on Saturday 9/19 at{" "}
            <strong className="font-semibold text-[var(--color-text-primary)]">
              {["Author", "Editor", "Lead Editor", "Co-Editor-in-Chief"].includes(member.role)
                ? "5:00–5:30 PM"
                : "6:00–6:30 PM"}
            </strong>{" "}
            in the Gershwind &amp; Bennett Family Collaborative Classroom.
          </p>
          <p className="font-body text-lg text-[var(--color-text-muted)] mt-4 max-w-xl mx-auto">
            If you need help finding the room, ask at the front desk in the Holman Biotech Commons.
          </p>
          <p className="font-body text-lg text-[var(--color-text-primary)] mt-6">See you soon!</p>
          {state.email && <AcknowledgementForm email={state.email} />}
          <div className="flex flex-wrap justify-center gap-6 mt-9 font-mono text-sm">
            <Link href="/team" className="text-[var(--color-accent)] underline underline-offset-4">Meet the team</Link>
            <button type="button" onClick={onReset} className="text-[var(--color-text-muted)] underline underline-offset-4">Check another email</button>
          </div>
        </div>
      ) : (
        <div className="max-w-xl w-full">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] mb-5">Penn Grey Matters</p>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-text-primary)]">View your Application Decision</h1>
          <p className="font-body text-lg text-[var(--color-text-muted)] mt-6">Enter your email to view your application update. Returning members, your welcome-back message is here too.</p>
          <form action={action} className="mt-9">
            <label htmlFor="application-email" className="block font-mono text-sm text-[var(--color-text-primary)] mb-3">Email address</label>
            <input id="application-email" name="email" type="email" required maxLength={254} autoComplete="email" autoCapitalize="none" spellCheck={false} aria-describedby={state.error ? "application-error" : undefined} aria-invalid={Boolean(state.error)} className="w-full rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] px-5 py-4 text-[var(--color-text-primary)] focus:outline-2 focus:outline-[var(--color-accent)]" placeholder="you@sas.upenn.edu" />
            {state.error && <p id="application-error" role="alert" className="mt-4 text-sm text-[var(--color-accent-gold)]">{state.error}</p>}
            <button disabled={pending} className="mt-5 w-full rounded-xl bg-[var(--color-accent)] px-6 py-4 font-mono text-sm text-[var(--color-bg)] hover:opacity-90 disabled:opacity-60 transition-opacity">{pending ? "Checking…" : "View my update"}</button>
          </form>
          <p className="mt-6 font-body text-sm text-[var(--color-text-muted)]"><Link href="/contact" className="underline underline-offset-4 text-[var(--color-accent)]">Contact us</Link></p>
        </div>
      )}
    </section>
  );
}
