#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { hashValue } = require("./lib/position-typology-features.js");
const TM = require("./lib/tactical-motif-features.js");
const Discovery = require("./lib/tactical-motif-discovery.js");
const C = require("./lib/tactical-motif-stage1-corpus.js");

function parseArgs(argv) {
  const o = { phase: "status", output: C.DEFAULT_OUTPUT, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--force") { o.force = true; continue; }
    const v = argv[++i]; if (v === undefined) throw new Error(`Missing value for ${argv[i - 1]}`);
    if (argv[i - 1] === "--phase") o.phase = v;
    else if (argv[i - 1] === "--output") o.output = path.resolve(v);
    else throw new Error(`Unknown argument: ${argv[i - 1]}`);
  }
  if (!["status", "generate", "select", "measure", "discover"].includes(o.phase)) throw new Error(`Invalid phase: ${o.phase}`);
  return o;
}
function median(values) {
  const a = values.slice().sort((x, y) => x - y); const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function candidate(trace, depth, moveKey) {
  const result = trace.results.find((r) => r.depth === depth);
  const row = result?.candidates.find((c) => c.moveKey === moveKey);
  if (!row) throw new Error(`Missing move ${moveKey} at D${depth}`);
  return row;
}
function status(output, spec, specSha256) {
  const games = path.join(output, "games"); const measurements = path.join(output, "measurements");
  return {
    stageId: spec.stageId, specSha256, output,
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
    if (!game) { game = C.runGame(spec, specSha256, i); C.writeJson(file, game); }
    games.push(game);
    console.error(`[tm stage1 generate] ${i + 1}/${spec.population.games}`);
  }
  const trajectoryCounts = new Map(); const conditionCounts = new Map();
  for (const g of games) {
    trajectoryCounts.set(g.historicalTrajectoryHash, (trajectoryCounts.get(g.historicalTrajectoryHash) || 0) + 1);
    conditionCounts.set(g.conditionId, (conditionCounts.get(g.conditionId) || 0) + 1);
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
    schemaVersion: 1, stageId: spec.stageId, specSha256, exploratory: true,
    formalExperiment: false, scientificInferenceAuthorized: false, confirmatoryReuseAllowed: false,
    authorizationSha256: auth.authorizationSha256, generatedAt: new Date().toISOString(),
    population: spec.population, summary, summaryHash: hashValue(summary), provenance,
  };
  C.writeJson(path.join(output, "manifest.json"), manifest); return manifest;
}
function requireVerification(output, specSha256) {
  const file = path.join(output, "verification.json");
  if (!fs.existsSync(file)) throw new Error("Selection blocked: verification.json absent");
  const v = C.readJson(file);
  if (v.specSha256 !== specSha256 || v.passed !== true || v.fullSearchRecomputation !== true) throw new Error("Selection blocked: full verification did not pass");
  return v;
}
function readiness(reps, selected, spec) {
  const phases = selected.reduce((o, x) => { o[x.assignedPhase] = (o[x.assignedPhase] || 0) + 1; return o; }, {});
  const conditions = selected.reduce((o, x) => { o[x.conditionId] = (o[x.conditionId] || 0) + 1; return o; }, {});
  const openings = new Set(selected.map((x) => x.openingPrefixHash)).size;
  const g = spec.readinessGates;
  const gates = {
    uniqueHistoricalTrajectories: reps.length >= g.minimumUniqueHistoricalTrajectories,
    selectedUniqueRuleStates: selected.length >= g.minimumSelectedUniqueRuleStates,
    namuaSelectedStates: (phases.namua || 0) >= g.minimumNamuaSelectedStates,
    mtajiSelectedStates: (phases.mtaji || 0) >= g.minimumMtajiSelectedStates,
    distinctOpeningPrefixes: openings >= g.minimumDistinctOpeningPrefixes,
    selectedPerGenerationStratum: spec.population.conditionAssignment.strata.every(({ id }) => (conditions[id] || 0) >= g.minimumSelectedPerGenerationStratum),
  };
  return { selectedPhaseCounts: phases, selectedConditionCounts: conditions, distinctOpeningPrefixes: openings, gates, passed: Object.values(gates).every(Boolean) };
}
function select(output, spec, specSha256) {
  requireVerification(output, specSha256);
  const games = C.readGames(output, spec); const reps = C.representativeGames(games); const raw = []; const unavailable = [];
  for (const game of reps) {
    const phase = C.assignedPhase(game.historicalTrajectoryHash, spec);
    const eligible = game.observations.filter((o) => !o.terminal && o.ply >= spec.stateSelection.minimumPly && o.phase === phase && o.features.actor.legalMoveCount >= spec.stateSelection.minimumLegalMoveCount)
      .map((o) => ({ observation: o, rank: C.selectionRank(game, o, spec) }))
      .sort((a, b) => a.rank.localeCompare(b.rank) || a.observation.identity.ruleStateKey.localeCompare(b.observation.identity.ruleStateKey));
    if (!eligible.length) { unavailable.push({ historicalTrajectoryHash: game.historicalTrajectoryHash, seed: game.seed, conditionId: game.conditionId, assignedPhase: phase }); continue; }
    const chosen = eligible[0];
    raw.push({ historicalTrajectoryHash: game.historicalTrajectoryHash, ruleTrajectoryHash: game.ruleTrajectoryHash, seed: game.seed, gameId: game.gameId, conditionId: game.conditionId, openingPrefixHash: game.openingPrefix.hash, assignedPhase: phase, selectionRank: chosen.rank, ply: chosen.observation.ply, ruleStateKey: chosen.observation.identity.ruleStateKey, historicalStateHash: chosen.observation.identity.historicalStateHash, observation: chosen.observation, state: C.stateFromObservation(chosen.observation) });
  }
  const byRule = new Map();
  for (const x of raw) {
    const cur = byRule.get(x.ruleStateKey);
    if (!cur || x.historicalTrajectoryHash < cur.historicalTrajectoryHash || (x.historicalTrajectoryHash === cur.historicalTrajectoryHash && x.seed < cur.seed)) byRule.set(x.ruleStateKey, x);
  }
  const selected = [...byRule.values()].sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const audit = readiness(reps, selected, spec);
  const selectionHash = hashValue(selected.map((x) => ({ historicalTrajectoryHash: x.historicalTrajectoryHash, ruleStateKey: x.ruleStateKey, ply: x.ply, assignedPhase: x.assignedPhase, conditionId: x.conditionId, openingPrefixHash: x.openingPrefixHash, selectionRank: x.selectionRank })));
  const result = { schemaVersion: 1, stageId: spec.stageId, specSha256, generatedGames: games.length, uniqueHistoricalTrajectories: reps.length, unavailableAssignedPhase: unavailable.length, unavailable, selectedBeforeRuleStateCollapse: raw.length, duplicateSelectedRuleStatesCollapsed: raw.length - selected.length, selectedUniqueRuleStates: selected.length, replacementPerformed: false, selectionHash, ...audit };
  C.writeJson(path.join(output, "selection-audit.json"), result);
  C.writeJson(path.join(output, "selected-states.json"), { schemaVersion: 1, stageId: spec.stageId, specSha256, selectionHash, selected });
  return result;
}
function measureOne(selected, index, spec, specSha256, selectionHash) {
  const state = selected.state; const rs = spec.measurement.rootSearch;
  const trace = TM.analyzeExactRootValues(state, rs.depths, { evaluationProfile: rs.evaluationProfile, quiescenceDepth: rs.quiescenceDepth, orderQuiescenceCaptures: rs.orderQuiescenceCaptures });
  const d3 = trace.results.find((r) => r.depth === 3); const med = median(d3.candidates.map((c) => c.score)); const min = Math.min(...d3.candidates.map((c) => c.score)); const worstN = d3.candidates.filter((c) => c.score === min).length;
  const moves = E.moveVariants(state).map((move) => {
    const moveKey = AI.moveKey(move); const c3 = candidate(trace, 3, moveKey);
    return {
      moveKey, move: JSON.parse(JSON.stringify(move)), transition: TM.summarizeMoveTransition(state, move),
      responseEnvelope: TM.summarizeReplyEnvelope(state, move, spec.measurement.responseEnvelope.numericFields),
      replySearch: TM.analyzeReplyValues(state, move, spec.measurement.replySearch.depth, { evaluationProfile: spec.measurement.replySearch.evaluationProfile, quiescenceDepth: spec.measurement.replySearch.quiescenceDepth, orderQuiescenceCaptures: spec.measurement.replySearch.orderQuiescenceCaptures }),
      search: { d1: candidate(trace, 1, moveKey), d2: candidate(trace, 2, moveKey), d3: c3, d3StateMedian: med, d3ScoreMinusStateMedian: c3.score - med, d3IsTopSet: c3.isTopSet, d3AtOrAboveStateMedian: c3.score >= med, d3UniqueWorst: c3.score === min && worstN === 1 },
    };
  }).sort((a, b) => a.moveKey.localeCompare(b.moveKey));
  return { schemaVersion: 1, stageId: spec.stageId, specSha256, selectionHash, selectedIndex: index, historicalTrajectoryHash: selected.historicalTrajectoryHash, ruleStateKey: selected.ruleStateKey, seed: selected.seed, gameId: selected.gameId, conditionId: selected.conditionId, openingPrefixHash: selected.openingPrefixHash, phase: selected.assignedPhase, ply: selected.ply, root: { actor: selected.observation.features.actor, opponent: selected.observation.features.opponent, global: selected.observation.features.global }, exactRootTrace: trace, moves };
}
function measure(output, spec, specSha256, force) {
  const audit = C.readJson(path.join(output, "selection-audit.json")); if (audit.specSha256 !== specSha256 || audit.passed !== true) throw new Error("Measurement blocked: selection readiness failed");
  const artifact = C.readJson(path.join(output, "selected-states.json")); if (artifact.selectionHash !== audit.selectionHash) throw new Error("Selection hash mismatch");
  let moveRecords = 0; const identities = [];
  for (let i = 0; i < artifact.selected.length; i += 1) {
    const file = C.measurementPath(output, i); let row = !force && fs.existsSync(file) ? C.readJson(file) : null;
    if (!row) { row = measureOne(artifact.selected[i], i, spec, specSha256, artifact.selectionHash); C.writeJson(file, row); }
    if (row.specSha256 !== specSha256 || row.selectionHash !== artifact.selectionHash || row.ruleStateKey !== artifact.selected[i].ruleStateKey) throw new Error(`Measurement identity mismatch: ${i}`);
    moveRecords += row.moves.length; identities.push({ ruleStateKey: row.ruleStateKey, moves: row.moves.map((m) => ({ moveKey: m.moveKey, d3: m.search.d3.score })) });
    console.error(`[tm stage1 measure] ${i + 1}/${artifact.selected.length}`);
  }
  const manifest = { schemaVersion: 1, stageId: spec.stageId, specSha256, selectionHash: artifact.selectionHash, completedMeasurements: artifact.selected.length, measuredMoveRecords: moveRecords, minimumMeasuredMoveRecords: spec.readinessGates.minimumMeasuredMoveRecords, measurementReadinessPassed: moveRecords >= spec.readinessGates.minimumMeasuredMoveRecords, measurementHash: hashValue(identities), provenance: C.provenance() };
  C.writeJson(path.join(output, "measurement-manifest.json"), manifest); return manifest;
}
function discover(output, spec, specSha256) {
  const m = C.readJson(path.join(output, "measurement-manifest.json")); if (m.specSha256 !== specSha256 || !m.measurementReadinessPassed) throw new Error("Discovery blocked: measurement readiness failed");
  const rows = Array.from({ length: m.completedMeasurements }, (_, i) => C.readJson(C.measurementPath(output, i)));
  const result = Discovery.discoverCandidates(rows, spec); result.specSha256 = specSha256; result.selectionHash = m.selectionHash; result.measurementHash = m.measurementHash; result.generatedAt = new Date().toISOString(); result.noRescue = { thresholdRetuningAllowed: false, favorableSubsetSelectionAllowed: false, phaseRelabelingAllowed: false, failedCandidateRenamingAllowed: false, outcomeDependentExtensionAllowed: false };
  C.writeJson(path.join(output, "discovery-result.json"), result); return result;
}
function main() {
  const o = parseArgs(process.argv.slice(2)); const { spec, specSha256 } = C.loadSpec();
  if (o.phase === "status") { console.log(JSON.stringify(status(o.output, spec, specSha256), null, 2)); return; }
  const auth = C.loadAuthorization(specSha256); let result;
  if (o.phase === "generate") result = generate(o.output, spec, specSha256, auth, o.force);
  if (o.phase === "select") result = select(o.output, spec, specSha256);
  if (o.phase === "measure") result = measure(o.output, spec, specSha256, o.force);
  if (o.phase === "discover") result = discover(o.output, spec, specSha256);
  console.log(JSON.stringify(result, null, 2));
}
if (require.main === module) main();
module.exports = { candidate, generate, measureOne, parseArgs, select, status };
