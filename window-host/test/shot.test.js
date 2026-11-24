// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module D, screenshots and the ledger reader.
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path');
const { startHost } = require('./helpers');
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

test('D1 a screenshot is saved as a png in the shots folder', async () => {
  const { file } = await h.json('/api/shot', { png });
  assert.ok(file.startsWith(path.join(h.data, 'shots'))); assert.ok(fs.readFileSync(file).subarray(1, 4).toString() === 'PNG');
});
test('D2 two screenshots never share a file', async () => {
  const a = (await h.json('/api/shot', { png })).file; await new Promise(r => setTimeout(r, 5)); const b = (await h.json('/api/shot', { png })).file;
  assert.notStrictEqual(a, b);
});
test('D3 an empty ledger reads as empty text', async () => assert.strictEqual((await h.api('/api/ledger')).text, ''));
test('D4 the ledger returns at most the last 200 lines', async () => {
  for (let i = 0; i < 222; i++) await h.json('/api/swarm', { ids: [], text: 'true' });
  assert.ok((await h.api('/api/ledger')).text.split('\n').length <= 200);
});
