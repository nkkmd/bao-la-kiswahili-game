"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { Worker, isMainThread, parentPort } = require("node:worker_threads");

if (!isMainThread) {
  globalThis.self = globalThis;
  self.addEventListener = (type, listener) => {
    if (type === "message") parentPort.on("message", (data) => listener({ data }));
  };
  self.postMessage = (data) => parentPort.postMessage(data);
  globalThis.importScripts = (...files) => {
    for (const file of files) require(path.resolve(__dirname, "../public", file));
  };
  require("../public/ai-worker.js");
} else {
  const E = require("../public/engine.js");

  function request(worker, id, timeLimitMs) {
    worker.postMessage({
      type: "search",
      id,
      state: E.initialState(),
      level: "hard",
      options: { maxDepth: 20, timeLimitMs },
    });
  }

  (async () => {
    const worker = new Worker(__filename);
    let ticks = 0;
    const timer = setInterval(() => { ticks += 1; }, 5);
    request(worker, 1, 150);
    const result = await new Promise((resolve, reject) => {
      worker.once("message", resolve);
      worker.once("error", reject);
    });
    clearInterval(timer);
    await worker.terminate();
    assert.equal(result.type, "result");
    assert.ok(ticks >= 5, "main-thread timers continue while AI searches in a worker");

    const cancelled = new Worker(__filename);
    let delivered = false;
    cancelled.on("message", () => { delivered = true; });
    request(cancelled, 2, 1000);
    await new Promise((resolve) => setTimeout(resolve, 20));
    await cancelled.terminate();
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(delivered, false, "terminating a worker prevents stale search delivery");

    console.log("Bao worker integration tests passed");
  })().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
