export const SIGNALS = [
  { name: "Pulse", glyph: "●", color: "#8ee8ef" },
  { name: "Wave", glyph: "≈", color: "#c3a0ff" },
  { name: "Spark", glyph: "✦", color: "#f4d35e" },
  { name: "Loop", glyph: "◎", color: "#ffab9d" },
  { name: "Branch", glyph: "Y", color: "#a3deb6" },
  { name: "Cross", glyph: "+", color: "#c9cbff" },
  { name: "Delta", glyph: "△", color: "#ffbdec" },
  { name: "Square", glyph: "□", color: "#a9caff" },
];
export const CODE_LENGTH = 5;
export const MAX_GUESSES = 6;
export type Puzzle = { day: string; before: [number, number]; either: [number, number] };
export type Guess = { signals: number[]; exact: number; misplaced: number };
export type Round = { runId: string; guesses: Guess[]; won: boolean; finished: boolean; score: number | null; elapsedMs: number | null };
export type Leader = { nickname: string; points: number; days: number; elapsed_ms: number };
export type Result = { score: number; moves: number; elapsedMs: number };
export function easternDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function weekStart(day: string) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
}
function randomFor(seed: string) {
  let s = 2166136261;
  for (const c of seed) s = Math.imul(s ^ c.charCodeAt(0), 16777619);
  return () => { s += 0x6d2b79f5; let t = Math.imul(s ^ s >>> 15, 1 | s); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function generatePuzzle(day: string, seed: string): { puzzle: Puzzle; answer: number[] } {
  const random = randomFor(`${seed}:${day}`);
  const choices = SIGNALS.map((_, i) => i);
  for (let i = choices.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [choices[i], choices[j]] = [choices[j], choices[i]]; }
  const answer = choices.slice(0, CODE_LENGTH);
  const first = Math.floor(random() * 4), second = first + 1 + Math.floor(random() * (4 - first));
  const otherSignals = answer.filter((_, i) => i !== first && i !== second);
  const pair: [number, number] = [otherSignals[Math.floor(random() * otherSignals.length)], choices[5 + Math.floor(random() * 3)]];
  if (random() < .5) pair.reverse();
  return { puzzle: { day, before: [answer[first], answer[second]], either: pair }, answer };
}
export function validGuess(value: unknown): value is number[] {
  return Array.isArray(value) && value.length === CODE_LENGTH && value.every(n => Number.isInteger(n) && n >= 0 && n < SIGNALS.length) && new Set(value).size === CODE_LENGTH;
}
export function feedback(answer: number[], signals: number[]): Guess {
  const exact = signals.filter((s, i) => answer[i] === s).length;
  return { signals, exact, misplaced: signals.filter(s => answer.includes(s)).length - exact };
}
export function matchesClues(puzzle: Puzzle, signals: number[]) {
  const [a,b] = puzzle.before, [x,y] = puzzle.either;
  return signals.includes(a) && signals.indexOf(b) > signals.indexOf(a) && Number(signals.includes(x)) + Number(signals.includes(y)) === 1;
}
export function scoreFor(guesses: number) { return 1000 - (guesses - 1) * 120; }
export function validNickname(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9 _.-]{1,19}$/.test(value.trim());
}
export const takeaways = [
  { title: "Neurons need a delivery network, too.", text: "Mitochondria travel through neurons to supply energy where it is needed, including at synapses. Disrupted transport can contribute to neurodegenerative disease.", slug: "altered-mitochondrial-trafficking", article: "Altered Mitochondrial Trafficking" },
  { title: "Experience changes how we read emotion.", text: "Aging can change the way people recognize facial expressions. Lived experience and real-world context can also support emotional understanding.", slug: "feeling-our-age", article: "Feeling Our Age" },
  { title: "Our sense of time has many moving parts.", text: "Attention, memory, and dopamine-dependent timing circuits all help shape our experience of time. Novel experiences can make remembered time feel richer.", slug: "the-accelerating-clock", article: "The Accelerating Clock" },
];
export function dailyTakeaway(day: string) {
  return takeaways[Math.floor(randomFor(`fact:${day}`)() * takeaways.length)];
}
