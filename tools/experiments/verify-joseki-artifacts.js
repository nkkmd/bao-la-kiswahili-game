#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, hashValue, josekiProvenance, stableStringify } = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");
const { validateBlock } = require("./evaluate-joseki-nodes.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    input: "artifacts/joseki-study/phase-1",
    output: "artifacts/joseki-study/verified/phase-1-verification.json",
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

function verify(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  validateTree(tree);
  const progressFile = path.join(options.input, "progress.json");
  if (!fs.existsSync(progressFile)) throw new Error(`Missing progress file: ${progressFile}`);
  const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
  if (progress.status !== "complete") throw new Error(`Evaluation is not complete: ${progress.status}`);
  if (progress.identity.treeHash !== tree.treeHash) throw new Error("Tree hash mismatch");
  if (progress.expected.nodes !== tree.nodes.length) throw new Error("Node count mismatch");
  const partialDir = path.join(options.input, "partials");
  if (fs.existsSync(partialDir) && fs.readdirSync(partialDir).some((file) => file.endsWith(".json"))) {
    throw new Error("Partial results remain; refusing to verify");
  }
  const source = josekiProvenance();
  if (stableStringify(source.sourceFileSha256) !== stableStringify(progress.identity.sourceFileSha256)) {
    throw new Error("Research source hashes changed after evaluation");
  }
  let results = 0;
  const conditionCounts = Object.fromEntries(progress.identity.conditionIds.map((id) => [id, 0]));
  for (const node of tree.nodes) {
    const file = path.join(options.input, "nodes", `${node.nodeId}.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing node result: ${node.nodeId}`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    validateBlock(block, node, progress.identity);
    results += block.results.length;
    for (const result of block.results) conditionCounts[result.conditionId] += 1;
  }
  const expectedResults = tree.nodes.length * progress.identity.conditionIds.length;
  if (results !== expectedResults || Object.values(conditionCounts).some((count) => count !== tree.nodes.length)) {
    throw new Error("Evaluation count mismatch");
  }
  const verification = {
    schemaVersion: 1,
    verifiedAt: new Date().toISOString(),
    passed: true,
    treeHash: tree.treeHash,
    nodes: tree.nodes.length,
    edges: tree.edges.length,
    results,
    conditionCounts,
    partialResults: 0,
    stateHashesMatch: true,
    sequenceHashesMatch: true,
    conditionHashesMatch: true,
    sourceHashesMatch: true,
    symmetryPassed: tree.symmetry.passed,
    verificationHash: hashValue({ treeHash: tree.treeHash, results, conditionCounts }),
  };
  return { tree, progress, verification };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const verification = verify(options).verification;
  atomicWriteJson(options.output, verification);
  console.log(JSON.stringify({ output: options.output, ...verification }, null, 2));
}

if (require.main === module) main();

module.exports = { parseArgs, verify };
