"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C006-v1-predevelopment-support-spec.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c006/predevelopment-support.json");
const MAX_WITNESSES = 20;

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function fileSha256(relative) {
  return sha256(fs.readFileSync(path.join(ROOT, relative), "utf8"));
}

function readSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  return { spec: JSON.parse(text), sha256: sha256(text) };
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function rawIdentity(state) {
  ensure(state && typeof state === "object", "state must be an object");
  ensure(Array.isArray(state.pits) && state.pits.length === 2, "pits player shape");
  for (const playerRows of state.pits) {
    ensure(Array.isArray(playerRows) && playerRows.length === 2, "pits row shape");
    for (const row of playerRows) {
      ensure(Array.isArray(row) && row.length === 8, "pits width");
      for (const value of row) ensure(Number.isInteger(value) && value >= 0, "pit value");
    }
  }
  ensure(Array.isArray(state.reserve) && state.reserve.length === 2, "reserve shape");
  ensure(state.reserve.every((value) => Number.isInteger(value) && value >= 0), "reserve value");
  ensure(Array.isArray(state.houseOwned) && state.houseOwned.length === 2, "houseOwned shape");
  ensure(state.houseOwned.every((value) => typeof value === "boolean"), "houseOwned value");
  ensure(state.player === 0 || state.player === 1, "player value");
  ensure(state.phase === "namua" || state.phase === "mtaji", "phase value");
  ensure(state.winner === null || state.winner === 0 || state.winner === 1, "winner value");
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "pending must be explicit");
  ensure(state.pending.every((value) => Number.isInteger(value) && value >= 0), "pending value");
  let represented = state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
  for (const playerRows of state.pits) for (const row of playerRows) for (const value of row) represented += value;
  ensure(represented === 64, `represented seed total must be 64, got ${represented}`);
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}

function rawKey(state) {
  return sha256(JSON.stringify(rawIdentity(state)));
}

function sortedMoves(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function stateRef(state, seed, ply, source, extra = {}) {
  return {
    seed,
    ply,
    source,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
    rawKey: rawKey(state),
    aiKeySha256: sha256(AI.stateKey(state)),
    ...extra,
  };
}

class CollisionTracker {
  constructor() {
    this.byAiKey = new Map();
    this.collisionCount = 0;
    this.witnesses = [];
    this.observations = 0;
    this.uniqueRaw = new Set();
  }

  add(state, ref) {
    const raw = rawKey(state);
    const ai = AI.stateKey(state);
    this.observations += 1;
    this.uniqueRaw.add(raw);
    const previous = this.byAiKey.get(ai);
    if (!previous) {
      this.byAiKey.set(ai, { rawKey: raw, ref });
      return false;
    }
    if (previous.rawKey === raw) return false;
    this.collisionCount += 1;
    if (this.witnesses.length < MAX_WITNESSES) {
      this.witnesses.push({ aiKeySha256: sha256(ai), first: previous.ref, second: ref });
    }
    return true;
  }
}

function rankRoot(candidateVersion, state, seed, ply) {
  return sha256([candidateVersion, state.phase, seed, ply, rawKey(state)].join("|"));
}

function insertSelected(selected, candidate, target) {
  selected.push(candidate);
  selected.sort((a, b) => a.rank.localeCompare(b.rank) || a.seed - b.seed || a.ply - b.ply);
  if (selected.length > target) selected.pop();
}

function localKeyDomainMeasurement(root, maximumDepth) {
  const evalKeys = new Map();
  const ttKeys = new Map();
  let evalCollisionCount = 0;
  let ttCollisionCount = 0;
  let stateObservations = 0;
  const evalWitnesses = [];
  const ttWitnesses = [];

  function inspect(state, relativePly) {
    const raw = rawKey(state);
    const ai = AI.stateKey(state);
    stateObservations += 1;
    const ref = stateRef(state, root.seed, root.ply, "local-search", { relativePly });

    const evalPrevious = evalKeys.get(ai);
    if (!evalPrevious) evalKeys.set(ai, { rawKey: raw, ref });
    else if (evalPrevious.rawKey !== raw) {
      evalCollisionCount += 1;
      if (evalWitnesses.length < MAX_WITNESSES) {
        evalWitnesses.push({ aiKeySha256: sha256(ai), first: evalPrevious.ref, second: ref });
      }
    }

    const tt = `${ai}@${relativePly}`;
    const ttPrevious = ttKeys.get(tt);
    if (!ttPrevious) ttKeys.set(tt, { rawKey: raw, ref });
    else if (ttPrevious.rawKey !== raw) {
      ttCollisionCount += 1;
      if (ttWitnesses.length < MAX_WITNESSES) {
        ttWitnesses.push({ ttKeySha256: sha256(tt), first: ttPrevious.ref, second: ref });
      }
    }

    if (relativePly >= maximumDepth || state.winner !== null) return;
    for (const move of sortedMoves(state)) {
      const next = E.applyMove(state, move).state;
      rawIdentity(next);
      inspect(next, relativePly + 1);
    }
  }

  inspect(root.state, 0);
  return { stateObservations, evalCollisionCount, ttCollisionCount, evalWitnesses, ttWitnesses };
}

function runMeasurement(spec) {
  ensure(spec.candidateCodeAllowed === false, "candidate code must remain prohibited");
  ensure(spec.publicImplementationChangeAllowed === false, "public implementation change must remain prohibited");
  ensure(fileSha256("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine source hash mismatch");
  ensure(fileSha256("public/ai.js") === spec.sourceBindings["public/ai.js"], "AI source hash mismatch");
  ensure(spec.population.seedEnd - spec.population.seedStart + 1 === spec.population.seedCount, "seed count mismatch");

  const semantic = new CollisionTracker();
  const natural = new CollisionTracker();
  const selectedByPhase = { namua: [], mtaji: [] };
  let naturalStateObservations = 0;
  let semanticSuccessorObservations = 0;
  let completedTrajectories = 0;
  let terminalTrajectories = 0;
  let maximumObservedPly = 0;
  let workerStaleCollisionCount = 0;
  const workerStaleWitnesses = [];

  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const random = seededRandom(seed);
    let state = E.initialState();
    const perTrajectory = new Map();
    let ply = 0;
    while (ply <= spec.population.maximumGamePlies) {
      rawIdentity(state);
      maximumObservedPly = Math.max(maximumObservedPly, ply);
      naturalStateObservations += 1;
      const naturalRef = stateRef(state, seed, ply, "natural");
      natural.add(state, naturalRef);
      semantic.add(state, naturalRef);

      const ai = AI.stateKey(state);
      const raw = rawKey(state);
      const previousTrajectory = perTrajectory.get(ai);
      if (!previousTrajectory) perTrajectory.set(ai, { rawKey: raw, ref: naturalRef });
      else if (previousTrajectory.rawKey !== raw) {
        workerStaleCollisionCount += 1;
        if (workerStaleWitnesses.length < MAX_WITNESSES) {
          workerStaleWitnesses.push({ aiKeySha256: sha256(ai), first: previousTrajectory.ref, second: naturalRef });
        }
      }

      if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
      const moves = sortedMoves(state);
      if (!moves.length) break;

      if (moves.length >= spec.population.localSearchRootSelection.minimumLegalMoveCount) {
        const candidate = {
          rank: rankRoot(spec.candidateVersion, state, seed, ply),
          seed,
          ply,
          phase: state.phase,
          rawKey: raw,
          state: E.clone(state),
        };
        insertSelected(
          selectedByPhase[state.phase], candidate,
          spec.population.localSearchRootSelection.targetPerPhase,
        );
      }

      const successors = [];
      for (const move of moves) {
        const next = E.applyMove(state, move).state;
        rawIdentity(next);
        semanticSuccessorObservations += 1;
        semantic.add(next, stateRef(next, seed, ply + 1, "one-move-successor", { moveKey: AI.moveKey(move) }));
        successors.push(next);
      }
      state = successors[Math.floor(random() * successors.length)];
      ply += 1;
    }
    completedTrajectories += 1;
    if (state.winner !== null) terminalTrajectories += 1;
  }

  const local = {
    rootsMeasured: 0,
    rootsByPhase: { namua: selectedByPhase.namua.length, mtaji: selectedByPhase.mtaji.length },
    stateObservations: 0,
    evaluationCacheCollisionEvents: 0,
    transpositionCollisionEvents: 0,
    rootsWithEvaluationCacheCollision: 0,
    rootsWithTranspositionCollision: 0,
    evaluationCacheWitnesses: [],
    transpositionWitnesses: [],
  };
  for (const root of [...selectedByPhase.namua, ...selectedByPhase.mtaji]) {
    const measured = localKeyDomainMeasurement(root, spec.population.localSearchRootSelection.maximumLocalDepthPlies);
    local.rootsMeasured += 1;
    local.stateObservations += measured.stateObservations;
    local.evaluationCacheCollisionEvents += measured.evalCollisionCount;
    local.transpositionCollisionEvents += measured.ttCollisionCount;
    if (measured.evalCollisionCount > 0) local.rootsWithEvaluationCacheCollision += 1;
    if (measured.ttCollisionCount > 0) local.rootsWithTranspositionCollision += 1;
    for (const witness of measured.evalWitnesses) {
      if (local.evaluationCacheWitnesses.length < MAX_WITNESSES) local.evaluationCacheWitnesses.push(witness);
    }
    for (const witness of measured.ttWitnesses) {
      if (local.transpositionWitnesses.length < MAX_WITNESSES) local.transpositionWitnesses.push(witness);
    }
  }

  const semanticWitnessCount = semantic.collisionCount;
  const practicalWitnessCount = natural.collisionCount
    + local.evaluationCacheCollisionEvents
    + local.transpositionCollisionEvents
    + workerStaleCollisionCount;
  let disposition;
  if (semanticWitnessCount === 0) disposition = spec.gate.decisionMapping.semanticCollisionWitnessesEqualZero;
  else if (practicalWitnessCount === 0) disposition = spec.gate.decisionMapping.semanticPositivePracticalZero;
  else disposition = spec.gate.decisionMapping.semanticPositivePracticalPositive;

  return {
    population: {
      seedStart: spec.population.seedStart,
      seedEnd: spec.population.seedEnd,
      seedCount: spec.population.seedCount,
      completedTrajectories,
      terminalTrajectories,
      maximumObservedPly,
      naturalStateObservations,
      semanticSuccessorObservations,
      semanticUniqueRawStates: semantic.uniqueRaw.size,
      naturalUniqueRawStates: natural.uniqueRaw.size,
      localSearchRootsSelected: {
        namua: selectedByPhase.namua.length,
        mtaji: selectedByPhase.mtaji.length,
        total: selectedByPhase.namua.length + selectedByPhase.mtaji.length,
      },
      localSearchRootDigest: sha256(JSON.stringify(
        [...selectedByPhase.namua, ...selectedByPhase.mtaji]
          .map((root) => ({ seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey, rank: root.rank }))
          .sort((a, b) => a.phase.localeCompare(b.phase) || a.rank.localeCompare(b.rank)),
      )),
    },
    measurement: {
      semanticCollisionWitnesses: semanticWitnessCount,
      naturalReachableCollisionWitnesses: natural.collisionCount,
      workerStaleIdentityWitnesses: workerStaleCollisionCount,
      localEvaluationCacheCollisionEvents: local.evaluationCacheCollisionEvents,
      localTranspositionCollisionEvents: local.transpositionCollisionEvents,
      localRootsWithEvaluationCacheCollision: local.rootsWithEvaluationCacheCollision,
      localRootsWithTranspositionCollision: local.rootsWithTranspositionCollision,
      localStateObservations: local.stateObservations,
      practicalWitnessCount,
      semanticWitnessExamples: semantic.witnesses,
      naturalWitnessExamples: natural.witnesses,
      workerStaleWitnessExamples: workerStaleWitnesses,
      evaluationCacheWitnessExamples: local.evaluationCacheWitnesses,
      transpositionWitnessExamples: local.transpositionWitnesses,
    },
    decision: {
      semanticGatePass: semanticWitnessCount >= spec.gate.minimumSemanticCollisionWitnesses,
      practicalGatePass: practicalWitnessCount >= spec.gate.minimumPracticalWitnesses,
      supportPass: disposition === spec.gate.decisionMapping.semanticPositivePracticalPositive,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function parseOutput(argv) {
  const at = argv.indexOf("--output");
  if (at === -1) return DEFAULT_OUTPUT;
  ensure(argv[at + 1], "--output requires a path");
  return path.resolve(argv[at + 1]);
}

function main(argv = process.argv.slice(2)) {
  const { spec, sha256: specSha256 } = readSpec();
  const core = runMeasurement(spec);
  const result = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    supportSpecId: spec.supportSpecId,
    supportSpecSha256: specSha256,
    baselineId: spec.baselineId,
    sourceSha256: {
      "public/engine.js": fileSha256("public/engine.js"),
      "public/ai.js": fileSha256("public/ai.js"),
    },
    candidateCodeUsed: false,
    candidateImplementationObserved: false,
    publicCodeChangedByInstrument: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    researchGeneration3ArtifactsAccessed: false,
    core,
  };
  result.deterministicCoreSha256 = sha256(JSON.stringify({
    supportSpecId: result.supportSpecId,
    supportSpecSha256: result.supportSpecSha256,
    baselineId: result.baselineId,
    sourceSha256: result.sourceSha256,
    core: result.core,
  }));
  const output = parseOutput(argv);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({
    supportSpecId: result.supportSpecId,
    deterministicCoreSha256: result.deterministicCoreSha256,
    population: result.core.population,
    measurement: {
      semanticCollisionWitnesses: result.core.measurement.semanticCollisionWitnesses,
      naturalReachableCollisionWitnesses: result.core.measurement.naturalReachableCollisionWitnesses,
      workerStaleIdentityWitnesses: result.core.measurement.workerStaleIdentityWitnesses,
      localEvaluationCacheCollisionEvents: result.core.measurement.localEvaluationCacheCollisionEvents,
      localTranspositionCollisionEvents: result.core.measurement.localTranspositionCollisionEvents,
      practicalWitnessCount: result.core.measurement.practicalWitnessCount,
    },
    decision: result.core.decision,
  }, null, 2));
}

if (require.main === module) main();

module.exports = { rawIdentity, rawKey, seededRandom };
