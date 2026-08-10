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

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json",
);
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/symmetry/transform-candidates.js",
  "tools/experiments/lib/phase-transition-features.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/run-position-typology-stage2-confirmation.js",
  "tools/experiments/verify-position-typology-stage2-confirmation.js",
  "tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py",
  "schemas/position-typology-observation.schema.json",
  "doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadSpec() {
  const spec = readJson(SPEC_PATH);
  if (spec.formalExperiment !== true || spec.exploratory !== false) {
    throw new Error("Stage 2 preregistration boundary mismatch");
  }
  if (spec.stage !== "stage2-mtaji-independent-confirmation") {
    throw new Error(`Unexpected preregistration stage: ${spec.stage}`);
  }
  if (spec.preregistrationId !== "PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1") {
    throw new Error(`Unexpected preregistration id: ${spec.preregistrationId}`);
  }
  const expectedLast = spec.corpus.baseSeed + spec.corpus.games - 1;
  if (expectedLast !== spec.corpus.lastSeed) throw new Error("Seed block mismatch");
  if (spec.corpus.games % spec.corpus.conditions.length !== 0) {
    throw new Error("Games must divide evenly across conditions");
  }
  return spec;
}

function parseArgs(argv) {
  const options = {
    output: "artifacts/local/position-typology/stage2-mtaji-confirmation-v1",
    force: false,
    status: false,
  };
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
    throw new Error(`Unknown or forbidden formal-run argument: ${arg}`);
  }
  return options;
}

function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return fallback;
  }
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sourceFileHashes(root = ROOT) {
  return Object.fromEntries(SOURCE_FILES.map((file) => {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) throw new Error(`Missing formal source file: ${file}`);
    return [file, sha256Text(fs.readFileSync(full))];
  }));
}

function provenance(root = ROOT) {
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...SOURCE_FILES], "")),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    sourceFileSha256: sourceFileHashes(root),
  };
}

function formalConfig(spec, sourceHashes) {
  return {
    study: spec.study,
    stage: spec.stage,
    schemaVersion: spec.schemaVersion,
    formalExperiment: true,
    exploratory: false,
    candidateDefinitionHash: spec.candidateDefinition.requiredHash,
    preregistrationId: spec.preregistrationId,
    preregistrationSpecFileSha256: sourceHashes["doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json"],
    games: spec.corpus.games,
    baseSeed: spec.corpus.baseSeed,
    lastSeed: spec.corpus.lastSeed,
    maxPly: spec.corpus.maxPly,
    opening: spec.corpus.opening,
    conditions: spec.corpus.conditions,
    gamesPerCondition: spec.corpus.gamesPerCondition,
    populationPolicy: spec.population,
    sourceInstrumentationHash: hashValue(sourceHashes),
  };
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
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

function runGame(config, gameIndex) {
  const seed = config.baseSeed + gameIndex;
  const random = seededRandom(seed);
  const condition = config.conditions[gameIndex % config.conditions.length];
  const gameId = `ptyp-s2c-${String(gameIndex).padStart(4, "0")}`;
  const observations = [];
  const moves = [];
  let state = E.initialState();

  for (let ply = 0; ply <= config.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId,
      conditionId: condition.id,
      seed,
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

    const before = observation.identity;
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
      secondarySearch,
    });
    state = result.state;
  }

  const openingObservation = observations[Math.min(config.opening.plies, observations.length - 1)];
  const historicalSequence = observations.map(({ identity }) => identity.historicalStateHash);
  const ruleSequence = observations.map(({ identity }) => identity.ruleStateKey);
  const seatCanonicalSequence = observations.map(({ identity }) => identity.seatCanonicalKey);
  return {
    schemaVersion: 1,
    gameId,
    gameIndex,
    seed,
    conditionId: condition.id,
    condition,
    configHash: hashValue(config),
    openingStateKey: openingObservation.identity.ruleStateKey,
    observations,
    moves,
    historicalTrajectoryHash: hashValue(historicalSequence),
    ruleTrajectoryHash: hashValue(ruleSequence),
    seatCanonicalTrajectoryHash: hashValue(seatCanonicalSequence),
    finalHistoricalStateHash: historicalSequence.at(-1),
    finalRuleStateKey: ruleSequence.at(-1),
    winner: state.winner,
    reason: state.reason || (moves.length >= config.maxPly ? "max-ply" : "no-move"),
    plies: moves.length,
  };
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function largestGroup(counts) {
  return counts.size ? Math.max(...counts.values()) : 0;
}

function summarizeGames(games) {
  const observations = games.flatMap((game) => game.observations);
  const ruleKeys = observations.map(({ identity }) => identity.ruleStateKey);
  const canonicalKeys = observations.map(({ identity }) => identity.seatCanonicalKey);
  const trajectories = countValues(games.map(({ ruleTrajectoryHash }) => ruleTrajectoryHash));
  const openings = countValues(games.map(({ openingStateKey }) => openingStateKey));
  const phaseCounts = observations.reduce((counts, { phase }) => {
    counts[phase] = (counts[phase] || 0) + 1;
    return counts;
  }, {});
  const conditionCounts = games.reduce((counts, { conditionId }) => {
    counts[conditionId] = (counts[conditionId] || 0) + 1;
    return counts;
  }, {});
  return {
    games: games.length,
    observations: observations.length,
    terminalObservations: observations.filter(({ terminal }) => terminal).length,
    phaseCounts,
    conditionCounts,
    positions: {
      raw: observations.length,
      uniqueRuleState: new Set(ruleKeys).size,
      duplicateRuleStateSlots: ruleKeys.length - new Set(ruleKeys).size,
      uniqueSeatCanonical: new Set(canonicalKeys).size,
      seatCanonicalCollapse: new Set(ruleKeys).size - new Set(canonicalKeys).size,
    },
    trajectories: {
      uniqueRuleState: trajectories.size,
      largestRuleStateGroup: largestGroup(trajectories),
    },
    openings: {
      uniqueRuleState: openings.size,
      largestGroup: largestGroup(openings),
    },
  };
}

function readExistingGame(filePath, configHash) {
  if (!fs.existsSync(filePath)) return null;
  const game = readJson(filePath);
  if (game.configHash !== configHash) throw new Error(`Config hash mismatch in ${filePath}`);
  return game;
}

function status(output) {
  const manifestPath = path.join(output, "manifest.json");
  if (fs.existsSync(manifestPath)) return readJson(manifestPath);
  const gamesDir = path.join(output, "games");
  const games = fs.existsSync(gamesDir)
    ? fs.readdirSync(gamesDir).filter((name) => /^game-\d+\.json$/.test(name)).length
    : 0;
  return { status: "incomplete", output, completedGameFiles: games };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const output = path.resolve(options.output);
  if (options.status) {
    console.log(JSON.stringify(status(output), null, 2));
    return;
  }

  const spec = loadSpec();
  const source = provenance();
  if (source.sourceTreeDirty) {
    throw new Error("Formal Stage 2 confirmation requires a clean source tree");
  }
  const config = formalConfig(spec, source.sourceFileSha256);
  const configHash = hashValue(config);
  const games = [];

  for (let gameIndex = 0; gameIndex < config.games; gameIndex += 1) {
    const file = gamePath(output, gameIndex);
    let game = options.force ? null : readExistingGame(file, configHash);
    if (!game) {
      game = runGame(config, gameIndex);
      atomicWriteJson(file, game);
    }
    games.push(game);
    console.log(`[position-typology stage2 confirmation] ${gameIndex + 1}/${config.games} ${game.gameId}`);
  }

  const summary = summarizeGames(games);
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "stage2-mtaji-confirmation-corpus-complete",
    formalExperiment: true,
    exploratory: false,
    confirmationExperiment: true,
    candidateDefinitionHash: spec.candidateDefinition.requiredHash,
    preregistrationId: spec.preregistrationId,
    preregistrationSpecFileSha256: source.sourceFileSha256["doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json"],
    heldOutSeedBlock: {
      first: config.baseSeed,
      last: config.lastSeed,
      count: config.games,
    },
    output,
    config,
    configHash,
    provenance: source,
    completedGames: games.length,
    summary,
    summaryHash: hashValue(summary),
  };
  atomicWriteJson(path.join(output, "manifest.json"), manifest);
  console.log(JSON.stringify(manifest, null, 2));
}

if (require.main === module) main();

module.exports = {
  SOURCE_FILES,
  formalConfig,
  loadSpec,
  parseArgs,
  provenance,
  runGame,
  sourceFileHashes,
  summarizeGames,
};
