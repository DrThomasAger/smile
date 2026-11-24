// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Shared helpers. Each suite starts its own host on its own port and data folder.
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
let port = 5550;
async function startHost() {
  const p = port++, data = fs.mkdtempSync(path.join(os.tmpdir(), 'smile-host-'));
  const proc = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: p, SMILE_DATA: data }, stdio: 'pipe' });
  await new Promise((ok, no) => { proc.stdout.on('data', d => String(d).includes('Smile Window Host') && ok()); proc.on('exit', no); });
  const base = `http://localhost:${p}`;
  const api = async (u, b) => { const r = await fetch(base + u, b ? { method: 'POST', body: JSON.stringify(b) } : {}); return { status: r.status, text: await r.text() }; };
  const json = async (u, b) => JSON.parse((await api(u, b)).text);
  const ledger = async () => (await api('/api/ledger')).text.trim().split('\n').filter(Boolean).map(JSON.parse);
  return { base, data, api, json, ledger, stop: () => proc.kill() };
}
const until = async (fn, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = await fn(); if (v) return v; await new Promise(r => setTimeout(r, 100)); } throw new Error('condition not met in ' + ms + 'ms'); };
module.exports = { startHost, until };
