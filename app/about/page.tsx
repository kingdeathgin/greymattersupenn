import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-[var(--section-padding-x)]">
          <div className="max-w-[var(--content-max)] mx-auto">
            <h1 className="font-display text-[var(--color-text-primary)] mb-[var(--space-xl)]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
              About Penn Grey Matters
            </h1>
            <div className="font-body text-body-lg text-[var(--color-text-muted)] space-y-[var(--space-2xl)]">
              <div className="space-y-[var(--space-md)]">
                <h2 className="text-label text-[var(--color-accent)]">
                  Purpose
                </h2>
                <p>
                  Grey Matters first started at the University of Washington to broaden access to neuroscience content. At the University of Pennsylvania (Penn), we have decided to embody the very purpose Grey Matters was founded.
                </p>
                <p className="mt-4">
                  Neuroscience is quickly becoming one of the fastest-growing fields. Developments in technology dealing with the brain, our understanding of emotions, and discoveries tackling neurodegenerative conditions are accelerating at a rapid rate. Grey Matters hopes to serve as a focal point for neuroscience information that should be widely accessible.
                </p>
              </div>
              <div className="space-y-[var(--space-md)]">
                <h2 className="text-label text-[var(--color-accent)]">
                  Scope
                </h2>
                <p>
                  Penn Grey Matters is not restricted to neuroscience students. Grey Matters is dedicated to being a free site that any curious individual can go to and learn more about fascinating neuroscience topics. Our team includes artists, engineers, writing students, and many others from different interdisciplinary categories.
                </p>
              </div>
              <div className="space-y-[var(--space-md)]">
                <h2 className="text-label text-[var(--color-accent)]">
                  Commitment
                </h2>
                <p>
                  At Grey Matters, our mission is to communicate insightful neuroscience topics. We plan to write articles relating to disease, psychology studies, brain conditions, technology, emotion, reason, and many more. We also provide free podcasts with Penn faculty. Lastly, we are committed to writing about animal behavior and its significance in neuroscience research.
                </p>
              </div>
            </div>
            <div className="mt-[var(--space-3xl)]">
              <Link
                href="/get-involved"
                className="inline-block px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-accent)] text-[var(--color-accent)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent)]/10 transition-colors"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
