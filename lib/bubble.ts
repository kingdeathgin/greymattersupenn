export type Point = { x: number; y: number };
export type Mark =
  | { kind: "stroke"; points: Point[]; color: string; width: number }
  | { kind: "text"; point: Point; text: string; color: string }
  | { kind: "sticker"; point: Point; emoji: string; name: string; size: number };

export const STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"] as const;
export const THEMES = ["Language", "Family & friends", "Neighborhood", "School & institutions", "Race & belonging", "Money & access", "Media", "Migration & travel", "Food & traditions", "Faith & religion", "Music & arts"] as const;
export type Theme = typeof THEMES[number];
export type Submission = { id: string; name: string; city: string; state: string; themes: Theme[]; marks: Mark[]; submittedAt: string };

export function themeStats(submissions: Pick<Submission, "themes">[]) {
  const tagged = submissions.filter((submission) => submission.themes.length > 0);
  return THEMES.map((theme) => {
    const count = tagged.filter((submission) => submission.themes.includes(theme)).length;
    return { theme, count, percent: tagged.length ? Math.round(count / tagged.length * 100) : 0 };
  }).sort((a, b) => b.count - a.count || a.theme.localeCompare(b.theme));
}

export function validThemes(value: unknown): value is Theme[] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 3 && new Set(value).size === value.length && value.every((item) => THEMES.includes(item));
}

// Compare explicitly selected themes, never infer identity from drawings or location.
export function themeSimilarity(a: readonly string[], b: readonly string[]): number | null {
  if (!a.length || !b.length) return null;
  const left = new Set(a);
  const right = new Set(b);
  const shared = [...left].filter((theme) => right.has(theme)).length;
  return shared / new Set([...left, ...right]).size;
}

export function stateSimilarities(submissions: Submission[], reference: Submission | undefined) {
  const result = new Map<string, { score: number; count: number }>();
  if (!reference) return result;
  for (const drawing of submissions) {
    if (drawing.id === reference.id) continue;
    const score = themeSimilarity(reference.themes, drawing.themes);
    if (score === null) continue;
    const previous = result.get(drawing.state);
    const count = (previous?.count ?? 0) + 1;
    result.set(drawing.state, { score: ((previous?.score ?? 0) * (previous?.count ?? 0) + score) / count, count });
  }
  return result;
}

export function similarityColor(score: number | undefined) {
  if (score === undefined) return "#f0f0eb";
  const start = [254, 232, 200];
  const end = [37, 112, 101];
  return `rgb(${start.map((value, index) => Math.round(value + (end[index] - value) * Math.max(0, Math.min(1, score)))).join(", ")})`;
}

// Only structured drawing data is stored; SVG/HTML is never accepted from clients.
export function validDrawing(value: unknown): value is Mark[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 2000) return false;
  const number = (n: unknown, min: number, max: number) => typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;
  const point = (p: unknown): boolean => !!p && typeof p === "object" && "x" in p && "y" in p && number(p.x, -2000, 3200) && number(p.y, -2000, 2720);
  const text = (s: unknown, max: number) => typeof s === "string" && s.trim().length > 0 && s.length <= max;
  const color = (s: unknown) => typeof s === "string" && /^#[a-f\d]{6}$/i.test(s);
  let points = 0;
  let visible = false;
  for (const mark of value) {
    if (!mark || typeof mark !== "object") return false;
    if (mark.kind === "stroke") {
      if (!Array.isArray(mark.points) || !mark.points.length || !mark.points.every(point) || !color(mark.color) || !number(mark.width, 1, 40)) return false;
      points += mark.points.length;
      if (points > 40000) return false;
      if (mark.color.toLowerCase() !== "#ffffff") visible = true;
    } else if (mark.kind === "text") {
      if (!point(mark.point) || !text(mark.text, 100) || !color(mark.color)) return false;
      if (mark.color.toLowerCase() !== "#ffffff") visible = true;
    } else if (mark.kind === "sticker") {
      if (!point(mark.point) || !text(mark.emoji, 32) || !text(mark.name, 40) || !number(mark.size, 32, 240)) return false;
      visible = true;
    } else return false;
  }
  return visible;
}
