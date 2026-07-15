"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");

const CONDITIONS = Object.freeze([
  { id: "C0", depth: 2, evaluation: "bao", search: "phase2" },
  { id: "D1", depth: 1, evaluation: "bao", search: "phase2" },
  { id: "D3", depth: 3, evaluation: "bao", search: "phase2" },
  { id: "D4", depth: 4, evaluation: "bao", search: "phase2" },
  { id: "EL", depth: 2, evaluation: "legacy", search: "phase2" },
  { id: "EV2", depth: 2, evaluation: "bao-v2", search: "phase2" },
  { id: "SM", depth: 2, evaluation: "bao", search: "mcts" },
]);

const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/paired-first-player-common.js",
  "tools/experiments/generate-opening-corpus.js",
  "tools/experiments/run-paired-first-player-research.js",
  "tools/experiments/aggregate-paired-first-player-research.js",
]);

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashValue(value) {
  return sha256Text(stableStringify(value));
}

function atomicWriteJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, file);
}

function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function sourceFileHashes(root = path.resolve(__dirname, "../..")) {
  return Object.fromEntries(SOURCE_FILES.filter((file) => fs.existsSync(path.join(root, file))).map((file) => [
    file,
    sha256Text(fs.readFileSync(path.join(root, file))),
  ]));
}

function provenance(root = path.resolve(__dirname, "../..")) {
  return {
    sourceCommit: process.env.BAO_RESEARCH_SOURCE_COMMIT || gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: process.env.BAO_RESEARCH_SOURCE_DIRTY
      ? process.env.BAO_RESEARCH_SOURCE_DIRTY === "true"
      : Boolean(gitValue(["status", "--porcelain", "--", ...SOURCE_FILES], "")),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    sourceFileSha256: sourceFileHashes(root),
  };
}

function seedFrom(...parts) {
  return Number.parseInt(sha256Text(parts.join("\u0000")).slice(0, 8), 16) >>> 0;
}

function moveKey(move) {
  return AI.moveKey ? AI.moveKey(move) : stableStringify(move);
}

function chooseOpeningMove(state, random, policy = "uniform", evaluation = "bao") {
  const moves = E.moveVariants(state);
  if (!moves.length) return null;
  if (policy === "uniform") return moves[Math.floor(random() * moves.length)];
  const ranked = moves.map((move) => ({
    move,
    score: AI.evaluationBreakdown(E.applyMove(state, move).state, state.player, {
      evaluationProfile: evaluation,
    }).total,
  })).sort((a, b) => b.score - a.score || moveKey(a.move).localeCompare(moveKey(b.move)));
  if (policy === "top3") {
    const candidates = ranked.slice(0, Math.min(3, ranked.length));
    return candidates[Math.floor(random() * candidates.length)].move;
  }
  if (policy !== "softmax") throw new Error(`Unsupported opening policy: ${policy}`);
  const max = ranked[0].score;
  const weights = ranked.map(({ score }) => Math.exp(Math.max(-20, (score - max) / 80)));
  let target = random() * weights.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < ranked.length; index += 1) {
    target -= weights[index];
    if (target <= 0) return ranked[index].move;
  }
  return ranked.at(-1).move;
}

function openingFeatures(state) {
  const playerView = (player) => (state.player === player ? state : { ...state, player });
  const variants = [0, 1].map((player) => E.moveVariants(playerView(player)));
  return {
    reserve: [...state.reserve],
    houseOwned: [...state.houseOwned],
    nyumbaSeeds: [state.pits[0][E.FRONT][E.HOUSE], state.pits[1][E.FRONT][E.HOUSE]],
    captureMoves: variants.map((moves) => moves.filter((move) => move.type === "capture").length),
    legalMoves: variants.map((moves) => moves.length),
    frontOccupied: state.pits.map((rows) => rows[E.FRONT].filter((seeds) => seeds > 0).length),
  };
}

function generateOpening(seed, plies, policy = "uniform") {
  const random = seededRandom(seed);
  let state = E.initialState();
  const openingMoves = [];
  const openingMoveKeys = [];
  while (state.winner === null && openingMoves.length < plies) {
    const move = chooseOpeningMove(state, random, policy);
    if (!move) break;
    openingMoves.push(move);
    openingMoveKeys.push(moveKey(move));
    state = E.applyMove(state, move).state;
  }
  return {
    seed,
    requestedPlies: plies,
    playedPlies: openingMoves.length,
    openingPolicy: policy,
    openingMoves,
    openingMoveKeys,
    openingMovesHash: hashValue(openingMoveKeys),
    openingState: state,
    openingStateHash: hashValue(state),
    firstMove: openingMoveKeys[0] || "",
    handoffPlayer: state.player,
    phase: state.phase,
    features: openingFeatures(state),
    terminal: state.winner !== null,
  };
}

function parseJsonLines(text, label = "JSONL") {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  return lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${label} line ${index + 1}: ${error.message}`);
    }
  });
}

function validateCorpus(entries, manifest = null, corpusText = null) {
  if (!Array.isArray(entries) || !entries.length) throw new Error("Corpus must contain at least one opening");
  const ids = new Set();
  const moves = new Set();
  for (const entry of entries) {
    if (!entry.openingId || ids.has(entry.openingId)) throw new Error(`Duplicate or missing openingId: ${entry.openingId}`);
    ids.add(entry.openingId);
    if (entry.terminal) throw new Error(`Terminal opening in corpus: ${entry.openingId}`);
    if (entry.playedPlies !== entry.requestedPlies) throw new Error(`Incomplete opening: ${entry.openingId}`);
    if (moves.has(entry.openingMovesHash)) throw new Error(`Duplicate openingMovesHash: ${entry.openingMovesHash}`);
    moves.add(entry.openingMovesHash);
    if (hashValue(entry.openingMoveKeys) !== entry.openingMovesHash) throw new Error(`Opening moves hash mismatch: ${entry.openingId}`);
    if (hashValue(entry.openingState) !== entry.openingStateHash) throw new Error(`Opening state hash mismatch: ${entry.openingId}`);
  }
  if (manifest) {
    if (manifest.openings !== entries.length) throw new Error("Manifest opening count mismatch");
    if (corpusText !== null && manifest.corpusFileSha256 !== sha256Text(corpusText)) throw new Error("Manifest corpus SHA-256 mismatch");
    if (manifest.entriesHash !== hashValue(entries)) throw new Error("Manifest entries hash mismatch");
  }
  return { openings: entries.length, openingIds: ids.size, uniqueOpeningMoves: moves.size };
}

function conditionConfig(condition, options = {}) {
  return {
    conditionId: condition.id,
    level: "hard",
    maxDepth: condition.depth,
    evaluationProfile: condition.evaluation,
    searchProfile: condition.search,
    maxTurns: options.maxTurns ?? 120,
    mctsIterations: options.mctsIterations ?? 12,
    mctsPlayoutTurns: options.mctsPlayoutTurns ?? 16,
    mctsExploration: Math.SQRT2,
    mctsPolicy: "evaluation",
    mctsRoot: "visits",
    mctsReward: "evaluation",
  };
}

function playContinuation(opening, condition, randomSeed, options = {}) {
  const config = conditionConfig(condition, options);
  const random = seededRandom(randomSeed);
  let state = E.clone(opening.openingState);
  const transcript = [...opening.openingMoveKeys];
  let continuationPlies = 0;
  const started = process.hrtime.bigint();
  while (state.winner === null && opening.playedPlies + continuationPlies < config.maxTurns) {
    const analysis = AI.analyzeMove(state, config.level, random, {
      timeLimitMs: Infinity,
      maxDepth: config.maxDepth,
      evaluationProfile: config.evaluationProfile,
      searchProfile: config.searchProfile,
      mctsIterations: config.mctsIterations,
      mctsPlayoutTurns: config.mctsPlayoutTurns,
      mctsExploration: config.mctsExploration,
      mctsPolicy: config.mctsPolicy,
      mctsRoot: config.mctsRoot,
      mctsReward: config.mctsReward,
    });
    if (!analysis.move) break;
    transcript.push(moveKey(analysis.move));
    state = E.applyMove(state, analysis.move).state;
    continuationPlies += 1;
  }
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  return {
    conditionId: condition.id,
    conditionConfig: config,
    conditionConfigHash: hashValue(config),
    seed: randomSeed,
    openingId: opening.openingId,
    openingStateHash: opening.openingStateHash,
    winner: state.winner,
    score: state.winner === 0 ? 1 : state.winner === 1 ? 0 : 0.5,
    reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: opening.playedPlies,
    continuationPlies,
    totalPlies: opening.playedPlies + continuationPlies,
    transcriptHash: hashValue(transcript),
    finalStateHash: hashValue(state),
    elapsedMs,
  };
}

module.exports = {
  AI,
  CONDITIONS,
  E,
  SOURCE_FILES,
  atomicWriteJson,
  chooseOpeningMove,
  conditionConfig,
  generateOpening,
  hashValue,
  moveKey,
  openingFeatures,
  parseJsonLines,
  playContinuation,
  provenance,
  seedFrom,
  seededRandom,
  sha256Text,
  stableStringify,
  validateCorpus,
};
