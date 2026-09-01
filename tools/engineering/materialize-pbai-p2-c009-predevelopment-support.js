"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const E = require("../../public/engine.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C009-v1-predevelopment-support-spec.json");
const AI_PATH = path.join(ROOT, "public/ai.js");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c009/predevelopment-support.json");

function sha256(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function ensure(ok, message) { if (!ok) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readSpec() { const text = fs.readFileSync(SPEC_PATH, "utf8"); return { spec: JSON.parse(text), sha256: sha256(text) }; }
function fileSha256(relative) { return sha256(fs.readFileSync(path.join(ROOT, relative), "utf8")); }

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

function canonicalMoveKey(move) {
  if (!move) return "";
  return [
    move.type, move.phase, move.row, move.index, move.direction, move.side,
    move.houseChoice, Boolean(move.houseTwo),
  ].join(":");
}

function rawObject(state) {
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "explicit pending required");
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
function rawKey(state) { return sha256(JSON.stringify(rawObject(state))); }
function sortedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => canonicalMoveKey(a).localeCompare(canonicalMoveKey(b))); }
function desiredPhase(seed) { return seed % 2 === 1 ? "namua" : "mtaji"; }
function sourceRank(spec, phase, seed, ply, state) { return sha256([spec.candidateVersion, phase, seed, ply, rawKey(state)].join("|")); }

function trajectoryRoot(spec, seed) {
  const phase = desiredPhase(seed);
  const random = seededRandom(seed);
  let state = E.initialState();
  let chosen = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const moves = sortedMoves(state);
      if (moves.length >= spec.population.rootSource.minimumLegalMoveCount) {
        const row = { seed, ply, phase, rawKey: rawKey(state), rank: sourceRank(spec, phase, seed, ply, state), state: clone(state) };
        if (!chosen || row.rank < chosen.rank || (row.rank === chosen.rank && row.ply < chosen.ply)) chosen = row;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const moves = sortedMoves(state);
    if (!moves.length) break;
    state = E.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return chosen;
}

function createCollector() {
  return {
    rootPlayer: null,
    occurrences: 0,
    actorInvariantFailures: 0,
    unique: new Map(),
    reset(rootPlayer) {
      this.rootPlayer = rootPlayer;
      this.occurrences = 0;
      this.actorInvariantFailures = 0;
      this.unique = new Map();
    },
    observe(state, player, ply) {
      if (ply !== 3) return;
      if (state.winner !== null) throw new Error("observer reached terminal cutoff after terminal check");
      if (player !== this.rootPlayer) this.actorInvariantFailures += 1;
      if (state.player === player) {
        this.actorInvariantFailures += 1;
        return;
      }
      const moves = E.moveVariants(state);
      if (moves.length !== 1) return;
      this.occurrences += 1;
      const key = rawKey(state);
      if (!this.unique.has(key)) {
        this.unique.set(key, { rawKey: key, moveKey: canonicalMoveKey(moves[0]), phase: state.phase, player: state.player });
      }
    },
  };
}

function loadAi({ observe = null } = {}) {
  const original = fs.readFileSync(AI_PATH, "utf8");
  let source = original;
  if (observe) {
    const needle = [
      "    if (depth === 0) return quiescence(",
      "      state, alpha, beta, player, context.deadline, context.stats,",
      "      context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,",
      "    );",
    ].join("\n");
    const replacement = [
      "    if (depth === 0) {",
      "      if (typeof globalThis.__pbaiC009ObserveCutoff === \"function\") {",
      "        globalThis.__pbaiC009ObserveCutoff(state, player, ply);",
      "      }",
      "      return quiescence(",
      "        state, alpha, beta, player, context.deadline, context.stats,",
      "        context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,",
      "      );",
      "    }",
    ].join("\n");
    ensure(source.includes(needle), "frozen depth-zero search needle missing");
    source = source.replace(needle, replacement);
    ensure(source.indexOf(replacement) === source.lastIndexOf(replacement), "observer transform applied more than once");
  }
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    console,
    performance: { now: () => 0 },
    __pbaiC009ObserveCutoff: observe || undefined,
    require(request) {
      if (request === "./engine.js") return E;
      if (request === "./ai-weights.js") return Weights;
      throw new Error(`Unexpected require from frozen AI source: ${request}`);
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: observe ? "public/ai.js#c009-observer" : "public/ai.js#c009-baseline" });
  return module.exports;
}

function searchOptions(spec) {
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

function eligibleRank(spec, row) {
  return sha256([
    spec.candidateVersion, row.phase, row.seed, row.ply, row.rawKey,
    row.singleReplyCutoffOccurrences, row.uniqueSingleReplyCutoffDigest,
  ].join("|"));
}

function selectEligible(spec, rows) {
  const eligible = rows.filter((row) => row.eligible);
  const byPhase = {
    namua: eligible.filter((row) => row.phase === "namua").sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank)),
    mtaji: eligible.filter((row) => row.phase === "mtaji").sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank)),
  };
  const selected = [...byPhase.namua.slice(0, spec.population.eligibleSelection.targetPerPhase), ...byPhase.mtaji.slice(0, spec.population.eligibleSelection.targetPerPhase)];
  if (selected.length < spec.population.eligibleSelection.targetTotal) {
    const used = new Set(selected.map((row) => `${row.seed}:${row.ply}:${row.rawKey}`));
    const remainder = eligible.filter((row) => !used.has(`${row.seed}:${row.ply}:${row.rawKey}`)).sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
    selected.push(...remainder.slice(0, spec.population.eligibleSelection.targetTotal - selected.length));
  }
  return selected.sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
}

function measure(spec) {
  ensure(fileSha256("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine source mismatch");
  ensure(fileSha256("public/ai.js") === spec.sourceBindings["public/ai.js"], "AI source mismatch");
  ensure(spec.status === "FROZEN-BEFORE-DYNAMIC-SUPPORT-OUTCOME", "support spec not frozen");
  ensure(spec.candidateCodeAllowed === false && spec.publicImplementationChangeAllowed === false, "candidate code prohibited");
  ensure(spec.researchGeneration3Influence === false, "G3 firewall changed");

  const collector = createCollector();
  const baselineAi = loadAi();
  const observedAi = loadAi({ observe: (state, player, ply) => collector.observe(state, player, ply) });
  const options = searchOptions(spec);
  const rows = [];
  let unavailableTrajectoryRoots = 0;
  let technicalFailures = 0;
  let equivalenceMismatches = 0;
  const allUniqueCutoffs = new Set();

  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const root = trajectoryRoot(spec, seed);
    if (!root) { unavailableTrajectoryRoots += 1; continue; }
    let baseline = null;
    let observed = null;
    let error = null;
    try {
      baseline = baselineAi.analyzeMove(root.state, spec.baselineSearch.level, () => 0, options);
      collector.reset(root.state.player);
      observed = observedAi.analyzeMove(root.state, spec.baselineSearch.level, () => 0, options);
    } catch (caught) {
      error = String(caught && caught.message ? caught.message : caught);
    }
    const baselineComplete = !error && baseline?.move && baseline.stats.timedOut === false && baseline.stats.completedDepth === spec.baselineSearch.maxDepth;
    const observedComplete = !error && observed?.move && observed.stats.timedOut === false && observed.stats.completedDepth === spec.baselineSearch.maxDepth;
    const equivalent = baselineComplete && observedComplete && JSON.stringify(baseline) === JSON.stringify(observed);
    if (baselineComplete && observedComplete && !equivalent) equivalenceMismatches += 1;
    const valid = baselineComplete && observedComplete && equivalent && collector.actorInvariantFailures === 0;
    if (!valid) technicalFailures += 1;
    const uniqueRows = [...collector.unique.values()].sort((a, b) => a.rawKey.localeCompare(b.rawKey));
    for (const cutoff of uniqueRows) allUniqueCutoffs.add(cutoff.rawKey);
    const uniqueDigest = sha256(JSON.stringify(uniqueRows));
    const row = {
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      sourceRank: root.rank,
      technicalValid: valid,
      error,
      baselineEquivalent: equivalent,
      completedDepth: baseline?.stats?.completedDepth ?? null,
      selectedMoveKey: baseline?.move ? canonicalMoveKey(baseline.move) : null,
      actorInvariantFailures: collector.actorInvariantFailures,
      singleReplyCutoffOccurrences: valid ? collector.occurrences : 0,
      uniqueSingleReplyCutoffStates: valid ? uniqueRows.length : 0,
      uniqueSingleReplyCutoffDigest: uniqueDigest,
      eligible: valid && collector.occurrences > 0,
    };
    row.eligibleRank = row.eligible ? eligibleRank(spec, row) : null;
    rows.push(row);
  }

  const eligible = rows.filter((row) => row.eligible);
  const selected = selectEligible(spec, rows);
  const totalOccurrences = rows.reduce((sum, row) => sum + row.singleReplyCutoffOccurrences, 0);
  let disposition;
  if (technicalFailures > spec.gate.maximumTechnicalFailures || equivalenceMismatches > spec.gate.maximumBaselineEquivalenceMismatches) {
    disposition = spec.gate.decisionMapping.technicalFailure;
  } else if (eligible.length < spec.gate.minimumEligibleRoots) {
    disposition = spec.gate.decisionMapping.eligibleBelowMinimum;
  } else {
    disposition = spec.gate.decisionMapping.eligibleAtOrAboveMinimum;
  }
  const rootIdentity = (row) => ({ seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey, sourceRank: row.sourceRank });
  const eligibleIdentity = (row) => ({ seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey, singleReplyCutoffOccurrences: row.singleReplyCutoffOccurrences, uniqueSingleReplyCutoffStates: row.uniqueSingleReplyCutoffStates, uniqueSingleReplyCutoffDigest: row.uniqueSingleReplyCutoffDigest, eligibleRank: row.eligibleRank });

  return {
    population: {
      sourceSeeds: spec.population.seedCount,
      trajectoryRootsAvailable: rows.length,
      unavailableTrajectoryRoots,
      sourceNamua: rows.filter((row) => row.phase === "namua").length,
      sourceMtaji: rows.filter((row) => row.phase === "mtaji").length,
      sourceRootDigest: sha256(JSON.stringify(rows.map(rootIdentity))),
      eligibleRoots: eligible.length,
      eligibleNamua: eligible.filter((row) => row.phase === "namua").length,
      eligibleMtaji: eligible.filter((row) => row.phase === "mtaji").length,
      selectedEligibleRoots: selected.length,
      selectedEligibleNamua: selected.filter((row) => row.phase === "namua").length,
      selectedEligibleMtaji: selected.filter((row) => row.phase === "mtaji").length,
      selectedEligibleRootDigest: sha256(JSON.stringify(selected.map(eligibleIdentity))),
    },
    measurement: {
      technicalFailures,
      baselineEquivalenceMismatches: equivalenceMismatches,
      singleReplyCutoffOccurrences: totalOccurrences,
      uniqueSingleReplyCutoffStates: allUniqueCutoffs.size,
    },
    roots: rows,
    selectedEligible: selected.map(eligibleIdentity),
    decision: {
      supportPass: disposition === spec.gate.decisionMapping.eligibleAtOrAboveMinimum,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function parseOutput(argv) { const at = argv.indexOf("--output"); return at < 0 ? DEFAULT_OUTPUT : path.resolve(argv[at + 1]); }
function main(argv = process.argv.slice(2)) {
  const loaded = readSpec();
  const core = measure(loaded.spec);
  const result = {
    schemaVersion: 1,
    program: loaded.spec.program,
    stage: loaded.spec.stage,
    candidateVersion: loaded.spec.candidateVersion,
    supportSpecId: loaded.spec.supportSpecId,
    supportSpecSha256: loaded.sha256,
    baselineId: loaded.spec.baselineId,
    sourceSha256: { "public/engine.js": fileSha256("public/engine.js"), "public/ai.js": fileSha256("public/ai.js") },
    candidateCodeUsed: false,
    candidateImplementationObserved: false,
    singleReplyExtensionExecuted: false,
    candidateBenefitMetricsObserved: false,
    developmentSeedsAccessed: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    c008DevelopmentOutcomeUsedToTuneContract: false,
    researchGeneration3ArtifactsAccessed: false,
    core,
  };
  result.deterministicCoreSha256 = sha256(JSON.stringify({ supportSpecId: result.supportSpecId, supportSpecSha256: result.supportSpecSha256, baselineId: result.baselineId, sourceSha256: result.sourceSha256, core: result.core }));
  const output = parseOutput(argv);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ deterministicCoreSha256: result.deterministicCoreSha256, population: result.core.population, measurement: result.core.measurement, decision: result.core.decision }, null, 2));
}

if (require.main === module) main();
