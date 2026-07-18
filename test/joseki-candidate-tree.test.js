"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const {
  DEFAULT_FIRST_MOVE,
  buildCandidateTree,
  parseArgs,
  selectMoves,
} = require("../tools/experiments/generate-joseki-candidate-tree.js");

const options = parseArgs(["--max-ply", "4", "--top", "3"]);
const first = buildCandidateTree(options);
const second = buildCandidateTree(options);
assert.equal(first.treeHash, second.treeHash);
assert.equal(first.counts.byPly[0], 1);
assert.equal(first.counts.byPly[1], 1);
assert.equal(first.counts.byPly[2], 4);
assert.equal(first.nodes.find(({ ply }) => ply === 1).moveKey, DEFAULT_FIRST_MOVE);
assert.equal(first.symmetry.passed, true);
assert.ok(first.selectionPolicy.selections.every(({ selectedMoves, legalMoves }) => selectedMoves <= legalMoves));

const initialChoice = selectMoves(E.initialState(), 3);
assert.ok(initialChoice.selected.length >= 3);
assert.ok(initialChoice.selected.length <= E.moveVariants(E.initialState()).length);
assert.equal(initialChoice.metadata.baseline, "bao-d2");
assert.throws(() => parseArgs(["--max-ply", "9"]), /2 through 8/);

console.log("Joseki candidate tree tests passed");
