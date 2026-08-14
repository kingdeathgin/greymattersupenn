"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type HeroSectionProps = {
  expanded?: boolean;
};

export function HeroSection({ expanded = false }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[var(--color-bg)]" aria-hidden="true">
        {/* Top accent glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, var(--color-accent) 0%, transparent 70%)",
          }}
        />
        {/* Center violet glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--color-accent-violet) 0%, transparent 60%)",
          }}
        />
        {/* Subtle surface gradient */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 50%, var(--color-surface) 0%, transparent 70%)",
          }}
        />
        {/* Neural grid overlay - subtle lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Floating neural nodes - subtle accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(42)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[var(--color-accent)]"
              style={{
                width: i % 3 === 0 ? 6 : 4,
                height: i % 3 === 0 ? 6 : 4,
                left: `${5 + (i * 7.3) % 90}%`,
                top: `${8 + (i * 11.7) % 84}%`,
              }}
              animate={{
                opacity: [0.15, 0.4, 0.15],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + (i % 2),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
          {/* Red and blue nodes breathe independently, like active neural signals. */}
          {[...Array(52)].map((_, i) => (
            <motion.div
              key={`red-${i}`}
              className="absolute rounded-full bg-red-400"
              style={{
                width: i % 4 === 0 ? 10 : 5,
                height: i % 4 === 0 ? 10 : 5,
                left: `${4 + (i * 13.1) % 92}%`,
                top: `${4 + (i * 17.3) % 90}%`,
              }}
              animate={{
                opacity: [0.16, 0.8, 0.22, 0.16],
                scale: [0.65, 1.65, 0.9, 0.65],
                boxShadow: [
                  "0 0 0px rgba(248, 113, 113, 0)",
                  "0 0 16px 5px rgba(248, 113, 113, 0.75)",
                  "0 0 5px 1px rgba(248, 113, 113, 0.3)",
                  "0 0 0px rgba(248, 113, 113, 0)",
                ],
              }}
              transition={{
                duration: 3.6 + (i % 4) * 0.55,
                repeat: Infinity,
                delay: i * 0.17,
                ease: "easeInOut",
              }}
            />
          ))}
          {[...Array(52)].map((_, i) => (
            <motion.div
              key={`blue-${i}`}
              className="absolute rounded-full bg-sky-400"
              style={{
                width: i % 4 === 0 ? 10 : 5,
                height: i % 4 === 0 ? 10 : 5,
                left: `${3 + (i * 19.7) % 94}%`,
                top: `${5 + (i * 12.9) % 89}%`,
              }}
              animate={{
                opacity: [0.14, 0.82, 0.2, 0.14],
                scale: [0.6, 1.7, 0.85, 0.6],
                boxShadow: [
                  "0 0 0px rgba(56, 189, 248, 0)",
                  "0 0 17px 5px rgba(56, 189, 248, 0.8)",
                  "0 0 5px 1px rgba(56, 189, 248, 0.3)",
                  "0 0 0px rgba(56, 189, 248, 0)",
                ],
              }}
              transition={{
                duration: 3.3 + (i % 5) * 0.5,
                repeat: Infinity,
                delay: i * 0.14 + 0.35,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-[var(--space-lg)]">
        {/* Image - same in both states */}
        <div
          className={expanded ? "mb-8 flex justify-center" : "mb-6 flex justify-center"}
        >
          <div className="relative inline-block">
            {/* Slow-moving blue light gives the brain a fluid, underwater-like halo. */}
            <motion.div
              aria-hidden="true"
              className="absolute -inset-10 md:-inset-16 rounded-full blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 45%, rgba(56, 189, 248, 0.42) 0%, rgba(14, 116, 144, 0.2) 38%, transparent 72%)",
              }}
              animate={{
                scale: [0.92, 1.1, 0.97, 0.92],
                x: [-10, 14, -4, -10],
                y: [6, -10, 9, 6],
                opacity: [0.45, 0.8, 0.58, 0.45],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute -inset-8 md:-inset-12 rounded-full blur-2xl pointer-events-none mix-blend-screen"
              style={{
                background:
                  "radial-gradient(ellipse at 70% 55%, rgba(0, 229, 255, 0.28) 0%, transparent 62%)",
              }}
              animate={{
                scale: [1.08, 0.9, 1.06, 1.08],
                x: [10, -14, 8, 10],
                y: [-5, 12, -7, -5],
                opacity: [0.25, 0.65, 0.35, 0.25],
              }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <AnimatePresence>
              {expanded && (
                <motion.div
                  className="absolute -inset-4 rounded-full blur-xl opacity-25"
                  style={{
                    background:
                      "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.018, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/main-image.png"
                alt="Penn Grey Matters"
                width={560}
                height={344}
                className="w-[448px] h-[275px] md:w-[560px] md:h-[344px] object-contain drop-shadow-[0_0_24px_rgba(0,229,255,0.3)]"
                priority
              />
            </motion.div>
          </div>
        </div>
        <motion.blockquote
          className="font-display text-base md:text-lg font-light italic text-[var(--color-text-muted)] max-w-md mx-auto mt-4 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: expanded ? 0.15 : 0.5, duration: 0.6 }}
        >
          &ldquo;The brain is wider than the sky.&rdquo;
          <footer className="font-mono text-xs not-italic text-[var(--color-accent)]/70 mt-2 tracking-wider">
            — Emily Dickinson
          </footer>
        </motion.blockquote>
        {/* Minimal state: matches preloader exactly */}
        {!expanded ? (
          <>
            <motion.p
              className="font-display text-2xl md:text-3xl font-light text-[var(--color-text-primary)] mt-6 shrink-0"
            >
              Penn Grey Matters
            </motion.p>
            <motion.p
              className="font-mono text-sm uppercase text-[var(--color-accent)] mt-2"
              style={{ letterSpacing: "0.2em" }}
            >
              Making Neuroscience Accessible
            </motion.p>
          </>
        ) : null}

        {/* Expanded state: full headline, description, buttons */}
        <AnimatePresence>
          {expanded && (
            <>
            <motion.p
              className="font-mono text-xs md:text-sm uppercase text-[var(--color-accent)] mb-4"
              style={{ letterSpacing: "0.25em" }}
            >
              Penn Grey Matters
            </motion.p>
            <motion.h1
                className="font-display text-[var(--color-text-primary)] mb-6 whitespace-nowrap"
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 2.25rem)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.03em",
                  fontWeight: 300,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-primary) 50%, var(--color-accent) 100%)",
                  }}
                >
                  Making Neuroscience{" "}
                </span>
                <span className="text-[var(--color-text-primary)]">Accessible.</span>
              </motion.h1>
              <motion.p
                className="font-body text-[var(--color-text-muted)] text-base md:text-lg mb-10 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                A student journal at the University of Pennsylvania exploring the
                brain, mind, and the frontiers of neuroscience.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent)]/90 transition-all hover:scale-[1.02]"
                >
                  Explore Articles
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
