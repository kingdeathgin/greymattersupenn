"use client";

import Link from "next/link";
import Image from "next/image";
import type { Article } from "./types";

const CARD_CLASS =
  "w-[260px] sm:w-[280px] md:w-[300px] shrink-0 pr-5 md:pr-6";

function formatPublishedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function buildMarqueeTrack(articles: Article[]): Article[] {
  const minCards = 12;
  const base: Article[] = [];

  while (base.length < minCards) {
    base.push(...articles);
  }

  return [...base, ...base];
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <div className={CARD_CLASS}>
      <Link href={`/articles/${article.slug}`} className="block h-full group">
        <article className="h-full flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-accent)]/15 overflow-hidden bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,229,255,0.08)]">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-80" />
            <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-bg)]/80 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
              {article.category}
            </span>
          </div>
          <div className="flex flex-col flex-1 p-4 md:p-5">
            <h3 className="font-display text-base md:text-lg font-light text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
              {article.title}
            </h3>
            <p className="font-body text-[var(--color-text-muted)] text-sm mt-2 line-clamp-2 flex-1">
              {article.excerpt}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-4 line-clamp-1">
              By {article.author} · {formatPublishedDate(article.publishedAt)}
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-accent)]/10">
              <span className="font-mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                {article.comingSoon ? "Article forthcoming" : `${article.readingTime} min read`}
              </span>
              <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Read →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

type ArticlesRowProps = {
  articles: Article[];
};

export function ArticlesRow({ articles }: ArticlesRowProps) {
  if (articles.length === 0) return null;

  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];
  const recentArticles = [...articles]
    .filter((article) => article.slug !== featuredArticle.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const track = buildMarqueeTrack(recentArticles.length > 0 ? recentArticles : articles);
  const durationSeconds = Math.max(track.length * 4, 48);

  return (
    <section
      className="journal-paper relative overflow-hidden py-[var(--space-2xl)] md:py-[var(--space-3xl)] border-y border-black/10"
      aria-label="Latest articles"
    >
      <Image
        src="/images/editorial/neuroscience-margin-notes.png"
        alt=""
        width={1254}
        height={1254}
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-10 hidden w-[34rem] rotate-[7deg] opacity-[0.22] saturate-[1.12] lg:block"
      />

      <div className="relative z-10 max-w-[var(--wide-max)] mx-auto px-4 md:px-8">
        <header className="mb-8 border-y-2 border-[var(--color-text-primary)] py-4 md:mb-12">
          <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            <span>Issue No. 01</span>
            <span className="hidden sm:inline">The student neuroscience journal of Penn</span>
            <span>Fall 2025</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-6 border-t border-[var(--color-text-primary)]/25 pt-3">
            <div>
              <p className="journal-title-dimensional flex items-end font-editorial text-4xl leading-none md:text-6xl" aria-label="Grey Matters">
                <span aria-hidden="true">Grey Matter</span>
                <span className="journal-written-s relative -ml-[0.02em] inline-block h-[0.92em] w-[0.58em]" aria-hidden="true">
                  <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 50 70" fill="none">
                    <path
                      className="journal-written-s-stroke"
                      d="M42 9C31 2 12 4 8 16C4 28 17 31 29 33C43 36 47 45 41 55C35 64 22 66 14 60"
                      stroke="currentColor"
                      strokeWidth="4.2"
                      strokeLinecap="round"
                      pathLength="100"
                    />
                    <g className="journal-pencil">
                      <g className="journal-pencil-jitter">
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="-3.2 -3.2; 3.2 3.2; -2.2 -2.2; 2.5 2.5; -3.2 -3.2"
                          dur="0.95s"
                          repeatCount="indefinite"
                        />
                        <g transform="rotate(120 0 0)">
                          <path d="M0 0L8-7L34-12L38-4L10 3L0 0Z" fill="#d6a548" stroke="#46382a" strokeWidth="1.5" />
                          <path d="M8-7L10 3M31-11L35-3" stroke="#46382a" strokeWidth="1.4" />
                          <path d="M0 0L8-7L10 3L0 0Z" fill="#ead6ad" stroke="#46382a" strokeWidth="1.2" />
                          <path d="M0 0L3.6-2.9L4.5 1.1L0 0Z" fill="#28231f" />
                        </g>
                        <g className="journal-graphite-dust" fill="#77716b">
                          <circle r="1.2">
                            <animate attributeName="cx" values="0;-5;-8" dur="0.7s" repeatCount="indefinite" />
                            <animate attributeName="cy" values="0;2;5" dur="0.7s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0.35;0" dur="0.7s" repeatCount="indefinite" />
                          </circle>
                          <circle r="0.85">
                            <animate attributeName="cx" values="0;-3;-6" dur="0.55s" begin="0.18s" repeatCount="indefinite" />
                            <animate attributeName="cy" values="0;-1;-4" dur="0.55s" begin="0.18s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.65;0.3;0" dur="0.55s" begin="0.18s" repeatCount="indefinite" />
                          </circle>
                          <circle r="0.65">
                            <animate attributeName="cx" values="0;2;5" dur="0.62s" begin="0.32s" repeatCount="indefinite" />
                            <animate attributeName="cy" values="0;3;6" dur="0.62s" begin="0.32s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.55;0.25;0" dur="0.62s" begin="0.32s" repeatCount="indefinite" />
                          </circle>
                        </g>
                      </g>
                      <animateMotion
                        dur="1.35s"
                        begin="0.45s"
                        fill="freeze"
                        path="M42 9C31 2 12 4 8 16C4 28 17 31 29 33C43 36 47 45 41 55C35 64 22 66 14 60"
                      />
                    </g>
                  </svg>
                </span>
              </p>
              <p className="mt-2 font-editorial text-sm italic text-[var(--color-text-muted)] md:text-base">
                Notes on the brain, mind, and everything between.
              </p>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] md:block">
              University of Pennsylvania
            </span>
          </div>
        </header>

        <div className="border-y border-[var(--color-accent)]/15 py-3 flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          <span>Student-led</span>
          <span className="text-[var(--color-accent)]">•</span>
          <span>Research-informed</span>
          <span className="text-[var(--color-accent)]">•</span>
          <span>University of Pennsylvania</span>
        </div>

        <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-7 md:gap-12 py-10 md:py-14 items-center">
          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="journal-clipping relative block aspect-[16/10] overflow-hidden border border-black/15 bg-white p-2 pb-7 shadow-[0_12px_30px_rgba(45,35,25,0.14)] group"
          >
            <span className="relative block h-full overflow-hidden">
              <Image
                src={featuredArticle.image}
                alt=""
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </span>
            <span className="absolute left-1/2 top-0 h-7 w-28 -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-[#ded2ba]/90 shadow-sm" aria-hidden="true" />
          </Link>
          <article>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
              Featured story · {featuredArticle.category}
            </p>
            <h2 className="font-editorial text-3xl md:text-5xl leading-[1.12] text-[var(--color-text-primary)]">
              <Link href={`/articles/${featuredArticle.slug}`} className="hover:text-[var(--color-accent)] transition-colors">
                {featuredArticle.title}
              </Link>
            </h2>
            {featuredArticle.subtitle && (
              <p className="font-editorial italic text-lg md:text-xl text-[var(--color-text-muted)] mt-3">
                {featuredArticle.subtitle}
              </p>
            )}
            <p className="font-body text-[var(--color-text-muted)] mt-5 max-w-xl">
              {featuredArticle.excerpt}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mt-6">
              By {featuredArticle.author} · {formatPublishedDate(featuredArticle.publishedAt)} · {featuredArticle.comingSoon ? "Article forthcoming" : `${featuredArticle.readingTime} min read`}
            </p>
            <Link href={`/articles/${featuredArticle.slug}`} className="inline-block font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] mt-5 hover:text-[var(--color-text-primary)] transition-colors">
              Read the story →
            </Link>
          </article>
        </div>
      </div>

      <div className="relative z-10 max-w-[var(--wide-max)] mx-auto px-4 md:px-8 mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] mb-2">
            More from the archive
          </p>
          <h2
            className="font-display text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 300 }}
          >
            Recent articles
          </h2>
        </div>
        <Link
          href="/articles"
          className="shrink-0 font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="relative z-10 articles-marquee overflow-hidden pl-4 md:pl-8">
        <div
          className="articles-marquee-track flex w-max"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          {track.map((article, i) => (
            <ArticleCard key={`${article.slug}-${i}`} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
