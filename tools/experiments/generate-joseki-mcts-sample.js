#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { atomicWriteJson, hashValue, stableStringify } = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

const DEFAULT_PER_STRATUM = 4;
const SELECTION_SALT = "joseki-mcts-sensitivity-v1";

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    output: "artifacts/joseki-study/corpus/mcts-sensitivity-sample.json",
    perStratum: DEFAULT_PER_STRATUM,
    ply: 8,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--output") options.output = value;
    else if (key === "--per-stratum") options.perStratum = Number(value);
    else if (key === "--ply") options.ply = Number(value);
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!Number.isInteger(options.perStratum) || options.perStratum < 1) {
    throw new Error("per-stratum must be a positive integer");
  }
  if (!Number.isInteger(options.ply) || options.ply < 1 || options.ply > 8) {
    throw new Error("ply must be an integer from 1 through 8");
  }
  return options;
}

function legalBucket(count) {
  if (count >= 2 && count <= 4) return "2-4";
  if (count >= 5 && count <= 7) return "5-7";
  if (count >= 8) return "8+";
  return null;
}

function stratumFor(node) {
  const player = node.state.player;
  const legalMoveCount = node.features.legalMoves[player];
  const bucket = legalBucket(legalMoveCount);
  if (!bucket) return null;
  const captureClass = node.features.forcedCapture[player] ? "forced-capture" : "mixed";
  return `${bucket}/${captureClass}`;
}

function samplePayload(sample) {
  return {
    schemaVersion: sample.schemaVersion,
    treeFile: sample.treeFile,
    treeHash: sample.treeHash,
    selectionPolicy: sample.selectionPolicy,
    counts: sample.counts,
    nodes: sample.nodes,
  };
}

function buildSample(tree, treeFile, perStratum = DEFAULT_PER_STRATUM, ply = 8) {
  validateTree(tree);
  const groups = new Map();
  for (const node of tree.nodes.filter((node) => node.ply === ply)) {
    const stratum = stratumFor(node);
    if (!stratum) continue;
    if (!groups.has(stratum)) groups.set(stratum, []);
    groups.get(stratum).push(node);
  }
  const strata = [...groups.keys()].sort();
  const selected = [];
  const availableByStratum = {};
  const selectedByStratum = {};
  for (const stratum of strata) {
    const candidates = groups.get(stratum).slice().sort((a, b) => {
      const left = hashValue([tree.treeHash, SELECTION_SALT, a.nodeId]);
      const right = hashValue([tree.treeHash, SELECTION_SALT, b.nodeId]);
      return left.localeCompare(right) || a.nodeId.localeCompare(b.nodeId);
    });
    if (candidates.length < perStratum) throw new Error(`Insufficient nodes in stratum ${stratum}`);
    availableByStratum[stratum] = candidates.length;
    selectedByStratum[stratum] = perStratum;
    selected.push(...candidates.slice(0, perStratum).map((node) => ({
      nodeId: node.nodeId,
      stateHash: node.stateHash,
      stratum,
      legalMoveCount: node.features.legalMoves[node.state.player],
      forcedCapture: node.features.forcedCapture[node.state.player],
    })));
  }
  selected.sort((a, b) => a.stratum.localeCompare(b.stratum) || a.nodeId.localeCompare(b.nodeId));
  const sample = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    treeFile,
    treeHash: tree.treeHash,
    selectionPolicy: { salt: SELECTION_SALT, perStratum, ply,
      legalMoveBuckets: ["2-4", "5-7", "8+"], captureClasses: ["forced-capture", "mixed"] },
    counts: { nodes: selected.length, strata: strata.length, availableByStratum, selectedByStratum },
    nodes: selected,
  };
  sample.sampleHash = hashValue(samplePayload(sample));
  return sample;
}

function validateSample(sample, tree) {
  validateTree(tree);
  if (sample.treeHash !== tree.treeHash) throw new Error("Sample tree hash mismatch");
  if (hashValue(samplePayload(sample)) !== sample.sampleHash) throw new Error("Sample hash mismatch");
  const expected = buildSample(tree, sample.treeFile, sample.selectionPolicy.perStratum,
    sample.selectionPolicy.ply);
  if (stableStringify(samplePayload(sample)) !== stableStringify(samplePayload(expected))) {
    throw new Error("Sample selection mismatch");
  }
  return true;
}

function run(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const sample = buildSample(tree, options.tree, options.perStratum, options.ply);
  atomicWriteJson(options.output, sample);
  console.log(JSON.stringify({ output: options.output, sampleHash: sample.sampleHash, counts: sample.counts }, null, 2));
  return sample;
}

function main() { run(parseArgs(process.argv.slice(2))); }
if (require.main === module) main();

module.exports = { buildSample, legalBucket, parseArgs, run, samplePayload, stratumFor, validateSample };
