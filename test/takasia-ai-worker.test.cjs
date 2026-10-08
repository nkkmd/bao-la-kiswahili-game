"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), path = require("node:path");
const { Worker, isMainThread, parentPort, workerData } = require("node:worker_threads");
if (!isMainThread) {
  globalThis.self = globalThis;
  self.addEventListener = (_, cb) => parentPort.on("message", data => cb({ data }));
  self.postMessage = x => parentPort.postMessage(x);
  globalThis.importScripts = (...files) => files.forEach(file => {
    if (path.basename(file) === workerData.missing) throw Error("Injected asset failure");
    require(path.resolve(__dirname, "../public", file));
  });
  require("../public/ai-release-worker.js");
} else {
  const E = require("../public/engine.js"), AI = require("../public/ai.js"), F = require("../tools/takasia/fixtures.json");
  for (const missing of [null, "logic-evaluator.js", "ai-candidate.js"]) test(`実Workerでtakasiaを保持し、応答中もメイン処理を継続: ${missing}`, async () => {
    const worker = new Worker(__filename, { workerData: { missing } });
    let ticks = 0; const timer = setInterval(() => ticks++, 5);
    try {
      const message = new Promise((resolve, reject) => { worker.once("message", resolve); worker.once("error", reject); });
      worker.postMessage({ type: "search", id: 1, state: F.e30.post, level: "hard", ruleRevision: AI.RULE_REVISION,
        positionKey: AI.stateKey(F.e30.post), options: { maxDepth: 20, timeLimitMs: 120, pbaiC015LogicGate: true, pbaiC011LightweightTransitions: true } });
      const r = await message; assert.equal(r.type, "result", r.message); assert.equal(r.ruleRevision, AI.RULE_REVISION);
      assert.ok(ticks >= 5); assert.doesNotThrow(() => E.applyMove(F.e30.post, r.move));
      assert.equal(r.stats.evaluationFallback, Boolean(missing));
    } finally { clearInterval(timer); await worker.terminate(); }
  });
}
