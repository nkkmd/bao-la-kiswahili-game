"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C006-v1-predevelopment-support-spec.json");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/pbai-p2/c006/predevelopment-support.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c006/predevelopment-support-verification.json");
const LIMIT = 20;

function h(text) { return crypto.createHash("sha256").update(text, "utf8").digest("hex"); }
function fileHash(relative) { return h(fs.readFileSync(path.join(ROOT, relative), "utf8")); }
function assert(ok, message) { if (!ok) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function loadSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  return { spec: JSON.parse(text), hash: h(text) };
}

function rng(seed) {
  let x = seed >>> 0;
  return function nextRandom() {
    x += 0x6D2B79F5;
    let y = x;
    y = Math.imul(y ^ (y >>> 15), y | 1);
    y ^= y + Math.imul(y ^ (y >>> 7), y | 61);
    return ((y ^ (y >>> 14)) >>> 0) / 4294967296;
  };
}

function strictRaw(state) {
  assert(state && typeof state === "object", "invalid state");
  assert(Array.isArray(state.pits) && state.pits.length === 2, "invalid pits");
  let total = 0;
  const pits = [];
  for (let p = 0; p < 2; p += 1) {
    assert(Array.isArray(state.pits[p]) && state.pits[p].length === 2, "invalid rows");
    pits[p] = [];
    for (let r = 0; r < 2; r += 1) {
      const row = state.pits[p][r];
      assert(Array.isArray(row) && row.length === 8, "invalid row width");
      pits[p][r] = [];
      for (let i = 0; i < 8; i += 1) {
        const value = row[i];
        assert(Number.isInteger(value) && value >= 0, "invalid pit count");
        pits[p][r][i] = value;
        total += value;
      }
    }
  }
  assert(Array.isArray(state.reserve) && state.reserve.length === 2, "invalid reserve");
  assert(state.reserve.every((v) => Number.isInteger(v) && v >= 0), "invalid reserve value");
  assert(Array.isArray(state.pending) && state.pending.length === 2, "pending absent");
  assert(state.pending.every((v) => Number.isInteger(v) && v >= 0), "invalid pending value");
  total += state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
  assert(total === 64, `seed invariant mismatch ${total}`);
  assert(Array.isArray(state.houseOwned) && state.houseOwned.length === 2, "invalid houseOwned");
  assert(state.houseOwned.every((v) => typeof v === "boolean"), "invalid houseOwned value");
  assert(state.player === 0 || state.player === 1, "invalid player");
  assert(state.phase === "namua" || state.phase === "mtaji", "invalid phase");
  assert(state.winner === null || state.winner === 0 || state.winner === 1, "invalid winner");
  return {
    pits,
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}

function rawHash(state) { return h(JSON.stringify(strictRaw(state))); }
function variants(state) { return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b))); }

function ref(state, seed, ply, source, extra = {}) {
  return {
    seed,
    ply,
    source,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
    rawKey: rawHash(state),
    aiKeySha256: h(AI.stateKey(state)),
    ...extra,
  };
}

function newTracker() {
  return { map: new Map(), collisions: 0, witnesses: [], observations: 0, raws: new Set() };
}

function track(tracker, state, stateRef) {
  const raw = rawHash(state);
  const key = AI.stateKey(state);
  tracker.observations += 1;
  tracker.raws.add(raw);
  const prior = tracker.map.get(key);
  if (!prior) {
    tracker.map.set(key, { rawKey: raw, ref: stateRef });
    return;
  }
  if (prior.rawKey === raw) return;
  tracker.collisions += 1;
  if (tracker.witnesses.length < LIMIT) tracker.witnesses.push({ aiKeySha256: h(key), first: prior.ref, second: stateRef });
}

function selectRank(candidateVersion, state, seed, ply) {
  return h([candidateVersion, state.phase, seed, ply, rawHash(state)].join("|"));
}

function retainRoot(bucket, item, target) {
  bucket.push(item);
  bucket.sort((a, b) => a.rank.localeCompare(b.rank) || a.seed - b.seed || a.ply - b.ply);
  if (bucket.length > target) bucket.length = target;
}

function inspectLocal(root, depthLimit) {
  const evalMap = new Map();
  const ttMap = new Map();
  let observations = 0;
  let evalCollisions = 0;
  let ttCollisions = 0;
  const evalWitnesses = [];
  const ttWitnesses = [];

  function walk(state, relativePly) {
    strictRaw(state);
    observations += 1;
    const raw = rawHash(state);
    const key = AI.stateKey(state);
    const r = ref(state, root.seed, root.ply, "local-search", { relativePly });
    const a = evalMap.get(key);
    if (!a) evalMap.set(key, { rawKey: raw, ref: r });
    else if (a.rawKey !== raw) {
      evalCollisions += 1;
      if (evalWitnesses.length < LIMIT) evalWitnesses.push({ aiKeySha256: h(key), first: a.ref, second: r });
    }
    const tt = `${key}@${relativePly}`;
    const t = ttMap.get(tt);
    if (!t) ttMap.set(tt, { rawKey: raw, ref: r });
    else if (t.rawKey !== raw) {
      ttCollisions += 1;
      if (ttWitnesses.length < LIMIT) ttWitnesses.push({ ttKeySha256: h(tt), first: t.ref, second: r });
    }
    if (relativePly >= depthLimit || state.winner !== null) return;
    const moves = variants(state);
    for (let i = 0; i < moves.length; i += 1) walk(E.applyMove(state, moves[i]).state, relativePly + 1);
  }

  walk(root.state, 0);
  return { observations, evalCollisions, ttCollisions, evalWitnesses, ttWitnesses };
}

function recompute(spec) {
  assert(fileHash("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine hash mismatch");
  assert(fileHash("public/ai.js") === spec.sourceBindings["public/ai.js"], "ai hash mismatch");
  const semantic = newTracker();
  const natural = newTracker();
  const selected = { namua: [], mtaji: [] };
  let completed = 0;
  let terminal = 0;
  let maxPly = 0;
  let naturalObservations = 0;
  let successorObservations = 0;
  let workerCollisions = 0;
  const workerWitnesses = [];

  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const random = rng(seed);
    let state = E.initialState();
    let ply = 0;
    const trajectoryKeys = new Map();
    while (ply <= spec.population.maximumGamePlies) {
      strictRaw(state);
      maxPly = Math.max(maxPly, ply);
      naturalObservations += 1;
      const nref = ref(state, seed, ply, "natural");
      track(natural, state, nref);
      track(semantic, state, nref);
      const aiKey = AI.stateKey(state);
      const rkey = rawHash(state);
      const prior = trajectoryKeys.get(aiKey);
      if (!prior) trajectoryKeys.set(aiKey, { rawKey: rkey, ref: nref });
      else if (prior.rawKey !== rkey) {
        workerCollisions += 1;
        if (workerWitnesses.length < LIMIT) workerWitnesses.push({ aiKeySha256: h(aiKey), first: prior.ref, second: nref });
      }
      if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
      const moves = variants(state);
      if (!moves.length) break;
      if (moves.length >= spec.population.localSearchRootSelection.minimumLegalMoveCount) {
        retainRoot(selected[state.phase], {
          rank: selectRank(spec.candidateVersion, state, seed, ply),
          seed,
          ply,
          phase: state.phase,
          rawKey: rkey,
          state: clone(state),
        }, spec.population.localSearchRootSelection.targetPerPhase);
      }
      const successors = [];
      for (let i = 0; i < moves.length; i += 1) {
        const next = E.applyMove(state, moves[i]).state;
        strictRaw(next);
        successorObservations += 1;
        track(semantic, next, ref(next, seed, ply + 1, "one-move-successor", { moveKey: AI.moveKey(moves[i]) }));
        successors.push(next);
      }
      state = successors[Math.floor(random() * successors.length)];
      ply += 1;
    }
    completed += 1;
    if (state.winner !== null) terminal += 1;
  }

  const local = {
    rootsMeasured: 0,
    stateObservations: 0,
    evalEvents: 0,
    ttEvents: 0,
    rootsEval: 0,
    rootsTt: 0,
    evalWitnesses: [],
    ttWitnesses: [],
  };
  const roots = selected.namua.concat(selected.mtaji);
  for (const root of roots) {
    const item = inspectLocal(root, spec.population.localSearchRootSelection.maximumLocalDepthPlies);
    local.rootsMeasured += 1;
    local.stateObservations += item.observations;
    local.evalEvents += item.evalCollisions;
    local.ttEvents += item.ttCollisions;
    if (item.evalCollisions) local.rootsEval += 1;
    if (item.ttCollisions) local.rootsTt += 1;
    for (const witness of item.evalWitnesses) if (local.evalWitnesses.length < LIMIT) local.evalWitnesses.push(witness);
    for (const witness of item.ttWitnesses) if (local.ttWitnesses.length < LIMIT) local.ttWitnesses.push(witness);
  }

  const practical = natural.collisions + local.evalEvents + local.ttEvents + workerCollisions;
  let disposition;
  if (semantic.collisions === 0) disposition = spec.gate.decisionMapping.semanticCollisionWitnessesEqualZero;
  else if (practical === 0) disposition = spec.gate.decisionMapping.semanticPositivePracticalZero;
  else disposition = spec.gate.decisionMapping.semanticPositivePracticalPositive;

  return {
    population: {
      seedStart: spec.population.seedStart,
      seedEnd: spec.population.seedEnd,
      seedCount: spec.population.seedCount,
      completedTrajectories: completed,
      terminalTrajectories: terminal,
      maximumObservedPly: maxPly,
      naturalStateObservations: naturalObservations,
      semanticSuccessorObservations: successorObservations,
      semanticUniqueRawStates: semantic.raws.size,
      naturalUniqueRawStates: natural.raws.size,
      localSearchRootsSelected: { namua: selected.namua.length, mtaji: selected.mtaji.length, total: roots.length },
      localSearchRootDigest: h(JSON.stringify(
        roots.map((root) => ({ seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey, rank: root.rank }))
          .sort((a, b) => a.phase.localeCompare(b.phase) || a.rank.localeCompare(b.rank)),
      )),
    },
    measurement: {
      semanticCollisionWitnesses: semantic.collisions,
      naturalReachableCollisionWitnesses: natural.collisions,
      workerStaleIdentityWitnesses: workerCollisions,
      localEvaluationCacheCollisionEvents: local.evalEvents,
      localTranspositionCollisionEvents: local.ttEvents,
      localRootsWithEvaluationCacheCollision: local.rootsEval,
      localRootsWithTranspositionCollision: local.rootsTt,
      localStateObservations: local.stateObservations,
      practicalWitnessCount: practical,
      semanticWitnessExamples: semantic.witnesses,
      naturalWitnessExamples: natural.witnesses,
      workerStaleWitnessExamples: workerWitnesses,
      evaluationCacheWitnessExamples: local.evalWitnesses,
      transpositionWitnessExamples: local.ttWitnesses,
    },
    decision: {
      semanticGatePass: semantic.collisions >= spec.gate.minimumSemanticCollisionWitnesses,
      practicalGatePass: practical >= spec.gate.minimumPracticalWitnesses,
      supportPass: disposition === spec.gate.decisionMapping.semanticPositivePracticalPositive,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function argValue(argv, name, fallback) {
  const at = argv.indexOf(name);
  return at < 0 ? fallback : path.resolve(argv[at + 1]);
}

function main(argv = process.argv.slice(2)) {
  const productionPath = argValue(argv, "--production", DEFAULT_PRODUCTION);
  const outputPath = argValue(argv, "--output", DEFAULT_OUTPUT);
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));
  const { spec, hash: specHash } = loadSpec();
  assert(production.supportSpecId === spec.supportSpecId, "support spec id mismatch");
  assert(production.supportSpecSha256 === specHash, "support spec hash mismatch");
  assert(production.candidateCodeUsed === false, "candidate code was used");
  assert(production.validationSeedsAccessed === false, "validation seed access reported");
  assert(production.releaseHoldoutSeedsAccessed === false, "holdout seed access reported");
  assert(production.researchGeneration3ArtifactsAccessed === false, "G3 artifact access reported");
  const independentCore = recompute(spec);
  const productionCoreText = JSON.stringify(production.core);
  const independentCoreText = JSON.stringify(independentCore);
  const coreMatch = productionCoreText === independentCoreText;
  assert(coreMatch, "independent deterministic core mismatch");
  const expectedCoreHash = h(JSON.stringify({
    supportSpecId: production.supportSpecId,
    supportSpecSha256: production.supportSpecSha256,
    baselineId: production.baselineId,
    sourceSha256: production.sourceSha256,
    core: independentCore,
  }));
  assert(expectedCoreHash === production.deterministicCoreSha256, "deterministic core hash mismatch");
  const verification = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    supportSpecId: spec.supportSpecId,
    supportSpecSha256: specHash,
    productionRunnerImported: false,
    fullDeterministicCoreEquality: coreMatch,
    productionDeterministicCoreSha256: production.deterministicCoreSha256,
    independentDeterministicCoreSha256: expectedCoreHash,
    sourceHashMatch: production.sourceSha256["public/engine.js"] === fileHash("public/engine.js")
      && production.sourceSha256["public/ai.js"] === fileHash("public/ai.js"),
    verifiedDisposition: independentCore.decision.disposition,
    verifiedSupportPass: independentCore.decision.supportPass,
    passed: coreMatch && expectedCoreHash === production.deterministicCoreSha256,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(verification, null, 2)}\n`);
  console.log(JSON.stringify(verification, null, 2));
}

if (require.main === module) main();
