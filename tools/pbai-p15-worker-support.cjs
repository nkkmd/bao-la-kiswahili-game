"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const { browserSession, attachWorker, heapSamples } = require("./pbai-p15-worker-cdp.cjs");

const ROOT = process.cwd();
const BASELINE = "22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b";
const EXPECTED = {
  "public/main.js": "141909c6530f6598679c66a0b969b1b42d6472c5",
  "public/ai-release-worker.js": "6a65aa14e5e322e49dd5f5791bedd47fc2ad5273",
  "public/ai-release.js": "724bb412528f6b0b635e81c2992f1834063dffc6",
  "public/ai-config.js": "dc56e1a9c4af8999045cbf91c530a39ed1d4b8a2",
};
const SEED_START = 2026100201;
const SEEDS_PER_SHARD = 8;
const SHARD_COUNT = 8;
const SHARD = Number(process.argv[2]);
if (!Number.isInteger(SHARD) || SHARD < 0 || SHARD >= SHARD_COUNT) {
  throw new Error("usage: node tools/pbai-p15-worker-support.cjs SHARD_INDEX_0_TO_7");
}
const seedList = Array.from({ length: SEEDS_PER_SHARD }, (_, index) =>
  SEED_START + SHARD * SEEDS_PER_SHARD + index);
const outputDir = path.join(ROOT, "artifacts/local/pbai-p15-worker-support");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "shard-" + String(SHARD).padStart(2, "0") + ".json");

function gitHash(file) {
  return execFileSync("git", ["hash-object", file], { encoding: "utf8" }).trim();
}
function writeAtomic(value) {
  const text = JSON.stringify(value, null, 2) + "\n";
  const temporary = outputPath + ".tmp";
  fs.writeFileSync(temporary, text);
  fs.renameSync(temporary, outputPath);
}
const sourceHashes = Object.fromEntries(Object.entries(EXPECTED).map(([file, expected]) => {
  const actual = gitHash(file);
  if (actual !== expected) throw new Error("baseline source hash mismatch: " + file + " " + actual);
  return [file, actual];
}));
if (execFileSync("git", ["rev-parse", BASELINE], { encoding: "utf8" }).trim() !== BASELINE) {
  throw new Error("baseline commit unavailable");
}
const data = {
  study: "PBAI-P15-WORKER-BASELINE-SUPPORT",
  sourceCommit: BASELINE,
  checkedOutCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  shard: SHARD,
  shardCount: SHARD_COUNT,
  seeds: seedList,
  sourceHashes,
  browser: null,
  technicalStatus: "RUNNING",
  samples: [],
  longSessions: [],
  cancellation: null,
  errors: [],
};
writeAtomic(data);

function mime(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js") || file.endsWith(".cjs")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}
const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname); }
  catch { response.writeHead(400).end(); return; }
  let file;
  if (pathname === "/__p15") file = path.join(ROOT, "tools/pbai-p15-worker-harness.html");
  else if (pathname.startsWith("/public/")) file = path.join(ROOT, pathname.slice(1));
  else { response.writeHead(404).end("not found"); return; }
  const resolved = path.resolve(file);
  if (!resolved.startsWith(ROOT + path.sep) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    response.writeHead(404).end("not found");
    return;
  }
  response.writeHead(200, {
    "content-type": mime(resolved),
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-embedder-policy": "require-corp",
    "cross-origin-resource-policy": "same-origin",
    "cache-control": "no-store",
  });
  fs.createReadStream(resolved).pipe(response);
});

let activeBrowser = null;
async function main() {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  activeBrowser = await chromium.launch({ headless: true });
  data.browser = { name: "chromium", version: activeBrowser.version(), playwright: require("playwright/package.json").version };
  const page = await activeBrowser.newPage();
  page.setDefaultTimeout(30000);
  await page.goto("http://127.0.0.1:" + address.port + "/__p15", { waitUntil: "load" });
  const ready = { crossOriginIsolated: await page.evaluate(() => PBAIP15.crossOriginIsolated()) };
  data.preconditions = ready;
  writeAtomic(data);
  if (!ready.crossOriginIsolated) throw new Error("cross-origin isolation failed");
  const cdp = await browserSession(activeBrowser);

  function recordSampleMode(row, order) {
    let sample = data.samples.find((item) => item.seed === row.seed && item.level === row.level && item.ply === row.ply);
    if (!sample) {
      sample = { seed: row.seed, level: row.level, ply: row.ply, status: "PENDING", order };
      data.samples.push(sample);
    }
    const prefix = row.mode;
    sample[prefix + "Ms"] = row.elapsedMs;
    sample[prefix + "Move"] = row.move;
    sample[prefix + "PositionKeyMatch"] = row.positionKeyMatch;
    sample[prefix + "LegalMove"] = row.legalMove;
    sample[prefix + "Depth"] = row.stats && row.stats.completedDepth;
    sample[prefix + "Nodes"] = row.stats && row.stats.nodes;
    if (row.mode === "warm") sample.warmFirstRequest = row.startupIncluded;
    if (Number.isFinite(sample.coldMs) && Number.isFinite(sample.warmMs)) {
      const valid = sample.coldPositionKeyMatch && sample.warmPositionKeyMatch
        && sample.coldLegalMove && sample.warmLegalMove && sample.coldMs > 0 && sample.warmMs > 0;
      sample.status = valid ? "OK" : "INVALID";
      if (!valid) data.errors.push({ seed: row.seed, level: row.level, ply: row.ply,
        stage: "paired-sample", error: "result contract failed" });
    }
    writeAtomic(data);
  }
  async function runModeWithCheckpoints(states, seed, level, mode, order) {
    await page.evaluate(() => PBAIP15.resetProgress());
    let finished = false;
    let failure = null;
    let resultRows = [];
    const task = page.evaluate((args) =>
      PBAIP15.measureMode(args.states, args.seed, args.level, args.mode),
    { states, seed, level, mode }).then((value) => {
      resultRows = value;
      finished = true;
    }, (error) => {
      failure = error;
      finished = true;
    });
    while (!finished) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const progress = await page.evaluate(() => PBAIP15.drainProgress());
      for (const row of progress) recordSampleMode(row, order);
    }
    await task;
    const finalProgress = await page.evaluate(() => PBAIP15.drainProgress());
    for (const row of finalProgress) recordSampleMode(row, order);
    if (failure) throw failure;
    return resultRows;
  }
  for (const seed of seedList) {
    const generated = await page.evaluate((value) =>
      PBAIP15.gameStates(value, 64, [0, 8, 16, 32]), seed);
    const seedRecord = { seed, reachedTerminal: generated.terminal, terminalTurn: generated.terminalTurn,
      availablePly: generated.states.map((item) => item.ply) };
    if (generated.states.length < 4) {
      data.errors.push({ seed, stage: "sample-generation", error: "required phase state unavailable" });
      data.samples.push({ ...seedRecord, status: "INVALID" });
      writeAtomic(data);
      continue;
    }
    for (const level of ["hard", "expert"]) {
      const coldFirst = seed % 2 === 0;
      const order = coldFirst ? "cold-first" : "warm-first";
      const modes = coldFirst ? ["cold", "warm"] : ["warm", "cold"];
      try {
        for (const mode of modes) await runModeWithCheckpoints(generated.states, seed, level, mode, order);
      } catch (error) {
        data.errors.push({ seed, level, stage: "latency", error: String(error && error.stack || error) });
        data.samples.push({ seed, level, status: "ERROR" });
        writeAtomic(data);
      }
    }
  }

  const longSeed = seedList[0];
  const trajectory = await page.evaluate((seed) => PBAIP15.gameStates(seed, 64, []).trajectory, longSeed);
  for (const level of ["hard", "expert"]) {
    const session = { seed: longSeed, level, status: "RUNNING",
      requestCount: 0, checkpoints: [], rows: [], workerTarget: null };
    data.longSessions.push(session);
    writeAtomic(data);
    let worker = null;
    try {
      await page.evaluate(() => PBAIP15.openLongWorker());
      worker = await attachWorker(cdp);
      session.workerTarget = worker.target;
      writeAtomic(data);
      for (let index = 0; index < trajectory.length; index += 1) {
        const row = await page.evaluate((args) =>
          PBAIP15.longSessionRequest(args.item, args.seed, args.level, args.index),
        { item: trajectory[index], seed: longSeed, level, index });
        if (!row.legalMove || !row.positionKeyMatch) throw new Error("long-session result contract failed");
        session.rows.push(row);
        session.requestCount = session.rows.length;
        writeAtomic(data);
        if ([1, 16, 32, 64].includes(session.requestCount)) {
          session.checkpoints.push({
            afterRequests: session.requestCount, memory: await heapSamples(worker),
            workerTarget: worker.target,
          });
          writeAtomic(data);
        }
      }
      session.reaches64 = session.requestCount === 64;
      session.status = "PASS";
      writeAtomic(data);
    } catch (error) {
      session.status = "ERROR";
      session.error = String(error && error.stack || error);
      data.errors.push({ seed: longSeed, level, stage: "long-session", error: session.error });
      writeAtomic(data);
    } finally {
      if (worker) await worker.detach().catch(() => {});
      await page.evaluate(() => PBAIP15.endLongWorker()).catch(() => {});
    }
  }

  try {
    const cancellation = await page.evaluate(async () => {
      const state = BaoEngine.initialState();
      const id = 99887766;
      const worker = new Worker("/public/ai-release-worker.js");
      let delivered = false;
      const onMessage = (event) => { if (event.data && event.data.id === id) delivered = true; };
      worker.addEventListener("message", onMessage);
      worker.postMessage({
        type: "search", id, state: BaoEngine.clone(state), level: "expert",
        options: BaoReleaseConfig.searchOptions("expert", { hardwareConcurrency: 4, deviceMemory: 4 }, state),
      });
      await new Promise((resolve) => setTimeout(resolve, 20));
      const stopAt = performance.now();
      worker.terminate();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const deliveredAfterTerminate = delivered;
      const fresh = new Worker("/public/ai-release-worker.js");
      const result = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("fresh worker timeout")), 15000);
        fresh.addEventListener("message", function onMessage(event) {
          if (!event.data || event.data.id !== id + 1) return;
          clearTimeout(timer);
          fresh.removeEventListener("message", onMessage);
          resolve(event.data);
        });
        fresh.postMessage({
          type: "search", id: id + 1, state: BaoEngine.clone(state), level: "hard",
          options: { maxDepth: 1, timeLimitMs: 1000, pbaiC015LogicGate: true },
        });
      });
      fresh.terminate();
      return { terminatedAtMs: stopAt, deliveredAfterTerminate, freshWorkerResponded: result.type === "result" };
    });
    data.cancellation = cancellation;
    writeAtomic(data);
  } catch (error) {
    data.errors.push({ stage: "cancellation", error: String(error && error.stack || error) });
    writeAtomic(data);
  }
  data.technicalStatus = data.errors.length ? "FAIL" : "PASS";
  data.rowSha256 = crypto.createHash("sha256").update(JSON.stringify({
    samples: data.samples, longSessions: data.longSessions, cancellation: data.cancellation,
  })).digest("hex");
  writeAtomic(data);
  await activeBrowser.close();
  activeBrowser = null;
  await new Promise((resolve) => server.close(resolve));
  process.stdout.write(JSON.stringify({ shard: SHARD, seeds: seedList, technicalStatus: data.technicalStatus,
    samples: data.samples.length, errors: data.errors.length, outputPath }) + "\n");
  if (data.technicalStatus !== "PASS") process.exitCode = 1;
}

main().catch((error) => {
  data.technicalStatus = "FAIL";
  data.errors.push({ stage: "fatal", error: String(error && error.stack || error) });
  try { writeAtomic(data); } catch {}
  process.stderr.write(String(error && error.stack || error) + "\n");
  process.exitCode = 1;
}).finally(async () => {
  if (activeBrowser) await activeBrowser.close().catch(() => {});
  if (server.listening) await new Promise((resolve) => server.close(resolve));
});
