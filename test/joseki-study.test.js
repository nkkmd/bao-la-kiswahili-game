"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildTree, validateTree, writeTree } = require("../tools/experiments/generate-joseki-tree.js");
const { parseArgs: parseEvaluationArgs, run } = require("../tools/experiments/evaluate-joseki-nodes.js");
const { verify } = require("../tools/experiments/verify-joseki-artifacts.js");
const { analyze } = require("../tools/experiments/analyze-joseki-results.js");

const first = buildTree(2);
const second = buildTree(2);
assert.equal(first.treeHash, second.treeHash);
assert.equal(first.counts.byPly[0], 1);
assert.equal(first.counts.byPly[1], 4);
assert.equal(first.counts.byPly[2], 14);
assert.equal(first.nodes.length, 19);
assert.equal(first.edges.length, 18);
assert.equal(first.symmetry.passed, true);
assert.equal(validateTree(first), true);

const damaged = structuredClone(first);
damaged.nodes[1].state.reserve[0] -= 1;
assert.throws(() => validateTree(damaged), /State hash mismatch/);
const damagedTreeHash = structuredClone(first);
damagedTreeHash.treeHash = "0".repeat(64);
assert.throws(() => validateTree(damagedTreeHash), /Tree hash mismatch/);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-joseki-"));
const treeFile = path.join(temp, "corpus", "tree.json");
const output = path.join(temp, "phase-1");
writeTree({ output: treeFile }, first);
const options = parseEvaluationArgs([
  "--tree", treeFile,
  "--output", output,
  "--conditions", "bao-d1",
]);
run(options);
run(options);
const verified = verify({ tree: treeFile, input: output });
assert.equal(verified.verification.passed, true);
assert.equal(verified.verification.nodes, 19);
assert.equal(verified.verification.results, 19);

const partialDir = path.join(output, "partials");
fs.mkdirSync(partialDir, { recursive: true });
const stray = path.join(partialDir, "stray.json");
fs.writeFileSync(stray, "{}\n");
assert.throws(() => verify({ tree: treeFile, input: output }), /Partial results remain/);
fs.unlinkSync(stray);

const summaryFile = path.join(temp, "summary.json");
const markdownFile = path.join(temp, "OPENING_INDEX.md");
const summary = analyze({ tree: treeFile, input: output, output: summaryFile, markdown: markdownFile });
assert.equal(summary.candidates.length, 4);
assert.equal(summary.integrity.passed, true);
assert.ok(summary.candidates.every(({ bestReplyForNorth }) => bestReplyForNorth));
assert.match(fs.readFileSync(markdownFile, "utf8"), /初手・応手スクリーニング/);

const leafOutput = path.join(temp, "leaf-results");
run(parseEvaluationArgs([
  "--tree", treeFile, "--output", leafOutput, "--conditions", "bao-d1", "--min-ply", "2",
]));
const leafVerified = verify({ tree: treeFile, input: leafOutput });
assert.equal(leafVerified.verification.nodes, 14);
assert.equal(leafVerified.verification.results, 14);

console.log("Joseki study tests passed");
