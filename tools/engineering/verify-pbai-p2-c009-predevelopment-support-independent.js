"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Engine = require("../../public/engine.js");
const WeightConfig = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C009-v1-predevelopment-support-spec.json");
const AI_PATH = path.join(ROOT, "public/ai.js");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/pbai-p2/c009/predevelopment-support.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c009/predevelopment-support-verification.json");

const digest = (value) => crypto.createHash("sha256").update(String(value), "utf8").digest("hex");
const assert = (value, message) => { if (!value) throw new Error(message); };
const copy = (value) => JSON.parse(JSON.stringify(value));
const fileDigest = (relative) => digest(fs.readFileSync(path.join(ROOT, relative), "utf8"));

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x += 0x6D2B79F5;
    let y = x;
    y = Math.imul(y ^ (y >>> 15), y | 1);
    y ^= y + Math.imul(y ^ (y >>> 7), y | 61);
    return ((y ^ (y >>> 14)) >>> 0) / 4294967296;
  };
}

function moveIdentity(move) {
  if (!move) return "";
  return [move.type, move.phase, move.row, move.index, move.direction, move.side, move.houseChoice, Boolean(move.houseTwo)].join(":");
}

function semanticState(state) {
  assert(Array.isArray(state.pending) && state.pending.length === 2, "pending binding missing");
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
function semanticKey(state) { return digest(JSON.stringify(semanticState(state))); }
function legalSorted(state) { return Engine.moveVariants(state).slice().sort((a, b) => moveIdentity(a).localeCompare(moveIdentity(b))); }
function phaseForSeed(seed) { return seed % 2 === 1 ? "namua" : "mtaji"; }
function rootRank(spec, phase, seed, ply, state) { return digest([spec.candidateVersion, phase, seed, ply, semanticKey(state)].join("|")); }

function chooseTrajectoryRoot(spec, seed) {
  const phase = phaseForSeed(seed);
  const random = rng(seed);
  let state = Engine.initialState();
  let best = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const moves = legalSorted(state);
      if (moves.length >= spec.population.rootSource.minimumLegalMoveCount) {
        const candidate = { seed, ply, phase, rawKey: semanticKey(state), rank: rootRank(spec, phase, seed, ply, state), state: copy(state) };
        if (!best || candidate.rank < best.rank || (candidate.rank === best.rank && candidate.ply < best.ply)) best = candidate;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const moves = legalSorted(state);
    if (!moves.length) break;
    state = Engine.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return best;
}

function observerState() {
  return {
    rootPlayer: null,
    occurrences: 0,
    actorInvariantFailures: 0,
    uniqueRows: new Map(),
    clear(rootPlayer) {
      this.rootPlayer = rootPlayer;
      this.occurrences = 0;
      this.actorInvariantFailures = 0;
      this.uniqueRows = new Map();
    },
    record(state, rootPlayerArgument, ply) {
      if (ply !== 3) return;
      if (state.winner !== null) throw new Error("terminal state reached C009 observer");
      if (rootPlayerArgument !== this.rootPlayer) this.actorInvariantFailures += 1;
      if (state.player === rootPlayerArgument) {
        this.actorInvariantFailures += 1;
        return;
      }
      const legal = Engine.moveVariants(state);
      if (legal.length !== 1) return;
      this.occurrences += 1;
      const key = semanticKey(state);
      if (!this.uniqueRows.has(key)) this.uniqueRows.set(key, { rawKey: key, moveKey: moveIdentity(legal[0]), phase: state.phase, player: state.player });
    },
  };
}

function instantiateAi(observer) {
  const frozen = fs.readFileSync(AI_PATH, "utf8");
  let executable = frozen;
  if (observer) {
    const before = "    if (depth === 0) return quiescence(\n      state, alpha, beta, player, context.deadline, context.stats,\n      context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,\n    );";
    const after = "    if (depth === 0) {\n      if (typeof globalThis.__c009IndependentObserver === \"function\") globalThis.__c009IndependentObserver(state, player, ply);\n      return quiescence(\n        state, alpha, beta, player, context.deadline, context.stats,\n        context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,\n      );\n    }";
    assert(executable.includes(before), "baseline depth-zero block missing");
    executable = executable.replace(before, after);
    assert(executable.indexOf(after) === executable.lastIndexOf(after), "independent observer transform multiplicity failure");
  }
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    console,
    performance: { now: () => 0 },
    __c009IndependentObserver: observer || undefined,
    require(request) {
      if (request === "./engine.js") return Engine;
      if (request === "./ai-weights.js") return WeightConfig;
      throw new Error(`unexpected frozen AI require: ${request}`);
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(executable, sandbox, { filename: observer ? "public/ai.js#c009-independent-observed" : "public/ai.js#c009-independent-baseline" });
  return module.exports;
}

function options(spec) {
  return {
    searchProfile: spec.baselineSearch.searchProfile,
    evaluationProfile: spec.baselineSearch.evaluationProfile,
    maxDepth: spec.baselineSearch.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: spec.baselineSearch.quiescenceDepth,
    maxTableEntries: spec.baselineSearch.maxTableEntries,
    ttMoveFirst: spec.baselineSearch.ttMoveFirst,
    orderQuiescenceCaptures: spec.baselineSearch.orderQuiescenceCaptures,
    normalizeTtMateScores: spec.baselineSearch.normalizeTtMateScores,
    evaluationCache: spec.baselineSearch.evaluationCache,
    maxEvaluationCacheEntries: spec.baselineSearch.maxEvaluationCacheEntries,
    stableBestDepths: spec.baselineSearch.stableBestDepths,
    aspirationWindow: spec.baselineSearch.aspirationWindow,
  };
}

function supportRank(spec, row) {
  return digest([spec.candidateVersion, row.phase, row.seed, row.ply, row.rawKey, row.singleReplyCutoffOccurrences, row.uniqueSingleReplyCutoffDigest].join("|"));
}

function chooseSelected(spec, rows) {
  const eligible = rows.filter((row) => row.eligible);
  const namua = eligible.filter((row) => row.phase === "namua").sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
  const mtaji = eligible.filter((row) => row.phase === "mtaji").sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
  const chosen = [...namua.slice(0, spec.population.eligibleSelection.targetPerPhase), ...mtaji.slice(0, spec.population.eligibleSelection.targetPerPhase)];
  if (chosen.length < spec.population.eligibleSelection.targetTotal) {
    const used = new Set(chosen.map((row) => `${row.seed}:${row.ply}:${row.rawKey}`));
    const rest = eligible.filter((row) => !used.has(`${row.seed}:${row.ply}:${row.rawKey}`)).sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
    chosen.push(...rest.slice(0, spec.population.eligibleSelection.targetTotal - chosen.length));
  }
  return chosen.sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
}

function reconstruct(spec) {
  const obs = observerState();
  const baselineAi = instantiateAi(null);
  const observedAi = instantiateAi((state, player, ply) => obs.record(state, player, ply));
  const searchOptions = options(spec);
  const rows = [];
  let unavailable = 0;
  let technicalFailures = 0;
  let equivalenceMismatches = 0;
  const globalUnique = new Set();

  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const root = chooseTrajectoryRoot(spec, seed);
    if (!root) { unavailable += 1; continue; }
    let baseResult = null;
    let observedResult = null;
    let error = null;
    try {
      baseResult = baselineAi.analyzeMove(root.state, spec.baselineSearch.level, () => 0, searchOptions);
      obs.clear(root.state.player);
      observedResult = observedAi.analyzeMove(root.state, spec.baselineSearch.level, () => 0, searchOptions);
    } catch (caught) {
      error = String(caught && caught.message ? caught.message : caught);
    }
    const baseComplete = !error && baseResult?.move && baseResult.stats.timedOut === false && baseResult.stats.completedDepth === spec.baselineSearch.maxDepth;
    const observedComplete = !error && observedResult?.move && observedResult.stats.timedOut === false && observedResult.stats.completedDepth === spec.baselineSearch.maxDepth;
    const equivalent = baseComplete && observedComplete && JSON.stringify(baseResult) === JSON.stringify(observedResult);
    if (baseComplete && observedComplete && !equivalent) equivalenceMismatches += 1;
    const valid = baseComplete && observedComplete && equivalent && obs.actorInvariantFailures === 0;
    if (!valid) technicalFailures += 1;
    const unique = [...obs.uniqueRows.values()].sort((a, b) => a.rawKey.localeCompare(b.rawKey));
    unique.forEach((item) => globalUnique.add(item.rawKey));
    const uniqueDigest = digest(JSON.stringify(unique));
    const row = {
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      sourceRank: root.rank,
      technicalValid: valid,
      error,
      baselineEquivalent: equivalent,
      completedDepth: baseResult?.stats?.completedDepth ?? null,
      selectedMoveKey: baseResult?.move ? moveIdentity(baseResult.move) : null,
      actorInvariantFailures: obs.actorInvariantFailures,
      singleReplyCutoffOccurrences: valid ? obs.occurrences : 0,
      uniqueSingleReplyCutoffStates: valid ? unique.length : 0,
      uniqueSingleReplyCutoffDigest: uniqueDigest,
      eligible: valid && obs.occurrences > 0,
    };
    row.eligibleRank = row.eligible ? supportRank(spec, row) : null;
    rows.push(row);
  }

  const eligible = rows.filter((row) => row.eligible);
  const selected = chooseSelected(spec, rows);
  let disposition;
  if (technicalFailures > spec.gate.maximumTechnicalFailures || equivalenceMismatches > spec.gate.maximumBaselineEquivalenceMismatches) disposition = spec.gate.decisionMapping.technicalFailure;
  else if (eligible.length < spec.gate.minimumEligibleRoots) disposition = spec.gate.decisionMapping.eligibleBelowMinimum;
  else disposition = spec.gate.decisionMapping.eligibleAtOrAboveMinimum;

  const rootIdentity = (row) => ({ seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey, sourceRank: row.sourceRank });
  const selectedIdentity = (row) => ({ seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey, singleReplyCutoffOccurrences: row.singleReplyCutoffOccurrences, uniqueSingleReplyCutoffStates: row.uniqueSingleReplyCutoffStates, uniqueSingleReplyCutoffDigest: row.uniqueSingleReplyCutoffDigest, eligibleRank: row.eligibleRank });
  return {
    population: {
      sourceSeeds: spec.population.seedCount,
      trajectoryRootsAvailable: rows.length,
      unavailableTrajectoryRoots: unavailable,
      sourceNamua: rows.filter((row) => row.phase === "namua").length,
      sourceMtaji: rows.filter((row) => row.phase === "mtaji").length,
      sourceRootDigest: digest(JSON.stringify(rows.map(rootIdentity))),
      eligibleRoots: eligible.length,
      eligibleNamua: eligible.filter((row) => row.phase === "namua").length,
      eligibleMtaji: eligible.filter((row) => row.phase === "mtaji").length,
      selectedEligibleRoots: selected.length,
      selectedEligibleNamua: selected.filter((row) => row.phase === "namua").length,
      selectedEligibleMtaji: selected.filter((row) => row.phase === "mtaji").length,
      selectedEligibleRootDigest: digest(JSON.stringify(selected.map(selectedIdentity))),
    },
    measurement: {
      technicalFailures,
      baselineEquivalenceMismatches: equivalenceMismatches,
      singleReplyCutoffOccurrences: rows.reduce((sum, row) => sum + row.singleReplyCutoffOccurrences, 0),
      uniqueSingleReplyCutoffStates: globalUnique.size,
    },
    roots: rows,
    selectedEligible: selected.map(selectedIdentity),
    decision: {
      supportPass: disposition === spec.gate.decisionMapping.eligibleAtOrAboveMinimum,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function argPath(argv, flag, fallback) { const index = argv.indexOf(flag); return index < 0 ? fallback : path.resolve(argv[index + 1]); }
function main(argv = process.argv.slice(2)) {
  const productionPath = argPath(argv, "--production", DEFAULT_PRODUCTION);
  const outputPath = argPath(argv, "--output", DEFAULT_OUTPUT);
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));
  assert(fileDigest("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine hash mismatch");
  assert(fileDigest("public/ai.js") === spec.sourceBindings["public/ai.js"], "AI hash mismatch");
  assert(production.candidateCodeUsed === false && production.singleReplyExtensionExecuted === false, "candidate execution leaked into production support");
  const core = reconstruct(spec);
  const expectedCoreHash = digest(JSON.stringify({ supportSpecId: production.supportSpecId, supportSpecSha256: production.supportSpecSha256, baselineId: production.baselineId, sourceSha256: production.sourceSha256, core }));
  const fullRowsEquality = JSON.stringify(core.roots) === JSON.stringify(production.core.roots);
  const selectedEquality = JSON.stringify(core.selectedEligible) === JSON.stringify(production.core.selectedEligible);
  const aggregateEquality = JSON.stringify({ population: core.population, measurement: core.measurement, decision: core.decision }) === JSON.stringify({ population: production.core.population, measurement: production.core.measurement, decision: production.core.decision });
  const coreEquality = expectedCoreHash === production.deterministicCoreSha256;
  const result = {
    schemaVersion: 1,
    program: "PBAI-P2",
    stage: "PBAI-P2-D-PREDEVELOPMENT-SUPPORT-INDEPENDENT-VERIFICATION",
    candidateVersion: "PBAI-C009-v1",
    productionRunnerImported: false,
    productionSelectedRootsTrustedWithoutReconstruction: false,
    fullSourceAndPerRootRowsEquality: fullRowsEquality,
    selectedEligibleRowsEquality: selectedEquality,
    aggregateDecisionEquality: aggregateEquality,
    productionDeterministicCoreSha256: production.deterministicCoreSha256,
    independentDeterministicCoreSha256: expectedCoreHash,
    deterministicCoreEquality: coreEquality,
    verifiedDisposition: core.decision.disposition,
    passed: fullRowsEquality && selectedEquality && aggregateEquality && coreEquality,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}

if (require.main === module) main();
