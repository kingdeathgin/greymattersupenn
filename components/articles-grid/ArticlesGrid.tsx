"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import articles from "@/data/articles.json";

export function ArticlesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const others = articles.filter((a) => a.slug !== featured.slug).slice(0, 3);

  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <section
      ref={ref}
      className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] px-[var(--section-padding-x)]"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto">
        <h2
          className="font-display text-[var(--color-text-primary)] mb-[var(--space-md)]"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}
        >
          The Archive
        </h2>
        <div className="flex flex-wrap gap-[var(--space-sm)] mb-[var(--space-xl)]">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 rounded-[var(--radius-pill)] border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-mono text-sm"
            >
              #{cat}
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-[var(--space-xl)]">
          {/* Featured article - 60% width */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/articles/${featured.slug}`}>
              <article className="group h-full min-h-[300px] rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 overflow-hidden hover:border-[var(--color-accent)]/50 transition-colors bg-[var(--color-surface)]">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
                    {featured.category}
                  </span>
                  <h3 className="font-display text-2xl font-light text-[var(--color-text-primary)] mt-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {featured.title}
                  </h3>
                  <p className="font-body text-[var(--color-text-muted)] mt-2 line-clamp-2">
                    {featured.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Secondary articles */}
          <div className="flex flex-col gap-6">
            {others.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: (i + 1) * 0.1 }}
              >
                <Link href={`/articles/${article.slug}`}>
                  <article className="group flex gap-4 p-4 rounded-[var(--radius-md)] border border-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 transition-colors bg-[var(--color-surface)]/50">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-[var(--radius-sm)] overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h3 className="font-display text-lg font-light text-[var(--color-text-primary)] mt-1 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/articles"
            className="inline-block px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-accent)] text-[var(--color-accent)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            View All Articles
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
