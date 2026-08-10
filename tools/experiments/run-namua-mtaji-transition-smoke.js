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
const { summarizeTemporalOutcome } = require("./lib/namua-mtaji-transition-features.js");

const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/symmetry/transform-candidates.js",
  "tools/experiments/lib/phase-transition-features.js",
  "tools/experiments/lib/forced-capture-regimes.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/namua-mtaji-transition-features.js",
  "tools/experiments/run-namua-mtaji-transition-smoke.js",
  "tools/experiments/verify-namua-mtaji-transition-smoke.js",
  "tools/experiments/audit-namua-mtaji-mtaji-artifact.py",
  "schemas/position-typology-observation.schema.json",
  "schemas/namua-mtaji-transition-observation.schema.json",
  "schemas/namua-mtaji-transition-game.schema.json",
]);

const CONDITIONS = Object.freeze([
  { id: "P2-D1", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 1 },
  { id: "P2-D2", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 2 },
  { id: "LG-D2", level: "hard", evaluator: "bao", search: "legacy", maxDepth: 2 },
  { id: "V2-D2", level: "hard", evaluator: "bao-v2", search: "phase2", maxDepth: 2 },
]);

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    games: 8,
    seed: 20260810,
    maxPly: 100,
    openingPlies: 8,
    output: "artifacts/local/namua-mtaji-transition/stage0-smoke-v1",
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
    study: "namua-mtaji-temporal-transition",
    stage: "stage0-technical-smoke",
    schemaVersion: 1,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    candidateDiscoveryAuthorized: false,
    games: options.games,
    baseSeed: options.seed,
    maxPly: options.maxPly,
    opening: { policy: "seeded-uniform-legal", plies: options.openingPlies },
    conditions: CONDITIONS,
    boundaries: {
      closedStudyDefinitionsModified: false,
      formalEndpointFrozen: false,
      formalComparatorFrozen: false,
      formalSeedBlockFrozen: false,
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
  const gameId = `nmt-s0-${String(gameIndex).padStart(4, "0")}`;
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

    const before = identityKeys(state);
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
      phaseTransitionOccurred: result.events.some(({ kind }) => kind === "phase"),
      eventKinds: result.events.map(({ kind }) => kind),
      secondarySearch,
    });
    state = result.state;
  }

  const historicalSequence = observations.map(({ identity }) => identity.historicalStateHash);
  const ruleSequence = observations.map(({ identity }) => identity.ruleStateKey);
  const canonicalSequence = observations.map(({ identity }) => identity.seatCanonicalKey);
  const openingObservation = observations[Math.min(config.opening.plies, observations.length - 1)];
  const temporalOutcome = summarizeTemporalOutcome(observations, config.maxPly);

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
    seatCanonicalTrajectoryHash: hashValue(canonicalSequence),
    finalHistoricalStateHash: historicalSequence.at(-1),
    finalRuleStateKey: ruleSequence.at(-1),
    winner: state.winner,
    reason: state.reason || (temporalOutcome.administrativeTruncation ? "max-ply" : "no-move"),
    plies: moves.length,
    temporalOutcome,
  };
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function summarizeGames(games) {
  const trajectories = countValues(games.map(({ historicalTrajectoryHash }) => historicalTrajectoryHash));
  const largestTrajectoryGroup = trajectories.size ? Math.max(...trajectories.values()) : 0;
  return {
    games: games.length,
    observations: games.reduce((total, game) => total + game.observations.length, 0),
    uniqueHistoricalTrajectories: trajectories.size,
    largestTrajectoryGroup,
    dominantTrajectoryRate: games.length ? largestTrajectoryGroup / games.length : 0,
    reachedMtajiGames: games.filter(({ temporalOutcome }) => temporalOutcome.reachedMtaji).length,
    firstMtajiMorphologyEligibleGames: games.filter(({ temporalOutcome }) => temporalOutcome.firstMtajiMorphologyEligible).length,
    terminalBeforeMtajiGames: games.filter(({ temporalOutcome }) => temporalOutcome.terminalBeforeMtaji).length,
    administrativeTruncationGames: games.filter(({ temporalOutcome }) => temporalOutcome.administrativeTruncation).length,
    phaseTransitionEventGames: games.filter((game) => game.moves.some(({ phaseTransitionOccurred }) => phaseTransitionOccurred)).length,
    conditionCounts: Object.fromEntries(CONDITIONS.map(({ id }) => [
      id,
      games.filter(({ conditionId }) => conditionId === id).length,
    ])),
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
  const completedGameFiles = fs.existsSync(gamesDir)
    ? fs.readdirSync(gamesDir).filter((name) => /^game-\d+\.json$/.test(name)).length
    : 0;
  return { status: "incomplete", output, completedGameFiles };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const output = path.resolve(options.output);
  if (options.status) {
    console.log(JSON.stringify(status(output), null, 2));
    return;
  }
  if (options.force && fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true });

  const source = provenance();
  const config = experimentConfig(options);
  config.instrumentationHash = hashValue(source.sourceFileSha256);
  const configHash = hashValue(config);
  const games = [];

  for (let gameIndex = 0; gameIndex < config.games; gameIndex += 1) {
    const file = gamePath(output, gameIndex);
    let game = readExistingGame(file, configHash);
    if (!game) {
      game = runGame(config, gameIndex);
      atomicWriteJson(file, game);
    }
    games.push(game);
    console.log(`[Namua-Mtaji Stage 0] ${gameIndex + 1}/${config.games} ${game.gameId}`);
  }

  const summary = summarizeGames(games);
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage0-technical-smoke-complete",
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    candidateDiscoveryAuthorized: false,
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
