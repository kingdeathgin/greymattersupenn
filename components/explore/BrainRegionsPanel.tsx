"use client";

import { useState } from "react";
import brainRegions from "@/data/brain-regions.json";

type BrainRegion = (typeof brainRegions)[number];

export function BrainRegionsPanel() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-wider text-[var(--color-accent)]">
        Brain Regions
      </h2>
      <div className="space-y-3">
        {brainRegions.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => setSelectedRegion(region)}
            className={`w-full text-left p-4 rounded-[var(--radius-md)] border transition-colors ${
              selectedRegion?.id === region.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                : "border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40"
            }`}
          >
            <span className="font-display text-lg text-[var(--color-text-primary)]">
              {region.displayName}
            </span>
          </button>
        ))}
      </div>

      {selectedRegion && (
        <div className="p-6 rounded-[var(--radius-md)] border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
          <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-4">
            {selectedRegion.displayName}
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-mono text-xs uppercase text-[var(--color-accent)] mb-2">
                Functions
              </h4>
              <ul className="text-[var(--color-text-muted)] text-sm">
                {selectedRegion.functions.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase text-[var(--color-accent)] mb-2">
                Did you know?
              </h4>
              <p className="text-[var(--color-text-primary)] italic">
                {selectedRegion.fact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
