"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const BrainCanvas = dynamic(
  () => import("./BrainCanvas").then(({ BrainCanvas: Canvas }) => Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[16/10] w-full rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 bg-[var(--color-surface)]" />
    ),
  }
);

const stats = [
  { value: "50+", label: "Articles Published", className: "left-[4%] top-[30%] md:left-[10%]" },
  { value: "12+", label: "Podcast Episodes", className: "right-[4%] top-[42%] md:right-[10%]" },
  { value: "8", label: "Chapters Worldwide", className: "left-[12%] bottom-[18%] md:left-[18%]" },
];

function StatOrbit({
  value,
  label,
  className,
  index,
  progress,
}: {
  value: string;
  label: string;
  className: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.22 + index * 0.13;
  const opacity = useTransform(progress, [start, start + 0.13], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.13], [0.65, 1]);
  const y = useTransform(progress, [start, start + 0.13], [30, 0]);

  return (
    <motion.div
      className={`absolute z-20 w-28 md:w-40 rounded-[var(--radius-md)] border border-[var(--color-accent)]/35 bg-[var(--color-bg)]/70 p-3 md:p-5 backdrop-blur-sm ${className}`}
      style={{ opacity, scale, y }}
    >
      <span className="block font-display text-2xl md:text-4xl font-light text-[var(--color-accent)]">{value}</span>
      <span className="mt-1 block font-mono text-[9px] md:text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
    </motion.div>
  );
}

export function BrainStatsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const brainOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const brainScale = useTransform(scrollYProgress, [0, 0.24], [0.78, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.16], [0, 1]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-[var(--color-bg)]" aria-label="Penn Grey Matters impact">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.13),transparent_62%)]" />
        <motion.div className="absolute top-9 left-0 right-0 z-20 px-6 text-center" style={{ opacity: titleOpacity }}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Penn Grey Matters</p>
          <h2 className="mt-3 font-display text-2xl md:text-4xl font-light text-[var(--color-text-primary)]">Explore the mind at the center of it all.</h2>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 z-10 w-[min(66vw,34rem)] -translate-x-1/2 -translate-y-1/2 md:w-[min(48vw,38rem)]"
          style={{ opacity: brainOpacity, scale: brainScale }}
        >
          <BrainCanvas />
        </motion.div>

        {stats.map((stat, index) => (
          <StatOrbit key={stat.label} {...stat} index={index} progress={scrollYProgress} />
        ))}

      </div>
    </section>
  );
}
