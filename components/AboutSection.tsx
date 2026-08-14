"use client";

export function AboutSection() {
  return (
    <section
      className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] px-[var(--section-padding-x)]"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto">
        <div className="max-w-[var(--content-max)]">
          {/* Mission text */}
          <div className="max-w-[var(--content-max)]">
            <h2 className="font-display text-[var(--color-text-primary)] mb-[var(--space-xl)]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}>
              Purpose, Scope & Commitment
            </h2>
            <div className="font-body text-[var(--color-text-muted)] text-body-lg space-y-[var(--space-xl)]">
              <div className="space-y-[var(--space-md)]">
                <h3 className="text-label text-[var(--color-accent)]">
                  Purpose
                </h3>
                <p>
                  Grey Matters first started at the University of Washington to broaden access to neuroscience content. At the University of Pennsylvania (Penn), we have decided to embody the very purpose Grey Matters was founded.
                </p>
                <p>
                  Neuroscience is quickly becoming one of the fastest-growing fields. Grey Matters hopes to serve as a focal point for neuroscience information that should be widely accessible.
                </p>
              </div>
              <div className="space-y-[var(--space-md)]">
                <h3 className="text-label text-[var(--color-accent)]">
                  Scope
                </h3>
                <p>
                  Penn Grey Matters is not restricted to neuroscience students. Grey Matters is dedicated to being a free site that any curious individual can go to and learn more about fascinating neuroscience topics. Our team includes artists, engineers, writing students, and many others from different interdisciplinary categories.
                </p>
              </div>
              <div className="space-y-[var(--space-md)]">
                <h3 className="text-label text-[var(--color-accent)]">
                  Commitment
                </h3>
                <p>
                  We plan to write articles relating to disease, psychology studies, brain conditions, technology, emotion, reason, and more. We also provide free podcasts with Penn faculty, and we are committed to writing about animal behavior and its significance in neuroscience research.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
