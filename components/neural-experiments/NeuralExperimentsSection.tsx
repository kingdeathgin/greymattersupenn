"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type SceneProps = {
  progress: MotionValue<number>;
  start: number;
  end: number;
  label: string;
  title: string;
  children: React.ReactNode;
};

const CONTINENTS = [
  {
    id: "north-america",
    color: "#22d3ee",
    paths: ["M20 24L30 16L44 17L58 24L61 33L54 39L46 37L40 44L30 42L27 35L20 32Z"],
    nodes: [[22, 27], [30, 24], [37, 18], [45, 21], [54, 24], [31, 33], [42, 32], [52, 34]],
  },
  {
    id: "south-america",
    color: "#a78bfa",
    paths: ["M57 48L68 50L75 59L73 70L68 83L62 79L60 67L54 59Z"],
    nodes: [[63, 55], [69, 57], [65, 63], [69, 69], [66, 78]],
  },
  {
    id: "europe",
    color: "#f4d35e",
    paths: ["M91 25L101 21L113 24L116 31L109 35L99 33L94 36L89 31Z"],
    nodes: [[96, 27], [102, 24], [109, 27], [102, 30], [109, 37]],
  },
  {
    id: "africa",
    color: "#fb7185",
    paths: ["M96 39L111 37L120 47L117 64L108 76L99 65L94 50Z"],
    nodes: [[101, 45], [110, 44], [115, 50], [106, 53], [111, 60], [107, 68]],
  },
  {
    id: "asia",
    color: "#38bdf8",
    paths: ["M119 25L138 18L165 23L181 33L174 48L160 53L148 47L137 51L127 44L119 36Z"],
    nodes: [[124, 28], [134, 24], [144, 24], [154, 23], [164, 27], [174, 32], [132, 35], [143, 39], [156, 38], [168, 40], [148, 56]],
  },
  {
    id: "australia",
    color: "#2dd4bf",
    paths: ["M160 66L177 64L185 72L178 80L164 78L157 72Z"],
    nodes: [[165, 72], [172, 69], [178, 73], [174, 77]],
  },
] as const;

type Point = readonly [number, number];
type SynapseConnection = readonly [Point, Point];

const SYNAPSE_CENTER: Point = [100, 50];
const SYNAPSE_INNER: Point[] = Array.from({ length: 10 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
  return [100 + Math.cos(angle) * 15, 50 + Math.sin(angle) * 15];
});
const SYNAPSE_OUTER: Point[] = Array.from({ length: 20 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 20 - Math.PI / 2 + (i % 2 ? 0.04 : -0.04);
  return [100 + Math.cos(angle) * 38, 50 + Math.sin(angle) * 38];
});
const SYNAPSE_CONNECTIONS: SynapseConnection[] = [
  ...SYNAPSE_INNER.map((point) => [SYNAPSE_CENTER, point] as const),
  ...SYNAPSE_OUTER.map((point, i) => [SYNAPSE_INNER[Math.floor(i / 2)], point] as const),
];
const SYNAPSE_NODES = [SYNAPSE_CENTER, ...SYNAPSE_INNER, ...SYNAPSE_OUTER];

function Scene({ progress, start, end, label, title, children }: SceneProps) {
  const opacity = useTransform(progress, [start, start + 0.035, end - 0.035, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.06, end - 0.06, end], [20, 0, 0, -20]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {children}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        style={{ y }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
          {label}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl leading-tight font-light text-[var(--color-text-primary)] max-w-[20rem] sm:max-w-xl md:max-w-2xl text-balance">
          {title}
        </h2>
      </motion.div>
    </motion.div>
  );
}

function NeonWorldMap() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <filter id="world-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {CONTINENTS.map((continent) => (
        <g key={continent.id} filter="url(#world-glow)">
          {continent.paths.map((path) => (
            <path
              key={path}
              d={path}
              fill={continent.color}
              fillOpacity="0.08"
              stroke={continent.color}
              strokeOpacity="0.55"
              strokeWidth="0.45"
            />
          ))}
          {continent.nodes.map(([cx, cy], index) => (
            <motion.circle
              key={`${continent.id}-${index}`}
              cx={cx}
              cy={cy}
              fill={continent.color}
              animate={{
                opacity: [0.25, 1, 0.25],
                r: [0.55, index % 3 === 0 ? 1.45 : 1.05, 0.55],
              }}
              transition={{
                duration: 2.4 + (index % 3) * 0.45,
                delay: index * 0.22 + CONTINENTS.findIndex((item) => item.id === continent.id) * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function SynapseConnectionLine({
  connection,
  index,
  progress,
}: {
  connection: SynapseConnection;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.69 + index * 0.006;
  const pathLength = useTransform(progress, [start, start + 0.12], [0, 1]);
  const opacity = useTransform(progress, [start, start + 0.05], [0, 0.95]);
  const [[x1, y1], [x2, y2]] = connection;

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={index % 5 === 0 ? "#f87171" : "var(--color-accent)"}
      strokeWidth={index < 10 ? 0.4 : 0.24}
      filter="url(#signal-glow)"
      style={{ pathLength, opacity }}
    />
  );
}

function SynapseNode({ node, index, progress }: { node: Point; index: number; progress: MotionValue<number> }) {
  const start = 0.7 + index * 0.005;
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.06], [0, 1]);
  const [cx, cy] = node;
  const isHub = index === 0;
  const isTerminal = index > 10 && index % 4 === 0;

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={isHub ? 1.45 : isTerminal ? 0.9 : 0.58}
      fill={isTerminal ? "#f87171" : "var(--color-accent)"}
      filter="url(#signal-glow)"
      style={{ opacity, scale }}
      animate={{ opacity: [0.45, 1, 0.45], scale: [1, isHub ? 1.9 : 1.5, 1] }}
      transition={{ duration: isHub ? 1.1 : 1.6 + (index % 3) * 0.2, delay: index * 0.1, repeat: Infinity }}
    />
  );
}

function SignalWave({ progress }: { progress: MotionValue<number> }) {

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="signal-glow" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="0.65" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {SYNAPSE_CONNECTIONS.map(([[x1, y1], [x2, y2]], i) => (
        <line key={`glow-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-accent)" strokeWidth={i < 10 ? 1.35 : 0.9} opacity="0.16" filter="url(#signal-glow)" />
      ))}
      {SYNAPSE_CONNECTIONS.map((connection, i) => (
        <SynapseConnectionLine key={`connection-${i}`} connection={connection} index={i} progress={progress} />
      ))}
      {SYNAPSE_NODES.map((node, i) => (
        <SynapseNode key={`node-${i}`} node={node} index={i} progress={progress} />
      ))}
    </svg>
  );
}

export function NeuralExperimentsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [visualReady, setVisualReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    setVisualReady(true);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[340vh] bg-[var(--color-bg)]"
      aria-label="Neuroscience interaction concepts"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 229, 255, 0.09), transparent 72%)",
          }}
        />

        {visualReady && <Scene progress={scrollYProgress} start={0} end={0.58} label="Curiosity in motion" title="Making neuroscience accessible, one question at a time.">
          <NeonWorldMap />
        </Scene>}

        {visualReady && <Scene progress={scrollYProgress} start={0.68} end={1} label="Knowledge in connection" title="Every discovery begins with a shared spark.">
          <SignalWave progress={scrollYProgress} />
        </Scene>}
      </div>
    </section>
  );
}
