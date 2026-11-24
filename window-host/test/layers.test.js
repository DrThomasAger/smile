// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module F, the layers. Worker loops restart alone, the Prompter prompts the rest, windows return after the host restarts.
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path');
const { spawn } = require('child_process');
const { startHost, until } = require('./helpers');
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());

test('F1 a kept worker loop is restarted when it ends, with no agent involved', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'echo lap; sleep 0.3', keep: true });
  await until(async () => (await h.json('/api/windows')).find(w => w.id === id && w.restarts >= 2));
  assert.ok((await h.ledger()).filter(e => e.kind === 'restart' && e.id === id).length >= 2);
});
test('F2 a window that is not kept stays ended', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'true' });
  await new Promise(r => setTimeout(r, 1200));
  assert.strictEqual((await h.json('/api/windows')).find(w => w.id === id).restarts, 0);
});
test('F3 closing a kept window ends its loop for good', async () => {
  const { id } = await h.json('/api/spawn', { cmd: 'sleep 0.2', keep: true });
  await h.json('/api/kill', { id }); await new Promise(r => setTimeout(r, 1200));
  assert.ok(!(await h.json('/api/windows')).some(w => w.id === id));
});
test('F4 sending to the Prompter with none open says so', async () => {
  const r = await h.api('/api/prompter', { text: 'lotus' }); assert.strictEqual(r.status, 409);
});
test('F5 the Prompter receives the instruction, the host address and its worker list, and no worker is prompted directly', async () => {
  const p = (await h.json('/api/spawn', { cmd: 'bash --norc', role: 'prompter' })).id;
  const wk = (await h.json('/api/spawn', { cmd: 'bash --norc' })).id;
  const r = await h.json('/api/prompter', { text: 'climb the pyramid', waitMs: 60000 });
  assert.deepStrictEqual(r.sent, [p]);
  const sent = await until(async () => (await h.ledger()).find(e => e.kind === 'prompt' && e.job === r.job));
  for (const s of ['climb the pyramid', 'You are the Prompter', '/api/swarm', `${wk} bash --norc`]) assert.ok(sent.text.includes(s), s);
  assert.ok(!(await h.ledger()).some(e => e.kind === 'prompt' && e.job === r.job && e.id === wk));
});
test('F6 the Prompter can prompt a worker itself through the host', async () => {
  const p = (await h.json('/api/spawn', { cmd: 'bash --norc', role: 'prompter' })).id;
  const wk = (await h.json('/api/spawn', { cmd: 'bash --norc' })).id;
  await new Promise(r => setTimeout(r, 600));
  await h.json('/api/swarm', { ids: [p], text: `curl -s --noproxy '*' -XPOST ${h.base}/api/swarm -d '{"ids":["${wk}"],"text":"echo from-prompter-44"}' # {ACK}`, waitMs: 60000 });
  await until(async () => (await h.ledger()).some(e => e.kind === 'prompt' && e.id === wk && e.text.includes('from-prompter-44')));
});
test('F7 kept windows and the Prompter are opened again after the host restarts', async () => {
  const k = (await h.json('/api/spawn', { cmd: 'sleep 4444', keep: true })).id;
  h.stop(); await new Promise(r => setTimeout(r, 400));
  const proc = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: new URL(h.base).port, SMILE_DATA: h.data }, stdio: 'pipe' });
  await new Promise(ok => proc.stdout.on('data', d => String(d).includes('Smile Window Host') && ok()));
  h.stop = () => proc.kill();
  const ws = await h.json('/api/windows');
  assert.ok(ws.some(w => w.id === k && w.alive && w.keep)); assert.ok(ws.some(w => w.role === 'prompter'));
  assert.ok(!ws.some(w => !w.keep && w.role !== 'prompter'));
});
