"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import shapes from "@/data/bubble-us-map.json";
import { similarityColor, stateSimilarities, themeSimilarity, themeStats, type Submission } from "@/lib/bubble";
import { DrawingPreview } from "../DrawingPreview";
import { clearMap } from "./actions";

export function BubbleMap({ submissions }: { submissions: Submission[] }) {
  const [state, setState] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [referenceId, setReferenceId] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState("");
  const [clearError, setClearError] = useState("");
  const stats = themeStats(submissions);
  const taggedCount = submissions.filter((drawing) => drawing.themes.length).length;
  const reference = submissions.find((drawing) => drawing.id === referenceId)
    ?? submissions.find((drawing) => drawing.name.toLowerCase() === "elgin" && drawing.themes.length)
    ?? submissions.find((drawing) => drawing.themes.length);
  const scores = stateSimilarities(submissions, reference);
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [pending, refresh] = useTransition();
  const groups = new Map<string, Submission[]>();
  for (const drawing of submissions) groups.set(drawing.state, [...(groups.get(drawing.state) ?? []), drawing]);
  const drawings = state ? groups.get(state) ?? [] : submissions;
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  useEffect(() => {
    const timer = setInterval(() => { if (document.visibilityState === "visible") refresh(() => router.refresh()); }, 15000);
    return () => clearInterval(timer);
  }, [router]);

  return <>
    <header className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-4xl font-bold">Our bubbles, across the US.</h1><button disabled={pending} onClick={() => refresh(() => router.refresh())} className="rounded-lg border border-[#698876] px-4 py-2 disabled:opacity-50">{pending ? "Refreshing…" : "Refresh drawings"}</button></div>
      <p>{submissions.length} submitted drawing{submissions.length === 1 ? "" : "s"} · {groups.size} home state{groups.size === 1 ? "" : "s"}. Updates every 15 seconds.</p>
      <p>Click a drawing to expand it. Choose a state to see everyone from there.</p>
    </header>
    <section aria-label="Bubble theme similarity" className="space-y-3 rounded-2xl border border-[#c7d2c8] bg-white p-5">
      <label className="flex flex-wrap items-center gap-3 font-bold">Compare themes with
        <select value={reference?.id ?? ""} onChange={(event) => setReferenceId(event.target.value)} className="max-w-full rounded-lg border border-[#c7d2c8] bg-white p-2 font-normal" disabled={!reference}>
          {!reference && <option value="">Waiting for drawings with themes</option>}
          {submissions.filter((drawing) => drawing.themes.length).map((drawing) => <option key={drawing.id} value={drawing.id}>{drawing.name} — {[drawing.city, drawing.state].filter(Boolean).join(", ")}</option>)}
        </select>
      </label>
      {reference && <p className="text-sm">{reference.name}’s themes: {reference.themes.join(" · ")}</p>}
      <p className="text-sm">Darker green means more shared themes with {reference?.name ?? "the selected student"}. Each state shows the average for its other submitted drawings.</p>
      <div className="flex flex-wrap items-center gap-3 text-xs"><span>0% overlap</span><span aria-hidden="true" className="h-4 w-40 rounded" style={{ background: `linear-gradient(to right, ${similarityColor(0)}, ${similarityColor(1)})` }} /><span>100% overlap</span><span className="ml-2 inline-block h-4 w-4 border border-[#8a9e91]" style={{ background: similarityColor(undefined) }} /><span>No comparable drawings</span></div>
      <details className="text-sm"><summary className="cursor-pointer underline">How the comparison works</summary><p className="mt-2">Shared themes ÷ all distinct themes selected by the two students. Two shared themes out of three total = 67%. The selected student is excluded from their own state’s average. Drawings without themes are unscored. This compares chosen topics, not how alike people or their experiences are. Distance does not affect the score; markers remain grouped by state, with cities listed on drawings.</p></details>
    </section>
    <div className="overflow-x-auto rounded-2xl border border-[#c7d2c8] bg-[#e7eff0]">
      <div className="relative min-w-[760px]" style={{ aspectRatio: "960 / 620" }}>
        <svg viewBox="0 0 960 620" className="absolute inset-0 h-full w-full" aria-label="US map with Alaska and Hawaii insets">
          {shapes.map((shape) => {
            const score = scores.get(shape.name);
            return <path key={shape.name} d={shape.path} fill={similarityColor(score?.score)} stroke={state === shape.name ? "#243b36" : "#8a9e91"} strokeWidth={state === shape.name ? 2.5 : 1}><title>{`${shape.name}: ${score ? `${Math.round(score.score * 100)}% average theme overlap (${score.count} drawings)` : "No comparable drawings"}`}</title></path>;
          })}
          <text x="70" y="598" fontSize="13" fill="#243b36">Alaska (inset)</text><text x="275" y="598" fontSize="13" fill="#243b36">Hawaii (inset)</text>
        </svg>
        {shapes.filter((shape) => groups.has(shape.name)).map((shape) => {
          const entries = groups.get(shape.name)!;
          return <div key={shape.name} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-within:z-30 hover:z-30" style={{ left: `${shape.x / 960 * 100}%`, top: `${shape.y / 620 * 100}%` }}>
            <button onClick={() => { setState(shape.name); setSelected(entries[0]); }} aria-label={`Expand ${entries[0].name}’s drawing from ${shape.name}`} className="block h-10 w-16 overflow-hidden rounded-md border-2 border-[#243b36] bg-white shadow-md focus-visible:outline-4 focus-visible:outline-[#d3a63e]">
              <DrawingPreview marks={entries[0].marks} label={`${entries[0].name}’s drawing`} />
            </button>
            <button onClick={() => setState(shape.name)} className="mt-0.5 block max-w-28 rounded bg-[#243b36] px-1.5 py-0.5 text-xs font-bold text-white shadow" aria-label={`View all ${entries.length} drawings from ${shape.name}`}>{shape.name} · {entries.length}{scores.has(shape.name) && <span className="block">{Math.round(scores.get(shape.name)!.score * 100)}% overlap</span>}</button>
          </div>;
        })}
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" aria-expanded={showStats} aria-controls="bubble-stats" onClick={() => setShowStats(!showStats)} className="rounded-lg bg-[#243b36] px-5 py-3 font-bold text-white">📊 {showStats ? "Hide stats" : "View stats"}</button>
      <button type="button" disabled={clearing || !submissions.length} onClick={() => { setConfirmClear(true); setClearMessage(""); setClearError(""); }} className="rounded-lg border border-red-700 px-5 py-3 font-bold text-red-800 disabled:opacity-40">Clear map</button>
    </div>
    {confirmClear && <section aria-label="Confirm clearing the map" className="space-y-3 rounded-xl border border-red-300 bg-white p-4">
      <p>Delete all {submissions.length} submissions, including yours? The map and stats will reset, and every name can submit again. This can’t be undone.</p>
      <div className="flex gap-3"><button disabled={clearing} className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white disabled:opacity-50" onClick={async () => {
        setClearing(true);
        setClearError("");
        try {
          const result = await clearMap();
          if (result.error) setClearError(result.error);
          else {
            setState(""); setSelected(null); setReferenceId(""); setConfirmClear(false);
            setClearMessage("Map cleared. All names, including yours, can submit again.");
            router.refresh();
          }
        } catch { setClearError("The map couldn’t be cleared. Please try again."); }
        finally { setClearing(false); }
      }}>{clearing ? "Clearing…" : "Delete all submissions"}</button><button disabled={clearing} onClick={() => setConfirmClear(false)} className="rounded-lg border border-[#698876] px-4 py-2">Cancel</button></div>
    </section>}
    {clearMessage && <p role="status">{clearMessage} <a href="/bubble" className="font-bold underline">Start a new drawing →</a></p>}
    {clearError && <p role="alert" className="text-red-800">{clearError}</p>}
    {showStats && <section id="bubble-stats" aria-labelledby="stats-heading" className="space-y-4 rounded-2xl border border-[#c7d2c8] bg-white p-5 sm:p-7">
      <h2 id="stats-heading" className="text-2xl font-bold">Most-selected categories</h2>
      <p className="text-sm">Across all {submissions.length} submissions; {taggedCount} include themes. Each student counts once per selected category. Students can select up to three, so percentages can total more than 100%.</p>
      {!taggedCount ? <p>No category votes yet. Submit drawings with themes to see the results.</p> : <ol className="space-y-4">
        {stats.map(({ theme, count, percent }) => <li key={theme}>
          <div className="mb-1 flex justify-between gap-4 text-sm"><span className="font-bold">{theme}</span><span>{count} {count === 1 ? "vote" : "votes"} · {percent}%</span></div>
          <div aria-hidden="true" className="h-5 overflow-hidden rounded-full bg-[#eef1e9]"><div className="h-full rounded-full bg-[#367e70] transition-[width]" style={{ width: `${percent}%` }} /></div>
        </li>)}
      </ol>}
    </section>}
    <div className="flex flex-wrap items-center gap-4">
      <h2 className="text-2xl font-bold">{state || "Everyone’s drawings"} ({drawings.length})</h2>
      <label className="flex items-center gap-2">State<select value={state} onChange={(event) => setState(event.target.value)} className="rounded-lg border border-[#c7d2c8] bg-white p-2"><option value="">All states</option>{Array.from(groups.keys()).sort().map((name) => <option key={name}>{name}</option>)}</select></label>
    </div>
    {!submissions.length && <p>No submissions yet. Submitted drawings will appear here automatically.</p>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {drawings.map((drawing) => <button key={drawing.id} onClick={() => setSelected(drawing)} className="overflow-hidden rounded-2xl border border-[#c7d2c8] bg-white text-left transition hover:shadow-lg focus-visible:outline-4 focus-visible:outline-[#698876]">
        <div className="aspect-[5/3]"><DrawingPreview marks={drawing.marks} label={`${drawing.name}’s bubble`} /></div>
        <div className="space-y-1 border-t border-[#c7d2c8] p-4"><p className="font-bold">{drawing.name}</p><p className="text-sm">{[drawing.city, drawing.state].filter(Boolean).join(", ")} · Click to expand</p><p className="text-xs">{drawing.themes.join(" · ") || "Themes not yet selected"}</p><p className="text-sm font-bold">{drawing.id === reference?.id ? "Comparison drawing" : reference && themeSimilarity(reference.themes, drawing.themes) !== null ? `${Math.round(themeSimilarity(reference.themes, drawing.themes)! * 100)}% theme overlap with ${reference.name}` : "Not scored"}</p></div>
      </button>)}
    </div>
    <dialog ref={dialog} onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} className="fixed inset-0 m-auto max-h-[90vh] w-[min(1100px,94vw)] overflow-auto rounded-2xl bg-[#f6f2e9] p-4 text-[#243b36] backdrop:bg-black/60">
      {selected && <><div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">{selected.name}’s bubble</h2><p>{[selected.city, selected.state].filter(Boolean).join(", ")}</p><p className="text-sm">{selected.themes.join(" · ")}</p></div><button autoFocus onClick={() => setSelected(null)} className="rounded-lg border border-[#698876] px-4 py-2">Close ✕</button></div><DrawingPreview marks={selected.marks} label={`${selected.name}’s full drawing`} /></>}
    </dialog>
  </>;
}
