#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Artifacts = require("./verify-phase-transition-artifacts.js");
const E020 = require("./lib/phase-transition-d3-reversal-replication.js");

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-d3-reversal-replication-v1.json",
    input: "artifacts/phase-transition/d3-reversal-replication-v1-fixture",
    fixtureGames: null,
    fixtureBaseSeed: null,
    lock: null,
    output: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else if (key === "--lock") options.lock = value;
    else if (key === "--fixture-games") options.fixtureGames = integerArg(value, key, 1);
    else if (key === "--fixture-base-seed") options.fixtureBaseSeed = integerArg(value, key, 0);
    else throw new Error(`Unknown argument: ${key}`);
  }
  const fixtureMode = options.fixtureGames !== null || options.fixtureBaseSeed !== null;
  if (fixtureMode && (options.fixtureGames === null || options.fixtureBaseSeed === null)) {
    throw new Error("Fixture verification requires both --fixture-games and --fixture-base-seed");
  }
  if (!fixtureMode && !options.lock) throw new Error("Formal E-020 verification requires --lock");
  if (fixtureMode && options.lock) throw new Error("Use either fixture verification or formal lock verification, not both");
  options.output ||= fixtureMode
    ? path.join(options.input, "integrity")
    : "artifacts/local/phase-transition-d3-reversal-replication-v1/integrity";
  return options;
}

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function fail(errors, message) { errors.push(message); }

function verifyGameFile(filePath, condition, expectedSeed) {
  const game = readJson(filePath);
  const errors = [];
  if (game.conditionId !== condition.id) fail(errors, `${filePath}: conditionId mismatch`);
  if (game.seed !== expectedSeed) fail(errors, `${filePath}: seed mismatch`);
  if (!game.gameId.startsWith(`pt-e020-${condition.id.toLowerCase()}-`)) fail(errors, `${filePath}: gameId prefix mismatch`);
  if (game.observations.some((row) => row.conditionId !== condition.id || row.gameId !== game.gameId)) {
    fail(errors, `${filePath}: observation identity mismatch`);
  }
  const expectedSource = `ai-e020-${condition.id.toLowerCase()}`;
  if (game.moves.some((move) => move.source?.startsWith("ai-") && move.source !== expectedSource)) {
    fail(errors, `${filePath}: AI source condition mismatch`);
  }
  if (typeof game.openingStateHash !== "string" || game.openingStateHash.length === 0) fail(errors, `${filePath}: openingStateHash missing`);
  if (typeof game.trajectoryHash !== "string" || game.trajectoryHash.length === 0) fail(errors, `${filePath}: trajectoryHash missing`);
  return { game, errors };
}

function verify(options) {
  const loaded = E020.loadPreregistration(options.config);
  const fixtureMode = options.fixtureGames !== null;
  const mode = fixtureMode ? "fixture" : "formal";
  const expectedGames = fixtureMode ? options.fixtureGames : loaded.config.corpus.gamesPerCondition;
  const expectedBaseSeed = fixtureMode ? options.fixtureBaseSeed : loaded.config.corpus.seedRange[0];
  if (expectedGames > loaded.config.corpus.gamesPerCondition) throw new Error("fixtureGames exceeds preregistered gamesPerCondition");
  if (fixtureMode && E020.rangesOverlap(
    [expectedBaseSeed, expectedBaseSeed + expectedGames - 1],
    loaded.config.corpus.seedRange,
  )) throw new Error("Fixture verification seed range overlaps E-020 formal seeds");

  const input = path.resolve(options.input);
  const lock = mode === "formal" ? readJson(path.resolve(options.lock)) : null;
  const errors = [];
  const conditions = [];
  const configHashes = new Set();
  const sourceCommits = new Set();
  const openingHashesByIndex = new Map();
  const seedsByCondition = new Map();
  const artifactResults = {};

  if (mode === "formal") {
    if (lock.experimentId !== loaded.config.experimentId) fail(errors, "Execution lock experimentId mismatch");
    if (lock.hypothesisId !== loaded.config.hypothesisId) fail(errors, "Execution lock hypothesisId mismatch");
    if (lock.analysisVersion !== loaded.config.analysisVersion) fail(errors, "Execution lock analysisVersion mismatch");
    if (lock.preregistration?.sha256 !== loaded.sha256) fail(errors, "Execution lock preregistration hash mismatch");
    if (typeof lock.executionPolicy?.sha256 !== "string" || lock.executionPolicy.sha256.length !== 64) fail(errors, "Execution lock policy hash missing");
    if (E020.canonicalJson(lock.corpus) !== E020.canonicalJson(loaded.config.corpus)) fail(errors, "Execution lock corpus differs from preregistration");
    if (E020.canonicalJson(lock.primaryEndpoint) !== E020.canonicalJson(loaded.config.primaryEndpoint)) fail(errors, "Execution lock primary endpoint differs from preregistration");
    if (E020.canonicalJson(lock.decisionRule) !== E020.canonicalJson(loaded.config.decisionRule)) fail(errors, "Execution lock decision rule differs from preregistration");
  }

  for (const rawCondition of loaded.config.corpus.conditions) {
    const condition = { id: rawCondition.conditionId, searchProfile: rawCondition.searchProfile };
    const conditionRoot = path.join(input, condition.id);
    const manifestPath = path.join(conditionRoot, "manifest.json");
    const gamesPath = path.join(conditionRoot, "games.json");
    if (!fs.existsSync(manifestPath) || !fs.existsSync(gamesPath)) {
      fail(errors, `${condition.id}: missing manifest.json or games.json`);
      continue;
    }
    if (mode === "formal") {
      try { artifactResults[condition.id] = Artifacts.verifyArtifacts(conditionRoot); }
      catch (error) {
        artifactResults[condition.id] = { error: error.message };
        fail(errors, `${condition.id}: artifact verification failed: ${error.message}`);
      }
    }
    const manifest = readJson(manifestPath);
    const games = readJson(gamesPath);
    if (manifest.completedGames !== expectedGames || games.length !== expectedGames) fail(errors, `${condition.id}: completed game count mismatch`);
    if (manifest.config?.experiment?.experimentId !== "E-020") fail(errors, `${condition.id}: experimentId mismatch`);
    if (manifest.config?.experiment?.hypothesisId !== "H18") fail(errors, `${condition.id}: hypothesisId mismatch`);
    if (manifest.config?.execution?.mode !== mode) fail(errors, `${condition.id}: execution mode mismatch`);
    if (manifest.config?.execution?.formalExecutionApproved !== (mode === "formal")) fail(errors, `${condition.id}: formal approval metadata mismatch`);
    if (manifest.config?.execution?.plannedGamesPerCondition !== loaded.config.corpus.gamesPerCondition) fail(errors, `${condition.id}: planned game count mismatch`);
    if (manifest.config?.condition?.id !== condition.id) fail(errors, `${condition.id}: manifest condition id mismatch`);
    if (manifest.config?.condition?.search !== condition.searchProfile) fail(errors, `${condition.id}: search profile mismatch`);
    if (manifest.config?.condition?.evaluator !== "bao") fail(errors, `${condition.id}: evaluator mismatch`);
    if (manifest.config?.condition?.maxDepth !== 3) fail(errors, `${condition.id}: maxDepth mismatch`);
    if (manifest.config?.baseSeed !== expectedBaseSeed) fail(errors, `${condition.id}: baseSeed mismatch`);
    if (manifest.config?.experiment?.preregistrationConfigSha256 !== loaded.sha256) fail(errors, `${condition.id}: preregistration hash mismatch`);
    configHashes.add(manifest.configHash);
    sourceCommits.add(manifest.sourceCommit);
    if (mode === "formal" && manifest.sourceCommit !== lock.environment?.sourceCommit) fail(errors, `${condition.id}: source commit differs from execution lock`);
    const seeds = [];

    for (let index = 0; index < expectedGames; index += 1) {
      const expectedSeed = expectedBaseSeed + index;
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
      else if (priorHash !== checked.game.openingStateHash) fail(errors, `${condition.id}: paired opening hash mismatch at game ${index}`);
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
  const exactPairedSeedSequence = E020.canonicalJson(p2Seeds) === E020.canonicalJson(lgSeeds);
  if (!exactPairedSeedSequence) fail(errors, "P2 and LG seed sequences differ");
  if (conditions.length !== 2) fail(errors, "Both E-020 conditions must be present");
  if (configHashes.size !== 2) fail(errors, "Condition config hashes must be unique");
  if (sourceCommits.size !== 1) fail(errors, "Source commit must be common across conditions");

  const result = {
    experimentId: "E-020",
    hypothesisId: "H18",
    analysisVersion: loaded.config.analysisVersion,
    preregistrationConfigSha256: loaded.sha256,
    mode,
    expectedGamesPerCondition: expectedGames,
    expectedBaseSeed,
    conditions,
    artifactResults: mode === "formal" ? artifactResults : null,
    checks: {
      bothConditionsPresent: conditions.length === 2,
      uniqueConditionConfigHashes: configHashes.size === 2,
      commonSourceCommit: sourceCommits.size === 1,
      sourceCommitMatchesLock: mode === "fixture" || !errors.some((message) => message.includes("source commit differs")),
      exactPairedSeedSequence,
      pairedOpeningHashes: !errors.some((message) => message.includes("paired opening hash")),
      conditionIdentityClean: !errors.some((message) => message.includes("identity mismatch") || message.includes("source condition mismatch")),
      trajectoryHashesPresent: !errors.some((message) => message.includes("trajectoryHash missing")),
      executionModeCorrect: !errors.some((message) => message.includes("execution mode mismatch") || message.includes("formal approval metadata mismatch")),
      lockPreregistrationHash: mode === "fixture" || lock.preregistration?.sha256 === loaded.sha256,
      lockPolicyHashPresent: mode === "fixture" || (typeof lock.executionPolicy?.sha256 === "string" && lock.executionPolicy.sha256.length === 64),
      artifactVerification: mode === "fixture" || loaded.config.corpus.conditions.every((condition) => !artifactResults[condition.conditionId]?.error),
    },
    errors,
    valid: errors.length === 0,
  };

  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "d3-reversal-replication-integrity.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try { verify(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = { parseArgs, verify, verifyGameFile };
