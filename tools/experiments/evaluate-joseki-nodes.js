#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  CONDITIONS,
  atomicWriteJson,
  conditionConfig,
  evaluateNode,
  hashValue,
  josekiProvenance,
  stableStringify,
} = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    output: "artifacts/joseki-study/phase-1",
    conditions: CONDITIONS.map(({ id }) => id),
    minPly: 0,
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
      else if (key === "--conditions") options.conditions = value.split(",").filter(Boolean);
      else if (key === "--min-ply") options.minPly = Number(value);
      else if (key === "--max-nodes") options.maxNodes = Number(value);
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  if (!options.conditions.length || new Set(options.conditions).size !== options.conditions.length
    || options.conditions.some((id) => !CONDITIONS.some((condition) => condition.id === id))) {
    throw new Error("conditions must be unique known condition IDs");
  }
  if (options.maxNodes !== null && (!Number.isInteger(options.maxNodes) || options.maxNodes < 1)) {
    throw new Error("max-nodes must be a positive integer");
  }
  if (!Number.isInteger(options.minPly) || options.minPly < 0 || options.minPly > 8) {
    throw new Error("min-ply must be an integer from 0 through 8");
  }
  return options;
}

function resultPath(output, nodeId) {
  return path.join(output, "nodes", `${nodeId}.json`);
}

function partialPath(output, nodeId) {
  return path.join(output, "partials", `${nodeId}.partial.json`);
}

function identity(options, tree) {
  const source = josekiProvenance();
  const conditions = options.conditions.map((id) => CONDITIONS.find((condition) => condition.id === id));
  return {
    schemaVersion: 1,
    treeFile: options.tree,
    treeHash: tree.treeHash,
    conditionIds: options.conditions,
    minPly: options.minPly,
    conditionHashes: Object.fromEntries(conditions.map((condition) => [condition.id,
      hashValue(conditionConfig(condition))])),
    sourceCommit: source.sourceCommit,
    node: source.node,
    sourceFileSha256: source.sourceFileSha256,
  };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

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
  const progressCounts = counts(options.output, nodes);
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1,
    status,
    startedAt,
    updatedAt: new Date().toISOString(),
    identity: experimentIdentity,
    expected: { nodes: nodes.length, conditions: options.conditions.length,
      evaluations: nodes.length * options.conditions.length },
    ...progressCounts,
    current,
  });
}

function validateBlock(block, node, experimentIdentity) {
  assertIdentity(experimentIdentity, block.identity, `Node ${node.nodeId}`);
  if (block.nodeId !== node.nodeId || block.stateHash !== node.stateHash) throw new Error(`Node mismatch: ${node.nodeId}`);
  const ids = block.results.map(({ conditionId }) => conditionId);
  if (ids.length !== experimentIdentity.conditionIds.length || new Set(ids).size !== ids.length
    || experimentIdentity.conditionIds.some((id) => !ids.includes(id))) throw new Error(`Incomplete node: ${node.nodeId}`);
  for (const result of block.results) {
    if (result.stateHash !== node.stateHash
      || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]) {
      throw new Error(`Evaluation integrity mismatch: ${node.nodeId}/${result.conditionId}`);
    }
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
  const eligibleNodes = tree.nodes.filter(({ ply }) => ply >= options.minPly);
  const nodes = options.maxNodes === null ? eligibleNodes : eligibleNodes.slice(0, options.maxNodes);
  const experimentIdentity = identity(options, tree);
  fs.mkdirSync(options.output, { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  const previous = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, "utf8")) : null;
  if (previous) assertIdentity(experimentIdentity, previous.identity, "Progress");
  const startedAt = previous?.startedAt || new Date().toISOString();
  writeProgress(options, nodes, experimentIdentity, startedAt, "running");
  const selected = options.conditions.map((id) => CONDITIONS.find((condition) => condition.id === id));
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
    const done = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const condition of selected) {
      if (done.has(condition.id)) continue;
      writeProgress(options, nodes, experimentIdentity, startedAt, "running",
        { nodeId: node.nodeId, conditionId: condition.id });
      partial.results.push(evaluateNode(node, condition, tree.treeHash));
      partial.updatedAt = new Date().toISOString();
      atomicWriteJson(partialFile, partial);
      const progressCounts = counts(options.output, nodes);
      console.log(`[joseki] ${progressCounts.recordedEvaluations}/${nodes.length * selected.length} ${node.nodeId}/${condition.id}`);
    }
    const block = { ...partial, status: "complete", completedAt: new Date().toISOString(),
      results: partial.results.slice().sort((a, b) => a.conditionId.localeCompare(b.conditionId)) };
    validateBlock(block, node, experimentIdentity);
    atomicWriteJson(completeFile, block);
    fs.unlinkSync(partialFile);
  }
  const finalCounts = counts(options.output, nodes);
  writeProgress(options, nodes, experimentIdentity, startedAt, "complete");
  console.log(JSON.stringify({ status: "complete", ...finalCounts }, null, 2));
  return finalCounts;
}

function main() { run(parseArgs(process.argv.slice(2))); }

if (require.main === module) main();

module.exports = { assertIdentity, counts, identity, parseArgs, partialPath, resultPath, run, validateBlock };
