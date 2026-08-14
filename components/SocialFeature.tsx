import Image from "next/image";

const INSTAGRAM_POST_URL =
  "https://www.instagram.com/p/DXikzxyF5xg/?img_index=1";

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SocialFeature() {
  return (
    <section className="bg-[var(--color-surface)] py-[var(--space-3xl)] md:py-[var(--space-4xl)] px-4 md:px-8">
      <div className="max-w-[var(--wide-max)] mx-auto grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-14 items-center">
        <a
          href={INSTAGRAM_POST_URL}
          target="_blank"
          rel="noreferrer"
          className="relative mx-auto block w-full max-w-sm aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 group"
          aria-label="View the Grey Matters UPenn Instagram post about sleep and brain health"
        >
          <Image
            src="/images/social/sleep-glymphatic-original.png"
            alt="Grey Matters UPenn Instagram graphic about sleep and brain health"
            fill
            sizes="(min-width: 768px) 33vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>
        <article className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
            From Instagram · April 24, 2026
          </p>
          <h2 className="font-editorial text-3xl md:text-5xl leading-[1.12] text-[var(--color-text-primary)]">
            Sleep clears more than fatigue.
          </h2>
          <p className="font-body text-[var(--color-text-muted)] mt-5 text-base md:text-lg">
            During sleep, cerebrospinal fluid moves more efficiently through the
            brain, helping the glymphatic system clear metabolic waste—including
            proteins associated with neurodegenerative disease.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mt-6">
            Research spotlight · Xie et al., Science
          </p>
          <a
            href={INSTAGRAM_POST_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <InstagramIcon />
            View on Instagram
            <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </section>
  );
}
