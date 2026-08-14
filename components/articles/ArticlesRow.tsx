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
      className="py-[var(--space-2xl)] md:py-[var(--space-3xl)] bg-[var(--color-bg)] border-t border-[var(--color-accent)]/10"
      aria-label="Latest articles"
    >
      <div className="max-w-[var(--wide-max)] mx-auto px-4 md:px-8">
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
            className="relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 group"
          >
            <Image
              src={featuredArticle.image}
              alt=""
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/65 via-transparent to-transparent" />
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

      <div className="max-w-[var(--wide-max)] mx-auto px-4 md:px-8 mb-8 flex items-end justify-between gap-4">
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

      <div className="articles-marquee overflow-hidden pl-4 md:pl-8">
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
