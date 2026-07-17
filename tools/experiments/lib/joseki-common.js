"use strict";

const os = require("node:os");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const {
  atomicWriteJson,
  hashValue,
  moveKey,
  provenance,
  seedFrom,
  seededRandom,
  stableStringify,
} = require("../paired-first-player-common.js");
const { mirrorMove, mirrorState } = require("../../symmetry/transform-candidates.js");

const JOSEKI_SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/experiments/lib/joseki-common.js",
  "tools/experiments/generate-joseki-tree.js",
  "tools/experiments/evaluate-joseki-nodes.js",
  "tools/experiments/analyze-joseki-results.js",
  "tools/experiments/verify-joseki-artifacts.js",
]);

const CONDITIONS = Object.freeze([
  ...[1, 2, 3, 4].map((depth) => ({ id: `bao-d${depth}`, depth, evaluation: "bao" })),
  ...[1, 2, 3, 4].map((depth) => ({ id: `legacy-d${depth}`, depth, evaluation: "legacy" })),
  ...[1, 2, 3, 4].map((depth) => ({ id: `bao-v2-d${depth}`, depth, evaluation: "bao-v2" })),
]);

function josekiProvenance() {
  const base = provenance();
  const cpus = os.cpus();
  const root = path.resolve(__dirname, "../../..");
  return {
    ...base,
    sourceFileSha256: Object.fromEntries(JOSEKI_SOURCE_FILES.map((file) => [file,
      crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex")])),
    cpu: cpus.length ? { model: cpus[0].model, logicalCores: cpus.length } : null,
    osRelease: os.release(),
  };
}

function stateFeatures(state) {
  const view = (player) => (state.player === player ? state : { ...state, player });
  const variants = [0, 1].map((player) => E.moveVariants(view(player)));
  const sum = (values) => values.reduce((total, value) => total + value, 0);
  return {
    player: state.player,
    phase: state.phase,
    turn: state.turn,
    reserve: [...state.reserve],
    houseOwned: [...state.houseOwned],
    nyumbaSeeds: state.pits.map((rows) => rows[E.FRONT][E.HOUSE]),
    legalMoves: variants.map((moves) => moves.length),
    captureMoves: variants.map((moves) => moves.filter(({ type }) => type === "capture").length),
    forcedCapture: variants.map((moves) => moves.length > 0 && moves.every(({ type }) => type === "capture")),
    boardSeeds: state.pits.map((rows) => sum(rows[E.FRONT]) + sum(rows[E.BACK])),
    frontSeeds: state.pits.map((rows) => sum(rows[E.FRONT])),
    backSeeds: state.pits.map((rows) => sum(rows[E.BACK])),
  };
}

function canonicalStateHash(state) {
  const direct = hashValue(state);
  const mirrored = hashValue(mirrorState(state));
  return direct < mirrored ? direct : mirrored;
}

function nodeId(ply, sequenceHash) {
  return `p${ply}-${sequenceHash.slice(0, 12)}`;
}

function makeNode(state, moves, parentId = null) {
  const moveKeys = moves.map(moveKey);
  const sequenceHash = hashValue(moveKeys);
  return {
    nodeId: nodeId(moves.length, sequenceHash),
    ply: moves.length,
    parentId,
    move: moves.length ? moves.at(-1) : null,
    moveKey: moveKeys.at(-1) || null,
    moveKeys,
    sequenceHash,
    state,
    stateHash: hashValue(state),
    canonicalStateHash: canonicalStateHash(state),
    terminal: state.winner !== null,
    features: stateFeatures(state),
  };
}

function conditionConfig(condition) {
  return {
    conditionId: condition.id,
    level: "hard",
    searchProfile: "phase2",
    evaluationProfile: condition.evaluation,
    maxDepth: condition.depth,
    timeLimitMs: "Infinity",
  };
}

function evaluateNode(node, condition, treeHash) {
  const seed = seedFrom(treeHash, node.nodeId, condition.id);
  const random = seededRandom(seed);
  const started = process.hrtime.bigint();
  const analysis = AI.analyzeMove(node.state, "hard", random, {
    searchProfile: "phase2",
    evaluationProfile: condition.evaluation,
    maxDepth: condition.depth,
    timeLimitMs: Infinity,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  const perspective = node.state.player;
  const southFactor = perspective === 0 ? 1 : -1;
  const staticScore = condition.evaluation === "legacy"
    ? AI.legacyEvaluate(node.state, 0)
    : AI.evaluateWithProfile(node.state, 0, condition.evaluation);
  return {
    nodeId: node.nodeId,
    stateHash: node.stateHash,
    conditionId: condition.id,
    conditionConfig: conditionConfig(condition),
    conditionConfigHash: hashValue(conditionConfig(condition)),
    seed,
    perspective,
    recommendedMove: analysis.move,
    recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
    searchScore: analysis.stats.rootScore,
    southSearchScore: analysis.stats.rootScore === null ? null : analysis.stats.rootScore * southFactor,
    southStaticScore: staticScore,
    stats: { ...analysis.stats, elapsedMs },
  };
}

function symmetryAudit(tree) {
  const failures = [];
  let legalMovesChecked = 0;
  let transitionsChecked = 0;
  for (const node of tree.nodes) {
    const mirrored = mirrorState(node.state);
    const actual = E.moveVariants(mirrored).map(moveKey).sort();
    const expected = E.moveVariants(node.state).map((move) => moveKey(mirrorMove(move))).sort();
    legalMovesChecked += expected.length;
    if (stableStringify(actual) !== stableStringify(expected)) {
      failures.push({ nodeId: node.nodeId, kind: "legal-moves" });
      continue;
    }
    for (const move of E.moveVariants(node.state)) {
      const left = mirrorState(E.applyMove(node.state, move).state);
      const right = E.applyMove(mirrored, mirrorMove(move)).state;
      transitionsChecked += 1;
      if (stableStringify(left) !== stableStringify(right)) {
        failures.push({ nodeId: node.nodeId, kind: "transition", moveKey: moveKey(move) });
      }
    }
  }
  return { passed: failures.length === 0, nodes: tree.nodes.length, legalMovesChecked, transitionsChecked, failures };
}

module.exports = {
  AI,
  CONDITIONS,
  E,
  JOSEKI_SOURCE_FILES,
  atomicWriteJson,
  canonicalStateHash,
  conditionConfig,
  evaluateNode,
  hashValue,
  josekiProvenance,
  makeNode,
  moveKey,
  stateFeatures,
  stableStringify,
  symmetryAudit,
};
