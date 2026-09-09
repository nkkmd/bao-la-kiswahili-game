"use strict";
// 公開ファイルの検証用配信。有効化と切戻しの2箇所だけを明示的に置換する。
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const playwright = require('playwright');
const engine = process.argv[2] || 'chromium';
assert(['chromium', 'firefox', 'webkit'].includes(engine));
const dir = path.resolve(__dirname, '../../public');
const out = path.resolve(__dirname, '../../artifacts/local/pbai-c015-browser', engine);
fs.mkdirSync(out, { recursive: true });
let mode = 'candidate';
let originUnavailable = false;
let modelUnavailable = false;
const report = { engine, sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  physicalDeviceVerified: false, strengthInferenceAuthorized: false, networkFailureMode: 'origin-connection-closed', passed: false, checks: [],
  transformations: ['candidate: PBAI_C015_ENABLED false -> true', 'rollback: Service Worker v34 -> v35; candidate flag remains false'],
};
const server = http.createServer((req, res) => {
  if (originUnavailable) { req.socket.destroy(); return; }
  const name = req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0].slice(1);
  if (!/^[\w.-]+$/.test(name)) return res.writeHead(404).end();
  if (modelUnavailable && name === 'logic-evaluator.js') return res.writeHead(404).end();
  const file = path.join(dir, name === 'privacy' ? 'privacy.html' : name);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
  let body = fs.readFileSync(file);
  if (name === 'ai-release.js' && mode === 'candidate') body = Buffer.from(body.toString().replace('const PBAI_C015_ENABLED = false;', 'const PBAI_C015_ENABLED = true;'));
  if (name === 'service-worker.js' && mode === 'rollback') body = Buffer.from(body.toString().replace('bao-la-kiswahili-v34', 'bao-la-kiswahili-v35'));
  const mime = name.endsWith('.js') ? 'text/javascript' : name.endsWith('.css') ? 'text/css' : name.endsWith('.svg') ? 'image/svg+xml' : name.endsWith('.webmanifest') ? 'application/manifest+json' : 'text/html';
  res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' }); res.end(body);
});
let browser;
async function eventually(predicate) {
  const deadline = Date.now() + 30000;
  while (!(await predicate())) {
    if (Date.now() >= deadline) throw Error('非同期状態の待機期限');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
async function check(name, fn) { await fn(); report.checks.push(name); console.log(engine + ': ' + name); }
async function pageFor(options = {}, init) {
  const context = await browser.newContext({ reducedMotion: 'reduce', ...options });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ body: '' }));
  await page.goto(report.origin); await page.waitForFunction(() => typeof BaoAIConfig !== 'undefined');
  return { context, page };
}
async function start(page, level = 'hard') {
  await page.selectOption('#game-mode', 'computer');
  await page.selectOption('#difficulty', level);
  await page.selectOption('#player-side', 'second');
  await page.click('#start-game');
  await page.waitForFunction(() => lastAIDiagnostic !== null && !isAIActive(), { }, { timeout: 20000 });
  return page.evaluate(() => lastAIDiagnostic);
}
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  report.origin = `http://127.0.0.1:${server.address().port}/`;
  try {
    browser = await playwright[engine].launch(); report.browserVersion = browser.version();
    const { context, page } = await pageFor();
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    await check('公開画面でhard候補が着手し診断に識別子を保存', async () => {
      const d = await start(page); assert.equal(d.ai.stats.evaluationCandidate, 'PBAI-C015-v1');
      assert.equal(d.ai.stats.evaluationFallback, false);
    });
    await check('継続する3応答でも候補を維持', async () => {
      for (let i = 0; i < 3; i++) {
        await page.waitForFunction(() => !animation && !isAIActive() && isHumanTurn());
        await page.evaluate(() => { lastAIDiagnostic = null; playMove(E.moveVariants(state)[0]); });
        await page.waitForFunction(() => lastAIDiagnostic !== null && !isAIActive(), {}, { timeout: 20000 });
        assert.equal(await page.evaluate(() => lastAIDiagnostic.ai.stats.evaluationCandidate), 'PBAI-C015-v1');
      }
    });
    page.on('dialog', dialog => dialog.accept());
    await check('新規対局と難易度変更でexpertは基準AI', async () => {
      await page.click('#new-game'); const d = await start(page, 'expert');
      assert.equal(d.ai.stats.evaluationCandidate, undefined);
    });
    await check('思考開始後の新規対局で古い応答を適用しない', async () => {
      await page.click('#new-game');
      await page.selectOption('#difficulty', 'hard'); await page.click('#start-game');
      await page.waitForFunction(() => aiThinking && aiWorker !== null); await page.click('#new-game');
      const key = await page.evaluate(() => AI.stateKey(state));
      await page.waitForTimeout(1200);
      assert.deepEqual(await page.evaluate(() => ({ started, active: isAIActive(), key: AI.stateKey(state) })), { started: false, active: false, key });
    });
    await check('配信元への通信不能時に候補資産をキャッシュから利用', async () => {
      await page.evaluate(async () => { await navigator.serviceWorker.ready; await caches.open('bao-la-kiswahili-v33'); });
      await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
      assert(await page.evaluate(async () => !!(await (await caches.open('bao-la-kiswahili-v34')).match('./logic-evaluator.js'))));
      originUnavailable = true; await page.reload();
      const d = await start(page); assert.equal(d.ai.stats.evaluationCandidate, 'PBAI-C015-v1');
      originUnavailable = false;
    });
    await check('設定無効化とキャッシュ更新で基準AIへ切戻す', async () => {
      mode = 'rollback';
      await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
      await eventually(() => page.evaluate(async () => { const names = await caches.keys(); return names.includes('bao-la-kiswahili-v35') && !names.includes('bao-la-kiswahili-v34') && !names.includes('bao-la-kiswahili-v33'); }));
      assert.equal(await page.evaluate(async () => (await caches.keys()).includes('bao-la-kiswahili-v33')), false);
      await page.reload();
      assert.equal(await page.evaluate(() => BaoReleaseConfig.searchOptions('hard').pbaiC015LogicGate), undefined);
      const d = await start(page); assert.equal(d.ai.stats.evaluationCandidate, undefined);
      originUnavailable = true; await page.reload();
      assert.equal(await page.evaluate(() => BaoReleaseConfig.searchOptions('hard').pbaiC015LogicGate), undefined);
      originUnavailable = false;
    });
    assert.deepEqual(errors, []); await context.close(); mode = 'candidate';
    for (const failure of ['unavailable', 'error']) await check('Worker ' + failure + '時の直接実行も候補を使用', async () => {
      const { context: c, page: p } = await pageFor({ serviceWorkers: 'block' }, failure === 'unavailable'
        ? () => { window.Worker = undefined; }
        : () => { const W = window.Worker; window.Worker = class extends W { constructor() { super(URL.createObjectURL(new Blob(['throw Error("injected")'], { type: 'text/javascript' }))); } }; });
      assert.equal((await start(p)).ai.stats.evaluationCandidate, 'PBAI-C015-v1'); await c.close();
    });
    await check('モデル未取得時の公開画面は基準AIで着手', async () => {
      const c = await browser.newContext({ reducedMotion: 'reduce', serviceWorkers: 'block' });
      const p = await c.newPage(); modelUnavailable = true;
      await p.goto(report.origin);
      const d = await start(p); assert.equal(d.ai.stats.evaluationCandidate, 'AI-GEN3-baseline'); assert.equal(d.ai.stats.evaluationFallback, true);
      modelUnavailable = false; await c.close();
    });
    report.passed = true;
  } catch (e) { report.error = String(e.stack || e); process.exitCode = 1; }
  finally {
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report)); if (browser) await browser.close(); server.close();
  }
})();
