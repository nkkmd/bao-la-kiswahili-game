#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { hashValue, stableStringify } = require("./lib/position-typology-features.js");
const { toLegacyPhaseTransitionObservation } = require("./lib/namua-mtaji-transition-features.js");
const baseRunner = require("./run-namua-mtaji-stage1-pilot.js");
const baseVerifier = require("./verify-namua-mtaji-stage1-pilot.js");
const { FORMAL, sourceFileHashes } = require("./run-namua-mtaji-stage2-formal.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/namua-mtaji-transition/stage2-formal-v1",
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

function compare(label, actual, expected) {
  if (stableStringify(actual) !== stableStringify(expected)) throw new Error(`${label} mismatch`);
}

function gameFiles(input) {
  const directory = path.join(input, "games");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((name) => /^game-\d+\.json$/.test(name))
    .sort()
    .map((name) => path.join(directory, name));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const manifest = JSON.parse(fs.readFileSync(path.join(input, "manifest.json"), "utf8"));

  if (manifest.formalExperiment !== true
    || manifest.scientificInferenceAuthorized !== true
    || manifest.exploratoryAnalysisAuthorized !== false
    || manifest.confirmatoryReuseAllowed !== true
    || manifest.morphologyEffectInspectionAuthorized !== true) {
    throw new Error("Stage 2 formal boundary mismatch");
  }
  if (manifest.config.stage !== "stage2-formal-confirmation") throw new Error("Unexpected Stage 2 identity");
  if (manifest.configHash !== hashValue(manifest.config)) throw new Error("Manifest config hash mismatch");
  if (manifest.config.games !== FORMAL.replicates || manifest.config.replicates !== FORMAL.replicates) {
    throw new Error("Frozen formal game count mismatch");
  }
  if (manifest.config.baseOpeningSeed !== FORMAL.baseOpeningSeed) throw new Error("Frozen seed block mismatch");
  if (manifest.config.conditions.length !== 1 || manifest.config.conditions[0].id !== "P2-D2") {
    throw new Error("Formal condition must be P2-D2 only");
  }

  const files = gameFiles(input);
  if (files.length !== manifest.config.games || files.length !== manifest.completedGames) {
    throw new Error(`Game file count mismatch: ${files.length}/${manifest.config.games}`);
  }
  const games = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const seeds = games.map((game) => Number(game.openingSeed));
  if (new Set(seeds).size !== FORMAL.replicates) throw new Error("Formal opening seeds are not unique");
  if (Math.min(...seeds) !== FORMAL.baseOpeningSeed || Math.max(...seeds) !== FORMAL.baseOpeningSeed + FORMAL.replicates - 1) {
    throw new Error("Formal opening seed range mismatch");
  }
  if (games.some((game) => game.conditionId !== "P2-D2")) throw new Error("Non-P2-D2 game in formal corpus");

  const verifiedGames = games.map((game) => baseVerifier.verifyGame(game, manifest.config));
  const rebuiltSummary = baseRunner.summarizeGames(games, manifest.config);
  rebuiltSummary.expectedPairedOpeningReplicates = null;
  compare("summary", rebuiltSummary, manifest.summary);
  if (hashValue(rebuiltSummary) !== manifest.summaryHash) throw new Error("Summary hash mismatch");

  const rebuiltGamesSummary = games.map((game) => baseRunner.gameSummary(game, manifest.config));
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
  if (!sourceHashesMatch) throw new Error("Current source-file hashes differ from formal provenance");

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage2-formal-verification-complete",
    passed: true,
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    input,
    configHash: manifest.configHash,
    games: games.length,
    observations: rebuiltSummary.observations,
    legalMovesChecked: verifiedGames.reduce((total, game) => total + game.legalMovesChecked, 0),
    legacyCompatibilityChecks: verifiedGames.reduce((total, game) => total + game.compatibilityChecks, 0),
    phaseTransitionEvents: verifiedGames.reduce((total, game) => total + game.phaseEvents, 0),
    openingSeedsVerified: seeds.length,
    sourceHashesMatch,
    summaryHash: manifest.summaryHash,
    summary: rebuiltSummary,
    checks: {
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
      formalSeedRange: "passed",
      singleFormalCondition: "passed",
      aggregateLegacyView: "passed",
      aggregateGameSummary: "passed",
      summaryRecomputation: "passed",
      sourceProvenance: "passed"
    }
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();
