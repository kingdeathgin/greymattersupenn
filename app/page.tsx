"use client";

import { Navigation } from "@/components/nav/Navigation";
import { HeroSection } from "@/components/hero/HeroSection";
import { IssueTwoPreview } from "@/components/articles/IssueTwoPreview";
import { ArticlesRow } from "@/components/articles/ArticlesRow";
import { PodcastFeature } from "@/components/PodcastFeature";
import { SocialFeature } from "@/components/SocialFeature";
import { CollaborationFeature } from "@/components/CollaborationFeature";
import { GameFeature } from "@/components/games/GameFeature";
import { BrainStatsSection } from "@/components/explore/BrainStatsSection";
import articles from "@/data/articles.json";
import { JoinSection } from "@/components/JoinSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="home-page">
        <HeroSection />
        <IssueTwoPreview />
        <ArticlesRow articles={articles} />
        <CollaborationFeature />
        <PodcastFeature />
        <SocialFeature />
        <GameFeature />
        <BrainStatsSection />
        <JoinSection />
        <Footer />
      </main>
    </>
  );
}
