#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { performance } = require("node:perf_hooks");

const E = require("../../public/engine.js");
const CandidateAI = require("../../public/ai.js");
const Weights = require("../../public/ai-weights.js");
const Population = require("./lib/pbai-p1-decision-population.js");

const ROOT = path.resolve(__dirname, "../..");
const BASELINE_COMMIT = "f4ae3b11901180cbe417b3e643e2b357d8045d2d";
const BASELINE_ID = "AI-GEN2-BASELINE-2026-08-26-v1";
const GATE_SPEC_ID = "PBAI-C-GLOBAL-GATES-2026-08-26-v1";
const CANDIDATE = "PBAI-C002-v1";
const DEV_START = 31300001;
const DEV_END = 31300512;
const MAX_PLIES = 160;
const TARGET_MINIMUM = 48;
const CONTROL_MINIMUM = 32;
const TARGET_MAXIMUM = 64;
const DEPTH = 4;
const QUIESCENCE_DEPTH = 1;
const WIN = 1_000_000;

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function parseArgs(argv) {
  const options = { phase: "materialize", output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--phase") options.phase = argv[++index];
    else if (arg === "--output") options.output = argv[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!["materialize", "evaluate"].includes(options.phase)) {
    throw new Error(`Invalid --phase: ${options.phase}`);
  }
  return options;
}

function populationIdentity(population, selected) {
  const projection = {
    population: population.roots.map((root) => ({
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      populationRankHash: root.populationRankHash,
    })),
    targets: selected.targets.map((root) => root.rawKey),
    controls: {
      namua: selected.controls.namua.map((root) => root.rawKey),
      mtajiReusableAtLeast3: selected.controls.mtajiReusableAtLeast3.map((root) => root.rawKey),
    },
  };
  return sha256Text(JSON.stringify(projection));
}

function materialize() {
  const population = Population.materializeSplit({
    split: "development",
    start: DEV_START,
    end: DEV_END,
    maximumPlies: MAX_PLIES,
  });
  const selected = Population.selectC002DevelopmentSets(population);
  return { population, selected, populationDigest: populationIdentity(population, selected) };
}

function materializationReport(materialized) {
  const { population, selected, populationDigest } = materialized;
  const targetEstimable = selected.support.selectedTargets >= TARGET_MINIMUM;
  const controlsEstimable = selected.support.namuaControls >= CONTROL_MINIMUM
    && selected.support.mtajiReusableAtLeast3Controls >= CONTROL_MINIMUM;
  return {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-E-DEVELOPMENT-MATERIALIZATION",
    candidate: CANDIDATE,
    baselineId: BASELINE_ID,
    gateSpecId: GATE_SPEC_ID,
    materializationId: Population.MATERIALIZATION_ID,
    sourceSeedBlock: { start: DEV_START, end: DEV_END },
    candidateMetricsObserved: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    populationDigest,
    populationSupport: population.support,
    trajectoryCandidates: population.trajectoryCandidates,
    c002Support: selected.support,
    required: {
      targets: { maximum: TARGET_MAXIMUM, minimumEstimable: TARGET_MINIMUM },
      negativeControlPerClass: CONTROL_MINIMUM,
    },
    estimability: {
      target: targetEstimable,
      controls: controlsEstimable,
      development: targetEstimable && controlsEstimable,
      failureAction: "NON-ESTIMABLE/HOLD; no source-block or selector replacement",
    },
    selectedRootRefs: {
      targets: selected.targets.map(({ seed, ply, rawKey }) => ({ seed, ply, rawKey })),
      namuaControls: selected.controls.namua.map(({ seed, ply, rawKey }) => ({ seed, ply, rawKey })),
      mtajiReusableAtLeast3Controls: selected.controls.mtajiReusableAtLeast3
        .map(({ seed, ply, rawKey }) => ({ seed, ply, rawKey })),
    },
  };
}

function loadBaselineAI() {
  const source = childProcess.execFileSync(
    "git", ["show", `${BASELINE_COMMIT}:public/ai.js`],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  const context = vm.createContext({
    BaoEngine: E,
    BaoAIWeights: Weights,
    performance,
    console,
  });
  vm.runInContext(source, context, { filename: `${BASELINE_COMMIT}:public/ai.js` });
  if (!context.BaoAI) throw new Error("Unable to load frozen baseline AI");
  return { ai: context.BaoAI, sourceSha256: sha256Text(source) };
}

function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}

function captureCount(events) {
  return events.filter((event) => event.kind === "capture")
    .reduce((total, event) => total + event.count, 0);
}

function referenceQuiescence(state, alpha, beta, player, evaluator, ply, remaining) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter((move) => move.type === "capture");
  if (!captures.length || remaining === 0) return evaluator(state, player);
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of captures) {
    const next = E.applyMove(state, move).state;
    const value = referenceQuiescence(
      next, alpha, beta, player, evaluator, ply + 1, remaining - 1,
    );
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function referenceSearch(state, depth, alpha, beta, player, evaluator, ply) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) {
    return referenceQuiescence(
      state, alpha, beta, player, evaluator, ply, QUIESCENCE_DEPTH,
    );
  }
  const moves = E.moveVariants(state);
  if (!moves.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of moves) {
    const next = E.applyMove(state, move).state;
    const value = referenceSearch(next, depth - 1, alpha, beta, player, evaluator, ply + 1);
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function exactReference(state, baselineAI) {
  const player = state.player;
  const evaluator = (current, perspective) => baselineAI.evaluateWithProfile(current, perspective, "bao");
  const candidates = E.moveVariants(state).map((move) => {
    const applied = E.applyMove(state, move);
    const score = referenceSearch(
      applied.state, DEPTH - 1, -Infinity, Infinity, player, evaluator, 1,
    );
    return { moveKey: baselineAI.moveKey(move), score };
  });
  candidates.sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = candidates[0].score;
  const topSet = candidates.filter((candidate) => candidate.score === bestScore)
    .map((candidate) => candidate.moveKey).sort();
  return { bestScore, topSet, candidates };
}

const COUNTERS = [
  "nodes", "quiescenceNodes", "cutoffs", "cacheHits", "cacheStores",
  "historyUpdates", "aspirationResearches", "evaluationRequests", "evaluations",
  "evaluationCacheHits", "evaluationCacheStores", "evaluationCachePeak",
  "evaluationCacheEvictions", "completedDepth", "rootScore", "timedOut",
  "earlyStopped", "stableIterations", "rootBestChanges", "simulations",
  "playoutTurns", "maxPlayoutTurns",
];

function fixedRun(ai, state, feature) {
  return ai.analyzeMove(state, "hard", () => 0.5, {
    timeLimitMs: Infinity,
    maxDepth: DEPTH,
    evaluationProfile: "bao",
    quiescenceDepth: QUIESCENCE_DEPTH,
    pbaiC002C03Ordering: feature,
  });
}

function compareFrozenBaseline(baselineAI, off) {
  return Object.fromEntries(COUNTERS.map((key) => [key, baselineAI.stats[key] === off.stats[key]]));
}

function allTrue(record) {
  return Object.values(record).every(Boolean);
}

function targetMeasurement(root, baselineAI) {
  const frozen = fixedRun(baselineAI, root.state, false);
  const off = fixedRun(CandidateAI, root.state, false);
  const on = fixedRun(CandidateAI, root.state, true);
  const reference = exactReference(root.state, baselineAI);
  const frozenMove = baselineAI.moveKey(frozen.move);
  const offMove = CandidateAI.moveKey(off.move);
  const onMove = CandidateAI.moveKey(on.move);
  const baselineCounterEquality = compareFrozenBaseline(frozen, off);
  return {
    seed: root.seed,
    ply: root.ply,
    rawKey: root.rawKey,
    reusablePits: Population.reusablePits(root.state),
    legalMoveCount: E.moveVariants(root.state).length,
    frozenMove,
    offMove,
    onMove,
    referenceBestScore: reference.bestScore,
    referenceTopSet: reference.topSet,
    frozenRootScore: frozen.stats.rootScore,
    offRootScore: off.stats.rootScore,
    onRootScore: on.stats.rootScore,
    offNodes: off.stats.nodes,
    onNodes: on.stats.nodes,
    nodeRatio: on.stats.nodes / off.stats.nodes,
    frozenOffMoveEqual: frozenMove === offMove,
    frozenOffRootScoreEqual: frozen.stats.rootScore === off.stats.rootScore,
    frozenOffCountersEqual: allTrue(baselineCounterEquality),
    baselineCounterEquality,
    onRootScoreMatchesReference: on.stats.rootScore === reference.bestScore,
    onMoveInReferenceTopSet: reference.topSet.includes(onMove),
    triggerStates: on.stats.pbaiC002TriggerStates,
    prioritizedMoves: on.stats.pbaiC002PrioritizedMoves,
  };
}

function controlMeasurement(root, baselineAI, controlClass) {
  const frozen = fixedRun(baselineAI, root.state, false);
  const off = fixedRun(CandidateAI, root.state, false);
  const on = fixedRun(CandidateAI, root.state, true);
  const onOffCounterEquality = Object.fromEntries(COUNTERS.map(
    (key) => [key, on.stats[key] === off.stats[key]],
  ));
  const frozenOffCounterEquality = compareFrozenBaseline(frozen, off);
  return {
    controlClass,
    seed: root.seed,
    ply: root.ply,
    rawKey: root.rawKey,
    phase: root.phase,
    reusablePits: Population.reusablePits(root.state),
    triggerStates: on.stats.pbaiC002TriggerStates,
    prioritizedMoves: on.stats.pbaiC002PrioritizedMoves,
    onOffMoveEqual: CandidateAI.moveKey(on.move) === CandidateAI.moveKey(off.move),
    onOffCountersEqual: allTrue(onOffCounterEquality),
    onOffCounterEquality,
    frozenOffMoveEqual: baselineAI.moveKey(frozen.move) === CandidateAI.moveKey(off.move),
    frozenOffCountersEqual: allTrue(frozenOffCounterEquality),
    frozenOffCounterEquality,
  };
}

function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function evaluationReport(materialized) {
  const supportReport = materializationReport(materialized);
  if (!supportReport.estimability.development) {
    return {
      ...supportReport,
      phase: "PBAI-E-DEVELOPMENT-EVALUATION",
      candidateMetricsObserved: false,
      decision: "NON-ESTIMABLE-HOLD",
      reason: "Frozen development population does not meet target/control minimum support",
    };
  }

  const loaded = loadBaselineAI();
  assert.equal(
    loaded.sourceSha256,
    "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e",
    "Frozen baseline ai.js source SHA-256 mismatch",
  );
  const { selected } = materialized;
  const targets = selected.targets.map((root) => targetMeasurement(root, loaded.ai));
  const controls = [
    ...selected.controls.namua.map((root) => controlMeasurement(root, loaded.ai, "namua")),
    ...selected.controls.mtajiReusableAtLeast3.map(
      (root) => controlMeasurement(root, loaded.ai, "mtaji-reusable>=3"),
    ),
  ];
  const ratios = targets.map((item) => item.nodeRatio);
  const medianNodeRatio = median(ratios);
  const nonIncreasingFraction = targets.filter((item) => item.onNodes <= item.offNodes).length
    / targets.length;
  const frozenOffFailures = targets.filter((item) => !(item.frozenOffMoveEqual
    && item.frozenOffRootScoreEqual && item.frozenOffCountersEqual)).length;
  const rootScoreMismatches = targets.filter((item) => !item.onRootScoreMatchesReference).length;
  const outsideTopSet = targets.filter((item) => !item.onMoveInReferenceTopSet).length;
  const missingTargetTrigger = targets.filter((item) => item.triggerStates < 1).length;
  const controlFailures = controls.filter((item) => !(item.triggerStates === 0
    && item.prioritizedMoves === 0 && item.onOffMoveEqual && item.onOffCountersEqual
    && item.frozenOffMoveEqual && item.frozenOffCountersEqual)).length;

  const gates = {
    targetSupport: targets.length >= TARGET_MINIMUM,
    medianNodeRatio: medianNodeRatio <= 0.95,
    nonIncreasingFraction: nonIncreasingFraction >= 0.55,
    frozenFeatureOffEquivalence: frozenOffFailures === 0,
    rootScoreSemanticSafety: rootScoreMismatches === 0,
    referenceTopSetSafety: outsideTopSet === 0,
    targetTriggerCoverage: missingTargetTrigger === 0,
    negativeControlExactness: controlFailures === 0,
  };
  const passed = allTrue(gates);
  return {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-E-DEVELOPMENT-EVALUATION",
    candidate: CANDIDATE,
    baselineId: BASELINE_ID,
    gateSpecId: GATE_SPEC_ID,
    materializationId: Population.MATERIALIZATION_ID,
    sourceSeedBlock: { start: DEV_START, end: DEV_END },
    populationDigest: materialized.populationDigest,
    candidateMetricsObserved: true,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    fixedDepth: DEPTH,
    evaluationProfile: "bao",
    quiescenceDepth: QUIESCENCE_DEPTH,
    support: supportReport.c002Support,
    metrics: {
      medianNodeRatio,
      nonIncreasingFraction,
      frozenOffFailures,
      rootScoreMismatches,
      selectedMoveOutsideReferenceTopSet: outsideTopSet,
      catastrophicNewLosses: outsideTopSet === 0 ? 0 : null,
      missingTargetTrigger,
      negativeControlFailures: controlFailures,
    },
    thresholds: {
      medianNodeRatioMaximum: 0.95,
      nonIncreasingFractionMinimum: 0.55,
      frozenOffFailuresMaximum: 0,
      rootScoreMismatchesMaximum: 0,
      selectedMoveOutsideReferenceTopSetMaximum: 0,
      catastrophicNewLossMaximum: 0,
      negativeControlFailuresMaximum: 0,
    },
    gates,
    passed,
    decision: passed ? "DEVELOPMENT-BENEFIT-GATE-PASS" : "DEVELOPMENT-BENEFIT-GATE-FAIL-HOLD",
    noRescue: "Do not retune PBAI-C002-v1 trigger, ordering placement, or thresholds from these outcomes",
    targets,
    controls,
  };
}

function writeReport(report, output) {
  const text = `${JSON.stringify(report, null, 2)}\n`;
  if (output) {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(path.resolve(output), text);
  }
  process.stdout.write(text);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const materialized = materialize();
  const report = options.phase === "materialize"
    ? materializationReport(materialized)
    : evaluationReport(materialized);
  writeReport(report, options.output);
  if (options.phase === "evaluate" && report.decision === "DEVELOPMENT-BENEFIT-GATE-FAIL-HOLD") {
    process.exitCode = 2;
  }
}

if (require.main === module) main();

module.exports = {
  exactReference,
  evaluationReport,
  materializationReport,
  materialize,
};
