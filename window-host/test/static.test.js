// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module B, files served to the browser.
const test = require('node:test'), assert = require('node:assert');
const { startHost } = require('./helpers');
let h; test.before(async () => h = await startHost()); test.after(() => h.stop());

test('B1 the root serves the client page', async () => assert.match((await h.api('/')).text, /Smile Window Host/));
test('B2 the terminal library is served from vendor', async () => assert.strictEqual((await h.api('/vendor/@xterm/xterm/lib/xterm.js')).status, 200));
test('B3 the fit addon and screenshot library are served', async () => {
  assert.strictEqual((await h.api('/vendor/@xterm/addon-fit/lib/addon-fit.js')).status, 200);
  assert.strictEqual((await h.api('/vendor/html2canvas/dist/html2canvas.min.js')).status, 200);
});
test('B4 a missing file is 404', async () => assert.strictEqual((await h.api('/lotus.html')).status, 404));
test('B5 paths outside the host folder are not served', async () => {
  for (const p of ['/../../etc/passwd', '/%2e%2e/%2e%2e/etc/passwd', '/vendor/../../../etc/hostname'])
    assert.notStrictEqual((await h.api(p)).status, 200, p);
});
test('B6 every served file starts with the Smile tag', async () => {
  const fs = require('fs'), path = require('path');
  for (const f of ['server.js', 'index.html', 'README.smile'])
    assert.match(fs.readFileSync(path.join(__dirname, '..', f), 'utf8').split('\n').slice(0, 2).join('\n'), /\(: SMILE \(PROMPT SYSTEM\) SYNTAX :\)/i, f);
});
