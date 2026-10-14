"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");
const P = require("./runtime-engine.cjs"), I = require("./independent-engine.cjs"), F = require("./fixtures.cjs");
const M = require("../measurement.cjs");
const root = path.resolve(__dirname, "../../../.."), docs = path.join(root, "doc/research-generation-5/g5-01/transition");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const normalize = s => ({ ...M.raw(s), reason: s.reason ?? "", turn: s.turn });
const keys = moves => moves.map(M.moveKey).sort();
function binding() {
  const spec = read(path.join(docs, "SPEC.json")), auth = read(path.join(docs, "AUTHORIZATION.json"));
  const manifest = read(path.join(docs, "SOURCE_MANIFEST.json"));
  assert.equal(spec.stageId, "RRSVL-S0T-TRANSITION-2026-10-12-v1");
  assert.equal(auth.stageId, spec.stageId); assert.equal(auth.decision, "AUTHORIZED-TECHNICAL-ONLY");
  for (const [file, expected] of Object.entries(manifest.files)) {
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex"), expected, file);
  }
  assert.equal(auth.specSha256, crypto.createHash("sha256").update(fs.readFileSync(path.join(docs, "SPEC.json"))).digest("hex"));
  assert.equal(auth.manifestSha256, crypto.createHash("sha256").update(fs.readFileSync(path.join(docs, "SOURCE_MANIFEST.json"))).digest("hex"));
  assert.equal(spec.scientificEvidenceAccess, false);
  assert.ok(!fs.readFileSync(path.join(__dirname, "independent-engine.cjs"), "utf8").includes("require("), "Independent engine imports a dependency");
  return { spec, digest: M.digest({ spec, auth, manifest }) };
}
function measure(spec) {
  const roots = F.corpus(); assert.equal(roots.length, spec.fixtureRoots);
  const queue = roots.map(r => ({ state: structuredClone(r.state), depth: 0 }));
  const visited = new Set(), edges = [], cover = new Set(); let guardHits = 0, distinct = new Set();
  for (let n = 0; n < queue.length; n++) {
    const { state, depth } = queue[n], raw = M.rawKey(state);
    distinct.add(raw); assert.ok(distinct.size <= spec.maxStates, "STATE-LIMIT");
    if (depth >= spec.relativeDepth || visited.has(raw)) continue;
    visited.add(raw); cover.add(state.phase);
    if (state.takasia) cover.add("takasia-input");
    assert.deepEqual(keys(I.legalMoves(state)), keys(P.legalMoves(state)), `Physical move set: ${raw}`);
    const pMoves = P.moveVariantsForSearch(state), iMoves = I.moveVariants(state, { mode: "runtime" });
    assert.deepEqual(keys(iMoves), keys(pMoves), `Expanded move set: ${raw}`);
    assert.equal(new Set(keys(pMoves)).size, pMoves.length);
    for (const move of pMoves) {
      const before = M.stable(state);
      const p = P.applyMoveForSearch(state, move).state;
      const i = I.applyMove(state, move, { mode: "runtime" });
      assert.deepEqual(normalize(i.state), normalize(p), `Transition: ${raw} ${M.moveKey(move)}`);
      assert.equal(M.stable(state), before, "Source mutated");
      const total = s => s.pits.flat(2).reduce((a, b) => a + b, 0) + s.reserve.reduce((a, b) => a + b, 0) + s.pending.reduce((a, b) => a + b, 0);
      assert.equal(total(p), total(state), "KETE not conserved");
      const exact = I.applyMove(state, move, { maxMicrostates: spec.maxMicrostates });
      let exactComparable = false;
      if (p.reason === "relay-limit") guardHits++;
      else {
        assert.equal(exact.status, "TERMINATED", "Non-guard runtime result differs from guard-free transition");
        assert.deepEqual(normalize(exact.state), normalize(p)); exactComparable = true;
      }
      cover.add(move.type); if (move.row === 1) cover.add("back-row");
      if (move.houseChoice) cover.add(`house-${move.houseChoice}`);
      if (move.houseTwo) cover.add("house-two");
      if (p.phase !== state.phase) cover.add("phase-transition");
      if (p.takasia) cover.add("takasia-activation");
      if (p.pending.some(v => v > 0)) cover.add("pending-capture");
      if (p.winner !== null) cover.add(p.reason);
      edges.push({ from: raw, moveKey: M.moveKey(move), to: M.rawKey(p), childStateSha256: M.digest(normalize(p)),
        exactStatus: exact.status, exactComparable });
      assert.ok(edges.length <= spec.maxEdges, "EDGE-LIMIT");
      if (exactComparable) queue.push({ state: p, depth: depth + 1 });
    }
  }
  const detection = require("../../../takasia/fixtures.json").detectionCases.map(c => {
    const expected = I.detectTakasia(c.state, c.attacker, c.previousMove);
    assert.deepEqual(expected, c.expected, `Detection fixture ${c.id}`);
    assert.deepEqual(expected, P.detectTakasia(c.state, c.attacker, c.previousMove));
    return { id: c.id, result: expected };
  });
  for (const required of spec.requiredCoverage) assert.ok(cover.has(required), `Missing coverage: ${required}`);
  return { fixtureRoots: roots.length, expandedParents: visited.size, states: distinct.size, edges: edges.length,
    edgeDigest: M.digest(edges), coverage: [...cover].sort(), guardHits, detection,
    scientificEvidenceAccess: false, transitionAlgorithmsIndependent: true,
    scope: "KNOWN-AND-CONSTRUCTED-FIXTURES / RELATIVE-DEPTH-2 / NOT-ALL-BAO-STATES" };
}
function boundaryChecks() {
  const { e30 } = require("../../../takasia/fixtures.json");
  const move = { row: 0, index: 7, direction: "left", type: "takata", phase: "mtaji" };
  const original = fs.readFileSync(path.join(__dirname, "runtime-engine.cjs"), "utf8");
  const rows = [];
  for (const limit of [3, 4]) {
    const ctx = { module: { exports: {} } };
    vm.runInNewContext(original.replace("const MAX_RELAY = 512;", `const MAX_RELAY = ${limit};`), ctx);
    const p = JSON.parse(JSON.stringify(ctx.module.exports.applyMoveForSearch(e30.post, move).state));
    const i = I.applyMove(e30.post, move, { mode: "runtime", runtimeRelayCap: limit });
    assert.deepEqual(normalize(p), normalize(i.state));
    assert.equal(p.reason === "relay-limit", limit === 3);
    rows.push({ limit, runtimeGuard: p.reason === "relay-limit", childSha256: M.digest(normalize(p)) });
  }
  const capped = I.applyMove(e30.post, move, { maxMicrostates: 1 });
  assert.equal(capped.status, "ADMIN-CUTOFF"); assert.equal(capped.state, null);
  rows.push({ administrativeMicrostateCap: 1, status: capped.status, winnerAssigned: false });
  return rows;
}
function run(output) {
  const start = performance.now(), b = binding();
  const core = { studyId: "RRSVL-STUDY1", stageId: b.spec.stageId, binding: b.digest,
    evidenceClass: "TECHNICAL-FIXTURE", measurements: measure(b.spec), boundaryChecks: boundaryChecks() };
  const result = { decision: "STAGE0-TRANSITION-TECHNICAL-PASS", core, coreSha256: M.digest(core),
    execution: { sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
      elapsedMs: Math.round(performance.now() - start), peakRssBytes: process.resourceUsage().maxRSS * 1024,
      node: process.version, githubRunId: process.env.GITHUB_RUN_ID ?? null } };
  assert.ok(result.execution.elapsedMs <= b.spec.maxElapsedMs, "TIME-LIMIT");
  assert.ok(result.execution.peakRssBytes <= b.spec.maxRssBytes, "RSS-LIMIT");
  const bytes = JSON.stringify(result, null, 2) + "\n"; assert.ok(Buffer.byteLength(bytes) <= b.spec.maxResultBytes, "ARTIFACT-LIMIT");
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, bytes);
  return result;
}
if (require.main === module) {
  if (!process.argv[2]) throw Error("Usage: node run.cjs OUTPUT_JSON");
  const result = run(path.resolve(process.argv[2]));
  console.log(JSON.stringify({ decision: result.decision, coreSha256: result.coreSha256, ...result.core.measurements }));
}
module.exports = { binding, measure, boundaryChecks, run, normalize };
