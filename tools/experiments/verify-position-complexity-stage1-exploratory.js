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
  stableStringify,
} = require("./lib/position-typology-features.js");
const { loadSpec } = require("./run-position-complexity-stage1-exploratory.js");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-complexity/stage1-exploratory-v1");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function parseArgs(argv) {
  const options = { output: DEFAULT_OUTPUT, recomputeSearch: true };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--no-search-recompute") { options.recomputeSearch = false; continue; }
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    if (arg === "--output") options.output = path.resolve(value);
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  return options;
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function expectedOpeningMove(state, random) {
  const moves = E.moveVariants(state);
  if (!moves.length) return null;
  return moves[Math.floor(random() * moves.length)];
}

function expectedAiMove(state, spec, random) {
  const search = spec.population.trajectoryGenerator;
  return AI.analyzeMove(state, search.level, random, {
    evaluationProfile: search.evaluationProfile,
    searchProfile: search.searchProfile,
    maxDepth: search.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: search.quiescenceDepth,
    stableBestDepths: search.stableBestDepths,
    aspirationWindow: search.aspirationWindow,
  });
}

function verifyGame(game, gameIndex, spec, specSha256, recomputeSearch) {
  const expectedSeed = spec.population.seedStart + gameIndex;
  const expectedGameId = `pcx-s1-${String(gameIndex).padStart(4, "0")}`;
  if (game.schemaVersion !== 1 || game.stageId !== spec.stageId || game.specSha256 !== specSha256) {
    throw new Error(`Game identity mismatch at index ${gameIndex}`);
  }
  if (game.gameIndex !== gameIndex || game.seed !== expectedSeed || game.gameId !== expectedGameId) {
    throw new Error(`Game index/seed/id mismatch at index ${gameIndex}`);
  }
  if (!Array.isArray(game.observations) || !game.observations.length || !Array.isArray(game.moves)) {
    throw new Error(`Invalid game arrays at index ${gameIndex}`);
  }
  if (game.observations.length !== game.moves.length + 1) {
    throw new Error(`Observation/move count mismatch at index ${gameIndex}`);
  }

  const random = seededRandom(expectedSeed);
  let state = E.initialState();
  const historicalSequence = [];
  const ruleSequence = [];
  let searchMovesRecomputed = 0;

  for (let ply = 0; ply < game.observations.length; ply += 1) {
    const storedObservation = game.observations[ply];
    const recomputedObservation = extractPositionTypologyObservation(state, {
      gameId: expectedGameId,
      seed: expectedSeed,
      conditionId: "P2-D2",
      ply,
    });
    if (stableStringify(storedObservation) !== stableStringify(recomputedObservation)) {
      throw new Error(`Stored observation mismatch at game ${gameIndex}, ply ${ply}`);
    }
    historicalSequence.push(recomputedObservation.identity.historicalStateHash);
    ruleSequence.push(recomputedObservation.identity.ruleStateKey);
    if (ply === game.observations.length - 1) break;

    const recorded = game.moves[ply];
    if (recorded.ply !== ply || recorded.player !== state.player) {
      throw new Error(`Move metadata mismatch at game ${gameIndex}, ply ${ply}`);
    }
    const legal = E.moveVariants(state);
    const recordedMove = legal.find((move) => AI.moveKey(move) === recorded.moveKey);
    if (!recordedMove) throw new Error(`Illegal recorded move at game ${gameIndex}, ply ${ply}`);
    if (stableStringify(recorded.move) !== stableStringify(recordedMove)) {
      throw new Error(`Stored move object mismatch at game ${gameIndex}, ply ${ply}`);
    }
    const before = identityKeys(state);
    if (recorded.beforeHistoricalStateHash !== before.historicalStateHash
      || recorded.beforeRuleStateKey !== before.ruleStateKey) {
      throw new Error(`Before-state identity mismatch at game ${gameIndex}, ply ${ply}`);
    }

    if (ply < spec.population.opening.plies) {
      if (recorded.source !== "opening-random") throw new Error(`Opening source mismatch at game ${gameIndex}, ply ${ply}`);
      const expected = expectedOpeningMove(state, random);
      if (!expected || AI.moveKey(expected) !== recorded.moveKey) {
        throw new Error(`Seeded opening mismatch at game ${gameIndex}, ply ${ply}`);
      }
      if (recorded.generationSearch !== null) {
        throw new Error(`Unexpected opening search stats at game ${gameIndex}, ply ${ply}`);
      }
    } else {
      if (recorded.source !== "trajectory-ai") throw new Error(`AI source mismatch at game ${gameIndex}, ply ${ply}`);
      if (!recorded.generationSearch || recorded.generationSearch.timedOut
        || recorded.generationSearch.completedDepth !== spec.population.trajectoryGenerator.maxDepth) {
        throw new Error(`Incomplete stored generation search at game ${gameIndex}, ply ${ply}`);
      }
      if (recomputeSearch) {
        const expected = expectedAiMove(state, spec, random);
        searchMovesRecomputed += 1;
        if (expected.stats.timedOut || expected.stats.completedDepth !== spec.population.trajectoryGenerator.maxDepth
          || AI.moveKey(expected.move) !== recorded.moveKey
          || expected.stats.rootScore !== recorded.generationSearch.rootScore
          || expected.stats.nodes !== recorded.generationSearch.nodes
          || expected.stats.quiescenceNodes !== recorded.generationSearch.quiescenceNodes
          || expected.stats.cutoffs !== recorded.generationSearch.cutoffs
          || expected.stats.evaluations !== recorded.generationSearch.evaluations) {
          throw new Error(`Trajectory search recomputation mismatch at game ${gameIndex}, ply ${ply}`);
        }
      }
    }

    const applied = E.applyMove(state, recordedMove);
    const after = identityKeys(applied.state);
    if (recorded.afterHistoricalStateHash !== after.historicalStateHash
      || recorded.afterRuleStateKey !== after.ruleStateKey) {
      throw new Error(`After-state identity mismatch at game ${gameIndex}, ply ${ply}`);
    }
    state = applied.state;
  }

  if (hashValue(historicalSequence) !== game.historicalTrajectoryHash
    || hashValue(ruleSequence) !== game.ruleTrajectoryHash) {
    throw new Error(`Trajectory hash mismatch at game ${gameIndex}`);
  }
  if (state.winner !== game.winner) throw new Error(`Winner mismatch at game ${gameIndex}`);
  if (game.seed < spec.population.seedStart || game.seed > spec.population.seedEnd) {
    throw new Error(`Out-of-range seed at game ${gameIndex}`);
  }
  return {
    gameIndex,
    seed: game.seed,
    observations: game.observations.length,
    moves: game.moves.length,
    searchMovesRecomputed,
    historicalTrajectoryHash: game.historicalTrajectoryHash,
    reachedMtaji: game.observations.some(({ phase }) => phase === "mtaji"),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = loadSpec();
  const manifestPath = path.join(options.output, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error("Missing Stage 1 manifest");
  const manifest = readJson(manifestPath);
  if (manifest.specSha256 !== specSha256 || manifest.stageId !== spec.stageId) {
    throw new Error("Manifest/spec mismatch");
  }
  if (manifest.summary?.games !== spec.population.games) throw new Error("Manifest game count incomplete");

  const verified = [];
  for (let gameIndex = 0; gameIndex < spec.population.games; gameIndex += 1) {
    const file = gamePath(options.output, gameIndex);
    if (!fs.existsSync(file)) throw new Error(`Missing game file ${gameIndex}`);
    const result = verifyGame(readJson(file), gameIndex, spec, specSha256, options.recomputeSearch);
    verified.push(result);
    console.error(`[pcx stage1 verify] ${gameIndex + 1}/${spec.population.games} ${result.seed}`);
  }
  const trajectoryCounts = new Map();
  for (const item of verified) {
    trajectoryCounts.set(item.historicalTrajectoryHash, (trajectoryCounts.get(item.historicalTrajectoryHash) || 0) + 1);
  }
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    passed: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    gamesVerified: verified.length,
    observationsVerified: verified.reduce((sum, item) => sum + item.observations, 0),
    movesVerified: verified.reduce((sum, item) => sum + item.moves, 0),
    searchMovesRecomputed: verified.reduce((sum, item) => sum + item.searchMovesRecomputed, 0),
    fullSearchRecomputation: options.recomputeSearch,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
    largestHistoricalTrajectoryGroup: trajectoryCounts.size ? Math.max(...trajectoryCounts.values()) : 0,
    reachedMtajiGames: verified.filter(({ reachedMtaji }) => reachedMtaji).length,
    verifiedIdentityHash: hashValue(verified.map(({ gameIndex, seed, historicalTrajectoryHash }) => ({
      gameIndex, seed, historicalTrajectoryHash,
    }))),
  };
  atomicWriteJson(path.join(options.output, "verification.json"), result);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();
module.exports = { verifyGame };
