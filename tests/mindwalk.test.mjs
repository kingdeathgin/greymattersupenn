import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source=ts.transpileModule(readFileSync(new URL('../lib/mindwalk.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {makeMap,newWalk,move,pathBetween,bestRoute,points,neighbors,validWalk}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('a year of daily mazes is deterministic, connected, varied and solvable',()=>{
  const seen=new Set();
  for(let i=0;i<365;i++){
    const day=new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10);
    const map=makeMap(`daily:${day}`);
    assert.deepEqual(map,makeMap(`daily:${day}`));
    assert.equal(map.walls.length,12);
    assert.equal(new Set(map.thoughts).size,3);
    for(let cell=0;cell<36;cell++)if(!map.walls.includes(cell))assert.ok(pathBetween(map.walls,0,cell).length);
    const route=bestRoute(map);
    assert.ok(map.optimal>=20&&map.optimal<=32);
    let walk=newWalk(map);
    for(const cell of route.slice(1))walk=move(map,walk,cell);
    assert.equal(walk.finished,true);
    assert.equal(walk.collected.length,3);
    assert.equal(walk.moves,map.optimal);
    assert.equal(points(map,walk),1000);
    assert.equal(validWalk(walk,map),true);
    assert.equal(move(map,walk,neighbors(walk.position)[0]),walk);
    seen.add(map.walls.join()+map.thoughts.join());
  }
  assert.ok(seen.size>350);
});
test('wall bumps reveal only the wall and never move or collect',()=>{
  const map=makeMap('daily:2026-10-09');
  const wall=map.walls.find(w=>neighbors(w).some(n=>!map.walls.includes(n)));
  const position=neighbors(wall).find(n=>!map.walls.includes(n));
  const walk={...newWalk(map),position,visited:[...new Set([0,position])]};
  const bumped=move(map,walk,wall);
  assert.equal(bumped.position,position);assert.equal(bumped.moves,0);assert.equal(bumped.bumps,1);
  assert.deepEqual(bumped.revealedWalls,[wall]);assert.equal(points(map,bumped),950);
  const twice=move(map,bumped,wall);assert.deepEqual(twice.revealedWalls,[wall]);
});
test('movement cannot wrap rows, skip squares or finish without thoughts',()=>{
  const map={seed:'test',walls:[],thoughts:[7,14,21],start:0,exit:35,optimal:10};
  const walk=newWalk(map);
  assert.equal(move(map,walk,6).position,6);
  assert.equal(move(map,walk,5),walk);
  assert.equal(move(map,{...walk,position:5},6).position,5);
  const atExit=move(map,{...walk,position:34},35);assert.equal(atExit.finished,false);
  const completed=move(map,{...walk,position:34,collected:[7,14,21]},35);assert.equal(completed.finished,true);
  const collected=move(map,{...walk,position:1},7);assert.deepEqual(collected.collected,[7]);
  assert.deepEqual(move(map,{...collected,position:1},7).collected,[7]);
});
test('save validation rejects malformed storage and scoring is bounded',()=>{
  const map=makeMap('validation'),walk=newWalk(map);
  for(const invalid of [null,{}, {...walk,position:map.walls[0]},{...walk,collected:[1,2,3]},{...walk,moves:-1},{...walk,visited:[0,0]},{...walk,finished:true}])assert.equal(validWalk(invalid,map),false);
  assert.equal(validWalk(walk,map),true);
  assert.equal(points(map,{...walk,peeks:1}),900);
  assert.equal(points(map,{...walk,moves:1000,bumps:100,peeks:100}),100);
});
