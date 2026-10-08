"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { STATES, THEMES, validDrawing, validThemes, type Theme, type Point, type Mark, type Submission } from "@/lib/bubble";
import { submitBubble, submissionStillExists } from "./actions";
type Tool = "Pen" | "Eraser" | "Text" | "Stickers";

const stickers = [
  ["🏠", "Home"], ["👪", "Family"], ["🧑‍🤝‍🧑", "Friends"],
  ["🏫", "School"], ["💼", "Work"], ["📱", "Media"],
  ["🗣️", "Language"], ["💰", "Money"], ["🌍", "Culture"], ["🙋", "Me"],
  ["🍲", "Food"], ["🙏", "Faith"], ["🎵", "Music"],
] as const;

export function BubbleCanvas({ initialSubmission }: { initialSubmission: Submission | null }) {
  const svg = useRef<SVGSVGElement>(null);
  const activePointer = useRef<number | null>(null);
  const [marks, setMarks] = useState<Mark[]>(initialSubmission?.marks ?? []);
  const [name, setName] = useState(initialSubmission?.name ?? "");
  const [city, setCity] = useState(initialSubmission?.city ?? "");
  const [themes, setThemes] = useState<Theme[]>(initialSubmission?.themes ?? []);
  const [state, setState] = useState(initialSubmission?.state ?? "");
  const [submittedNames, setSubmittedNames] = useState<string[]>(initialSubmission ? [initialSubmission.name.trim().toLowerCase()] : []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const isSubmitted = submittedNames.includes(name.trim().toLowerCase());
  const [history, setHistory] = useState<Mark[][]>([]);
  const [draft, setDraft] = useState<Extract<Mark, { kind: "stroke" }> | null>(null);
  const [tool, setTool] = useState<Tool>("Pen");
  const [color, setColor] = useState("#243b36");
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const drag = useRef<{ index: number; offset: Point; before: Mark[] } | null>(null);
  const selectedMark = selected === null ? null : marks[selected];
  const selectedSticker = selectedMark?.kind === "sticker" ? selectedMark : null;

  useEffect(() => {
    if (!submittedNames.length || pending) return;
    let active = true;
    async function checkReset() {
      if (document.visibilityState !== "visible") return;
      try {
        if (!(await submissionStillExists()) && active) {
          setSubmittedNames([]);
          setError("");
        }
      } catch { /* Keep the current submission status during a network outage. */ }
    }
    const timer = setInterval(checkReset, 10000);
    window.addEventListener("focus", checkReset);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", checkReset); };
  }, [submittedNames.length, pending]);

  function resize(amount: number) {
    if (!selectedSticker) return;
    commit(marks.map((mark, index) => index === selected ? { ...selectedSticker, size: Math.max(32, Math.min(240, selectedSticker.size + amount)) } : mark));
  }

  function point(event: PointerEvent<SVGSVGElement>): Point {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: p.x, y: p.y };
  }

  function commit(next: Mark[]) {
    setHistory((previous) => [...previous, marks]);
    setMarks(next);
  }

  function start(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== null || event.button !== 0) return;
    const p = point(event);
    if (tool === "Stickers") {
      const target = (event.target as Element).closest("[data-sticker]");
      const index = target ? Number(target.getAttribute("data-sticker")) : -1;
      const mark = marks[index];
      if (mark?.kind === "sticker") {
        setSelected(index);
        drag.current = { index, offset: { x: p.x - mark.point.x, y: p.y - mark.point.y }, before: marks };
        activePointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
      } else setSelected(null);
      return;
    }
    if (tool === "Text") {
      if (label.trim()) commit([...marks, { kind: "text", point: p, text: label.trim(), color }]);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    activePointer.current = event.pointerId;
    setDraft({ kind: "stroke", points: [p], color: tool === "Eraser" ? "#ffffff" : color, width: tool === "Eraser" ? 30 : 3 });
  }

  function finish(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== event.pointerId) return;
    const moving = drag.current;
    if (moving && marks !== moving.before) setHistory((previous) => [...previous, moving.before]);
    drag.current = null;
    if (draft) commit([...marks, draft]);
    activePointer.current = null;
    setDraft(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function download() {
    if (!svg.current) return;
    const copy = svg.current.cloneNode(true) as SVGSVGElement;
    copy.querySelectorAll("[data-selection]").forEach((element) => element.remove());
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("width", "1200");
    copy.setAttribute("height", "720");
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-bubble.svg";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const button = "rounded-lg border border-[#c7d2c8] px-4 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243b36] disabled:opacity-40";

  return (
    <>
    <section aria-label="Bubble drawing workspace" className="overflow-hidden rounded-2xl border border-[#c7d2c8] bg-white">
      <fieldset disabled={pending} className="contents">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#c7d2c8] bg-[#eef1e9] p-3">
        {(["Pen", "Eraser", "Text", "Stickers"] as const).map((name) => (
          <button key={name} type="button" aria-pressed={tool === name} onClick={() => setTool(name)} className={`${button} ${tool === name ? "bg-[#243b36] text-white" : "bg-white"}`}>{name}</button>
        ))}
        <label className="flex items-center gap-2 px-2 text-sm">Ink <input aria-label="Ink color" type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-8 w-8 cursor-pointer" /></label>
        <button type="button" className={button} disabled={!history.length} onClick={() => { setMarks(history[history.length - 1]); setHistory(history.slice(0, -1)); setSelected(null); }}>Undo</button>
        <button type="button" className={button} disabled={!marks.length} onClick={() => { commit([]); setSelected(null); }}>Clear</button>
        <button type="button" className={`${button} sm:ml-auto`} onClick={download}>Download drawing</button>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-[#c7d2c8] p-3" aria-label="Add emoji stickers">
        {stickers.map(([emoji, name]) => (
          <button key={name} type="button" aria-label={`Add ${name} sticker`} className={`${button} bg-white`} onClick={() => {
            commit([...marks, { kind: "sticker", emoji, name, size: 80, point: { x: 480 + (marks.filter((mark) => mark.kind === "sticker").length % 5) * 60, y: 360 } }]);
            setSelected(marks.length);
            setTool("Stickers");
          }}><span aria-hidden="true" className="mr-1 text-xl">{emoji}</span>{name}</button>
        ))}
      </div>
      {tool === "Stickers" && selectedSticker && (
        <div className="flex flex-wrap items-center gap-2 bg-[#eef1e9] px-4 py-2" aria-label="Selected sticker controls">
          <span className="mr-2 text-sm font-bold">{selectedSticker.emoji} {selectedSticker.name}</span>
          <button type="button" className={button} disabled={selectedSticker.size <= 32} onClick={() => resize(-16)}>− Smaller</button>
          <button type="button" className={button} disabled={selectedSticker.size >= 240} onClick={() => resize(16)}>+ Bigger</button>
          <output className="px-2 text-sm" aria-live="polite">{Math.round(selectedSticker.size / 80 * 100)}%</output>
          <button type="button" className={button} onClick={() => { commit(marks.filter((_, index) => index !== selected)); setSelected(null); }}>Remove sticker</button>
        </div>
      )}
      <div className="px-4 py-3 text-sm" aria-live="polite">
        {tool === "Text" ? (
          <label className="flex flex-wrap items-center gap-3">Label
            <input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={100} placeholder="Type here, then tap the canvas" className="min-w-0 flex-1 rounded-lg border border-[#c7d2c8] px-3 py-2" />
            <span>Tap the canvas to place it.</span>
          </label>
        ) : tool === "Stickers" ? "Tap an emoji to add it. Drag it into place. Use Smaller or Bigger to resize it." : tool === "Pen" ? "Draw a big circle to begin. Add emoji stickers or choose Text for labels." : "Drag over marks to erase. Undo also restores a cleared drawing."}
      </div>
      <svg ref={svg} viewBox="0 0 1200 720" role="img" aria-label="Drawing canvas. Draw with a mouse, finger, or stylus; use the Text tool to place labels." className="block w-full touch-none" style={{ cursor: tool === "Text" ? "text" : "crosshair", aspectRatio: "5 / 3", pointerEvents: pending ? "none" : undefined }}
        onPointerDown={start}
        onPointerMove={(event) => {
          if (activePointer.current !== event.pointerId) return;
          const p = point(event);
          const moving = drag.current;
          if (moving) {
            setMarks((previous) => previous.map((mark, index) => index === moving.index && mark.kind === "sticker" ? { ...mark, point: { x: Math.max(mark.size / 2, Math.min(1200 - mark.size / 2, p.x - moving.offset.x)), y: Math.max(mark.size / 2, Math.min(720 - mark.size / 2, p.y - moving.offset.y)) } } : mark));
            return;
          }
          setDraft((previous) => previous ? { ...previous, points: [...previous.points, p] } : null);
        }}
        onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
      >
        <rect width="1200" height="720" fill="#ffffff" />
        {[...marks, ...(draft ? [draft] : [])].map((mark, index) => mark.kind === "sticker" ? (
          <g key={index} data-sticker={index} style={{ cursor: tool === "Stickers" ? "grab" : undefined }}>
            <rect x={mark.point.x - mark.size / 2} y={mark.point.y - mark.size / 2} width={mark.size} height={mark.size} fill="transparent" />
            <text x={mark.point.x} y={mark.point.y} textAnchor="middle" dominantBaseline="central" fontSize={mark.size * 0.85} fontFamily="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" style={{ userSelect: "none" }}>{mark.emoji}</text>
          </g>
        ) : mark.kind === "text" ? (
          <text key={index} x={mark.point.x} y={mark.point.y} fill={mark.color} fontFamily="Arial, sans-serif" fontSize="24" style={{ userSelect: "none" }}>{mark.text}</text>
        ) : mark.points.length === 1 ? (
          <circle key={index} cx={mark.points[0].x} cy={mark.points[0].y} r={mark.width / 2} fill={mark.color} />
        ) : (
          <polyline key={index} points={mark.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={mark.color} strokeWidth={mark.width} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {tool === "Stickers" && selectedSticker && <rect data-selection="true" x={selectedSticker.point.x - selectedSticker.size / 2 - 4} y={selectedSticker.point.y - selectedSticker.size / 2 - 4} width={selectedSticker.size + 8} height={selectedSticker.size + 8} rx="8" fill="none" stroke="#698876" strokeWidth="2" strokeDasharray="6 4" pointerEvents="none" />}
      </svg>
      </fieldset>
      <p className="border-t border-[#c7d2c8] px-4 py-2 text-xs text-[#52665c]">Submit below to save your drawing. Changes aren’t saved until you submit.</p>
    </section>
    <form className="space-y-4 rounded-2xl border border-[#c7d2c8] bg-white p-5" onSubmit={async (event) => {
      event.preventDefault();
      if (pending || isSubmitted) return;
      if (!validDrawing(marks)) { setError("Add your drawing before submitting."); return; }
      if (!validThemes(themes)) { setError("Choose one to three themes shown in your drawing."); return; }
      setPending(true);
      setError("");
      const data = new FormData();
      data.set("name", name);
      data.set("state", state);
      data.set("city", city);
      data.set("themes", JSON.stringify(themes));
      data.set("drawing", JSON.stringify(marks));
      try {
        const result = await submitBubble(data);
        if (result.error) setError(result.error);
        if (result.duplicate) setSubmittedNames((previous) => [...previous, name.trim().toLowerCase()]);
        if (result.success) {
          const savedName = result.name ?? name.trim();
          setName(savedName);
          setSubmittedNames((previous) => [...previous, savedName.trim().toLowerCase()]);
        }
      } catch { setError("Your drawing wasn’t submitted. Please try again; your work is still here."); }
      finally { setPending(false); }
    }}>
      <h2 className="text-xl font-bold">Submit your bubble</h2>
      <p className="text-sm">One submission per name. Enter a different name to submit as another user. Your name, city, state, and drawing will appear on Elgin’s class map.</p>
      <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 font-bold">Your name
          <input name="name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} required maxLength={80} autoComplete="name" className="block w-full rounded-lg border border-[#c7d2c8] px-3 py-2 font-normal" />
        </label>
        <label className="space-y-1 font-bold">City you’re from
          <input name="city" value={city} onChange={(event) => setCity(event.target.value)} required maxLength={100} autoComplete="address-level2" className="block w-full rounded-lg border border-[#c7d2c8] px-3 py-2 font-normal" />
        </label>
        <label className="space-y-1 font-bold">State you’re from
          <select name="state" value={state} onChange={(event) => setState(event.target.value)} required className="block w-full rounded-lg border border-[#c7d2c8] bg-white px-3 py-2 font-normal">
            <option value="" disabled>Select your state</option>
            {STATES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </fieldset>
      <fieldset disabled={pending} className="space-y-2">
        <legend className="font-bold">Choose 1–3 themes in your drawing</legend>
        <p className="text-sm">These themes let the map compare what your bubbles have in common.</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => <label key={theme} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${themes.includes(theme) ? "border-[#243b36] bg-[#e8eee3]" : "border-[#c7d2c8]"}`}>
            <input type="checkbox" checked={themes.includes(theme)} disabled={!themes.includes(theme) && themes.length >= 3} onChange={(event) => setThemes(event.target.checked ? [...themes, theme] : themes.filter((item) => item !== theme))} />{theme}
          </label>)}
        </div>
      </fieldset>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <p role="status" className="text-sm">{isSubmitted ? "This name has submitted. Enter a different name to make a new submission." : "Your drawing has not been submitted under this name yet."}</p>
      <button type="submit" disabled={pending || isSubmitted} className={`${button} bg-[#243b36] text-white`}>{pending ? "Submitting…" : isSubmitted ? "Submitted ✓" : "Submit drawing"}</button>
    </form>
    {name.trim().toLowerCase() === "elgin" && <Link href="/bubble/gallery" className={`${button} inline-block bg-[#243b36] text-white`}>🌎 View class map</Link>}
    </>
  );
}
