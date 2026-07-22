#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const {
  extractPhaseTransitionFeatures,
  stateHash,
} = require("./lib/phase-transition-features.js");

const PROFILES = {
  "diversity-smoke": {
    games: 10,
    output: "artifacts/phase-transition/diversity-smoke",
    gameIdPrefix: "pt-diversity",
    studyVersion: "0.3.0",
    validateOpening: false,
  },
  pilot: {
    games: 100,
    output: "artifacts/phase-transition/pilot",
    gameIdPrefix: "pt-pilot",
    studyVersion: "0.3.0",
    validateOpening: false,
  },
  "pilot-v2": {
    games: 100,
    output: "artifacts/phase-transition/pilot-v2",
    gameIdPrefix: "pt-pilot-v2",
    studyVersion: "0.4.1",
    validateOpening: true,
  },
};

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

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    profile: "diversity-smoke",
    games: null,
    seed: 20260721,
    maxPly: 180,
    openingPlies: 6,
    openingMaxAttempts: 100,
    baselineGames: 1,
    level: "hard",
    evaluationProfile: "bao",
    searchProfile: "phase2",
    maxDepth: 2,
    output: null,
    force: false,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--force") { options.force = true; continue; }
    if (arg === "--status") { options.status = true; continue; }
    if (arg === "--profile") options.profile = value;
    else if (arg === "--games") options.games = integerArg(value, arg, 1);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--max-ply") options.maxPly = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = integerArg(value, arg, 0);
    else if (arg === "--opening-max-attempts") options.openingMaxAttempts = integerArg(value, arg, 1);
    else if (arg === "--baseline-games") options.baselineGames = integerArg(value, arg, 0);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--level") options.level = value;
    else if (arg === "--evaluation-profile") options.evaluationProfile = value;
    else if (arg === "--search-profile") options.searchProfile = value;
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!Object.hasOwn(PROFILES, options.profile)) {
    throw new Error(`Invalid profile: ${options.profile}`);
  }
  const defaults = PROFILES[options.profile];
  options.games ??= defaults.games;
  options.output ??= defaults.output;
  if (!["easy", "normal", "hard", "expert"].includes(options.level)) {
    throw new Error(`Invalid level: ${options.level}`);
  }
  if (options.baselineGames > options.games) {
    throw new Error("--baseline-games cannot exceed --games");
  }
  return options;
}

function sourceCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function experimentConfig(options) {
  const profile = PROFILES[options.profile];
  const opening = {
    policy: "seeded-legal-random",
    plies: options.openingPlies,
    baselineGames: options.baselineGames,
  };
  if (profile.validateOpening) {
    opening.validation = {
      policy: "non-terminal-front-occupied",
      maxAttempts: options.openingMaxAttempts,
      requireWinnerNull: true,
      requireLegalMove: true,
      minimumOccupiedFrontPitsPerPlayer: 1,
    };
  }
  return {
    study: "phase-transition",
    studyVersion: profile.studyVersion,
    schemaVersion: "1.0.0",
    profile: options.profile,
    games: options.games,
    baseSeed: options.seed,
    maxPly: options.maxPly,
    opening,
    condition: {
      id: "C0",
      level: options.level,
      evaluator: options.evaluationProfile,
      search: options.searchProfile,
      maxDepth: options.maxDepth,
      timeLimitMs: null,
    },
  };
}

function atomicWrite(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filePath);
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function chooseOpeningMove(state, random) {
  const moves = E.moveVariants(state);
  if (!moves.length) return null;
  return moves[Math.floor(random() * moves.length)];
}

function analyzeAiMove(state, config, random) {
  return AI.analyzeMove(state, config.condition.level, random, {
    timeLimitMs: Infinity,
    maxDepth: config.condition.maxDepth,
    evaluationProfile: config.condition.evaluator,
    searchProfile: config.condition.search,
  });
}

function openingAttemptSeed(seed, attempt) {
  return (seed + Math.imul(attempt - 1, 0x9E3779B1)) >>> 0;
}

function inspectOpening(state) {
  if (state.winner !== null) return { valid: false, reason: `terminal:${state.reason || "winner"}` };
  if (!E.moveVariants(state).length) return { valid: false, reason: "no-legal-move" };
  const features = extractPhaseTransitionFeatures(state, {
    gameId: "opening-validation",
    conditionId: "opening-validation",
    seed: 0,
    ply: 0,
    previousStateHash: null,
  });
  if (features.frontRow.occupiedPits.some((count) => count < 1)) {
    return { valid: false, reason: "front-empty" };
  }
  return { valid: true, reason: null };
}

function createOpeningPlan(config, gameIndex, seed) {
  const isBaseline = gameIndex < config.opening.baselineGames;
  if (isBaseline || config.opening.plies === 0) {
    return {
      moves: [],
      attempt: 0,
      seed,
      rejectedCount: 0,
      rejectionReasons: {},
    };
  }
  const validation = config.opening.validation;
  const maxAttempts = validation?.maxAttempts ?? 1;
  const rejectionReasons = {};
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const candidateSeed = validation ? openingAttemptSeed(seed, attempt) : seed;
    const random = seededRandom(candidateSeed);
    let state = E.initialState();
    const moves = [];
    let failure = null;
    for (let ply = 0; ply < config.opening.plies; ply += 1) {
      if (state.winner !== null) { failure = `terminal:${state.reason || "winner"}`; break; }
      const move = chooseOpeningMove(state, random);
      if (!move) { failure = "no-legal-move"; break; }
      moves.push(move);
      state = E.applyMove(state, move).state;
    }
    const inspection = failure ? { valid: false, reason: failure }
      : (validation ? inspectOpening(state) : { valid: true, reason: null });
    if (inspection.valid) {
      return {
        moves,
        attempt,
        seed: candidateSeed,
        rejectedCount: attempt - 1,
        rejectionReasons,
      };
    }
    rejectionReasons[inspection.reason] = (rejectionReasons[inspection.reason] || 0) + 1;
  }
  throw new Error(`Unable to create valid opening for game ${gameIndex} after ${maxAttempts} attempts`);
}

function runGame(config, gameIndex) {
  const seed = config.baseSeed + gameIndex;
  const prefix = PROFILES[config.profile].gameIdPrefix;
  const gameId = `${prefix}-${String(gameIndex).padStart(4, "0")}`;
  const isBaseline = gameIndex < config.opening.baselineGames;
  const openingPlan = createOpeningPlan(config, gameIndex, seed);
  const random = seededRandom(openingPlan.seed);
  for (let index = 0; index < openingPlan.moves.length; index += 1) random();
  let state = E.initialState();
  let previousStateHash = null;
  const observations = [];
  const moves = [];
  const trajectory = [];
  let openingPliesApplied = 0;
  let openingStateHash = stateHash(state);

  for (let ply = 0; ply <= config.maxPly; ply += 1) {
    const observation = extractPhaseTransitionFeatures(state, {
      gameId,
      conditionId: config.condition.id,
      seed,
      ply,
      previousStateHash,
    });
    observations.push(observation);
    trajectory.push(observation.stateHash);
    if (state.winner !== null || ply === config.maxPly) break;

    const useOpening = !isBaseline && ply < openingPlan.moves.length;
    let move;
    let search = null;
    let source;
    if (useOpening) {
      move = openingPlan.moves[ply];
      source = "opening-random";
      openingPliesApplied += 1;
    } else {
      const analysis = analyzeAiMove(state, config, random);
      move = analysis.move;
      source = "ai-c0";
      search = {
        completedDepth: analysis.stats?.completedDepth ?? null,
        nodes: analysis.stats?.nodes ?? null,
        timedOut: Boolean(analysis.stats?.timedOut),
      };
    }
    if (!move) break;

    const beforeHash = observation.stateHash;
    const result = E.applyMove(state, move);
    moves.push({
      ply,
      player: state.player,
      source,
      move,
      beforeStateHash: beforeHash,
      afterStateHash: stateHash(result.state),
      search,
    });
    previousStateHash = beforeHash;
    state = result.state;
    if (openingPliesApplied === openingPlan.moves.length) openingStateHash = stateHash(state);
  }

  if (isBaseline || openingPliesApplied === 0) openingStateHash = observations[0].stateHash;
  return {
    gameId,
    gameIndex,
    seed,
    conditionId: config.condition.id,
    baseline: isBaseline,
    openingPliesApplied,
    openingStateHash,
    openingAttempt: openingPlan.attempt,
    openingSeed: openingPlan.seed,
    openingRejectedCount: openingPlan.rejectedCount,
    openingRejectionReasons: openingPlan.rejectionReasons,
    initialStateHash: observations[0].stateHash,
    finalStateHash: observations.at(-1).stateHash,
    trajectoryHash: sha256(trajectory.join("\n")),
    winner: state.winner,
    reason: state.reason || (moves.length >= config.maxPly ? "max-ply" : "no-move"),
    plies: moves.length,
    observations,
    moves,
  };
}

function readCompletedGame(filePath, configHash) {
  if (!fs.existsSync(filePath)) return null;
  const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (value.configHash !== configHash) {
    throw new Error(`Existing game has a different config hash: ${filePath}`);
  }
  return value;
}

function diversitySummary(games) {
  const trajectoryCounts = new Map();
  const finalStateCounts = new Map();
  const winnerCounts = { south: 0, north: 0, draw: 0 };
  const plyCounts = new Map();
  for (const game of games) {
    trajectoryCounts.set(game.trajectoryHash, (trajectoryCounts.get(game.trajectoryHash) || 0) + 1);
    finalStateCounts.set(game.finalStateHash, (finalStateCounts.get(game.finalStateHash) || 0) + 1);
    if (game.winner === 0) winnerCounts.south += 1;
    else if (game.winner === 1) winnerCounts.north += 1;
    else winnerCounts.draw += 1;
    plyCounts.set(game.plies, (plyCounts.get(game.plies) || 0) + 1);
  }
  const largestTrajectoryGroup = Math.max(0, ...trajectoryCounts.values());
  const uniqueTrajectoryCount = trajectoryCounts.size;
  const uniqueFinalStateCount = finalStateCounts.size;
  const uniquePlyCount = plyCounts.size;
  const dominantTrajectoryRate = games.length ? largestTrajectoryGroup / games.length : 0;
  return {
    uniqueTrajectoryCount,
    uniqueFinalStateCount,
    uniquePlyCount,
    duplicateTrajectoryCount: games.length - uniqueTrajectoryCount,
    largestTrajectoryGroup,
    dominantTrajectoryRate,
    winnerCounts,
    plyDistribution: Object.fromEntries([...plyCounts.entries()].sort((a, b) => a[0] - b[0])),
    passesPilotGate: uniqueTrajectoryCount >= 2
      && dominantTrajectoryRate <= 0.5
      && (uniquePlyCount >= 2 || uniqueFinalStateCount >= 2),
  };
}

function openingQualitySummary(games) {
  const rejectionReasons = {};
  let rejectedOpenings = 0;
  let gamesWithRetries = 0;
  let maximumAttempt = 0;
  for (const game of games) {
    rejectedOpenings += game.openingRejectedCount || 0;
    if ((game.openingRejectedCount || 0) > 0) gamesWithRetries += 1;
    maximumAttempt = Math.max(maximumAttempt, game.openingAttempt || 0);
    for (const [reason, count] of Object.entries(game.openingRejectionReasons || {})) {
      rejectionReasons[reason] = (rejectionReasons[reason] || 0) + count;
    }
  }
  return {
    rejectedOpenings,
    gamesWithRetries,
    maximumAttempt,
    rejectionReasons,
    acceptedEarlyTerminalCount: games.filter((game) => !game.baseline && game.plies <= game.openingPliesApplied + 1).length,
  };
}

function aggregate(output, config, configHash, games, commit) {
  const observations = games.flatMap((game) => game.observations);
  const jsonl = `${observations.map((value) => JSON.stringify(value)).join("\n")}\n`;
  const gameSummaries = games.map(({ observations: ignoredObservations, moves: ignoredMoves, ...summary }) => summary);
  const gamesJson = `${JSON.stringify(gameSummaries, null, 2)}\n`;
  atomicWrite(path.join(output, "observations.jsonl"), jsonl);
  atomicWrite(path.join(output, "games.json"), gamesJson);
  const manifest = {
    study: config.study,
    studyVersion: config.studyVersion,
    schemaVersion: config.schemaVersion,
    profile: config.profile,
    config,
    configHash,
    sourceCommit: commit,
    nodeVersion: process.version,
    completedGames: games.length,
    observationCount: observations.length,
    diversity: diversitySummary(games),
    openingQuality: openingQualitySummary(games),
    files: {
      "observations.jsonl": { sha256: sha256(jsonl), bytes: Buffer.byteLength(jsonl) },
      "games.json": { sha256: sha256(gamesJson), bytes: Buffer.byteLength(gamesJson) },
    },
  };
  atomicWrite(path.join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function runResearch(options) {
  const output = path.resolve(options.output);
  const config = experimentConfig(options);
  const configHash = sha256(canonicalJson(config));
  const commit = sourceCommit();
  if (options.force && fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(path.join(output, "games"), { recursive: true });

  if (options.status) {
    const completed = Array.from({ length: config.games }, (_, index) => gamePath(output, index))
      .filter((filePath) => fs.existsSync(filePath)).length;
    return { output, completed, total: config.games, configHash };
  }

  const games = [];
  for (let gameIndex = 0; gameIndex < config.games; gameIndex += 1) {
    const filePath = gamePath(output, gameIndex);
    let game = readCompletedGame(filePath, configHash);
    if (!game) {
      game = { configHash, sourceCommit: commit, ...runGame(config, gameIndex) };
      atomicWrite(filePath, `${JSON.stringify(game, null, 2)}\n`);
      console.log(`completed ${game.gameId}: ${game.plies} ply, winner=${game.winner}, openingAttempt=${game.openingAttempt}, trajectory=${game.trajectoryHash.slice(0, 12)}`);
    } else {
      console.log(`skipped ${game.gameId}: already complete`);
    }
    games.push(game);
  }
  const manifest = aggregate(output, config, configHash, games, commit);
  return { output, completed: games.length, total: config.games, configHash, manifest };
}

if (require.main === module) {
  try {
    const result = runResearch(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  PROFILES,
  aggregate,
  canonicalJson,
  createOpeningPlan,
  diversitySummary,
  experimentConfig,
  inspectOpening,
  openingAttemptSeed,
  openingQualitySummary,
  parseArgs,
  runGame,
  runResearch,
  seededRandom,
  sha256,
};
