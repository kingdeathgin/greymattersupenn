"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "./types";

type RelatedArticlesCarouselProps = {
  articles: Article[];
  currentSlug: string;
  title?: string;
};

export function RelatedArticlesCarousel({
  articles,
  currentSlug,
  title = "More from the Archive",
}: RelatedArticlesCarouselProps) {
  const related = articles.filter((a) => a.slug !== currentSlug);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
  }, [emblaApi, updateScrollState]);

  if (related.length === 0) return null;

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 border-t border-[var(--color-accent)]/10">
      <div className="mx-auto" style={{ width: "360px", maxWidth: "100%" }}>
        <h2
          className="font-display text-[var(--color-text-primary)] mb-4"
          style={{ fontSize: "1rem", fontWeight: 300 }}
        >
          {title}
        </h2>

        <div className="relative w-full min-w-0">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] bg-[var(--color-bg)]/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-accent)]/10 transition-colors"
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] bg-[var(--color-bg)]/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-accent)]/10 transition-colors"
            aria-label="Next"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="overflow-hidden w-full min-w-0" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {related.map((article) => (
                <div
                  key={article.slug}
                  className="flex-[0_0_100%] min-w-0 px-2"
                >
                <Link href={`/articles/${article.slug}`}>
                  <article className="group h-full rounded-[var(--radius-sm)] border border-[var(--color-accent)]/20 overflow-hidden hover:border-[var(--color-accent)]/50 transition-all duration-300 bg-[var(--color-surface)]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="360px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
                    </div>
                    <div className="p-2.5">
                      <span className="font-mono text-[9px] text-[var(--color-accent)] uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h3 className="font-display text-sm font-light text-[var(--color-text-primary)] mt-1 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
