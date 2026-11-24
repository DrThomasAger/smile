// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module A, the window lifecycle over the HTTP interface.
const test = require('node:test'), assert = require('node:assert');
const { startHost, until } = require('./helpers');
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());

test('A1 a fresh host lists no windows', async () => assert.deepStrictEqual(await h.json('/api/windows'), []));
test('A2 spawning returns a numeric id and the window is listed alive', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'bash' });
  assert.match(id, /^\d+$/);
  assert.ok((await h.json('/api/windows')).some(w => w.id === id && w.alive && w.cmd === 'bash'));
});
test('A3 ids are unique and increase', async () => {
  const a = (await h.json('/api/spawn', { cmd: 'bash' })).id, b = (await h.json('/api/spawn', { cmd: 'bash' })).id;
  assert.ok(+b > +a);
});
test('A4 a program that finishes is marked not alive', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'echo lotus' });
  await until(async () => (await h.json('/api/windows')).find(w => w.id === id && !w.alive));
});
test('A5 kill removes the window from the list', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'bash' });
  await h.json('/api/kill', { id });
  assert.ok(!(await h.json('/api/windows')).some(w => w.id === id));
});
test('A6 kill of an unknown id is harmless', async () => assert.deepStrictEqual(await h.json('/api/kill', { id: '4444' }), { ok: true }));
test('A7 spawn honours the working directory', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'pwd; sleep 1', cwd: '/tmp' });
  const r = await h.json('/api/swarm', { ids: [id], text: 'noop', waitMs: 60000 });
  assert.deepStrictEqual(r.sent, [id]);
});
test('A8 every spawn is written to the ledger', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'bash' });
  assert.ok((await h.ledger()).some(e => e.kind === 'spawn' && e.id === id));
});
