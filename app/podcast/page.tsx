import type { Metadata } from "next";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { PodcastFeature } from "@/components/PodcastFeature";

export const metadata: Metadata = {
  title: "Brains Click Podcast | Penn Grey Matters",
  description: "Our podcast with Dr. Kacy Cullen was recorded October 30, 2026 and comes out in mid-November. Konrad Kording is up next.",
};
export default function PodcastPage() {
  return <><Navigation /><main id="main-content" tabIndex={-1} className="podcast-page min-h-screen pt-[var(--main-top-offset)]"><PodcastFeature fullPage /></main><Footer /></>;
}
