#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { hashValue } = require("./lib/position-typology-features.js");
const BM = require("./lib/blunder-misvaluation-patterns.js");
const Tactical = require("./lib/tactical-motif-features.js");
const Contract = require("./lib/blunder-misvaluation-stage1-contract.js");
const Discovery = require("./lib/blunder-misvaluation-stage1-discovery.js");
const C = require("./lib/blunder-misvaluation-stage1-corpus.js");

function parseArgs(argv) {
  const o = { phase: "status", output: C.DEFAULT_OUTPUT, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--force") { o.force = true; continue; }
    const v = argv[++i];
    if (v === undefined) throw new Error(`Missing value for ${argv[i - 1]}`);
    if (argv[i - 1] === "--phase") o.phase = v;
    else if (argv[i - 1] === "--output") o.output = path.resolve(v);
    else throw new Error(`Unknown argument: ${argv[i - 1]}`);
  }
  if (!["status", "generate", "select", "measure", "discover"].includes(o.phase)) {
    throw new Error(`Invalid phase: ${o.phase}`);
  }
  return o;
}
function median(values) {
  if (!values.length) return null;
  const a = values.slice().sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function status(output, spec, specSha256) {
  const games = path.join(output, "games");
  const measurements = path.join(output, "measurements");
  return {
    stageId: spec.stageId,
    specSha256,
    output,
    authorizationFilePresent: fs.existsSync(C.AUTH_PATH),
    sourceFileSha256: C.sourceFileSha256(),
    generatedGames: fs.existsSync(games) ? fs.readdirSync(games).filter((x) => /^game-\d+\.json$/.test(x)).length : 0,
    expectedGames: spec.population.games,
    hasManifest: fs.existsSync(path.join(output, "manifest.json")),
    hasVerification: fs.existsSync(path.join(output, "verification.json")),
    hasSelectionAudit: fs.existsSync(path.join(output, "selection-audit.json")),
    measurementFiles: fs.existsSync(measurements) ? fs.readdirSync(measurements).filter((x) => /^selected-\d+\.json$/.test(x)).length : 0,
    hasDiscoveryResult: fs.existsSync(path.join(output, "discovery-result.json")),
  };
}
function generate(output, spec, specSha256, auth, force) {
  const provenance = C.provenance();
  if (provenance.sourceTreeDirty) throw new Error("Frozen scientific source tree is dirty");
  const games = [];
  for (let i = 0; i < spec.population.games; i += 1) {
    const file = C.gamePath(output, i);
    let game = !force && fs.existsSync(file) ? C.readJson(file) : null;
    if (game && game.specSha256 !== specSha256) throw new Error(`Spec mismatch: ${file}`);
    if (!game) {
      game = C.runGame(spec, specSha256, i);
      C.writeJson(file, game);
    }
    games.push(game);
    console.error(`[bmp stage1 generate] ${i + 1}/${spec.population.games}`);
  }
  const trajectoryCounts = new Map();
  const conditionCounts = new Map();
  for (const game of games) {
    trajectoryCounts.set(game.historicalTrajectoryHash, (trajectoryCounts.get(game.historicalTrajectoryHash) || 0) + 1);
    conditionCounts.set(game.conditionId, (conditionCounts.get(game.conditionId) || 0) + 1);
  }
  const summary = {
    games: games.length,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((n) => n > 1).length,
    largestHistoricalTrajectoryGroup: Math.max(...trajectoryCounts.values()),
    distinctOpeningPrefixes: new Set(games.map((g) => g.openingPrefix.hash)).size,
    conditionCounts: Object.fromEntries([...conditionCounts].sort()),
  };
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    exploratory: true,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    authorizationSha256: auth.authorizationSha256,
    generatedAt: new Date().toISOString(),
    population: spec.population,
    summary,
    summaryHash: hashValue(summary),
    provenance,
  };
  C.writeJson(path.join(output, "manifest.json"), manifest);
  return manifest;
}
function requireVerification(output, specSha256) {
  const file = path.join(output, "verification.json");
  if (!fs.existsSync(file)) throw new Error("Selection blocked: verification.json absent");
  const v = C.readJson(file);
  if (v.specSha256 !== specSha256 || v.passed !== true || v.fullSearchRecomputation !== true) {
    throw new Error("Selection blocked: full verification did not pass");
  }
  return v;
}
function eligibleCandidateForGame(game, spec) {
  const assignedPhase = C.assignedPhase(game.historicalTrajectoryHash, spec);
  const eligible = game.observations
    .filter((o) => !o.terminal
      && o.ply >= spec.stateSelection.minimumPly
      && o.phase === assignedPhase
      && o.features.actor.legalMoveCount >= spec.stateSelection.minimumLegalMoveCount)
    .map((o) => ({ observation: o, rank: C.selectionRank(game, o, spec) }))
    .sort((a, b) => a.rank.localeCompare(b.rank)
      || a.observation.identity.ruleStateKey.localeCompare(b.observation.identity.ruleStateKey));
  if (!eligible.length) return { assignedPhase, selected: null };
  const chosen = eligible[0];
  const selected = {
    historicalTrajectoryHash: game.historicalTrajectoryHash,
    ruleTrajectoryHash: game.ruleTrajectoryHash,
    seed: game.seed,
    gameId: game.gameId,
    conditionId: game.conditionId,
    openingPrefixHash: game.openingPrefix.hash,
    assignedPhase,
    selectionRank: chosen.rank,
    ply: chosen.observation.ply,
    ruleStateKey: chosen.observation.identity.ruleStateKey,
    historicalStateHash: chosen.observation.identity.historicalStateHash,
    observation: chosen.observation,
    state: C.stateFromObservation(chosen.observation),
  };
  selected.quotaRank = C.quotaRank(selected, spec);
  return { assignedPhase, selected };
}
function collapseDuplicateRuleStates(items) {
  const byRule = new Map();
  for (const item of items) {
    const current = byRule.get(item.ruleStateKey);
    if (!current
        || item.historicalTrajectoryHash.localeCompare(current.historicalTrajectoryHash) < 0
        || (item.historicalTrajectoryHash === current.historicalTrajectoryHash && item.seed < current.seed)) {
      byRule.set(item.ruleStateKey, item);
    }
  }
  return [...byRule.values()];
}
function applyPhaseQuota(items, spec) {
  const selected = [];
  const poolCounts = {};
  const quotaDropped = {};
  for (const phase of ["namua", "mtaji"]) {
    const pool = items.filter((x) => x.assignedPhase === phase)
      .sort((a, b) => a.quotaRank.localeCompare(b.quotaRank)
        || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
    const quota = spec.stateSelection.phaseQuota[phase];
    poolCounts[phase] = pool.length;
    selected.push(...pool.slice(0, quota));
    quotaDropped[phase] = Math.max(0, pool.length - quota);
  }
  selected.sort((a, b) => a.assignedPhase.localeCompare(b.assignedPhase)
    || a.quotaRank.localeCompare(b.quotaRank));
  return { selected, poolCounts, quotaDropped };
}
function selectionReadiness(reps, selected, spec) {
  const phaseCounts = selected.reduce((o, x) => {
    o[x.assignedPhase] = (o[x.assignedPhase] || 0) + 1;
    return o;
  }, {});
  const conditionCounts = selected.reduce((o, x) => {
    o[x.conditionId] = (o[x.conditionId] || 0) + 1;
    return o;
  }, {});
  const distinctOpeningPrefixes = new Set(selected.map((x) => x.openingPrefixHash)).size;
  const g = spec.readinessGates;
  const gates = {
    uniqueHistoricalTrajectories: reps.length >= g.minimumUniqueHistoricalTrajectories,
    selectedUniqueRuleStates: selected.length === g.requiredSelectedUniqueRuleStates,
    namuaSelectedStates: (phaseCounts.namua || 0) === g.requiredNamuaSelectedStates,
    mtajiSelectedStates: (phaseCounts.mtaji || 0) === g.requiredMtajiSelectedStates,
    distinctOpeningPrefixes: distinctOpeningPrefixes >= g.minimumDistinctOpeningPrefixes,
    selectedPerGenerationStratum: spec.population.conditionAssignment.strata.every(({ id }) =>
      (conditionCounts[id] || 0) >= g.minimumSelectedPerGenerationStratum),
  };
  return {
    selectedPhaseCounts: phaseCounts,
    selectedConditionCounts: conditionCounts,
    distinctOpeningPrefixes,
    gates,
    passed: Object.values(gates).every(Boolean),
  };
}
function select(output, spec, specSha256) {
  requireVerification(output, specSha256);
  const games = C.readGames(output, spec);
  const reps = C.representativeGames(games);
  const raw = [];
  const unavailable = [];
  for (const game of reps) {
    const result = eligibleCandidateForGame(game, spec);
    if (!result.selected) {
      unavailable.push({
        historicalTrajectoryHash: game.historicalTrajectoryHash,
        seed: game.seed,
        conditionId: game.conditionId,
        assignedPhase: result.assignedPhase,
      });
    } else {
      raw.push(result.selected);
    }
  }
  const deduplicated = collapseDuplicateRuleStates(raw);
  const quota = applyPhaseQuota(deduplicated, spec);
  const selected = quota.selected;
  const readiness = selectionReadiness(reps, selected, spec);
  const selectionHash = hashValue(selected.map((x) => ({
    historicalTrajectoryHash: x.historicalTrajectoryHash,
    ruleStateKey: x.ruleStateKey,
    ply: x.ply,
    assignedPhase: x.assignedPhase,
    conditionId: x.conditionId,
    openingPrefixHash: x.openingPrefixHash,
    selectionRank: x.selectionRank,
    quotaRank: x.quotaRank,
  })));
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    generatedGames: games.length,
    uniqueHistoricalTrajectories: reps.length,
    unavailableAssignedPhase: unavailable.length,
    unavailable,
    selectedBeforeRuleStateCollapse: raw.length,
    duplicateSelectedRuleStatesCollapsed: raw.length - deduplicated.length,
    phasePoolAfterRuleStateCollapse: quota.poolCounts,
    droppedByPhaseQuota: quota.quotaDropped,
    selectedUniqueRuleStates: selected.length,
    replacementPerformed: false,
    phaseReassignmentPerformed: false,
    selectionHash,
    ...readiness,
  };
  C.writeJson(path.join(output, "selection-audit.json"), result);
  C.writeJson(path.join(output, "selected-states.json"), {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash,
    selected,
  });
  return result;
}
function depthCandidate(trace, depth, moveKey) {
  const result = trace.results.find((r) => r.depth === depth);
  const row = result?.candidates.find((c) => c.moveKey === moveKey);
  if (!row) throw new Error(`Missing move ${moveKey} at D${depth}`);
  const stateMedian = median(result.candidates.map((c) => c.score));
  return {
    ...row,
    stateMedianScore: stateMedian,
    isBelowStateMedian: row.score < stateMedian,
    isAtOrAboveStateMedian: row.score >= stateMedian,
  };
}
function staticTable(state, moves, spec) {
  const rows = moves.map((move) => BM.staticPostMoveEvaluation(state, move, {
    evaluationProfile: spec.measurement.staticPostMove.evaluationProfile,
  }));
  const scores = rows.map((row) => row.score);
  const max = Math.max(...scores);
  const med = median(scores);
  return new Map(rows.map((row) => [row.moveKey, {
    ...row,
    stateMedianScore: med,
    scoreRank: 1 + scores.filter((score) => score > row.score).length,
    isTopSet: row.score === max,
    isBelowStateMedian: row.score < med,
    isAtOrAboveStateMedian: row.score >= med,
  }]));
}
function measureOne(selected, index, spec, specSha256, selectionHash) {
  const state = selected.state;
  const legalMoves = E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
  const trace = BM.analyzeDepthAgreement(state, spec.measurement.rootSearch.depths, {
    evaluationProfile: spec.measurement.rootSearch.evaluationProfile,
    quiescenceDepth: spec.measurement.rootSearch.quiescenceDepth,
    orderQuiescenceCaptures: spec.measurement.rootSearch.orderQuiescenceCaptures,
  });
  const d3Root = BM.analyzeRootDecisionLoss(state, spec.measurement.rootSearch.primaryDepth, {
    evaluationProfile: spec.measurement.rootSearch.evaluationProfile,
    quiescenceDepth: spec.measurement.rootSearch.quiescenceDepth,
    orderQuiescenceCaptures: spec.measurement.rootSearch.orderQuiescenceCaptures,
  });
  const staticRows = staticTable(state, legalMoves, spec);
  const moves = legalMoves.map((move) => {
    const moveKey = AI.moveKey(move);
    const d1 = depthCandidate(trace, 1, moveKey);
    const d2 = depthCandidate(trace, 2, moveKey);
    const d3 = d3Root.candidates.find((c) => c.moveKey === moveKey);
    if (!d3) throw new Error(`Missing D3 decision-loss candidate: ${moveKey}`);
    const row = {
      moveKey,
      move: JSON.parse(JSON.stringify(move)),
      transition: Tactical.summarizeMoveTransition(state, move),
      responseEnvelope: Tactical.summarizeReplyEnvelope(
        state, move, spec.measurement.responseEnvelope.numericFields,
      ),
      staticPostMove: staticRows.get(moveKey),
      search: {
        d1,
        d2,
        d3,
        d3Inferior: Contract.d3InferiorEvent(d3),
      },
    };
    row.failureFlags = Discovery.failureFlags(row);
    return row;
  });
  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash,
    selectedIndex: index,
    historicalTrajectoryHash: selected.historicalTrajectoryHash,
    ruleStateKey: selected.ruleStateKey,
    seed: selected.seed,
    gameId: selected.gameId,
    conditionId: selected.conditionId,
    openingPrefixHash: selected.openingPrefixHash,
    phase: selected.assignedPhase,
    ply: selected.ply,
    root: {
      actor: selected.observation.features.actor,
      opponent: selected.observation.features.opponent,
      global: selected.observation.features.global,
    },
    exactRootTrace: trace,
    d3Reference: {
      searchSemantics: d3Root.searchSemantics,
      depth: d3Root.depth,
      options: d3Root.options,
      bestScore: d3Root.bestScore,
      bestScoreClass: d3Root.bestScoreClass,
      stateMedianScore: d3Root.stateMedianScore,
      topSetMoveKeys: d3Root.topSetMoveKeys,
    },
    moves,
  };
}
function measure(output, spec, specSha256, force) {
  const audit = C.readJson(path.join(output, "selection-audit.json"));
  if (audit.specSha256 !== specSha256 || audit.passed !== true) {
    throw new Error("Measurement blocked: selection readiness failed");
  }
  const artifact = C.readJson(path.join(output, "selected-states.json"));
  if (artifact.selectionHash !== audit.selectionHash) throw new Error("Selection hash mismatch");
  let moveRecords = 0;
  let allD3Finite = true;
  const identities = [];
  for (let i = 0; i < artifact.selected.length; i += 1) {
    const file = C.measurementPath(output, i);
    let row = !force && fs.existsSync(file) ? C.readJson(file) : null;
    if (!row) {
      row = measureOne(artifact.selected[i], i, spec, specSha256, artifact.selectionHash);
      C.writeJson(file, row);
    }
    if (row.specSha256 !== specSha256
        || row.selectionHash !== artifact.selectionHash
        || row.ruleStateKey !== artifact.selected[i].ruleStateKey) {
      throw new Error(`Measurement identity mismatch: ${i}`);
    }
    moveRecords += row.moves.length;
    if (!row.moves.every((m) => Number.isFinite(m.search.d3.score))) allD3Finite = false;
    identities.push({
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      ruleStateKey: row.ruleStateKey,
      moves: row.moves.map((m) => ({
        moveKey: m.moveKey,
        d3Score: m.search.d3.score,
        d3Inferior: m.search.d3Inferior,
        normalizedRankLoss: m.search.d3.normalizedRankLoss,
      })),
    });
    console.error(`[bmp stage1 measure] ${i + 1}/${artifact.selected.length}`);
  }
  const g = spec.readinessGates;
  const measurementReadinessPassed = moveRecords >= g.minimumMeasuredMoveRecords
    && (!g.allSelectedRootsRequireFiniteD3CandidateTables || allD3Finite);
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash: artifact.selectionHash,
    completedMeasurements: artifact.selected.length,
    measuredMoveRecords: moveRecords,
    minimumMeasuredMoveRecords: g.minimumMeasuredMoveRecords,
    allSelectedRootsFiniteD3CandidateTables: allD3Finite,
    measurementReadinessPassed,
    measurementHash: hashValue(identities),
    provenance: C.provenance(),
  };
  C.writeJson(path.join(output, "measurement-manifest.json"), manifest);
  return manifest;
}
function discover(output, spec, specSha256) {
  const manifest = C.readJson(path.join(output, "measurement-manifest.json"));
  if (manifest.specSha256 !== specSha256 || !manifest.measurementReadinessPassed) {
    throw new Error("Discovery blocked: measurement readiness failed");
  }
  const rows = Array.from({ length: manifest.completedMeasurements }, (_, i) =>
    C.readJson(C.measurementPath(output, i)));
  const result = Discovery.discoverCandidates(rows, spec);
  result.specSha256 = specSha256;
  result.selectionHash = manifest.selectionHash;
  result.measurementHash = manifest.measurementHash;
  result.generatedAt = new Date().toISOString();
  result.noRescue = {
    thresholdRetuningAllowed: false,
    favorableSubsetSelectionAllowed: false,
    phaseRelabelingAllowed: false,
    failedCandidateRenamingAllowed: false,
    manualCandidatePromotionAllowed: false,
    outcomeDependentExtensionAllowed: false,
  };
  C.writeJson(path.join(output, "discovery-result.json"), result);
  return result;
}
function main() {
  const o = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = C.loadSpec();
  if (o.phase === "status") {
    console.log(JSON.stringify(status(o.output, spec, specSha256), null, 2));
    return;
  }
  const auth = C.loadAuthorization(specSha256);
  let result;
  if (o.phase === "generate") result = generate(o.output, spec, specSha256, auth, o.force);
  if (o.phase === "select") result = select(o.output, spec, specSha256);
  if (o.phase === "measure") result = measure(o.output, spec, specSha256, o.force);
  if (o.phase === "discover") result = discover(o.output, spec, specSha256);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();
module.exports = {
  applyPhaseQuota,
  collapseDuplicateRuleStates,
  depthCandidate,
  discover,
  eligibleCandidateForGame,
  generate,
  measure,
  measureOne,
  parseArgs,
  select,
  selectionReadiness,
  staticTable,
  status,
};
