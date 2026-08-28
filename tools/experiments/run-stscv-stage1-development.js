#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const R = require("./lib/ssgtc-representation-production.js");
const T = require("./lib/stscv-stage0-production.js");

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
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function hashCanonical(value) { return sha256Text(stable(value)); }
function ensure(condition, message) { if (!condition) throw new Error(message); }
function sameSet(a, b) { return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()); }
function datasetHash(lines) { return sha256Text([...lines].sort().join("\n")); }

function loadJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }

function verifyAuthorization(spec, contract, auth) {
  ensure(auth.studyId === spec.studyId, "authorization studyId mismatch");
  ensure(auth.stageId === spec.stageId, "authorization stageId mismatch");
  ensure(auth.authorized === true, "Stage 1 authorization is not true");
  ensure(auth.scientificInferenceAuthorized === false, "Stage 1 must remain non-confirmatory development");
  ensure(auth.specSha256 === sha256File(SPEC_PATH), "Stage 1 spec hash mismatch");
  ensure(auth.candidateContractSha256 === sha256File(CONTRACT_PATH), "Stage 1 candidate contract hash mismatch");
  for (const rel of spec.frozenSourcePathsToBindBeforeAuthorization) {
    const expected = auth.sourceSha256?.[rel];
    ensure(typeof expected === "string" && expected.length === 64, `missing authorized source hash for ${rel}`);
    ensure(sha256File(path.join(ROOT, rel)) === expected, `authorized source drift for ${rel}`);
  }
  ensure(Array.isArray(contract.scientificCandidates) && contract.scientificCandidates.length === 3, "candidate contract count mismatch");
}

function assignedStratum(seed, start) {
  return ["namua", "mtaji", "mtaji-houseless"][(seed - start) % 3];
}
function eligible(state, ply, stratum) {
  R.assertStudyState(state);
  if (state.winner !== null) return false;
  if (stratum === "namua") return state.phase === "namua" && ply >= 12;
  if (stratum === "mtaji") return state.phase === "mtaji";
  if (stratum === "mtaji-houseless") {
    return state.phase === "mtaji"
      && state.reserve[0] === 0 && state.reserve[1] === 0
      && state.houseOwned[0] === false && state.houseOwned[1] === false;
  }
  throw new Error(`unknown stratum ${stratum}`);
}

function materializeTrajectoryCandidate(seed, spec) {
  const random = seededRandom(seed);
  const stratum = assignedStratum(seed, spec.population.seedBlock.start);
  let state = E.initialState();
  const moveKeys = [];
  for (let ply = 0; ply <= spec.population.maximumTrajectoryPly; ply += 1) {
    R.assertStudyState(state);
    if (eligible(state, ply, stratum)) {
      const stateKey = R.stateKey(state);
      const prefix = moveKeys.slice(0, spec.population.openingPrefixLengthMoves);
      ensure(prefix.length === spec.population.openingPrefixLengthMoves, `opening prefix too short for selected seed ${seed}`);
      return {
        seed,
        stratum,
        ply,
        stateKey,
        openingPrefixSha256: sha256Text(prefix.join("\n")),
        state: clone(state),
        runtimeGuardHitBeforeSelection: false,
      };
    }
    if (state.winner !== null) return { seed, stratum, unavailable: "terminal-before-eligibility", runtimeGuardHitBeforeSelection: false };
    const moves = E.moveVariants(state);
    if (!moves.length) return { seed, stratum, unavailable: "no-move-before-eligibility", runtimeGuardHitBeforeSelection: false };
    const move = moves[Math.floor(random() * moves.length)];
    moveKeys.push(R.moveKey(move));
    const next = E.applyMove(state, move).state;
    if (next.reason === "relay-limit") return { seed, stratum, unavailable: "relay-limit-before-eligibility", runtimeGuardHitBeforeSelection: true };
    state = next;
  }
  return { seed, stratum, unavailable: "maximum-ply-before-eligibility", runtimeGuardHitBeforeSelection: false };
}

function dedupAndSelect(rows, target) {
  const byPrefix = new Map();
  for (const row of rows) {
    if (row.unavailable) continue;
    const prior = byPrefix.get(row.openingPrefixSha256);
    if (!prior || row.stateKey < prior.stateKey || (row.stateKey === prior.stateKey && row.seed < prior.seed)) {
      byPrefix.set(row.openingPrefixSha256, row);
    }
  }
  const byRaw = new Map();
  for (const row of byPrefix.values()) {
    const prior = byRaw.get(row.stateKey);
    if (!prior || row.seed < prior.seed) byRaw.set(row.stateKey, row);
  }
  return [...byRaw.values()]
    .sort((a, b) => a.stateKey.localeCompare(b.stateKey) || a.seed - b.seed)
    .slice(0, target);
}

function materializePopulation(spec) {
  const generated = [];
  for (let seed = spec.population.seedBlock.start; seed <= spec.population.seedBlock.end; seed += 1) {
    generated.push(materializeTrajectoryCandidate(seed, spec));
  }
  const selected = {};
  for (const stratum of ["namua", "mtaji", "mtaji-houseless"]) {
    selected[stratum] = dedupAndSelect(generated.filter((row) => row.stratum === stratum), spec.population.targetRootsPerStratum);
  }
  const selectionLines = [];
  for (const stratum of Object.keys(selected).sort()) {
    for (const row of selected[stratum]) {
      selectionLines.push(`${stratum}|${row.seed}|${row.ply}|${row.openingPrefixSha256}|${row.stateKey}`);
    }
  }
  return {
    generated,
    selected,
    selectionSha256: datasetHash(selectionLines),
    trajectoryGuardHitsBeforeSelection: generated.filter((row) => row.runtimeGuardHitBeforeSelection).length,
  };
}

function buildGraph(roots, depth) {
  const states = new Map();
  const levels = new Map();
  const queue = [];
  const edges = new Map();
  let runtimeGuardHits = 0;
  function add(state, level) {
    R.assertStudyState(state);
    const key = R.stateKey(state);
    if (!states.has(key)) states.set(key, clone(state));
    const prior = levels.get(key);
    if (prior === undefined || level < prior) {
      levels.set(key, level);
      queue.push(key);
    }
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
      const moveKey = R.moveKey(move);
      edges.set(`${sourceKey}|${moveKey}|${targetKey}`, { sourceKey, targetKey, move: clone(move), moveKey });
    }
  }
  return { states, levels, edges, runtimeGuardHits };
}

function pairExpected(source, swap) { return swap ? [source[1], source[0]] : [source[0], source[1]]; }
function swapCandidate(id) { return id === T.IDS.SEAT_SWAP || id === T.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS; }

function measureScope(id, strata, selected, depth) {
  const roots = strata.flatMap((stratum) => selected[stratum]);
  const source = buildGraph(roots, depth);
  const gates = Object.fromEntries([
    "transformed-state-validity", "inverse-roundtrip", "applicability-closure", "raw-reconstruction",
    "exact-legal-move-cardinality", "exact-legal-move-bijection", "unique-exact-move-mapping",
    "transition-commutation", "terminal-preservation", "winner-equivariance", "phase-semantics",
    "pending-reserve-houseOwned-semantics", "bounded-node-bijection", "bounded-edge-bijection",
    "adjacency-preservation",
  ].map((name) => [name, 0]));

  const targetRoots = [];
  for (const root of roots) {
    try {
      if (!T.applicable(root.state, id)) gates["applicability-closure"] += 1;
      const transformed = T.transformState(root.state, id);
      if (!T.applicable(transformed, id)) gates["applicability-closure"] += 1;
      targetRoots.push({ ...root, state: transformed });
    } catch {
      gates["transformed-state-validity"] += 1;
    }
  }
  const target = buildGraph(targetRoots, depth);

  const mappedNodeKeys = new Set();
  for (const [key, state] of source.states) {
    let transformed;
    try {
      transformed = T.transformState(state, id);
      R.assertStudyState(transformed);
    } catch {
      gates["transformed-state-validity"] += 1;
      continue;
    }
    const transformedKey = R.stateKey(transformed);
    mappedNodeKeys.add(transformedKey);
    try {
      const roundTrip = T.transformState(transformed, id);
      if (R.stateKey(roundTrip) !== key) gates["inverse-roundtrip"] += 1;
    } catch {
      gates["inverse-roundtrip"] += 1;
    }
    if (!T.applicable(state, id) || !T.applicable(transformed, id)) gates["applicability-closure"] += 1;
    try { R.rawRuleState(transformed); } catch { gates["raw-reconstruction"] += 1; }
    if ((state.winner !== null) !== (transformed.winner !== null)) gates["terminal-preservation"] += 1;
    if (transformed.winner !== T.mappedWinner(state.winner, id)) gates["winner-equivariance"] += 1;
    if (transformed.phase !== state.phase) gates["phase-semantics"] += 1;
    const swap = swapCandidate(id);
    if (JSON.stringify(transformed.reserve) !== JSON.stringify(pairExpected(state.reserve, swap))
      || JSON.stringify(transformed.houseOwned) !== JSON.stringify(pairExpected(state.houseOwned, swap))
      || JSON.stringify(transformed.pending) !== JSON.stringify(pairExpected(state.pending, swap))) {
      gates["pending-reserve-houseOwned-semantics"] += 1;
    }

    if (state.winner === null) {
      const sourceMoves = E.moveVariants(state);
      const mapped = sourceMoves.map((move) => R.moveKey(T.transformMove(move, id)));
      const targetMoves = E.moveVariants(transformed).map(R.moveKey);
      if (mapped.length !== targetMoves.length) gates["exact-legal-move-cardinality"] += 1;
      if (!sameSet(mapped, targetMoves)) gates["exact-legal-move-bijection"] += 1;
      if (new Set(mapped).size !== mapped.length || new Set(targetMoves).size !== targetMoves.length) gates["unique-exact-move-mapping"] += 1;
    }
  }

  const mappedEdgeLines = new Set();
  for (const edge of source.edges.values()) {
    const sourceState = source.states.get(edge.sourceKey);
    const targetState = source.states.get(edge.targetKey);
    let transformedSource;
    let transformedTarget;
    let mappedMove;
    try {
      transformedSource = T.transformState(sourceState, id);
      transformedTarget = T.transformState(targetState, id);
      mappedMove = T.transformMove(edge.move, id);
      const mappedKey = R.moveKey(mappedMove);
      mappedEdgeLines.add(`${R.stateKey(transformedSource)}|${mappedKey}|${R.stateKey(transformedTarget)}`);
      const actual = E.moveVariants(transformedSource).find((move) => R.moveKey(move) === mappedKey);
      if (!actual) {
        gates["transition-commutation"] += 1;
        continue;
      }
      const next = E.applyMove(transformedSource, actual).state;
      if (next.reason === "relay-limit" || R.stateKey(next) !== R.stateKey(transformedTarget)) gates["transition-commutation"] += 1;
    } catch {
      gates["transition-commutation"] += 1;
    }
  }

  const targetNodeKeys = new Set(target.states.keys());
  if (!sameSet(mappedNodeKeys, targetNodeKeys)) gates["bounded-node-bijection"] += 1;
  const targetEdgeLines = new Set(target.edges.keys());
  if (!sameSet(mappedEdgeLines, targetEdgeLines)) gates["bounded-edge-bijection"] += 1;
  if (!sameSet(mappedEdgeLines, targetEdgeLines)) gates["adjacency-preservation"] += 1;

  const totalMismatchCount = Object.values(gates).reduce((a, b) => a + b, 0);
  return {
    candidateId: id,
    strata,
    rootCount: roots.length,
    sourceGraph: {
      stateCount: source.states.size,
      edgeCount: source.edges.size,
      runtimeGuardHits: source.runtimeGuardHits,
      stateSetSha256: datasetHash(source.states.keys()),
      edgeSetSha256: datasetHash(source.edges.keys()),
    },
    targetGraph: {
      stateCount: target.states.size,
      edgeCount: target.edges.size,
      runtimeGuardHits: target.runtimeGuardHits,
      stateSetSha256: datasetHash(target.states.keys()),
      edgeSetSha256: datasetHash(target.edges.keys()),
    },
    gateMismatchCounts: gates,
    totalMismatchCount,
    developmentDiagnosticLabel: totalMismatchCount === 0 ? "ZERO-MISMATCH-DEVELOPMENT-DIAGNOSTIC" : "MISMATCH-OBSERVED-DEVELOPMENT",
  };
}

function compactSelected(selected) {
  return Object.fromEntries(Object.entries(selected).map(([stratum, rows]) => [stratum, rows.map((row) => ({
    seed: row.seed,
    ply: row.ply,
    stateKey: row.stateKey,
    openingPrefixSha256: row.openingPrefixSha256,
  }))]));
}

function main() {
  const outIndex = process.argv.indexOf("--output");
  const output = outIndex >= 0 ? process.argv[outIndex + 1] : null;
  ensure(output, "--output is required");
  const spec = loadJson(SPEC_PATH);
  const contract = loadJson(CONTRACT_PATH);
  const auth = loadJson(AUTH_PATH);
  verifyAuthorization(spec, contract, auth);

  const population = materializePopulation(spec);
  const selected = population.selected;
  const targetSpecs = [
    { label: "C00-overall", id: T.IDS.IDENTITY, strata: ["namua", "mtaji", "mtaji-houseless"] },
    { label: "C01-houseless", id: T.IDS.NEGATIVE_LR_NO_DIRECTION, strata: ["mtaji-houseless"] },
    { label: "T01-namua", id: T.IDS.SEAT_SWAP, strata: ["namua"] },
    { label: "T01-mtaji", id: T.IDS.SEAT_SWAP, strata: ["mtaji"] },
    { label: "T01-mtaji-houseless", id: T.IDS.SEAT_SWAP, strata: ["mtaji-houseless"] },
    { label: "T01-overall", id: T.IDS.SEAT_SWAP, strata: ["namua", "mtaji", "mtaji-houseless"] },
    { label: "T02-houseless", id: T.IDS.LR_MTAJI_HOUSELESS, strata: ["mtaji-houseless"] },
    { label: "T03-houseless", id: T.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS, strata: ["mtaji-houseless"] },
  ];
  const measurements = {};
  for (const target of targetSpecs) measurements[target.label] = measureScope(target.id, target.strata, selected, spec.localGraph.depth);

  const rootCounts = Object.fromEntries(Object.entries(selected).map(([key, rows]) => [key, rows.length]));
  const localGuardHits = Object.values(measurements).reduce((sum, row) => sum + row.sourceGraph.runtimeGuardHits + row.targetGraph.runtimeGuardHits, 0);
  const readiness = {
    "S1-R1": Object.values(rootCounts).every((count) => count >= spec.population.targetRootsPerStratum),
    "S1-R2": population.trajectoryGuardHitsBeforeSelection === 0 && localGuardHits === 0,
    "S1-R3": measurements["C00-overall"].totalMismatchCount === 0,
    "S1-R4": measurements["C01-houseless"].totalMismatchCount > 0,
    "S1-R5": null,
    "S1-R6": true,
  };
  const decisionInputs = {
    selectionSha256: population.selectionSha256,
    rootCounts,
    trajectoryGuardHitsBeforeSelection: population.trajectoryGuardHitsBeforeSelection,
    measurementSummaries: Object.fromEntries(Object.entries(measurements).map(([label, row]) => [label, {
      candidateId: row.candidateId,
      strata: row.strata,
      rootCount: row.rootCount,
      sourceGraph: row.sourceGraph,
      targetGraph: row.targetGraph,
      gateMismatchCounts: row.gateMismatchCounts,
      totalMismatchCount: row.totalMismatchCount,
    }])),
  };
  const measurementSha256 = hashCanonical(decisionInputs.measurementSummaries);
  const result = {
    schemaVersion: 1,
    programLabel: "G2-03",
    researchGeneration: "Research Generation 2",
    studyId: spec.studyId,
    stageId: spec.stageId,
    stageRole: spec.stageRole,
    scientificInferenceAuthorized: false,
    formalConfirmationAuthorized: false,
    baselineMain: spec.baselineMain,
    authorizationSha256: sha256File(AUTH_PATH),
    specSha256: sha256File(SPEC_PATH),
    candidateContractSha256: sha256File(CONTRACT_PATH),
    population: {
      seedBlock: spec.population.seedBlock,
      maximumTrajectoryPly: spec.population.maximumTrajectoryPly,
      assignedStratumRule: spec.population.assignedStratumRule,
      targetRootsPerStratum: spec.population.targetRootsPerStratum,
      generatedTrajectoryCount: population.generated.length,
      trajectoryGuardHitsBeforeSelection: population.trajectoryGuardHitsBeforeSelection,
      selectedRootCounts: rootCounts,
      selectedRoots: compactSelected(selected),
      selectionSha256: population.selectionSha256,
    },
    measurements,
    measurementSha256,
    developmentCandidateDiagnostics: {
      "STSCV-T01-SEAT-SWAP-LOCAL": { overallMismatchCount: measurements["T01-overall"].totalMismatchCount, label: measurements["T01-overall"].developmentDiagnosticLabel },
      "STSCV-T02-LR-MTAJI-HOUSELESS": { overallMismatchCount: measurements["T02-houseless"].totalMismatchCount, label: measurements["T02-houseless"].developmentDiagnosticLabel },
      "STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS": { overallMismatchCount: measurements["T03-houseless"].totalMismatchCount, label: measurements["T03-houseless"].developmentDiagnosticLabel },
    },
    readinessGates: readiness,
    stage1ProductionReadyForIndependentVerification: Object.entries(readiness).filter(([key]) => key !== "S1-R5").every(([, value]) => value === true),
    stage2AuthorizationAutomatic: false,
    canonicalizationAuthorized: false,
    notes: [
      "Candidate diagnostics are development-only and are not formal validation decisions.",
      "Candidate favorability is not a Stage 2 readiness gate; failed candidates remain eligible for held-out formal rejection testing if instrument/readiness gates pass.",
      "Stage 1 selected trajectory, opening-prefix, and RAW-state identities are consumed after inspection and must be firewalled from Stage 2."
    ]
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({
    studyId: result.studyId,
    stageId: result.stageId,
    selectionSha256: result.population.selectionSha256,
    selectedRootCounts: rootCounts,
    measurementSha256,
    developmentCandidateDiagnostics: result.developmentCandidateDiagnostics,
    readinessGates: readiness,
    stage1ProductionReadyForIndependentVerification: result.stage1ProductionReadyForIndependentVerification,
  }, null, 2)}\n`);
  ensure(result.stage1ProductionReadyForIndependentVerification, "Stage 1 production readiness gates failed");
}

if (require.main === module) main();
