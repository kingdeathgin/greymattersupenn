import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=ts.transpileModule(fs.readFileSync(new URL('../lib/synapse.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {generatePuzzle,feedback}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const seed=fs.readFileSync(new URL('../lib/synapse-secret.ts',import.meta.url),'utf8').match(/const SEED = "([^"]+)"/)[1];
const origin=process.env.GAME_TEST_ORIGIN ?? 'http://localhost:3001';
assert.ok(['localhost','127.0.0.1'].includes(new URL(origin).hostname),'API tests must use a local test database.');
async function request(body,cookie='',customOrigin=origin){const r=await fetch(origin+'/api/synapse',{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(body?{Origin:customOrigin}:{}),...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]??cookie};}
assert.equal((await request({action:'start'},'', 'https://example.com')).status,403);
const daily=await request();assert.equal(daily.status,200);assert.equal(daily.data.unavailable,undefined);assert.equal('answer' in daily.data.puzzle,false);
const answer=generatePuzzle(daily.data.puzzle.day,seed).answer;
const a=await request({action:'start'}),b=await request({action:'start'});assert.equal(a.status,200);assert.ok(a.cookie);assert.equal(b.status,200);
const runId=a.data.round.runId;
assert.equal((await request({action:'guess',runId,turn:0,signals:answer},b.cookie)).status,404);
assert.equal((await request({action:'guess',runId,turn:0,signals:[0,0,1,2,3]},a.cookie)).status,400);
assert.equal((await request({action:'publish',runId,nickname:'ReviewNeuron'},a.cookie)).status,400);
const wrong=[...answer.slice(1),answer[0]];
const guessed=await request({action:'guess',runId,turn:0,signals:wrong},a.cookie);
assert.equal(guessed.status,200);assert.equal(guessed.data.round.finished,false);assert.equal('answer' in guessed.data.round,false);assert.deepEqual(guessed.data.round.guesses[0],feedback(answer,wrong));
assert.equal((await request({action:'guess',runId,turn:0,signals:answer},a.cookie)).status,409);
assert.equal((await request({action:'guess',runId,turn:1,signals:wrong},a.cookie)).status,400);
const resumed=await request(null,a.cookie);assert.deepEqual(resumed.data.round,guessed.data.round);
const restarted=await request({action:'start'},a.cookie);assert.equal(restarted.data.round.runId,runId);assert.equal(restarted.data.round.guesses.length,1);
const solved=await request({action:'guess',runId,turn:1,signals:answer,score:999999,elapsedMs:0},a.cookie);
assert.equal(solved.status,200);assert.equal(solved.data.round.score,880);assert.ok(solved.data.round.elapsedMs>0);assert.equal(solved.data.round.won,true);assert.deepEqual(solved.data.round.answer,answer);
const replay=await request({action:'guess',runId,turn:2,signals:wrong},a.cookie);assert.deepEqual(replay.data,solved.data);
const nickname='Review'+Date.now().toString().slice(-10);
assert.equal((await request({action:'publish',runId,nickname:'<script>'},a.cookie)).status,400);
assert.equal((await request({action:'publish',runId,nickname},a.cookie)).status,200);assert.equal((await request({action:'publish',runId,nickname},a.cookie)).status,200);
const after=await request(null,a.cookie);assert.equal(after.data.best.score,880);const leader=after.data.leaderboard.find(e=>e.nickname===nickname);assert.equal(leader.points,880);assert.equal(leader.days,1);
assert.equal((await request({action:'guess',runId:b.data.round.runId,turn:0,signals:answer},b.cookie)).status,200);
assert.equal((await request({action:'publish',runId:b.data.round.runId,nickname},b.cookie)).status,409);
const loser=await request({action:'start'});
for(let i=0;i<6;i++) {
 const signals=[...answer.slice(i%5),...answer.slice(0,i%5)];if(!i) [signals[0],signals[1]]=[signals[1],signals[0]];if(i===5) [signals[2],signals[3]]=[signals[3],signals[2]];
 const result=await request({action:'guess',runId:loser.data.round.runId,turn:i,signals},loser.cookie);assert.equal(result.status,200);
 if(i===5){assert.equal(result.data.round.finished,true);assert.equal(result.data.round.won,false);assert.deepEqual(result.data.round.answer,answer);}
}
assert.equal((await request({action:'publish',runId:loser.data.round.runId,nickname:'ShouldNotRank'},loser.cookie)).status,400);
console.log('API checks passed: hidden answer, truthful feedback, invalid/duplicate guesses, player ownership, stale tabs, saved progress, one daily round, server score/time, immutable outcomes, idempotent ranking, nickname conflicts, six-guess loss.');
