import Image from "next/image";

const ARTICLE_URL = "https://medium.com/@nusmedtech.official/brain-computer-interfaces-in-modern-medicine-18679bf123a9";

export function CollaborationFeature() {
  return (
    <section id="collaboration" aria-labelledby="collaboration-title" className="collaboration-feature relative isolate overflow-hidden border-y border-white/10 px-4 py-12 text-[#f5f5f5] md:px-8 md:py-16">
      <div className="pointer-events-none absolute -right-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-violet-500/10 blur-[100px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[var(--wide-max)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-3 text-[#f4d35e]"><span className="size-2 rounded-full bg-[#f4d35e]" aria-hidden="true" />A collaboration</span>
          <span className="text-[#aab6ce]">Philadelphia <span aria-hidden="true" className="mx-2 text-[#00e5ff]">↔</span> Singapore</span>
        </div>

        <div className="grid items-center gap-9 pt-9 md:gap-14 lg:grid-cols-[1fr_1.1fr]">
          <figure className="min-w-0">
            <a href={ARTICLE_URL} target="_blank" rel="noopener noreferrer" aria-label="Read Brain-Computer Interfaces in Modern Medicine on Medium" className="group block overflow-hidden rounded-sm border border-[#f4d35e]/25 bg-[#eee7da] p-3 shadow-2xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1 md:-rotate-1 md:p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d35e]">
              <Image src="/images/articles/bci-collaboration-original.png" alt="Aarna Mishra’s original illustration: a person wearing a brain-computer interface, with a neural network, robotic hand, and robotic legs" width={1536} height={1095} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full mix-blend-multiply" />
            </a>
            <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#8898b6]">Original article artwork · Aarna Mishra</figcaption>
          </figure>

          <article className="min-w-0">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#b9c6dc]">Penn Grey Matters <span className="mx-1 text-[#f4d35e]">×</span> NUS Medtech</p>
            <h2 id="collaboration-title" className="mt-5 max-w-2xl font-editorial tracking-tight">Brain-Computer Interfaces in <em className="font-normal text-[#8ee8ef]">Modern Medicine</em></h2>
            <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-[#b9c6dc] md:text-lg">How can brain activity help someone move a hand, use a computer, or communicate? Our collaboration with NUS Medtech explores brain–computer interfaces, their medical applications, and the algorithms that make them possible.</p>
            <div className="mt-6 border-l-2 border-[#f4d35e]/50 pl-4 text-sm leading-relaxed text-[#aab6ce]">
              <p>Written by <span className="text-[#e5eaf4]">Mubina Shahnaz &amp; Elgin Tawiah</span></p>
              <p className="collaboration-credit">Illustrated by Aarna Mishra · Edited by Jeffrey Bartes</p>
            </div>
            <a href={ARTICLE_URL} target="_blank" rel="noopener noreferrer" className="group mt-7 inline-flex items-center gap-5 rounded-full bg-[#f4d35e] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#020510] transition-colors hover:bg-[#ffe68c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d35e]">Read the article <span aria-hidden="true" className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span></a>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#8898b6]">On Medium · September 18, 2026 · 9 min read</p>
          </article>
        </div>
      </div>
    </section>
  );
}
