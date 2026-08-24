"use client";

import dynamic from "next/dynamic";

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
}: {
  value: string;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute z-20 w-28 md:w-40 rounded-[var(--radius-md)] border border-[var(--color-accent)]/35 bg-[var(--color-bg)]/70 p-3 md:p-5 backdrop-blur-sm ${className}`}
    >
      <span className="block font-display text-2xl md:text-4xl font-light text-[var(--color-accent)]">{value}</span>
      <span className="mt-1 block font-mono text-[9px] md:text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

export function BrainStatsSection() {
  return (
    <section className="relative min-h-screen bg-[var(--color-bg)]" aria-label="Penn Grey Matters impact">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.13),transparent_62%)]" />
        <div className="absolute top-16 left-0 right-0 z-20 px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Penn Grey Matters</p>
          <h2 className="text-dimensional mt-3 font-display text-2xl md:text-4xl font-light text-[var(--color-text-primary)]">Explore the mind at the center of it all.</h2>
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-10 w-[min(66vw,34rem)] -translate-x-1/2 -translate-y-1/2 md:w-[min(48vw,38rem)]"
        >
          <BrainCanvas />
        </div>

        {stats.map((stat) => (
          <StatOrbit key={stat.label} {...stat} />
        ))}

      </div>
    </section>
  );
}
