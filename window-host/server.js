// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Smile Window Host: any command line program (Claude Code, a shell, a REPL)
// runs as a draggable window inside the Smile client, one pseudo terminal each.
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const pty = require('node-pty');

const PORT = +process.env.PORT || 4444;
const DATA = process.env.SMILE_DATA || path.join(__dirname, 'data');
fs.mkdirSync(path.join(DATA, 'shots'), { recursive: true });
const ledger = path.join(DATA, 'swarm-ledger.jsonl');
const log = o => fs.appendFileSync(ledger, JSON.stringify({ t: Date.now(), ...o }) + '\n');

const windows = new Map(); // id -> { term, cmd, buf, sockets:Set }
let nextId = 1;

const saved = path.join(DATA, 'windows.json');
const save = () => fs.writeFileSync(saved, JSON.stringify([...windows.values()].filter(w => w.keep || w.role === 'prompter').map(({ id, cmd, cwd, keep, role }) => ({ id, cmd, cwd, keep, role }))));
// spawn opens a program in its own pseudo terminal.
// keep = a worker loop, restarted when it ends, needing no agent to run it.
// role = 'prompter' marks the one window the user prompts, which then prompts the rest.
function spawn(cmd, cwd, opts = {}) {
  const id = opts.id || String(nextId++); nextId = Math.max(nextId, +id + 1);
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  const args = process.platform === 'win32' ? ['-NoLogo', '-Command', cmd] : ['-lc', cmd];
  const term = pty.spawn(shell, args, { name: 'xterm-256color', cols: 100, rows: 30, cwd: cwd || process.cwd(), env: process.env });
  const old = windows.get(id);
  const w = { id, cmd, cwd, keep: !!opts.keep, role: opts.role || 'worker', restarts: old ? old.restarts + 1 : 0, term, last: 0, buf: old ? old.buf : '', sockets: old ? old.sockets : new Set(), alive: true };
  term.onData(d => { w.last = Date.now(); w.buf = (w.buf + d).slice(-200000); w.sockets.forEach(s => s.send(d)); });
  term.onExit(() => { w.alive = false; const m = '\r\n[process ended]\r\n'; w.buf += m; w.sockets.forEach(s => s.send(m));
    if (w.keep && windows.get(id) === w) setTimeout(() => { if (windows.get(id) === w) { log({ kind: 'restart', id }); spawn(cmd, cwd, { id, keep: true, role: w.role }); } }, 500); });
  windows.set(id, w);
  log({ kind: 'spawn', id, cmd, keep: w.keep, role: w.role });
  save();
  return w;
}
const plain = s => s.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b\][^\x07]*\x07/g, '');

// prompt2swarm: send to each window, then check each window's output for the
// acknowledgement token; any window without it gets the instruction again.
function swarm({ ids, text, retries = 2, waitMs = 20000 }) {
  const targets = (ids && ids.length ? ids : [...windows.keys()]).map(i => windows.get(i)).filter(w => w && w.alive);
  const job = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const ack = 'SMILE-ACK-' + job; // unique per job, so one job's reply never counts for another
  text = text.includes('{ACK}') ? text.split('{ACK}').join(ack) : text + ` (: Begin your reply with ${ack} :)`;
  const count = s => s.split(ack).length - 1;
  targets.forEach(w => {
    let tries = 0; const start = () => w.buf.length;
    const send = () => {
      const mark = start(); tries++;
      w.term.write(text.replace(/\r?\n/g, ' ') + '\r');
      log({ kind: 'prompt', job, id: w.id, tries, text });
      setTimeout(() => {
        // the terminal echoes the typed prompt, so the reply must add occurrences beyond that echo
        const followed = count(plain(w.buf.slice(mark))) > count(text);
        log({ kind: followed ? 'followed' : 'not-followed', job, id: w.id, tries });
        if (!followed && tries <= retries) send();
      }, waitMs);
    };
    // type only once the program has drawn and gone quiet, so typed text is echoed once
    const ready = () => (w.buf && Date.now() - w.last > 300) || !w.alive ? send() : setTimeout(ready, 50);
    ready();
  });
  return { job, ack, sent: targets.map(w => w.id) };
}

const body = req => new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => r(b ? JSON.parse(b) : {})); });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const json = o => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
  if (u.pathname === '/api/windows') return json([...windows.values()].map(w => ({ id: w.id, cmd: w.cmd, alive: w.alive, keep: w.keep, role: w.role, restarts: w.restarts })));
  if (u.pathname === '/api/spawn' && req.method === 'POST') { const b = await body(req); const w = spawn(b.cmd, b.cwd, { keep: b.keep, role: b.role }); return json({ id: w.id }); }
  if (u.pathname === '/api/kill' && req.method === 'POST') { const b = await body(req); const w = windows.get(b.id); if (w) { try { w.term.kill(); } catch {} windows.delete(b.id); save(); } return json({ ok: true }); }
  if (u.pathname === '/api/swarm' && req.method === 'POST') return json(swarm(await body(req)));
  if (u.pathname === '/api/prompter' && req.method === 'POST') {
    const b = await body(req); const p = [...windows.values()].find(w => w.role === 'prompter' && w.alive);
    if (!p) { res.statusCode = 409; return json({ error: 'no prompter window is open' }); }
    const workers = [...windows.values()].filter(w => w !== p && w.alive && (!b.ids || !b.ids.length || b.ids.includes(w.id))).map(w => `${w.id} ${w.cmd}`);
    const text = `${b.text} (: You are the Prompter. Prompt these windows yourself, autonomously, with POST (no proxy) to http://localhost:${PORT}/api/swarm and JSON ids and text, read their replies from GET /api/ledger, and resend until each follows. Windows (: ${workers.join(', ') || 'none yet'} :) :)`;
    return json(swarm({ ids: [p.id], text, waitMs: b.waitMs, retries: b.retries }));
  }
  if (u.pathname === '/api/shot' && req.method === 'POST') {
    const b = await body(req); const f = path.join(DATA, 'shots', `${Date.now()}.png`);
    fs.writeFileSync(f, Buffer.from(b.png.split(',')[1], 'base64')); return json({ file: f });
  }
  if (u.pathname === '/api/ledger') return res.end(fs.existsSync(ledger) ? fs.readFileSync(ledger, 'utf8').split('\n').slice(-200).join('\n') : '');
  let p = u.pathname === '/' ? '/index.html' : u.pathname;
  if (p.startsWith('/vendor/')) p = '/node_modules/' + p.slice(8);
  const f = path.join(__dirname, path.normalize(p));
  if (!f.startsWith(__dirname) || !fs.existsSync(f)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', mime[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});

new WebSocketServer({ server }).on('connection', (s, req) => {
  const id = new URL(req.url, 'http://x').searchParams.get('id'); const w = windows.get(id);
  if (!w) return s.close();
  w.sockets.add(s); s.send(w.buf);
  s.on('message', m => { const d = m.toString(); if (d.startsWith('\x00resize:')) { const [c, r] = d.slice(8).split('x').map(Number); try { w.term.resize(c, r); } catch {} } else w.term.write(d); });
  s.on('close', () => w.sockets.delete(s));
});

// windows that were running before the host went down are opened again
if (fs.existsSync(saved)) for (const w of JSON.parse(fs.readFileSync(saved, 'utf8'))) spawn(w.cmd, w.cwd, w);
server.listen(PORT, () => console.log(`Smile Window Host on http://localhost:${PORT}`));
module.exports = { spawn, swarm, windows, server };
