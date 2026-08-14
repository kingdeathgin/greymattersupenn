import Link from "next/link";

type Feature = {
  title: string;
  description: string;
};

type PlaceholderItem = {
  tag: string;
  title: string;
  subtitle: string;
};

type ContentComingSoonProps = {
  label: string;
  title: string;
  description: string;
  features: Feature[];
  placeholders: PlaceholderItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaHref: string;
  ctaLabel: string;
  visual: "podcast" | "research";
};

function WaveformVisual() {
  return (
    <div className="flex items-end justify-center gap-1 h-12" aria-hidden="true">
      {[0.35, 0.55, 0.8, 1, 0.7, 0.45, 0.9, 0.6, 0.75, 0.5, 0.85, 0.4].map(
        (h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-[var(--color-accent)]/50"
            style={{ height: `${h * 100}%` }}
          />
        )
      )}
    </div>
  );
}

function ResearchVisual() {
  return (
    <div
      className="h-12 rounded-[var(--radius-sm)] border border-[var(--color-accent-violet)]/25 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(155, 93, 229, 0.25) 0%, rgba(0, 229, 255, 0.08) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function ContentComingSoon({
  label,
  title,
  description,
  features,
  placeholders,
  ctaTitle,
  ctaDescription,
  ctaHref,
  ctaLabel,
  visual,
}: ContentComingSoonProps) {
  return (
  <>
    <section className="relative py-8 md:py-12 px-4 md:px-8 overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[70%] opacity-20 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            visual === "podcast"
              ? "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-accent) 0%, transparent 70%)"
              : "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-accent-violet) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[var(--wide-max)] mx-auto relative">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
          {label}
        </p>
        <h1
          className="font-display text-[var(--color-text-primary)] mb-5 max-w-3xl"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <p className="font-body text-[var(--color-text-muted)] text-lg md:text-xl max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </section>

    <section className="px-4 md:px-8 pb-12 md:pb-16">
      <div className="max-w-[var(--wide-max)] mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-6">
          What to expect
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-14 md:mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-5 md:p-6 rounded-[var(--radius-lg)] border border-[var(--color-accent)]/15 bg-[var(--color-surface)]"
            >
              <h3 className="font-display text-lg text-[var(--color-text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-[var(--color-text-muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            On the horizon
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
            Coming soon
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {placeholders.map((item) => (
            <div
              key={item.title}
              className="group relative p-5 md:p-6 rounded-[var(--radius-lg)] border border-[var(--color-accent)]/15 bg-[var(--color-surface)] overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.06) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              />
              <div className="mb-5">
                {visual === "podcast" ? <WaveformVisual /> : <ResearchVisual />}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]/80">
                {item.tag}
              </span>
              <h3 className="font-display text-lg text-[var(--color-text-primary)] mt-2 mb-1">
                {item.title}
              </h3>
              <p className="font-body text-sm text-[var(--color-text-muted)]">
                {item.subtitle}
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--color-accent)]/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  In production
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section
      className="px-4 md:px-8 py-12 md:py-16 border-t border-[var(--color-accent)]/10"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto text-center">
        <h2
          className="font-display text-[var(--color-text-primary)] mb-4 max-w-xl mx-auto"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300 }}
        >
          {ctaTitle}
        </h2>
        <p className="font-body text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
          {ctaDescription}
        </p>
        <Link
          href={ctaHref}
          className="inline-block px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] font-mono text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  </>
  );
}
