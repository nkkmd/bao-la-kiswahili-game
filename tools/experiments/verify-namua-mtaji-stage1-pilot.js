#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { extractPhaseTransitionFeatures } = require("./lib/phase-transition-features.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
  stableStringify,
  validateObservation,
} = require("./lib/position-typology-features.js");
const {
  assertLegacyCompatibility,
  summarizeTemporalOutcome,
  toLegacyPhaseTransitionObservation,
  validatePhaseMonotonicity,
} = require("./lib/namua-mtaji-transition-features.js");
const {
  gameSummary,
  sourceFileHashes,
  summarizeGames,
} = require("./run-namua-mtaji-stage1-pilot.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/namua-mtaji-transition/stage1-pilot-v1",
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

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
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

function validateGameShape(game) {
  const required = [
    "gameId", "gameIndex", "replicateIndex", "openingSeed", "conditionIndex",
    "conditionId", "condition", "configHash", "observations", "moves",
    "historicalTrajectoryHash", "ruleTrajectoryHash", "seatCanonicalTrajectoryHash",
    "temporalOutcome",
  ];
  for (const field of required) {
    if (game[field] === undefined) throw new Error(`${game.gameId || "game"}: missing ${field}`);
  }
  if (!Array.isArray(game.observations) || !Array.isArray(game.moves)) {
    throw new Error(`${game.gameId}: invalid observations/moves arrays`);
  }
  return true;
}

function verifyGame(game, config) {
  validateGameShape(game);
  if (game.configHash !== hashValue(config)) throw new Error(`${game.gameId}: config hash mismatch`);
  if (game.observations.length !== game.moves.length + 1) {
    throw new Error(`${game.gameId}: expected observations = moves + 1`);
  }
  validatePhaseMonotonicity(game.observations);

  let state = E.initialState();
  const historicalSequence = [];
  const ruleSequence = [];
  const canonicalSequence = [];
  let legalMovesChecked = 0;
  let compatibilityChecks = 0;
  let phaseEvents = 0;

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

    const legacy = extractPhaseTransitionFeatures(state, {
      gameId: game.gameId,
      conditionId: game.conditionId,
      seed: game.seed,
      ply,
      previousStateHash: null,
    });
    assertLegacyCompatibility(rebuilt, legacy);
    compatibilityChecks += 1;

    historicalSequence.push(rebuilt.identity.historicalStateHash);
    ruleSequence.push(rebuilt.identity.ruleStateKey);
    canonicalSequence.push(rebuilt.identity.seatCanonicalKey);

    const item = game.moves[ply];
    if (!item) continue;
    const variants = E.moveVariants(state);
    legalMovesChecked += variants.length;
    const legal = variants.find((move) => AI.moveKey(move) === item.moveKey);
    if (!legal) throw new Error(`${game.gameId}: illegal stored move at ply ${ply}`);
    compare(`${game.gameId}: stored move ${ply}`, legal, item.move);

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
    const phaseTransitionOccurred = result.events.some(({ kind }) => kind === "phase");
    if (phaseTransitionOccurred !== item.phaseTransitionOccurred) {
      throw new Error(`${game.gameId}: phase-event mismatch at ply ${ply}`);
    }
    if (phaseTransitionOccurred) phaseEvents += 1;
    state = result.state;
  }

  if (hashValue(historicalSequence) !== game.historicalTrajectoryHash
    || hashValue(ruleSequence) !== game.ruleTrajectoryHash
    || hashValue(canonicalSequence) !== game.seatCanonicalTrajectoryHash) {
    throw new Error(`${game.gameId}: trajectory hash mismatch`);
  }

  const finalIdentity = identityKeys(state);
  if (finalIdentity.historicalStateHash !== game.finalHistoricalStateHash
    || finalIdentity.ruleStateKey !== game.finalRuleStateKey) {
    throw new Error(`${game.gameId}: final-state identity mismatch`);
  }

  const temporalOutcome = summarizeTemporalOutcome(game.observations, config.maxPly);
  compare(`${game.gameId}: temporal outcome`, temporalOutcome, game.temporalOutcome);
  if (temporalOutcome.firstMtajiPly !== null) {
    const first = game.observations.find(({ ply }) => Number(ply) === temporalOutcome.firstMtajiPly);
    if (!first || first.phase !== "mtaji") throw new Error(`${game.gameId}: missing first Mtaji observation`);
    if (stableStringify(first.state.reserve) !== "[0,0]") {
      throw new Error(`${game.gameId}: first Mtaji reserve is not [0,0]`);
    }
    if (temporalOutcome.firstMtajiPly <= 0
      || game.moves[temporalOutcome.firstMtajiPly - 1]?.phaseTransitionOccurred !== true) {
      throw new Error(`${game.gameId}: first Mtaji is not linked to a phase event`);
    }
    if (phaseEvents !== 1) throw new Error(`${game.gameId}: expected exactly one phase event`);
  } else if (phaseEvents !== 0) {
    throw new Error(`${game.gameId}: phase event exists without observed Mtaji`);
  }

  return {
    gameId: game.gameId,
    observations: game.observations.length,
    legalMovesChecked,
    compatibilityChecks,
    phaseEvents,
  };
}

function verifyPairedOpenings(games, config) {
  const byReplicate = new Map();
  for (const game of games) {
    if (!byReplicate.has(game.replicateIndex)) byReplicate.set(game.replicateIndex, []);
    byReplicate.get(game.replicateIndex).push(game);
  }
  if (byReplicate.size !== config.replicates) throw new Error("Replicate count mismatch");
  for (const [replicateIndex, rows] of byReplicate) {
    if (rows.length !== config.conditions.length) {
      throw new Error(`replicate ${replicateIndex}: condition count mismatch`);
    }
    const seeds = new Set(rows.map(({ openingSeed }) => openingSeed));
    const openingKeys = new Set(rows.map(({ openingStateKey }) => openingStateKey));
    const conditions = new Set(rows.map(({ conditionId }) => conditionId));
    if (seeds.size !== 1 || openingKeys.size !== 1) {
      throw new Error(`replicate ${replicateIndex}: paired opening mismatch`);
    }
    if (conditions.size !== config.conditions.length) {
      throw new Error(`replicate ${replicateIndex}: duplicate/missing condition`);
    }
  }
  return true;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const manifestPath = path.join(input, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing manifest: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.formalExperiment !== false
    || manifest.scientificInferenceAuthorized !== false
    || manifest.exploratoryAnalysisAuthorized !== true
    || manifest.confirmatoryReuseAllowed !== false) {
    throw new Error("Stage 1 exploratory boundary mismatch");
  }
  if (manifest.config.stage !== "stage1-exploratory-temporal-pilot") {
    throw new Error(`Unexpected Stage 1 identity: ${manifest.config.stage}`);
  }
  if (manifest.configHash !== hashValue(manifest.config)) throw new Error("Manifest config hash mismatch");

  for (const schema of [
    "schemas/position-typology-observation.schema.json",
    "schemas/namua-mtaji-transition-observation.schema.json",
    "schemas/namua-mtaji-transition-game.schema.json",
  ]) JSON.parse(fs.readFileSync(path.resolve(schema), "utf8"));

  const files = gameFiles(input);
  if (files.length !== manifest.config.games || files.length !== manifest.completedGames) {
    throw new Error(`Game file count mismatch: ${files.length}/${manifest.config.games}`);
  }
  const games = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const verifiedGames = games.map((game) => verifyGame(game, manifest.config));
  verifyPairedOpenings(games, manifest.config);

  const rebuiltSummary = summarizeGames(games, manifest.config);
  compare("summary", rebuiltSummary, manifest.summary);
  if (hashValue(rebuiltSummary) !== manifest.summaryHash) throw new Error("Summary hash mismatch");

  const rebuiltGamesSummary = games.map((game) => gameSummary(game, manifest.config));
  const storedGamesSummaryText = fs.readFileSync(path.join(input, "games-summary.json"), "utf8");
  compare("games summary", JSON.parse(storedGamesSummaryText), rebuiltGamesSummary);
  if (sha256Text(Buffer.from(storedGamesSummaryText)) !== manifest.aggregateFiles["games-summary.json"].sha256) {
    throw new Error("games-summary.json SHA-256 mismatch");
  }

  const rebuiltLegacy = `${games.flatMap((game) => game.observations.map(toLegacyPhaseTransitionObservation))
    .map((row) => JSON.stringify(row)).join("\n")}\n`;
  const storedLegacy = fs.readFileSync(path.join(input, "legacy-observations.jsonl"), "utf8");
  if (storedLegacy !== rebuiltLegacy) throw new Error("legacy-observations.jsonl content mismatch");
  if (sha256Text(Buffer.from(storedLegacy)) !== manifest.aggregateFiles["legacy-observations.jsonl"].sha256) {
    throw new Error("legacy-observations.jsonl SHA-256 mismatch");
  }

  const currentHashes = sourceFileHashes();
  const sourceHashesMatch = stableStringify(currentHashes) === stableStringify(manifest.provenance.sourceFileSha256);
  if (!sourceHashesMatch) throw new Error("Current source-file hashes differ from Stage 1 provenance");

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage1-exploratory-pilot-verification-complete",
    passed: true,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    input,
    configHash: manifest.configHash,
    games: games.length,
    observations: rebuiltSummary.observations,
    legalMovesChecked: verifiedGames.reduce((total, game) => total + game.legalMovesChecked, 0),
    legacyCompatibilityChecks: verifiedGames.reduce((total, game) => total + game.compatibilityChecks, 0),
    phaseTransitionEvents: verifiedGames.reduce((total, game) => total + game.phaseEvents, 0),
    pairedOpeningReplicatesVerified: manifest.config.replicates,
    sourceHashesMatch,
    summaryHash: manifest.summaryHash,
    summary: rebuiltSummary,
    checks: {
      schemaFilesReadable: "passed",
      observationValidation: "passed",
      fullReplay: "passed",
      storedObservationRecomputation: "passed",
      legacyPhaseTransitionCompatibility: "passed",
      moveLegality: "passed",
      beforeAfterStateIdentity: "passed",
      phaseMonotonicity: "passed",
      phaseEventLinkage: "passed",
      firstMtajiReserveExhaustion: "passed",
      temporalOutcomeRecomputation: "passed",
      trajectoryHash: "passed",
      pairedOpeningIdentity: "passed",
      aggregateLegacyView: "passed",
      aggregateGameSummary: "passed",
      summaryRecomputation: "passed",
      sourceProvenance: "passed",
    },
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();
module.exports = { gameFiles, parseArgs, validateGameShape, verifyGame, verifyPairedOpenings };
