"use strict";
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const { browserSession, attachWorker, heapSamples } = require("./pbai-p15-worker-cdp.cjs");

const ROOT = process.cwd();
const outDir = path.join(ROOT, "artifacts/local/pbai-p15-preflight");
fs.mkdirSync(outDir, { recursive: true });
const outputPath = path.join(outDir, "preflight.json");
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const file = pathname === "/__p15" ? path.join(ROOT, "tools/pbai-p15-worker-harness.html")
    : pathname.startsWith("/public/") ? path.join(ROOT, pathname.slice(1)) : null;
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end("not found");
    return;
  }
  const type = file.endsWith(".html") ? "text/html; charset=utf-8" : "text/javascript; charset=utf-8";
  response.writeHead(200, {
    "content-type": type,
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-embedder-policy": "require-corp",
    "cross-origin-resource-policy": "same-origin",
    "cache-control": "no-store",
  });
  fs.createReadStream(file).pipe(response);
});
let browser;
async function main() {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const address = server.address();
  await page.goto("http://127.0.0.1:" + address.port + "/__p15");
  const crossOriginIsolated = await page.evaluate(() => PBAIP15.crossOriginIsolated());
  if (!crossOriginIsolated) throw new Error("cross-origin isolation preflight failed");
  const cdp = await browserSession(browser);
  const state = await page.evaluate(() => BaoEngine.initialState());
  // Measure a real, still-running dedicated Worker after a normal request.
  await page.evaluate(() => PBAIP15.openLongWorker());
  let worker;
  let row;
  let heap;
  try {
    worker = await attachWorker(cdp);
    row = await page.evaluate((item) =>
      PBAIP15.longSessionRequest({ ply: 0, state: item }, 901001, "hard", 0), state);
    if (!row.legalMove || !row.positionKeyMatch) throw new Error("Worker response preflight failed");
    heap = await heapSamples(worker);
  } finally {
    if (worker) await worker.detach().catch(() => {});
    await page.evaluate(() => PBAIP15.endLongWorker()).catch(() => {});
  }
  const cancellation = await page.evaluate(async () => {
    const initial = BaoEngine.initialState();
    const worker = new Worker("/public/ai-release-worker.js");
    let delivered = false;
    const id = 9911001;
    worker.addEventListener("message", (event) => { if (event.data && event.data.id === id) delivered = true; });
    worker.postMessage({
      type: "search", id, state: BaoEngine.clone(initial), level: "expert",
      options: BaoReleaseConfig.searchOptions("expert", { hardwareConcurrency: 4, deviceMemory: 4 }, initial),
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    worker.terminate();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const staleSuppressed = !delivered;
    const fresh = await PBAIP15.measureMode([{ ply: 0, state: initial }], 901002, "hard", "warm");
    return { staleSuppressed, freshWorkerResponded: fresh[0].legalMove && fresh[0].positionKeyMatch };
  });
  if (!cancellation.staleSuppressed || !cancellation.freshWorkerResponded) {
    throw new Error("cancel/restart preflight failed");
  }
  const checkpoint = { ok: true, time: new Date().toISOString() };
  const checkpointPath = path.join(outDir, "checkpoint-smoke.json");
  fs.writeFileSync(checkpointPath + ".tmp", JSON.stringify(checkpoint));
  fs.renameSync(checkpointPath + ".tmp", checkpointPath);
  if (!JSON.parse(fs.readFileSync(checkpointPath, "utf8")).ok) throw new Error("atomic checkpoint smoke failed");
  const report = {
    status: "PASS",
    browser: { name: "chromium", version: browser.version(), playwright: require("playwright/package.json").version },
    crossOriginIsolated, workerTarget: worker.target, workerHeap: heap,
    workerResponse: { legalMove: row.legalMove, positionKeyMatch: row.positionKeyMatch },
    cancellation, checkpointRecovery: "PASS",
  };
  fs.writeFileSync(outputPath + ".tmp", JSON.stringify(report, null, 2) + "\n");
  fs.renameSync(outputPath + ".tmp", outputPath);
  process.stdout.write(JSON.stringify(report) + "\n");
}
main().catch((error) => {
  const report = { status: "FAIL", error: String(error && error.stack || error) };
  fs.writeFileSync(outputPath + ".tmp", JSON.stringify(report, null, 2) + "\n");
  fs.renameSync(outputPath + ".tmp", outputPath);
  process.stderr.write(report.error + "\n");
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close().catch(() => {});
  if (server.listening) await new Promise((resolve) => server.close(resolve));
});
