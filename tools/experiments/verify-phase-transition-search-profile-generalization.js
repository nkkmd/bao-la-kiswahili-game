#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Artifacts = require("./verify-phase-transition-artifacts.js");
const E019 = require("./lib/phase-transition-search-profile-generalization.js");

function integerArg(value, name, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-generalization-v2.json",
    input: "artifacts/phase-transition/search-profile-generalization-v2-fixture",
    fixtureGames: null,
    fixtureBaseSeed: 20267101,
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
  if (options.fixtureGames === null && !options.lock) throw new Error("Formal E-019 verification requires --lock; fixture verification requires --fixture-games.");
  if (options.fixtureGames !== null && options.lock) throw new Error("Use either fixture verification or formal lock verification, not both.");
  options.output ||= options.fixtureGames === null
    ? "artifacts/local/phase-transition-search-profile-generalization-v2/integrity"
    : path.join(options.input, "integrity");
  return options;
}

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function fail(errors, message) { errors.push(message); }

function verifyGameFile(filePath, condition, expectedSeed) {
  const game = readJson(filePath);
  const errors = [];
  if (game.conditionId !== condition.id) fail(errors, `${filePath}: conditionId mismatch`);
  if (game.stratumId !== condition.stratumId) fail(errors, `${filePath}: stratumId mismatch`);
  if (game.seed !== expectedSeed) fail(errors, `${filePath}: seed mismatch`);
  if (!game.gameId.startsWith(`pt-e019-${condition.id.toLowerCase()}-`)) fail(errors, `${filePath}: gameId prefix mismatch`);
  if (game.observations.some((row) => row.conditionId !== condition.id || row.stratumId !== condition.stratumId || row.gameId !== game.gameId)) {
    fail(errors, `${filePath}: observation identity mismatch`);
  }
  const expectedSource = `ai-e019-${condition.id.toLowerCase()}`;
  if (game.moves.some((move) => move.source?.startsWith("ai-") && move.source !== expectedSource)) fail(errors, `${filePath}: AI source condition mismatch`);
  if (typeof game.openingStateHash !== "string" || game.openingStateHash.length === 0) fail(errors, `${filePath}: openingStateHash missing`);
  if (typeof game.trajectoryHash !== "string" || game.trajectoryHash.length === 0) fail(errors, `${filePath}: trajectoryHash missing`);
  return { game, errors };
}

function verify(options) {
  const loaded = E019.loadPreregistration(options.config);
  const mode = options.fixtureGames === null ? "formal" : "fixture";
  if (mode === "fixture" && !E019.fixtureRangeAllowed(loaded.config, options.fixtureBaseSeed, options.fixtureGames)) {
    throw new Error("Fixture seed range overlaps prior or E-019 formal seed blocks");
  }
  const input = path.resolve(options.input);
  const lock = mode === "formal" ? readJson(path.resolve(options.lock)) : null;
  const errors = [];
  const conditions = [];
  const configHashes = new Set();
  const sourceCommits = new Set();
  const artifactResults = {};
  const seedsByCondition = new Map();
  const openingHashesByStratum = new Map();

  if (mode === "formal") {
    if (lock.experimentId !== loaded.config.experimentId) fail(errors, "Execution lock experimentId mismatch");
    if (lock.analysisVersion !== loaded.config.analysisVersion) fail(errors, "Execution lock analysisVersion mismatch");
    if (lock.preregistration?.sha256 !== loaded.sha256) fail(errors, "Execution lock preregistration hash mismatch");
    if (typeof lock.executionPolicy?.sha256 !== "string" || lock.executionPolicy.sha256.length !== 64) fail(errors, "Execution lock policy hash missing");
    for (const [name, value] of [
      ["corpus", loaded.config.corpus],
      ["primaryEndpoint", loaded.config.primaryEndpoint],
      ["conditionDecisionRule", loaded.config.conditionDecisionRule],
      ["globalDecisionRule", loaded.config.globalDecisionRule],
      ["individualStandaloneInference", loaded.config.individualStandaloneInference],
      ["structuralSecondaryEndpoint", loaded.config.structuralSecondaryEndpoint],
    ]) {
      if (E019.canonicalJson(lock[name]) !== E019.canonicalJson(value)) fail(errors, `Execution lock ${name} differs from preregistration`);
    }
  }

  for (const stratum of loaded.config.corpus.strata) {
    openingHashesByStratum.set(stratum.stratumId, new Map());
    for (const raw of stratum.conditions) {
      const condition = { id: raw.conditionId, stratumId: stratum.stratumId, searchProfile: raw.searchProfile };
      const expectedGames = mode === "formal" ? stratum.pairedSeeds : options.fixtureGames;
      const baseSeed = mode === "formal" ? stratum.seedRange[0] : options.fixtureBaseSeed;
      const conditionRoot = path.join(input, condition.id);
      const manifestPath = path.join(conditionRoot, "manifest.json");
      const gamesPath = path.join(conditionRoot, "games.json");
      if (!fs.existsSync(manifestPath) || !fs.existsSync(gamesPath)) {
        fail(errors, `${condition.id}: missing manifest.json or games.json`);
        continue;
      }
      if (mode === "formal") {
        try { artifactResults[condition.id] = Artifacts.verifyArtifacts(conditionRoot); }
        catch (error) { artifactResults[condition.id] = { error: error.message }; fail(errors, `${condition.id}: artifact verification failed: ${error.message}`); }
      }
      const manifest = readJson(manifestPath);
      const games = readJson(gamesPath);
      if (manifest.completedGames !== expectedGames || games.length !== expectedGames) fail(errors, `${condition.id}: completed game count mismatch`);
      if (manifest.config?.experiment?.experimentId !== "E-019") fail(errors, `${condition.id}: experimentId mismatch`);
      if (manifest.config?.experiment?.stratumId !== stratum.stratumId) fail(errors, `${condition.id}: manifest stratum mismatch`);
      if (manifest.config?.execution?.mode !== mode) fail(errors, `${condition.id}: execution mode mismatch`);
      if (manifest.config?.execution?.formalExecutionApproved !== (mode === "formal")) fail(errors, `${condition.id}: formal approval metadata mismatch`);
      if (manifest.config?.execution?.plannedGamesPerCondition !== stratum.pairedSeeds) fail(errors, `${condition.id}: planned game count mismatch`);
      if (manifest.config?.condition?.id !== condition.id) fail(errors, `${condition.id}: manifest condition id mismatch`);
      if (manifest.config?.condition?.search !== condition.searchProfile) fail(errors, `${condition.id}: search profile mismatch`);
      if (manifest.config?.condition?.evaluator !== stratum.evaluationProfile) fail(errors, `${condition.id}: evaluator mismatch`);
      if (manifest.config?.condition?.maxDepth !== stratum.maxDepth) fail(errors, `${condition.id}: maxDepth mismatch`);
      if (manifest.config?.baseSeed !== baseSeed) fail(errors, `${condition.id}: baseSeed mismatch`);
      if (manifest.config?.experiment?.preregistrationConfigSha256 !== loaded.sha256) fail(errors, `${condition.id}: preregistration hash mismatch`);
      configHashes.add(manifest.configHash);
      sourceCommits.add(manifest.sourceCommit);
      if (mode === "formal" && manifest.sourceCommit !== lock.environment?.sourceCommit) fail(errors, `${condition.id}: source commit differs from execution lock`);

      const seeds = [];
      for (let index = 0; index < expectedGames; index += 1) {
        const expectedSeed = baseSeed + index;
        const filePath = path.join(conditionRoot, "games", `game-${String(index).padStart(4, "0")}.json`);
        if (!fs.existsSync(filePath)) { fail(errors, `${condition.id}: missing game file ${index}`); continue; }
        const checked = verifyGameFile(filePath, condition, expectedSeed);
        errors.push(...checked.errors);
        seeds.push(checked.game.seed);
        const openingMap = openingHashesByStratum.get(stratum.stratumId);
        const priorHash = openingMap.get(index);
        if (priorHash === undefined) openingMap.set(index, checked.game.openingStateHash);
        else if (priorHash !== checked.game.openingStateHash) fail(errors, `${condition.id}: paired opening hash mismatch at game ${index}`);
      }
      seedsByCondition.set(condition.id, seeds);
      conditions.push({
        conditionId: condition.id,
        stratumId: stratum.stratumId,
        searchProfile: condition.searchProfile,
        completedGames: manifest.completedGames,
        observationCount: manifest.observationCount,
        configHash: manifest.configHash,
        sourceCommit: manifest.sourceCommit,
      });
    }
  }

  let withinStratumSeedSequences = true;
  for (const stratum of loaded.config.corpus.strata) {
    const p2 = seedsByCondition.get(`${stratum.stratumId}-P2`) || [];
    const lg = seedsByCondition.get(`${stratum.stratumId}-LG`) || [];
    if (E019.canonicalJson(p2) !== E019.canonicalJson(lg)) {
      withinStratumSeedSequences = false;
      fail(errors, `${stratum.stratumId}: phase2 and legacy seed sequences differ`);
    }
  }
  let nestedFormalSeedPrefixes = true;
  if (mode === "formal") {
    const d1 = seedsByCondition.get("D1-P2") || [];
    const d3 = seedsByCondition.get("D3-P2") || [];
    const v2 = seedsByCondition.get("V2-P2") || [];
    nestedFormalSeedPrefixes = E019.canonicalJson(d1.slice(0, d3.length)) === E019.canonicalJson(d3)
      && E019.canonicalJson(d1.slice(0, v2.length)) === E019.canonicalJson(v2);
    if (!nestedFormalSeedPrefixes) fail(errors, "Formal nested seed-prefix contract failed");
  }
  if (conditions.length !== 6) fail(errors, "All six E-019 conditions must be present");
  if (configHashes.size !== 6) fail(errors, "All six condition config hashes must be unique");
  if (sourceCommits.size !== 1) fail(errors, "Source commit must be common across all conditions");

  const result = {
    experimentId: "E-019",
    analysisVersion: loaded.config.analysisVersion,
    preregistrationConfigSha256: loaded.sha256,
    mode,
    conditions,
    artifactResults: mode === "formal" ? artifactResults : null,
    checks: {
      allConditionsPresent: conditions.length === 6,
      uniqueConditionConfigHashes: configHashes.size === 6,
      commonSourceCommit: sourceCommits.size === 1,
      sourceCommitMatchesLock: mode === "fixture" || !errors.some((message) => message.includes("source commit differs")),
      withinStratumSeedSequences,
      pairedOpeningHashesWithinStratum: !errors.some((message) => message.includes("paired opening hash")),
      nestedFormalSeedPrefixes,
      conditionIdentityClean: !errors.some((message) => message.includes("identity mismatch") || message.includes("source condition mismatch") || message.includes("stratumId mismatch")),
      trajectoryHashesPresent: !errors.some((message) => message.includes("trajectoryHash missing")),
      executionModeCorrect: !errors.some((message) => message.includes("execution mode mismatch") || message.includes("formal approval metadata mismatch")),
      lockPreregistrationHash: mode === "fixture" || lock.preregistration?.sha256 === loaded.sha256,
      lockPolicyHashPresent: mode === "fixture" || (typeof lock.executionPolicy?.sha256 === "string" && lock.executionPolicy.sha256.length === 64),
      artifactVerification: mode === "fixture" || E019.allConditions(loaded.config).every((condition) => !artifactResults[condition.conditionId]?.error),
    },
    errors,
    valid: errors.length === 0,
  };
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "search-profile-generalization-integrity.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try { verify(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = { parseArgs, verify, verifyGameFile };
