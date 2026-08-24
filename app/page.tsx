"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/nav/Navigation";
import { Preloader } from "@/components/Preloader";
import { HeroSection } from "@/components/hero/HeroSection";
import { ArticlesRow } from "@/components/articles/ArticlesRow";
import { SocialFeature } from "@/components/SocialFeature";
import { NeuronNetworkSection } from "@/components/neuron-network/NeuronNetworkSection";
import { BrainStatsSection } from "@/components/explore/BrainStatsSection";
import articles from "@/data/articles.json";
import { JoinSection } from "@/components/JoinSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [heroExpanded, setHeroExpanded] = useState(false);

  useEffect(() => {
    // Start transition at 2.2s: fade preloader, expand hero
    const transitionTimer = setTimeout(() => {
      setPreloaderVisible(false);
      setHeroExpanded(true);
    }, 2200);
    return () => clearTimeout(transitionTimer);
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <HeroSection expanded={heroExpanded} />
        <Preloader visible={preloaderVisible} />
        <NeuronNetworkSection />
        <ArticlesRow articles={articles} />
        <SocialFeature />
        <BrainStatsSection />
        <JoinSection />
        <Footer />
      </main>
    </>
  );
}
