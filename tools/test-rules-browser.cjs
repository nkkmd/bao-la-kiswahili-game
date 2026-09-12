"use strict";

// node tools/test-rules-browser.cjs [chromium|firefox|webkit]
// Playwrightで日英表示、対局からの導線、拡大、オフラインの実際の動作を確認する。
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const playwright = require("playwright");
const engine = process.argv[2] || "chromium";
assert.ok(["chromium", "firefox", "webkit"].includes(engine));
const root = path.resolve(__dirname, "../public");
const out = path.resolve(__dirname, "../artifacts/local/rules-browser", engine);
fs.mkdirSync(out, { recursive: true });
const report = { engine, passed: false, physicalDeviceVerified: false, networkFailureMode: "origin-connection-closed", checks: [] };
let serveOld = false;
let originUnavailable = false;
const oldWorker = require("node:child_process").execFileSync("git", ["show", "109bac01a44b40a3c3a1d1408ddc956b607eeae4:public/service-worker.js"], { encoding: "utf8" });
const server = http.createServer((req, res) => {
  if (originUnavailable) { req.socket.destroy(); return; }
  const url = new URL(req.url, "http://localhost");
  // Cloudflare Pagesと同じ、HTMLからclean URLへのリダイレクトを再現する。
  if (["/rules.html", "/privacy.html", "/index.html"].includes(url.pathname)) {
    const clean = url.pathname === "/index.html" ? "/" : url.pathname.replace(/\.html$/, "");
    res.writeHead(301, { Location: clean + url.search }); res.end(); return;
  }
  const resource = { "/": "/index.html", "/rules": "/rules.html", "/privacy": "/privacy.html" }[url.pathname] || url.pathname;
  const file = path.resolve(root, "." + resource);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  const body = serveOld && resource === "/service-worker.js" ? oldWorker : fs.readFileSync(file);
  const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" }[path.extname(file)] || "text/plain";
  res.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" }); res.end(body);
});
async function check(name, run) { await run(); report.checks.push(name); console.log(name); }
async function cacheReady(page, version = "v40") {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.waitForFunction(async v => (await caches.keys()).includes("bao-la-kiswahili-" + v), version);
  await page.waitForFunction(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    return r?.active?.state === "activated" && navigator.serviceWorker.controller === r.active;
  });
}
async function allImages(page) {
  await page.locator("figure img").evaluateAll(images => images.forEach(img => { img.loading = "eager"; }));
  await page.waitForFunction(() => [...document.querySelectorAll("figure img")].every(img => img.complete && img.naturalWidth > 0));
  assert.equal(await page.locator("figure img").count(), 10);
}
async function fits(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "横にはみ出さない");
}
let browser;
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    browser = await playwright[engine].launch();
    report.browserVersion = browser.version();
    const context = await browser.newContext({ locale: "ja-JP", viewport: { width: 412, height: 915 }, isMobile: engine !== "firefox", hasTouch: true });
    await context.route("https://www.googletagmanager.com/**", route => route.fulfill({ body: "" }));
    const errors = [];
    context.on("page", p => p.on("pageerror", e => errors.push(String(e))));
    const page = await context.newPage();
    await check("日本語自動表示・全図版・ページ内リンク", async () => {
      await page.goto(origin + "/rules");
      await allImages(page); await cacheReady(page); await fits(page);
      assert.equal(await page.locator("html").getAttribute("lang"), "ja");
      assert.equal(await page.locator("[data-ja]").evaluateAll(nodes => nodes.every(n => n.textContent === n.dataset.ja)), true);
      assert.equal(await page.locator("[data-ja-alt]").evaluateAll(nodes => nodes.every(n => n.alt === n.dataset.jaAlt)), true);
      assert.equal(await page.locator('a[href^="#"]').evaluateAll(nodes => nodes.every(n => document.getElementById(n.hash.slice(1)))), true);
      await page.screenshot({ path: path.join(out, "rules-ja-mobile.png"), fullPage: true });
    });
    await check("図の拡大・Escapeで閉じる・フォーカス復帰", async () => {
      const zoom = page.locator(".figure-zoom").first();
      await zoom.click();
      assert.equal(await page.locator("dialog").evaluate(d => d.open), true);
      assert.ok((await page.locator("dialog img").getAttribute("alt")).includes("全穴"));
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog").evaluate(d => d.open), false);
      assert.equal(await zoom.evaluate(n => n === document.activeElement), true);
    });
    await check("英語への明示切替と節の位置の維持", async () => {
      await page.locator('#contents a[href="#capture"]').click();
      await page.locator('[data-language="en"]').click();
      await page.waitForLoadState("load");
      assert.ok(page.url().endsWith("?lang=en#capture"));
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      assert.equal(await page.locator("#capture-title").textContent(), "Capture and choose an entry side");
      assert.equal(await page.locator('[data-language="en"]').getAttribute("aria-current"), "true");
      assert.ok((await page.locator('figure img').first().getAttribute("alt")).startsWith("Every pit"));
      await allImages(page);
    });
    await check("日英・幅320/360/412/1280で本文と細則が収まる", async () => {
      for (const lang of ["en", "ja"]) {
        await page.goto(origin + "/rules?lang=" + lang);
        await page.locator("details").evaluateAll(nodes => nodes.forEach(n => n.open = true));
        for (const width of [320, 360, 412, 1280]) { await page.setViewportSize({ width, height: 900 }); await fits(page); }
        await allImages(page);
        await page.screenshot({ path: path.join(out, `rules-${lang}-desktop.png`), fullPage: true });
      }
    });
    await check("オフラインで言語指定・HTML別名・未閲覧の図版・ゲームへ戻る", async () => {
      await cacheReady(page);
      originUnavailable = true;
      for (const suffix of ["/rules?lang=en", "/rules?lang=ja", "/rules.html?lang=en"]) {
        console.log("通信遮断中のURL: " + suffix);
        await page.goto(origin + suffix); await allImages(page);
        assert.equal(await page.locator("html").getAttribute("lang"), suffix.includes("lang=ja") ? "ja" : "en");
      }
      await page.locator(".rules-topbar [data-locale-link]").click();
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await page.waitForFunction(() => !!window.BaoEngine);
      originUnavailable = false;
    });
    await check("対局中の導線は同じ言語の別タブを開き、元の盤面を保つ", async () => {
      await page.goto(origin + "/?lang=ja");
      await page.selectOption("#game-mode", "local");
      await page.click("#start-game");
      const before = await page.evaluate(() => JSON.stringify(state));
      await page.locator('summary[data-ja="遊び方・採用ルール"]').click();
      const [guide] = await Promise.all([context.waitForEvent("page"), page.locator(".rules-guide-link").click()]);
      await guide.waitForLoadState();
      assert.ok(guide.url().endsWith("/rules?lang=ja"));
      assert.equal(await page.evaluate(() => JSON.stringify(state)), before);
      await guide.close();
      await page.screenshot({ path: path.join(out, "game-rules-link.png"), fullPage: true });
    });
    await check("JavaScript無効時も英語本文と図版を読める", async () => {
      const noJS = await browser.newContext({ javaScriptEnabled: false });
      const staticPage = await noJS.newPage();
      await staticPage.goto(origin + "/rules");
      assert.equal(await staticPage.locator(".rules-section").count(), 10);
      assert.equal(await staticPage.locator("#goal-title").textContent(), "What are you trying to do?");
      await noJS.close();
    });
    await check("旧v39キャッシュから更新後、初めて開くルールをオフライン表示", async () => {
      const upgrade = await browser.newContext({ locale: "en-US" });
      const p = await upgrade.newPage();
      await p.route("https://www.googletagmanager.com/**", route => route.fulfill({ body: "" }));
      serveOld = true;
      await p.goto(origin + "/"); await cacheReady(p, "v39");
      serveOld = false;
      await p.evaluate(async () => {
        const changed = new Promise(resolve => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
        await (await navigator.serviceWorker.getRegistration()).update();
        await changed;
      });
      await cacheReady(p, "v40");
      await p.waitForFunction(async () => !(await caches.keys()).includes("bao-la-kiswahili-v39"));
      originUnavailable = true;
      await p.goto(origin + "/rules?lang=ja"); await allImages(p);
      assert.equal(await p.locator("html").getAttribute("lang"), "ja");
      await p.locator('[data-language="en"]').click();
      await p.waitForLoadState("load");
      assert.equal(await p.locator("html").getAttribute("lang"), "en");
      await upgrade.close();
      originUnavailable = false;
    });
    assert.deepEqual(errors, []);
    report.passed = true;
    await context.close();
  } finally {
    fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
    await browser?.close(); server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
