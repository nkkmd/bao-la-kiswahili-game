#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const Research = require("./run-phase-transition-research.js");
const E019 = require("./lib/phase-transition-search-profile-generalization.js");

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-generalization-v2.json",
    condition: "all",
    output: "artifacts/phase-transition/search-profile-generalization-v2-fixture",
    fixtureGames: null,
    fixtureBaseSeed: 20267101,
    force: false,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") { options.force = true; continue; }
    if (arg === "--status") { options.status = true; continue; }
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${arg}`);
    if (arg === "--config") options.config = value;
    else if (arg === "--condition") options.condition = value;
    else if (arg === "--output") options.output = value;
    else if (arg === "--fixture-games") options.fixtureGames = integerArg(value, arg, 1);
    else if (arg === "--fixture-base-seed") options.fixtureBaseSeed = integerArg(value, arg, 0);
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (options.fixtureGames === null) {
    throw new Error("E-019 public runner is fixture-only; --fixture-games is required. Formal execution is available only through the separately guarded formal runner.");
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

function normalizeCondition(config, conditionId) {
  const condition = E019.conditionById(config, conditionId);
  const stratum = E019.stratumById(config, condition.stratumId);
  return {
    id: condition.conditionId,
    stratumId: stratum.stratumId,
    level: config.corpus.level,
    evaluationProfile: stratum.evaluationProfile,
    searchProfile: condition.searchProfile,
    maxDepth: stratum.maxDepth,
    pairedSeeds: stratum.pairedSeeds,
    seedRange: stratum.seedRange,
  };
}

function normalizeGameIdentity(game, condition) {
  const gameId = `pt-e019-${condition.id.toLowerCase()}-${String(game.gameIndex).padStart(4, "0")}`;
  game.gameId = gameId;
  game.conditionId = condition.id;
  game.stratumId = condition.stratumId;
  game.openingStateHash = openingBoundaryHash(game);
  for (const observation of game.observations) {
    observation.gameId = gameId;
    observation.conditionId = condition.id;
    observation.stratumId = condition.stratumId;
  }
  for (const move of game.moves) {
    if (move.source?.startsWith("ai-")) move.source = `ai-e019-${condition.id.toLowerCase()}`;
  }
  return game;
}

function conditionOptions(preregistration, condition, games, baseSeed) {
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
    output: "",
    force: false,
    status: false,
  };
}

function buildConditionConfig(preregistration, condition, games, baseSeed, preregistrationHash, mode = "fixture") {
  if (!new Set(["fixture", "formal"]).has(mode)) throw new Error(`Invalid E-019 execution mode: ${mode}`);
  const base = Research.experimentConfig(conditionOptions(preregistration, condition, games, baseSeed));
  base.condition.id = condition.id;
  base.experiment = {
    experimentId: preregistration.experimentId,
    analysisVersion: preregistration.analysisVersion,
    preregistrationStatus: preregistration.status,
    preregistrationConfigSha256: preregistrationHash,
    stratumId: condition.stratumId,
  };
  base.execution = {
    mode,
    plannedGamesPerCondition: condition.pairedSeeds,
    actualGames: games,
    pairedOpeningRequiredWithinStratum: preregistration.corpus.pairedOpeningRequiredWithinStratum,
    formalExecutionApproved: mode === "formal",
  };
  return base;
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function runCondition(loaded, conditionId, options, mode = "fixture") {
  const condition = normalizeCondition(loaded.config, conditionId);
  const games = mode === "formal" ? condition.pairedSeeds : options.fixtureGames;
  const baseSeed = mode === "formal" ? condition.seedRange[0] : options.fixtureBaseSeed;
  if (mode === "fixture") {
    if (!Number.isInteger(games) || games < 1) throw new Error("fixture mode requires fixtureGames >= 1");
    if (!E019.fixtureRangeAllowed(loaded.config, baseSeed, games)) throw new Error("Fixture seed range overlaps prior or E-019 formal seed blocks");
  }
  if (games > condition.pairedSeeds) throw new Error(`${condition.id}: requested games exceed preregistered paired sample size`);
  const output = path.resolve(options.output, condition.id);
  const config = buildConditionConfig(loaded.config, condition, games, baseSeed, loaded.sha256, mode);
  const configHash = Research.sha256(Research.canonicalJson(config));
  const commit = sourceCommit();

  if (options.force && fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(path.join(output, "games"), { recursive: true });
  if (options.status) {
    const completed = Array.from({ length: games }, (_, index) => gamePath(output, index)).filter((filePath) => fs.existsSync(filePath)).length;
    return { conditionId: condition.id, stratumId: condition.stratumId, mode, completed, total: games, configHash };
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
  return { conditionId: condition.id, stratumId: condition.stratumId, mode, output, completed: completedGames.length, total: games, configHash, manifest };
}

function selectedConditionIds(config, value) {
  if (value === "all") return E019.allConditions(config).map((condition) => condition.conditionId);
  E019.conditionById(config, value);
  return [value];
}

function run(options) {
  const loaded = E019.loadPreregistration(options.config);
  const ids = selectedConditionIds(loaded.config, options.condition);
  const results = ids.map((id) => runCondition(loaded, id, options, "fixture"));
  const summary = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    mode: "fixture",
    fixtureBaseSeed: options.fixtureBaseSeed,
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
  selectedConditionIds,
  sourceCommit,
};
