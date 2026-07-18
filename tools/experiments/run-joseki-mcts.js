#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  AI,
  atomicWriteJson,
  hashValue,
  josekiProvenance,
  moveKey,
  stableStringify,
} = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

const ROOT = path.resolve(__dirname, "../..");
const EXTRA_SOURCE_FILES = Object.freeze([
  "tools/experiments/run-joseki-mcts.js",
  "tools/experiments/verify-joseki-mcts.js",
  "tools/experiments/analyze-joseki-mcts.js",
]);
const DEFAULT_SEEDS = Object.freeze([1, 2, 3]);
const FIXED_CONFIG = Object.freeze({
  level: "hard",
  searchProfile: "mcts",
  evaluationProfile: "bao",
  timeLimitMs: "Infinity",
  mctsIterations: 12,
  mctsPlayoutTurns: 16,
  mctsExploration: Math.SQRT2,
  mctsPolicy: "evaluation",
  mctsRoot: "visits",
  mctsReward: "evaluation",
  mctsPrior: "none",
  mctsPriorWeight: 1,
  mctsCandidateLimit: 0,
  mctsCandidateSource: "all",
  mctsCandidateDepth: 1,
});
const FIXED_THRESHOLDS = Object.freeze({
  choiceNodePhase2AgreementMinimum: 0.60,
  choiceNodeUnanimousSeedConsensusMinimum: 0.70,
  maximumTimeouts: 0,
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    output: "artifacts/joseki-study/robustness/mcts-8ply",
    minPly: 8,
    seeds: [...DEFAULT_SEEDS],
    maxNodes: null,
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--output") options.output = value;
      else if (key === "--min-ply") options.minPly = Number(value);
      else if (key === "--seeds") options.seeds = value.split(",").map(Number);
      else if (key === "--max-nodes") options.maxNodes = Number(value);
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  if (!Number.isInteger(options.minPly) || options.minPly < 0 || options.minPly > 8) {
    throw new Error("min-ply must be an integer from 0 through 8");
  }
  if (!options.seeds.length || options.seeds.some((seed) => !Number.isSafeInteger(seed))
    || new Set(options.seeds).size !== options.seeds.length) {
    throw new Error("seeds must be unique safe integers");
  }
  if (options.maxNodes !== null && (!Number.isInteger(options.maxNodes) || options.maxNodes < 1)) {
    throw new Error("max-nodes must be a positive integer");
  }
  return options;
}

function fileSha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex");
}

function mctsProvenance() {
  const base = josekiProvenance();
  return { ...base, sourceFileSha256: { ...base.sourceFileSha256,
    ...Object.fromEntries(EXTRA_SOURCE_FILES.map((file) => [file, fileSha256(file)])) } };
}

function conditionId(seedIndex) { return `mcts-s${seedIndex}`; }

function identity(options, tree) {
  const source = mctsProvenance();
  const conditionIds = options.seeds.map(conditionId);
  const conditionHashes = Object.fromEntries(options.seeds.map((seedIndex) => {
    const id = conditionId(seedIndex);
    return [id, hashValue({ ...FIXED_CONFIG, conditionId: id, seedIndex })];
  }));
  return {
    schemaVersion: 1,
    experiment: "joseki-mcts-8ply-screening",
    treeFile: options.tree,
    treeHash: tree.treeHash,
    conditionIds,
    conditionHashes,
    seedIndices: options.seeds,
    minPly: options.minPly,
    fixedConfig: FIXED_CONFIG,
    fixedThresholds: FIXED_THRESHOLDS,
    sourceCommit: source.sourceCommit,
    node: source.node,
    sourceFileSha256: source.sourceFileSha256,
  };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function resultPath(output, nodeId) { return path.join(output, "nodes", `${nodeId}.json`); }
function partialPath(output, nodeId) { return path.join(output, "partials", `${nodeId}.partial.json`); }

function counts(output, nodes) {
  let completedNodes = 0;
  let completedEvaluations = 0;
  let partialEvaluations = 0;
  for (const node of nodes) {
    if (fs.existsSync(resultPath(output, node.nodeId))) {
      completedNodes += 1;
      completedEvaluations += JSON.parse(fs.readFileSync(resultPath(output, node.nodeId), "utf8")).results.length;
    } else if (fs.existsSync(partialPath(output, node.nodeId))) {
      partialEvaluations += JSON.parse(fs.readFileSync(partialPath(output, node.nodeId), "utf8")).results.length;
    }
  }
  return { completedNodes, completedEvaluations, partialEvaluations,
    recordedEvaluations: completedEvaluations + partialEvaluations };
}

function writeProgress(options, nodes, experimentIdentity, startedAt, status, current = null) {
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1,
    status,
    startedAt,
    updatedAt: new Date().toISOString(),
    identity: experimentIdentity,
    expected: { nodes: nodes.length, conditions: experimentIdentity.conditionIds.length,
      evaluations: nodes.length * experimentIdentity.conditionIds.length },
    ...counts(options.output, nodes),
    current,
  });
}

function evaluateNode(node, treeHash, seedIndex) {
  const id = conditionId(seedIndex);
  const config = { ...FIXED_CONFIG, conditionId: id, seedIndex };
  const seed = seedFrom(treeHash, node.nodeId, "mcts", String(seedIndex));
  const started = process.hrtime.bigint();
  const analysis = AI.analyzeMove(node.state, FIXED_CONFIG.level, seededRandom(seed), {
    ...FIXED_CONFIG,
    timeLimitMs: Infinity,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  return {
    nodeId: node.nodeId,
    stateHash: node.stateHash,
    conditionId: id,
    conditionConfig: config,
    conditionConfigHash: hashValue(config),
    seed,
    seedIndex,
    perspective: node.state.player,
    legalMoveCount: node.features.legalMoves[node.state.player],
    recommendedMove: analysis.move,
    recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
    stats: { ...analysis.stats, elapsedMs },
  };
}

function validateBlock(block, node, experimentIdentity) {
  assertIdentity(experimentIdentity, block.identity, `Node ${node.nodeId}`);
  if (block.nodeId !== node.nodeId || block.stateHash !== node.stateHash) throw new Error(`Node mismatch: ${node.nodeId}`);
  const ids = block.results.map(({ conditionId: id }) => id);
  if (ids.length !== experimentIdentity.conditionIds.length || new Set(ids).size !== ids.length
    || experimentIdentity.conditionIds.some((id) => !ids.includes(id))) throw new Error(`Incomplete node: ${node.nodeId}`);
  for (const result of block.results) {
    const expectedSimulations = result.legalMoveCount === 0 ? 0 : FIXED_CONFIG.mctsIterations;
    if (result.stateHash !== node.stateHash
      || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
      || result.stats.simulations !== expectedSimulations
      || result.stats.timedOut) throw new Error(`MCTS integrity mismatch: ${node.nodeId}/${result.conditionId}`);
  }
}

function run(options) {
  if (options.status) {
    const file = path.join(options.output, "progress.json");
    console.log(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : JSON.stringify({ status: "not-started" }, null, 2));
    return null;
  }
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  validateTree(tree);
  const eligible = tree.nodes.filter(({ ply }) => ply >= options.minPly);
  const nodes = options.maxNodes === null ? eligible : eligible.slice(0, options.maxNodes);
  const experimentIdentity = identity(options, tree);
  fs.mkdirSync(options.output, { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  const previous = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, "utf8")) : null;
  if (previous) assertIdentity(experimentIdentity, previous.identity, "Progress");
  const startedAt = previous?.startedAt || new Date().toISOString();
  writeProgress(options, nodes, experimentIdentity, startedAt, "running");
  for (const node of nodes) {
    const completeFile = resultPath(options.output, node.nodeId);
    const partialFile = partialPath(options.output, node.nodeId);
    if (fs.existsSync(completeFile)) {
      validateBlock(JSON.parse(fs.readFileSync(completeFile, "utf8")), node, experimentIdentity);
      continue;
    }
    const partial = fs.existsSync(partialFile)
      ? JSON.parse(fs.readFileSync(partialFile, "utf8"))
      : { schemaVersion: 1, status: "partial", nodeId: node.nodeId, stateHash: node.stateHash,
        identity: experimentIdentity, results: [] };
    assertIdentity(experimentIdentity, partial.identity, `Partial ${node.nodeId}`);
    const done = new Set(partial.results.map(({ conditionId: id }) => id));
    for (const seedIndex of options.seeds) {
      const id = conditionId(seedIndex);
      if (done.has(id)) continue;
      writeProgress(options, nodes, experimentIdentity, startedAt, "running", { nodeId: node.nodeId, conditionId: id });
      partial.results.push(evaluateNode(node, tree.treeHash, seedIndex));
      partial.updatedAt = new Date().toISOString();
      atomicWriteJson(partialFile, partial);
    }
    const block = { ...partial, status: "complete", completedAt: new Date().toISOString(),
      results: partial.results.slice().sort((a, b) => a.conditionId.localeCompare(b.conditionId)) };
    validateBlock(block, node, experimentIdentity);
    atomicWriteJson(completeFile, block);
    fs.unlinkSync(partialFile);
    const progressCounts = counts(options.output, nodes);
    console.log(`[joseki-mcts] ${progressCounts.completedNodes}/${nodes.length} nodes`);
  }
  const finalCounts = counts(options.output, nodes);
  writeProgress(options, nodes, experimentIdentity, startedAt, "complete");
  console.log(JSON.stringify({ status: "complete", ...finalCounts }, null, 2));
  return finalCounts;
}

function main() { run(parseArgs(process.argv.slice(2))); }
if (require.main === module) main();

module.exports = {
  DEFAULT_SEEDS, FIXED_CONFIG, FIXED_THRESHOLDS, assertIdentity, conditionId, counts,
  evaluateNode, identity, mctsProvenance, parseArgs, partialPath, resultPath, run, validateBlock,
};
