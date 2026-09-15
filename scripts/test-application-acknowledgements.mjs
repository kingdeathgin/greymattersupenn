import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import crypto from 'node:crypto';

function load(file, imports = {}, globals = {}) {
  const context = { exports: {}, FormData, Buffer, ...globals, require: (name) => {
    if (name === 'server-only') return {};
    if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
    return imports[name];
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
  return context.exports;
}
const saved = new Set();
let failSave = false;
const roster = load('lib/application-roster.ts');
const actions = load('app/application-update/actions.ts', {
  '@/lib/application-roster': roster,
  '@/lib/application-store': { saveAcknowledgement: async (email) => { if (failSave) throw Error('DB down'); saved.add(email); } },
  'next/navigation': { redirect: (path) => { throw new Error(`REDIRECT:${path}`); } },
});
let cookie;
const env = { APPLICATION_ADMIN_PASSWORD: 'test-secret-long-enough' };
const admin = load('lib/application-admin.ts', {
  'node:crypto': crypto,
  'next/headers': { cookies: async () => ({ get: () => cookie }) },
}, { process: { env } });
const checked = new FormData();
checked.set('acknowledged', 'yes');

await assert.rejects(async () => { const form = new FormData(); form.set('email', ' ELGIN@SAS.UPENN.EDU '); await actions.checkApplication({}, form); }, /REDIRECT:\/application-update\/admin/);
assert.ok((await actions.acknowledgeApplication('habibmh@sas.upenn.edu', {}, new FormData())).error);
assert.ok((await actions.acknowledgeApplication('unknown@example.com', {}, checked)).error);
assert.ok((await actions.acknowledgeApplication('elgin@sas.upenn.edu', {}, checked)).error);
assert.equal(saved.size, 0);
for (const email of [...roster.members.map(m => m[0]), ...Object.keys(roster.declinedMembers)]) {
  assert.equal((await actions.acknowledgeApplication(` ${email.toUpperCase()} `, {}, checked)).success, true);
  assert.ok(saved.has(email));
}
assert.equal(saved.size, 42);
await actions.acknowledgeApplication('habibmh@sas.upenn.edu', {}, checked);
assert.equal(saved.size, 42);
failSave = true;
assert.ok((await actions.acknowledgeApplication('habibmh@sas.upenn.edu', {}, checked)).error);
assert.equal(admin.passwordsMatch('abc', 'abc'), true);
assert.equal(admin.passwordsMatch('abc', 'abcd'), false);
const token = admin.createAdminSession(env.APPLICATION_ADMIN_PASSWORD);
assert.equal(admin.validAdminSession(token, env.APPLICATION_ADMIN_PASSWORD), true);
assert.equal(admin.validAdminSession(token, 'wrong'), false);
assert.equal(admin.validAdminSession(token, env.APPLICATION_ADMIN_PASSWORD, Date.now() + 9 * 60 * 60 * 1000), false);
for (const invalid of ['', 'elgin@sas.upenn.edu', token + ':extra', token.replace('elgin', 'someone'), token.slice(0, -1)]) assert.equal(admin.validAdminSession(invalid, env.APPLICATION_ADMIN_PASSWORD), false);
assert.equal(await admin.isApplicationAdmin(), false);
cookie = { value: 'elgin@sas.upenn.edu' };
assert.equal(await admin.isApplicationAdmin(), false);
cookie = { value: token };
assert.equal(await admin.isApplicationAdmin(), true);
delete env.APPLICATION_ADMIN_PASSWORD;
assert.equal(await admin.isApplicationAdmin(), false);
console.log('Passed: all 42 applicants, checkbox validation, normalization, save failures, admin redirect, password comparison, signed session expiry/tampering, and unauthenticated access.');
