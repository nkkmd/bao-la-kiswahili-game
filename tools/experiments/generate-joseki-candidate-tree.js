#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  AI,
  CONDITIONS,
  E,
  atomicWriteJson,
  hashValue,
  josekiProvenance,
  makeNode,
  moveKey,
  symmetryAudit,
} = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

const DEFAULT_FIRST_MOVE = "takata:namua:0:5:left:::false";
const SELECTION_CONDITION_IDS = Object.freeze([
  "bao-d1", "bao-d2", "bao-d3", "bao-d4", "legacy-d2", "bao-v2-d2",
]);
const SELECTION_CONDITIONS = Object.freeze(SELECTION_CONDITION_IDS.map(
  (id) => CONDITIONS.find((condition) => condition.id === id),
));

function parseArgs(argv) {
  const options = {
    maxPly: 8,
    top: 3,
    firstMove: DEFAULT_FIRST_MOVE,
    output: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--max-ply") options.maxPly = Number(value);
    else if (key === "--top") options.top = Number(value);
    else if (key === "--first-move") options.firstMove = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!Number.isInteger(options.maxPly) || options.maxPly < 2 || options.maxPly > 8) {
    throw new Error("max-ply must be an integer from 2 through 8");
  }
  if (!Number.isInteger(options.top) || options.top < 1) throw new Error("top must be a positive integer");
  return options;
}

function staticScore(state, player, evaluation) {
  return evaluation === "legacy"
    ? AI.legacyEvaluate(state, player)
    : AI.evaluateWithProfile(state, player, evaluation);
}

function candidateScore(state, move, condition) {
  const next = E.applyMove(state, move).state;
  if (next.winner !== null) return next.winner === state.player ? 1_000_000 : -1_000_000;
  if (condition.depth <= 1) return staticScore(next, state.player, condition.evaluation);
  const reply = AI.analyzeMove(next, "hard", () => 0.5, {
    searchProfile: "phase2",
    evaluationProfile: condition.evaluation,
    maxDepth: condition.depth - 1,
    timeLimitMs: Infinity,
  });
  return reply.stats.rootScore === null
    ? staticScore(next, state.player, condition.evaluation)
    : -reply.stats.rootScore;
}

function selectMoves(state, top = 3, conditions = SELECTION_CONDITIONS) {
  const legal = E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
  if (legal.length <= top) return {
    selected: legal,
    metadata: { legalMoves: legal.length, selectedMoves: legal.length, reason: "all-legal" },
  };
  const baseline = conditions.find(({ id }) => id === "bao-d2") || conditions[0];
  const ranked = legal.map((move) => ({ move, moveKey: moveKey(move), score: candidateScore(state, move, baseline) }))
    .sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const selectedKeys = new Set(ranked.slice(0, top).map(({ moveKey: key }) => key));
  const recommendations = {};
  for (const condition of conditions) {
    if (condition.id === baseline.id) {
      recommendations[condition.id] = ranked[0].moveKey;
      continue;
    }
    const analysis = AI.analyzeMove(state, "hard", () => 0.5, {
      searchProfile: "phase2",
      evaluationProfile: condition.evaluation,
      maxDepth: condition.depth,
      timeLimitMs: Infinity,
    });
    const key = analysis.move ? moveKey(analysis.move) : null;
    recommendations[condition.id] = key;
    if (key) selectedKeys.add(key);
  }
  return {
    selected: legal.filter((move) => selectedKeys.has(moveKey(move))),
    metadata: {
      legalMoves: legal.length,
      selectedMoves: selectedKeys.size,
      reason: "baseline-top-and-condition-recommendations",
      baseline: baseline.id,
      baselineTop: ranked.slice(0, top),
      recommendations,
    },
  };
}

function buildCandidateTree(options) {
  const root = makeNode(E.initialState(), []);
  const firstMove = E.moveVariants(root.state).find((move) => moveKey(move) === options.firstMove);
  if (!firstMove) throw new Error(`First move is not legal: ${options.firstMove}`);
  const first = makeNode(E.applyMove(root.state, firstMove).state, [firstMove], root.nodeId);
  const nodes = [root, first];
  const edges = [{ parentId: root.nodeId, childId: first.nodeId, move: firstMove, moveKey: options.firstMove }];
  const selections = [{ nodeId: root.nodeId, ply: 0, legalMoves: E.moveVariants(root.state).length,
    selectedMoves: 1, reason: "fixed-screened-first-move", selectedMoveKeys: [options.firstMove] }];
  let frontier = [{ node: first, moves: [firstMove] }];
  const selectionCache = new Map();
  for (let ply = 2; ply <= options.maxPly; ply += 1) {
    const next = [];
    for (const entry of frontier) {
      if (entry.node.terminal) continue;
      const choice = ply === 2
        ? { selected: E.moveVariants(entry.node.state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))),
          metadata: { legalMoves: E.moveVariants(entry.node.state).length,
            selectedMoves: E.moveVariants(entry.node.state).length, reason: "all-first-replies" } }
        : (() => {
          if (!selectionCache.has(entry.node.stateHash)) {
            selectionCache.set(entry.node.stateHash, selectMoves(entry.node.state, options.top));
          }
          return selectionCache.get(entry.node.stateHash);
        })();
      selections.push({ nodeId: entry.node.nodeId, ply: entry.node.ply, ...choice.metadata,
        selectedMoveKeys: choice.selected.map(moveKey) });
      for (const move of choice.selected) {
        const moves = [...entry.moves, move];
        const child = makeNode(E.applyMove(entry.node.state, move).state, moves, entry.node.nodeId);
        nodes.push(child);
        edges.push({ parentId: entry.node.nodeId, childId: child.nodeId, move, moveKey: moveKey(move) });
        next.push({ node: child, moves });
      }
    }
    frontier = next;
  }
  const tree = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    maxPly: options.maxPly,
    rootNodeId: root.nodeId,
    initialStateHash: root.stateHash,
    nodes,
    edges,
    counts: {
      nodes: nodes.length,
      edges: edges.length,
      byPly: Object.fromEntries(Array.from({ length: options.maxPly + 1 }, (_, ply) => [ply,
        nodes.filter((node) => node.ply === ply).length])),
      uniqueStates: new Set(nodes.map(({ stateHash }) => stateHash)).size,
      transpositionNodes: nodes.length - new Set(nodes.map(({ stateHash }) => stateHash)).size,
      uniqueCanonicalStates: new Set(nodes.map(({ canonicalStateHash }) => canonicalStateHash)).size,
    },
    selectionPolicy: { firstMove: options.firstMove, top: options.top,
      conditionIds: SELECTION_CONDITION_IDS,
      retained: "C0 top-N union depth 1-4 and depth-2 evaluator recommendations", selections },
    provenance: {
      ...josekiProvenance(),
      candidateGeneratorSha256: crypto.createHash("sha256").update(fs.readFileSync(__filename)).digest("hex"),
    },
  };
  tree.treeHash = hashValue({ maxPly: tree.maxPly, initialStateHash: tree.initialStateHash,
    nodes: tree.nodes, edges: tree.edges });
  tree.symmetry = symmetryAudit(tree);
  validateTree(tree);
  return tree;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const tree = buildCandidateTree(options);
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  atomicWriteJson(options.output, tree);
  console.log(JSON.stringify({ output: options.output, treeHash: tree.treeHash, counts: tree.counts,
    symmetry: tree.symmetry, selectionPoints: tree.selectionPolicy.selections.length }, null, 2));
}

if (require.main === module) main();

module.exports = { DEFAULT_FIRST_MOVE, SELECTION_CONDITION_IDS, buildCandidateTree, candidateScore,
  parseArgs, selectMoves };
