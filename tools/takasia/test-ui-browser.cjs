"use strict";
// 工程6の日英表示・入力・棋譜・キャッシュを実ブラウザーで確認する。実機確認は別工程。
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), http = require("node:http");
const playwright = require("playwright");
const F = require("./fixtures.json"), R = require("./record-fixtures.json");
const engine = process.argv[2] || "chromium";
assert.ok(["chromium", "firefox", "webkit"].includes(engine));
const root = path.resolve(__dirname, "../../public");
const out = path.resolve(__dirname, "../../artifacts/local/takasia-ui", engine);
fs.mkdirSync(out, { recursive: true });
const report = { engine, passed: false, physicalDeviceVerified: false, checks: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
let oldWorker = false, offline = false;
const server = http.createServer((req, res) => {
  if (offline) { req.socket.destroy(); return; }
  const url = new URL(req.url, "http://localhost");
  const name = { "/": "/index.html", "/rules": "/rules.html", "/privacy": "/privacy.html" }[url.pathname] || url.pathname;
  const file = path.resolve(root, "." + name);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const body = oldWorker && name === "/service-worker.js"
    ? fs.readFileSync(path.join(__dirname, "history/service-worker-v55.js")) : fs.readFileSync(file);
  const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" }[path.extname(file)] || "application/json";
  res.writeHead(200, { "Content-Type": mime + "; charset=utf-8", "Cache-Control": "no-store" }); res.end(body);
});
async function check(name, run) { await run(); report.checks.push(name); save(); console.log(name); }
async function fits(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "横にはみ出さない");
}
async function board(page, position) {
  await page.evaluate(input => {
    cancelAI(); started = true; startScreen.hidden = true; gameModeSelect.value = "local"; sound = false;
    animation = null; state = E.clone(input); displayState = E.clone(state); moves = E.legalMoves(state);
    selected = null; choices = []; choiceBoxes = []; afterMove(); draw(performance.now());
  }, position);
}
async function images(page) {
  await page.locator("figure img").evaluateAll(ns => ns.forEach(n => { n.loading = "eager"; }));
  await page.waitForFunction(() => [...document.querySelectorAll("figure img")].every(n => n.complete && n.naturalWidth > 0));
  assert.equal(await page.locator("figure img").count(), 12);
}
async function cacheReady(page, version) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(async v => !!navigator.serviceWorker.controller
    && (await caches.keys()).includes("bao-la-kiswahili-" + v), version);
}
let browser;
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    browser = await playwright[engine].launch();
    report.browserVersion = browser.version();
    for (const language of ["ja", "en"]) {
      const context = await browser.newContext({ locale: language, viewport: { width: 412, height: 915 },
        deviceScaleFactor: 2, reducedMotion: "reduce", serviceWorkers: "block" });
      await context.route("https://www.googletagmanager.com/**", r => r.fulfill({ body: "" }));
      const page = await context.newPage(); page.on("pageerror", e => report.errors.push(String(e)));
      await check(language + "：図解・全12画像・ページ内リンク・320/412/1280幅", async () => {
        await page.goto(origin + "/rules?lang=" + language);
        await images(page);
        assert.equal(await page.locator("html").getAttribute("lang"), language);
        assert.equal(await page.locator('a[href^="#"]').evaluateAll(ns => ns.every(n => document.getElementById(n.hash.slice(1)))), true);
        if (language === "ja") {
          assert.equal(await page.locator("[data-ja]").evaluateAll(ns => ns.every(n => n.textContent === n.dataset.ja)), true);
          assert.equal(await page.locator("[data-ja-alt]").evaluateAll(ns => ns.every(n => n.alt === n.dataset.jaAlt)), true);
        }
        await page.locator("details").evaluateAll(ns => ns.forEach(n => { n.open = true; }));
        for (const width of [320, 412, 1280]) { await page.setViewportSize({ width, height: 915 }); await fits(page); }
        await page.locator("#takasia").screenshot({ path: path.join(out, "guide-" + language + ".png") });
        await page.setViewportSize({ width: 412, height: 915 });
      });
      await check(language + "：takasia図の拡大・代替テキスト・Escape", async () => {
        const zoom = page.locator('#takasia .figure-zoom').first();
        await zoom.click();
        assert.equal(await page.locator("dialog").evaluate(n => n.open), true);
        assert.match(await page.locator("dialog img").getAttribute("alt"), /a4/);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("dialog").evaluate(n => n.open), false);
        assert.equal(await zoom.evaluate(n => n === document.activeElement), true);
      });
      await page.goto(origin + "/?lang=" + language);
      await check(language + "：North対象・実タップの拒否・正しい規則リンク", async () => {
        await board(page, F.e30.post); await fits(page);
        const target = await page.evaluate(() => {
          const b = canvas.getBoundingClientRect();
          return { x: PIT_X[screenIndex(1, 3)] * b.width / 640,
            y: (ROW_Y[rowFor(1, 0)] - BOARD_OFFSET_Y) * b.height / 330 };
        });
        await page.locator("#game").click({ position: target });
        assert.equal(await page.evaluate(() => selected), null);
        assert.match(await page.locator("#visible-help").textContent(), language === "ja" ? /開始できません/ : /cannot start/);
        assert.ok((await page.locator("#visible-help a").getAttribute("href")).endsWith("?lang=" + language + "#takasia"));
        await page.locator("#game").screenshot({ path: path.join(out, "north-target-" + language + ".png") });
      });
      await check(language + "：South対象・外周枠・320幅", async () => {
        const swapped = structuredClone(F.e30.post);
        swapped.pits.reverse(); swapped.houseOwned.reverse(); swapped.player = 0; swapped.takasia.player = 0;
        await board(page, swapped); await page.setViewportSize({ width: 320, height: 915 }); await fits(page);
        assert.match(await page.locator("#takasia-status").textContent(), /A4/);
        await page.screenshot({ path: path.join(out, "south-target-" + language + "-320.png"), fullPage: true });
        assert.equal(await page.evaluate(() => {
          draw(performance.now());
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          for (const y of [77, 353]) for (let x = 40; x <= 600; x++) {
            const i = (Math.floor((y - BOARD_OFFSET_Y) * canvas.height / 330) * canvas.width
              + Math.floor(x * canvas.width / 640)) * 4;
            if ([226, 195, 107, 255].some((v, c) => Math.abs(pixels[i + c] - v) > 1)) return false;
          }
          return true;
        }), true);
        await page.setViewportSize({ width: 412, height: 915 });
      });
      await check(language + "：通常・FASTの成立と対象での停止・失効・終了理由", async () => {
        for (const fastMode of [false, true]) {
          await board(page, F.e30.predecessor);
          await page.evaluate(({ move, fastMode }) => { fast = fastMode; playMove(move); }, { move: F.e30.move, fastMode });
          await page.waitForFunction(() => !animation && state.takasia?.index === 3);
          await page.waitForFunction(() => !document.querySelector("#takasia-status").hidden);
          await page.evaluate(() => playMove(moves.find(m => m.index === 7 && m.direction === "left")));
          await page.waitForFunction(() => !animation && state.takasia === null);
          await page.waitForFunction(() => document.querySelector("#takasia-status").hidden);
          assert.equal(await page.evaluate(() => state.pits[1][0][3]), 5);
          assert.match(await page.locator("#visible-help").textContent(), /TAKASIA STOP/);
        }
      });
      await check(language + "：ファイルから新旧棋譜を読み、戻る・進む・版表示を確認", async () => {
        for (const name of ["current", "legacy"]) {
          await page.goto(origin + "/?lang=" + language);
          await page.selectOption("#game-mode", "replay");
          await page.locator("#replay-file").setInputFiles({ name: name + ".json", mimeType: "application/json",
            buffer: Buffer.from(JSON.stringify(R[name].record)) });
          await page.click("#start-game");
          await page.waitForFunction(() => !!replaySession && startScreen.hidden);
          assert.match(await page.locator("#replay-move-detail").textContent(), name === "legacy" ? /R-002/ : /v0.2.0/);
          if (name === "current") {
            const active = await page.evaluate(() => replaySession.states.findIndex(s => s.takasia));
            await page.evaluate(i => { fast = true; setReplayPosition(i); }, active);
            await page.waitForFunction(() => !document.querySelector("#takasia-status").hidden);
            await page.click("#replay-next");
            await page.waitForFunction(() => document.querySelector("#takasia-status").hidden);
            assert.match(await page.locator("#visible-help").textContent(), /TAKASIA STOP/);
            await page.click("#replay-back");
            await page.waitForFunction(() => !document.querySelector("#takasia-status").hidden);
          } else {
            await page.evaluate(() => { fast = true; setReplayPosition(60); });
            await page.click("#replay-next"); await page.click("#replay-back");
            assert.equal(await page.evaluate(() => replaySession.engine === BaoLegacyEngine), true);
            assert.equal(await page.locator("#takasia-status").isVisible(), false);
          }
        }
      });
      await context.close();
    }
    await check("v55からv57へ更新し、通信遮断中に日英ルール・全画像・ゲームを表示", async () => {
      const context = await browser.newContext();
      await context.route("https://www.googletagmanager.com/**", r => r.fulfill({ body: "" }));
      const page = await context.newPage(); page.on("pageerror", e => report.errors.push(String(e)));
      oldWorker = true; await page.goto(origin + "/"); await cacheReady(page, "v55");
      oldWorker = false;
      await page.evaluate(async () => {
        const changed = new Promise(resolve => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
        await (await navigator.serviceWorker.getRegistration()).update(); await changed;
      });
      await cacheReady(page, "v57");
      assert.equal(await page.evaluate(async () => (await caches.keys()).includes("bao-la-kiswahili-v55")), false);
      offline = true;
      for (const lang of ["ja", "en"]) {
        await page.goto(origin + "/rules?lang=" + lang); await images(page);
        assert.equal(await page.locator("html").getAttribute("lang"), lang);
        assert.match(await page.locator("#takasia-title").textContent(), /[Tt]akasia/);
      }
      await page.goto(origin + "/?lang=ja"); await board(page, F.e30.post);
      assert.match(await page.locator("#takasia-status").textContent(), /a4/);
      await context.close(); offline = false;
    });
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) { report.failure = String(error.stack || error); throw error; }
  finally { save(); await browser?.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
