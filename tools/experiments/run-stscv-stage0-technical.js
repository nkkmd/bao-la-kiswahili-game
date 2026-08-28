#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const P = require("./lib/stscv-stage0-production.js");
const I = require("./lib/stscv-stage0-independent.js");

const STUDY_ID = "STSCV-STUDY1";
const STAGE_ID = "STSCV-S0-TECHNICAL-2026-08-28-v1";
const BASELINE_MAIN = "a8493d2a50e11f15d16ef8348f2442b262ca275d";
const EXPECTED_ENGINE_SHA256 = "e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c";
const TECH_SEED_START = 26030001;
const TECH_SEED_END = 26030032;
const MAX_PLY = 80;
const LOCAL_DEPTH = 2;
const ROOT_CAP = 4;

function sha256Buffer(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function sha256File(file) { return sha256Buffer(fs.readFileSync(file)); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sorted(values) { return [...values].sort(); }
function sameSet(a, b) { return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b)); }
function ensure(condition, message) { if (!condition) throw new Error(message); }

function mtajiHouselessFixture() {
  const state = E.initialState();
  state.pits = [
    [[2, 0, 0, 0, 1, 1, 1, 1], [10, 0, 8, 8, 0, 0, 0, 0]],
    [[1, 1, 1, 1, 0, 0, 0, 2], [0, 0, 0, 0, 8, 8, 0, 10]],
  ];
  state.reserve = [0, 0];
  state.houseOwned = [false, false];
  state.player = 0;
  state.phase = "mtaji";
  state.winner = null;
  state.reason = "";
  state.turn = 45;
  state.pending = [0, 0];
  return state;
}

function terminalPendingFixture() {
  const state = mtajiHouselessFixture();
  state.pits[0][1][0] -= 1;
  state.pending[0] = 1;
  state.winner = 0;
  state.reason = "front-empty";
  return state;
}

function assertStrictIdentitySemantics() {
  const initial = E.initialState();
  ensure(P.rawStateKey(initial) === I.rawStateKey(initial), "production/independent RAW key mismatch");
  const meta = clone(initial);
  meta.turn = 999999;
  meta.reason = "excluded-metadata-probe";
  ensure(P.rawStateKey(meta) === P.rawStateKey(initial), "turn/reason leaked into production RAW identity");
  ensure(I.rawStateKey(meta) === I.rawStateKey(initial), "turn/reason leaked into independent RAW identity");

  const missing = clone(initial);
  delete missing.pending;
  let prodRejected = false;
  let indepRejected = false;
  try { P.rawStateKey(missing); } catch (error) { prodRejected = /pending/i.test(error.message); }
  try { I.rawStateKey(missing); } catch (error) { indepRejected = /pending/i.test(error.message); }
  ensure(prodRejected && indepRejected, "missing pending did not fail closed");

  const stop = { type: "capture", phase: "namua", row: 0, index: 4, direction: "right", side: "left", houseChoice: "stop" };
  const use = { ...stop, houseChoice: "use" };
  ensure(P.exactMoveKey(stop) !== P.exactMoveKey(use), "production houseChoice collapsed");
  ensure(I.exactMoveKey(stop) !== I.exactMoveKey(use), "independent houseChoice collapsed");
  ensure(P.exactMoveKey(stop) === I.exactMoveKey(stop), "exact move identity disagreement");

  const terminal = terminalPendingFixture();
  ensure(P.rawStateKey(terminal) === I.rawStateKey(terminal), "terminal/pending RAW identity disagreement");
  const altered = clone(terminal);
  altered.pending[0] = 0;
  altered.pits[0][1][0] += 1;
  ensure(P.rawStateKey(altered) !== P.rawStateKey(terminal), "pending failed to affect RAW identity");
  return true;
}

function transformMismatchCount(state, id) {
  let mismatches = 0;
  let ps;
  let is;
  try {
    ps = P.transformState(state, id);
    is = I.transformState(state, id);
  } catch {
    return 1;
  }
  if (P.rawStateKey(ps) !== I.rawStateKey(is)) mismatches += 1;
  if (P.applicable(state, id) !== I.applicable(state, id)) mismatches += 1;
  if (P.applicable(state, id) !== P.applicable(ps, id)) mismatches += 1;
  if (P.rawStateKey(P.transformState(ps, id)) !== P.rawStateKey(state)) mismatches += 1;
  if (I.rawStateKey(I.transformState(is, id)) !== I.rawStateKey(state)) mismatches += 1;

  if (state.winner !== null) {
    if (ps.winner !== P.mappedWinner(state.winner, id)) mismatches += 1;
    if (is.winner !== I.mappedWinner(state.winner, id)) mismatches += 1;
    if (E.moveVariants(ps).length !== 0 || E.moveVariants(is).length !== 0) mismatches += 1;
    return mismatches;
  }

  const sourceMoves = E.moveVariants(state);
  const pMapped = sourceMoves.map((move) => P.exactMoveKey(P.transformMove(move, id)));
  const iMapped = sourceMoves.map((move) => I.exactMoveKey(I.transformMove(move, id)));
  const pTarget = E.moveVariants(ps).map(P.exactMoveKey);
  const iTarget = E.moveVariants(is).map(I.exactMoveKey);
  if (!sameSet(pMapped, pTarget)) mismatches += 1;
  if (!sameSet(iMapped, iTarget)) mismatches += 1;
  if (!sameSet(pMapped, iMapped)) mismatches += 1;

  for (const move of sourceMoves) {
    const pm = P.transformMove(move, id);
    const im = I.transformMove(move, id);
    if (P.exactMoveKey(pm) !== I.exactMoveKey(im)) mismatches += 1;
    if (P.exactMoveKey(P.transformMove(pm, id)) !== P.exactMoveKey(move)) mismatches += 1;
    if (I.exactMoveKey(I.transformMove(im, id)) !== I.exactMoveKey(move)) mismatches += 1;

    let leftP;
    let rightP;
    try {
      leftP = P.transformState(E.applyMove(state, move).state, id);
      rightP = E.applyMove(ps, pm).state;
    } catch {
      mismatches += 1;
      continue;
    }
    if (P.rawStateKey(leftP) !== P.rawStateKey(rightP)) mismatches += 1;

    let leftI;
    let rightI;
    try {
      leftI = I.transformState(E.applyMove(state, move).state, id);
      rightI = E.applyMove(is, im).state;
    } catch {
      mismatches += 1;
      continue;
    }
    if (I.rawStateKey(leftI) !== I.rawStateKey(rightI)) mismatches += 1;
    if (P.rawStateKey(leftP) !== I.rawStateKey(leftI)) mismatches += 1;
  }
  return mismatches;
}

function assertControlsAndProvisionalTransforms() {
  const namua = E.initialState();
  const mtaji = mtajiHouselessFixture();
  const terminal = terminalPendingFixture();
  const diagnostics = {};

  for (const [id, states] of [
    [P.IDS.IDENTITY, [namua, mtaji, terminal]],
    [P.IDS.SEAT_SWAP, [namua, mtaji, terminal]],
    [P.IDS.LR_MTAJI_HOUSELESS, [mtaji, terminal]],
    [P.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS, [mtaji, terminal]],
  ]) {
    const counts = states.map((state) => transformMismatchCount(state, id));
    diagnostics[id] = { technicalFixtureMismatchCount: counts.reduce((a, b) => a + b, 0), fixtureCount: states.length };
    ensure(diagnostics[id].technicalFixtureMismatchCount === 0, `${id} technical fixture mismatch`);
  }
  ensure(P.applicable(namua, P.IDS.LR_MTAJI_HOUSELESS) === false, "LR active-house Namua must be out of scope");
  ensure(I.applicable(namua, I.IDS.LR_MTAJI_HOUSELESS) === false, "independent LR active-house Namua scope mismatch");

  const negative = transformMismatchCount(mtaji, P.IDS.NEGATIVE_LR_NO_DIRECTION);
  diagnostics[P.IDS.NEGATIVE_LR_NO_DIRECTION] = { technicalFixtureMismatchCount: negative, fixtureCount: 1 };
  ensure(negative > 0, "negative control was not detected");
  return diagnostics;
}

function technicalTrajectories() {
  const trajectories = [];
  for (let seed = TECH_SEED_START; seed <= TECH_SEED_END; seed += 1) {
    const random = seededRandom(seed);
    let state = E.initialState();
    const rows = [];
    let guardHit = false;
    for (let ply = 0; ply <= MAX_PLY; ply += 1) {
      const keyP = P.rawStateKey(state);
      const keyI = I.rawStateKey(state);
      ensure(keyP === keyI, "technical trajectory RAW serializer mismatch");
      rows.push({ ply, state: clone(state), stateKey: keyP });
      if (state.winner !== null) break;
      const moves = E.moveVariants(state);
      if (!moves.length) break;
      const move = moves[Math.floor(random() * moves.length)];
      const next = E.applyMove(state, move).state;
      if (next.reason === "relay-limit") { guardHit = true; break; }
      state = next;
    }
    trajectories.push({ seed, rows, guardHit });
  }
  return trajectories;
}

function selectedRoots(trajectories, phase) {
  const map = new Map();
  for (const trajectory of trajectories) {
    const row = trajectory.rows.find((item) => item.state.winner === null && item.state.phase === phase && (phase !== "namua" || item.ply >= 8));
    if (!row) continue;
    if (!map.has(row.stateKey)) map.set(row.stateKey, row);
  }
  return [...map.values()].sort((a, b) => a.stateKey.localeCompare(b.stateKey)).slice(0, ROOT_CAP);
}

function graphProfile(roots) {
  const states = new Map();
  const queue = [];
  const expanded = new Set();
  let edges = 0;
  let maxBranching = 0;
  let guardHits = 0;
  for (const root of roots) {
    states.set(root.stateKey, clone(root.state));
    queue.push({ key: root.stateKey, depth: 0 });
  }
  while (queue.length) {
    const current = queue.shift();
    if (expanded.has(`${current.key}|${current.depth}`)) continue;
    expanded.add(`${current.key}|${current.depth}`);
    const state = states.get(current.key);
    if (!state || state.winner !== null || current.depth >= LOCAL_DEPTH) continue;
    const moves = E.moveVariants(state);
    maxBranching = Math.max(maxBranching, moves.length);
    for (const move of moves) {
      const next = E.applyMove(state, move).state;
      if (next.reason === "relay-limit") { guardHits += 1; continue; }
      const key = P.rawStateKey(next);
      ensure(key === I.rawStateKey(next), "resource graph serializer disagreement");
      states.set(key, clone(next));
      edges += 1;
      if (current.depth + 1 < LOCAL_DEPTH && next.winner === null) queue.push({ key, depth: current.depth + 1 });
    }
  }
  return { rootCount: roots.length, localDepth: LOCAL_DEPTH, uniqueRawStates: states.size, edgeOccurrences: edges, maxBranching, runtimeGuardHits: guardHits };
}

function transformFamilyClassification() {
  return [
    { requested: "player-swap", classification: "unique-provisional-candidate", candidateId: P.IDS.SEAT_SWAP, basis: "engine coordinates are player-local; swap player-indexed state and player/winner labels" },
    { requested: "player-swap-plus-board-rotation", classification: "semantic-alias-under-engine-local-coordinates", aliasOf: P.IDS.SEAT_SWAP, basis: "physical seat exchange/180-degree rotation is represented by local-coordinate player swap without index reversal" },
    { requested: "left-right-reflection", classification: "restricted-provisional-candidate", candidateId: P.IDS.LR_MTAJI_HOUSELESS, basis: "requires index reversal plus direction/side flip; active HOUSE=4 is not LR invariant" },
    { requested: "pit-index-reversal", classification: "component-not-standalone-candidate", representedBy: P.IDS.LR_MTAJI_HOUSELESS, basis: "index reversal alone omits required orientation semantics" },
    { requested: "direction-inversion", classification: "non-candidate", basis: "direction inversion without coordinate reversal lacks transition equivariance" },
    { requested: "row-remapping", classification: "non-candidate", basis: "FRONT is privileged by capture and nyumba semantics" },
    { requested: "player-relative-orientation-transform", classification: "represented-by-local-coordinate-candidates", representedBy: [P.IDS.SEAT_SWAP, P.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS] },
    { requested: "necessary-compositions", classification: "unique-provisional-composition", candidateId: P.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS, components: [P.IDS.SEAT_SWAP, P.IDS.LR_MTAJI_HOUSELESS] },
  ];
}

function main() {
  const outputIndex = process.argv.indexOf("--output");
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  const repoRoot = path.resolve(__dirname, "../..");
  const enginePath = path.join(repoRoot, "public/engine.js");
  const specPath = path.join(repoRoot, "doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_0_TECHNICAL_SPEC.json");
  const prodPath = path.join(__dirname, "lib/stscv-stage0-production.js");
  const indepPath = path.join(__dirname, "lib/stscv-stage0-independent.js");
  const runnerPath = __filename;

  const engineSha256 = sha256File(enginePath);
  ensure(engineSha256 === EXPECTED_ENGINE_SHA256, `engine hash drift: ${engineSha256}`);

  const independentSource = fs.readFileSync(indepPath, "utf8");
  ensure(!/stscv-stage0-production/.test(independentSource), "independent transform imports production transform");
  ensure(!/symmetry-isomorphism-transforms/.test(independentSource), "independent transform imports prior SIP transform implementation");

  const gates = {};
  gates["S0-G1-ENGINE-SOURCE-BINDING"] = engineSha256 === EXPECTED_ENGINE_SHA256;
  gates["S0-G2-RAW-IDENTITY"] = assertStrictIdentitySemantics();
  const transformDiagnostics = assertControlsAndProvisionalTransforms();
  gates["S0-G3-IDENTITY-CONTROL"] = transformDiagnostics[P.IDS.IDENTITY].technicalFixtureMismatchCount === 0;
  gates["S0-G4-NEGATIVE-CONTROL"] = transformDiagnostics[P.IDS.NEGATIVE_LR_NO_DIRECTION].technicalFixtureMismatchCount > 0;
  gates["S0-G5-PRODUCTION-INDEPENDENT-TRANSFORM"] = true;
  gates["S0-G6-MOVE-IDENTITY-HOUSECHOICE"] = true;
  gates["S0-G7-TERMINAL-PENDING-WINNER"] = true;
  gates["S0-G8-APPLICABILITY-BOUNDARY"] = true;
  gates["S0-G9-INDEPENDENT-SOURCE-SEPARATION"] = true;

  const trajectories = technicalTrajectories();
  const namuaRoots = selectedRoots(trajectories, "namua");
  const mtajiRoots = selectedRoots(trajectories, "mtaji");
  ensure(namuaRoots.length > 0, "technical Namua root inventory empty");
  ensure(mtajiRoots.length > 0, "technical Mtaji root inventory empty");
  const resourceAudit = {
    seedBlock: { start: TECH_SEED_START, end: TECH_SEED_END, count: trajectories.length, maxPly: MAX_PLY },
    trajectoryRuntimeGuardHits: trajectories.filter((row) => row.guardHit).length,
    phaseCoverage: {
      trajectoriesWithNamua: trajectories.filter((row) => row.rows.some((item) => item.state.phase === "namua")).length,
      trajectoriesWithMtaji: trajectories.filter((row) => row.rows.some((item) => item.state.phase === "mtaji")).length,
    },
    namuaDepth2: graphProfile(namuaRoots),
    mtajiDepth2: graphProfile(mtajiRoots),
  };
  gates["S0-G10-RESOURCE-AUDIT-PHASE-COVERAGE"] = namuaRoots.length > 0 && mtajiRoots.length > 0;
  gates["S0-G11-RESOURCE-AUDIT-NO-RUNTIME-GUARD"] = resourceAudit.namuaDepth2.runtimeGuardHits === 0 && resourceAudit.mtajiDepth2.runtimeGuardHits === 0;

  const classification = transformFamilyClassification();
  gates["S0-G12-TRANSFORM-FAMILY-CLASSIFIED"] = classification.length === 8;

  const allPassed = Object.values(gates).every(Boolean);
  const result = {
    schemaVersion: 1,
    programLabel: "G2-03",
    researchGeneration: "Research Generation 2",
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    stageRole: "technical-feasibility-and-representation-contract-validation",
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    scientificSeedUseAllowed: false,
    baselineMain: BASELINE_MAIN,
    passed: allPassed,
    decision: allPassed ? "STSCV-STAGE0-TECHNICAL-PASS" : "STSCV-STAGE0-TECHNICAL-BLOCK",
    gates,
    technicalControlDiagnostics: transformDiagnostics,
    transformFamilyClassification: classification,
    provisionalStage1CandidateSetRecommendation: [P.IDS.SEAT_SWAP, P.IDS.LR_MTAJI_HOUSELESS, P.IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS],
    canonicalizationAuthorized: false,
    stage1ScientificGenerationAuthorized: false,
    stage2ScientificGenerationAuthorized: false,
    resourceAudit,
    provenance: {
      engineSha256,
      stage0SpecSha256: sha256File(specPath),
      productionTransformSourceSha256: sha256File(prodPath),
      independentTransformSourceSha256: sha256File(indepPath),
      runnerSourceSha256: sha256File(runnerPath),
    },
    notes: [
      "Technical transform fixture diagnostics are not scientific candidate outcomes.",
      "Resource audit does not apply any non-identity transform and therefore cannot select Stage 1 population based on candidate success/failure.",
      "The recommended finite candidate set requires a separate prospective Stage 1 candidate contract freeze before any fresh scientific generation.",
      "Rule-semantic isomorphism remains separate from fixed-start reachable-population canonicalization authorization."
    ]
  };

  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  assert.equal(allPassed, true, "Stage 0 technical gates did not all pass");
}

if (require.main === module) main();
