"use client";

import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { GreyMatterExplorer } from "@/components/explore/GreyMatterExplorer";

export default function ExplorePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Grey Matter
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12 max-w-2xl">
              An interactive brain explorer. Click on a region to learn about its functions, related conditions, and surprising facts.
            </p>

            <GreyMatterExplorer />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
