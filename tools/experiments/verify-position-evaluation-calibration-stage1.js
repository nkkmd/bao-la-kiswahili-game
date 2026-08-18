#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
} = require("./lib/position-typology-features.js");
const SearchDiagnostic = require("./lib/position-complexity-search-diagnostic.js");
const C = require("./lib/position-evaluation-calibration-common.js");

function replay(spec, specSha256, index) {
  const seed = spec.population.seedStart + index;
  const random = seededRandom(seed);
  const gameId = `pec-s1-${String(index).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId, conditionId: "P2-D2", seed, ply,
    });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
    } else {
      const result = AI.analyzeMove(state, "hard", random, {
        evaluationProfile: "bao",
        searchProfile: "phase2",
        maxDepth: 2,
        timeLimitMs: Infinity,
        quiescenceDepth: 1,
        orderQuiescenceCaptures: false,
        adaptive: false,
        stableBestDepths: 0,
        aspirationWindow: 0,
      });
      if (result.stats.timedOut || result.stats.completedDepth !== 2) {
        throw new Error(`Verifier incomplete D2 search at game ${index} ply ${ply}`);
      }
      move = result.move;
    }
    if (!move) throw new Error(`Verifier found no move at game ${index} ply ${ply}`);
    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    moves.push({
      ply,
      player: state.player,
      move: JSON.parse(JSON.stringify(move)),
      moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: observation.identity.historicalStateHash,
      beforeRuleStateKey: observation.identity.ruleStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRuleStateKey: after.ruleStateKey,
    });
    state = applied.state;
  }
  return {
    gameId,
    seed,
    observations,
    moves,
    historicalTrajectoryHash: hashValue(observations.map((row) => row.identity.historicalStateHash)),
    ruleTrajectoryHash: hashValue(observations.map((row) => row.identity.ruleStateKey)),
    winner: state.winner,
    reason: state.reason || (state.winner === null ? "max-ply" : ""),
    specSha256,
  };
}

function sameStoredGame(stored, replayed) {
  const core = (game) => ({
    gameId: game.gameId,
    seed: game.seed,
    historicalTrajectoryHash: game.historicalTrajectoryHash,
    ruleTrajectoryHash: game.ruleTrajectoryHash,
    winner: game.winner,
    reason: game.reason,
    observationHashes: game.observations.map((row) => row.identity.historicalStateHash),
    moveKeys: game.moves.map((row) => row.moveKey),
  });
  return JSON.stringify(core(stored)) === JSON.stringify(core(replayed));
}

function main() {
  const output = process.argv[2] ? path.resolve(process.argv[2]) : C.DEFAULT_OUTPUT;
  const loaded = C.loadSpec();
  const { spec, specSha256 } = loaded;
  const games = C.readGames(output, spec);
  let gameMismatches = 0;
  for (let index = 0; index < games.length; index += 1) {
    if (!sameStoredGame(games[index], replay(spec, specSha256, index))) gameMismatches += 1;
    if ((index + 1) % 64 === 0 || index + 1 === games.length) {
      process.stderr.write(`[verify-games] ${index + 1}/${games.length}\n`);
    }
  }
  if (gameMismatches) throw new Error(`Game replay mismatches: ${gameMismatches}`);

  const expectedSelection = C.selectStates(games, spec);
  const summaryFile = path.join(output, "stage1-selection-measurement-summary.json");
  if (!fs.existsSync(summaryFile)) throw new Error("Missing selection/measurement summary");
  const storedSummary = C.readJson(summaryFile);
  const measurementFiles = fs.readdirSync(path.join(output, "measurements"))
    .filter((name) => /^selected-\d+\.json$/.test(name)).sort();
  if (measurementFiles.length !== expectedSelection.selected.length) {
    throw new Error("Measurement file count does not match independently reconstructed selection");
  }

  let measurementMismatches = 0;
  const verifiedMeasurements = [];
  expectedSelection.selected.forEach((row, index) => {
    const stored = C.readJson(path.join(output, "measurements", measurementFiles[index]));
    const observation = row.observation;
    const state = C.stateFromObservation(observation);
    const actor = state.player;
    const d2 = SearchDiagnostic.analyzeRootCandidates(state, 2, {
      evaluationProfile: "bao", quiescenceDepth: 1, orderQuiescenceCaptures: false,
    });
    const expected = {
      historicalTrajectoryHash: row.game.historicalTrajectoryHash,
      ruleStateKey: observation.identity.ruleStateKey,
      ply: observation.ply,
      phase: row.phase,
      actorSeat: actor,
      staticBaoEvaluation: AI.evaluate(state, actor),
      exactD2RootBestScore: d2.bestScore,
      finalWinner: row.game.winner,
      administrativeTruncation: row.game.winner === null,
      actorWin: row.game.winner === null ? null : row.game.winner === actor ? 1 : 0,
    };
    for (const [key, value] of Object.entries(expected)) {
      if (stored[key] !== value) measurementMismatches += 1;
    }
    verifiedMeasurements.push(stored);
  });
  if (measurementMismatches) throw new Error(`Measurement mismatches: ${measurementMismatches}`);

  const recomputedMeasurementHash = C.sha256(JSON.stringify(verifiedMeasurements));
  const verification = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    passed: recomputedMeasurementHash === storedSummary.measurementHash,
    gamesVerified: games.length,
    gameReplayMismatches: 0,
    uniqueHistoricalTrajectories: expectedSelection.representatives.length,
    selectedUniqueRuleStates: expectedSelection.selected.length,
    measurementMismatches: 0,
    storedSelectionHash: storedSummary.selectionHash,
    recomputedMeasurementHash,
    storedMeasurementHash: storedSummary.measurementHash,
    measurementHashMatches: recomputedMeasurementHash === storedSummary.measurementHash,
    source: C.provenance(spec),
  };
  if (!verification.passed) throw new Error("Measurement hash mismatch");
  C.writeJson(path.join(output, "verification.json"), verification);
  console.log(JSON.stringify(verification, null, 2));
}

if (require.main === module) main();
