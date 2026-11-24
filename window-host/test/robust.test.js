// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module I, the running host given what it should refuse, and still answering after each.
const test = require('node:test'), assert = require('node:assert'), os = require('os'), net = require('net');
const { startHost, until } = require('./helpers');
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());
const raw = (p, body) => fetch(h.base + p, { method: 'POST', body });
const still = async () => assert.ok(Array.isArray(await h.json('/api/windows')));

test('I1 a request that is not JSON answers 400 and the host goes on', async () => { assert.strictEqual((await raw('/api/spawn', '{lotus')).status, 400); await still(); });
test('I2 a window with no command answers 400 and opens nothing', async () => { const n = (await h.json('/api/windows')).length;
  for (const b of ['{}', '{"cmd":""}', '{"cmd":"   "}', '{"cmd":44}']) assert.strictEqual((await raw('/api/spawn', b)).status, 400, b);
  assert.strictEqual((await h.json('/api/windows')).length, n); });
test('I3 an instruction with no words answers 400 for both sends', async () => { for (const p of ['/api/swarm', '/api/prompter']) for (const b of ['{}', '{"text":"  "}']) assert.strictEqual((await raw(p, b)).status, 400, p + b); });
test('I4 a screenshot that is no png answers 400', async () => { for (const b of ['{}', '{"png":"lotus"}', '{"png":"data:image/jpeg;base64,AAAA"}']) assert.strictEqual((await raw('/api/shot', b)).status, 400, b); await still(); });
test('I5 an unknown call answers 404 as JSON', async () => { const r = await h.api('/api/lotus'); assert.strictEqual(r.status, 404); assert.ok(JSON.parse(r.text).error); });
test('I6 the host code, its data and other libraries are given to no browser', async () => { await h.json('/api/spawn', { cmd: 'bash --norc', keep: true });
  for (const p of ['/server.js', '/logic.js', '/package.json', '/data/swarm-ledger.jsonl', '/data/windows.json', '/values-judge.smile', '/vendor/node-pty/package.json', '/test/helpers.js', '/styles/../server.js'])
    assert.strictEqual((await h.api(p)).status, 404, p); });
test('I7 the host answers this PC only, and no other address of the machine', async () => {
  const port = +new URL(h.base).port, others = Object.values(os.networkInterfaces()).flat().filter(a => a.family === 'IPv4' && !a.internal).map(a => a.address);
  for (const host of others) await new Promise((ok, no) => { const s = net.connect({ host, port, timeout: 1500 }); s.on('connect', () => { s.destroy(); no(new Error('answered on ' + host)); }); s.on('error', ok); s.on('timeout', () => { s.destroy(); ok(); }); });
});
test('I8 a folder that does not exist opens the window in the host folder', async () => { const { id } = await h.json('/api/spawn', { cmd: 'bash --norc', cwd: '/no/such/lotus/folder' });
  assert.ok((await h.json('/api/windows')).find(w => w.id === id).alive); });
test('I9 keys typed into a kept loop reach it after it has started again', async () => {
  const WebSocket = require('ws'); const { id } = await h.json('/api/spawn', { cmd: 'read x; echo got-$x', keep: true });
  const ws = new WebSocket(h.base.replace('http', 'ws') + '/?id=' + id); let seen = ''; ws.on('message', m => seen += m); await new Promise(r => ws.on('open', r));
  ws.send('first\r'); await until(() => seen.includes('got-first')); await until(async () => (await h.json('/api/windows')).find(w => w.id === id).restarts >= 1);
  await new Promise(r => setTimeout(r, 400)); ws.send('second\r'); await until(() => seen.includes('got-second')); ws.close(); await h.json('/api/kill', { id });
});
test('I10 a resize the host should refuse changes nothing and the window goes on', async () => {
  const WebSocket = require('ws'); const { id } = await h.json('/api/spawn', { cmd: 'bash --norc' });
  const ws = new WebSocket(h.base.replace('http', 'ws') + '/?id=' + id); let seen = ''; ws.on('message', m => seen += m); await new Promise(r => ws.on('open', r));
  for (const m of ['\x00resize:0x0', '\x00resize:axb', '\x00resize:99999x9', '\x00resize:-4x4']) ws.send(m);
  await new Promise(r => setTimeout(r, 400)); ws.send('tput cols\r'); await until(() => /\b100\b/.test(seen)); ws.close();
});
test('I11 a window page for an unknown id is closed at once', async () => { const WebSocket = require('ws'); const ws = new WebSocket(h.base.replace('http', 'ws') + '/?id=4444'); await new Promise(r => ws.on('close', r)); });
test('I12 forty four sends at once all answer and the host goes on', async () => { const { id } = await h.json('/api/spawn', { cmd: 'bash --norc' });
  const rs = await Promise.all(Array.from({ length: 44 }, () => h.json('/api/swarm', { ids: [id], text: 'true', waitMs: 60000 }))); assert.strictEqual(new Set(rs.map(r => r.ack)).size, 44); await still(); });

// a stand-in program that shows a trust screen and goes on only when given down then Enter
const trustProgram = `printf 'Yes, I trust this folder\\n Enter to confirm\\n'; IFS= read -rsn3 a; IFS= read -r b; if [ "$a" = "$(printf '\\033[B')" ]; then echo went-on-lotus; else echo wrong-keys; fi; sleep 5`;
test('I13 with answer on, a first screen is answered and the program goes on', async () => {
  const { id } = await h.json('/api/spawn', { cmd: trustProgram, answer: true });
  await until(async () => (await h.ledger()).some(e => e.kind === 'screen-answered' && e.id === id));
  const WebSocket = require('ws'); const ws = new WebSocket(h.base.replace('http', 'ws') + '/?id=' + id); let seen = ''; ws.on('message', m => seen += m);
  await until(() => seen.includes('went-on-lotus')); ws.close();
});
test('I14 with answer off, a first screen is left for the person', async () => {
  const { id } = await h.json('/api/spawn', { cmd: trustProgram }); await new Promise(r => setTimeout(r, 1500));
  assert.ok(!(await h.ledger()).some(e => e.kind === 'screen-answered' && e.id === id));
});
