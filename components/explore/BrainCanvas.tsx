"use client";

import { Suspense, useRef } from "react";
import type { Group } from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Bounds } from "@react-three/drei";

const BRAIN_MODEL_URL = "/models/brain/scene.gltf";

useGLTF.preload(BRAIN_MODEL_URL);

function BrainModel() {
  const { scene } = useGLTF(BRAIN_MODEL_URL);
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} scale={0.6} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
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
  return (
    <div className={className}>
      <div
        className="relative w-full aspect-[16/10] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-accent)]/20 bg-[var(--color-surface)]"
      >
        <Suspense fallback={<BrainFallback />}>
          <Canvas
            className="!h-full !w-full"
            camera={{ position: [0, 0, 2.5], fov: 35 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
            fallback={<BrainFallback />}
            onCreated={({ gl }) => gl.setClearColor("#060318", 1)}
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.2}
              color="#00E5FF"
            />
            <directionalLight
              position={[-3, -2, 2]}
              intensity={0.6}
              color="#ffffff"
            />
            <Bounds fit clip observe margin={1.35}>
              <BrainModel />
            </Bounds>
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={1.5}
              maxDistance={6}
              autoRotate
              autoRotateSpeed={0.3}
            />
          </Canvas>
        </Suspense>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] text-[var(--color-text-muted)] px-2">
        <a href="https://sketchfab.com/Yash_Dandavate" target="_blank" rel="noreferrer" className="hover:text-[var(--color-accent)]">
          Human Brain — Yash_Dandavate
        </a>
        {" · "}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="hover:text-[var(--color-accent)]">
          CC BY 4.0
        </a>
      </p>
    </div>
  );
}
