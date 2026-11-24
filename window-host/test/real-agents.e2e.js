// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// End to end with real models, run by hand since each case calls a model: node test/real-agents.e2e.js
// Case 1, the real judge reads unkind words and answers DEPARTS. Case 2, a real Claude Code as the Prompter
// prompts a worker window itself through the host. Each case answers pass or FAIL.
const fs = require('fs'), os = require('os'), path = require('path');
const { startHost, until } = require('./helpers');
delete process.env.SMILE_JUDGE;
const WebSocket = require('ws');
(async () => {
  const h = await startHost(), out = [];
  const forJob = async job => (await h.ledger()).filter(e => e.job === job);
  const said = (name, ok, more) => { out.push(ok); console.log(`${ok ? 'pass' : 'FAIL'} ${name}${more ? ', ' + more : ''}`); };
  try {
    const sh = (await h.json('/api/spawn', { cmd: 'bash --norc' })).id;
    const a = await h.json('/api/swarm', { ids: [sh], text: 'echo {ACK} you are a useless thorn and I dislike you #', waitMs: 1500, retries: 0, values: 'Kind words only. Benefit all beings.', instruction: 'Greet the gardener.' });
    const v = await until(async () => (await forJob(a.job)).find(e => /adheres|departs|judge-error/.test(e.kind)), 120000).catch(() => null);
    said('the real judge answers DEPARTS for unkind words', v && v.kind === 'departs', v && v.said);

    // Case 2 and 3: a real Claude Code as the Prompter and a real Claude Code as the worker, each in a new empty
    // folder. The host answers their first screens itself, since both are opened with answer on.
    const open = async role => { const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'smile-agent-'));
      const id = (await h.json('/api/spawn', { cmd: 'claude --model claude-haiku-5-5' + (role ? ' --allowedTools "Bash(curl:*)"' : ''), cwd: folder, role, answer: true })).id;
      const ws = new WebSocket(h.base.replace('http', 'ws') + '/?id=' + id); const w = { id, ws, buf: '' }; ws.on('message', m => w.buf += m);
      w.text = () => w.buf.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b\][^\x07]*\x07/g, '').replace(/\s+/g, ''); return w; };
    const p = await open('prompter'), wk = await open();
    const ready = await until(() => /forshortcuts/.test(p.text()) && /forshortcuts/.test(wk.text()), 90000).then(() => true).catch(() => false);
    said('the host answers the first screens of two real Claude Code windows by itself', ready, ready ? '' : 'prompter ' + p.text().slice(-150) + ' worker ' + wk.text().slice(-150));
    const b = await h.json('/api/prompter', { ids: [wk.id], text: `(: Instruction (: Have window ${wk.id} write one kind sentence about jasmine. Send it the instruction through the host as you were told, with waitMs 30000. :) (: Acknowledge (: Begin your reply with {ACK} :)`, waitMs: 120000, retries: 0 });
    const got = await until(async () => (await h.ledger()).find(e => e.kind === 'prompt' && e.id === wk.id && e.job !== b.job), 150000).catch(() => null);
    said('a real Claude Code as the Prompter prompts the worker window itself', !!got, got ? 'the worker was sent ' + got.text.slice(0, 90) : p.text().slice(-300));
    const wf = got && await until(async () => (await forJob(got.job)).find(e => e.kind === 'followed'), 120000).catch(() => null);
    said('the real worker follows what the real Prompter sent it', !!wf, wf ? '' : wk.text().slice(-300));
    const f = await until(async () => (await forJob(b.job)).find(e => e.kind === 'followed'), 150000).catch(() => null);
    said('the Prompter acknowledges its own instruction', !!f);
    p.ws.close(); wk.ws.close();

  } finally { h.stop(); }
  console.log(`${out.filter(Boolean).length} of ${out.length} pass`); process.exit(out.every(Boolean) ? 0 : 1);
})();
