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
    games: 10,
    seed: 20260721,
    maxPly: 180,
    level: "hard",
    evaluationProfile: "bao",
    searchProfile: "phase2",
    maxDepth: 2,
    output: "artifacts/phase-transition/smoke",
    force: false,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--force") { options.force = true; continue; }
    if (arg === "--status") { options.status = true; continue; }
    if (arg === "--games") options.games = integerArg(value, arg, 1);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--max-ply") options.maxPly = integerArg(value, arg, 1);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--level") options.level = value;
    else if (arg === "--evaluation-profile") options.evaluationProfile = value;
    else if (arg === "--search-profile") options.searchProfile = value;
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!['easy', 'normal', 'hard', 'expert'].includes(options.level)) {
    throw new Error(`Invalid level: ${options.level}`);
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
  return {
    study: "phase-transition",
    studyVersion: "0.1.0",
    schemaVersion: "1.0.0",
    profile: "smoke",
    games: options.games,
    baseSeed: options.seed,
    maxPly: options.maxPly,
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

function runGame(config, gameIndex) {
  const seed = config.baseSeed + gameIndex;
  const random = seededRandom(seed);
  const gameId = `pt-smoke-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  let previousStateHash = null;
  const observations = [];
  const moves = [];

  for (let ply = 0; ply <= config.maxPly; ply += 1) {
    const observation = extractPhaseTransitionFeatures(state, {
      gameId,
      conditionId: config.condition.id,
      seed,
      ply,
      previousStateHash,
    });
    observations.push(observation);
    if (state.winner !== null || ply === config.maxPly) break;

    const analysis = AI.analyzeMove(state, config.condition.level, random, {
      timeLimitMs: Infinity,
      maxDepth: config.condition.maxDepth,
      evaluationProfile: config.condition.evaluator,
      searchProfile: config.condition.search,
    });
    if (!analysis.move) break;
    const beforeHash = observation.stateHash;
    const result = E.applyMove(state, analysis.move);
    moves.push({
      ply,
      player: state.player,
      move: analysis.move,
      beforeStateHash: beforeHash,
      afterStateHash: stateHash(result.state),
      search: {
        completedDepth: analysis.stats?.completedDepth ?? null,
        nodes: analysis.stats?.nodes ?? null,
        timedOut: Boolean(analysis.stats?.timedOut),
      },
    });
    previousStateHash = beforeHash;
    state = result.state;
  }

  return {
    gameId,
    gameIndex,
    seed,
    conditionId: config.condition.id,
    initialStateHash: observations[0].stateHash,
    finalStateHash: observations.at(-1).stateHash,
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
      console.log(`completed ${game.gameId}: ${game.plies} ply, winner=${game.winner}`);
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
  aggregate,
  canonicalJson,
  experimentConfig,
  parseArgs,
  runGame,
  runResearch,
  seededRandom,
  sha256,
};
