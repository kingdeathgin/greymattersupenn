"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SIGNALS, MAX_GUESSES, CODE_LENGTH, dailyTakeaway, type Puzzle, type Round, type Leader } from "@/lib/synapse";
type GameRound = Round & { answer?: number[] };
type Snapshot = { puzzle: Puzzle; leaderboard: Leader[]; nickname: string; round: GameRound | null; unavailable?: boolean; best?: unknown };
async function request(body?: object) {
  const response = await fetch("/api/synapse", body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
function Signal({ id, small = false }: { id: number; small?: boolean }) {
  const signal = SIGNALS[id];
  return <span className={`inline-flex flex-col items-center justify-center ${small ? "gap-1" : "gap-2"}`} style={{ color: signal.color }}><span aria-hidden="true" className={small ? "text-xl" : "text-2xl"}>{signal.glyph}</span><span className="text-[9px] tracking-wide">{signal.name}</span></span>;
}
export function SynapseSprint() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [round, setRound] = useState<GameRound | null>(null);
  const [draft, setDraft] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState<number[]>([]);
  const load = useCallback(async () => {
    try { const next: Snapshot = await request(); setData(next); setRound(next.round); setNickname(next.nickname); setSaved(Boolean(next.best)); if (next.unavailable) setError("The game is temporarily unavailable. Please retry shortly."); }
    catch { setError("Couldn’t load the game. Check your connection and retry."); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const add = useCallback((id: number) => { if (round && !round.finished && !busy) setDraft(d => d.length < CODE_LENGTH && !d.includes(id) ? [...d, id] : d); }, [round, busy]);
  const submit = useCallback(async () => {
    if (!round || round.finished || draft.length !== CODE_LENGTH || busy) return;
    setBusy(true); setError("");
    try { const next = await request({ action: "guess", runId: round.runId, turn: round.guesses.length, signals: draft }); setRound(next.round); setDraft([]); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }, [round, draft, busy]);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if ((event.target as HTMLElement)?.closest("input, textarea, a")) return;
      if (event.key === "Enter" && (event.target as HTMLElement)?.closest("button")) return;
      if (/^[1-8]$/.test(event.key)) { event.preventDefault(); add(Number(event.key) - 1); }
      else if (event.key === "Backspace" && !busy) { event.preventDefault(); setDraft(d => d.slice(0,-1)); }
      else if (event.key === "Enter") { event.preventDefault(); void submit(); }
    }
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [add, submit, busy]);
  async function begin() {
    setBusy(true); setError("");
    try { const next = await request({ action: "start" }); setData(d => d ? { ...d, puzzle: next.puzzle, unavailable: false } : d); setRound(next.round); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function publish(event: React.FormEvent) {
    event.preventDefault(); if (!round || busy) return;
    setBusy(true); setError("");
    try { await request({ action: "publish", runId: round.runId, nickname }); setSaved(true); const next = await request(); setData(next); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function share() {
    if (!round || !data) return;
    const rows = round.guesses.map(g => "🟩".repeat(g.exact) + "🟨".repeat(g.misplaced) + "⬛".repeat(CODE_LENGTH - g.exact - g.misplaced));
    try { await navigator.clipboard.writeText(`Grey Matters · Synapse Sprint\n${data.puzzle.day} · ${round.won ? round.guesses.length : "X"}/${MAX_GUESSES}\n${rows.join("\n")}\n${window.location.origin}/synapse-sprint`); setCopied(true); }
    catch { setError("Your browser couldn’t copy the result. You can share this page’s link."); }
  }
  const puzzle = data?.puzzle, takeaway = puzzle ? dailyTakeaway(puzzle.day) : null;
  return <div className="synapse-shell mx-auto max-w-6xl">
    <header className="mb-9 border-b border-white/10 pb-8"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#f4d35e]">An original daily game · Grey Matters at Penn</p><h1 className="synapse-title mt-4 font-editorial">Synapse Sprint.</h1><p className="mt-4 max-w-xl text-base leading-relaxed text-[#b1bdd0]">Eight signals. Five hidden connections. Six chances to figure out what fits—and where.</p><p className="mt-4 text-xs text-[#8393ad]">{puzzle?.day ?? "Loading today’s puzzle…"} · New code at midnight Eastern · One ranked round per day</p></header>
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section aria-label="Daily deduction puzzle" className="min-w-0">
        {puzzle && <div className="mb-6 rounded-2xl border border-[#37405f] bg-[#15172c] p-5"><p className="mb-3 text-[10px] uppercase tracking-[.18em] text-[#c3a0ff]">Today’s two clues</p><ol className="space-y-3 text-sm leading-relaxed text-[#dce2ef]"><li><strong style={{color:SIGNALS[puzzle.before[0]].color}}>{SIGNALS[puzzle.before[0]].name}</strong> and <strong style={{color:SIGNALS[puzzle.before[1]].color}}>{SIGNALS[puzzle.before[1]].name}</strong> both appear. {SIGNALS[puzzle.before[0]].name} comes before {SIGNALS[puzzle.before[1]].name}, with any number of slots between them.</li><li>Exactly one of <strong style={{color:SIGNALS[puzzle.either[0]].color}}>{SIGNALS[puzzle.either[0]].name}</strong> and <strong style={{color:SIGNALS[puzzle.either[1]].color}}>{SIGNALS[puzzle.either[1]].name}</strong> appears in the code.</li></ol></div>}
        {!round && <div className="mb-6"><button disabled={!data || busy || data.unavailable} onClick={begin} className="synapse-button-primary">{busy ? "Starting…" : "Play today’s puzzle"}</button><p className="mt-3 text-xs leading-relaxed text-[#8d9bb4]">The answer stays hidden. Your guesses are saved after each submission.</p></div>}
        <div className="rounded-2xl border border-white/10 bg-[#080d1d] p-3 sm:p-5" aria-label="Guess history">
          <div className="mb-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-[#8d9bb4]"><span>Five different signals · left to right</span><span className="shrink-0">Exact / Elsewhere</span></div>
          <div className="space-y-2">{Array.from({length:MAX_GUESSES}, (_, row) => {
            const guess = round?.guesses[row], active = Boolean(round && !round.finished && row === round.guesses.length);
            return <div key={row} className="grid grid-cols-[1fr_66px] items-center gap-2 sm:gap-4" aria-label={`Guess ${row+1}${guess ? `: ${guess.exact} exact, ${guess.misplaced} elsewhere` : active ? ": current" : ": empty"}`}>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">{Array.from({length:CODE_LENGTH}, (_, i) => {
                const id = guess?.signals[i] ?? (active ? draft[i] : undefined);
                return <button key={i} disabled={!active || id === undefined || busy} onClick={() => setDraft(d => d.filter((_,index) => index !== i))} aria-label={id === undefined ? `Slot ${i+1}, empty` : `${SIGNALS[id].name} in slot ${i+1}${active ? ", click to remove" : ""}`} className={`flex h-[61px] min-w-0 items-center justify-center rounded-lg border sm:h-[70px] ${active ? "border-[#566381] bg-[#152036]" : "border-[#283148] bg-[#0d1425]"}`}>
                  {id === undefined ? <span className="text-xs text-[#53627c]">{i+1}</span> : <Signal id={id} small/>}
                </button>;
              })}</div>
              <div className="flex justify-center gap-2 text-sm font-semibold" aria-hidden="true"><span className={guess ? "text-[#8ee8bd]" : "text-[#4b5871]"}>{guess?.exact ?? "–"}</span><span className="text-[#4b5871]">/</span><span className={guess ? "text-[#f4d35e]" : "text-[#4b5871]"}>{guess?.misplaced ?? "–"}</span></div>
            </div>;
          })}</div>
        </div>
        {round && !round.finished && <div className="mt-5"><div className="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Signal keyboard">{SIGNALS.map((signal,id) => <button key={signal.name} aria-label={`Add ${signal.name}`} disabled={busy || draft.includes(id) || draft.length===CODE_LENGTH} onClick={() => add(id)} className="rounded-lg border border-[#33415a] bg-[#101a2e] py-3 disabled:opacity-35"><Signal id={id} small/><span className="mt-1 hidden text-[9px] text-[#899bb5] sm:block">{id+1}</span></button>)}</div><div className="mt-4 flex flex-wrap items-center gap-3"><button onClick={submit} disabled={draft.length!==CODE_LENGTH || busy} className="synapse-button-primary">{busy ? "Checking…" : `Submit guess ${round.guesses.length+1}`}</button><button disabled={!draft.length || busy} className="synapse-button-secondary" onClick={() => setDraft(d => d.slice(0,-1))}>Delete</button><button disabled={!draft.length || busy} className="text-xs text-[#9fadc4]" onClick={() => setDraft([])}>Clear</button></div><p className="mt-3 text-xs leading-relaxed text-[#8d9bb4]">Keyboard: 1–8 to add, Backspace to delete, Enter to submit. Click a filled slot to remove it.</p></div>}
        {error && <div role="alert" className="mt-5 rounded-xl border border-[#ffb1a3]/30 bg-[#ffb1a3]/5 p-4 text-sm text-[#ffc8bd]">{error}<button onClick={() => {setError(""); void load();}} className="ml-3 underline">Refresh / retry</button></div>}
        {round?.finished && <section className="mt-6 rounded-2xl border border-[#8ee8ef]/25 bg-[#102131] p-5" aria-live="polite"><p className="text-[10px] uppercase tracking-widest text-[#8ee8ef]">{round.won ? "Connection made" : "Today’s code revealed"}</p><h2 className="synapse-result-title mt-3 font-editorial">{round.won ? `${round.score} points.` : "A new puzzle tomorrow."}</h2><p className="mt-3 text-sm leading-relaxed text-[#b1c4d6]">{round.won ? `Decoded in ${round.guesses.length} of six guesses. Fewer guesses earn more points.` : "Six guesses used. Compare the code with your feedback to see what you could have ruled out."}</p><div className="mt-4 grid grid-cols-5 gap-2" aria-label="Answer">{round.answer?.map((id,i) => <div key={i} className="rounded-lg border border-[#547087] py-3 text-center"><Signal id={id} small/></div>)}</div>
          {round.won && !saved && <form onSubmit={publish} className="mt-5"><label htmlFor="game-nickname" className="block text-xs text-[#b1c4d6]">Choose a public nickname for the weekly leaderboard</label><div className="mt-2 flex flex-wrap gap-3"><input id="game-nickname" value={nickname} onChange={e => setNickname(e.target.value)} required minLength={2} maxLength={20} autoComplete="nickname" className="min-w-0 flex-1 rounded-lg border border-[#53647c] bg-[#080f1c] px-3 py-3 text-sm" placeholder="Your nickname"/><button disabled={busy} className="synapse-button-primary">{busy ? "Saving…" : "Save score"}</button></div><p className="mt-2 text-xs text-[#8d9bb4]">Nicknames and points are public. No account needed; this browser remembers your progress.</p></form>}
          {saved && round.won && <p className="mt-4 text-sm text-[#8ee8bd]">Your score is on the leaderboard.</p>}
          <button onClick={share} className="synapse-button-secondary mt-5">{copied ? "Result copied" : "Copy spoiler-free result"}</button>
        </section>}
        {round && <details className="mt-6 rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm text-[#bcc8db]">Scratchpad · mark signals you’ve ruled out</summary><p className="mt-3 text-xs leading-relaxed text-[#8d9bb4]">Private notes only; these marks don’t change your guesses.</p><div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">{SIGNALS.map((s,id) => <button key={id} aria-pressed={notes.includes(id)} onClick={() => setNotes(n => n.includes(id) ? n.filter(x=>x!==id) : [...n,id])} className={`rounded-lg border p-2 text-xs ${notes.includes(id) ? "border-[#ffb1a3] text-[#ffb1a3] line-through" : "border-[#33415a] text-[#aebbd0]"}`}>{s.name}</button>)}</div></details>}
        {round?.finished && takeaway && <div className="mt-8 border-t border-white/10 pt-6"><p className="text-[10px] uppercase tracking-widest text-[#c3a0ff]">Keep thinking</p><h3 className="mt-3 text-lg">{takeaway.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#aab6ce]">{takeaway.text}</p><Link className="mt-4 inline-block text-sm text-[#8ee8ef]" href={`/articles/${takeaway.slug}`}>Read {takeaway.article} ↗</Link></div>}
      </section>
      <aside className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#0c1222] p-5"><h2 className="synapse-panel-title font-editorial">How to read the signal</h2><div className="mt-4 space-y-4 text-sm leading-relaxed text-[#aab6ce]"><p>The code contains <strong className="text-white">five different signals</strong> from the eight available. Their order matters.</p><p><strong className="text-[#8ee8bd]">Exact</strong> = a correct signal in the correct slot.<br/><strong className="text-[#f4d35e]">Elsewhere</strong> = a correct signal in the wrong slot.</p><p>The counts apply to the whole guess. They <strong className="text-white">don’t identify individual signals</strong>, so use multiple guesses and today’s clues to deduce the code.</p><p>For example, <strong className="text-[#8ee8bd]">2</strong> / <strong className="text-[#f4d35e]">1</strong> means two signals are in place, one belongs elsewhere, and two aren’t in the code.</p><p>You can submit a guess that breaks a clue to test a theory. Every submission uses a guess.</p></div></section>
        <section className="rounded-2xl border border-white/10 bg-[#0c1222] p-5"><div className="flex items-center justify-between gap-2"><h2 className="synapse-panel-title font-editorial">This week’s minds</h2><button onClick={() => void load()} disabled={busy} aria-label="Refresh leaderboard" className="text-xs text-[#8ee8ef]">Refresh ↻</button></div><p className="mt-3 text-xs leading-relaxed text-[#8d9bb4]">Total daily points · resets Monday Eastern. One score per day. Ties use total solving time.</p>{data?.leaderboard.length ? <ol className="mt-5 divide-y divide-white/10">{data.leaderboard.map((leader,i) => <li key={leader.nickname} className="flex items-center gap-3 py-3 text-sm"><span className="w-4 text-[#697f9e]">{i+1}</span><span className="min-w-0 flex-1 break-words text-[#d4ddec]">{leader.nickname}<span className="mt-1 block text-[10px] text-[#8d9bb4]">{leader.days} day{leader.days===1?"":"s"}</span></span><span className="text-[#f4d35e]">{leader.points.toLocaleString()}</span></li>)}</ol> : <p className="mt-5 text-sm leading-relaxed text-[#aab6ce]">{data?.unavailable ? "Leaderboard temporarily unavailable." : "No scores yet this week. Crack today’s code to claim a place."}</p>}<p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#8d9bb4]">1 guess: 1,000 points. Each additional guess costs 120 points. A sixth-guess solve earns 400. Unsolved rounds don’t appear on the board.</p></section>
      </aside>
    </div>
  </div>;
}
