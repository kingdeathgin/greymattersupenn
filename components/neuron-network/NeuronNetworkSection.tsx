"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { generateNeuronNetwork } from "./generateNetwork";
import type { NeuronNode } from "./generateNetwork";

const NODE_COUNT = 400;

function NetworkEdge({
  from,
  to,
  scrollYProgress,
  edgeStart,
  edgeEnd,
}: {
  from: NeuronNode;
  to: NeuronNode;
  scrollYProgress: MotionValue<number>;
  edgeStart: number;
  edgeEnd: number;
}) {
  const pathLength = useTransform(scrollYProgress, [edgeStart, edgeEnd], [0, 1]);
  const opacity = useTransform(scrollYProgress, [edgeStart, edgeEnd], [0, 0.6]);

  return (
    <motion.line
      x1={from.x * 100}
      y1={from.y * 100}
      x2={to.x * 100}
      y2={to.y * 100}
      stroke="var(--color-accent)"
      strokeWidth={0.12}
      style={{ pathLength, opacity }}
    />
  );
}

function NetworkNode({
  node,
  scrollYProgress,
  nodeStart,
  nodeEnd,
}: {
  node: NeuronNode;
  scrollYProgress: MotionValue<number>;
  nodeStart: number;
  nodeEnd: number;
}) {
  const opacity = useTransform(scrollYProgress, [nodeStart, nodeEnd], [0, 1]);
  const scale = useTransform(scrollYProgress, [nodeStart, nodeEnd], [0, 1]);

  return (
    <motion.g style={{ opacity }}>
      <motion.circle
        cx={node.x * 100}
        cy={node.y * 100}
        r={node.size * 0.2}
        fill="url(#neuron-glow)"
        style={{ scale }}
      />
      <motion.circle
        cx={node.x * 100}
        cy={node.y * 100}
        r={node.size * 0.12}
        fill="var(--color-accent)"
        fillOpacity={0.75}
        style={{ scale }}
      />
    </motion.g>
  );
}

export function NeuronNetworkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [visualReady, setVisualReady] = useState(false);

  const { nodes, edges } = useMemo(
    () => generateNeuronNetwork(NODE_COUNT),
    []
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const animationProgress = useTransform(scrollYProgress, [0, 0.75], [0, 1]);
  const networkOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.65, 0.82, 1],
    [0, 1, 1, 0]
  );
  const headlineY = useTransform(scrollYProgress, [0.45, 0.65], [24, 0]);

  useEffect(() => {
    setVisualReady(true);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] bg-[var(--color-bg)]"
      aria-label="Neural network visualization"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(155, 93, 229, 0.06) 0%, transparent 70%)",
          }}
        />

        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          style={{ opacity: networkOpacity }}
        >
          <defs>
            <radialGradient id="neuron-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {visualReady && edges.map((edge, i) => {
            const edgeStart = i / edges.length;
            const edgeEnd = Math.min(1, edgeStart + 0.015);

            return (
              <NetworkEdge
                key={`${edge.from}-${edge.to}`}
                from={nodes[edge.from]}
                to={nodes[edge.to]}
                scrollYProgress={animationProgress}
                edgeStart={edgeStart}
                edgeEnd={edgeEnd}
              />
            );
          })}

          {visualReady && nodes.map((node, i) => {
            const nodeStart = (i / nodes.length) * 0.85;
            const nodeEnd = Math.min(1, nodeStart + 0.02);

            return (
              <NetworkNode
                key={node.id}
                node={node}
                scrollYProgress={animationProgress}
                nodeStart={nodeStart}
                nodeEnd={nodeEnd}
              />
            );
          })}
        </motion.svg>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            The Network
          </p>
          <h2
            className="font-display text-[var(--color-text-primary)] max-w-2xl"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1.15,
            }}
          >
            Billions of connections.
            <br />
            <span className="text-[var(--color-accent-violet)]">
              One curious mind at a time.
            </span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
