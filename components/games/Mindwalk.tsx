"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { easternDay } from "@/lib/synapse";
import { makeMap, newWalk, move, neighbors, points, validWalk, SIZE, type Walk } from "@/lib/mindwalk";
type Phase = "ready" | "study" | "walk";
type Session = { day: string; seed: string; phase: Phase; deadline: number | null; untimed: boolean; walk: Walk };
const THOUGHTS = [{icon:"✦",name:"Spark"},{icon:"◎",name:"Echo"},{icon:"◇",name:"Idea"}];
const dayBefore = (day: string) => {const d=new Date(`${day}T12:00:00Z`);d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10);};
export function Mindwalk() {
  const [session,setSession]=useState<Session|null>(null);
  const [remaining,setRemaining]=useState(8);
  const [peekUntil,setPeekUntil]=useState(0);
  const [message,setMessage]=useState("Pick up three thoughts. Find your way out.");
  const [storageWarning,setStorageWarning]=useState(false);
  const [wins,setWins]=useState<string[]>([]);
  const [copied,setCopied]=useState(false);
  const [showRoute,setShowRoute]=useState(false);
  const seed=session?.seed;
  const map=useMemo(()=>seed?makeMap(seed):null,[seed]);
  useEffect(()=>{
    const day=easternDay(), seed=`daily:${day}`, map=makeMap(seed);
    const fresh: Session={day,seed,phase:"ready",deadline:null,untimed:false,walk:newWalk(map)};
    try {
      const saved=JSON.parse(localStorage.getItem(`gm-mindwalk-v1:${day}`)||"null");
      if(saved?.day===day && saved.seed===seed && ["ready","study","walk"].includes(saved.phase) && (saved.deadline===null||Number.isFinite(saved.deadline)) && typeof saved.untimed==="boolean" && validWalk(saved.walk,map)) setSession(saved);
      else setSession(fresh);
      const history=JSON.parse(localStorage.getItem("gm-mindwalk-wins")||"[]");
      if(Array.isArray(history))setWins([...new Set(history.filter((d:unknown)=>typeof d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d)))] as string[]);
    } catch {setStorageWarning(true);setSession(fresh);}
  },[]);
  useEffect(()=>{
    if(!session || !session.seed.startsWith("daily:"))return;
    try {localStorage.setItem(`gm-mindwalk-v1:${session.day}`,JSON.stringify(session));}catch {setStorageWarning(true);}
  },[session]);
  useEffect(()=>{
    if(!session?.walk.finished || !session.seed.startsWith("daily:") || wins.includes(session.day))return;
    const next=[...wins,session.day];setWins(next);
    try{localStorage.setItem("gm-mindwalk-wins",JSON.stringify(next));}catch{setStorageWarning(true);}
  },[session?.walk.finished,session?.day,session?.seed,wins]);
  useEffect(()=>{
    if(session?.phase!=="study" || session.untimed || !session.deadline)return;
    const deadline=session.deadline;
    const tick=()=>{const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));setRemaining(seconds);if(seconds===0){setSession(s=>s?{...s,phase:"walk",deadline:null}:s);setMessage("The walls are hidden. Your move.");}};
    tick();const interval=setInterval(tick,100);return()=>clearInterval(interval);
  },[session?.phase,session?.deadline,session?.untimed]);
  useEffect(()=>{if(!peekUntil)return;const timer=setTimeout(()=>setPeekUntil(0),Math.max(0,peekUntil-Date.now()));return()=>clearTimeout(timer);},[peekUntil]);
  const step=useCallback((cell:number)=>{
    if(!map || !session || session.phase!=="walk" || session.walk.finished || peekUntil)return;
    const next=move(map,session.walk,cell);
    if(next===session.walk)return;
    setSession({...session,walk:next});
    if(next.bumps>session.walk.bumps)setMessage("A wall! Stay here, take another turn. −50 points.");
    else if(next.finished)setMessage("All three thoughts. One beautiful way home.");
    else if(next.collected.length>session.walk.collected.length)setMessage(`${THOUGHTS[map.thoughts.indexOf(cell)].name} collected. ${next.collected.length===3?"Now head to the exit!":`${3-next.collected.length} to go.`}`);
    else if(cell===map.exit)setMessage("You found the exit. Collect all three thoughts before leaving.");
    else setMessage("Keep that route in mind.");
  },[map,session,peekUntil]);
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      if((event.target as HTMLElement)?.closest("input,textarea,select")||event.ctrlKey||event.metaKey||event.altKey)return;
      if(!session || session.phase!=="walk" || session.walk.finished)return;
      const direction:Record<string,number>={ArrowUp:-SIZE,ArrowDown:SIZE,ArrowLeft:-1,ArrowRight:1,w:-SIZE,s:SIZE,a:-1,d:1};
      if(event.key in direction){event.preventDefault();step(session.walk.position+direction[event.key]);}
    };
    window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);
  },[session,step]);
  if(!session||!map)return <div className="mindwalk-shell"><p>Gathering today’s thoughts…</p></div>;
  const daily=session.seed.startsWith("daily:"), done=session.walk.finished;
  const visible=session.phase==="study"||Boolean(peekUntil)||done;
  const adjacent=neighbors(session.walk.position);
  let streak=0, cursor=wins.includes(session.day)?session.day:dayBefore(session.day);
  while(wins.includes(cursor)){streak++;cursor=dayBefore(cursor);}
  function start() {document.querySelector(".mw-toolbar")?.scrollIntoView({block:"start"});setRemaining(8);setSession(s=>s?{...s,phase:"study",deadline:s.untimed?null:Date.now()+8000}:s);setMessage("Remember the walls. Plan a route through all three thoughts.");}
  function practice(){const seed=`practice:${crypto.randomUUID()}`, nextMap=makeMap(seed);setSession({...session!,seed,phase:"ready",deadline:null,walk:newWalk(nextMap)});setPeekUntil(0);setShowRoute(false);setCopied(false);setMessage("A fresh map. A fresh train of thought.");}
  function returnDaily(){
    const seed=`daily:${session!.day}`, dailyMap=makeMap(seed);
    let next: Session={day:session!.day,seed,phase:"ready",deadline:null,untimed:false,walk:newWalk(dailyMap)};
    try {const saved=JSON.parse(localStorage.getItem(`gm-mindwalk-v1:${session!.day}`)||"null");if(saved?.seed===seed && ["ready","study","walk"].includes(saved.phase) && validWalk(saved.walk,dailyMap))next=saved;}catch{}
    setSession(next);setPeekUntil(0);setShowRoute(false);setCopied(false);setMessage(next.walk.finished?"Welcome back. Today’s thoughts are safely collected.":"Back to today’s walk.");
  }
  function peek(){if(peekUntil||done)return;setSession(s=>s?{...s,walk:{...s.walk,peeks:s.walk.peeks+1}}:s);setPeekUntil(Date.now()+2000);setMessage("A two-second reminder. −100 points.");}
  async function share(){try{await navigator.clipboard.writeText(`Penn Grey Matters · Mindwalk\n${daily?session!.day:"Practice"} ${session!.untimed?"· relaxed mode":""}\n✦ ◎ ◇ → ↗\n${points(map!,session!.walk)} points · ${session!.walk.moves} steps\n${session!.walk.bumps} bumps · ${session!.walk.peeks} peeks\n${window.location.origin}/mindwalk`);setCopied(true);}catch{setMessage("Copy isn’t available here. Share this page’s link instead.");}}
  return <div className="mindwalk-shell">
    <header className="mw-heading"><div className="mw-kicker"><span className="mw-brand-dot"/> PENN GREY MATTERS <span className="mw-kicker-divider">/</span> THE DAILY PLAY</div><div className="mw-title-row"><h1>Mindwalk<span>↗</span></h1><div className="mw-edition">{daily?"TODAY’S WALK":"A LITTLE PRACTICE"}<span>{session.day.split("-").slice(1).join(".")}.{session.day.slice(2,4)}</span></div></div><p className="mw-deck">A little lost in thought.</p><p className="mw-intro">Remember the maze. Collect three thoughts. Make it back out.</p></header>
    <div className="mw-layout"><section className="mw-play" aria-label="Mindwalk game">
      <div className="mw-toolbar"><div className="mw-thoughts" aria-label={`${session.walk.collected.length} of three thoughts collected`}>{THOUGHTS.map((t,i)=><span key={t.name} className={session.walk.collected.includes(map.thoughts[i])?"is-collected":""}><span aria-hidden="true">{t.icon}</span><span>{t.name}</span>{session.walk.collected.includes(map.thoughts[i])&&<span aria-label="collected">✓</span>}</span>)}</div><div className="mw-phase">{done?"FOUND YOUR WAY":session.phase==="study"?(session.untimed?"TAKE YOUR TIME":`${remaining}s TO REMEMBER`):session.phase==="ready"?"READY WHEN YOU ARE":"TRUST YOUR MEMORY"}</div></div>
      <div className={`mw-board-wrap ${session.phase==="study"?"is-studying":""}`}>
        <div className="mw-board" aria-label="Six by six maze. Use arrow keys, direction buttons, or tap an adjacent square.">
          {Array.from({length:36},(_,cell)=>{
            const wall=map.walls.includes(cell),knownWall=wall&&(visible||session.walk.revealedWalls.includes(cell));
            const thought=map.thoughts.indexOf(cell),collected=session.walk.collected.includes(cell),current=cell===session.walk.position;
            const hidden=session.phase==="ready", visited=session.walk.visited.includes(cell), exit=cell===map.exit;
            const enabled=session.phase==="walk"&&!done&&!peekUntil&&adjacent.includes(cell);
            const content=hidden?"":current?"●":knownWall?"╱":thought>=0&&!collected?THOUGHTS[thought].icon:exit?"↗":visited?"·":"";
            return <button key={cell} data-cell={cell} disabled={!enabled} onClick={()=>step(cell)} aria-label={`Row ${Math.floor(cell/SIZE)+1}, column ${cell%SIZE+1}${hidden?"":current?", you are here":knownWall?", wall":thought>=0&&!collected?`, ${THOUGHTS[thought].name}`:exit?", exit":visited?", visited":""}`} className={`mw-cell ${!hidden&&current?"is-current":""} ${!hidden&&knownWall?"is-wall":""} ${!hidden&&thought>=0&&!collected?`is-thought thought-${thought}`:""} ${!hidden&&exit&&!current?"is-exit":""} ${!hidden&&visited&&!current?"is-visited":""} ${enabled?"is-adjacent":""}`}><span aria-hidden="true">{content}</span>{!hidden&&thought>=0&&!collected&&!current&&<small>{THOUGHTS[thought].name}</small>}{!hidden&&exit&&!current&&<small>EXIT</small>}</button>;
          })}
        </div>
        {session.phase==="ready"&&<div className="mw-start-card"><span className="mw-start-spark" aria-hidden="true">✦</span><h2>Hold that thought.</h2><p>You get eight seconds to see the walls.<br/>Then it’s you and your memory.</p><button className="mw-button" onClick={start}>{daily?"Start today’s walk":"Let’s practice"}<span aria-hidden="true">↗</span></button><label className="mw-relaxed"><input type="checkbox" checked={session.untimed} onChange={e=>setSession({...session,untimed:e.target.checked})}/> Take my time studying the map</label></div>}
        {session.phase==="study"&&<div className="mw-study-strip"><span>{session.untimed?"Plan your route. No rush.":"Walls disappear when the countdown ends."}</span><button onClick={()=>{setSession({...session,phase:"walk",deadline:null});setMessage("The walls are hidden. Your move.");}}>I’m ready →</button></div>}
      </div>
      <p className="mw-status" role="status" aria-live="polite">{message}</p>
      {session.phase==="walk"&&!done&&<div className="mw-controls"><div className="mw-dpad" aria-label="Movement controls">{[{label:"Up",glyph:"↑",delta:-SIZE},{label:"Left",glyph:"←",delta:-1},{label:"Down",glyph:"↓",delta:SIZE},{label:"Right",glyph:"→",delta:1}].map(d=><button key={d.label} className={`direction-${d.label.toLowerCase()}`} aria-label={`Move ${d.label.toLowerCase()}`} disabled={Boolean(peekUntil)||!adjacent.includes(session.walk.position+d.delta)} onClick={()=>step(session.walk.position+d.delta)}>{d.glyph}</button>)}</div><div className="mw-peek"><button onClick={peek} disabled={Boolean(peekUntil)} className="mw-button mw-button-light">{peekUntil?"Looking…":"Peek at the map"}<span aria-hidden="true">◉</span></button><span>2 seconds · costs 100 points</span></div></div>}
      {done&&<section className="mw-finish" aria-label="Completed walk"><div><span className="mw-kicker">{session.untimed?"RELAXED WALK COMPLETE":"A GOOD DAY TO GET LOST"}</span><h2>{points(map,session.walk)>=900?"A mind to remember.":points(map,session.walk)>=650?"Thoughtfully done.":"You found your way."}</h2><p>{session.walk.moves} steps · {session.walk.bumps} bumps · {session.walk.peeks} peeks</p></div><div className="mw-final-score">{points(map,session.walk)}<span>POINTS</span></div><div className="mw-finish-actions"><button className="mw-button" onClick={share}>{copied?"Copied!":"Share my walk"} ↗</button><button className="mw-button mw-button-light" onClick={practice}>One more map</button><button className="mw-text-button" onClick={()=>setShowRoute(!showRoute)}>{showRoute?"Hide route notes":"How did I do?"}</button></div>{showRoute&&<p className="mw-route-note">The shortest route takes {map.optimal} steps. You took {session.walk.moves-map.optimal} extra. Start with the thought nearest your path, and save one near the exit for last.</p>}</section>}
      <div className="mw-scorebar"><span><strong>{session.walk.moves}</strong> steps</span><span><strong>{session.walk.bumps}</strong> bumps</span><span><strong>{session.walk.peeks}</strong> peeks</span><span className="mw-live-score"><strong>{points(map,session.walk)}</strong> / 1,000</span></div>
      <p className="mw-keyboard">Arrow keys or WASD · tap a neighboring square · no timer once you’re walking</p>
    </section>
    <aside className="mw-sidebar"><section className="mw-note"><span className="mw-kicker">THE SHORT VERSION</span><h2>See it.<br/>Keep it.<br/><em>Find it.</em></h2><ol><li><span>01</span><p><strong>Remember the walls.</strong> Study the map before they disappear. The thoughts and exit stay visible.</p></li><li><span>02</span><p><strong>Gather all three thoughts.</strong> Take any route, in any order. Your dot moves one square at a time.</p></li><li><span>03</span><p><strong>Head for the arrow.</strong> Finish with fewer detours, bumps, and peeks for a better score.</p></li></ol><div className="mw-legend"><span><i className="legend-you"/> You</span><span><i className="legend-wall"/> Wall</span><span>↗ Exit</span></div></section>
      <section className="mw-daily-note"><p>A fresh daily maze for everyone. Compare your walk with a friend, then come back tomorrow.</p><div className="mw-streak"><strong>{streak}</strong><span>day{streak===1?"":"s"} in a row<br/><small>on this browser</small></span><span aria-hidden="true">✦</span></div></section>
      <section className="mw-memory-note"><Link href="/articles">Keep exploring Grey Matters ↗</Link></section>
      {!daily?<button className="mw-text-button" onClick={returnDaily}>Back to today’s walk →</button>:!done&&session.phase==="ready"&&<button className="mw-text-button" onClick={practice}>Try a practice map first →</button>}
    </aside></div>
    <footer className="mw-bottom"><span>NOT EVERY WANDER IS A WRONG TURN.</span><span>GREY MATTERS AT THE UNIVERSITY OF PENNSYLVANIA</span></footer>
    {storageWarning&&<p className="mw-storage" role="status">Browser storage is unavailable. Your progress will last for this visit.</p>}
  </div>;
}
