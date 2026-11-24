// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module G, the sworn values judge. A stand-in judge command answers by what the window wrote, so no model is called.
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), os = require('os'), path = require('path');
const { startHost, until } = require('./helpers');
// the stand-in reads the prompt on stdin: a reply holding "thorn" departs, anything else adheres
const stub = path.join(os.tmpdir(), 'smile-judge-stub.sh');
fs.writeFileSync(stub, '#!/bin/sh\np=$(cat)\necho "$p" > "$0.last"\ncase "$p" in *said-thorn*) echo "DEPARTS The value of kind words, the reply said thorn.";; *) echo "ADHERES";; esac\n', { mode: 0o755 });
process.env.SMILE_JUDGE = stub;
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());
const shell = async () => (await h.json('/api/spawn', { cmd: 'bash --norc' })).id;
const forJob = async job => (await h.ledger()).filter(e => e.job === job);

test('G1 a followed reply that keeps the values is marked adheres and is sent once', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo {ACK} lotus', waitMs: 600, values: 'Kind words.' });
  await until(async () => (await forJob(job)).some(e => e.kind === 'adheres'));
  await new Promise(r => setTimeout(r, 900)); assert.strictEqual((await forJob(job)).filter(e => e.kind === 'prompt').length, 1);
});
test('G2 a reply that departs is sent back with the judge sentence, up to the retries', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo {ACK} said-$(printf thorn) #', waitMs: 500, retries: 1, values: 'Kind words.' });
  await until(async () => (await forJob(job)).filter(e => e.kind === 'departs').length === 2, 12000);
  const prompts = (await forJob(job)).filter(e => e.kind === 'prompt'); assert.strictEqual(prompts.length, 2);
});
test('G3 the judge is given the values, the instruction and what the window wrote', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo {ACK} jasmine-44', waitMs: 500, values: 'value-1717', instruction: 'instruction-1111' });
  await until(async () => (await forJob(job)).some(e => e.kind === 'adheres'));
  const p = fs.readFileSync(stub + '.last', 'utf8'); for (const s of ['value-1717', 'instruction-1111', 'jasmine-44', 'Sworn values judge']) assert.ok(p.includes(s), s);
});
test('G4 with no values given no judge runs', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo {ACK}', waitMs: 500 });
  await until(async () => (await forJob(job)).some(e => e.kind === 'followed')); await new Promise(r => setTimeout(r, 800));
  assert.ok(!(await forJob(job)).some(e => /adheres|departs|judge/.test(e.kind)));
});
test('G5 a window that never follows is not judged', async () => {
  const id = await shell(); const { job } = await h.json('/api/swarm', { ids: [id], text: 'echo lotus # {ACK}', waitMs: 400, retries: 0, values: 'Kind words.' });
  await until(async () => (await forJob(job)).some(e => e.kind === 'not-followed')); await new Promise(r => setTimeout(r, 600));
  assert.ok(!(await forJob(job)).some(e => /adheres|departs/.test(e.kind)));
});
