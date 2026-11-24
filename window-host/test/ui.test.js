// (: SMILE (PROMPT SYSTEM) SYNTAX :)
// Module E, the client page in a real browser.
const test = require('node:test'), assert = require('node:assert');
const { chromium } = require('playwright');
const { startHost, until } = require('./helpers');
let h, b, p;
test.before(async () => { h = await startHost(); b = await chromium.launch({ headless: !process.env.HEADFUL }); });
test.after(async () => { await b.close(); h.stop(); });
test.beforeEach(async () => { for (const w of await h.json('/api/windows')) await h.json('/api/kill', { id: w.id }); p = await b.newPage({ viewport: { width: 1400, height: 900 } }); await p.goto(h.base); });
test.afterEach(async () => p.close());
// returns a locator fixed to the new window, not to whichever window is last later
const open = async (cmd = 'bash --norc') => { const n = await p.locator('.win').count(); await p.fill('#custom', cmd); await p.click('#launch'); await p.locator('.win').nth(n).waitFor(); return p.locator('.win').nth(n); };

test('E1 the taskbar Shell button opens a window titled with its command', async () => {
  await p.click('[data-cmd="bash"]'); await p.waitForSelector('.win .tt span:has-text("bash")');
});
test('E2 typing into a window reaches the program and its output is drawn', async () => {
  const w = await open(); await w.locator('.xterm-helper-textarea').focus(); await p.keyboard.type('echo lotus-$((1100+11))\n');
  await until(async () => (await w.locator('.xterm-rows').textContent()).includes('lotus-1111'));
});
test('E3 a custom command opens as a window', async () => { const w = await open('echo jasmine; sleep 5'); await until(async () => (await w.textContent()).includes('jasmine')); });
test('E4 a finished program shows that it ended', async () => { const w = await open('true'); await until(async () => (await w.textContent()).includes('process ended')); });
test('E5 an empty custom command opens nothing', async () => { await p.fill('#custom', '  '); await p.click('#launch'); await p.waitForTimeout(400); assert.strictEqual(await p.locator('.win').count(), 0); });
test('E6 Close removes the window and ends its program', async () => {
  const w = await open(); const id = (await w.locator('.tt span').textContent()).match(/#(\d+)/)[1];
  await w.locator('.x').click(); await until(async () => !(await h.json('/api/windows')).some(x => x.id === id));
});
test('E7 Fill expands the window to the desk', async () => {
  const w = await open(); await w.locator('.max').click(); const bb = await w.boundingBox();
  assert.ok(bb.width > 1000 && bb.x <= 1 && bb.y <= 1);
});
test('E8 dragging the title bar moves the window', async () => {
  const w = await open(); const a = await w.boundingBox(); const t = await w.locator('.tt span').boundingBox();
  await p.mouse.move(t.x + 20, t.y + 5); await p.mouse.down(); await p.mouse.move(t.x + 220, t.y + 105, { steps: 5 }); await p.mouse.up();
  const z = await w.boundingBox(); assert.ok(Math.abs(z.x - a.x - 200) < 3 && Math.abs(z.y - a.y - 100) < 3);
});
test('E9 clicking a window brings it to the front and highlights it', async () => {
  const one = await open(); await open(); await one.locator('.tt span').click({ position: { x: 20, y: 6 } });
  assert.ok(await one.evaluate(e => e.classList.contains('focus')));
  const zs = await p.$$eval('.win', ws => ws.map(w => +w.style.zIndex)); assert.strictEqual(Math.max(...zs), zs[0]);
});
test('E10 resizing a window resizes its terminal', async () => {
  const w = await open(); const id = (await w.locator('.tt span').textContent()).match(/#(\d+)/)[1];
  await w.evaluate(e => { e.style.width = '900px'; e.style.height = '500px'; });
  await w.locator('.xterm-helper-textarea').focus(); await p.keyboard.type('tput cols\n');
  await until(async () => +((await w.locator('.xterm-rows').textContent()).match(/tput cols\s*(\d+)/) || [])[1] > 100);
});
test('E11 the send button is disabled until an instruction is written', async () => {
  assert.ok(await p.isDisabled('#send')); await p.fill('#msg', 'lotus'); assert.ok(!(await p.isDisabled('#send')));
});
test('E12 the Sangha prompt carries every panel setting in Smile', async () => {
  await open(); await p.fill('#style', 'gentle-style-44'); await p.fill('#roles', 'role-33'); await p.fill('#tools', 'tool-22'); await p.fill('#values', 'value-11');
  await p.selectOption('#net', { index: 2 }); await p.uncheck('#shot'); await p.uncheck('#judge'); await p.fill('#msg', 'instruction-1717'); await p.click('#send');
  await until(async () => (await h.ledger()).some(e => e.kind === 'prompt' && e.text.includes('instruction-1717')));
  const t = (await h.ledger()).reverse().find(e => e.kind === 'prompt').text;
  for (const s of ['gentle-style-44', 'role-33', 'tool-22', 'value-11', 'mesh', '(-: Sangha prompt (-:', 'SMILE-ACK-']) assert.ok(t.includes(s), s);
  assert.ok(!t.includes('Screenshot'));
});
test('E13 ticked windows alone receive the prompt', async () => {
  const a = await open(); await open(); await a.locator('.tt input').check(); const id = (await a.locator('.tt span').textContent()).match(/#(\d+)/)[1];
  await p.uncheck('#shot'); await p.fill('#msg', 'only-ticked'); await p.click('#send');
  await until(async () => (await p.textContent('#status')) === `sent to windows ${id}`);
});
test('E14 the screenshot option saves an image and names it in the prompt', async () => {
  await open(); await p.check('#shot'); await p.fill('#msg', 'with-picture'); await p.click('#send');
  await until(async () => (await h.ledger()).some(e => e.kind === 'prompt' && e.text.includes('with-picture') && /shots.\d+-\w+\.png/.test(e.text)), 15000);
});
test('E15 the ledger panel shows recent ledger lines', async () => { await open(); await until(async () => (await p.textContent('#ledger')).includes('spawn'), 6000); });
test('E16 reloading the page restores windows that are still running', async () => {
  await open(); const n = (await h.json('/api/windows')).filter(w => w.alive).length; await p.reload();
  await until(async () => (await p.locator('.win').count()) === n);
});
test('E17 the Prompter button opens a window marked Prompter, and both send buttons wait for an instruction', async () => {
  await p.evaluate(() => document.querySelector('[data-role=prompter]').dataset.cmd = 'bash --norc');
  await p.click('[data-role=prompter]'); await p.waitForSelector('.win .tt span:has-text("Prompter")');
  assert.ok(await p.isDisabled('#viaPrompter')); await p.fill('#msg', 'lotus'); assert.ok(!(await p.isDisabled('#viaPrompter')));
  await p.uncheck('#shot'); await p.click('#viaPrompter'); await until(async () => (await p.textContent('#status')).startsWith('sent to the Prompter'));
});
test('E18 on a phone the windows stack full width and the Sangha panel opens from the taskbar', async () => {
  await p.setViewportSize({ width: 390, height: 844 }); await open();
  const bb = await p.locator('.win').first().boundingBox(); assert.ok(bb.width > 360);
  assert.ok(!(await p.isVisible('#swarm'))); await p.click('#panelBtn'); assert.ok(await p.isVisible('#swarm'));
});
