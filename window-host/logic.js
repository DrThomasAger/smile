// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Every decision of the Smile Window Host, as pure functions of plain data. Nothing here reads a file, a clock,
// a socket or a terminal. server.js reads the world and writes to it, and asks these functions what to do.
const path = require('path');

// Every number and word the host decides by, named once.
const K = {
  PORT: 4444, HOST: '127.0.0.1',          // the host answers this PC only unless SMILE_HOST says otherwise
  BUFFER: 200000,                          // characters of each window's output kept
  COLS: 100, ROWS: 30, MAX_COLS: 500, MAX_ROWS: 200,
  RETRIES: 2, WAIT_MS: 20000,              // a window has WAIT_MS to follow, and is sent the instruction 1 + RETRIES times
  QUIET_MS: 300, READY_POLL_MS: 50,        // a program is typed to once it has drawn and written nothing for QUIET_MS
  ENTER_AFTER_MS: 200,                     // Enter is written this long after the words, see server.js
  RESTART_MS: 500,                         // a kept worker loop starts again this long after it ends
  LEDGER_LINES: 200, JUDGE_MS: 120000, JUDGE_REPLY: 6000, JUDGE_SAID: 400,
  BODY_BYTES: 32 * 1024 * 1024,
  ACK: 'SMILE-ACK-', PLACE: '{ACK}', PROMPTER: 'prompter', WORKER: 'worker', ENDED: '\r\n[process ended]\r\n',
  RESIZE: '\x00resize:',
  MIME: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.smile': 'text/plain' },
  // the only folders and files of the host a browser is given
  SERVED: ['index.html', 'styles/', 'assets/', 'node_modules/@xterm/', 'node_modules/html2canvas/dist/'],
};

// Terminal output with its colour and cursor codes taken out.
const plain = s => String(s ?? '').replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b\][^\x07]*\x07/g, '');
const oneLine = s => String(s ?? '').replace(/[\r\n]+/g, ' ');

// The acknowledgement of one job, and the instruction carrying it.
const ackFor = job => K.ACK + job;
const withAck = (text, ack) => { const t = String(text ?? ''); return t.includes(K.PLACE) ? t.split(K.PLACE).join(ack) : `${t} (: Begin your reply with ${ack} :)`; };
const count = (s, ack) => ack ? String(s ?? '').split(ack).length - 1 : 0;
// A window followed when its output since the send names the acknowledgement more often than the typed words do,
// since a terminal shows back what is typed into it.
const followed = (outputSince, typed, ack) => count(plain(outputSince), ack) > count(typed, ack);

// What happens after a window's wait is over. state: { followed, tries, retries, hasValues }
const afterWait = ({ followed: f, tries, retries, hasValues }) => !f ? (tries <= retries ? 'resend' : 'done') : hasValues ? 'judge' : 'done';
// What happens after the judge answers. verdict: { adheres } or { error }
const afterJudge = ({ verdict, tries, retries }) => verdict && verdict.adheres === false && tries <= retries ? 'resend-with-note' : 'done';
const ledgerKind = verdict => !verdict || verdict.error ? 'judge-error' : verdict.adheres ? 'adheres' : 'departs';
const judgeNote = said => ` (: The sworn values judge wrote (: ${oneLine(said)} :) Do the instruction again keeping every sworn value. :)`;

// The judge's prompt from its template, and its answer read.
// Each place is filled in one pass, so words given for one place that name another place are left as they are.
const judgePrompt = (template, { values, instruction, reply }) => { const given = { VALUES: String(values ?? ''), INSTRUCTION: String(instruction ?? ''), REPLY: String(reply ?? '').slice(-K.JUDGE_REPLY) }; const seen = {};
  return String(template).replace(/\{(VALUES|INSTRUCTION|REPLY)\}/g, (m, k) => seen[k] ? m : (seen[k] = true, given[k])); };
const parseJudge = out => { const s = String(out ?? ''), m = /\b(ADHERES|DEPARTS)\b/.exec(s);
  return m ? { adheres: m[1] === 'ADHERES', said: s.trim().slice(0, K.JUDGE_SAID) } : { error: 'the judge answered neither word, ' + s.trim().slice(0, 200) }; };

// Which windows a send goes to. windows: [{ id, alive, role, cmd }], ids: the ticked ones, empty for all.
const targets = (windows, ids) => { const all = (windows || []).filter(w => w && w.alive); if (!(ids && ids.length)) return all;
  const byId = new Map(all.map(w => [w.id, w])); return ids.map(i => byId.get(String(i))).filter(Boolean); };
const prompterOf = windows => (windows || []).find(w => w && w.alive && w.role === K.PROMPTER) || null;
const workersFor = (windows, prompter, ids) => { const want = ids && ids.length ? new Set(ids.map(String)) : null; return (windows || []).filter(w => w && w.alive && w !== prompter && w.id !== (prompter && prompter.id) && (!want || want.has(w.id))); };
const prompterText = ({ text, port, workers }) => `${text} (: You are the Prompter. Prompt these windows yourself, autonomously, with POST (no proxy) to http://localhost:${port}/api/swarm and JSON ids and text, read their replies from GET /api/ledger, and resend until each follows. Windows (: ${(workers || []).map(w => `${w.id} ${w.cmd}`).join(', ') || 'none yet'} :) :)`;

// Windows written down so they open again after the host goes down: kept loops and the Prompter.
const toKeep = windows => (windows || []).filter(w => w.keep || w.role === K.PROMPTER).map(({ id, cmd, cwd, keep, role }) => ({ id, cmd, cwd, keep: !!keep, role }));
const restarts = (w, current) => !!(w && w.keep && current === w);

// A request to open a window, checked. Answers { cmd, cwd, keep, role } or { error }.
const spawnRequest = b => { const cmd = typeof (b && b.cmd) === 'string' ? b.cmd.trim() : '';
  if (!cmd) return { error: 'a window needs a command to run' };
  return { cmd, cwd: typeof b.cwd === 'string' && b.cwd ? b.cwd : undefined, keep: !!b.keep, role: b.role === K.PROMPTER ? K.PROMPTER : K.WORKER }; };
const shotBytes = png => { const m = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(String(png ?? '')); return m ? m[1] : null; };
// A message from a window's page: a resize, or keys for the program.
const fromPage = msg => { const d = String(msg ?? '');
  if (!d.startsWith(K.RESIZE)) return { keys: d };
  const [c, r] = d.slice(K.RESIZE.length).split('x').map(Number);
  return Number.isInteger(c) && Number.isInteger(r) && c > 0 && r > 0 && c <= K.MAX_COLS && r <= K.MAX_ROWS ? { cols: c, rows: r } : { ignore: true }; };
const lastLines = (text, n = K.LEDGER_LINES) => String(text ?? '').split('\n').slice(-n).join('\n');
const keepTail = (buf, more) => (String(buf ?? '') + more).slice(-K.BUFFER);

// The file of the host a web path names, or null. Only what K.SERVED lists is given, and nothing above the root.
const servedFile = (root, pathname) => {
  let p; try { p = decodeURIComponent(String(pathname ?? '')); } catch (e) { return null; }
  if (p === '/' || p === '') p = '/index.html';
  if (p.startsWith('/vendor/')) p = '/node_modules/' + p.slice(8);
  if (p.includes('\0')) return null;
  const rel = path.posix.normalize(p.replace(/\\/g, '/')).replace(/^\/+/, '');
  if (rel.startsWith('..') || !K.SERVED.some(s => s.endsWith('/') ? rel.startsWith(s) : rel === s)) return null;
  return { file: path.join(root, ...rel.split('/')), type: K.MIME[path.extname(rel).toLowerCase()] || 'application/octet-stream' };
};

module.exports = { K, plain, oneLine, ackFor, withAck, count, followed, afterWait, afterJudge, ledgerKind, judgeNote, judgePrompt, parseJudge,
  targets, prompterOf, workersFor, prompterText, toKeep, restarts, spawnRequest, shotBytes, fromPage, lastLines, keepTail, servedFile };
