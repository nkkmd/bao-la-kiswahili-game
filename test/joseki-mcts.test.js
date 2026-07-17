"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildTree, writeTree } = require("../tools/experiments/generate-joseki-tree.js");
const { parseArgs: parsePhase2Args, run: runPhase2 } = require("../tools/experiments/evaluate-joseki-nodes.js");
const {
  FIXED_CONFIG,
  FIXED_THRESHOLDS,
  evaluateNode,
  identity,
  parseArgs: parseMctsArgs,
  run: runMcts,
  validateBlock,
} = require("../tools/experiments/run-joseki-mcts.js");
const { verify } = require("../tools/experiments/verify-joseki-mcts.js");
const { analyze } = require("../tools/experiments/analyze-joseki-mcts.js");
const { E, makeNode } = require("../tools/experiments/lib/joseki-common.js");

assert.equal(FIXED_CONFIG.mctsIterations, 12);
assert.equal(FIXED_CONFIG.mctsPlayoutTurns, 16);
assert.equal(FIXED_THRESHOLDS.choiceNodePhase2AgreementMinimum, 0.60);
assert.equal(FIXED_THRESHOLDS.choiceNodeUnanimousSeedConsensusMinimum, 0.70);
assert.throws(() => parseMctsArgs(["--seeds", "1,1"]), /seeds must be unique/);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-joseki-mcts-"));
const treeFile = path.join(temp, "tree.json");
const phase2Output = path.join(temp, "phase2");
const mctsOutput = path.join(temp, "mcts");
const summaryFile = path.join(temp, "summary.json");
const markdownFile = path.join(temp, "MCTS.md");
const tree = buildTree(2);
writeTree({ output: treeFile }, tree);

const terminalNode = makeNode({ ...E.initialState(), winner: 0 }, []);
const singleSeedOptions = parseMctsArgs(["--tree", treeFile, "--seeds", "1"]);
const terminalIdentity = identity(singleSeedOptions, tree);
const terminalResult = evaluateNode(terminalNode, tree.treeHash, 1);
assert.equal(terminalResult.legalMoveCount, 0);
assert.equal(terminalResult.stats.simulations, 0);
assert.equal(terminalResult.recommendedMoveKey, null);
assert.doesNotThrow(() => validateBlock({
  nodeId: terminalNode.nodeId,
  stateHash: terminalNode.stateHash,
  identity: terminalIdentity,
  results: [terminalResult],
}, terminalNode, terminalIdentity));

runPhase2(parsePhase2Args([
  "--tree", treeFile,
  "--output", phase2Output,
  "--conditions", "bao-d2",
  "--min-ply", "2",
  "--max-nodes", "4",
]));
const mctsOptions = parseMctsArgs([
  "--tree", treeFile,
  "--output", mctsOutput,
  "--min-ply", "2",
  "--max-nodes", "4",
]);
runMcts(mctsOptions);
runMcts(mctsOptions);

const verified = verify({ tree: treeFile, input: mctsOutput });
assert.equal(verified.verification.nodes, 4);
assert.equal(verified.verification.results, 12);
assert.equal(verified.verification.simulations, 4 * 3 * 12);
assert.equal(verified.verification.timeouts, 0);

const firstNodeFile = path.join(mctsOutput, "nodes", `${verified.tree.nodes.filter(({ ply }) => ply === 2)[0].nodeId}.json`);
const firstResult = JSON.parse(fs.readFileSync(firstNodeFile, "utf8")).results[0];
assert.ok(Array.isArray(firstResult.stats.mctsRoot));
assert.ok(firstResult.stats.mctsRoot.length > 0);
assert.equal(firstResult.stats.mctsRoot.reduce((sum, item) => sum + item.visits, 0), 12);

const summary = analyze({
  tree: treeFile,
  input: mctsOutput,
  phase2: phase2Output,
  output: summaryFile,
  markdown: markdownFile,
});
assert.equal(summary.integrity.passed, true);
assert.equal(summary.nodes.total, 4);
assert.ok(["passed-screening", "unstable"].includes(summary.status));
assert.match(fs.readFileSync(markdownFile, "utf8"), /MCTS頑健性試験/);

console.log("Joseki MCTS tests passed");
