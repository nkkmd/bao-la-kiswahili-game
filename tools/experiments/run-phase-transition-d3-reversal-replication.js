#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const Research = require("./run-phase-transition-research.js");
const E020 = require("./lib/phase-transition-d3-reversal-replication.js");

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-d3-reversal-replication-v1.json",
    condition: "all",
    output: "artifacts/phase-transition/d3-reversal-replication-v1-fixture",
    fixtureGames: null,
    fixtureBaseSeed: null,
    force: false,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--force") { options.force = true; continue; }
    if (arg === "--status") { options.status = true; continue; }
    if (!value) throw new Error(`Missing value for ${arg}`);
    if (arg === "--config") options.config = value;
    else if (arg === "--condition") options.condition = value;
    else if (arg === "--output") options.output = value;
    else if (arg === "--fixture-games") options.fixtureGames = integerArg(value, arg, 1);
    else if (arg === "--fixture-base-seed") options.fixtureBaseSeed = integerArg(value, arg, 0);
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (options.fixtureGames === null || options.fixtureBaseSeed === null) {
    throw new Error("E-020 public runner is fixture-only; --fixture-games and --fixture-base-seed are required. Formal execution is available only through the guarded formal runner.");
  }
  return options;
}

function sourceCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try { return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(); }
  catch { return "unknown"; }
}

function atomicWrite(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filePath);
}

function openingBoundaryHash(game) {
  const openingPlies = Number.isInteger(game.openingPliesApplied) ? game.openingPliesApplied : 0;
  if (openingPlies <= 0) return game.initialStateHash;
  return game.moves?.[openingPlies - 1]?.afterStateHash || game.initialStateHash;
}

function normalizeCondition(condition, corpus) {
  return {
    id: condition.conditionId,
    level: corpus.level,
    evaluationProfile: corpus.evaluationProfile,
    searchProfile: condition.searchProfile,
    maxDepth: corpus.maxDepth,
  };
}

function normalizeGameIdentity(game, condition) {
  const gameId = `pt-e020-${condition.id.toLowerCase()}-${String(game.gameIndex).padStart(4, "0")}`;
  game.gameId = gameId;
  game.conditionId = condition.id;
  game.openingStateHash = openingBoundaryHash(game);
  for (const observation of game.observations) {
    observation.gameId = gameId;
    observation.conditionId = condition.id;
  }
  for (const move of game.moves) {
    if (move.source?.startsWith("ai-")) move.source = `ai-e020-${condition.id.toLowerCase()}`;
  }
  return game;
}

function conditionOptions(preregistration, condition, output, games, baseSeed) {
  const corpus = preregistration.corpus;
  return {
    profile: corpus.profile,
    games,
    seed: baseSeed,
    maxPly: corpus.maxPly,
    openingPlies: corpus.openingPlies,
    openingMaxAttempts: 100,
    baselineGames: corpus.baselineGames,
    level: condition.level,
    evaluationProfile: condition.evaluationProfile,
    searchProfile: condition.searchProfile,
    maxDepth: condition.maxDepth,
    output,
    force: false,
    status: false,
  };
}

function buildConditionConfig(preregistration, condition, games, baseSeed, preregistrationHash, mode = "fixture") {
  if (!new Set(["fixture", "formal"]).has(mode)) throw new Error(`Invalid E-020 execution mode: ${mode}`);
  const base = Research.experimentConfig(conditionOptions(preregistration, condition, "", games, baseSeed));
  base.condition.id = condition.id;
  base.experiment = {
    experimentId: preregistration.experimentId,
    hypothesisId: preregistration.hypothesisId,
    analysisVersion: preregistration.analysisVersion,
    preregistrationStatus: preregistration.status,
    preregistrationConfigSha256: preregistrationHash,
  };
  base.execution = {
    mode,
    plannedGamesPerCondition: preregistration.corpus.gamesPerCondition,
    actualGames: games,
    baseSeed,
    pairedOpeningRequired: preregistration.corpus.pairedOpeningRequired,
    formalExecutionApproved: mode === "formal",
  };
  return base;
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function runCondition(loaded, rawCondition, options, mode = "fixture") {
  const condition = normalizeCondition(rawCondition, loaded.config.corpus);
  const games = mode === "formal" ? loaded.config.corpus.gamesPerCondition : options.fixtureGames;
  const baseSeed = mode === "formal" ? loaded.config.corpus.seedRange[0] : options.fixtureBaseSeed;
  if (!Number.isInteger(games) || games < 1) throw new Error("games must be a positive integer");
  if (!Number.isInteger(baseSeed) || baseSeed < 0) throw new Error("baseSeed must be a non-negative integer");
  if (games > loaded.config.corpus.gamesPerCondition) throw new Error("Requested games exceed preregistered gamesPerCondition");
  if (mode === "fixture") {
    const fixtureRange = [baseSeed, baseSeed + games - 1];
    if (E020.rangesOverlap(fixtureRange, loaded.config.corpus.seedRange)) {
      throw new Error("Fixture seed range must not overlap the E-020 formal seed block");
    }
  }
  const output = path.resolve(options.output, condition.id);
  const config = buildConditionConfig(loaded.config, condition, games, baseSeed, loaded.sha256, mode);
  const configHash = Research.sha256(Research.canonicalJson(config));
  const commit = sourceCommit();

  if (options.force && fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(path.join(output, "games"), { recursive: true });

  if (options.status) {
    const completed = Array.from({ length: games }, (_, index) => gamePath(output, index))
      .filter((filePath) => fs.existsSync(filePath)).length;
    return { conditionId: condition.id, mode, baseSeed, completed, total: games, configHash };
  }

  const completedGames = [];
  for (let gameIndex = 0; gameIndex < games; gameIndex += 1) {
    const filePath = gamePath(output, gameIndex);
    let game;
    if (fs.existsSync(filePath)) {
      game = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (game.configHash !== configHash) throw new Error(`Existing game has different config hash: ${filePath}`);
      if (game.sourceCommit !== commit) throw new Error(`Existing game has different source commit: ${filePath}`);
    } else {
      game = normalizeGameIdentity(Research.runGame(config, gameIndex), condition);
      game = { configHash, sourceCommit: commit, ...game };
      atomicWrite(filePath, `${JSON.stringify(game, null, 2)}\n`);
    }
    completedGames.push(game);
  }
  const manifest = Research.aggregate(output, config, configHash, completedGames, commit);
  return { conditionId: condition.id, mode, output, completed: completedGames.length, total: games, baseSeed, configHash, manifest };
}

function selectedConditions(config, value) {
  if (value === "all") return config.corpus.conditions;
  return [E020.conditionById(config, value)];
}

function run(options) {
  const loaded = E020.loadPreregistration(options.config);
  const results = selectedConditions(loaded.config, options.condition)
    .map((condition) => runCondition(loaded, condition, options, "fixture"));
  const summary = {
    experimentId: loaded.config.experimentId,
    hypothesisId: loaded.config.hypothesisId,
    analysisVersion: loaded.config.analysisVersion,
    mode: "fixture",
    preregistrationConfigSha256: loaded.sha256,
    conditionCount: results.length,
    formalExecutionApproved: false,
    results,
  };
  atomicWrite(path.resolve(options.output, "runner-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}

if (require.main === module) {
  try { console.log(JSON.stringify(run(parseArgs(process.argv.slice(2))), null, 2)); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = {
  atomicWrite,
  buildConditionConfig,
  conditionOptions,
  gamePath,
  normalizeCondition,
  normalizeGameIdentity,
  openingBoundaryHash,
  parseArgs,
  run,
  runCondition,
  selectedConditions,
  sourceCommit,
};
