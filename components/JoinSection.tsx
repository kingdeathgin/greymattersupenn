"use client";

import Link from "next/link";

export function JoinSection() {
  return (
    <section
      className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] px-[var(--section-padding-x)]"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto text-center">
        <h2 className="font-display text-[var(--color-text-primary)] mb-[var(--space-lg)] max-w-2xl mx-auto" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 300, lineHeight: 1.2 }}>
          Your major doesn&apos;t matter. Your curiosity does.
        </h2>
        <p className="font-body text-body-lg text-[var(--color-text-muted)] mb-[var(--space-xl)] max-w-xl mx-auto">
          Writers, Designers, Researchers, Podcast Hosts, Developers — we want you.
        </p>
        <Link
          href="/get-involved"
          className="inline-block px-[var(--space-xl)] py-[var(--space-md)] rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] font-mono text-sm uppercase hover:opacity-90 transition-opacity"
          style={{ letterSpacing: "0.1em" }}
        >
          Get Involved
        </Link>
      </div>
    </section>
  );
}
