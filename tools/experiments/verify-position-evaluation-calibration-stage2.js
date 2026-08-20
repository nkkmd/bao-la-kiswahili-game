#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const { extractPositionTypologyObservation, hashValue, identityKeys } = require("./lib/position-typology-features.js");
const C = require("./lib/position-evaluation-calibration-stage2-common.js");

function independentContinuation(state, spec, random) {
  const g = spec.population.continuation;
  const result = AI.analyzeMove(state, g.level, random, {
    evaluationProfile: g.evaluationProfile, searchProfile: g.searchProfile, maxDepth: g.maxDepth,
    timeLimitMs: Infinity, quiescenceDepth: g.quiescenceDepth,
    orderQuiescenceCaptures: g.orderQuiescenceCaptures, adaptive: false,
    stableBestDepths: 0, aspirationWindow: 0,
  });
  if (result.stats.timedOut || result.stats.completedDepth !== g.maxDepth) throw new Error("Verifier continuation incomplete");
  return result.move;
}
function replayGame(spec, specSha256, stored) {
  const random = seededRandom(stored.seed);
  let state = E.initialState();
  const historical = [];
  const rules = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const obs = extractPositionTypologyObservation(state, { gameId: stored.gameId, conditionId: "P2-D2", seed: stored.seed, ply });
    historical.push(obs.identity.historicalStateHash); rules.push(obs.identity.ruleStateKey);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
    } else move = independentContinuation(state, spec, random);
    const expected = stored.moves[ply];
    if (!expected || AI.moveKey(move) !== expected.moveKey
      || obs.identity.historicalStateHash !== expected.beforeHistoricalStateHash
      || obs.identity.ruleStateKey !== expected.beforeRuleStateKey) {
      throw new Error(`Stage 2 replay mismatch game=${stored.gameId} ply=${ply}`);
    }
    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    if (after.historicalStateHash !== expected.afterHistoricalStateHash || after.ruleStateKey !== expected.afterRuleStateKey) {
      throw new Error(`Stage 2 replay after-state mismatch game=${stored.gameId} ply=${ply}`);
    }
    state = applied.state;
  }
  const trajectoryHash = hashValue(historical);
  const ruleTrajectoryHash = hashValue(rules);
  if (trajectoryHash !== stored.historicalTrajectoryHash || ruleTrajectoryHash !== stored.ruleTrajectoryHash
    || state.winner !== stored.winner || stored.specSha256 !== specSha256) {
    throw new Error(`Stage 2 replay final mismatch game=${stored.gameId}`);
  }
}
function assignedPhase(hash, spec) {
  const digest = C.sha256(`${spec.stateSelection.phaseAssignment.salt}|${hash}`);
  return Number.parseInt(digest.slice(0, 8), 16) % 2 === 0
    ? spec.stateSelection.phaseAssignment.mapping.even : spec.stateSelection.phaseAssignment.mapping.odd;
}
function selectionRank(game, observation, spec) {
  return C.sha256(`${spec.stateSelection.withinAssignedPhase.salt}|${[game.historicalTrajectoryHash, observation.identity.ruleStateKey, observation.ply].join("|")}`);
}
function independentSelection(games, spec, ref) {
  const groups = new Map();
  for (const game of games) { const list = groups.get(game.historicalTrajectoryHash) || []; list.push(game); groups.set(game.historicalTrajectoryHash, list); }
  const reps = [...groups.values()].map((list) => list.sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId))[0])
    .sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const eligibleGames = reps.filter((g) => !ref.trajectoryHashes.has(g.historicalTrajectoryHash) && !ref.openingPrefixHashes.has(g.openingPrefix.hash));
  const provisional = [];
  for (const game of eligibleGames) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const rows = game.observations.filter((o) => o.ply >= spec.stateSelection.minimumPly && o.terminal === false
      && o.phase === phase && !ref.ruleStateKeys.has(o.identity.ruleStateKey));
    if (!rows.length) continue;
    const chosen = rows.map((observation) => ({ observation, rank: selectionRank(game, observation, spec) }))
      .sort((a, b) => a.rank.localeCompare(b.rank))[0];
    provisional.push({ game, phase, observation: chosen.observation, selectionRank: chosen.rank });
  }
  provisional.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash) || a.game.seed - b.game.seed);
  const byRule = new Map();
  for (const row of provisional) { const key = row.observation.identity.ruleStateKey; const list = byRule.get(key) || []; list.push(row); byRule.set(key, list); }
  const selected = [...byRule.values()].map((list) => list.sort((a, b) =>
    a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash) || a.game.seed - b.game.seed)[0]);
  selected.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash));
  return { reps, eligibleGames, selected };
}
function main() {
  const output = path.resolve(process.argv[2] || C.DEFAULT_OUTPUT);
  const stage1Output = path.resolve(process.argv[3] || C.DEFAULT_STAGE1_OUTPUT);
  const { spec, specSha256 } = C.loadSpec();
  const ref = C.loadStage1Reference(stage1Output, spec);
  const games = C.readGames(output, spec);
  for (let i = 0; i < games.length; i += 1) {
    replayGame(spec, specSha256, games[i]);
    if ((i + 1) % 64 === 0 || i + 1 === games.length) process.stderr.write(`[stage2-verify] ${i + 1}/${games.length}\n`);
  }
  const expectedSelection = independentSelection(games, spec, ref);
  const summary = C.readJson(path.join(output, "stage2-selection-measurement-summary.json"));
  const measurementFiles = fs.readdirSync(path.join(output, "measurements"))
    .filter((name) => /^selected-\d{4}\.json$/.test(name)).sort();
  if (measurementFiles.length !== expectedSelection.selected.length || summary.selectedUniqueRuleStates !== expectedSelection.selected.length) {
    throw new Error("Stage 2 verifier selected-state count mismatch");
  }
  const verifiedMeasurements = [];
  let measurementMismatches = 0;
  let stage1TrajectoryOverlap = 0;
  let stage1OpeningPrefixOverlap = 0;
  let stage1RuleStateOverlap = 0;
  for (let index = 0; index < expectedSelection.selected.length; index += 1) {
    const row = expectedSelection.selected[index];
    const stored = C.readJson(path.join(output, "measurements", measurementFiles[index]));
    const state = C.stateFromObservation(row.observation);
    const actor = state.player;
    const staticBaoEvaluation = AI.evaluate(state, actor);
    const expected = {
      historicalTrajectoryHash: row.game.historicalTrajectoryHash,
      ruleStateKey: row.observation.identity.ruleStateKey,
      openingPrefixHash: row.game.openingPrefix.hash,
      ply: row.observation.ply,
      phase: row.phase,
      actorSeat: actor,
      staticBaoEvaluation,
      frozenWinProbability: C.predictFrozenModel(ref.result, row.phase, staticBaoEvaluation),
      finalWinner: row.game.winner,
      administrativeTruncation: row.game.winner === null,
      actorWin: row.game.winner === null ? null : row.game.winner === actor ? 1 : 0,
    };
    for (const [key, value] of Object.entries(expected)) if (stored[key] !== value) measurementMismatches += 1;
    if (ref.trajectoryHashes.has(stored.historicalTrajectoryHash)) stage1TrajectoryOverlap += 1;
    if (ref.openingPrefixHashes.has(stored.openingPrefixHash)) stage1OpeningPrefixOverlap += 1;
    if (ref.ruleStateKeys.has(stored.ruleStateKey)) stage1RuleStateOverlap += 1;
    verifiedMeasurements.push(stored);
  }
  if (measurementMismatches) throw new Error(`Stage 2 measurement mismatches: ${measurementMismatches}`);
  const recomputedMeasurementHash = C.sha256(JSON.stringify(verifiedMeasurements));
  const verification = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    passed: recomputedMeasurementHash === summary.measurementHash
      && stage1TrajectoryOverlap === 0 && stage1OpeningPrefixOverlap === 0 && stage1RuleStateOverlap === 0,
    gamesVerified: games.length,
    gameReplayMismatches: 0,
    uniqueHistoricalTrajectoriesBeforeStage1Firewall: expectedSelection.reps.length,
    uniqueHistoricalTrajectoriesAfterStage1TrajectoryOpeningFirewall: expectedSelection.eligibleGames.length,
    selectedUniqueRuleStates: expectedSelection.selected.length,
    measurementMismatches: 0,
    stage1HistoricalTrajectoryOverlap: stage1TrajectoryOverlap,
    stage1OpeningPrefixOverlap,
    stage1RuleStateOverlap,
    storedMeasurementHash: summary.measurementHash,
    recomputedMeasurementHash,
    measurementHashMatches: recomputedMeasurementHash === summary.measurementHash,
    stage1ResultSha256: spec.stage1Dependency.stage1ResultSha256,
    source: C.provenance(spec),
  };
  if (!verification.passed) throw new Error("Stage 2 verification failed");
  C.writeJson(path.join(output, "verification.json"), verification);
  console.log(JSON.stringify(verification, null, 2));
}
if (require.main === module) main();
