#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E018 = require("./lib/phase-transition-search-profile-dependence.js");

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-dependence-v1.json",
    input: "artifacts/phase-transition/search-profile-dependence-v1-fixture",
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
  if (options.fixtureGames === null) {
    throw new Error("E-018 verifier is fixture-only until formal infrastructure is separately added; --fixture-games is required.");
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

function verifyGameFile(filePath, condition, expectedSeed) {
  const game = readJson(filePath);
  const errors = [];
  if (game.conditionId !== condition.id) fail(errors, `${filePath}: conditionId mismatch`);
  if (game.seed !== expectedSeed) fail(errors, `${filePath}: seed mismatch`);
  if (!game.gameId.startsWith(`pt-e018-${condition.id.toLowerCase()}-`)) {
    fail(errors, `${filePath}: gameId prefix mismatch`);
  }
  if (game.observations.some((row) => row.conditionId !== condition.id || row.gameId !== game.gameId)) {
    fail(errors, `${filePath}: observation identity mismatch`);
  }
  const expectedSource = `ai-e018-${condition.id.toLowerCase()}`;
  if (game.moves.some((move) => move.source?.startsWith("ai-") && move.source !== expectedSource)) {
    fail(errors, `${filePath}: AI source condition mismatch`);
  }
  if (typeof game.openingStateHash !== "string" || game.openingStateHash.length === 0) {
    fail(errors, `${filePath}: openingStateHash missing`);
  }
  return { game, errors };
}

function verify(options) {
  const loaded = E018.loadPreregistration(options.config);
  const expectedGames = options.fixtureGames;
  if (expectedGames > loaded.config.corpus.gamesPerCondition) {
    throw new Error("fixtureGames exceeds preregistered gamesPerCondition");
  }
  const input = path.resolve(options.input);
  const errors = [];
  const conditions = [];
  const configHashes = new Set();
  const sourceCommits = new Set();
  const openingHashesByIndex = new Map();
  const seedsByCondition = new Map();

  for (const rawCondition of loaded.config.corpus.conditions) {
    const condition = {
      id: rawCondition.conditionId,
      searchProfile: rawCondition.searchProfile,
    };
    const conditionRoot = path.join(input, condition.id);
    const manifestPath = path.join(conditionRoot, "manifest.json");
    const gamesPath = path.join(conditionRoot, "games.json");
    if (!fs.existsSync(manifestPath) || !fs.existsSync(gamesPath)) {
      fail(errors, `${condition.id}: missing manifest.json or games.json`);
      continue;
    }
    const manifest = readJson(manifestPath);
    const games = readJson(gamesPath);
    if (manifest.completedGames !== expectedGames || games.length !== expectedGames) {
      fail(errors, `${condition.id}: completed game count mismatch`);
    }
    if (manifest.config?.experiment?.experimentId !== "E-018") {
      fail(errors, `${condition.id}: experimentId mismatch`);
    }
    if (manifest.config?.execution?.mode !== "fixture") {
      fail(errors, `${condition.id}: non-fixture execution detected`);
    }
    if (manifest.config?.execution?.formalExecutionApproved !== false) {
      fail(errors, `${condition.id}: formal approval must remain false`);
    }
    if (manifest.config?.condition?.id !== condition.id) {
      fail(errors, `${condition.id}: manifest condition id mismatch`);
    }
    if (manifest.config?.condition?.search !== condition.searchProfile) {
      fail(errors, `${condition.id}: manifest search profile mismatch`);
    }
    if (manifest.config?.condition?.evaluator !== loaded.config.corpus.evaluationProfile) {
      fail(errors, `${condition.id}: evaluator mismatch`);
    }
    if (manifest.config?.condition?.maxDepth !== loaded.config.corpus.maxDepth) {
      fail(errors, `${condition.id}: maxDepth mismatch`);
    }
    if (manifest.config?.baseSeed !== loaded.config.corpus.sharedBaseSeed) {
      fail(errors, `${condition.id}: baseSeed mismatch`);
    }
    if (manifest.config?.experiment?.preregistrationConfigSha256 !== loaded.sha256) {
      fail(errors, `${condition.id}: preregistration hash mismatch`);
    }
    configHashes.add(manifest.configHash);
    sourceCommits.add(manifest.sourceCommit);
    const seeds = [];

    for (let index = 0; index < expectedGames; index += 1) {
      const expectedSeed = loaded.config.corpus.sharedBaseSeed + index;
      const filePath = path.join(conditionRoot, "games", `game-${String(index).padStart(4, "0")}.json`);
      if (!fs.existsSync(filePath)) {
        fail(errors, `${condition.id}: missing game file ${index}`);
        continue;
      }
      const checked = verifyGameFile(filePath, condition, expectedSeed);
      errors.push(...checked.errors);
      seeds.push(checked.game.seed);
      const priorHash = openingHashesByIndex.get(index);
      if (priorHash === undefined) openingHashesByIndex.set(index, checked.game.openingStateHash);
      else if (priorHash !== checked.game.openingStateHash) {
        fail(errors, `${condition.id}: paired opening hash mismatch at game ${index}`);
      }
    }
    seedsByCondition.set(condition.id, seeds);
    conditions.push({
      conditionId: condition.id,
      searchProfile: condition.searchProfile,
      completedGames: manifest.completedGames,
      observationCount: manifest.observationCount,
      configHash: manifest.configHash,
      sourceCommit: manifest.sourceCommit,
    });
  }

  const p2Seeds = seedsByCondition.get("P2") || [];
  const lgSeeds = seedsByCondition.get("LG") || [];
  if (E018.canonicalJson(p2Seeds) !== E018.canonicalJson(lgSeeds)) {
    fail(errors, "P2 and LG seed sequences differ");
  }
  if (conditions.length !== 2) fail(errors, "Both E-018 conditions must be present");
  if (configHashes.size !== 2) fail(errors, "Condition config hashes must be unique");
  if (sourceCommits.size > 1) fail(errors, "Source commit differs across conditions");

  const result = {
    experimentId: "E-018",
    analysisVersion: loaded.config.analysisVersion,
    preregistrationConfigSha256: loaded.sha256,
    mode: "fixture",
    expectedGamesPerCondition: expectedGames,
    conditions,
    checks: {
      bothConditionsPresent: conditions.length === 2,
      uniqueConditionConfigHashes: configHashes.size === 2,
      commonSourceCommit: sourceCommits.size <= 1,
      exactPairedSeedSequence: E018.canonicalJson(p2Seeds) === E018.canonicalJson(lgSeeds),
      pairedOpeningHashes: !errors.some((message) => message.includes("paired opening hash")),
      conditionIdentityClean: !errors.some((message) => message.includes("identity mismatch")
        || message.includes("source condition mismatch")),
      formalExecutionDisabled: !errors.some((message) => message.includes("formal approval")),
    },
    errors,
    valid: errors.length === 0,
  };

  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "search-profile-dependence-integrity.json"),
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
