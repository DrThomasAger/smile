// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Smile Window Host: any command line program (Claude Code, a shell, a REPL) runs as a draggable window inside
// the Smile client, one pseudo terminal each. This file reads the world and writes to it. Every decision is a pure
// function in logic.js, tested alone in test/logic.test.js.
const http = require('http'), fs = require('fs'), path = require('path');
const { spawn: run } = require('child_process');
const { WebSocketServer } = require('ws');
const pty = require('node-pty');
const L = require('./logic'), K = L.K;

const PORT = +process.env.PORT || K.PORT;
const HOST = process.env.SMILE_HOST || K.HOST;
const DATA = process.env.SMILE_DATA || path.join(__dirname, 'data');
const JUDGE = process.env.SMILE_JUDGE || 'claude -p --model claude-haiku-5-5';   // reads the judge prompt on stdin
fs.mkdirSync(path.join(DATA, 'shots'), { recursive: true });
const ledger = path.join(DATA, 'swarm-ledger.jsonl'), saved = path.join(DATA, 'windows.json');
const log = o => fs.appendFileSync(ledger, JSON.stringify({ t: Date.now(), ...o }) + '\n');

const windows = new Map();   // id -> { id, cmd, cwd, keep, role, restarts, term, last, buf, sockets, alive }
let nextId = 1;
const all = () => [...windows.values()];
const save = () => fs.writeFileSync(saved, JSON.stringify(L.toKeep(all())));

// Opens a program in its own pseudo terminal. keep is a worker loop, started again each time it ends, with no
// agent in it. role 'prompter' is the one window the person prompts, which then prompts the rest.
function spawn(cmd, cwd, opts = {}) {
  const id = opts.id || String(nextId++); nextId = Math.max(nextId, +id + 1);
  const win = process.platform === 'win32';
  const term = pty.spawn(win ? 'powershell.exe' : 'bash', win ? ['-NoLogo', '-Command', cmd] : ['-lc', cmd],
    { name: 'xterm-256color', cols: K.COLS, rows: K.ROWS, cwd: cwd && fs.existsSync(cwd) ? cwd : process.cwd(), env: process.env });
  const old = windows.get(id);
  const w = { id, cmd, cwd, answer: !!opts.answer, answered: null, keep: !!opts.keep, role: opts.role || K.WORKER, restarts: old ? old.restarts + 1 : 0, term, last: 0,
    buf: old ? old.buf : '', sockets: old ? old.sockets : new Set(), alive: true };
  const tell = d => w.sockets.forEach(s => { try { s.send(d); } catch (e) {} });
  // With answer on, a first screen the program shows is answered with its keys once it has stopped drawing.
  let looking = null;
  const look = () => { looking = null; if (!w.alive) return; const r = L.screenAnswer(w.buf, K.SCREENS, w.answered);
    if (!r) { if (!L.screenAnswer(w.buf, K.SCREENS, null)) w.answered = null; return; }
    w.answered = r.name; log({ kind: 'screen-answered', id, screen: r.name });
    r.keys.forEach((k, i) => setTimeout(() => { if (w.alive) term.write(k); }, i * K.KEY_GAP_MS)); };
  term.onData(d => { w.last = Date.now(); w.buf = L.keepTail(w.buf, d); tell(d);
    if (w.answer) { clearTimeout(looking); looking = setTimeout(look, K.QUIET_MS); } });
  term.onExit(() => { w.alive = false; w.buf = L.keepTail(w.buf, K.ENDED); tell(K.ENDED);
    if (L.restarts(w, windows.get(id))) setTimeout(() => { if (L.restarts(w, windows.get(id))) { log({ kind: 'restart', id }); spawn(cmd, cwd, { id, keep: true, role: w.role, answer: w.answer }); } }, K.RESTART_MS); });
  windows.set(id, w);
  log({ kind: 'spawn', id, cmd, keep: w.keep, role: w.role });
  save();
  return w;
}

// The sworn values judge. A model reads what a window wrote against the sworn values with values-judge.smile.
const judge = given => new Promise(res => {
  const c = run(JUDGE, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] }); let out = '';
  const t = setTimeout(() => { c.kill(); res({ error: `the judge gave no answer within ${K.JUDGE_MS / 1000} s` }); }, K.JUDGE_MS);
  c.stdout.on('data', d => out += d); c.on('error', e => { clearTimeout(t); res({ error: e.message }); });
  c.on('close', () => { clearTimeout(t); res(L.parseJudge(out)); });
  c.stdin.on('error', () => {}); c.stdin.end(L.judgePrompt(fs.readFileSync(path.join(__dirname, 'values-judge.smile'), 'utf8'), given));
});

// Prompt to Sangha. Each window is typed the instruction, given waitMs to follow, sent it again when it has not,
// and, when sworn values are given, read by the judge once it has followed.
function swarm({ ids, text, retries = K.RETRIES, waitMs = K.WAIT_MS, values, instruction } = {}) {
  const to = L.targets(all(), ids);
  const job = Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ack = L.ackFor(job);
  const typed = L.withAck(text, ack);
  for (const w of to) {
    let tries = 0;
    const send = note => {
      const mark = w.buf.length; tries++;
      // The words and the Enter are written apart. Written together, Claude Code took them as one paste and kept the
      // Enter as a line inside its box, so nothing was submitted. Found with a real Claude Code window.
      w.term.write(L.oneLine(typed + (note || '')));
      setTimeout(() => { if (w.alive) w.term.write('\r'); }, K.ENTER_AFTER_MS);
      log({ kind: 'prompt', job, id: w.id, tries, text: typed });
      setTimeout(async () => {
        const since = w.buf.slice(mark), f = L.followed(since, typed, ack);
        log({ kind: f ? 'followed' : 'not-followed', job, id: w.id, tries });
        const next = L.afterWait({ followed: f, tries, retries, hasValues: !!values });
        if (next === 'resend') return send();
        if (next !== 'judge') return;
        const verdict = await judge({ values, instruction: instruction || typed, reply: L.plain(since) });
        log({ kind: L.ledgerKind(verdict), job, id: w.id, tries, said: verdict.said || verdict.error });
        if (L.afterJudge({ verdict, tries, retries }) === 'resend-with-note') send(L.judgeNote(verdict.said));
      }, waitMs);
    };
    // typed only once the program has drawn and gone quiet, so the words are shown back once
    const ready = () => (w.buf && Date.now() - w.last > K.QUIET_MS) || !w.alive ? send() : setTimeout(ready, K.READY_POLL_MS);
    ready();
  }
  return { job, ack, sent: to.map(w => w.id) };
}

const body = req => new Promise((ok, no) => { let b = '', n = 0;
  req.on('data', c => { n += c.length; if (n > K.BODY_BYTES) { no(new Error('the request is too large')); req.destroy(); } else b += c; });
  req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch (e) { no(new Error('the request is not JSON')); } }); req.on('error', no); });

const routes = {
  'GET /api/windows': () => all().map(w => ({ id: w.id, cmd: w.cmd, alive: w.alive, keep: w.keep, role: w.role, answer: w.answer, restarts: w.restarts })),
  'POST /api/spawn': b => { const r = L.spawnRequest(b); if (r.error) return { status: 400, error: r.error }; return { id: spawn(r.cmd, r.cwd, r).id }; },
  'POST /api/kill': b => { const w = windows.get(String(b.id)); if (w) { windows.delete(w.id); try { w.term.kill(); } catch (e) {} save(); } return { ok: true }; },
  'POST /api/swarm': b => typeof b.text === 'string' && b.text.trim() ? swarm(b) : { status: 400, error: 'an instruction needs words' },
  'POST /api/prompter': b => {
    if (!(typeof b.text === 'string' && b.text.trim())) return { status: 400, error: 'an instruction needs words' };
    const p = L.prompterOf(all()); if (!p) return { status: 409, error: 'no prompter window is open' };
    return swarm({ ...b, ids: [p.id], text: L.prompterText({ text: b.text, port: PORT, workers: L.workersFor(all(), p, b.ids) }) });
  },
  'POST /api/shot': b => { const bytes = L.shotBytes(b.png); if (!bytes) return { status: 400, error: 'a screenshot is a png data address' };
    const f = path.join(DATA, 'shots', `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.png`); fs.writeFileSync(f, Buffer.from(bytes, 'base64')); return { file: f }; },
};

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const json = (o, status = 200) => { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
  try {
    if (u.pathname === '/api/ledger') return res.end(fs.existsSync(ledger) ? L.lastLines(fs.readFileSync(ledger, 'utf8')) : '');
    const route = routes[`${req.method} ${u.pathname}`];
    if (route) { const r = await route(req.method === 'POST' ? await body(req) : {}); return r && r.error ? json({ error: r.error }, r.status || 400) : json(r); }
    if (u.pathname.startsWith('/api/')) return json({ error: 'no such call' }, 404);
    const s = L.servedFile(__dirname, u.pathname);
    if (!s || !fs.existsSync(s.file) || !fs.statSync(s.file).isFile()) { res.statusCode = 404; return res.end(); }
    res.setHeader('content-type', s.type); fs.createReadStream(s.file).pipe(res);
  } catch (e) { json({ error: String(e.message || e) }, 400); }
});

new WebSocketServer({ server }).on('connection', (s, req) => {
  const w = windows.get(new URL(req.url, 'http://x').searchParams.get('id'));
  if (!w) return s.close();
  w.sockets.add(s); s.send(w.buf);
  s.on('message', m => { const d = L.fromPage(m); const now = windows.get(w.id) || w;   // a kept loop that started again has a new terminal
    try { if (d.cols) now.term.resize(d.cols, d.rows); else if (d.keys != null && now.alive) now.term.write(d.keys); } catch (e) {} });
  s.on('close', () => w.sockets.delete(s));
});

// windows that were running before the host went down are opened again
if (fs.existsSync(saved)) { let was = []; try { was = JSON.parse(fs.readFileSync(saved, 'utf8')); } catch (e) {} for (const w of was) if (L.spawnRequest(w).cmd) spawn(w.cmd, w.cwd, w); }
server.listen(PORT, HOST, () => console.log(`Smile Window Host on http://localhost:${PORT}`));
module.exports = { spawn, swarm, windows, server };
