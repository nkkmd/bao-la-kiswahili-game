"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto"), assert = require("node:assert/strict");
const M = require("./measurement.cjs"), I = require("./independent.cjs");
const P = require("../../experiments/lib/restricted-endgame-retrograde.js");
const Q = require("../../experiments/lib/restricted-endgame-retrograde-independent.js");
const E = require("../../../public/engine.js");
const root = path.resolve(__dirname, "../../..");
const docs = path.join(root, "doc/research-generation-5/g5-01");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
function atomic(p, value) {
  fs.writeFileSync(p + ".tmp", JSON.stringify(value, null, 2) + "\n");
  fs.renameSync(p + ".tmp", p);
}
function checkBinding() {
  const spec = read(path.join(docs, "STAGE_0_SPEC.json"));
  const auth = read(path.join(docs, "STAGE_0_AUTHORIZATION.json"));
  const manifest = read(path.join(docs, "SOURCE_MANIFEST.json"));
  assert.equal(spec.studyId, "RRSVL-STUDY1"); assert.equal(spec.stageId, auth.stageId);
  assert.equal(auth.decision, "AUTHORIZED-TECHNICAL-ONLY");
  assert.equal(auth.specSha256, crypto.createHash("sha256").update(fs.readFileSync(path.join(docs, "STAGE_0_SPEC.json"))).digest("hex"));
  assert.equal(auth.manifestSha256, crypto.createHash("sha256").update(fs.readFileSync(path.join(docs, "SOURCE_MANIFEST.json"))).digest("hex"));
  assert.equal(spec.ruleRevision, M.RULE);
  assert.equal(spec.freshScientificEvidenceAccess, false);
  assert.equal(spec.formalInference, false);
  for (const [p, expected] of Object.entries(manifest.files)) {
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root, p))).digest("hex"), expected, `Source binding: ${p}`);
  }
  return { spec, binding: M.digest({ spec, auth, manifest }) };
}
function technicalStates() {
  const f = read(path.join(root, "tools/takasia/fixtures.json"));
  const old = read(path.join(root, "tools/engineering/browser/pbai-p9/fixtures.json"));
  const swapped = structuredClone(f.detectionCases.find(c => c.id === "seat-swap").state);
  swapped.takasia = { player: 0, index: 3 };
  return [{ id: "INITIAL", state: E.initialState() }, { id: "E30", state: f.e30.post },
    { id: "E30-SEAT-SWAP", state: swapped },
    { id: "KNOWN-HOUSE-CHOICE", state: { ...old.rows.find(r => r.name === "capture-relay").state, takasia: null } }];
}
function evaluator() {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, "public/logic-evaluator.js"), "utf8"), ctx);
  return ctx.BaoLogicGate.evaluate;
}
function units(spec) {
  const evaluate = evaluator(), list = [];
  list.push({ id: "KNOWN-TAKASIA-TRANSITIONS", run() {
    const result = JSON.parse(execFileSync(process.execPath, ["tools/takasia/check-engine.cjs"],
      { cwd: root, encoding: "utf8", timeout: 30000 }));
    assert.equal(result.status, "PASS");
    return { kind: "LIMITED-TRANSITIONS", result };
  } });
  for (const { id, state } of technicalStates()) for (const depth of spec.depths) {
    list.push({ id: `${id}/depth-${depth}`, run() {
      const before = M.stable(state);
      const p = M.search(state, depth, evaluate, spec.maxNodesPerSearch);
      const i = I.independentSearch(state, depth, evaluate, spec.maxNodesPerSearch);
      assert.deepEqual(p.ranking, i.ranking); assert.equal(M.stable(state), before);
      return { kind: "SEARCH", fixture: id, depth, state, rawIdentity: M.raw(state), rawSha256: M.rawKey(state),
        ranking: p.ranking, productionNodes: p.nodes, independentNodes: i.nodes };
    } });
  }
  list.push({ id: "SYNTHETIC-EXACT-AND-LOSS", run() {
    const f = read(path.join(__dirname, "fixtures.json"));
    assert.ok(f.graph.length <= spec.maxSyntheticGraphNodes);
    const p = P.solveRetrograde(f.graph), i = Q.solveIndependent(f.graph); assert.deepEqual(p, i);
    const rows = f.semanticCases.map(c => {
      const node = f.graph.find(n => n.id === c.root);
      const rankings = [c.a, c.b].map(scores => M.rank(node.moves.map((m, j) => ({ moveKey: m.key, score: scores[j] }))));
      const comparison = M.compare(...rankings);
      const losses = rankings.map(r => M.exactLoss(f.graph, p, c.root, r));
      assert.equal(comparison.rankingChanged, c.expectedRankingChanged, c.id);
      assert.equal(comparison.selectedChanged, c.expectedSelectedChanged, c.id);
      assert.equal(losses[0].valueLoss, c.expectedLossA, c.id);
      assert.equal(losses[1].valueLoss, c.expectedLossB, c.id);
      return { id: c.id, root: c.root, rankings, comparison, losses };
    });
    return { kind: "SYNTHETIC", graph: f.graph, solution: p, rows };
  } });
  return list;
}
function run(outputDir, resume = false, stopAfter = null) {
  const started = performance.now(), { spec, binding } = checkBinding();
  fs.mkdirSync(outputDir, { recursive: true });
  const lockPath = path.join(outputDir, "technical.lock");
  const lock = fs.openSync(lockPath, "wx"); fs.closeSync(lock);
  try {
    const checkpoint = path.join(outputDir, "checkpoint.json");
    if (!resume && fs.existsSync(checkpoint)) throw Error("Existing checkpoint: use --resume");
    if (resume && !fs.existsSync(checkpoint)) throw Error("Missing checkpoint");
    let done = [];
    if (resume) {
      const saved = read(checkpoint);
      assert.equal(saved.binding, binding, "Resume source binding changed");
      assert.equal(saved.rowsSha256, M.digest(saved.rows), "Checkpoint checksum mismatch");
      done = saved.rows;
    }
    const work = units(spec);
    assert.ok(done.length <= work.length);
    done.forEach((row, n) => assert.equal(row.id, work[n].id, "Checkpoint order mismatch"));
    for (let n = done.length; n < work.length; n++) {
      const row = { id: work[n].id, ...work[n].run() }; done.push(row);
      atomic(checkpoint, { binding, rows: done, rowsSha256: M.digest(done) });
      if (stopAfter !== null && done.length >= stopAfter) return { interrupted: true, completedUnits: done.length };
      if (performance.now() - started > spec.maxElapsedMs) throw Error("TIME-LIMIT");
      if (process.resourceUsage().maxRSS * 1024 > spec.maxRssBytes) throw Error("RSS-LIMIT");
    }
    const searchContrasts = spec.fixtures.map(fixture => {
      const rows = done.filter(r => r.kind === "SEARCH" && r.fixture === fixture);
      return { fixture, comparison: M.compare(rows[0].ranking, rows[1].ranking), exactValueLoss: null };
    });
    const core = { studyId: spec.studyId, stageId: spec.stageId, evidenceClass: "TECHNICAL-FIXTURE",
      ruleRevision: M.RULE, binding, rows: done, searchContrasts, freshScientificSeedReads: 0,
      scientificInference: false, publicAiChanged: false,
      transitionIndependence: "SHARED-ENGINE-SEARCH-CHECK / LIMITED-TAKASIA-ORACLE-ONLY",
      formalReadiness: "BLOCKED-PENDING-FULL-INDEPENDENT-TRANSITION-AND-FRESHNESS-CONTRACT" };
    const output = { decision: "STAGE0-TECHNICAL-PASS", core, coreSha256: M.digest(core),
      execution: { sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
        node: process.version, elapsedMs: Math.round(performance.now() - started),
        peakRssBytes: process.resourceUsage().maxRSS * 1024, githubRunId: process.env.GITHUB_RUN_ID ?? null,
        githubRunAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null, resumed: resume } };
    const bytes = Buffer.byteLength(JSON.stringify(output));
    assert.ok(bytes <= spec.maxResultBytes, "ARTIFACT-LIMIT");
    atomic(path.join(outputDir, "result.json"), output);
    return { decision: output.decision, completedUnits: done.length, coreSha256: output.coreSha256 };
  } finally { fs.unlinkSync(lockPath); }
}
if (require.main === module) {
  const directory = process.argv[2];
  if (!directory) throw Error("Usage: node run.cjs OUTPUT_DIR [--resume] [--stop-after=N]");
  const stop = process.argv.find(x => x.startsWith("--stop-after="));
  const result = run(path.resolve(directory), process.argv.includes("--resume"), stop ? Number(stop.split("=")[1]) : null);
  console.log(JSON.stringify(result)); if (result.interrupted) process.exitCode = 75;
}
module.exports = { checkBinding, technicalStates, run };
