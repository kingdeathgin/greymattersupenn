export const SIZE = 6;
export type MindMap = { seed: string; walls: number[]; thoughts: number[]; start: number; exit: number; optimal: number };
export type Walk = { position: number; collected: number[]; visited: number[]; revealedWalls: number[]; moves: number; bumps: number; peeks: number; finished: boolean };
export function neighbors(cell: number) {
  const row = Math.floor(cell / SIZE), col = cell % SIZE;
  return [row > 0 ? cell - SIZE : -1, col < SIZE - 1 ? cell + 1 : -1, row < SIZE - 1 ? cell + SIZE : -1, col > 0 ? cell - 1 : -1].filter(n => n >= 0);
}
export function pathBetween(walls: readonly number[], from: number, to: number): number[] {
  const queue = [from], previous = new Map<number, number>([[from, -1]]), blocked = new Set(walls);
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i];
    if (cell === to) { const path = [cell]; let n = cell; while (previous.get(n) !== -1) { n = previous.get(n)!; path.unshift(n); } return path; }
    for (const next of neighbors(cell)) if (!blocked.has(next) && !previous.has(next)) { previous.set(next, cell); queue.push(next); }
  }
  return [];
}
export function bestRoute(map: Pick<MindMap, "walls" | "thoughts" | "start" | "exit">): number[] {
  let best: number[] = [];
  const [a, b, c] = map.thoughts;
  for (const order of [[a,b,c],[a,c,b],[b,a,c],[b,c,a],[c,a,b],[c,b,a]]) {
    let route = [map.start];
    for (const next of [...order, map.exit]) {
      const segment = pathBetween(map.walls, route.at(-1)!, next);
      if (!segment.length) { route = []; break; }
      route.push(...segment.slice(1));
    }
    if (route.length && (!best.length || route.length < best.length)) best = route;
  }
  return best;
}
function rng(seed: string) {
  let s = 2166136261;
  for (const c of seed) s = Math.imul(s ^ c.charCodeAt(0), 16777619);
  return () => { s += 0x6d2b79f5; let t = Math.imul(s ^ s >>> 15, 1 | s); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function makeMap(seed: string): MindMap {
  const random = rng(`mindwalk-v1:${seed}`);
  const shuffle = (values: number[]) => { for (let i=values.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [values[i],values[j]]=[values[j],values[i]]; } return values; };
  let result: MindMap | undefined;
  for (let attempt = 0; attempt < 100; attempt++) {
    const walls: number[] = [];
    for (const candidate of shuffle(Array.from({length:34},(_,i)=>i+1))) {
      const next = [...walls,candidate];
      // Every open cell stays reachable, including the exit.
      if (Array.from({length:36},(_,i)=>i).filter(i=>!next.includes(i)).every(i=>pathBetween(next,0,i).length)) walls.push(candidate);
      if (walls.length===12) break;
    }
    const open = shuffle(Array.from({length:34},(_,i)=>i+1).filter(i=>!walls.includes(i)));
    const thoughts: number[] = [];
    for (const cell of open) {
      if (pathBetween(walls,0,cell).length>=5 && thoughts.every(t=>pathBetween(walls,t,cell).length>=4)) thoughts.push(cell);
      if (thoughts.length===3) break;
    }
    if (thoughts.length!==3) continue;
    result = {seed,walls,thoughts,start:0,exit:35,optimal:0};
    result.optimal=bestRoute(result).length-1;
    if (result.optimal>=20 && result.optimal<=32) return result;
  }
  if (!result) throw new Error("Could not create a connected map.");
  return result;
}
export function newWalk(map: MindMap): Walk {
  return {position:map.start,collected:[],visited:[map.start],revealedWalls:[],moves:0,bumps:0,peeks:0,finished:false};
}
export function move(map: MindMap, walk: Walk, cell: number): Walk {
  if (walk.finished || !neighbors(walk.position).includes(cell)) return walk;
  if (map.walls.includes(cell)) return {...walk,bumps:walk.bumps+1,revealedWalls:[...new Set([...walk.revealedWalls,cell])]};
  const collected = map.thoughts.includes(cell) ? [...new Set([...walk.collected,cell])] : walk.collected;
  return {...walk,position:cell,collected,visited:[...new Set([...walk.visited,cell])],moves:walk.moves+1,finished:cell===map.exit && collected.length===3};
}
export function points(map: MindMap, walk: Walk) { return Math.max(100,1000-Math.max(0,walk.moves-map.optimal)*20-walk.bumps*50-walk.peeks*100); }
export function validWalk(value: unknown, map: MindMap): value is Walk {
  if (!value || typeof value!=="object") return false;
  const w=value as Walk;
  const cells=(v: unknown): v is number[]=>Array.isArray(v)&&v.every(n=>Number.isInteger(n)&&n>=0&&n<36)&&new Set(v).size===v.length;
  return Number.isInteger(w.position)&&w.position>=0&&w.position<36&&!map.walls.includes(w.position)&&cells(w.collected)&&w.collected.every(n=>map.thoughts.includes(n))&&cells(w.visited)&&w.visited.every(n=>!map.walls.includes(n))&&w.visited.includes(w.position)&&cells(w.revealedWalls)&&w.revealedWalls.every(n=>map.walls.includes(n))&&[w.moves,w.bumps,w.peeks].every(n=>Number.isInteger(n)&&n>=0)&&typeof w.finished==="boolean"&&(!w.finished||(w.position===map.exit&&w.collected.length===3));
}
