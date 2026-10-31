"use client";

import Image from "next/image";
import Link from "next/link";
import { StarField } from "./StarField";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      aria-labelledby="home-hero-heading"
    >
      <StarField />
      <div className="relative z-10 text-center w-full max-w-5xl mx-auto">
        <div className="hero-brain-stage relative mx-auto max-w-[640px]">
          <div aria-hidden="true" className="hero-brain-spotlight" />
          <div aria-hidden="true" className="hero-brain-halo" />
          <Image
            src="/main-image.png"
            alt="Penn Grey Matters brain illustration"
            width={560}
            height={344}
            className="hero-brain-image relative mx-auto mb-8 h-auto w-full max-w-[400px] md:max-w-[480px] object-contain"
            priority
          />
        </div>
        <h1
          id="home-hero-heading"
          className="font-display text-white font-bold text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[1.02] tracking-[-0.045em]"
        >
          Penn Grey Matters
        </h1>
        <p className="font-body text-white/80 text-lg md:text-2xl mt-6 max-w-3xl mx-auto">
          A student-run Penn journal making neuroscience accessible through
          stories, podcasts, and interactive experiences.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/articles"
            className="rounded border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 font-mono text-sm font-medium text-black transition-colors hover:bg-white hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Read the latest
          </Link>
          <Link
            href="/get-involved"
            className="rounded border border-white/60 px-6 py-3 font-mono text-sm font-medium text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
          >
            Get involved
          </Link>
        </div>
      </div>
    </section>
  );
}
