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
const { validateSample } = require("./generate-joseki-mcts-sample.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILES = Object.freeze([
  "tools/experiments/generate-joseki-mcts-sample.js",
  "tools/experiments/run-joseki-mcts-sensitivity.js",
  "tools/experiments/verify-joseki-mcts-sensitivity.js",
  "tools/experiments/analyze-joseki-mcts-sensitivity.js",
]);
const ITERATIONS = Object.freeze([12, 48, 192]);
const SEEDS = Object.freeze([1, 2, 3]);
const BASE_CONFIG = Object.freeze({
  level: "hard",
  searchProfile: "mcts",
  evaluationProfile: "bao",
  timeLimitMs: "Infinity",
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
  highIterationUnanimousConsensusMinimum: 0.50,
  unanimousConsensusImprovementMinimum: 0.20,
  maximumTimeouts: 0,
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    sample: "artifacts/joseki-study/corpus/mcts-sensitivity-sample.json",
    output: "artifacts/joseki-study/robustness/mcts-sensitivity",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--sample") options.sample = value;
      else if (key === "--output") options.output = value;
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  return options;
}

function fileSha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex");
}

function sensitivityProvenance() {
  const base = josekiProvenance();
  return { ...base, sourceFileSha256: { ...base.sourceFileSha256,
    ...Object.fromEntries(SOURCE_FILES.map((file) => [file, fileSha256(file)])) } };
}

function conditionId(iterations, seedIndex) {
  return `mcts-i${String(iterations).padStart(3, "0")}-s${seedIndex}`;
}

function conditionConfig(iterations, seedIndex) {
  return { ...BASE_CONFIG, conditionId: conditionId(iterations, seedIndex),
    mctsIterations: iterations, seedIndex };
}

function conditions() {
  return ITERATIONS.flatMap((iterations) => SEEDS.map((seedIndex) => ({
    id: conditionId(iterations, seedIndex), iterations, seedIndex,
    config: conditionConfig(iterations, seedIndex),
  })));
}

function identity(options, tree, sample) {
  const source = sensitivityProvenance();
  const selected = conditions();
  return {
    schemaVersion: 1,
    experiment: "joseki-mcts-iteration-sensitivity",
    treeFile: options.tree,
    treeHash: tree.treeHash,
    sampleFile: options.sample,
    sampleHash: sample.sampleHash,
    conditionIds: selected.map(({ id }) => id),
    conditionHashes: Object.fromEntries(selected.map(({ id, config }) => [id, hashValue(config)])),
    iterations: ITERATIONS,
    seedIndices: SEEDS,
    fixedConfig: BASE_CONFIG,
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
    const complete = resultPath(output, node.nodeId);
    const partial = partialPath(output, node.nodeId);
    if (fs.existsSync(complete)) {
      completedNodes += 1;
      completedEvaluations += JSON.parse(fs.readFileSync(complete, "utf8")).results.length;
    } else if (fs.existsSync(partial)) {
      partialEvaluations += JSON.parse(fs.readFileSync(partial, "utf8")).results.length;
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

function evaluateNode(node, treeHash, condition) {
  const seed = seedFrom(treeHash, node.nodeId, "mcts-sensitivity", String(condition.iterations),
    String(condition.seedIndex));
  const started = process.hrtime.bigint();
  const analysis = AI.analyzeMove(node.state, BASE_CONFIG.level, seededRandom(seed), {
    ...condition.config,
    timeLimitMs: Infinity,
  });
  return {
    nodeId: node.nodeId,
    stateHash: node.stateHash,
    conditionId: condition.id,
    conditionConfig: condition.config,
    conditionConfigHash: hashValue(condition.config),
    iterations: condition.iterations,
    seedIndex: condition.seedIndex,
    seed,
    perspective: node.state.player,
    legalMoveCount: node.features.legalMoves[node.state.player],
    recommendedMove: analysis.move,
    recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
    stats: { ...analysis.stats, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 },
  };
}

function validateBlock(block, node, experimentIdentity) {
  assertIdentity(experimentIdentity, block.identity, `Node ${node.nodeId}`);
  if (block.nodeId !== node.nodeId || block.stateHash !== node.stateHash) throw new Error(`Node mismatch: ${node.nodeId}`);
  const ids = block.results.map(({ conditionId: id }) => id);
  if (ids.length !== experimentIdentity.conditionIds.length || new Set(ids).size !== ids.length
    || experimentIdentity.conditionIds.some((id) => !ids.includes(id))) throw new Error(`Incomplete node: ${node.nodeId}`);
  for (const result of block.results) {
    if (result.stateHash !== node.stateHash
      || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
      || result.legalMoveCount <= 1
      || result.stats.simulations !== result.iterations
      || result.stats.timedOut) throw new Error(`Sensitivity integrity mismatch: ${node.nodeId}/${result.conditionId}`);
  }
}

function loadInputs(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const sample = JSON.parse(fs.readFileSync(options.sample, "utf8"));
  validateTree(tree);
  validateSample(sample, tree);
  const byId = new Map(tree.nodes.map((node) => [node.nodeId, node]));
  const nodes = sample.nodes.map((item) => {
    const node = byId.get(item.nodeId);
    if (!node || node.stateHash !== item.stateHash) throw new Error(`Sample node mismatch: ${item.nodeId}`);
    return node;
  });
  return { tree, sample, nodes };
}

function run(options) {
  if (options.status) {
    const file = path.join(options.output, "progress.json");
    console.log(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : JSON.stringify({ status: "not-started" }, null, 2));
    return null;
  }
  const { tree, sample, nodes } = loadInputs(options);
  const experimentIdentity = identity(options, tree, sample);
  fs.mkdirSync(options.output, { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  const previous = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, "utf8")) : null;
  if (previous) assertIdentity(experimentIdentity, previous.identity, "Progress");
  const startedAt = previous?.startedAt || new Date().toISOString();
  writeProgress(options, nodes, experimentIdentity, startedAt, "running");
  const selected = conditions();
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
    for (const condition of selected) {
      if (done.has(condition.id)) continue;
      writeProgress(options, nodes, experimentIdentity, startedAt, "running",
        { nodeId: node.nodeId, conditionId: condition.id });
      partial.results.push(evaluateNode(node, tree.treeHash, condition));
      partial.updatedAt = new Date().toISOString();
      atomicWriteJson(partialFile, partial);
    }
    const block = { ...partial, status: "complete", completedAt: new Date().toISOString(),
      results: partial.results.slice().sort((a, b) => a.conditionId.localeCompare(b.conditionId)) };
    validateBlock(block, node, experimentIdentity);
    atomicWriteJson(completeFile, block);
    fs.unlinkSync(partialFile);
    console.log(`[joseki-mcts-sensitivity] ${counts(options.output, nodes).completedNodes}/${nodes.length} nodes`);
  }
  const finalCounts = counts(options.output, nodes);
  writeProgress(options, nodes, experimentIdentity, startedAt, "complete");
  console.log(JSON.stringify({ status: "complete", ...finalCounts }, null, 2));
  return finalCounts;
}

function main() { run(parseArgs(process.argv.slice(2))); }
if (require.main === module) main();

module.exports = {
  BASE_CONFIG, FIXED_THRESHOLDS, ITERATIONS, SEEDS, assertIdentity, conditionConfig,
  conditionId, conditions, counts, evaluateNode, identity, loadInputs, parseArgs, run,
  sensitivityProvenance, validateBlock,
};
