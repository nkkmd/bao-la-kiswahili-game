#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const base = require("./run-namua-mtaji-stage1-pilot.js");
const { hashValue } = require("./lib/position-typology-features.js");
const { toLegacyPhaseTransitionObservation } = require("./lib/namua-mtaji-transition-features.js");

const CONDITION = Object.freeze({
  id: "P2-D2", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 2,
});

const FORMAL = Object.freeze({
  replicates: 4096,
  baseOpeningSeed: 20280001,
  maxPly: 100,
  openingPlies: 8,
  output: "artifacts/local/namua-mtaji-transition/stage2-formal-v1",
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
  "tools/experiments/verify-namua-mtaji-stage1-pilot.js",
  "tools/experiments/run-namua-mtaji-stage2-formal.js",
  "tools/experiments/verify-namua-mtaji-stage2-formal.js",
  "tools/experiments/extract-namua-mtaji-stage2-candidates.py",
  "tools/experiments/analyze-namua-mtaji-stage2-events.js",
  "tools/experiments/analyze-namua-mtaji-stage2-formal.py",
  "tools/experiments/audit-namua-mtaji-mtaji-artifact.py",
  "schemas/position-typology-observation.schema.json",
  "schemas/namua-mtaji-transition-observation.schema.json",
  "schemas/namua-mtaji-transition-game.schema.json",
  "doc/namua-mtaji-transition/STAGE_2_FORMAL_PROTOCOL.md",
  "doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json",
]);

function parseArgs(argv) {
  const options = { output: FORMAL.output, force: false, status: false };
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
  return Object.fromEntries(SOURCE_FILES.map((file) => {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) throw new Error(`Missing frozen Stage 2 source file: ${file}`);
    return [file, sha256Text(fs.readFileSync(full))];
  }));
}

function provenance(root = path.resolve(__dirname, "../..")) {
  const sourceFileSha256 = sourceFileHashes(root);
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...SOURCE_FILES], "")),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    sourceFileSha256,
  };
}

function experimentConfig() {
  return {
    study: "namua-mtaji-temporal-transition",
    stage: "stage2-formal-confirmation",
    schemaVersion: 1,
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    exploratoryAnalysisAuthorized: false,
    confirmatoryReuseAllowed: true,
    morphologyEffectInspectionAuthorized: true,
    candidateDefinitionModificationAuthorized: false,
    replicates: FORMAL.replicates,
    games: FORMAL.replicates,
    baseOpeningSeed: FORMAL.baseOpeningSeed,
    maxPly: FORMAL.maxPly,
    opening: {
      policy: "seeded-uniform-legal",
      plies: FORMAL.openingPlies,
      pairedAcrossConditions: false,
    },
    conditions: [CONDITION],
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
    formalPolicy: {
      fixedGames: true,
      earlyStoppingAllowed: false,
      appendAfterOutcomeInspectionAllowed: false,
      exposureUnit: "earliest fully ascertained Namua CBE per historicalTrajectoryHash",
      comparator: "R3-M",
      controlsPerExposure: 20,
      minimumMorphologyEligibleUniqueExposures: 20,
      primaryAlpha: 0.05,
      primaryAlternative: "two-sided",
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

function formalGame(config, replicateIndex) {
  const game = base.runGame(config, replicateIndex, 0);
  const gameId = `nmt-s2f-r${String(replicateIndex).padStart(4, "0")}-P2-D2`;
  game.gameId = gameId;
  game.observations = game.observations.map((observation) => ({ ...observation, gameId }));
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
  return { status: "incomplete", output, completedGameFiles, expectedGames: FORMAL.replicates };
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
    throw new Error("Frozen Stage 2 instrumented source tree is dirty; do not generate formal data");
  }
  const config = experimentConfig();
  config.instrumentationHash = hashValue(source.sourceFileSha256);
  const configHash = hashValue(config);
  const games = [];

  for (let replicateIndex = 0; replicateIndex < config.replicates; replicateIndex += 1) {
    const file = gamePath(output, replicateIndex);
    let game = readExistingGame(file, configHash);
    if (!game) {
      game = formalGame(config, replicateIndex);
      atomicWriteJson(file, game);
    }
    games.push(game);
    console.log(`[Namua-Mtaji Stage 2 Formal] ${games.length}/${config.games} ${game.gameId}`);
  }

  const summaries = games.map((game) => base.gameSummary(game, config));
  const legacyRows = games.flatMap((game) => game.observations.map(toLegacyPhaseTransitionObservation));
  const gamesSummaryPath = path.join(output, "games-summary.json");
  const legacyPath = path.join(output, "legacy-observations.jsonl");
  atomicWriteJson(gamesSummaryPath, summaries);
  atomicWriteText(legacyPath, `${legacyRows.map((row) => JSON.stringify(row)).join("\n")}\n`);

  const summary = base.summarizeGames(games, config);
  summary.expectedPairedOpeningReplicates = null;
  const aggregateFiles = {
    "games-summary.json": { sha256: sha256Text(fs.readFileSync(gamesSummaryPath)), records: summaries.length },
    "legacy-observations.jsonl": { sha256: sha256Text(fs.readFileSync(legacyPath)), records: legacyRows.length },
  };
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage2-formal-corpus-complete",
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    exploratoryAnalysisAuthorized: false,
    confirmatoryReuseAllowed: true,
    morphologyEffectInspectionAuthorized: true,
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
  CONDITION,
  FORMAL,
  SOURCE_FILES,
  experimentConfig,
  formalGame,
  provenance,
  sourceFileHashes,
};
