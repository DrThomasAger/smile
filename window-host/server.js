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

function spawn(cmd, cwd) {
  const id = String(nextId++);
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  const args = process.platform === 'win32' ? ['-NoLogo', '-Command', cmd] : ['-lc', cmd];
  const term = pty.spawn(shell, args, { name: 'xterm-256color', cols: 100, rows: 30, cwd: cwd || process.cwd(), env: process.env });
  const w = { id, cmd, term, buf: '', sockets: new Set(), alive: true };
  term.onData(d => { w.buf = (w.buf + d).slice(-200000); w.sockets.forEach(s => s.send(d)); });
  term.onExit(() => { w.alive = false; w.sockets.forEach(s => s.send('\r\n[process ended]\r\n')); });
  windows.set(id, w);
  log({ kind: 'spawn', id, cmd });
  return w;
}
const plain = s => s.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b\][^\x07]*\x07/g, '');

// prompt2swarm: send to each window, then check each window's output for the
// acknowledgement token; any window without it gets the instruction again.
function swarm({ ids, text, ack = 'SMILE-ACK', retries = 2, waitMs = 20000 }) {
  const targets = (ids && ids.length ? ids : [...windows.keys()]).map(i => windows.get(i)).filter(w => w && w.alive);
  const job = Date.now().toString(36);
  targets.forEach(w => {
    let tries = 0; const start = () => w.buf.length;
    const send = () => {
      const mark = start(); tries++;
      w.term.write(text.replace(/\r?\n/g, ' ') + '\r');
      log({ kind: 'prompt', job, id: w.id, tries, text });
      setTimeout(() => {
        const followed = plain(w.buf.slice(mark)).includes(ack);
        log({ kind: followed ? 'followed' : 'not-followed', job, id: w.id, tries });
        if (!followed && tries <= retries) send();
      }, waitMs);
    };
    send();
  });
  return { job, sent: targets.map(w => w.id) };
}

const body = req => new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => r(b ? JSON.parse(b) : {})); });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const json = o => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
  if (u.pathname === '/api/windows') return json([...windows.values()].map(w => ({ id: w.id, cmd: w.cmd, alive: w.alive })));
  if (u.pathname === '/api/spawn' && req.method === 'POST') { const b = await body(req); const w = spawn(b.cmd, b.cwd); return json({ id: w.id }); }
  if (u.pathname === '/api/kill' && req.method === 'POST') { const b = await body(req); const w = windows.get(b.id); if (w) { try { w.term.kill(); } catch {} windows.delete(b.id); } return json({ ok: true }); }
  if (u.pathname === '/api/swarm' && req.method === 'POST') return json(swarm(await body(req)));
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

server.listen(PORT, () => console.log(`Smile Window Host on http://localhost:${PORT}`));
module.exports = { spawn, swarm, windows, server };
