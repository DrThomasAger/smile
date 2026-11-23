// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module C, prompt to Sangha, acknowledgement and resend.
const test = require('node:test'), assert = require('node:assert');
const { startHost, until } = require('./helpers');
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());
const shell = async () => (await h.json('/api/spawn', { cmd: 'bash --norc' })).id;
const forJob = async job => (await h.ledger()).filter(e => e.job === job);

test('C1 each job gets its own acknowledgement token', async () => {
  const id = await shell();
  const a = await h.json('/api/swarm', { ids: [id], text: 'true', waitMs: 60000 }), b = await h.json('/api/swarm', { ids: [id], text: 'true', waitMs: 60000 });
  assert.notStrictEqual(a.ack, b.ack); assert.ok(a.ack.endsWith(a.job));
});
test('C2 a window that acknowledges is marked followed on the first try', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo {ACK}', waitMs: 600 });
  await until(async () => (await forJob(job)).some(e => e.kind === 'followed' && e.tries === 1));
  await new Promise(r => setTimeout(r, 900));
  assert.strictEqual((await forJob(job)).filter(e => e.kind === 'prompt').length, 1);
});
test('C3 a window that never acknowledges is sent the instruction 1 + retries times', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: "echo lotus # {ACK}", waitMs: 300, retries: 2 });
  await until(async () => (await forJob(job)).filter(e => e.kind === 'not-followed').length === 3);
  assert.strictEqual((await forJob(job)).filter(e => e.kind === 'prompt').length, 3);
});
test('C4 the typed echo of the prompt alone never counts as following', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: ': {ACK}', waitMs: 400, retries: 0 });
  await until(async () => (await forJob(job)).some(e => e.kind === 'not-followed'));
});
test('C5 one job acknowledging does not mark another job followed', async () => {
  const id = await shell();
  const silent = await h.json('/api/swarm', { ids: [id], text: "echo lotus # {ACK}", waitMs: 500, retries: 0 });
  await h.json('/api/swarm', { ids: [id], text: 'echo {ACK}', waitMs: 500, retries: 0 });
  await until(async () => (await forJob(silent.job)).some(e => e.kind === 'not-followed'));
});
test('C6 a prompt without the placeholder still carries the token', async () => {
  const id = await shell(); const { job, ack } = await h.json('/api/swarm', { ids: [id], text: 'echo lotus', waitMs: 60000 });
  assert.ok((await until(async () => (await forJob(job)).find(e => e.kind === 'prompt'))).text.includes(ack));
});
test('C7 empty ids send to every live window and skip ended ones', async () => {
  const live = await shell(); const ended = (await h.json('/api/spawn', { cmd: 'true' })).id;
  await until(async () => (await h.json('/api/windows')).find(w => w.id === ended && !w.alive));
  const { sent } = await h.json('/api/swarm', { ids: [], text: 'true', waitMs: 60000 });
  assert.ok(sent.includes(live)); assert.ok(!sent.includes(ended));
});
test('C8 unknown ids are skipped', async () => assert.deepStrictEqual((await h.json('/api/swarm', { ids: ['1111'], text: 'true' })).sent, []));
test('C9 multi-line prompts arrive as one line', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo a\necho {ACK}', waitMs: 600, retries: 0 });
  await until(async () => (await forJob(job)).some(e => e.kind === 'followed'));
});
test('C11 text typed before the program is ready is echoed once and still judged correctly', async () => {
  const id = (await h.json('/api/spawn', { cmd: 'sleep 0.5; bash --norc' })).id;
  const { job } = await h.json('/api/swarm', { ids: [id], text: ': {ACK}', waitMs: 500, retries: 0 });
  await until(async () => (await forJob(job)).some(e => e.kind === 'not-followed'));
});
test('C10 several windows are tracked independently', async () => {
  const a = await shell(), b = await shell();
  const { job } = await h.json('/api/swarm', { ids: [a, b], text: 'echo {ACK}', waitMs: 600, retries: 0 });
  await until(async () => new Set((await forJob(job)).filter(e => e.kind === 'followed').map(e => e.id)).size === 2);
});
