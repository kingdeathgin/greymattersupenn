export type NeuronNode = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export type NeuronEdge = {
  from: number;
  to: number;
  dist: number;
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function generateNeuronNetwork(
  nodeCount: number,
  maxConnections = 3,
  connectionRadius = 0.2
): { nodes: NeuronNode[]; edges: NeuronEdge[] } {
  const nodes: NeuronNode[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = seededRandom(i * 3 + 1) * Math.PI * 2;
    const radius = 0.12 + seededRandom(i * 3 + 2) * 0.38;
    const jitterX = (seededRandom(i * 3 + 3) - 0.5) * 0.08;
    const jitterY = (seededRandom(i * 3 + 4) - 0.5) * 0.08;

    nodes.push({
      id: i,
      x: 0.5 + Math.cos(angle) * radius + jitterX,
      y: 0.5 + Math.sin(angle) * radius + jitterY,
      size: seededRandom(i * 7) > 0.75 ? 4 : seededRandom(i * 11) > 0.5 ? 3 : 2,
    });
  }

  const edgeSet = new Set<string>();
  const edges: NeuronEdge[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const neighbors: { j: number; dist: number }[] = [];

    for (let j = 0; j < nodeCount; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= connectionRadius) {
        neighbors.push({ j, dist });
      }
    }

    neighbors.sort((a, b) => a.dist - b.dist);

    for (const { j, dist } of neighbors.slice(0, maxConnections)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ from: i, to: j, dist });
    }
  }

  edges.sort((a, b) => a.dist - b.dist);

  return { nodes, edges };
}
