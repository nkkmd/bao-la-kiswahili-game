#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
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
    input: "artifacts/phase-transition/robustness-v1",
    fixtureGames: null,
    output: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else if (key === "--fixture-games") options.fixtureGames = integerArg(value, key, 1);
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.output ||= path.join(options.input, "integrity");
  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(errors, message) {
  errors.push(message);
}

function sameJson(left, right) {
  return Robustness.canonicalJson(left) === Robustness.canonicalJson(right);
}

function verifyGameFile(filePath, condition, expectedSeed, expectedSource) {
  const game = readJson(filePath);
  const errors = [];
  if (game.conditionId !== condition.id) {
    fail(errors, `${filePath}: game conditionId mismatch`);
  }
  if (game.seed !== expectedSeed) {
    fail(errors, `${filePath}: seed mismatch`);
  }
  if (!game.gameId.startsWith(`pt-e011-${condition.id.toLowerCase()}-`)) {
    fail(errors, `${filePath}: gameId prefix mismatch`);
  }
  if (game.observations.some((row) => row.conditionId !== condition.id
      || row.gameId !== game.gameId)) {
    fail(errors, `${filePath}: observation identity mismatch`);
  }
  if (game.moves.some((move) => move.source?.startsWith("ai-")
      && move.source !== expectedSource)) {
    fail(errors, `${filePath}: AI source condition mismatch`);
  }
  return { game, errors };
}

function verify(options) {
  const loaded = Robustness.loadPreregistration(options.config);
  const expectedGames = options.fixtureGames ?? loaded.config.corpus.gamesPerCondition;
  if (expectedGames > loaded.config.corpus.gamesPerCondition) {
    throw new Error("Expected games exceed preregistered gamesPerCondition");
  }
  const input = path.resolve(options.input);
  const errors = [];
  const conditions = [];
  const configHashes = new Set();
  const sourceCommits = new Set();
  const openingHashesByIndex = new Map();
  let stableProjection = null;

  for (const condition of loaded.config.conditions) {
    const conditionRoot = path.join(input, condition.id);
    const manifestPath = path.join(conditionRoot, "manifest.json");
    const gamesPath = path.join(conditionRoot, "games.json");
    if (!fs.existsSync(manifestPath) || !fs.existsSync(gamesPath)) {
      fail(errors, `${condition.id}: missing manifest.json or games.json`);
      continue;
    }
    const manifest = readJson(manifestPath);
    const games = readJson(gamesPath);
    const expectedMode = options.fixtureGames === null ? "formal" : "fixture";
    if (manifest.completedGames !== expectedGames || games.length !== expectedGames) {
      fail(errors, `${condition.id}: completed game count mismatch`);
    }
    if (manifest.config.condition.id !== condition.id) {
      fail(errors, `${condition.id}: manifest condition id mismatch`);
    }
    for (const key of ["level", "evaluator", "search", "maxDepth"]) {
      const manifestKey = key === "evaluator" ? "evaluator" : key;
      const expectedKey = key === "evaluator" ? "evaluationProfile"
        : key === "search" ? "searchProfile" : key;
      if (manifest.config.condition[manifestKey] !== condition[expectedKey]) {
        fail(errors, `${condition.id}: manifest condition ${manifestKey} mismatch`);
      }
    }
    if (manifest.config.baseSeed !== loaded.config.corpus.sharedBaseSeed) {
      fail(errors, `${condition.id}: base seed mismatch`);
    }
    if (manifest.config.execution?.mode !== expectedMode) {
      fail(errors, `${condition.id}: execution mode mismatch`);
    }
    if (manifest.config.experiment?.preregistrationConfigSha256 !== loaded.sha256) {
      fail(errors, `${condition.id}: preregistration hash mismatch`);
    }
    configHashes.add(manifest.configHash);
    sourceCommits.add(manifest.sourceCommit);
    const projection = Robustness.stableConditionProjection(manifest.config);
    if (stableProjection === null) stableProjection = projection;
    else if (!sameJson(stableProjection, projection)) {
      fail(errors, `${condition.id}: fixed corpus configuration differs`);
    }

    const expectedSource = `ai-${condition.id.toLowerCase()}`;
    for (let index = 0; index < expectedGames; index += 1) {
      const expectedSeed = loaded.config.corpus.sharedBaseSeed + index;
      const filePath = path.join(
        conditionRoot,
        "games",
        `game-${String(index).padStart(4, "0")}.json`,
      );
      if (!fs.existsSync(filePath)) {
        fail(errors, `${condition.id}: missing game file ${index}`);
        continue;
      }
      const checked = verifyGameFile(filePath, condition, expectedSeed, expectedSource);
      errors.push(...checked.errors);
      const prior = openingHashesByIndex.get(index);
      if (prior === undefined) openingHashesByIndex.set(index, checked.game.openingStateHash);
      else if (prior !== checked.game.openingStateHash) {
        fail(errors, `${condition.id}: paired opening hash mismatch at game ${index}`);
      }
    }

    conditions.push({
      conditionId: condition.id,
      completedGames: manifest.completedGames,
      observationCount: manifest.observationCount,
      configHash: manifest.configHash,
      sourceCommit: manifest.sourceCommit,
      openingHashCount: expectedGames,
    });
  }

  if (conditions.length !== loaded.config.conditions.length) {
    fail(errors, "One or more conditions could not be verified");
  }
  if (configHashes.size !== loaded.config.conditions.length) {
    fail(errors, "Condition config hashes are not unique");
  }
  if (sourceCommits.size > 1) {
    fail(errors, "Source commit differs across conditions");
  }

  const result = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    preregistrationConfigSha256: loaded.sha256,
    mode: options.fixtureGames === null ? "formal" : "fixture",
    expectedGamesPerCondition: expectedGames,
    conditionCount: conditions.length,
    conditions,
    checks: {
      allConditionsPresent: conditions.length === loaded.config.conditions.length,
      uniqueConditionConfigHashes: configHashes.size === loaded.config.conditions.length,
      commonSourceCommit: sourceCommits.size <= 1,
      pairedOpeningHashes: !errors.some((message) => message.includes("paired opening hash")),
      conditionIdentityClean: !errors.some((message) => message.includes("identity mismatch")
        || message.includes("source condition mismatch")),
    },
    errors,
    valid: errors.length === 0,
  };

  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "robustness-integrity.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try {
    verify(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, verify, verifyGameFile };
