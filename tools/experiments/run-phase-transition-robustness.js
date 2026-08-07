#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const Research = require("./run-phase-transition-research.js");
const Robustness = require("./lib/phase-transition-robustness.js");

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) {
    throw new Error(`Invalid ${name}: ${value}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-robustness-v1.json",
    condition: "all",
    output: "artifacts/phase-transition/robustness-v1",
    fixtureGames: null,
    force: false,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--force") {
      options.force = true;
      continue;
    }
    if (arg === "--status") {
      options.status = true;
      continue;
    }
    if (!value) throw new Error(`Missing value for ${arg}`);
    if (arg === "--config") options.config = value;
    else if (arg === "--condition") options.condition = value;
    else if (arg === "--output") options.output = value;
    else if (arg === "--fixture-games") options.fixtureGames = integerArg(value, arg, 1);
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
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

function atomicWrite(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filePath);
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function readCompletedGame(filePath, configHash) {
  if (!fs.existsSync(filePath)) return null;
  const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (value.configHash !== configHash) {
    throw new Error(`Existing game has a different config hash: ${filePath}`);
  }
  return value;
}

function openingBoundaryHash(game) {
  const openingPlies = Number.isInteger(game.openingPliesApplied)
    ? game.openingPliesApplied : 0;
  if (openingPlies <= 0) return game.initialStateHash;
  return game.moves?.[openingPlies - 1]?.afterStateHash || game.initialStateHash;
}

function normalizeGameIdentity(game, condition) {
  const gameId = `pt-e011-${condition.id.toLowerCase()}-${String(game.gameIndex).padStart(4, "0")}`;
  game.gameId = gameId;
  game.conditionId = condition.id;
  game.openingStateHash = openingBoundaryHash(game);
  for (const observation of game.observations) {
    observation.gameId = gameId;
    observation.conditionId = condition.id;
  }
  for (const move of game.moves) {
    if (move.source?.startsWith("ai-")) move.source = `ai-${condition.id.toLowerCase()}`;
  }
  return game;
}

function conditionOptions(preregistration, condition, output, games) {
  const corpus = preregistration.corpus;
  return {
    profile: corpus.profile,
    games,
    seed: corpus.sharedBaseSeed,
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

function buildConditionConfig(preregistration, condition, games, mode, preregistrationHash) {
  const base = Research.experimentConfig(
    conditionOptions(preregistration, condition, "", games),
  );
  base.condition.id = condition.id;
  base.experiment = {
    experimentId: preregistration.experimentId,
    analysisVersion: preregistration.analysisVersion,
    preregistrationStatus: preregistration.status,
    preregistrationConfigSha256: preregistrationHash,
  };
  base.execution = {
    mode,
    plannedGamesPerCondition: preregistration.corpus.gamesPerCondition,
    actualGames: games,
    pairedOpeningSeedsAcrossConditions:
      preregistration.corpus.pairedOpeningSeedsAcrossConditions,
  };
  return base;
}

function runCondition(loaded, condition, options) {
  const fixture = options.fixtureGames !== null;
  const games = fixture
    ? options.fixtureGames
    : loaded.config.corpus.gamesPerCondition;
  if (fixture && games > loaded.config.corpus.gamesPerCondition) {
    throw new Error("--fixture-games cannot exceed preregistered gamesPerCondition");
  }
  const mode = fixture ? "fixture" : "formal";
  const output = path.resolve(options.output, condition.id);
  const config = buildConditionConfig(
    loaded.config,
    condition,
    games,
    mode,
    loaded.sha256,
  );
  const configHash = Research.sha256(Research.canonicalJson(config));
  const commit = sourceCommit();

  if (options.force && fs.existsSync(output)) {
    fs.rmSync(output, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(output, "games"), { recursive: true });

  if (options.status) {
    const completed = Array.from({ length: games }, (_, index) => gamePath(output, index))
      .filter((filePath) => fs.existsSync(filePath)).length;
    return {
      conditionId: condition.id,
      mode,
      output,
      completed,
      total: games,
      configHash,
    };
  }

  const completedGames = [];
  for (let gameIndex = 0; gameIndex < games; gameIndex += 1) {
    const filePath = gamePath(output, gameIndex);
    let game = readCompletedGame(filePath, configHash);
    if (!game) {
      game = normalizeGameIdentity(Research.runGame(config, gameIndex), condition);
      game = { configHash, sourceCommit: commit, ...game };
      atomicWrite(filePath, `${JSON.stringify(game, null, 2)}\n`);
      console.log(
        `completed ${game.gameId}: ${game.plies} ply, winner=${game.winner}, `
        + `openingAttempt=${game.openingAttempt}, trajectory=${game.trajectoryHash.slice(0, 12)}`,
      );
    } else {
      console.log(`skipped ${game.gameId}: already complete`);
    }
    completedGames.push(game);
  }

  const manifest = Research.aggregate(output, config, configHash, completedGames, commit);
  return {
    conditionId: condition.id,
    mode,
    output,
    completed: completedGames.length,
    total: games,
    configHash,
    manifest,
  };
}

function selectedConditions(config, value) {
  if (value === "all") return config.conditions;
  return [Robustness.conditionById(config, value)];
}

function run(options) {
  const loaded = Robustness.loadPreregistration(options.config);
  const conditions = selectedConditions(loaded.config, options.condition);
  const results = conditions.map((condition) => runCondition(loaded, condition, options));
  const summary = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    preregistrationConfigSha256: loaded.sha256,
    conditionCount: results.length,
    results,
  };
  const summaryPath = path.resolve(options.output, "runner-summary.json");
  atomicWrite(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}

if (require.main === module) {
  try {
    console.log(JSON.stringify(run(parseArgs(process.argv.slice(2))), null, 2));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildConditionConfig,
  conditionOptions,
  normalizeGameIdentity,
  openingBoundaryHash,
  parseArgs,
  run,
  runCondition,
  selectedConditions,
};
