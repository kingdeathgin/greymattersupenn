"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type PreloaderProps = {
  visible: boolean;
};

export function Preloader({ visible }: PreloaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col items-center justify-center bg-[var(--color-bg)] pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative flex flex-col items-center overflow-hidden">
            <motion.div
              className="relative shrink-0"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative">
                <Image
                  src="/main-image.png"
                  alt="Penn Grey Matters"
                  width={560}
                  height={344}
                  className="relative w-[448px] h-[275px] md:w-[560px] md:h-[344px] object-contain"
                  priority
                />
              </div>
            </motion.div>
            <motion.blockquote
              className="font-display text-base md:text-lg font-light italic text-[var(--color-text-muted)] max-w-md text-center mt-4 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              &ldquo;The brain is wider than the sky.&rdquo;
              <footer className="font-mono text-xs not-italic text-[var(--color-accent)]/70 mt-2 tracking-wider">
                — Emily Dickinson
              </footer>
            </motion.blockquote>
            <motion.p
              className="font-display text-2xl md:text-3xl font-light text-[var(--color-text-primary)] mt-6 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Penn Grey Matters
            </motion.p>
            <motion.p
              className="font-mono text-sm uppercase text-[var(--color-accent)] mt-2 shrink-0"
              style={{ letterSpacing: "0.2em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              Making Neuroscience Accessible
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
