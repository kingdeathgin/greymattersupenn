import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import chapters from "@/data/chapters.json";

export default function ChaptersPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Grey Matters Chapters
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12">
              Grey Matters chapters across universities worldwide.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <a
                  key={chapter.name}
                  href={chapter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors"
                >
                  <h2 className="font-display text-xl font-light text-[var(--color-text-primary)]">
                    {chapter.university}
                  </h2>
                  <span className="font-mono text-sm text-[var(--color-accent)] mt-2 inline-block">
                    Visit →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
