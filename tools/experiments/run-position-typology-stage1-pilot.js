#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
} = require("./lib/position-typology-features.js");

const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/symmetry/transform-candidates.js",
  "tools/experiments/lib/phase-transition-features.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/run-position-typology-stage1-pilot.js",
  "tools/experiments/verify-position-typology-stage1-pilot.js",
  "tools/experiments/audit-position-typology-stage1-pilot.js",
  "schemas/position-typology-observation.schema.json",
]);

const CONDITIONS = Object.freeze([
  { id: "B-D1", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 1 },
  { id: "B-D2", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 2 },
  { id: "B-D3", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 3 },
  { id: "LS-D2", level: "hard", evaluator: "bao", search: "legacy", maxDepth: 2 },
  { id: "V2-D2", level: "hard", evaluator: "bao-v2", search: "phase2", maxDepth: 2 },
  { id: "LE-D2", level: "hard", evaluator: "legacy", search: "phase2", maxDepth: 2 },
]);

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    games: 96,
    seed: 20270001,
    maxPly: 100,
    openingPlies: 8,
    output: "artifacts/local/position-typology/stage1-pilot-v1",
    force: false,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") { options.force = true; continue; }
    if (arg === "--status") { options.status = true; continue; }
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    if (arg === "--games") options.games = integerArg(value, arg, 1);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--max-ply") options.maxPly = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = integerArg(value, arg, 0);
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  return options;
}

function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sourceFileHashes(root = path.resolve(__dirname, "../..")) {
  return Object.fromEntries(SOURCE_FILES.filter((file) => fs.existsSync(path.join(root, file))).map((file) => [
    file,
    sha256Text(fs.readFileSync(path.join(root, file))),
  ]));
}

function provenance(root = path.resolve(__dirname, "../..")) {
  const present = SOURCE_FILES.filter((file) => fs.existsSync(path.join(root, file)));
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...present], "")),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    sourceFileSha256: sourceFileHashes(root),
  };
}

function experimentConfig(options) {
  return {
    study: "position-typology",
    stage: "stage1-exploratory-pilot",
    schemaVersion: 1,
    games: options.games,
    baseSeed: options.seed,
    maxPly: options.maxPly,
    opening: {
      policy: "seeded-uniform-legal",
      plies: options.openingPlies,
      pairedAcrossConditions: false,
    },
    conditions: CONDITIONS,
    populationPolicy: {
      primaryDiscoveryMinimumPly: options.openingPlies,
      primaryDiscoveryTerminalIncluded: false,
      rawCorpusRetainsAllObservations: true,
    },
    featurePolicy: {
      aiSearchFieldsInObservation: false,
      trajectoryContextInObservationFeatures: false,
      conditionIdInFeatureVector: false,
      phaseSeparatedPrimaryView: true,
      jointViewSecondary: true,
    },
    independence: {
      exploratoryOnly: true,
      confirmatoryReuseAllowed: false,
    },
  };
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function chooseRandomMove(state, random) {
  const moves = E.moveVariants(state);
  return moves.length ? moves[Math.floor(random() * moves.length)] : null;
}

function chooseAiMove(state, condition, random) {
  return AI.analyzeMove(state, condition.level, random, {
    timeLimitMs: Infinity,
    maxDepth: condition.maxDepth,
    evaluationProfile: condition.evaluator,
    searchProfile: condition.search,
  });
}

function runGame(config, gameIndex) {
  const seed = config.baseSeed + gameIndex;
  const random = seededRandom(seed);
  const condition = config.conditions[gameIndex % config.conditions.length];
  const gameId = `ptyp-s1p-${String(gameIndex).padStart(4, "0")}`;
  const observations = [];
  const moves = [];
  let state = E.initialState();

  for (let ply = 0; ply <= config.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId,
      conditionId: condition.id,
      seed,
      ply,
    });
    observations.push(observation);
    if (state.winner !== null || ply === config.maxPly) break;

    const isOpening = ply < config.opening.plies;
    let move;
    let secondarySearch = null;
    if (isOpening) {
      move = chooseRandomMove(state, random);
    } else {
      const analysis = chooseAiMove(state, condition, random);
      move = analysis.move;
      secondarySearch = {
        completedDepth: analysis.stats?.completedDepth ?? null,
        nodes: analysis.stats?.nodes ?? null,
        rootScore: analysis.stats?.rootScore ?? null,
        timedOut: Boolean(analysis.stats?.timedOut),
      };
    }
    if (!move) break;

    const before = observation.identity;
    const result = E.applyMove(state, move);
    const after = identityKeys(result.state);
    moves.push({
      ply,
      player: state.player,
      source: isOpening ? "opening-random" : "ai",
      move,
      moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: before.historicalStateHash,
      beforeRuleStateKey: before.ruleStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRuleStateKey: after.ruleStateKey,
      secondarySearch,
    });
    state = result.state;
  }

  const openingObservation = observations[Math.min(config.opening.plies, observations.length - 1)];
  const historicalSequence = observations.map(({ identity }) => identity.historicalStateHash);
  const ruleSequence = observations.map(({ identity }) => identity.ruleStateKey);
  const seatCanonicalSequence = observations.map(({ identity }) => identity.seatCanonicalKey);
  return {
    schemaVersion: 1,
    gameId,
    gameIndex,
    seed,
    conditionId: condition.id,
    condition,
    configHash: hashValue(config),
    openingStateKey: openingObservation.identity.ruleStateKey,
    observations,
    moves,
    historicalTrajectoryHash: hashValue(historicalSequence),
    ruleTrajectoryHash: hashValue(ruleSequence),
    seatCanonicalTrajectoryHash: hashValue(seatCanonicalSequence),
    finalHistoricalStateHash: historicalSequence.at(-1),
    finalRuleStateKey: ruleSequence.at(-1),
    winner: state.winner,
    reason: state.reason || (moves.length >= config.maxPly ? "max-ply" : "no-move"),
    plies: moves.length,
  };
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function largestGroup(counts) {
  return counts.size ? Math.max(...counts.values()) : 0;
}

function summarizeGames(games) {
  const observations = games.flatMap((game) => game.observations);
  const ruleKeys = observations.map(({ identity }) => identity.ruleStateKey);
  const canonicalKeys = observations.map(({ identity }) => identity.seatCanonicalKey);
  const historicalTrajectories = countValues(games.map(({ historicalTrajectoryHash }) => historicalTrajectoryHash));
  const ruleTrajectories = countValues(games.map(({ ruleTrajectoryHash }) => ruleTrajectoryHash));
  const canonicalTrajectories = countValues(games.map(({ seatCanonicalTrajectoryHash }) => seatCanonicalTrajectoryHash));
  const openings = countValues(games.map(({ openingStateKey }) => openingStateKey));
  const phaseCounts = observations.reduce((counts, { phase }) => {
    counts[phase] = (counts[phase] || 0) + 1;
    return counts;
  }, {});
  const conditionCounts = games.reduce((counts, { conditionId }) => {
    counts[conditionId] = (counts[conditionId] || 0) + 1;
    return counts;
  }, {});
  const withinTrajectoryRepeatedRulePositions = games.reduce((total, game) => {
    const keys = game.observations.map(({ identity }) => identity.ruleStateKey);
    return total + keys.length - new Set(keys).size;
  }, 0);
  const historicalLargest = largestGroup(historicalTrajectories);
  return {
    games: games.length,
    observations: observations.length,
    terminalObservations: observations.filter(({ terminal }) => terminal).length,
    phaseCounts,
    conditionCounts,
    positions: {
      raw: observations.length,
      uniqueRuleState: new Set(ruleKeys).size,
      duplicateRuleStateSlots: ruleKeys.length - new Set(ruleKeys).size,
      uniqueSeatCanonical: new Set(canonicalKeys).size,
      seatCanonicalCollapse: new Set(ruleKeys).size - new Set(canonicalKeys).size,
      withinTrajectoryRepeatedRulePositions,
    },
    trajectories: {
      uniqueHistorical: historicalTrajectories.size,
      uniqueRuleState: ruleTrajectories.size,
      uniqueSeatCanonical: canonicalTrajectories.size,
      largestHistoricalGroup: historicalLargest,
      dominantHistoricalTrajectoryRate: games.length ? historicalLargest / games.length : 0,
    },
    openings: {
      uniqueRuleState: openings.size,
      largestGroup: largestGroup(openings),
      dominantRate: games.length ? largestGroup(openings) / games.length : 0,
    },
  };
}

function readExistingGame(filePath, configHash) {
  if (!fs.existsSync(filePath)) return null;
  const game = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (game.configHash !== configHash) throw new Error(`Config hash mismatch in ${filePath}`);
  return game;
}

function status(output) {
  const manifestPath = path.join(output, "manifest.json");
  if (fs.existsSync(manifestPath)) return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const gamesDir = path.join(output, "games");
  const games = fs.existsSync(gamesDir)
    ? fs.readdirSync(gamesDir).filter((name) => /^game-\d+\.json$/.test(name)).length
    : 0;
  return { status: "incomplete", output, completedGameFiles: games };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const output = path.resolve(options.output);
  if (options.status) {
    console.log(JSON.stringify(status(output), null, 2));
    return;
  }
  const source = provenance();
  if (source.sourceTreeDirty) {
    throw new Error("Stage 1 pilot requires a clean source tree for reproducible provenance");
  }
  const config = experimentConfig(options);
  config.instrumentationHash = hashValue(source.sourceFileSha256);
  const configHash = hashValue(config);
  const games = [];
  for (let gameIndex = 0; gameIndex < config.games; gameIndex += 1) {
    const file = gamePath(output, gameIndex);
    let game = options.force ? null : readExistingGame(file, configHash);
    if (!game) {
      game = runGame(config, gameIndex);
      atomicWriteJson(file, game);
    }
    games.push(game);
    console.log(`[position-typology stage1 pilot] ${gameIndex + 1}/${config.games} ${game.gameId}`);
  }
  const summary = summarizeGames(games);
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage1-exploratory-pilot-complete",
    formalExperiment: false,
    exploratory: true,
    confirmatoryUseAllowed: false,
    exploratoryAnalysisAuthorizedAfterVerification: true,
    output,
    config,
    configHash,
    provenance: source,
    completedGames: games.length,
    summary,
    summaryHash: hashValue(summary),
  };
  atomicWriteJson(path.join(output, "manifest.json"), manifest);
  console.log(JSON.stringify(manifest, null, 2));
}

if (require.main === module) main();

module.exports = {
  CONDITIONS,
  SOURCE_FILES,
  experimentConfig,
  parseArgs,
  provenance,
  runGame,
  sourceFileHashes,
  summarizeGames,
};
