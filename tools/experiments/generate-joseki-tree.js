#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  E,
  atomicWriteJson,
  hashValue,
  josekiProvenance,
  makeNode,
  moveKey,
  symmetryAudit,
} = require("./lib/joseki-common.js");

function parseArgs(argv) {
  const options = { maxPly: 2, output: "artifacts/joseki-study/corpus/tree.json" };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--max-ply") options.maxPly = Number(value);
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!Number.isInteger(options.maxPly) || options.maxPly < 1 || options.maxPly > 8) {
    throw new Error("max-ply must be an integer from 1 through 8");
  }
  return options;
}

function buildTree(maxPly = 2) {
  const root = makeNode(E.initialState(), []);
  const nodes = [root];
  const edges = [];
  let frontier = [{ node: root, moves: [] }];
  for (let ply = 1; ply <= maxPly; ply += 1) {
    const next = [];
    for (const entry of frontier) {
      if (entry.node.terminal) continue;
      const variants = E.moveVariants(entry.node.state)
        .slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
      for (const move of variants) {
        const state = E.applyMove(entry.node.state, move).state;
        const moves = [...entry.moves, move];
        const child = makeNode(state, moves, entry.node.nodeId);
        nodes.push(child);
        edges.push({ parentId: entry.node.nodeId, childId: child.nodeId, move, moveKey: moveKey(move) });
        next.push({ node: child, moves });
      }
    }
    frontier = next;
  }
  const stateCounts = nodes.reduce((counts, node) => {
    counts[node.stateHash] = (counts[node.stateHash] || 0) + 1;
    return counts;
  }, {});
  const canonicalCounts = nodes.reduce((counts, node) => {
    counts[node.canonicalStateHash] = (counts[node.canonicalStateHash] || 0) + 1;
    return counts;
  }, {});
  const tree = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    maxPly,
    rootNodeId: root.nodeId,
    initialStateHash: root.stateHash,
    nodes,
    edges,
    counts: {
      nodes: nodes.length,
      edges: edges.length,
      byPly: Object.fromEntries(Array.from({ length: maxPly + 1 }, (_, ply) => [ply,
        nodes.filter((node) => node.ply === ply).length])),
      uniqueStates: Object.keys(stateCounts).length,
      transpositionNodes: Object.values(stateCounts).reduce((sum, count) => sum + Math.max(0, count - 1), 0),
      uniqueCanonicalStates: Object.keys(canonicalCounts).length,
    },
    provenance: josekiProvenance(),
  };
  tree.treeHash = hashValue({ maxPly, initialStateHash: tree.initialStateHash, nodes, edges });
  tree.symmetry = symmetryAudit(tree);
  return tree;
}

function validateTree(tree) {
  if (!tree.nodes.length || tree.nodes[0].nodeId !== tree.rootNodeId) throw new Error("Invalid tree root");
  const ids = new Set();
  for (const node of tree.nodes) {
    if (ids.has(node.nodeId)) throw new Error(`Duplicate nodeId: ${node.nodeId}`);
    ids.add(node.nodeId);
    if (hashValue(node.state) !== node.stateHash) throw new Error(`State hash mismatch: ${node.nodeId}`);
    if (hashValue(node.moveKeys) !== node.sequenceHash) throw new Error(`Sequence hash mismatch: ${node.nodeId}`);
  }
  for (const edge of tree.edges) {
    if (!ids.has(edge.parentId) || !ids.has(edge.childId)) throw new Error("Dangling tree edge");
  }
  const expectedTreeHash = hashValue({ maxPly: tree.maxPly, initialStateHash: tree.initialStateHash,
    nodes: tree.nodes, edges: tree.edges });
  if (tree.treeHash !== expectedTreeHash) throw new Error("Tree hash mismatch");
  if (!tree.symmetry.passed) throw new Error(`Symmetry audit failed: ${tree.symmetry.failures.length}`);
  return true;
}

function writeTree(options, tree) {
  validateTree(tree);
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  atomicWriteJson(options.output, tree);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const tree = buildTree(options.maxPly);
  writeTree(options, tree);
  console.log(JSON.stringify({ output: options.output, treeHash: tree.treeHash, counts: tree.counts,
    symmetry: tree.symmetry }, null, 2));
}

if (require.main === module) main();

module.exports = { buildTree, parseArgs, validateTree, writeTree };
