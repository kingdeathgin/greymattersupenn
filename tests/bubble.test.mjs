import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../lib/bubble.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 } }).outputText;
const { validDrawing, STATES, validThemes, themeSimilarity, stateSimilarities, similarityColor, themeStats } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const stroke = { kind: 'stroke', points: [{ x: 10, y: 20 }, { x: 200, y: 300 }], color: '#243b36', width: 3 };

test('accepts strokes, labels and resized emoji together', () => {
  assert.equal(validDrawing([stroke, { kind: 'text', point: { x: 5, y: 5 }, text: 'My home', color: '#243b36' }, { kind: 'sticker', point: { x: 100, y: 100 }, emoji: '🏠', name: 'Home', size: 240 }]), true);
});
test('rejects empty, malformed and eraser-only submissions', () => {
  for (const value of [[], null, {}, [null], [{ ...stroke, points: [] }], [{ ...stroke, color: '#ffffff' }], [{ ...stroke, width: NaN }], [{ kind: 'html', text: '<script>alert(1)</script>' }]]) assert.equal(validDrawing(value), false);
});
test('rejects unsafe colors, nonfinite geometry and excessive payloads', () => {
  assert.equal(validDrawing([{ ...stroke, color: 'url(https://example.com)' }]), false);
  assert.equal(validDrawing([{ ...stroke, points: [{ x: Infinity, y: 1 }] }]), false);
  assert.equal(validDrawing(Array(2001).fill(stroke)), false);
  assert.equal(validDrawing([{ ...stroke, points: Array(40001).fill({ x: 1, y: 1 }) }]), false);
});
test('map contains every selectable state and DC at valid positions', () => {
  const shapes = JSON.parse(readFileSync(new URL('../data/bubble-us-map.json', import.meta.url)));
  assert.deepEqual(shapes.map(s => s.name).sort(), [...STATES].sort());
  for (const shape of shapes) {
    assert.ok(shape.x > 0 && shape.x < 960 && shape.y > 0 && shape.y < 620, shape.name);
    assert.ok(shape.path.startsWith('M'), shape.name);
  }
});


test('theme validation requires one to three distinct supported choices', () => {
  assert.equal(validThemes(['Language', 'Race & belonging']), true);
  for (const value of [[], ['Unknown'], ['Language', 'Language'], ['Language', 'Media', 'Neighborhood', 'Family & friends'], null]) assert.equal(validThemes(value), false);
});
test('similarity measures overlap, handles missing data and ignores duplicates', () => {
  assert.equal(themeSimilarity(['Language'], ['Language']), 1);
  assert.equal(themeSimilarity(['Language'], ['Media']), 0);
  assert.equal(themeSimilarity(['Language', 'Media'], ['Language', 'Neighborhood']), 1 / 3);
  assert.equal(themeSimilarity([], ['Language']), null);
  assert.equal(themeSimilarity(['Language', 'Language'], ['Language']), 1);
});
test('state averages exclude the reference and untagged legacy submissions', () => {
  const reference = { id: 'a', state: 'Florida', themes: ['Language'] };
  const samples = [reference, { id: 'b', state: 'Florida', themes: ['Media'] }, { id: 'c', state: 'Florida', themes: ['Language'] }, { id: 'd', state: 'Texas', themes: [] }];
  assert.deepEqual(stateSimilarities(samples, reference).get('Florida'), {score: 0.5, count: 2});
  assert.equal(stateSimilarities(samples, reference).has('Texas'), false);
  assert.equal(stateSimilarities([reference], reference).size, 0);
  assert.equal(stateSimilarities(samples, undefined).size, 0);
  assert.notEqual(similarityColor(0), similarityColor(undefined));
  assert.notEqual(similarityColor(0), similarityColor(1));
});


test('stats rank selected categories and count each submission once per theme', () => {
  const stats = themeStats([{themes:['Language','Media','Language']},{themes:['Language']},{themes:[]}]);
  assert.deepEqual(stats[0], {theme:'Language',count:2,percent:100});
  assert.deepEqual(stats[1], {theme:'Media',count:1,percent:50});
  assert.equal(stats.filter(row=>row.count===0).length,9);
  assert.ok(themeStats([]).every(row=>row.count===0 && row.percent===0));
});
