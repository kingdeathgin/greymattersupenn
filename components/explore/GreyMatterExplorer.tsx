import { BrainCanvas } from "./BrainCanvas";
import { BrainRegionsPanel } from "./BrainRegionsPanel";

export function GreyMatterExplorer() {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      <BrainCanvas />
      <BrainRegionsPanel />
    </div>
  );
}
