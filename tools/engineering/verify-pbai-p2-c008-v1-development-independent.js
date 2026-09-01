#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Engine = require("../../public/engine.js");
const WeightConfig = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_FILE = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-development-measurement-spec.json");
const CANDIDATE_FILE = path.join(ROOT, "public/ai.js");
const WIN = 1000000;

function check(value, message) { if (!value) throw new Error(message); }
function digest(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function avg(rows) { return rows.reduce((total, value) => total + value, 0) / rows.length; }
function boolRate(rows) { return rows.filter(Boolean).length / rows.length; }
function nrq(rows, p) {
  const sorted = rows.slice().sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)];
}

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

function keyMove(move) {
  if (!move) return "";
  return [move.type, move.phase, move.row, move.index, move.direction, move.side,
    move.houseChoice, Boolean(move.houseTwo)].join(":");
}
function moves(state) { return Engine.moveVariants(state).slice().sort((a, b) => keyMove(a).localeCompare(keyMove(b))); }
function strictState(state) {
  check(Array.isArray(state.pending) && state.pending.length === 2, "pending missing from strict RAW state");
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
function strictKey(state) { return digest(JSON.stringify(strictState(state))); }
function phaseFor(seed, start) { return ((seed - start) & 1) === 0 ? "namua" : "mtaji"; }
function rankFor(spec, label, row, tail = []) {
  return digest([spec.measurementSpecId, label, row.phase, row.seed, row.ply, row.rawKey, ...tail].join("|"));
}

function candidateFromTrajectory(spec, seed) {
  const wanted = phaseFor(seed, spec.population.sourceSeedStart);
  const random = rng(seed);
  let state = Engine.initialState();
  let winner = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === wanted && moves(state).length >= 2) {
      const row = { seed, ply, phase: wanted, rawKey: strictKey(state), state: copy(state) };
      row.trajectoryRank = rankFor(spec, "trajectory-root", row);
      row.populationRank = rankFor(spec, "population", row);
      if (!winner || row.trajectoryRank < winner.trajectoryRank
        || (row.trajectoryRank === winner.trajectoryRank && row.ply < winner.ply)) winner = row;
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const legal = moves(state);
    if (!legal.length) break;
    state = Engine.applyMove(state, legal[Math.floor(random() * legal.length)]).state;
  }
  return winner;
}

function globalRoots(spec) {
  const onePerSeed = [];
  for (let seed = spec.population.sourceSeedStart; seed <= spec.population.sourceSeedEnd; seed += 1) {
    const row = candidateFromTrajectory(spec, seed);
    if (row) onePerSeed.push(row);
  }
  const roots = [];
  for (const phase of ["namua", "mtaji"]) {
    const seen = new Set();
    const available = onePerSeed.filter((row) => row.phase === phase)
      .sort((a, b) => a.populationRank.localeCompare(b.populationRank) || a.seed - b.seed || a.ply - b.ply)
      .filter((row) => {
        if (seen.has(row.rawKey)) return false;
        seen.add(row.rawKey);
        return true;
      });
    check(available.length >= 128, `independent global ${phase} support below 128`);
    roots.push(...available.slice(0, 128));
  }
  check(roots.length === 256, "independent global target mismatch");
  check(new Set(roots.map((row) => row.seed)).size === 256, "independent trajectory duplication");
  check(new Set(roots.map((row) => row.rawKey)).size === 256, "independent RAW duplication");
  roots.sort((a, b) => a.phase.localeCompare(b.phase) || a.populationRank.localeCompare(b.populationRank));
  return { onePerSeed, roots };
}

function aiFromText(text, filename) {
  const module = { exports: {} };
  const box = {
    module,
    exports: module.exports,
    BaoEngine: Engine,
    BaoAIWeights: WeightConfig,
    performance: { now: () => 0 },
    console,
    require(name) {
      if (name === "./engine.js") return Engine;
      if (name === "./ai-weights.js") return WeightConfig;
      throw new Error(`unexpected module ${name}`);
    },
  };
  box.globalThis = box;
  vm.createContext(box);
  vm.runInContext(text, box, { filename });
  return module.exports;
}

function options(spec, depth, on) {
  const b = spec.baselineSearch;
  return {
    searchProfile: b.searchProfile,
    evaluationProfile: b.evaluationProfile,
    maxDepth: depth,
    timeLimitMs: Infinity,
    quiescenceDepth: b.quiescenceDepth,
    maxTableEntries: b.maxTableEntries,
    ttMoveFirst: b.ttMoveFirst,
    orderQuiescenceCaptures: b.orderQuiescenceCaptures,
    normalizeTtMateScores: b.normalizeTtMateScores,
    evaluationCache: b.evaluationCache,
    maxEvaluationCacheEntries: b.maxEvaluationCacheEntries,
    stableBestDepths: b.stableBestDepths,
    aspirationWindow: b.aspirationWindow,
    pbaiC008RootFlipConfirmation: on,
  };
}
function runSearch(ai, state, spec, depth, on) {
  const result = ai.analyzeMove(copy(state), "hard", () => 0, options(spec, depth, on));
  return { moveKey: ai.moveKey(result.move), stats: copy(result.stats) };
}

function classify(spec, baseline, roots) {
  let failures = 0;
  const rows = roots.map((root) => {
    const a = runSearch(baseline, root.state, spec, 2, false);
    const b = runSearch(baseline, root.state, spec, 3, false);
    const complete = Boolean(a.moveKey && b.moveKey && a.stats.completedDepth === 2
      && b.stats.completedDepth === 3 && !a.stats.timedOut && !b.stats.timedOut);
    if (!complete) failures += 1;
    const row = { ...root, d2: a, d3: b, complete, eligible: complete && a.moveKey !== b.moveKey };
    row.eligibleRank = rankFor(spec, "eligible", row, [a.moveKey, b.moveKey]);
    row.negativeRank = rankFor(spec, "negative-control", row, [a.moveKey, b.moveKey]);
    return row;
  });
  return { rows, failures };
}

function selectStrata(rows, predicate, rankName, perPhase, limit) {
  const pool = rows.filter(predicate);
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    const local = pool.filter((row) => row.phase === phase)
      .sort((a, b) => a[rankName].localeCompare(b[rankName]) || a.seed - b.seed || a.ply - b.ply);
    selected.push(...local.slice(0, perPhase));
  }
  const used = new Set(selected.map((row) => `${row.seed}/${row.ply}`));
  const fill = pool.filter((row) => !used.has(`${row.seed}/${row.ply}`))
    .sort((a, b) => a[rankName].localeCompare(b[rankName]) || a.seed - b.seed || a.ply - b.ply);
  selected.push(...fill.slice(0, Math.max(0, limit - selected.length)));
  selected.sort((a, b) => a[rankName].localeCompare(b[rankName]) || a.seed - b.seed || a.ply - b.ply);
  return { pool, selected };
}

function terminal(state, actor, ply) {
  if (state.winner === null) return null;
  return state.winner === actor ? WIN - ply : -WIN + ply;
}
function classScore(score) {
  return score > WIN / 2 ? "root-win-mate-domain"
    : score < -WIN / 2 ? "root-loss-mate-domain" : "ordinary-evaluation-domain";
}
function qsearch(state, alpha, beta, actor, evaluate, ply, remaining) {
  const t = terminal(state, actor, ply);
  if (t !== null) return t;
  const captures = Engine.moveVariants(state).filter((move) => move.type === "capture");
  if (remaining === 0 || captures.length === 0) return evaluate(state, actor);
  const maximize = state.player === actor;
  let best = maximize ? -Infinity : Infinity;
  for (const move of captures) {
    const child = Engine.applyMove(state, move).state;
    const score = qsearch(child, alpha, beta, actor, evaluate, ply + 1, remaining - 1);
    if (maximize) {
      if (score > best) best = score;
      if (best > alpha) alpha = best;
    } else {
      if (score < best) best = score;
      if (best < beta) beta = best;
    }
    if (beta <= alpha) break;
  }
  return best;
}
function minimax(state, depth, alpha, beta, actor, evaluate, ply, qdepth) {
  const t = terminal(state, actor, ply);
  if (t !== null) return t;
  if (depth === 0) return qsearch(state, alpha, beta, actor, evaluate, ply, qdepth);
  const legal = Engine.moveVariants(state);
  if (!legal.length) return state.player === actor ? -WIN + ply : WIN - ply;
  const maximize = state.player === actor;
  let best = maximize ? -Infinity : Infinity;
  for (const move of legal) {
    const child = Engine.applyMove(state, move).state;
    const score = minimax(child, depth - 1, alpha, beta, actor, evaluate, ply + 1, qdepth);
    if (maximize) {
      if (score > best) best = score;
      if (best > alpha) alpha = best;
    } else {
      if (score < best) best = score;
      if (best < beta) beta = best;
    }
    if (beta <= alpha) break;
  }
  return best;
}
function reference(state, baseline, spec) {
  const actor = state.player;
  const evaluate = (position, player) => baseline.evaluateWithProfile(position, player, "bao");
  const candidates = moves(state).map((move) => {
    const child = Engine.applyMove(state, move).state;
    const score = minimax(child, 3, -Infinity, Infinity, actor, evaluate, 1, 1);
    return { moveKey: keyMove(move), score, scoreClass: classScore(score), immediateWinner: child.winner };
  }).sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const best = candidates[0].score;
  const worst = candidates[candidates.length - 1].score;
  for (const row of candidates) row.scoreRank = 1 + candidates.filter((other) => other.score > row.score).length;
  return {
    depth: 4,
    legalMoveCount: candidates.length,
    bestScore: best,
    bestScoreClass: classScore(best),
    worstScore: worst,
    worstCount: candidates.filter((row) => row.score === worst).length,
    topSetMoveKeys: candidates.filter((row) => row.score === best).map((row) => row.moveKey).sort(),
    candidates,
  };
}
function metric(state, selectedKey, ref) {
  const row = ref.candidates.find((entry) => entry.moveKey === selectedKey);
  check(row, `independent reference missing selected move ${selectedKey}`);
  const opponent = 1 - state.player;
  const severe = (row.score === ref.worstScore && ref.worstCount === 1)
    || (row.scoreClass === "root-loss-mate-domain" && ref.bestScoreClass !== "root-loss-mate-domain");
  return {
    topSetAgreement: ref.topSetMoveKeys.includes(selectedKey),
    normalizedRankLoss: (row.scoreRank - 1) / Math.max(1, ref.legalMoveCount - 1),
    severeLoss: severe,
    immediateTerminalLoss: row.immediateWinner === opponent,
    rootLossMate: row.scoreClass === "root-loss-mate-domain",
    nonLossReferenceExists: ref.candidates.some((entry) => entry.scoreClass !== "root-loss-mate-domain"
      && entry.immediateWinner !== opponent),
    referenceScore: row.score,
    referenceScoreRank: row.scoreRank,
  };
}

function reconstructEligible(spec, baseline, candidate, roots) {
  return roots.map((row) => {
    const candidateD3 = runSearch(candidate, row.state, spec, 3, true);
    const ref = reference(row.state, baseline, spec);
    const bm = metric(row.state, row.d3.moveKey, ref);
    const cm = metric(row.state, candidateD3.moveKey, ref);
    return {
      seed: row.seed,
      ply: row.ply,
      phase: row.phase,
      rawKey: row.rawKey,
      eligibleRank: row.eligibleRank,
      d2MoveKey: row.d2.moveKey,
      baselineD3: { moveKey: row.d3.moveKey, rootScore: row.d3.stats.rootScore, nodes: row.d3.stats.nodes },
      candidateD3: {
        moveKey: candidateD3.moveKey,
        rootScore: candidateD3.stats.rootScore,
        nodes: candidateD3.stats.nodes,
        pbaiC008: copy(candidateD3.stats.pbaiC008 || null),
      },
      reference: ref,
      baselineMetrics: bm,
      candidateMetrics: cm,
      catastrophicNewLoss: cm.severeLoss && !bm.severeLoss
        && (cm.immediateTerminalLoss || cm.rootLossMate) && cm.nonLossReferenceExists,
      nodeRatio: candidateD3.stats.nodes / row.d3.stats.nodes,
    };
  });
}

const CONTROL_FIELDS = ["rootScore", "nodes", "quiescenceNodes", "cutoffs", "cacheHits", "cacheStores",
  "evaluationRequests", "evaluations", "evaluationCacheHits"];
function reconstructControls(spec, baseline, candidate, rows) {
  return rows.map((row) => {
    const cand = runSearch(candidate, row.state, spec, 3, true);
    const equality = { selectedMoveKey: row.d3.moveKey === cand.moveKey };
    for (const field of CONTROL_FIELDS) equality[field] = row.d3.stats[field] === cand.stats[field];
    const triggered = cand.stats.pbaiC008?.triggered === true;
    return {
      seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey,
      negativeRank: row.negativeRank,
      baselineMoveKey: row.d3.moveKey,
      candidateMoveKey: cand.moveKey,
      triggered,
      equality,
      passed: !triggered && Object.values(equality).every(Boolean),
    };
  });
}

function summarize(spec, eligible, controls, technicalFailures) {
  const ratios = eligible.map((row) => row.nodeRatio);
  const out = {
    eligibleRoots: eligible.length,
    topSetAgreementBaseline: boolRate(eligible.map((row) => row.baselineMetrics.topSetAgreement)),
    topSetAgreementCandidate: boolRate(eligible.map((row) => row.candidateMetrics.topSetAgreement)),
    meanNormalizedRankLossBaseline: avg(eligible.map((row) => row.baselineMetrics.normalizedRankLoss)),
    meanNormalizedRankLossCandidate: avg(eligible.map((row) => row.candidateMetrics.normalizedRankLoss)),
    severeLossRateBaseline: boolRate(eligible.map((row) => row.baselineMetrics.severeLoss)),
    severeLossRateCandidate: boolRate(eligible.map((row) => row.candidateMetrics.severeLoss)),
    catastrophicNewLossCount: eligible.filter((row) => row.catastrophicNewLoss).length,
    medianNodeRatio: nrq(ratios, 0.5),
    p95NodeRatio: nrq(ratios, 0.95),
    runtimeTriggerFailures: eligible.filter((row) => row.candidateD3.pbaiC008?.triggered !== true).length,
    confirmationCompletionFailures: eligible.filter((row) => row.candidateD3.pbaiC008?.confirmationCompleted !== true
      || row.candidateD3.pbaiC008?.confirmationTimedOut === true).length,
    negativeControlRoots: controls.length,
    negativeControlFailures: controls.filter((row) => !row.passed).length,
    technicalFailures,
  };
  out.topSetAgreementDelta = out.topSetAgreementCandidate - out.topSetAgreementBaseline;
  out.meanNormalizedRankLossDelta = out.meanNormalizedRankLossCandidate - out.meanNormalizedRankLossBaseline;
  out.severeLossRateExcess = out.severeLossRateCandidate - out.severeLossRateBaseline;
  const gates = {
    estimable: eligible.length >= 64,
    primaryTopSet: out.topSetAgreementDelta >= 0.05,
    primaryRankLoss: out.meanNormalizedRankLossDelta <= -0.02,
    safetySevere: out.severeLossRateExcess <= 0,
    safetyCatastrophic: out.catastrophicNewLossCount === 0,
    costMedian: out.medianNodeRatio <= 1.60,
    costP95: out.p95NodeRatio <= 2.50,
    runtimeCoverage: out.runtimeTriggerFailures === 0 && out.confirmationCompletionFailures === 0,
    negativeControl: out.negativeControlFailures === 0,
    technical: technicalFailures === 0,
  };
  let disposition;
  if (!gates.technical || !gates.runtimeCoverage || !gates.negativeControl) disposition = spec.decisionMapping.technicalOrVerifierFailure;
  else if (!gates.estimable) disposition = spec.decisionMapping.eligibleBelow64;
  else if (!gates.safetySevere || !gates.safetyCatastrophic) disposition = spec.decisionMapping.anySafetyFailure;
  else if (!gates.primaryTopSet || !gates.primaryRankLoss || !gates.costMedian || !gates.costP95) disposition = spec.decisionMapping.anyPrimaryOrCostFailure;
  else disposition = spec.decisionMapping.allFrozenConditionsPass;
  return { metrics: out, gates, disposition };
}

function ref(row) { return { seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey }; }
function arg(argv, name) {
  const index = argv.indexOf(name);
  check(index >= 0 && argv[index + 1], `${name} required`);
  return path.resolve(argv[index + 1]);
}

function main(argv = process.argv.slice(2)) {
  const productionPath = arg(argv, "--production");
  const baselinePath = arg(argv, "--baseline-ai");
  const outputPath = arg(argv, "--output");
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));
  const specText = fs.readFileSync(SPEC_FILE, "utf8");
  const spec = JSON.parse(specText);
  const baselineText = fs.readFileSync(baselinePath, "utf8");
  const candidateText = fs.readFileSync(CANDIDATE_FILE, "utf8");
  check(digest(baselineText) === spec.baselineAiSha256, "independent baseline hash mismatch");
  check(digest(candidateText) === spec.candidateAiSha256, "independent candidate hash mismatch");
  check(digest(fs.readFileSync(path.join(ROOT, "public/engine.js"))) === spec.publicEngineSha256, "independent engine hash mismatch");

  const baseline = aiFromText(baselineText, "independent-baseline.js");
  const candidate = aiFromText(candidateText, "independent-candidate.js");
  const population = globalRoots(spec);
  const classified = classify(spec, baseline, population.roots);
  const eligibleSelection = selectStrata(classified.rows, (row) => row.eligible, "eligibleRank", 64, 128);
  const controlSelection = selectStrata(classified.rows, (row) => row.complete && !row.eligible, "negativeRank", 32, 64);

  let eligibleRows = [];
  let controlRows = [];
  let summary;
  if (eligibleSelection.selected.length < 64) {
    summary = {
      metrics: { eligibleRoots: eligibleSelection.selected.length, technicalFailures: classified.failures },
      gates: { estimable: false, technical: classified.failures === 0 },
      disposition: spec.decisionMapping.eligibleBelow64,
    };
  } else {
    eligibleRows = reconstructEligible(spec, baseline, candidate, eligibleSelection.selected);
    controlRows = reconstructControls(spec, baseline, candidate, controlSelection.selected);
    summary = summarize(spec, eligibleRows, controlRows, classified.failures);
  }

  const reconstructed = {
    measurementSpecId: spec.measurementSpecId,
    measurementSpecSha256: digest(specText),
    sourceHashes: {
      baselineAiSha256: digest(baselineText),
      candidateAiSha256: digest(candidateText),
      publicEngineSha256: digest(fs.readFileSync(path.join(ROOT, "public/engine.js"))),
    },
    population: {
      sourceSeeds: 512,
      trajectoryCandidates: population.onePerSeed.length,
      globalRoots: population.roots.length,
      globalNamua: population.roots.filter((row) => row.phase === "namua").length,
      globalMtaji: population.roots.filter((row) => row.phase === "mtaji").length,
      globalPopulationDigest: digest(JSON.stringify(population.roots.map(ref))),
      allEligibleRootsBeforeSelection: eligibleSelection.pool.length,
      selectedEligibleRoots: eligibleSelection.selected.length,
      selectedEligibleNamua: eligibleSelection.selected.filter((row) => row.phase === "namua").length,
      selectedEligibleMtaji: eligibleSelection.selected.filter((row) => row.phase === "mtaji").length,
      selectedEligibleDigest: digest(JSON.stringify(eligibleSelection.selected.map(ref))),
      selectedNegativeControls: controlSelection.selected.length,
      selectedNegativeDigest: digest(JSON.stringify(controlSelection.selected.map(ref))),
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
  };
  const independentCore = digest(JSON.stringify(reconstructed));
  const productionCore = production.deterministicCoreSha256;
  const coreEquality = independentCore === productionCore;
  const rowEquality = JSON.stringify(eligibleRows) === JSON.stringify(production.eligibleRows)
    && JSON.stringify(controlRows) === JSON.stringify(production.negativeControlRows);
  const passed = coreEquality && rowEquality;
  const result = {
    schemaVersion: 1,
    program: "PBAI-P2",
    stage: "PBAI-P2-E-DEVELOPMENT-INDEPENDENT-VERIFICATION",
    candidateVersion: "PBAI-C008-v1",
    productionRunnerImported: false,
    productionPopulationTrustedWithoutReconstruction: false,
    baselineD2D3EligibilityReconstructed: true,
    d4ReferenceReconstructed: eligibleSelection.selected.length >= 64,
    candidateAndBaselineMetricsReconstructed: eligibleSelection.selected.length >= 64,
    productionDeterministicCoreSha256: productionCore,
    independentDeterministicCoreSha256: independentCore,
    deterministicCoreEquality: coreEquality,
    fullEligibleAndNegativeRowsEquality: rowEquality,
    verifiedDisposition: summary.disposition,
    passed,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (!passed) process.exitCode = 1;
}

if (require.main === module) main();
