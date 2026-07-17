#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, hashValue } = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");
const { validateBlock } = require("./run-joseki-mcts.js");

const ROOT = path.resolve(__dirname, "../..");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    input: "artifacts/joseki-study/robustness/mcts-8ply",
    output: "artifacts/joseki-study/verified/mcts-8ply-verification.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function currentFileHash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex");
}

function verify(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  validateTree(tree);
  const progressFile = path.join(options.input, "progress.json");
  if (!fs.existsSync(progressFile)) throw new Error(`Missing progress file: ${progressFile}`);
  const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
  if (progress.status !== "complete") throw new Error(`Evaluation is not complete: ${progress.status}`);
  if (progress.identity.treeHash !== tree.treeHash) throw new Error("Tree hash mismatch");
  const eligible = tree.nodes.filter(({ ply }) => ply >= progress.identity.minPly);
  const nodes = eligible.slice(0, progress.expected.nodes);
  if (progress.expected.nodes > eligible.length) throw new Error("Node count mismatch");
  const partialDir = path.join(options.input, "partials");
  if (fs.existsSync(partialDir) && fs.readdirSync(partialDir).some((file) => file.endsWith(".json"))) {
    throw new Error("Partial results remain; refusing to verify");
  }
  for (const [file, expected] of Object.entries(progress.identity.sourceFileSha256)) {
    if (currentFileHash(file) !== expected) throw new Error(`Research source hash changed: ${file}`);
  }
  let results = 0;
  let simulations = 0;
  let timeouts = 0;
  const conditionCounts = Object.fromEntries(progress.identity.conditionIds.map((id) => [id, 0]));
  for (const node of nodes) {
    const file = path.join(options.input, "nodes", `${node.nodeId}.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing node result: ${node.nodeId}`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    validateBlock(block, node, progress.identity);
    results += block.results.length;
    for (const result of block.results) {
      conditionCounts[result.conditionId] += 1;
      simulations += result.stats.simulations;
      if (result.stats.timedOut) timeouts += 1;
    }
  }
  const expectedResults = nodes.length * progress.identity.conditionIds.length;
  if (results !== expectedResults || Object.values(conditionCounts).some((count) => count !== nodes.length)) {
    throw new Error("Evaluation count mismatch");
  }
  return {
    tree,
    progress,
    verification: {
      schemaVersion: 1,
      verifiedAt: new Date().toISOString(),
      passed: true,
      treeHash: tree.treeHash,
      nodes: nodes.length,
      results,
      simulations,
      timeouts,
      conditionCounts,
      partialResults: 0,
      sourceHashesMatch: true,
      symmetryPassed: tree.symmetry.passed,
      verificationHash: hashValue({ treeHash: tree.treeHash, results, simulations, conditionCounts }),
    },
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const verification = verify(options).verification;
  atomicWriteJson(options.output, verification);
  console.log(JSON.stringify({ output: options.output, ...verification }, null, 2));
}
if (require.main === module) main();

module.exports = { parseArgs, verify };
