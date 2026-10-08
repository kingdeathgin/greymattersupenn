import type { Metadata } from "next";
import { BubbleCanvas } from "./BubbleCanvas";
import { currentSubmission } from "@/lib/bubble-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draw Your Bubble",
  description: "Explore the surroundings that shape what feels normal to you.",
  openGraph: {
    title: "Draw Your Bubble",
    description: "Explore the surroundings that shape what feels normal to you.",
  },
  twitter: { card: "summary", title: "Draw Your Bubble" },
};

export default async function BubblePage() {
  const submission = await currentSubmission().catch(() => null);
  return (
    <main className="min-h-screen bg-[#f6f2e9] px-4 py-8 text-[#243b36] sm:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest">5-minute activity</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Draw your bubble.</h1>
          <p>Your bubble is what makes your everyday experience feel normal.</p>
        </header>
        <ol className="grid list-inside list-decimal gap-3 rounded-2xl bg-white/70 p-5 sm:grid-cols-3">
          <li><strong>Inside:</strong> What surroundings shape what feels normal to you?<p className="mt-2 text-sm">Rivera: Alex feels he blends in in Miami and treats race as unimportant. Draw the surroundings that make that assumption feel normal.</p></li>
          <li><strong>Boundary:</strong> What maintains your bubble?<p className="mt-2 text-sm">Cheng: familiar Asian and Latino neighborhoods influence where residents live and send their children to school. Add those ties along the edge.</p></li>
          <li><strong>Outside:</strong> What experience could challenge an assumption inside it?<p className="mt-2 text-sm">Ramos: a classmate questions Leyanis’s Cuban identity because she is Black. Her exclusion challenges the idea that everyone belongs equally in Miami.</p></li>
        </ol>
        <BubbleCanvas key={submission?.id ?? "new"} initialSubmission={submission} />
        <p className="text-lg font-bold">Discuss: Whose experience challenges what feels normal inside your bubble?</p>
      </div>
    </main>
  );
}
