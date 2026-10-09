import type { Metadata } from "next";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { PodcastFeature } from "@/components/PodcastFeature";

export const metadata: Metadata = {
  title: "Grey Frequencies Podcast | Penn Grey Matters",
  description: "Our first interview is with Penn neuroscientist and bioengineer Konrad Kording, scheduled for November 9, 2026. Episode forthcoming.",
};
export default function PodcastPage() {
  return <><Navigation /><main className="podcast-page min-h-screen pt-[var(--main-top-offset)]"><PodcastFeature fullPage /></main><Footer /></>;
}
