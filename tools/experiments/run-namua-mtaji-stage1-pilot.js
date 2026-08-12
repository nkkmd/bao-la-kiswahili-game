#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
} = require("./lib/position-typology-features.js");
const {
  summarizeTemporalOutcome,
  toLegacyPhaseTransitionObservation,
} = require("./lib/namua-mtaji-transition-features.js");

const CONDITIONS = Object.freeze([
  { id: "P2-D1", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 1 },
  { id: "P2-D2", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 2 },
  { id: "P2-D3", level: "hard", evaluator: "bao", search: "phase2", maxDepth: 3 },
  { id: "LG-D2", level: "hard", evaluator: "bao", search: "legacy", maxDepth: 2 },
  { id: "LG-D3", level: "hard", evaluator: "bao", search: "legacy", maxDepth: 3 },
  { id: "V2-D2", level: "hard", evaluator: "bao-v2", search: "phase2", maxDepth: 2 },
]);

const PILOT = Object.freeze({
  replicates: 32,
  baseOpeningSeed: 20271001,
  maxPly: 100,
  openingPlies: 8,
  output: "artifacts/local/namua-mtaji-transition/stage1-pilot-v1",
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
  "tools/experiments/extract-namua-mtaji-stage1-candidates.py",
  "tools/experiments/analyze-namua-mtaji-stage1-events.js",
  "tools/experiments/audit-namua-mtaji-mtaji-artifact.py",
  "schemas/position-typology-observation.schema.json",
  "schemas/namua-mtaji-transition-observation.schema.json",
  "schemas/namua-mtaji-transition-game.schema.json",
  "doc/namua-mtaji-transition/STAGE_1_EXPLORATORY_PILOT_PROTOCOL.md",
]);

function parseArgs(argv) {
  const options = { output: PILOT.output, force: false, status: false };
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
    stage: "stage1-exploratory-temporal-pilot",
    schemaVersion: 1,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    candidateDefinitionModificationAuthorized: false,
    replicates: PILOT.replicates,
    games: PILOT.replicates * CONDITIONS.length,
    baseOpeningSeed: PILOT.baseOpeningSeed,
    maxPly: PILOT.maxPly,
    opening: {
      policy: "seeded-uniform-legal",
      plies: PILOT.openingPlies,
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

function chooseRandomMove(state, random) {
  const moves = E.moveVariants(state);
  return moves.length ? moves[Math.floor(random() * moves.length)] : null;
}

function chooseAiMove(state, condition, random) {
  return AI.analyzeMove(state, condition.level, random, {
    timeLimitMs: Infinity,
    maxDepth: condition.maxDepth,
    evaluationProfile: condition.evaluator,
    searchProfile: condition.search,
  });
}

function runGame(config, replicateIndex, conditionIndex) {
  const condition = config.conditions[conditionIndex];
  const openingSeed = config.baseOpeningSeed + replicateIndex;
  const random = seededRandom(openingSeed);
  const gameIndex = replicateIndex * config.conditions.length + conditionIndex;
  const gameId = `nmt-s1p-r${String(replicateIndex).padStart(3, "0")}-${condition.id}`;
  const observations = [];
  const moves = [];
  let state = E.initialState();

  for (let ply = 0; ply <= config.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId,
      conditionId: condition.id,
      seed: openingSeed,
      ply,
    });
    observations.push(observation);
    if (state.winner !== null || ply === config.maxPly) break;

    const isOpening = ply < config.opening.plies;
    let move;
    let secondarySearch = null;
    if (isOpening) {
      move = chooseRandomMove(state, random);
    } else {
      const analysis = chooseAiMove(state, condition, random);
      move = analysis.move;
      secondarySearch = {
        completedDepth: analysis.stats?.completedDepth ?? null,
        nodes: analysis.stats?.nodes ?? null,
        rootScore: analysis.stats?.rootScore ?? null,
        timedOut: Boolean(analysis.stats?.timedOut),
      };
    }
    if (!move) break;

    const before = identityKeys(state);
    const result = E.applyMove(state, move);
    const after = identityKeys(result.state);
    moves.push({
      ply,
      player: state.player,
      source: isOpening ? "opening-random" : "ai",
      move,
      moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: before.historicalStateHash,
      beforeRuleStateKey: before.ruleStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRuleStateKey: after.ruleStateKey,
      phaseTransitionOccurred: result.events.some(({ kind }) => kind === "phase"),
      eventKinds: result.events.map(({ kind }) => kind),
      secondarySearch,
    });
    state = result.state;
  }

  const historicalSequence = observations.map(({ identity }) => identity.historicalStateHash);
  const ruleSequence = observations.map(({ identity }) => identity.ruleStateKey);
  const canonicalSequence = observations.map(({ identity }) => identity.seatCanonicalKey);
  const openingObservation = observations[Math.min(config.opening.plies, observations.length - 1)];
  const temporalOutcome = summarizeTemporalOutcome(observations, config.maxPly);

  return {
    schemaVersion: 1,
    gameId,
    gameIndex,
    replicateIndex,
    openingSeed,
    seed: openingSeed,
    conditionIndex,
    conditionId: condition.id,
    condition,
    configHash: hashValue(config),
    openingStateKey: openingObservation.identity.ruleStateKey,
    observations,
    moves,
    historicalTrajectoryHash: hashValue(historicalSequence),
    ruleTrajectoryHash: hashValue(ruleSequence),
    seatCanonicalTrajectoryHash: hashValue(canonicalSequence),
    finalHistoricalStateHash: historicalSequence.at(-1),
    finalRuleStateKey: ruleSequence.at(-1),
    winner: state.winner,
    reason: state.reason || (temporalOutcome.administrativeTruncation ? "max-ply" : "no-move"),
    plies: moves.length,
    temporalOutcome,
  };
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function summarizeGames(games, config) {
  const trajectories = countValues(games.map(({ historicalTrajectoryHash }) => historicalTrajectoryHash));
  const openings = countValues(games.map(({ openingStateKey }) => openingStateKey));
  const largestTrajectoryGroup = trajectories.size ? Math.max(...trajectories.values()) : 0;
  return {
    games: games.length,
    replicates: config.replicates,
    observations: games.reduce((total, game) => total + game.observations.length, 0),
    uniqueHistoricalTrajectories: trajectories.size,
    largestTrajectoryGroup,
    duplicateHistoricalTrajectoryGroups: [...trajectories.values()].filter((count) => count > 1).length,
    uniqueOpeningStateKeys: openings.size,
    expectedPairedOpeningReplicates: config.replicates,
    reachedMtajiGames: games.filter(({ temporalOutcome }) => temporalOutcome.reachedMtaji).length,
    firstMtajiMorphologyEligibleGames: games.filter(({ temporalOutcome }) => temporalOutcome.firstMtajiMorphologyEligible).length,
    terminalBeforeMtajiGames: games.filter(({ temporalOutcome }) => temporalOutcome.terminalBeforeMtaji).length,
    administrativeTruncationGames: games.filter(({ temporalOutcome }) => temporalOutcome.administrativeTruncation).length,
    phaseTransitionEventGames: games.filter((game) => game.moves.some(({ phaseTransitionOccurred }) => phaseTransitionOccurred)).length,
    conditionCounts: Object.fromEntries(config.conditions.map(({ id }) => [
      id,
      games.filter(({ conditionId }) => conditionId === id).length,
    ])),
  };
}

function gameSummary(game, config) {
  return {
    gameId: game.gameId,
    conditionId: game.conditionId,
    replicateIndex: game.replicateIndex,
    openingSeed: game.openingSeed,
    seed: game.seed,
    plies: game.plies,
    openingPliesApplied: config.opening.plies,
    baseline: false,
    winner: game.winner,
    reason: game.reason,
    openingStateKey: game.openingStateKey,
    historicalTrajectoryHash: game.historicalTrajectoryHash,
    ruleTrajectoryHash: game.ruleTrajectoryHash,
    seatCanonicalTrajectoryHash: game.seatCanonicalTrajectoryHash,
    temporalOutcome: game.temporalOutcome,
  };
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
  return { status: "incomplete", output, completedGameFiles, expectedGames: PILOT.replicates * CONDITIONS.length };
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
    throw new Error("Instrumented source tree is dirty; commit/stash relevant source changes before Stage 1 generation");
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
        game = runGame(config, replicateIndex, conditionIndex);
        atomicWriteJson(file, game);
      }
      games.push(game);
      console.log(`[Namua-Mtaji Stage 1] ${games.length}/${config.games} ${game.gameId}`);
    }
  }

  const summaries = games.map((game) => gameSummary(game, config));
  const legacyRows = games.flatMap((game) => game.observations.map(toLegacyPhaseTransitionObservation));
  const gamesSummaryPath = path.join(output, "games-summary.json");
  const legacyPath = path.join(output, "legacy-observations.jsonl");
  atomicWriteJson(gamesSummaryPath, summaries);
  atomicWriteText(legacyPath, `${legacyRows.map((row) => JSON.stringify(row)).join("\n")}\n`);

  const summary = summarizeGames(games, config);
  const aggregateFiles = {
    "games-summary.json": {
      sha256: sha256Text(fs.readFileSync(gamesSummaryPath)),
      records: summaries.length,
    },
    "legacy-observations.jsonl": {
      sha256: sha256Text(fs.readFileSync(legacyPath)),
      records: legacyRows.length,
    },
  };
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage1-exploratory-temporal-pilot-complete",
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
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
  PILOT,
  SOURCE_FILES,
  experimentConfig,
  gameSummary,
  parseArgs,
  provenance,
  runGame,
  sourceFileHashes,
  summarizeGames,
};
