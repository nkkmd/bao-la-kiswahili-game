"use strict";
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib"), assert = require("node:assert/strict");
const I = require("../g5-01/transition/independent-engine.cjs"), M = require("../g5-01/measurement.cjs");
const S = require("../../experiments/lib/restricted-endgame-retrograde-independent.js");
const C = require("./core.cjs"), R = require("./run.cjs");
const initial = () => ({ pits: Array.from({ length: 2 }, () => [[0,0,0,0,6,2,2,0], Array(8).fill(0)]),
  reserve: [22,22], houseOwned: [true,true], player: 0, phase: "namua", winner: null,
  reason: "", turn: 1, pending: [0,0], takasia: null });
const order = moves => [...moves].sort((a,b) => M.moveKey(a) < M.moveKey(b) ? -1 : 1);
function independentProbe(root, spec) {
  const records = new Map(), links = []; let outcome = null;
  function explore(state, depth) {
    const key = M.rawKey(state); records.set(key, state);
    if (state.winner != null) return true;
    if (depth >= spec.probeDepth) { outcome = "PROBE-DEPTH-NOT-CLOSED"; return false; }
    const moves = order(I.moveVariants(state, { mode: "runtime" }));
    if (moves.length === 0 || moves.length > spec.probeMaxWidth) { outcome = "PROBE-WIDTH-EXCLUDED"; return false; }
    for (const move of moves) {
      const runtime = I.applyMove(state, move, { mode: "runtime" }).state;
      records.set(M.rawKey(runtime), runtime);
      if (runtime.reason === "relay-limit") { outcome = "PROBE-RUNTIME-GUARD"; return false; }
      const checked = I.applyMove(state, move, { maxMicrostates: spec.maxMicrostates });
      if (checked.status !== "TERMINATED") { outcome = "PROBE-" + checked.status; return false; }
      assert.deepEqual(C.normalize(runtime), C.normalize(checked.state));
      links.push({ from: key, moveKey: M.moveKey(move), to: M.rawKey(runtime) });
      if (!explore(runtime, depth + 1)) return false;
    }
    return true;
  }
  const done = explore(root, 0);
  return { rootKey: M.rawKey(root), status: done ? "PROBE-COMPLETE" : outcome,
    states: [...records].map(([id, state]) => ({ id, state })), edges: links };
}
function independentScreen(state, spec, runProbe = independentProbe) {
  const probes = [];
  const first = runProbe(state, { ...spec, probeDepth: spec.excludedShortDepth });
  probes.push({ depth: spec.excludedShortDepth, ...first });
  if (first.status === "PROBE-COMPLETE") return { status: "SCREEN-SHORT-EXCLUDED", probes };
  if (first.status === "PROBE-WIDTH-EXCLUDED") return { status: "SCREEN-WIDTH-EXCLUDED", probes };
  if (first.status !== "PROBE-DEPTH-NOT-CLOSED") return { status: first.status, probes };
  const second = runProbe(state, spec); probes.push({ depth: spec.probeDepth, ...second });
  const mapping = { "PROBE-COMPLETE": "SCREEN-COMPLETE", "PROBE-DEPTH-NOT-CLOSED": "SCREEN-DEPTH-NOT-CLOSED",
    "PROBE-WIDTH-EXCLUDED": "SCREEN-WIDTH-EXCLUDED" };
  return { status: mapping[second.status] ?? second.status, probes };
}
function canSelect(s, ply, width, spec) {
  const occupied = s.pits.flat(2).reduce((n, v) => n + (v > 0 ? 1 : 0), 0);
  const fronts = s.pits.map(rows => rows[0].reduce((n, v) => n + v, 0));
  return s.winner === null && s.phase === "mtaji" && s.reserve[0] === 0 && s.reserve[1] === 0
    && ply >= spec.minPly && width >= spec.minWidth && width <= spec.maxWidth
    && occupied <= spec.maxOccupied && fronts.some(n => n <= spec.maxSmallFront);
}
function replay(source, spec, exclusions) {
  let state = initial();
  let recordedRandom = source.seed;
  let probeIndex = 0;
  function inspect(current, ply, width) {
    if (!canSelect(current, ply, width, spec)) return null;
    const observed = independentScreen(current, spec);
    for (const p of observed.probes) assert.deepEqual(source.probes[probeIndex++], { ply, ...p }, "Stored probe differs");
    return observed;
  }
  for (let ply = 0; ply < source.trace.length; ply++) {
    const row = source.trace[ply], moves = order(I.moveVariants(state, { mode: "runtime" }));
    const before = inspect(state, ply, moves.length);
    if (before) assert.ok(["SCREEN-SHORT-EXCLUDED", "SCREEN-DEPTH-NOT-CLOSED", "SCREEN-WIDTH-EXCLUDED"].includes(before.status), "Skipped earlier eligible root or probe stop");
    assert.equal(row.ply, ply); assert.equal(row.rawBefore, M.rawKey(state));
    assert.equal(row.randomBefore, recordedRandom);
    assert.ok(row.draws.length > 0);
    const threshold = Math.floor(4294967296 / moves.length) * moves.length;
    for (let n = 0; n < row.draws.length; n++) {
      let v = recordedRandom >>> 0; v ^= v << 13; v ^= v >>> 17; v ^= v << 5; recordedRandom = v >>> 0;
      assert.equal(row.draws[n], recordedRandom, "Recorded draw chain differs");
      assert.equal(recordedRandom < threshold, n === row.draws.length - 1);
    }
    const selected = moves[recordedRandom % moves.length];
    assert.equal(M.moveKey(selected), row.moveKey); assert.equal(M.moveKey(row.move), row.moveKey);
    const next = I.applyMove(state, selected, { maxMicrostates: spec.maxMicrostates });
    assert.equal(next.status, "TERMINATED"); state = next.state;
    assert.equal(M.rawKey(state), row.rawAfter);
  }
  assert.deepEqual(C.normalize(state), C.normalize(source.finalState));
  const width = I.moveVariants(state, { mode: "runtime" }).length;
  const last = inspect(state, source.trace.length, width);
  assert.equal(probeIndex, source.probes.length);
  if (source.stop === "FIRST-ELIGIBLE-ROOT" || source.stop === "BOUNDED-DOMAIN-OVERLAP-EXCLUDED") {
    assert.ok(canSelect(state, source.trace.length, width, spec));
    assert.equal(last.status, "SCREEN-COMPLETE");
    assert.equal(last.probes.at(-1).states.some(s => exclusions.has(s.id)), source.stop === "BOUNDED-DOMAIN-OVERLAP-EXCLUDED");
    if (source.candidate) {
      assert.equal(source.candidate.raw, M.rawKey(state)); assert.equal(source.candidate.ply, source.trace.length);
      assert.equal(source.candidate.width, width); assert.deepEqual(source.candidate.state, state);
    }
  } else if (source.stop === "TERMINAL-BEFORE-CANDIDATE") assert.notEqual(state.winner, null);
  else if (source.stop.startsWith("PROBE-")) {
    assert.equal(last.status, source.stop);
    assert.ok(!["PROBE-COMPLETE", "PROBE-DEPTH-NOT-CLOSED", "PROBE-WIDTH-EXCLUDED"].includes(source.stop));
  }
  else if (source.stop === "PLY-LIMIT") assert.equal(source.trace.length, spec.maxPly);
  else {
    const moves = order(I.moveVariants(state, { mode: "runtime" }));
    const attempt = source.stoppedDraw; assert.equal(attempt.randomBefore, recordedRandom); assert.ok(attempt.values.length);
    const threshold = Math.floor(4294967296 / moves.length) * moves.length;
    for (let n = 0; n < attempt.values.length; n++) {
      let v = recordedRandom >>> 0; v ^= v << 13; v ^= v >>> 17; v ^= v << 5; recordedRandom = v >>> 0;
      assert.equal(attempt.values[n], recordedRandom);
      assert.equal(recordedRandom < threshold, n === attempt.values.length - 1);
    }
    assert.equal(attempt.index, recordedRandom % moves.length);
    assert.equal(M.moveKey(source.stoppedMove), M.moveKey(moves[attempt.index]));
    const runtime = I.applyMove(state, source.stoppedMove, { mode: "runtime" });
    const exact = I.applyMove(state, source.stoppedMove, { maxMicrostates: spec.maxMicrostates });
    assert.equal(source.stop, runtime.state?.reason === "relay-limit" ? "RUNTIME-GUARD" : exact.status);
  }
  return state;
}
function verify(directory) {
  const binding = R.binding(), result = JSON.parse(fs.readFileSync(path.join(directory, "RESULT.json")));
  assert.equal(result.binding, binding.digest); assert.equal(result.disposition, "STAGE1-SUPPLY-COMPLETE");
  const compressed = fs.readFileSync(path.join(directory, "EVIDENCE.json.gz"));
  assert.equal(R.shaBytes(compressed), result.evidenceGzipSha256);
  const bytes = zlib.gunzipSync(compressed, { maxOutputLength: binding.spec.maxEvidenceBytes });
  const evidence = JSON.parse(bytes); assert.equal(evidence.binding, binding.digest);
  assert.equal(evidence.formalInference, false); assert.equal(result.formalInference, false);
  assert.equal(evidence.scientificSeedsRead, binding.spec.seedBlock.count);
  assert.equal(evidence.sources.length, binding.spec.seedBlock.count);
  assert.equal(result.scientificSeedsRead, binding.spec.seedBlock.count);
  assert.equal(result.sourceCount, evidence.sources.length);
  const reads = fs.readFileSync(path.join(directory, "SEED_READS.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(reads.length, binding.spec.seedBlock.count);
  const technical = C.technicalFirewall(); assert.deepEqual([...technical].sort(), evidence.technicalFirewall);
  const prior = C.priorFirewall(); assert.deepEqual([...prior].sort(), evidence.priorReadFirewall);
  const fixedExclusion = new Set([...technical, ...prior]);
  const exclusion = new Set(fixedExclusion), selected = [];
  for (let n = 0; n < evidence.sources.length; n++) {
    const source = evidence.sources[n], expected = binding.spec.seedBlock.start + n;
    assert.equal(reads[n].index, n); assert.equal(reads[n].seed, expected); assert.equal(source.seed, expected);
    replay(source, binding.spec.selection, exclusion);
    if (source.candidate) {
      exclusion.add(source.candidate.raw);
      if (selected.length < binding.spec.maxCandidates) selected.push({ sourceIndex: n, ...source.candidate });
    }
  }
  assert.deepEqual(selected, evidence.selectedCandidates);
  const stops = {}, probeStops = {};
  for (const s of evidence.sources) {
    stops[s.stop] = (stops[s.stop] ?? 0) + 1;
    for (const p of s.probes) { const key = p.depth + "/" + p.status; probeStops[key] = (probeStops[key] ?? 0) + 1; }
  }
  assert.deepEqual(stops, result.sourceStops); assert.deepEqual(probeStops, result.probeStops);
  assert.equal(result.probeCount, evidence.sources.reduce((n,s) => n + s.probes.length, 0));
  assert.equal(result.candidateCount, selected.length);
  const frozen = JSON.parse(fs.readFileSync(path.join(directory, "CANDIDATES_FROZEN.json")));
  assert.deepEqual(frozen.candidates, selected); assert.equal(frozen.digest, M.digest(selected));
  assert.equal(evidence.domains.length, selected.length);
  let verifiedEdges = 0;
  for (let n = 0; n < evidence.domains.length; n++) {
    const domain = evidence.domains[n], byId = new Map(domain.states.map(row => [row.id, row.state]));
    assert.equal(byId.size, domain.states.length); assert.equal(domain.rootKey, selected[n].raw);
    for (const { id, state } of domain.states) assert.equal(id, M.rawKey(state));
    const edgeKeys = new Set(), edgeTargets = new Map();
    for (const edge of domain.edges) {
      const from = byId.get(edge.from), to = byId.get(edge.to);
      assert.ok(from && to); const choices = I.moveVariants(from, { mode: "runtime" });
      const move = choices.find(m => M.moveKey(m) === edge.moveKey); assert.ok(move);
      const child = I.applyMove(from, move, { maxMicrostates: binding.spec.closure.maxMicrostates });
      assert.equal(child.status, "TERMINATED"); assert.equal(M.rawKey(child.state), edge.to);
      const key = edge.from + ":" + edge.moveKey; assert.ok(!edgeKeys.has(key)); edgeKeys.add(key); edgeTargets.set(key, edge.to); verifiedEdges++;
    }
    for (const node of domain.nodes) {
      const state = byId.get(node.id); assert.equal(node.player, state.player); assert.equal(node.winner, state.winner);
      assert.deepEqual(node.moves.map(m => m.key).sort(), I.moveVariants(state, { mode: "runtime" }).map(M.moveKey).sort());
      for (const m of node.moves) assert.equal(edgeTargets.get(node.id + ":" + m.key), m.to);
    }
    assert.ok(domain.states.length <= binding.spec.closure.maxStates && domain.edges.length <= binding.spec.closure.maxEdges);
    if (domain.stopWitness?.from) {
      const witness = domain.stopWitness, from = byId.get(witness.from);
      const move = I.moveVariants(from, { mode: "runtime" }).find(m => M.moveKey(m) === witness.moveKey);
      assert.ok(move);
      const child = I.applyMove(from, move, { maxMicrostates: binding.spec.closure.maxMicrostates });
      assert.equal(child.status, "TERMINATED"); assert.equal(M.rawKey(child.state), witness.raw);
      assert.deepEqual(C.normalize(child.state), C.normalize(witness.state));
    }
    if (domain.status === "PRIOR-READ-OVERLAP") assert.ok(fixedExclusion.has(domain.stopWitness.raw));
    if (domain.status === "STATE-LIMIT") assert.equal(domain.states.length, binding.spec.closure.maxStates);
    if (domain.complete) {
      for (const { id } of domain.states) assert.equal(fixedExclusion.has(id), false);
      assert.equal(domain.nodes.length, domain.states.length);
      assert.equal(new Set(domain.nodes.map(n => n.id)).size, domain.states.length);
      assert.equal(domain.status, "COMPLETE-INDEPENDENT-AGREEMENT");
      assert.deepEqual(S.solveIndependent(domain.nodes), domain.solution);
      const source = evidence.sources[selected[n].sourceIndex], proof = source.probes.at(-1);
      assert.equal(proof.status, "PROBE-COMPLETE");
      assert.equal(proof.depth, binding.spec.selection.probeDepth);
      assert.equal(source.probes.at(-2).status, "PROBE-DEPTH-NOT-CLOSED");
      assert.equal(source.probes.at(-2).depth, binding.spec.selection.excludedShortDepth);
      assert.deepEqual([...byId.keys()].sort(), proof.states.map(s => s.id).sort());
    } else { assert.equal(domain.solution, null); assert.notEqual(domain.status, "COMPLETE-INDEPENDENT-AGREEMENT"); }
  }
  assert.deepEqual(C.domainGroups(evidence.domains), evidence.groups);
  assert.equal(result.completeDomains, evidence.domains.filter(d => d.complete).length);
  assert.deepEqual(result.domainStatuses, evidence.domains.map(d => ({ status: d.status, states: d.states.length,
    edges: d.edges.length, elapsedMs: d.elapsedMs, complete: d.complete, counts: d.complete ? d.solution.counts : null })));
  assert.deepEqual(result.domainGroups, evidence.groups);
  const identities = new Set(evidence.technicalFirewall);
  for (const source of evidence.sources) {
    identities.add(M.rawKey(source.finalState));
    for (const row of source.trace) { identities.add(row.rawBefore); identities.add(row.rawAfter); }
    for (const p of source.probes) for (const { id } of p.states) identities.add(id);
  }
  for (const domain of evidence.domains) {
    for (const { id } of domain.states) identities.add(id);
    if (domain.stopWitness?.raw) identities.add(domain.stopWitness.raw);
  }
  assert.deepEqual([...identities].sort(), evidence.supplyReadIdentities);
  assert.equal(identities.size, result.supplyIdentityCount);
  assert.ok(result.execution.elapsedMs <= binding.spec.maxTotalMs && result.execution.peakRssBytes <= binding.spec.maxRssBytes);
  const receipt = { decision: "STAGE1-SUPPLY-INDEPENDENT-PASS", binding: binding.digest,
    sourcesReplayed: evidence.sources.length, domainsChecked: evidence.domains.length, verifiedEdges,
    probesReplayed: result.probeCount,
    probeEdgesReplayed: evidence.sources.reduce((n,s) => n + s.probes.reduce((v,p) => v + p.edges.length, 0), 0),
    completeDomains: result.completeDomains, freshSeedGenerationDuringVerification: 0, formalInference: false,
    evidenceGzipSha256: result.evidenceGzipSha256 };
  fs.writeFileSync(path.join(directory, "VERIFICATION.json"), JSON.stringify(receipt, null, 2) + "\n");
  return receipt;
}
if (require.main === module) console.log(JSON.stringify(verify(path.resolve(process.argv[2]))));
module.exports = { replay, canSelect, independentProbe, independentScreen, verify };
