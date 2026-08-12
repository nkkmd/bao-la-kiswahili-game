#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const base = require("./run-namua-mtaji-stage1-pilot.js");
const { hashValue } = require("./lib/position-typology-features.js");
const { toLegacyPhaseTransitionObservation } = require("./lib/namua-mtaji-transition-features.js");

const CONDITIONS = Object.freeze([
  { id: "P2-D2", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 2 },
  { id: "V2-D2", level: "hard", evaluator: "bao-v2", search: "phase2", maxDepth: 2 },
]);

const FINAL_EXTENSION = Object.freeze({
  replicates: 768,
  baseOpeningSeed: 20273001,
  maxPly: 100,
  openingPlies: 8,
  output: "artifacts/local/namua-mtaji-transition/stage1-final-extension-v1",
});

const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/symmetry/transform-candidates.js",
  "tools/experiments/lib/phase-transition-features.js",
  "tools/experiments/lib/forced-capture-regimes.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/namua-mtaji-transition-features.js",
  "tools/experiments/analyze-phase-transition-pilot.py",
  "tools/experiments/analyze-phase-transition-forcing-ablation.py",
  "tools/experiments/run-namua-mtaji-stage1-pilot.js",
  "tools/experiments/run-namua-mtaji-stage1-final-extension.js",
  "tools/experiments/verify-namua-mtaji-stage1-final-extension.js",
  "tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py",
  "tools/experiments/analyze-namua-mtaji-stage1-events.js",
  "tools/experiments/audit-namua-mtaji-stage1-clock.js",
  "tools/experiments/audit-namua-mtaji-stage1-riskset.js",
  "tools/experiments/audit-namua-mtaji-stage1-final-support.js",
  "schemas/position-typology-observation.schema.json",
  "schemas/namua-mtaji-transition-observation.schema.json",
  "schemas/namua-mtaji-transition-game.schema.json",
  "doc/namua-mtaji-transition/STAGE_1_FINAL_EXPOSURE_EXTENSION_PROTOCOL.md",
]);

function parseArgs(argv) {
  const options = { output: FINAL_EXTENSION.output, force: false, status: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") { options.force = true; continue; }
    if (arg === "--status") { options.status = true; continue; }
    if (arg === "--output") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --output");
      options.output = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sourceFileHashes(root = path.resolve(__dirname, "../..")) {
  return Object.fromEntries(SOURCE_FILES.filter((file) => fs.existsSync(path.join(root, file))).map((file) => [
    file,
    sha256Text(fs.readFileSync(path.join(root, file))),
  ]));
}

function provenance(root = path.resolve(__dirname, "../..")) {
  const present = SOURCE_FILES.filter((file) => fs.existsSync(path.join(root, file)));
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...present], "")),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    sourceFileSha256: sourceFileHashes(root),
  };
}

function experimentConfig() {
  return {
    study: "namua-mtaji-temporal-transition",
    stage: "stage1-exposure-support-extension",
    schemaVersion: 1,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    candidateDefinitionModificationAuthorized: false,
    morphologyEffectInspectionAuthorized: false,
    replicates: FINAL_EXTENSION.replicates,
    games: FINAL_EXTENSION.replicates * CONDITIONS.length,
    baseOpeningSeed: FINAL_EXTENSION.baseOpeningSeed,
    maxPly: FINAL_EXTENSION.maxPly,
    opening: {
      policy: "seeded-uniform-legal",
      plies: FINAL_EXTENSION.openingPlies,
      pairedAcrossConditions: true,
    },
    conditions: CONDITIONS,
    inheritedDefinitions: {
      categoryASignalThreshold: 2.0,
      categoryAPersistenceThreshold: 0.75,
      categoryAClusterMaxGap: 1,
      captureBranchExpansion: {
        before: 3,
        after: 8,
        expansionDelta: 3,
        convergenceDelta: -2,
        persistenceFraction: 0.5,
        eventWindow: 8,
      },
      mtajiCandidateDefinitionHash: "7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d",
    },
    extensionPolicy: {
      purpose: "final exploratory CBE exposure support only",
      extensionOrdinal: 2,
      finalExposureDrivenExtension: true,
      furtherExposureDrivenExtensionAfterThisAllowed: false,
      fixedReplicates: true,
      earlyStoppingOnExposureCountAllowed: false,
      conditionSelectionUsedMorphologyOutcome: false,
      primaryExposureSupportKey: "historicalTrajectoryHash + candidatePly",
      stage2ReadinessMinimumUniqueExposureUnits: 10,
      stage2ReadinessMinimumUniqueExposureTrajectories: 8,
    },
    boundaries: {
      stage1ConsumedExploratory: true,
      formalEndpointFrozen: false,
      formalComparatorFrozen: false,
      formalStatisticalUnitFrozen: false,
      formalModelFrozen: false,
      formalSeedBlockFrozen: false,
    },
  };
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function atomicWriteText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, value);
  fs.renameSync(temporary, filePath);
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function finalExtensionGame(config, replicateIndex, conditionIndex) {
  const game = base.runGame(config, replicateIndex, conditionIndex);
  const newGameId = `nmt-s1f-r${String(replicateIndex).padStart(3, "0")}-${game.conditionId}`;
  game.gameId = newGameId;
  game.observations = game.observations.map((observation) => ({ ...observation, gameId: newGameId }));
  return game;
}

function readExistingGame(filePath, configHash) {
  if (!fs.existsSync(filePath)) return null;
  const game = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (game.configHash !== configHash) throw new Error(`Config hash mismatch in ${filePath}`);
  return game;
}

function status(output) {
  const manifestPath = path.join(output, "manifest.json");
  if (fs.existsSync(manifestPath)) return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const gamesDir = path.join(output, "games");
  const completedGameFiles = fs.existsSync(gamesDir)
    ? fs.readdirSync(gamesDir).filter((name) => /^game-\d+\.json$/.test(name)).length
    : 0;
  return {
    status: "incomplete",
    output,
    completedGameFiles,
    expectedGames: FINAL_EXTENSION.replicates * CONDITIONS.length,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const output = path.resolve(options.output);
  if (options.status) {
    console.log(JSON.stringify(status(output), null, 2));
    return;
  }
  if (options.force && fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true });

  const source = provenance();
  if (source.sourceTreeDirty) {
    throw new Error("Instrumented source tree is dirty; commit/stash relevant source changes before final Stage 1 extension generation");
  }
  const config = experimentConfig();
  config.instrumentationHash = hashValue(source.sourceFileSha256);
  const configHash = hashValue(config);
  const games = [];

  for (let replicateIndex = 0; replicateIndex < config.replicates; replicateIndex += 1) {
    for (let conditionIndex = 0; conditionIndex < config.conditions.length; conditionIndex += 1) {
      const gameIndex = replicateIndex * config.conditions.length + conditionIndex;
      const file = gamePath(output, gameIndex);
      let game = readExistingGame(file, configHash);
      if (!game) {
        game = finalExtensionGame(config, replicateIndex, conditionIndex);
        atomicWriteJson(file, game);
      }
      games.push(game);
      console.log(`[Namua-Mtaji Stage 1 Final Extension] ${games.length}/${config.games} ${game.gameId}`);
    }
  }

  const summaries = games.map((game) => base.gameSummary(game, config));
  const legacyRows = games.flatMap((game) => game.observations.map(toLegacyPhaseTransitionObservation));
  const gamesSummaryPath = path.join(output, "games-summary.json");
  const legacyPath = path.join(output, "legacy-observations.jsonl");
  atomicWriteJson(gamesSummaryPath, summaries);
  atomicWriteText(legacyPath, `${legacyRows.map((row) => JSON.stringify(row)).join("\n")}\n`);

  const summary = base.summarizeGames(games, config);
  const aggregateFiles = {
    "games-summary.json": { sha256: sha256Text(fs.readFileSync(gamesSummaryPath)), records: summaries.length },
    "legacy-observations.jsonl": { sha256: sha256Text(fs.readFileSync(legacyPath)), records: legacyRows.length },
  };
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage1-final-exposure-support-extension-complete",
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    morphologyEffectInspectionAuthorized: false,
    output,
    config,
    configHash,
    provenance: source,
    completedGames: games.length,
    aggregateFiles,
    summary,
    summaryHash: hashValue(summary),
  };
  atomicWriteJson(path.join(output, "manifest.json"), manifest);
  console.log(JSON.stringify(manifest, null, 2));
}

if (require.main === module) main();

module.exports = {
  CONDITIONS,
  FINAL_EXTENSION,
  SOURCE_FILES,
  experimentConfig,
  finalExtensionGame,
  parseArgs,
  provenance,
  sourceFileHashes,
};
