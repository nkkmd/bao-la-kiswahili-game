"use strict";
const fs = require("node:fs"), path = require("node:path"), os = require("node:os"), crypto = require("node:crypto"), vm = require("node:vm");
const assert = require("node:assert/strict"), H = require("./ai-harness.cjs"), E = require("../../public/engine.js");
const output = path.resolve(process.argv[2] || "artifacts/local/takasia-ai"); fs.mkdirSync(output, { recursive: true });
const file = path.join(output, "rows.jsonl"), sha = x => crypto.createHash("sha256").update(x).digest("hex");
const sourcePaths = ["public/engine.js", "public/ai.js", "public/ai-candidate.js", "public/ai-config.js", "public/ai-release.js", "public/ai-release-worker.js", "public/ai-worker.js", "public/main.js", "public/logic-evaluator.js", "public/ai-weights.js", "tools/takasia/fixtures.json", "tools/engineering/browser/pbai-p9/fixtures.json", "tools/takasia/ai-harness.cjs", "tools/takasia/benchmark-ai.cjs", "doc/ai-engineering/takasia-update/AI_BENCHMARK_PROTOCOL.md"];
const sources = Object.fromEntries(sourcePaths.map(p => [p, sha(fs.readFileSync(path.join(H.root, p)))]));
const environment = { node: process.version, platform: process.platform, arch: process.arch,
  cpu: os.cpus()[0].model, cpus: os.cpus().length, totalMemory: os.totalmem() };
const binding = sha(JSON.stringify({ sources, environment, seed: 1008 }));
const previous = fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : [];
if (previous.length && !process.argv.includes("--resume")) throw Error("Existing result; use a new directory or --resume");
assert.ok(previous.every(r => r.binding === binding), "Resume source/environment mismatch");
const done = new Set(previous.map(r => r.id)); assert.equal(done.size, previous.length);
const limitArg = process.argv.find(x => x.startsWith("--limit=")), limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const rows = [...previous], cases = H.cases(); let added = 0;
const tiers = { low: { hardwareConcurrency: 2, deviceMemory: 2 }, standard: { hardwareConcurrency: 4, deviceMemory: 4 }, high: { hardwareConcurrency: 8, deviceMemory: 4 } };
let errors = [];
function summary() {
  const complete = rows.length === 72;
  const violations = rows.filter(r => !r.withinTimeTolerance || !r.immediateWinSatisfied || r.referenceLoss < 0);
  const result = { status: errors.length || violations.length ? "FAIL" : complete ? "PASS" : "INCOMPLETE",
    expected: 72, completed: rows.length, binding, sources, environment, seed: 1008,
    failures: violations.map(r => r.id), errors,
    scope: "bounded known-case engineering check; not a strength claim", rows };
  fs.writeFileSync(path.join(output, "summary.json"), JSON.stringify(result, null, 2) + "\n");
  return result;
}
try {
  for (let i = 0; i < cases.length; i++) {
    if (added >= limit) break;
    const f = cases[i], { ctx } = H.load();
    const player = f.state.player, evaluate = ctx.BaoLogicGate.evaluate;
    const memo = new Map();
    function full(state, depth, ply) {
      if (state.winner !== null) return state.winner === player ? 1000000 - ply : -1000000 + ply;
      if (depth === 0) return evaluate(state, player);
      const key = JSON.stringify(state) + ":" + depth + ":" + ply;
      if (memo.has(key)) return memo.get(key);
      const scores = E.moveVariants(state).map(m => full(E.applyMoveForSearch(state, m).state, depth - 1, ply + 1));
      const score = state.player === player ? Math.max(...scores) : Math.min(...scores); memo.set(key, score); return score;
    }
    const options = E.moveVariants(f.state), scores = options.map(m => ({ key: ctx.BaoAI.moveKey(m), score: full(E.applyMoveForSearch(f.state, m).state, 2, 1) }));
    const best = Math.max(...scores.map(x => x.score));
    const immediate = options.some(m => E.applyMoveForSearch(f.state, m).state.winner === player);
    for (const level of ["hard", "expert"]) for (const [tier, caps] of Object.entries(tiers)) {
      const id = `${i}/${level}/${tier}`; if (done.has(id) || added >= limit) continue;
      const searchOptions = ctx.BaoReleaseConfig.searchOptions(level, caps, f.state), original = JSON.stringify(f.state);
      const r = ctx.BaoReleaseAI.analyzeMove(f.state, level, H.rng(1008), searchOptions);
      assert.equal(JSON.stringify(f.state), original); assert.equal(r.stats.ruleRevision, ctx.BaoAI.RULE_REVISION);
      const after = E.applyMove(f.state, r.move).state;
      const selectedScore = scores.find(x => x.key === ctx.BaoAI.moveKey(r.move)).score;
      const timeToleranceMs = Math.max(searchOptions.timeLimitMs * 1.5, searchOptions.timeLimitMs + 250);
      const row = { id, binding, name: f.name, source: f.source, level, tier, options: searchOptions,
        move: r.move, stats: r.stats, timeToleranceMs, withinTimeTolerance: r.stats.elapsedMs <= timeToleranceMs,
        immediateWinSatisfied: !immediate || after.winner === player, referenceDepth: 3, referenceQuiescence: 0,
        referenceBestScore: best, referenceSelectedScore: selectedScore, referenceLoss: best - selectedScore };
      fs.appendFileSync(file, JSON.stringify(row) + "\n"); rows.push(row); done.add(id); added++;
      summary(); console.log(`${id} ${f.name} ${r.stats.elapsedMs.toFixed(1)}ms depth=${r.stats.completedDepth} loss=${row.referenceLoss}`);
    }
  }
} catch (error) { errors.push(error.stack); }
const result = summary(); console.log(`${result.status}: ${result.completed}/72`);
console.log("TAKASIA_AI_SUMMARY=" + JSON.stringify(result));
if (result.status === "FAIL") process.exitCode = 1;
