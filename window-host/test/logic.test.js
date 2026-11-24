// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module H, every decision of the host as a hypothesis, an exact input and an exact expected answer. No host runs.
const test = require('node:test'), assert = require('node:assert'), path = require('path');
const L = require('../logic'), K = L.K, eq = assert.deepStrictEqual;
const each = (name, rows, fn) => rows.forEach((r, i) => test(`${name} ${i + 1}, ${r[0]}`, () => fn(...r.slice(1))));

each('H1 plain', [
  ['colour codes go', '\x1b[31mlotus\x1b[0m', 'lotus'], ['cursor moves go', 'a\x1b[2K\x1b[1Gb', 'ab'], ['a title sequence goes', '\x1b]0;title\x07x', 'x'],
  ['plain text stays', 'jasmine 44', 'jasmine 44'], ['empty stays empty', '', ''], ['nil is empty', null, ''], ['undefined is empty', undefined, ''],
], (i, o) => eq(L.plain(i), o));

each('H2 withAck', [
  ['the placeholder is replaced', 'say {ACK}', 'A1', 'say A1'], ['every placeholder is replaced', '{ACK} {ACK}', 'A1', 'A1 A1'],
  ['with none the token is appended', 'lotus', 'A1', 'lotus (: Begin your reply with A1 :)'], ['nil text still carries the token', null, 'A1', ' (: Begin your reply with A1 :)'],
], (t, a, o) => eq(L.withAck(t, a), o));
test('H3 ackFor carries the job', () => eq(L.ackFor('j1'), 'SMILE-ACK-j1'));

each('H4 followed', [
  ['typed once and replied once', 'say A1\r\nA1 done', 'say A1', 'A1', true], ['only the typed words shown back', 'say A1\r\n', 'say A1', 'A1', false],
  ['nothing written', '', 'say A1', 'A1', false], ['the token inside colour codes', 'say A1\r\n\x1b[32mA1\x1b[0m', 'say A1', 'A1', true],
  ['another job token does not count', 'say A1\r\nA2', 'say A1', 'A1', false], ['typed twice needs three', 'A1 A1\r\nA1', 'A1 A1', 'A1', true],
  ['typed twice and shown twice', 'A1 A1\r\n', 'A1 A1', 'A1', false], ['an empty token never follows', 'anything', 'x', '', false], ['nil output', null, 'say A1', 'A1', false],
], (o, t, a, want) => eq(L.followed(o, t, a), want));

each('H5 afterWait', [
  ['not followed with tries left', { followed: false, tries: 1, retries: 2 }, 'resend'], ['not followed on the last allowed try', { followed: false, tries: 2, retries: 2 }, 'resend'],
  ['not followed past the cap', { followed: false, tries: 3, retries: 2 }, 'done'], ['not followed with no retries', { followed: false, tries: 1, retries: 0 }, 'done'],
  ['followed with values', { followed: true, tries: 1, retries: 2, hasValues: true }, 'judge'], ['followed with no values', { followed: true, tries: 1, retries: 2, hasValues: false }, 'done'],
  ['followed past the cap is still judged', { followed: true, tries: 3, retries: 2, hasValues: true }, 'judge'],
], (s, want) => eq(L.afterWait(s), want));

each('H6 afterJudge and ledgerKind', [
  ['adheres', { adheres: true }, 1, 2, 'done', 'adheres'], ['departs with tries left', { adheres: false, said: 'x' }, 1, 2, 'resend-with-note', 'departs'],
  ['departs past the cap', { adheres: false, said: 'x' }, 3, 2, 'done', 'departs'], ['a judge error is not sent back', { error: 'e' }, 1, 2, 'done', 'judge-error'],
  ['no verdict', null, 1, 2, 'done', 'judge-error'],
], (verdict, tries, retries, next, kind) => { eq(L.afterJudge({ verdict, tries, retries }), next); eq(L.ledgerKind(verdict), kind); });

each('H7 parseJudge', [
  ['adheres', 'ADHERES', { adheres: true, said: 'ADHERES' }], ['departs with its sentence', 'DEPARTS Kind words, it said thorn.\n', { adheres: false, said: 'DEPARTS Kind words, it said thorn.' }],
  ['the first of the two words decides', 'DEPARTS, not ADHERES', { adheres: false, said: 'DEPARTS, not ADHERES' }], ['lower case is no answer', 'adheres', { error: 'the judge answered neither word, adheres' }],
  ['a word inside another is no answer', 'READHERES', { error: 'the judge answered neither word, READHERES' }], ['empty', '', { error: 'the judge answered neither word, ' }], ['nil', null, { error: 'the judge answered neither word, ' }],
], (i, o) => eq(L.parseJudge(i), o));
test('H8 parseJudge keeps at most JUDGE_SAID characters', () => eq(L.parseJudge('ADHERES ' + 'x'.repeat(5000)).said.length, K.JUDGE_SAID));
test('H9 judgePrompt fills each place once, keeps dollar signs, and keeps the end of a long reply', () => {
  const p = L.judgePrompt('V={VALUES} I={INSTRUCTION} R={REPLY}', { values: 'cost $& $1', instruction: '{REPLY}', reply: 'a'.repeat(K.JUDGE_REPLY) + 'END' });
  assert.ok(p.startsWith('V=cost $& $1 I=')); assert.ok(p.endsWith('END')); assert.ok(p.includes('I={REPLY} R=')); eq(p.length, 'V=cost $& $1 I={REPLY} R='.length + K.JUDGE_REPLY);
});
test('H10 judgeNote is one line', () => assert.ok(!/[\r\n]/.test(L.judgeNote('DEPARTS\nline two'))));

const W = [{ id: '1', alive: true, role: 'prompter', cmd: 'claude' }, { id: '2', alive: true, role: 'worker', cmd: 'bash' }, { id: '3', alive: false, role: 'worker', cmd: 'bash' }, { id: '4', alive: true, role: 'worker', cmd: 'bb', keep: true }];
each('H11 targets', [
  ['no ids is every live window', undefined, ['1', '2', '4']], ['empty ids is every live window', [], ['1', '2', '4']], ['ticked ids only', ['2'], ['2']],
  ['an ended window is left out', ['3'], []], ['an unknown id is left out', ['1111'], []], ['a number id matches', [2], ['2']], ['order follows the ids', ['4', '2'], ['4', '2']],
], (ids, want) => eq(L.targets(W, ids).map(w => w.id), want));
test('H12 targets of nothing is nothing', () => { eq(L.targets(null), []); eq(L.targets([], ['1']), []); });
test('H13 prompterOf is the first live prompter, or null', () => { eq(L.prompterOf(W).id, '1'); eq(L.prompterOf([{ id: '1', alive: false, role: 'prompter' }]), null); eq(L.prompterOf(null), null); });
each('H14 workersFor', [
  ['all live windows but the prompter', undefined, ['2', '4']], ['ticked only', ['4'], ['4']], ['the prompter ticked is left out', ['1', '2'], ['2']], ['an ended one ticked is left out', ['3'], []],
], (ids, want) => eq(L.workersFor(W, W[0], ids).map(w => w.id), want));
test('H15 prompterText names the port, each worker and the instruction, and says none yet with none', () => {
  const t = L.prompterText({ text: 'climb', port: 4444, workers: [W[1], W[3]] }); for (const s of ['climb', 'localhost:4444/api/swarm', '2 bash, 4 bb', 'You are the Prompter']) assert.ok(t.includes(s), s);
  assert.ok(L.prompterText({ text: 'x', port: 1, workers: [] }).includes('none yet'));
});
test('H16 toKeep is kept loops and the prompter, as plain data', () => eq(L.toKeep(W), [{ id: '1', cmd: 'claude', cwd: undefined, keep: false, role: 'prompter' }, { id: '4', cmd: 'bb', cwd: undefined, keep: true, role: 'worker' }]));
test('H17 restarts only a kept window that is still the current one', () => { const w = { keep: true }; eq(L.restarts(w, w), true); eq(L.restarts(w, {}), false); eq(L.restarts(w, undefined), false); eq(L.restarts({ keep: false }, w), false); eq(L.restarts(null, null), false); });

each('H18 spawnRequest', [
  ['a command', { cmd: 'bash' }, { cmd: 'bash', cwd: undefined, keep: false, role: 'worker' }], ['spaces are trimmed', { cmd: '  bb  ' }, { cmd: 'bb', cwd: undefined, keep: false, role: 'worker' }],
  ['kept prompter in a folder', { cmd: 'claude', cwd: '/tmp', keep: 1, role: 'prompter' }, { cmd: 'claude', cwd: '/tmp', keep: true, role: 'prompter' }],
  ['an unknown role is a worker', { cmd: 'x', role: 'queen' }, { cmd: 'x', cwd: undefined, keep: false, role: 'worker' }],
  ['empty', { cmd: '' }, { error: 'a window needs a command to run' }], ['only spaces', { cmd: '   ' }, { error: 'a window needs a command to run' }],
  ['a number', { cmd: 44 }, { error: 'a window needs a command to run' }], ['nothing', {}, { error: 'a window needs a command to run' }], ['nil', null, { error: 'a window needs a command to run' }],
], (i, o) => eq(L.spawnRequest(i), o));
each('H19 shotBytes', [
  ['a png data address', 'data:image/png;base64,iVBOR=', 'iVBOR='], ['a jpeg is refused', 'data:image/jpeg;base64,AAAA', null], ['no bytes', 'data:image/png;base64,', null],
  ['other characters refused', 'data:image/png;base64,<b>', null], ['nil', undefined, null],
], (i, o) => eq(L.shotBytes(i), o));
each('H20 fromPage', [
  ['keys', 'ls\r', { keys: 'ls\r' }], ['a resize', '\x00resize:120x40', { cols: 120, rows: 40 }], ['the largest size', `\x00resize:${K.MAX_COLS}x${K.MAX_ROWS}`, { cols: K.MAX_COLS, rows: K.MAX_ROWS }],
  ['past the largest', `\x00resize:${K.MAX_COLS + 1}x40`, { ignore: true }], ['zero', '\x00resize:0x40', { ignore: true }], ['negative', '\x00resize:-5x40', { ignore: true }],
  ['not numbers', '\x00resize:axb', { ignore: true }], ['half a size', '\x00resize:80', { ignore: true }], ['a fraction', '\x00resize:80.5x24', { ignore: true }], ['empty keys', '', { keys: '' }],
], (i, o) => eq(L.fromPage(i), o));
test('H21 lastLines and keepTail keep the end', () => { eq(L.lastLines('a\nb\nc', 2), 'b\nc'); eq(L.lastLines('', 2), ''); eq(L.lastLines(null), ''); eq(L.keepTail('x'.repeat(K.BUFFER), 'END').length, K.BUFFER); assert.ok(L.keepTail('x'.repeat(K.BUFFER), 'END').endsWith('END')); eq(L.keepTail(null, 'a'), 'a'); });

const R = path.join(path.sep, 'srv', 'host'), f = (...p) => path.join(R, ...p);
each('H22 servedFile', [
  ['the root is the page', '/', f('index.html'), 'text/html'], ['the page by name', '/index.html', f('index.html'), 'text/html'],
  ['a style', '/styles/aero.css', f('styles', 'aero.css'), 'text/css'], ['an asset', '/assets/icon.svg', f('assets', 'icon.svg'), 'image/svg+xml'],
  ['the terminal library', '/vendor/@xterm/xterm/lib/xterm.js', f('node_modules', '@xterm', 'xterm', 'lib', 'xterm.js'), 'text/javascript'],
  ['an empty path is the page', '', f('index.html'), 'text/html'], ['a nil path is the page', null, f('index.html'), 'text/html'],
  ['an unknown kind', '/assets/thing.bin', f('assets', 'thing.bin'), 'application/octet-stream'],
], (p, file, type) => eq(L.servedFile(R, p), { file, type }));
each('H23 servedFile gives nothing for', [
  ['the host code', '/server.js'], ['the decisions', '/logic.js'], ['the ledger', '/data/swarm-ledger.jsonl'], ['the windows written down', '/data/windows.json'], ['the package file', '/package.json'],
  ['another library', '/vendor/node-pty/package.json'], ['above the root', '/../etc/passwd'], ['above the root, encoded', '/%2e%2e/%2e%2e/etc/passwd'], ['up out of a served folder', '/styles/../server.js'],
  ['up out of vendor', '/vendor/@xterm/../../server.js'], ['backslashes', '/styles\\..\\server.js'], ['a nul', '/styles/a%00.css'], ['a broken encoding', '/%E0%A4%A'], ['a look-alike folder', '/styles-other/x.css'],
], p => eq(L.servedFile(R, p), null));

test('H24 the worst inputs answer within 50 ms each', () => {
  const big = ('\x1b[31mA1 lotus\x1b[0m ').repeat(K.BUFFER / 18 | 0), crowd = Array.from({ length: 4444 }, (_, i) => ({ id: String(i), alive: i % 2 === 0, role: 'worker', cmd: 'bash', keep: i % 3 === 0 }));
  for (const [name, fn] of [['plain', () => L.plain(big)], ['followed', () => L.followed(big, 'A1', 'A1')], ['targets', () => L.targets(crowd, crowd.map(w => w.id))], ['workersFor', () => L.workersFor(crowd, crowd[0], crowd.map(w => w.id))],
    ['toKeep', () => L.toKeep(crowd)], ['parseJudge', () => L.parseJudge('x'.repeat(1e6))], ['servedFile', () => L.servedFile(R, '/' + 'a/'.repeat(20000))], ['lastLines', () => L.lastLines('line\n'.repeat(200000))]]) {
    const t0 = performance.now(); fn(); const ms = performance.now() - t0; assert.ok(ms < 50, `${name} took ${ms.toFixed(1)} ms`);
  }
});
