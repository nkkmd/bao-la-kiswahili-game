#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const R = require("./lib/ssgtc-representation-independent.js");
const T = require("./lib/stscv-stage0-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_1_SPEC.json");
const CONTRACT_PATH = path.join(ROOT, "doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_1_CANDIDATE_CONTRACT.json");
const AUTH_PATH = path.join(ROOT, "doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_1_AUTHORIZATION.json");

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sha256Buffer(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function sha256Text(value) { return sha256Buffer(Buffer.from(value, "utf8")); }
function sha256File(file) { return sha256Buffer(fs.readFileSync(file)); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stable(item)).join(",")}]`;
  const names = Object.keys(value).sort((a, b) => a.localeCompare(b));
  return `{${names.map((name) => `${JSON.stringify(name)}:${stable(value[name])}`).join(",")}}`;
}
function hashCanonical(value) { return sha256Text(stable(value)); }
function ensure(condition, message) { if (!condition) throw new Error(message); }
function sameSet(a, b) { return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()); }
function datasetHash(lines) { return sha256Text([...lines].sort().join("\n")); }
function loadJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }

function randomFor(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function verifyAuthorization(spec, auth) {
  ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId && auth.authorized === true, "invalid Stage 1 authorization identity");
  ensure(auth.specSha256 === sha256File(SPEC_PATH), "independent spec hash mismatch");
  ensure(auth.candidateContractSha256 === sha256File(CONTRACT_PATH), "independent candidate contract hash mismatch");
  for (const rel of spec.frozenSourcePathsToBindBeforeAuthorization) {
    ensure(auth.sourceSha256?.[rel] === sha256File(path.join(ROOT, rel)), `independent authorized source drift: ${rel}`);
  }
}
function assignedStratum(seed, start) { return ["namua", "mtaji", "mtaji-houseless"][(seed - start) % 3]; }
function eligible(state, ply, stratum) {
  R.assertStudyState(state);
  if (state.winner !== null) return false;
  if (stratum === "namua") return state.phase === "namua" && ply >= 12;
  if (stratum === "mtaji") return state.phase === "mtaji";
  return state.phase === "mtaji" && state.reserve[0] === 0 && state.reserve[1] === 0
    && state.houseOwned[0] === false && state.houseOwned[1] === false;
}
function trajectoryCandidate(seed, spec) {
  const random = randomFor(seed);
  const stratum = assignedStratum(seed, spec.population.seedBlock.start);
  let state = E.initialState();
  const moveKeys = [];
  for (let ply = 0; ply <= spec.population.maximumTrajectoryPly; ply += 1) {
    R.assertStudyState(state);
    if (eligible(state, ply, stratum)) {
      const prefix = moveKeys.slice(0, spec.population.openingPrefixLengthMoves);
      ensure(prefix.length === spec.population.openingPrefixLengthMoves, `independent short opening prefix ${seed}`);
      return { seed, stratum, ply, stateKey: R.key(state), openingPrefixSha256: sha256Text(prefix.join("\n")), state: clone(state), runtimeGuardHitBeforeSelection: false };
    }
    if (state.winner !== null) return { seed, stratum, unavailable: "terminal-before-eligibility", runtimeGuardHitBeforeSelection: false };
    const moves = E.moveVariants(state);
    if (!moves.length) return { seed, stratum, unavailable: "no-move-before-eligibility", runtimeGuardHitBeforeSelection: false };
    const move = moves[Math.floor(random() * moves.length)];
    moveKeys.push(R.moveIdentity(move));
    const next = E.applyMove(state, move).state;
    if (next.reason === "relay-limit") return { seed, stratum, unavailable: "relay-limit-before-eligibility", runtimeGuardHitBeforeSelection: true };
    state = next;
  }
  return { seed, stratum, unavailable: "maximum-ply-before-eligibility", runtimeGuardHitBeforeSelection: false };
}
function dedupSelect(rows, target) {
  const byPrefix = new Map();
  for (const row of rows) {
    if (row.unavailable) continue;
    const prior = byPrefix.get(row.openingPrefixSha256);
    if (!prior || row.stateKey < prior.stateKey || (row.stateKey === prior.stateKey && row.seed < prior.seed)) byPrefix.set(row.openingPrefixSha256, row);
  }
  const byRaw = new Map();
  for (const row of byPrefix.values()) {
    const prior = byRaw.get(row.stateKey);
    if (!prior || row.seed < prior.seed) byRaw.set(row.stateKey, row);
  }
  return [...byRaw.values()].sort((a, b) => a.stateKey.localeCompare(b.stateKey) || a.seed - b.seed).slice(0, target);
}
function population(spec) {
  const generated = [];
  for (let seed = spec.population.seedBlock.start; seed <= spec.population.seedBlock.end; seed += 1) generated.push(trajectoryCandidate(seed, spec));
  const selected = {};
  for (const stratum of ["namua", "mtaji", "mtaji-houseless"]) selected[stratum] = dedupSelect(generated.filter((row) => row.stratum === stratum), spec.population.targetRootsPerStratum);
  const lines = [];
  for (const stratum of Object.keys(selected).sort()) for (const row of selected[stratum]) lines.push(`${stratum}|${row.seed}|${row.ply}|${row.openingPrefixSha256}|${row.stateKey}`);
  return { generated, selected, selectionSha256: datasetHash(lines), trajectoryGuardHitsBeforeSelection: generated.filter((row) => row.runtimeGuardHitBeforeSelection).length };
}
function graph(roots, depth) {
  const states = new Map();
  const levels = new Map();
  const queue = [];
  const edges = new Map();
  let runtimeGuardHits = 0;
  function add(state, level) {
    R.assertStudyState(state);
    const key = R.key(state);
    if (!states.has(key)) states.set(key, clone(state));
    if (!levels.has(key) || level < levels.get(key)) { levels.set(key, level); queue.push(key); }
    return key;
  }
  for (const root of roots) add(root.state, 0);
  while (queue.length) {
    const sourceKey = queue.shift();
    const level = levels.get(sourceKey);
    const state = states.get(sourceKey);
    if (state.winner !== null || level >= depth) continue;
    for (const move of E.moveVariants(state)) {
      const next = E.applyMove(state, move).state;
      if (next.reason === "relay-limit") { runtimeGuardHits += 1; continue; }
      const targetKey = add(next, level + 1);
      const moveKey = R.moveIdentity(move);
      edges.set(`${sourceKey}|${moveKey}|${targetKey}`, { sourceKey, targetKey, move: clone(move), moveKey });
    }
  }
  return { states, levels, edges, runtimeGuardHits };
}
function swapped(id) { return id === T.IDS.SEAT_SWAP || id === T.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS; }
function expectedPair(pair, swap) { return swap ? [pair[1], pair[0]] : [pair[0], pair[1]]; }
function measure(id, strata, selected, depth) {
  const roots = strata.flatMap((stratum) => selected[stratum]);
  const source = graph(roots, depth);
  const names = [
    "transformed-state-validity", "inverse-roundtrip", "applicability-closure", "raw-reconstruction",
    "exact-legal-move-cardinality", "exact-legal-move-bijection", "unique-exact-move-mapping",
    "transition-commutation", "terminal-preservation", "winner-equivariance", "phase-semantics",
    "pending-reserve-houseOwned-semantics", "bounded-node-bijection", "bounded-edge-bijection", "adjacency-preservation",
  ];
  const gates = Object.fromEntries(names.map((name) => [name, 0]));
  const targetRoots = [];
  for (const root of roots) {
    try {
      if (!T.applicable(root.state, id)) gates["applicability-closure"] += 1;
      const transformed = T.transformState(root.state, id);
      if (!T.applicable(transformed, id)) gates["applicability-closure"] += 1;
      targetRoots.push({ ...root, state: transformed });
    } catch { gates["transformed-state-validity"] += 1; }
  }
  const target = graph(targetRoots, depth);
  const mappedNodes = new Set();
  for (const [sourceKey, state] of source.states) {
    let transformed;
    try { transformed = T.transformState(state, id); R.assertStudyState(transformed); } catch { gates["transformed-state-validity"] += 1; continue; }
    mappedNodes.add(R.key(transformed));
    try { if (R.key(T.transformState(transformed, id)) !== sourceKey) gates["inverse-roundtrip"] += 1; } catch { gates["inverse-roundtrip"] += 1; }
    if (!T.applicable(state, id) || !T.applicable(transformed, id)) gates["applicability-closure"] += 1;
    try { R.project(transformed); } catch { gates["raw-reconstruction"] += 1; }
    if ((state.winner !== null) !== (transformed.winner !== null)) gates["terminal-preservation"] += 1;
    if (transformed.winner !== T.mappedWinner(state.winner, id)) gates["winner-equivariance"] += 1;
    if (transformed.phase !== state.phase) gates["phase-semantics"] += 1;
    const swap = swapped(id);
    if (JSON.stringify(transformed.reserve) !== JSON.stringify(expectedPair(state.reserve, swap))
      || JSON.stringify(transformed.houseOwned) !== JSON.stringify(expectedPair(state.houseOwned, swap))
      || JSON.stringify(transformed.pending) !== JSON.stringify(expectedPair(state.pending, swap))) gates["pending-reserve-houseOwned-semantics"] += 1;
    if (state.winner === null) {
      const sourceMoves = E.moveVariants(state);
      const mapped = sourceMoves.map((move) => R.moveIdentity(T.transformMove(move, id)));
      const targetMoves = E.moveVariants(transformed).map(R.moveIdentity);
      if (mapped.length !== targetMoves.length) gates["exact-legal-move-cardinality"] += 1;
      if (!sameSet(mapped, targetMoves)) gates["exact-legal-move-bijection"] += 1;
      if (new Set(mapped).size !== mapped.length || new Set(targetMoves).size !== targetMoves.length) gates["unique-exact-move-mapping"] += 1;
    }
  }
  const mappedEdges = new Set();
  for (const edge of source.edges.values()) {
    try {
      const sourceState = source.states.get(edge.sourceKey);
      const targetState = source.states.get(edge.targetKey);
      const ts = T.transformState(sourceState, id);
      const tt = T.transformState(targetState, id);
      const tm = T.transformMove(edge.move, id);
      const mk = R.moveIdentity(tm);
      mappedEdges.add(`${R.key(ts)}|${mk}|${R.key(tt)}`);
      const actual = E.moveVariants(ts).find((move) => R.moveIdentity(move) === mk);
      if (!actual) { gates["transition-commutation"] += 1; continue; }
      const next = E.applyMove(ts, actual).state;
      if (next.reason === "relay-limit" || R.key(next) !== R.key(tt)) gates["transition-commutation"] += 1;
    } catch { gates["transition-commutation"] += 1; }
  }
  const targetNodes = new Set(target.states.keys());
  const targetEdges = new Set(target.edges.keys());
  if (!sameSet(mappedNodes, targetNodes)) gates["bounded-node-bijection"] += 1;
  if (!sameSet(mappedEdges, targetEdges)) gates["bounded-edge-bijection"] += 1;
  if (!sameSet(mappedEdges, targetEdges)) gates["adjacency-preservation"] += 1;
  return {
    candidateId: id,
    strata,
    rootCount: roots.length,
    sourceGraph: { stateCount: source.states.size, edgeCount: source.edges.size, runtimeGuardHits: source.runtimeGuardHits, stateSetSha256: datasetHash(source.states.keys()), edgeSetSha256: datasetHash(source.edges.keys()) },
    targetGraph: { stateCount: target.states.size, edgeCount: target.edges.size, runtimeGuardHits: target.runtimeGuardHits, stateSetSha256: datasetHash(target.states.keys()), edgeSetSha256: datasetHash(target.edges.keys()) },
    gateMismatchCounts: gates,
    totalMismatchCount: Object.values(gates).reduce((a, b) => a + b, 0),
  };
}
function selectedCompact(selected) {
  return Object.fromEntries(Object.entries(selected).map(([stratum, rows]) => [stratum, rows.map((row) => ({ seed: row.seed, ply: row.ply, stateKey: row.stateKey, openingPrefixSha256: row.openingPrefixSha256 }))]));
}

function main() {
  const productionIndex = process.argv.indexOf("--production");
  const outputIndex = process.argv.indexOf("--output");
  ensure(productionIndex >= 0 && outputIndex >= 0, "--production and --output are required");
  const productionPath = path.resolve(process.argv[productionIndex + 1]);
  const outputPath = path.resolve(process.argv[outputIndex + 1]);
  const spec = loadJson(SPEC_PATH);
  const auth = loadJson(AUTH_PATH);
  verifyAuthorization(spec, auth);

  const pop = population(spec);
  const targets = [
    ["C00-overall", T.IDS.IDENTITY, ["namua", "mtaji", "mtaji-houseless"]],
    ["C01-houseless", T.IDS.NEGATIVE_LR_NO_DIRECTION, ["mtaji-houseless"]],
    ["T01-namua", T.IDS.SEAT_SWAP, ["namua"]],
    ["T01-mtaji", T.IDS.SEAT_SWAP, ["mtaji"]],
    ["T01-mtaji-houseless", T.IDS.SEAT_SWAP, ["mtaji-houseless"]],
    ["T01-overall", T.IDS.SEAT_SWAP, ["namua", "mtaji", "mtaji-houseless"]],
    ["T02-houseless", T.IDS.LR_MTAJI_HOUSELESS, ["mtaji-houseless"]],
    ["T03-houseless", T.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS, ["mtaji-houseless"]],
  ];
  const measurements = {};
  for (const [label, id, strata] of targets) measurements[label] = measure(id, strata, pop.selected, spec.localGraph.depth);
  const rootCounts = Object.fromEntries(Object.entries(pop.selected).map(([key, rows]) => [key, rows.length]));
  const summaries = Object.fromEntries(Object.entries(measurements).map(([label, row]) => [label, {
    candidateId: row.candidateId, strata: row.strata, rootCount: row.rootCount, sourceGraph: row.sourceGraph, targetGraph: row.targetGraph,
    gateMismatchCounts: row.gateMismatchCounts, totalMismatchCount: row.totalMismatchCount,
  }]));
  const measurementSha256 = hashCanonical(summaries);
  const localGuardHits = Object.values(measurements).reduce((sum, row) => sum + row.sourceGraph.runtimeGuardHits + row.targetGraph.runtimeGuardHits, 0);
  const readiness = {
    "S1-R1": Object.values(rootCounts).every((count) => count >= spec.population.targetRootsPerStratum),
    "S1-R2": pop.trajectoryGuardHitsBeforeSelection === 0 && localGuardHits === 0,
    "S1-R3": measurements["C00-overall"].totalMismatchCount === 0,
    "S1-R4": measurements["C01-houseless"].totalMismatchCount > 0,
    "S1-R5": true,
    "S1-R6": true,
  };

  const production = loadJson(productionPath);
  const comparisons = {
    selectionSha256: production.population.selectionSha256 === pop.selectionSha256,
    selectedRoots: stable(production.population.selectedRoots) === stable(selectedCompact(pop.selected)),
    measurementSha256: production.measurementSha256 === measurementSha256,
    measurementSummaries: stable(Object.fromEntries(Object.entries(production.measurements).map(([label, row]) => [label, {
      candidateId: row.candidateId, strata: row.strata, rootCount: row.rootCount, sourceGraph: row.sourceGraph, targetGraph: row.targetGraph,
      gateMismatchCounts: row.gateMismatchCounts, totalMismatchCount: row.totalMismatchCount,
    }]))) === stable(summaries),
    rootCounts: stable(production.population.selectedRootCounts) === stable(rootCounts),
    productionReadinessPreR5: production.stage1ProductionReadyForIndependentVerification === true,
  };
  const passed = Object.values(comparisons).every(Boolean) && Object.values(readiness).every(Boolean);
  const verification = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    independentVerification: true,
    scientificInferenceAuthorized: false,
    passed,
    decision: passed ? "STSCV-STAGE1-INDEPENDENT-VERIFICATION-PASS" : "STSCV-STAGE1-INDEPENDENT-VERIFICATION-BLOCK",
    specSha256: sha256File(SPEC_PATH),
    candidateContractSha256: sha256File(CONTRACT_PATH),
    authorizationSha256: sha256File(AUTH_PATH),
    selectionSha256: pop.selectionSha256,
    measurementSha256,
    selectedRootCounts: rootCounts,
    readinessGates: readiness,
    comparisons,
    independentMeasurementSummaries: summaries,
    candidateFormalDecisionsAuthorized: false,
    stage2AuthorizationAutomatic: false,
    canonicalizationAuthorized: false,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(verification, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({
    studyId: verification.studyId,
    stageId: verification.stageId,
    passed,
    decision: verification.decision,
    selectionSha256: verification.selectionSha256,
    measurementSha256: verification.measurementSha256,
    selectedRootCounts: verification.selectedRootCounts,
    readinessGates: verification.readinessGates,
    comparisons: verification.comparisons,
  }, null, 2)}\n`);
  ensure(passed, "Stage 1 independent verification failed");
}

if (require.main === module) main();
