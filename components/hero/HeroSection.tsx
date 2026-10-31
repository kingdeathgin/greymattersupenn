"use client";

import Image from "next/image";
import { StarField } from "./StarField";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <StarField />
      <div className="relative z-10 text-center w-full max-w-5xl mx-auto">
        <div className="relative mx-auto max-w-[640px]">
        <Image
          src="/main-image.png"
          alt="Penn Grey Matters brain illustration"
          width={560}
          height={344}
          className="mx-auto mb-8 h-auto w-full max-w-[400px] md:max-w-[480px] object-contain"
          priority
        />
        </div>
        <h1 className="font-display text-white font-bold text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[1.02] tracking-[-0.045em]">
          Penn Grey Matters
        </h1>
        <p className="font-body text-white/80 text-lg md:text-2xl mt-6">
          A student journal
        </p>
      </div>
    </section>
  );
}
