import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync(new URL('../lib/synapse.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { generatePuzzle, feedback, matchesClues, scoreFor, validGuess, easternDay, weekStart, validNickname } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
function permutations(values, length) { if (!length) return [[]]; return values.flatMap(v => permutations(values.filter(x => x!==v),length-1).map(p=>[v,...p])); }
const codes = permutations([0,1,2,3,4,5,6,7],5);
test('daily codes and truthful clues are deterministic across two years', () => {
  const fingerprints = new Set();
  for (let i=0;i<730;i++) {
    const day = new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10);
    const generated = generatePuzzle(day,'test-secret');
    assert.deepEqual(generated,generatePuzzle(day,'test-secret'));
    assert.equal(validGuess(generated.answer),true);
    assert.equal(matchesClues(generated.puzzle,generated.answer),true);
    assert.equal('answer' in generated.puzzle,false);
    fingerprints.add(generated.answer.join());
  }
  assert.ok(fingerprints.size>650);
});
test('clues leave real uncertainty and aggregate feedback is consistent', () => {
  for(let i=1;i<=31;i++) {
    const {puzzle,answer} = generatePuzzle(`2026-10-${String(i).padStart(2,'0')}`,'test-secret');
    const candidates=codes.filter(c=>matchesClues(puzzle,c));
    assert.ok(candidates.length>=500 && candidates.length<=2000,`${candidates.length} candidates`);
    for(const guess of candidates.slice(0,20)) {
      const result=feedback(answer,guess);
      assert.ok(result.exact+result.misplaced<=5);
      assert.equal(result.exact+result.misplaced,guess.filter(v=>answer.includes(v)).length);
      assert.equal(result.exact===5,guess.join()===answer.join());
    }
  }
});
test('feedback separates exact, misplaced, and absent signals',()=>{
  assert.deepEqual(feedback([0,1,2,3,4],[0,1,4,5,6]),{signals:[0,1,4,5,6],exact:2,misplaced:1});
  assert.equal(feedback([0,1,2,3,4],[4,0,1,2,3]).misplaced,5);
  for(const bad of [null,{},[],[0,1,2,3],[0,1,2,3,4,5],[0,0,1,2,3],[0,1,2,3,8],[0,1,2,3,-1],[0,1,2,3,4.5]]) assert.equal(validGuess(bad),false);
  assert.equal(scoreFor(1),1000);assert.equal(scoreFor(6),400);
});
test('daily and weekly dates follow Eastern time across DST and year boundaries',()=>{
  assert.equal(easternDay(new Date('2026-10-10T03:59:59Z')),'2026-10-09');
  assert.equal(easternDay(new Date('2026-10-10T04:00:00Z')),'2026-10-10');
  assert.equal(easternDay(new Date('2026-12-02T04:59:59Z')),'2026-12-01');
  assert.equal(weekStart('2026-10-11'),'2026-10-05');assert.equal(weekStart('2026-10-12'),'2026-10-12');assert.equal(weekStart('2027-01-01'),'2026-12-28');
});
test('public nicknames exclude markup, controls, and oversized names',()=>{
  for(const n of ['PennNeuron','Quiet neuron-7','Amy.G','Neuron_12']) assert.equal(validNickname(n),true);
  for(const n of ['x','','A\nB','<script>','N'.repeat(21),null,{},'🚀']) assert.equal(validNickname(n),false);
});
