"use strict";

const assert = require("node:assert/strict");
const { minimaxLine } = require("../tools/experiments/analyze-joseki-candidate-results.js");

const state = (player) => ({ player });
const tree = {
  rootNodeId: "root",
  nodes: [
    { nodeId: "root", ply: 0, state: state(0), moveKey: null },
    { nodeId: "a", ply: 1, state: state(1), moveKey: "a" },
    { nodeId: "b", ply: 1, state: state(1), moveKey: "b" },
    { nodeId: "a1", ply: 2, state: state(0), moveKey: "a1" },
    { nodeId: "a2", ply: 2, state: state(0), moveKey: "a2" },
    { nodeId: "b1", ply: 2, state: state(0), moveKey: "b1" },
  ],
  edges: [
    { parentId: "root", childId: "a" }, { parentId: "root", childId: "b" },
    { parentId: "a", childId: "a1" }, { parentId: "a", childId: "a2" },
    { parentId: "b", childId: "b1" },
  ],
};
const result = minimaxLine(tree, new Map([["a1", 4], ["a2", 2], ["b1", 1]]));
assert.equal(result.value, 2);
assert.deepEqual(result.line.map(({ moveKey }) => moveKey), ["a", "a2"]);

console.log("Joseki candidate analysis tests passed");
