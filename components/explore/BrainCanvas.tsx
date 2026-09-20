"use client";

import { Suspense, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { BufferGeometry, Mesh } from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Bounds } from "@react-three/drei";

const BRAIN_MODEL_URL = "/models/brain/colored-brain-model.glb";

type PaintedRegion = { color: [number, number, number]; name: string };

// The supplied GLB has painted vertex colors but no anatomical region metadata.
// These names describe the approximate surface location of each painted area.
const paintedRegions: PaintedRegion[] = [
  { color: [253, 1, 1], name: "Upper frontal cortex · red" },
  { color: [0, 72, 0], name: "Middle frontal cortex · dark green" },
  { color: [1, 251, 1], name: "Frontal cortex · green" },
  { color: [2, 252, 83], name: "Lower frontal cortex · bright green" },
  { color: [182, 255, 157], name: "Lower frontal cortex · light green" },
  { color: [2, 252, 191], name: "Frontal–temporal border · turquoise" },
  { color: [0, 73, 252], name: "Precentral cortex · light blue" },
  { color: [0, 1, 252], name: "Postcentral cortex · dark blue" },
  { color: [66, 0, 158], name: "Upper parietal cortex · deep purple" },
  { color: [162, 19, 254], name: "Parietal cortex · purple" },
  { color: [178, 94, 255], name: "Lower parietal cortex · violet" },
  { color: [109, 94, 254], name: "Parietal–temporal border · lavender" },
  { color: [255, 55, 217], name: "Rear parietal cortex · magenta" },
  { color: [255, 148, 238], name: "Occipital cortex · pink" },
  { color: [251, 71, 1], name: "Upper temporal cortex · orange" },
  { color: [251, 129, 1], name: "Lower temporal cortex · amber" },
  { color: [255, 225, 157], name: "Lower temporal cortex · yellow" },
];

function getRegion(event: ThreeEvent<PointerEvent>): string {
  const mesh = event.object as Mesh<BufferGeometry>;
  if (mesh.name.includes("Tube")) return "Brainstem";
  if (mesh.name.includes("Cylinder") || mesh.name.includes("Quad Sphere 1")) return "Cerebellum";

  const colors = mesh.geometry.getAttribute("color");
  if (!colors || !event.face) return "Cerebral cortex";

  // Face vertices share a painted area except along its edge. Averaging keeps
  // the label stable when the pointer crosses triangles within one area.
  const { a, b, c } = event.face;
  const rgb = ["getX", "getY", "getZ"].map((axis) =>
    (colors[axis as "getX" | "getY" | "getZ"](a) +
      colors[axis as "getX" | "getY" | "getZ"](b) +
      colors[axis as "getX" | "getY" | "getZ"](c)) *
    85
  );
  // Peach is the unpainted base of the main cortex mesh.
  const baseDistance = Math.hypot(rgb[0] - 255, rgb[1] - 183, rgb[2] - 143);
  if (baseDistance < 34) return "Cerebral cortex";

  let closest = paintedRegions[0];
  let bestDistance = Infinity;
  for (const region of paintedRegions) {
    const distance = Math.hypot(
      rgb[0] - region.color[0],
      rgb[1] - region.color[1],
      rgb[2] - region.color[2]
    );
    if (distance < bestDistance) {
      closest = region;
      bestDistance = distance;
    }
  }
  return closest.name;
}

function BrainModel({ onRegionChange }: { onRegionChange: (name: string | null) => void }) {
  const { scene } = useGLTF(BRAIN_MODEL_URL);
  return (
    <primitive
      object={scene}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onRegionChange(getRegion(event));
      }}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onRegionChange(getRegion(event));
      }}
      onPointerOut={() => onRegionChange(null)}
    />
  );
}

function BrainFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)]/40 border-t-[var(--color-accent)] rounded-full animate-spin" />
    </div>
  );
}

type BrainCanvasProps = {
  className?: string;
};

export function BrainCanvas({ className = "" }: BrainCanvasProps) {
  const [region, setRegion] = useState<string | null>(null);

  return (
    <div className={className}>
      <div className="relative w-full aspect-[16/10] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
        <Suspense fallback={<BrainFallback />}>
          <Canvas
            className="!h-full !w-full"
            camera={{ position: [0, 0, 2.5], fov: 35 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 1.5]}
            fallback={<BrainFallback />}
            onCreated={({ gl }) => gl.setClearColor("#060318", 1)}
            onPointerMissed={() => setRegion(null)}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-3, -2, 2]} intensity={0.7} color="#ffffff" />
            <Bounds fit clip margin={1.35}>
              <BrainModel onRegionChange={setRegion} />
            </Bounds>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </Suspense>
        {region && (
          <div role="status" className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md bg-[#100d24]/95 px-3 py-2 text-center font-body text-sm text-white shadow-lg">
            {region}
          </div>
        )}
      </div>
      <p className="mt-3 text-center font-mono text-[10px] text-[var(--color-text-muted)] px-2">
        3D brain model by Miller Habib · Hover or tap a color for its approximate region
      </p>
    </div>
  );
}
