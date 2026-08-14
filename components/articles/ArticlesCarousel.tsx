"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "./types";

type ArticlesCarouselProps = {
  articles: Article[];
  title?: string;
  showViewAll?: boolean;
  compact?: boolean;
};

export function ArticlesCarousel({ articles, title = "The Archive", showViewAll = true, compact = false }: ArticlesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
  }, [emblaApi, updateScrollState]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  if (articles.length === 0) return null;

  return (
    <section
      className={`px-4 md:px-8 ${compact ? "pt-2 md:pt-3 pb-[var(--space-xl)] md:pb-[var(--space-2xl)]" : "py-[var(--space-2xl)] md:py-[var(--space-3xl)]"}`}
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-[720px] mx-auto" style={{ width: "100%" }}>
        {title && (
          <h2
            className="font-display text-[var(--color-text-primary)] mb-8"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}
          >
            {title}
          </h2>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] bg-[var(--color-bg)]/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-accent)]/10 transition-colors"
            aria-label="Previous article"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] bg-[var(--color-bg)]/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-accent)]/10 transition-colors"
            aria-label="Next article"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {articles.map((article) => (
                <div
                  key={article.slug}
                  className="flex-[0_0_100%] min-w-0 px-2"
                >
                <Link href={`/articles/${article.slug}`}>
                  <article className="group h-full rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 overflow-hidden hover:border-[var(--color-accent)]/50 transition-all duration-300 bg-[var(--color-surface)]">
                    <div className="relative aspect-[8/3] overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="720px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h3 className="font-display text-xl font-light text-[var(--color-text-primary)] mt-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="font-body text-[var(--color-text-muted)] mt-2 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {articles.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-[var(--color-accent)] w-6"
                  : "bg-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {showViewAll && (
          <div className="mt-12 text-center">
            <Link
              href="/articles"
              className="inline-block px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-accent)] text-[var(--color-accent)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent)]/10 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
