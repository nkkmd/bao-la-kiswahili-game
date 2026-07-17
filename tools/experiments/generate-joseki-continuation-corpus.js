#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { atomicWriteJson, hashValue, stableStringify } = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

const CONDITION_IDS = Object.freeze([
  "bao-d1", "bao-d2", "bao-d3", "bao-d4", "legacy-d2", "bao-v2-d2",
]);

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    summary: "artifacts/joseki-study/summaries/phase-4-summary.json",
    phase2: "artifacts/joseki-study/phase-4",
    output: "artifacts/joseki-study/corpus/continuation-principal-leaves.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--summary") options.summary = value;
    else if (key === "--phase2") options.phase2 = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function corpusPayload(corpus) {
  return {
    schemaVersion: corpus.schemaVersion,
    treeFile: corpus.treeFile,
    treeHash: corpus.treeHash,
    phase4VerificationHash: corpus.phase4VerificationHash,
    selectionPolicy: corpus.selectionPolicy,
    counts: corpus.counts,
    entries: corpus.entries,
  };
}

function buildCorpus(tree, summary, phase2Directory, treeFile) {
  validateTree(tree);
  if (summary.integrity.treeHash !== tree.treeHash || !summary.integrity.passed) {
    throw new Error("Phase 4 summary integrity mismatch");
  }
  const nodesById = new Map(tree.nodes.map((node) => [node.nodeId, node]));
  const sourcesByNode = new Map();
  for (const conditionId of CONDITION_IDS) {
    const condition = summary.conditions.find(({ conditionId: id }) => id === conditionId);
    if (!condition || condition.line.length !== 8) throw new Error(`Missing principal line: ${conditionId}`);
    const nodeId = condition.line.at(-1).nodeId;
    if (!sourcesByNode.has(nodeId)) sourcesByNode.set(nodeId, []);
    sourcesByNode.get(nodeId).push(conditionId);
  }
  const entries = [...sourcesByNode.entries()].sort(([left], [right]) => left.localeCompare(right))
    .map(([nodeId, sourceConditions], index) => {
      const node = nodesById.get(nodeId);
      if (!node || node.ply !== 8) throw new Error(`Missing 8-ply node: ${nodeId}`);
      const block = JSON.parse(fs.readFileSync(`${phase2Directory}/nodes/${nodeId}.json`, "utf8"));
      if (block.stateHash !== node.stateHash) throw new Error(`Phase 4 state mismatch: ${nodeId}`);
      const scores = Object.fromEntries(CONDITION_IDS.map((conditionId) => {
        const result = block.results.find(({ conditionId: id }) => id === conditionId);
        if (!result) throw new Error(`Missing Phase 4 condition: ${nodeId}/${conditionId}`);
        return [conditionId, result.southSearchScore];
      }));
      return {
        openingId: `principal-${String(index + 1).padStart(2, "0")}-${nodeId}`,
        nodeId,
        stateHash: node.stateHash,
        sequenceHash: node.sequenceHash,
        sourceConditions: sourceConditions.slice().sort(),
        moveKeys: node.moveKeys,
        state: node.state,
        features: node.features,
        phase2SouthScores: scores,
      };
    });
  const corpus = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    treeFile,
    treeHash: tree.treeHash,
    phase4VerificationHash: summary.integrity.verificationHash,
    selectionPolicy: { kind: "unique-final-nodes-of-six-phase4-principal-lines",
      conditionIds: CONDITION_IDS },
    counts: { entries: entries.length, sourceConditions: CONDITION_IDS.length },
    entries,
  };
  corpus.corpusHash = hashValue(corpusPayload(corpus));
  return corpus;
}

function validateCorpus(corpus, tree, summary, phase2Directory) {
  const expected = buildCorpus(tree, summary, phase2Directory, corpus.treeFile);
  if (corpus.corpusHash !== hashValue(corpusPayload(corpus))) throw new Error("Continuation corpus hash mismatch");
  if (stableStringify(corpusPayload(corpus)) !== stableStringify(corpusPayload(expected))) {
    throw new Error("Continuation corpus selection mismatch");
  }
  return true;
}

function run(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const summary = JSON.parse(fs.readFileSync(options.summary, "utf8"));
  const corpus = buildCorpus(tree, summary, options.phase2, options.tree);
  atomicWriteJson(options.output, corpus);
  console.log(JSON.stringify({ output: options.output, corpusHash: corpus.corpusHash,
    counts: corpus.counts, entries: corpus.entries.map(({ openingId, sourceConditions }) => ({ openingId, sourceConditions })) }, null, 2));
  return corpus;
}

function main() { run(parseArgs(process.argv.slice(2))); }
if (require.main === module) main();

module.exports = { CONDITION_IDS, buildCorpus, corpusPayload, parseArgs, run, validateCorpus };
