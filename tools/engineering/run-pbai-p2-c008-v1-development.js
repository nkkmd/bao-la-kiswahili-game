#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const E = require("../../public/engine.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-development-measurement-spec.json");
const EQUIV_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-feature-off-equivalence-result.json");
const CANDIDATE_AI_PATH = path.join(ROOT, "public/ai.js");
const WIN = 1_000_000;

function ensure(ok, message) { if (!ok) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha256(file) { return sha256(fs.readFileSync(file)); }
function mean(values) { return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; }
function rate(values) { return values.length ? values.filter(Boolean).length / values.length : null; }
function nearestRank(values, fraction) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(fraction * sorted.length) - 1)];
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

function moveKey(move) {
  if (!move) return "";
  return [
    move.type, move.phase, move.row, move.index, move.direction, move.side,
    move.houseChoice, Boolean(move.houseTwo),
  ].join(":");
}
function sortedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }

function rawObject(state) {
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "strict RAW pending missing");
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

function assignedPhase(seed, start) { return ((seed - start) % 2 === 0) ? "namua" : "mtaji"; }
function rank(spec, label, root, extra = []) {
  return sha256([
    spec.measurementSpecId, label, root.phase, String(root.seed), String(root.ply), root.rawKey, ...extra,
  ].join("|"));
}

function trajectoryRoot(spec, seed) {
  const phase = assignedPhase(seed, spec.population.sourceSeedStart);
  const random = seededRandom(seed);
  let state = E.initialState();
  let chosen = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const moves = sortedMoves(state);
      if (moves.length >= 2) {
        const root = { seed, ply, phase, rawKey: rawKey(state), state: clone(state) };
        root.trajectoryRank = rank(spec, "trajectory-root", root);
        root.populationRank = rank(spec, "population", root);
        if (!chosen || root.trajectoryRank < chosen.trajectoryRank
          || (root.trajectoryRank === chosen.trajectoryRank && root.ply < chosen.ply)) chosen = root;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const moves = sortedMoves(state);
    if (!moves.length) break;
    state = E.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return chosen;
}

function materializeGlobalPopulation(spec) {
  const candidates = [];
  for (let seed = spec.population.sourceSeedStart; seed <= spec.population.sourceSeedEnd; seed += 1) {
    const root = trajectoryRoot(spec, seed);
    if (root) candidates.push(root);
  }
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    const seen = new Set();
    const rows = candidates.filter((root) => root.phase === phase)
      .sort((a, b) => a.populationRank.localeCompare(b.populationRank) || a.seed - b.seed || a.ply - b.ply)
      .filter((root) => {
        if (seen.has(root.rawKey)) return false;
        seen.add(root.rawKey);
        return true;
      });
    ensure(rows.length >= spec.population.globalPopulationSelection.targetPerPhase,
      `insufficient global ${phase} roots: ${rows.length}`);
    selected.push(...rows.slice(0, spec.population.globalPopulationSelection.targetPerPhase));
  }
  ensure(selected.length === spec.population.globalPopulationSelection.targetTotal, "global population target mismatch");
  ensure(new Set(selected.map((root) => root.seed)).size === selected.length, "trajectory duplicate in global population");
  ensure(new Set(selected.map((root) => root.rawKey)).size === selected.length, "RAW duplicate in global population");
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.populationRank.localeCompare(b.populationRank));
  return { candidates, selected };
}

function loadAi(source, filename) {
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    BaoEngine: E,
    BaoAIWeights: Weights,
    performance: { now: () => 0 },
    console,
    require(request) {
      if (request === "./engine.js") return E;
      if (request === "./ai-weights.js") return Weights;
      throw new Error(`unexpected require: ${request}`);
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename });
  return module.exports;
}

function searchOptions(spec, depth, enabled = false) {
  return {
    searchProfile: spec.baselineSearch.searchProfile,
    evaluationProfile: spec.baselineSearch.evaluationProfile,
    maxDepth: depth,
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
    pbaiC008RootFlipConfirmation: enabled,
  };
}

function analyze(ai, state, spec, depth, enabled = false) {
  const result = ai.analyzeMove(clone(state), spec.baselineSearch.level, () => 0, searchOptions(spec, depth, enabled));
  return {
    move: clone(result.move),
    moveKey: ai.moveKey(result.move),
    stats: clone(result.stats),
  };
}

function classifyRoots(spec, baseline, globalRoots) {
  const rows = [];
  let technicalFailures = 0;
  for (const root of globalRoots) {
    const d2 = analyze(baseline, root.state, spec, 2, false);
    const d3 = analyze(baseline, root.state, spec, 3, false);
    const complete = Boolean(d2.moveKey && d3.moveKey
      && d2.stats.completedDepth === 2 && d3.stats.completedDepth === 3
      && !d2.stats.timedOut && !d3.stats.timedOut);
    if (!complete) technicalFailures += 1;
    const eligible = complete && d2.moveKey !== d3.moveKey;
    const row = {
      ...root,
      d2,
      d3,
      complete,
      eligible,
    };
    row.eligibleRank = rank(spec, "eligible", row, [d2.moveKey, d3.moveKey]);
    row.negativeRank = rank(spec, "negative-control", row, [d2.moveKey, d3.moveKey]);
    rows.push(row);
  }
  return { rows, technicalFailures };
}

function stratifiedSelect(rows, predicate, rankField, targetPerPhase, maximumTotal) {
  const eligible = rows.filter(predicate);
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    const phaseRows = eligible.filter((row) => row.phase === phase)
      .sort((a, b) => a[rankField].localeCompare(b[rankField]) || a.seed - b.seed || a.ply - b.ply);
    selected.push(...phaseRows.slice(0, targetPerPhase));
  }
  const selectedIds = new Set(selected.map((row) => `${row.seed}:${row.ply}`));
  if (selected.length < maximumTotal) {
    const remainder = eligible.filter((row) => !selectedIds.has(`${row.seed}:${row.ply}`))
      .sort((a, b) => a[rankField].localeCompare(b[rankField]) || a.seed - b.seed || a.ply - b.ply);
    selected.push(...remainder.slice(0, maximumTotal - selected.length));
  }
  selected.sort((a, b) => a[rankField].localeCompare(b[rankField]) || a.seed - b.seed || a.ply - b.ply);
  return { eligible, selected };
}

function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}
function scoreClass(score) {
  if (score > WIN / 2) return "root-win-mate-domain";
  if (score < -WIN / 2) return "root-loss-mate-domain";
  return "ordinary-evaluation-domain";
}
function quiescence(state, alpha, beta, player, evaluator, ply, remaining) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter((move) => move.type === "capture");
  if (!captures.length || remaining === 0) return evaluator(state, player);
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of captures) {
    const next = E.applyMove(state, move).state;
    const value = quiescence(next, alpha, beta, player, evaluator, ply + 1, remaining - 1);
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
function exactSearch(state, depth, alpha, beta, player, evaluator, ply, qdepth) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return quiescence(state, alpha, beta, player, evaluator, ply, qdepth);
  const moves = E.moveVariants(state);
  if (!moves.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of moves) {
    const next = E.applyMove(state, move).state;
    const value = exactSearch(next, depth - 1, alpha, beta, player, evaluator, ply + 1, qdepth);
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

function referenceD4(state, baseline, spec) {
  const player = state.player;
  const evaluator = (position, actor) => baseline.evaluateWithProfile(position, actor, spec.reference.evaluationProfile);
  const candidates = sortedMoves(state).map((move) => {
    const next = E.applyMove(state, move).state;
    const score = exactSearch(next, spec.reference.depth - 1, -Infinity, Infinity, player, evaluator, 1, spec.reference.quiescenceDepth);
    return {
      moveKey: moveKey(move),
      score,
      scoreClass: scoreClass(score),
      immediateWinner: next.winner,
    };
  });
  const ranked = candidates.slice().sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const worstScore = ranked[ranked.length - 1].score;
  const topSetMoveKeys = ranked.filter((row) => row.score === bestScore).map((row) => row.moveKey).sort();
  for (const row of ranked) row.scoreRank = 1 + ranked.filter((other) => other.score > row.score).length;
  return {
    depth: spec.reference.depth,
    legalMoveCount: ranked.length,
    bestScore,
    bestScoreClass: scoreClass(bestScore),
    worstScore,
    worstCount: ranked.filter((row) => row.score === worstScore).length,
    topSetMoveKeys,
    candidates: ranked,
  };
}

function selectedMetrics(state, selectedMoveKey, reference) {
  const row = reference.candidates.find((candidate) => candidate.moveKey === selectedMoveKey);
  ensure(row, `selected move not found in D4 reference: ${selectedMoveKey}`);
  const opponent = 1 - state.player;
  const topSetAgreement = reference.topSetMoveKeys.includes(selectedMoveKey);
  const normalizedRankLoss = (row.scoreRank - 1) / Math.max(1, reference.legalMoveCount - 1);
  const uniqueWorst = row.score === reference.worstScore && reference.worstCount === 1;
  const rootLossMate = row.scoreClass === "root-loss-mate-domain";
  const severeLoss = uniqueWorst || (rootLossMate && reference.bestScoreClass !== "root-loss-mate-domain");
  const immediateTerminalLoss = row.immediateWinner === opponent;
  const nonLossReferenceExists = reference.candidates.some((candidate) =>
    candidate.scoreClass !== "root-loss-mate-domain" && candidate.immediateWinner !== opponent);
  return {
    topSetAgreement,
    normalizedRankLoss,
    severeLoss,
    immediateTerminalLoss,
    rootLossMate,
    nonLossReferenceExists,
    referenceScore: row.score,
    referenceScoreRank: row.scoreRank,
  };
}

function developmentRows(spec, baseline, candidate, selectedEligible) {
  return selectedEligible.map((root) => {
    const baselineD3 = root.d3;
    const candidateD3 = analyze(candidate, root.state, spec, 3, true);
    const reference = referenceD4(root.state, baseline, spec);
    const baselineMetrics = selectedMetrics(root.state, baselineD3.moveKey, reference);
    const candidateMetrics = selectedMetrics(root.state, candidateD3.moveKey, reference);
    const catastrophicNewLoss = candidateMetrics.severeLoss && !baselineMetrics.severeLoss
      && (candidateMetrics.immediateTerminalLoss || candidateMetrics.rootLossMate)
      && candidateMetrics.nonLossReferenceExists;
    return {
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      eligibleRank: root.eligibleRank,
      d2MoveKey: root.d2.moveKey,
      baselineD3: {
        moveKey: baselineD3.moveKey,
        rootScore: baselineD3.stats.rootScore,
        nodes: baselineD3.stats.nodes,
      },
      candidateD3: {
        moveKey: candidateD3.moveKey,
        rootScore: candidateD3.stats.rootScore,
        nodes: candidateD3.stats.nodes,
        pbaiC008: clone(candidateD3.stats.pbaiC008 || null),
      },
      reference,
      baselineMetrics,
      candidateMetrics,
      catastrophicNewLoss,
      nodeRatio: candidateD3.stats.nodes / baselineD3.stats.nodes,
    };
  });
}

const NEGATIVE_FIELDS = [
  "rootScore", "nodes", "quiescenceNodes", "cutoffs", "cacheHits", "cacheStores",
  "evaluationRequests", "evaluations", "evaluationCacheHits",
];
function negativeRows(spec, baseline, candidate, controls) {
  return controls.map((root) => {
    const baselineD3 = root.d3;
    const candidateD3 = analyze(candidate, root.state, spec, 3, true);
    const equality = { selectedMoveKey: baselineD3.moveKey === candidateD3.moveKey };
    for (const field of NEGATIVE_FIELDS) equality[field] = baselineD3.stats[field] === candidateD3.stats[field];
    const triggered = candidateD3.stats.pbaiC008?.triggered === true;
    return {
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      negativeRank: root.negativeRank,
      baselineMoveKey: baselineD3.moveKey,
      candidateMoveKey: candidateD3.moveKey,
      triggered,
      equality,
      passed: !triggered && Object.values(equality).every(Boolean),
    };
  });
}

function aggregate(spec, eligibleRows, negativeControlRows, technicalFailures) {
  const topBaseline = rate(eligibleRows.map((row) => row.baselineMetrics.topSetAgreement));
  const topCandidate = rate(eligibleRows.map((row) => row.candidateMetrics.topSetAgreement));
  const rankBaseline = mean(eligibleRows.map((row) => row.baselineMetrics.normalizedRankLoss));
  const rankCandidate = mean(eligibleRows.map((row) => row.candidateMetrics.normalizedRankLoss));
  const severeBaseline = rate(eligibleRows.map((row) => row.baselineMetrics.severeLoss));
  const severeCandidate = rate(eligibleRows.map((row) => row.candidateMetrics.severeLoss));
  const catastrophic = eligibleRows.filter((row) => row.catastrophicNewLoss).length;
  const ratios = eligibleRows.map((row) => row.nodeRatio);
  const triggerFailures = eligibleRows.filter((row) => row.candidateD3.pbaiC008?.triggered !== true).length;
  const completionFailures = eligibleRows.filter((row) => row.candidateD3.pbaiC008?.confirmationCompleted !== true
    || row.candidateD3.pbaiC008?.confirmationTimedOut === true).length;
  const negativeFailures = negativeControlRows.filter((row) => !row.passed).length;
  const metrics = {
    eligibleRoots: eligibleRows.length,
    topSetAgreementBaseline: topBaseline,
    topSetAgreementCandidate: topCandidate,
    topSetAgreementDelta: topCandidate - topBaseline,
    meanNormalizedRankLossBaseline: rankBaseline,
    meanNormalizedRankLossCandidate: rankCandidate,
    meanNormalizedRankLossDelta: rankCandidate - rankBaseline,
    severeLossRateBaseline: severeBaseline,
    severeLossRateCandidate: severeCandidate,
    severeLossRateExcess: severeCandidate - severeBaseline,
    catastrophicNewLossCount: catastrophic,
    medianNodeRatio: nearestRank(ratios, 0.5),
    p95NodeRatio: nearestRank(ratios, 0.95),
    runtimeTriggerFailures: triggerFailures,
    confirmationCompletionFailures: completionFailures,
    negativeControlRoots: negativeControlRows.length,
    negativeControlFailures: negativeFailures,
    technicalFailures,
  };
  const gates = {
    estimable: eligibleRows.length >= spec.frozenDevelopmentGate.minimumEligibleRoots,
    primaryTopSet: metrics.topSetAgreementDelta >= spec.frozenDevelopmentGate.primary.topSetAgreementDeltaMinimum,
    primaryRankLoss: metrics.meanNormalizedRankLossDelta <= spec.frozenDevelopmentGate.primary.meanNormalizedRankLossDeltaMaximum,
    safetySevere: metrics.severeLossRateExcess <= spec.frozenDevelopmentGate.safety.severeLossRateExcessOverBaselineMaximum,
    safetyCatastrophic: catastrophic <= spec.frozenDevelopmentGate.safety.catastrophicNewLossCountMaximum,
    costMedian: metrics.medianNodeRatio <= spec.frozenDevelopmentGate.cost.medianNodeRatioMaximum,
    costP95: metrics.p95NodeRatio <= spec.frozenDevelopmentGate.cost.p95NodeRatioMaximum,
    runtimeCoverage: triggerFailures === 0 && completionFailures === 0,
    negativeControl: negativeFailures === 0,
    technical: technicalFailures === 0,
  };
  let disposition;
  if (!gates.technical || !gates.runtimeCoverage || !gates.negativeControl) {
    disposition = spec.decisionMapping.technicalOrVerifierFailure;
  } else if (!gates.estimable) {
    disposition = spec.decisionMapping.eligibleBelow64;
  } else if (!gates.safetySevere || !gates.safetyCatastrophic) {
    disposition = spec.decisionMapping.anySafetyFailure;
  } else if (!gates.primaryTopSet || !gates.primaryRankLoss || !gates.costMedian || !gates.costP95) {
    disposition = spec.decisionMapping.anyPrimaryOrCostFailure;
  } else {
    disposition = spec.decisionMapping.allFrozenConditionsPass;
  }
  return { metrics, gates, disposition };
}

function rootRef(root) {
  return { seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey };
}
function parseArgs(argv) {
  const baselineAt = argv.indexOf("--baseline-ai");
  const outputAt = argv.indexOf("--output");
  ensure(baselineAt >= 0 && argv[baselineAt + 1], "--baseline-ai required");
  ensure(outputAt >= 0 && argv[outputAt + 1], "--output required");
  return { baselineAi: path.resolve(argv[baselineAt + 1]), output: path.resolve(argv[outputAt + 1]) };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const equivalence = JSON.parse(fs.readFileSync(EQUIV_PATH, "utf8"));
  const baselineSource = fs.readFileSync(args.baselineAi, "utf8");
  const candidateSource = fs.readFileSync(CANDIDATE_AI_PATH, "utf8");
  ensure(equivalence.decision.disposition === spec.featureOffEquivalenceDispositionRequired, "feature-off equivalence prerequisite failed");
  ensure(sha256(baselineSource) === spec.baselineAiSha256, "baseline AI hash mismatch");
  ensure(sha256(candidateSource) === spec.candidateAiSha256, "candidate AI hash mismatch");
  ensure(fileSha256(path.join(ROOT, "public/engine.js")) === spec.publicEngineSha256, "engine hash mismatch");
  ensure(spec.researchGeneration3Influence === false, "G3 firewall changed");

  const baseline = loadAi(baselineSource, "pbai-c008-baseline-ai.js");
  const candidate = loadAi(candidateSource, "pbai-c008-candidate-ai.js");
  const population = materializeGlobalPopulation(spec);
  const classified = classifyRoots(spec, baseline, population.selected);
  const eligibleSelection = stratifiedSelect(
    classified.rows, (row) => row.eligible, "eligibleRank",
    spec.population.runtimeEligible.targetPerPhase, spec.population.runtimeEligible.maximumTotal,
  );
  const negativeSelection = stratifiedSelect(
    classified.rows, (row) => row.complete && !row.eligible, "negativeRank",
    spec.population.negativeControl.targetPerPhase, spec.population.negativeControl.maximumTotal,
  );

  let eligibleRows = [];
  let negativeControlRows = [];
  let summary;
  if (eligibleSelection.selected.length < spec.population.runtimeEligible.minimumEstimableTotal) {
    summary = {
      metrics: { eligibleRoots: eligibleSelection.selected.length, technicalFailures: classified.technicalFailures },
      gates: { estimable: false, technical: classified.technicalFailures === 0 },
      disposition: spec.decisionMapping.eligibleBelow64,
    };
  } else {
    eligibleRows = developmentRows(spec, baseline, candidate, eligibleSelection.selected);
    negativeControlRows = negativeRows(spec, baseline, candidate, negativeSelection.selected);
    summary = aggregate(spec, eligibleRows, negativeControlRows, classified.technicalFailures);
  }

  const result = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    measurementSpecId: spec.measurementSpecId,
    measurementSpecSha256: sha256(specText),
    baselineId: spec.baselineId,
    sourceHashes: {
      baselineAiSha256: sha256(baselineSource),
      candidateAiSha256: sha256(candidateSource),
      publicEngineSha256: fileSha256(path.join(ROOT, "public/engine.js")),
    },
    firewalls: {
      supportSeeds432Accessed: false,
      featureOffSeeds434Accessed: false,
      validationSeeds425Accessed: false,
      releaseHoldoutSeeds426Accessed: false,
      researchGeneration3ArtifactsAccessed: false,
      candidateMechanismRetunedAfterOutcome: false,
      thresholdsRetunedAfterOutcome: false,
    },
    population: {
      sourceSeeds: spec.population.sourceSeedCount,
      trajectoryCandidates: population.candidates.length,
      globalRoots: population.selected.length,
      globalNamua: population.selected.filter((row) => row.phase === "namua").length,
      globalMtaji: population.selected.filter((row) => row.phase === "mtaji").length,
      globalPopulationDigest: sha256(JSON.stringify(population.selected.map(rootRef))),
      allEligibleRootsBeforeSelection: eligibleSelection.eligible.length,
      selectedEligibleRoots: eligibleSelection.selected.length,
      selectedEligibleNamua: eligibleSelection.selected.filter((row) => row.phase === "namua").length,
      selectedEligibleMtaji: eligibleSelection.selected.filter((row) => row.phase === "mtaji").length,
      selectedEligibleDigest: sha256(JSON.stringify(eligibleSelection.selected.map(rootRef))),
      selectedNegativeControls: negativeSelection.selected.length,
      selectedNegativeDigest: sha256(JSON.stringify(negativeSelection.selected.map(rootRef))),
    },
    summary,
    decision: {
      disposition: summary.disposition,
      developmentPass: summary.disposition === spec.decisionMapping.allFrozenConditionsPass,
      validationContractFreezeAuthorized: summary.disposition === spec.decisionMapping.allFrozenConditionsPass,
      validationExecutionAuthorized: false,
      releaseHoldoutExecutionAuthorized: false,
      publicDeploymentAuthorized: false,
      aiGen3PromotionAuthorized: false,
    },
    eligibleRows,
    negativeControlRows,
  };
  result.deterministicCoreSha256 = sha256(JSON.stringify({
    measurementSpecId: result.measurementSpecId,
    measurementSpecSha256: result.measurementSpecSha256,
    sourceHashes: result.sourceHashes,
    population: result.population,
    summary: result.summary,
    decision: result.decision,
  }));

  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({
    deterministicCoreSha256: result.deterministicCoreSha256,
    population: result.population,
    summary: result.summary,
    decision: result.decision,
  }, null, 2));
}

if (require.main === module) main();
