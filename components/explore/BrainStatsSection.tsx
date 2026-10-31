"use client";

import dynamic from "next/dynamic";
import { StarField } from "../hero/StarField";

const BrainCanvas = dynamic(
  () => import("./BrainCanvas").then(({ BrainCanvas: Canvas }) => Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[16/10] w-full " />
    ),
  }
);

export function BrainStatsSection() {
  return (
    <section className="relative min-h-[100svh] bg-[var(--color-bg)]" aria-label="Penn Grey Matters impact">
      <div className="relative min-h-[100svh] overflow-hidden">
        <StarField />
        <div className="absolute top-16 left-0 right-0 z-20 px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Penn Grey Matters</p>
          <h2 className="text-dimensional mt-3 font-display text-2xl md:text-4xl font-light text-[var(--color-text-primary)]">Explore the mind at the center of it all.</h2>
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-10 w-[min(66vw,34rem)] -translate-x-1/2 -translate-y-1/2 md:w-[min(48vw,38rem)]"
        >
          <BrainCanvas />
        </div>

      </div>
    </section>
  );
}
