import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import articles from "@/data/articles.json";

export default function ArticlesPage() {
  return (
    <>
      <Navigation />
      <main className="bg-[var(--color-bg)] pt-[var(--main-top-offset)]">
        <header className="px-4 pb-8 pt-4 md:px-8 md:pb-12 md:pt-8">
          <div className="mx-auto max-w-[var(--wide-max)]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">The archive</p>
            <h1 className="mt-3 font-display text-4xl font-light text-[var(--color-text-primary)] md:text-6xl">Articles</h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-[var(--color-text-muted)]">
              Scroll through the stories shaping how we understand the brain, mind, and behavior.
            </p>
          </div>
        </header>

        <section className="px-4 pb-16 md:px-8 md:pb-24" aria-labelledby="issue-one-heading">
          <div className="mx-auto grid max-w-[var(--wide-max)] items-center gap-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-5 shadow-2xl md:grid-cols-[minmax(18rem,0.72fr)_1.28fr] md:gap-14 md:p-10 lg:p-14">
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-sm border border-white/10 bg-[#071827] shadow-2xl shadow-black/40">
              <Image
                src="/images/issues/issue-one-fall-2025-enhanced.png"
                alt="Grey Matters Penn Issue One, Fall 2025 cover"
                width={1098}
                height={1432}
                priority
                sizes="(max-width: 768px) 90vw, 384px"
                className="h-auto w-full"
              />
            </div>

            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
                Fall 2025 · 7 articles
              </p>
              <h2 id="issue-one-heading" className="mt-4 font-display text-4xl font-light text-[var(--color-text-primary)] md:text-6xl">
                Issue One
              </h2>
              <p className="mt-5 font-body text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
                The inaugural Grey Matters Penn issue explores intelligence, multilingualism,
                genetics, neurodegeneration, aging, and the ways our brains measure a lifetime.
                All seven stories will appear in the archive as their final cover art is completed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider">
                <a
                  href="#issue-one-articles"
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-3 text-[var(--color-bg)] transition-transform hover:scale-[1.02]"
                >
                  Browse Issue One
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="issue-one-articles" className="scroll-mt-24 px-4 pb-16 md:px-8 md:pb-24" aria-label="Issue One article archive">
          <div className="mx-auto max-w-[var(--wide-max)]">
            <div className="mb-8 md:mb-12">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">Issue One</p>
              <h2 className="mt-2 font-display text-3xl font-light text-[var(--color-text-primary)] md:text-5xl">The articles</h2>
            </div>
            {articles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                aria-label={`Read ${article.title}`}
                className="sticky top-[calc(var(--main-top-offset)+1rem)] mb-8 block h-[72vh] min-h-[32rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 bg-[var(--color-surface)] shadow-2xl transition-colors hover:border-[var(--color-accent)]/60 md:mb-12 md:h-[78vh]"
                style={{ zIndex: index + 1 }}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, min(100vw - 4rem, 1400px)"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">{article.category}</p>
                  <h2 className="mt-3 max-w-3xl font-display text-3xl font-light text-[var(--color-text-primary)] md:text-5xl">{article.title}</h2>
                  {article.subtitle && <p className="mt-3 max-w-2xl font-body text-base text-[var(--color-text-primary)]/80 md:text-lg">{article.subtitle}</p>}
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <span>{article.author}</span>
                    <span>{article.comingSoon ? "Article forthcoming" : `${article.readingTime} min read`}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
