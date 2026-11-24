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

    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'smile-prompter-'));
    const p = (await h.json('/api/spawn', { cmd: 'claude --model claude-haiku-5-5 --allowedTools "Bash(curl:*)"', cwd: folder, role: 'prompter' })).id;
    const ws = new WebSocket(h.base.replace('http', 'ws') + '/?id=' + p); let buf = ''; ws.on('message', m => buf += m);
    const clean = () => buf.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b\][^\x07]*\x07/g, '').replace(/\s+/g, '');
    // Claude Code's first screens, its text style and whether the new empty folder is trusted, are answered here
    // looked at every 2.5 s, since a screen is drawn in pieces and a look in the middle of one reads half a word
    for (let i = 0; i < 24; i++) { await new Promise(r => setTimeout(r, 2500)); const s = clean(); buf = '';
      if (/trustthisfolder/.test(s)) { ws.send('\x1b[B'); await new Promise(r => setTimeout(r, 300)); ws.send('\r'); }
      else if (/forshortcuts/.test(s)) break;
      else if (/Entertoconfirm|Choosethetextstyle/.test(s)) ws.send('\r'); }
    const b = await h.json('/api/prompter', { ids: [sh], text: `(: Instruction (: Have window ${sh} run exactly this shell command: echo lotus-from-prompter-1111 :) (: Acknowledge (: Begin your reply with {ACK} :)`, waitMs: 90000, retries: 0 });
    const got = await until(async () => (await h.ledger()).find(e => e.kind === 'prompt' && e.id === sh && e.job !== a.job && e.text.includes('lotus-from-prompter-1111')), 150000).catch(() => null);
    said('a real Claude Code as the Prompter prompts the worker window itself', !!got, got ? 'the worker was sent ' + got.text.slice(0, 80) : clean().slice(-300));
    const f = await until(async () => (await forJob(b.job)).find(e => e.kind === 'followed'), 100000).catch(() => null);
    said('the Prompter acknowledges its own instruction', !!f);
    ws.close();
  } finally { h.stop(); }
  console.log(`${out.filter(Boolean).length} of ${out.length} pass`); process.exit(out.every(Boolean) ? 0 : 1);
})();
