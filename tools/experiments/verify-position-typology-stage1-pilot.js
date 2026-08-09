#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
  stableStringify,
  validateObservation,
} = require("./lib/position-typology-features.js");
const {
  sourceFileHashes,
  summarizeGames,
} = require("./run-position-typology-stage1-pilot.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/position-typology/stage1-pilot-v1",
    output: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.output ||= path.join(options.input, "verification.json");
  return options;
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function gameFiles(input) {
  const directory = path.join(input, "games");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((name) => /^game-\d+\.json$/.test(name))
    .sort()
    .map((name) => path.join(directory, name));
}

function compare(label, actual, expected) {
  if (stableStringify(actual) !== stableStringify(expected)) {
    throw new Error(`${label} mismatch`);
  }
}

function verifyGame(game, config) {
  if (game.configHash !== hashValue(config)) throw new Error(`${game.gameId}: config hash mismatch`);
  if (game.observations.length !== game.moves.length + 1) {
    throw new Error(`${game.gameId}: expected observations = moves + 1`);
  }
  let state = E.initialState();
  const historicalSequence = [];
  const ruleSequence = [];
  const canonicalSequence = [];
  let legalMovesChecked = 0;

  for (let ply = 0; ply < game.observations.length; ply += 1) {
    const stored = game.observations[ply];
    validateObservation(stored);
    const rebuilt = extractPositionTypologyObservation(state, {
      gameId: game.gameId,
      conditionId: game.conditionId,
      seed: game.seed,
      ply,
    });
    compare(`${game.gameId}: observation ${ply}`, rebuilt, stored);
    historicalSequence.push(rebuilt.identity.historicalStateHash);
    ruleSequence.push(rebuilt.identity.ruleStateKey);
    canonicalSequence.push(rebuilt.identity.seatCanonicalKey);

    const item = game.moves[ply];
    if (!item) continue;
    const variants = E.moveVariants(state);
    legalMovesChecked += variants.length;
    const legal = variants.find((move) => AI.moveKey(move) === item.moveKey);
    if (!legal) throw new Error(`${game.gameId}: illegal stored move at ply ${ply}`);
    compare(`${game.gameId}: stored move at ply ${ply}`, legal, item.move);
    const before = identityKeys(state);
    if (before.historicalStateHash !== item.beforeHistoricalStateHash
      || before.ruleStateKey !== item.beforeRuleStateKey) {
      throw new Error(`${game.gameId}: before-state identity mismatch at ply ${ply}`);
    }
    const result = E.applyMove(state, item.move);
    const after = identityKeys(result.state);
    if (after.historicalStateHash !== item.afterHistoricalStateHash
      || after.ruleStateKey !== item.afterRuleStateKey) {
      throw new Error(`${game.gameId}: after-state identity mismatch at ply ${ply}`);
    }
    state = result.state;
  }

  const historicalTrajectoryHash = hashValue(historicalSequence);
  const ruleTrajectoryHash = hashValue(ruleSequence);
  const seatCanonicalTrajectoryHash = hashValue(canonicalSequence);
  if (historicalTrajectoryHash !== game.historicalTrajectoryHash
    || ruleTrajectoryHash !== game.ruleTrajectoryHash
    || seatCanonicalTrajectoryHash !== game.seatCanonicalTrajectoryHash) {
    throw new Error(`${game.gameId}: trajectory hash mismatch`);
  }
  const finalIdentity = identityKeys(state);
  if (finalIdentity.historicalStateHash !== game.finalHistoricalStateHash
    || finalIdentity.ruleStateKey !== game.finalRuleStateKey) {
    throw new Error(`${game.gameId}: final-state identity mismatch`);
  }
  return {
    gameId: game.gameId,
    observations: game.observations.length,
    moves: game.moves.length,
    legalMovesChecked,
    finalRuleStateKey: game.finalRuleStateKey,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const manifestPath = path.join(input, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing manifest: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.formalExperiment !== false
    || manifest.exploratory !== true
    || manifest.confirmatoryUseAllowed !== false) {
    throw new Error("Stage 1 pilot manifest must remain exploratory and non-confirmatory");
  }
  if (manifest.config?.stage !== "stage1-exploratory-pilot") {
    throw new Error(`Unexpected stage: ${manifest.config?.stage}`);
  }
  if (manifest.configHash !== hashValue(manifest.config)) throw new Error("Manifest config hash mismatch");
  const files = gameFiles(input);
  if (files.length !== manifest.config.games || files.length !== manifest.completedGames) {
    throw new Error(`Game file count mismatch: ${files.length}/${manifest.config.games}`);
  }
  const games = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const verifiedGames = games.map((game) => verifyGame(game, manifest.config));
  const rebuiltSummary = summarizeGames(games);
  compare("summary", rebuiltSummary, manifest.summary);
  if (hashValue(rebuiltSummary) !== manifest.summaryHash) throw new Error("Summary hash mismatch");

  const currentHashes = sourceFileHashes();
  const sourceHashesMatch = stableStringify(currentHashes) === stableStringify(manifest.provenance.sourceFileSha256);
  if (!sourceHashesMatch) throw new Error("Current source-file hashes differ from Stage 1 pilot provenance");
  if (manifest.provenance.sourceTreeDirty) throw new Error("Stage 1 pilot provenance recorded a dirty source tree");

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    passed: true,
    input,
    configHash: manifest.configHash,
    games: games.length,
    observations: rebuiltSummary.observations,
    legalMovesChecked: verifiedGames.reduce((total, game) => total + game.legalMovesChecked, 0),
    sourceHashesMatch,
    summaryHash: manifest.summaryHash,
    checks: {
      exploratoryBoundary: "passed",
      schemaValidation: "passed",
      fullReplay: "passed",
      storedObservationRecomputation: "passed",
      moveLegality: "passed",
      stateIdentity: "passed",
      trajectoryHash: "passed",
      summaryRecomputation: "passed",
      sourceProvenance: "passed",
      cleanSourceTree: "passed",
      partialFiles: "not-used; per-game atomic files only",
    },
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();
module.exports = { gameFiles, parseArgs, verifyGame };
