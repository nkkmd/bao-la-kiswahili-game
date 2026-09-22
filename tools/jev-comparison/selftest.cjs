"use strict";
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const assert = require("node:assert/strict");
const { makeEngine, fixtures, requestFor, validateResponse, decide, clone, config, sha256 } = require("./core.cjs");
const { Ledger, createClient, lock, unlockStale, RESERVE_NANO, STAGES } = require("./budget.cjs");
async function selftest(repo) {
  let checks = 0;
  const original = makeEngine(repo), hooked = makeEngine(repo, { hooked: true });
  const cases = fixtures(original, 12);
  let changedOrderCases = 0;
  for (const item of cases) {
    const state = item.state, before = JSON.stringify(state), moves = original.E.moveVariantsForSearch(state);
    const options = { maxDepth: 2, timeLimitMs: Infinity };
    const a = original.analyze(state, options), b = hooked.analyze(state, options);
    assert.deepEqual(a.move, b.move); assert.equal(a.stats.rootScore, b.stats.rootScore);
    assert.equal(a.stats.nodes, b.stats.nodes); assert.equal(a.stats.quiescenceNodes, b.stats.quiescenceNodes);
    assert.equal(JSON.stringify(state), before); checks++;
    const probabilities = Object.fromEntries(moves.map((m, i) => [original.AI.moveKey(m), (i + 1) / (moves.length * (moves.length + 1) / 2)]));
    const c = hooked.analyze(state, { ...options, probabilities });
    assert.equal(c.stats.completedDepth, 2); assert.equal(c.stats.rootScore, a.stats.rootScore);
    assert(moves.some(m => original.AI.moveKey(m) === original.AI.moveKey(c.move)));
    if (c.stats.nodes !== a.stats.nodes || original.AI.moveKey(a.move) !== original.AI.moveKey(c.move)) changedOrderCases++;
    checks++;
  }
  assert(changedOrderCases > 0, "並べ替えが探索に反映されていません。"); checks++;
  const packet = requestFor(hooked, cases[0].state), ids = Object.keys(packet.keyById);
  const good = { model: config.model, usage: { input_tokens: 100, output_tokens: 20 }, answers: { priority: {
    type: "choice", choice: ids[0], confidence: 1, probabilities: Object.fromEntries(ids.map((id, i) => [id, i === 0 ? 1 : 0])) } } };
  assert.equal(Object.keys(validateResponse(good, packet).probabilities).length, ids.length); checks++;
  const bad = clone(good); bad.answers.priority.probabilities[ids[0]] = NaN;
  assert.throws(() => validateResponse(bad, packet)); checks++;
  assert.throws(() => validateResponse({ ...good, model: "different" }, packet)); checks++;
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-jev-selftest-"));
  try {
    let calls = 0;
    const dir = path.join(temp, "account");
    const release = lock(dir); assert.throws(() => lock(dir)); assert.throws(() => unlockStale(dir)); release(); checks++;
    const ledger = new Ledger(dir, "test-binding");
    const client = createClient(ledger, temp, "TEST-NOT-A-REAL-KEY", async (url, args) => {
      calls++; assert.equal(url, "https://api.typesafe.ai/v1/systemone"); assert.equal(args.redirect, "error");
      return { ok: true, status: 200, json: async () => good };
    });
    await client.evaluate(packet, { id: "one", stage: "smoke", timeoutMs: 50 });
    const retry = await client.evaluate(packet, { id: "one", stage: "smoke", timeoutMs: 50 });
    assert.equal(calls, 1); assert(retry.recovered); assert.equal(ledger.totals().total, 4200); checks++;
    const reopened = new Ledger(dir, "test-binding");
    assert.equal(reopened.totals().total, 4200); assert.throws(() => new Ledger(dir, "different-binding")); checks++;
    reopened.reserve("interrupted", "smoke", "hash", 100);
    assert.equal(new Ledger(dir, "test-binding").totals().total, 4200 + RESERVE_NANO); checks++;
    const noAnswer = createClient(reopened, temp, "TEST-NOT-A-REAL-KEY", async () => { calls++; throw new Error("TEST-NOT-A-REAL-KEY"); });
    const failed = await noAnswer.evaluate(packet, { id: "failure", stage: "smoke", timeoutMs: 50 });
    assert.equal(failed.status, "network-error"); assert.equal(reopened.records.get("failure").chargedNano, RESERVE_NANO); checks++;
    const n = calls;
    await noAnswer.evaluate(packet, { id: "failure", stage: "smoke", timeoutMs: 50 });
    assert.equal(calls, n); checks++;
    reopened.reserve("lost-response", "smoke", sha256(JSON.stringify(packet.body)), 123);
    const lost = await noAnswer.evaluate(packet, { id: "lost-response", stage: "smoke", timeoutMs: 50 });
    assert.equal(lost.status, "interrupted-request"); assert.equal(lost.elapsedMs, 123); assert.equal(calls, n); checks++;
    const fatalLedger = new Ledger(path.join(temp, "fatal"), "test-binding");
    const mismatched = createClient(fatalLedger, path.join(temp, "fatal-results"), "TEST-NOT-A-REAL-KEY", async () => ({
      ok: true, status: 200, json: async () => ({ ...good, model: "changed-model" }),
    }));
    const mismatch = await mismatched.evaluate(packet, { id: "model-change", stage: "smoke", timeoutMs: 50 });
    assert.equal(mismatch.status, "model-mismatch"); assert(fatalLedger.halted);
    assert.throws(() => fatalLedger.reserve("must-not-send", "smoke", "hash", 50)); checks++;
    const timeoutLedger = new Ledger(path.join(temp, "timeout"), "test-binding");
    const timeoutClient = createClient(timeoutLedger, path.join(temp, "timeout-results"), "TEST-NOT-A-REAL-KEY", async () => {
      const e = new Error("TEST-NOT-A-REAL-KEY"); e.name = "TimeoutError"; throw e;
    });
    const timeout = await timeoutClient.evaluate(packet, { id: "timeout", stage: "smoke", timeoutMs: 50 });
    assert.equal(timeout.status, "timeout"); assert.equal(timeoutLedger.totals().total, RESERVE_NANO); checks++;
    for (let i = 0; ; i++) {
      try { reopened.reserve("cap-" + i, "smoke", "hash", 50); }
      catch (e) { assert.equal(e.message, "BUDGET_STOP"); break; }
    }
    assert(reopened.totals().stages.smoke <= STAGES.smoke); checks++;
    const cappedClient = createClient(reopened, temp, "TEST-NOT-A-REAL-KEY", async () => { throw new Error("送信禁止"); });
    await assert.rejects(cappedClient.evaluate(packet, { id: "over-cap", stage: "smoke", timeoutMs: 50 }), /BUDGET_STOP/); checks++;
    const all = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? all(path.join(dir, e.name)) : [path.join(dir, e.name)]);
    for (const file of all(temp)) assert(!fs.readFileSync(file, "utf8").includes("TEST-NOT-A-REAL-KEY")); checks++;
    const state = cases[1].state;
    const r = await decide(hooked, state, { candidate: true, timeMs: 30,
      client: { evaluate: async () => { throw new Error("短すぎる時間では呼ばない"); } } });
    assert(hooked.E.moveVariantsForSearch(state).some(m => hooked.AI.moveKey(m) === hooked.AI.moveKey(r.move))); checks++;
    const timed = await decide(hooked, state, { timeMs: 0 });
    assert.equal(timed.stats.fallback, "outer-deadline"); checks++;
    const altered = fs.readFileSync(reopened.file, "utf8").replace('"rateNano":42', '"rateNano":43');
    fs.writeFileSync(reopened.file, altered);
    assert.throws(() => new Ledger(dir, "test-binding")); checks++;
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
  return { status: "PASS", checks, fixtures: cases.length, changedOrderCases, realApiRequests: 0 };
}
module.exports = { selftest };
if (require.main === module) selftest(path.resolve(process.argv[2] || path.join(__dirname, "../..")))
  .then(result => console.log(JSON.stringify(result, null, 2))).catch(e => { console.error(e); process.exitCode = 1; });
