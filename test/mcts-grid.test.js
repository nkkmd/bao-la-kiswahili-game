"use strict";

const assert = require("node:assert/strict");
const { parseArgs, runGrid } = require("../tools/mcts-grid.js");

{
  const options = parseArgs([
    "--games", "2",
    "--seed", "123",
    "--repeats", "2",
    "--seed-step", "7",
    "--opening-plies", "2",
    "--max-turns", "20",
    "--time-limit", "0",
    "--max-depth", "1",
    "--mcts-iterations", "2",
    "--mcts-playout-turns", "2",
    "--policies", "random,balanced",
    "--roots", "visits",
    "--rewards", "terminal",
    "--priors", "none,static",
    "--mcts-prior-weight", "2",
    "--candidate-limits", "0,2",
    "--candidate-sources", "static,phase2",
    "--mcts-candidate-depth", "2",
  ]);
  assert.equal(options.repeats, 2);
  assert.equal(options.seedStep, 7);
  assert.deepEqual(options.policies, ["random", "balanced"]);
  assert.deepEqual(options.roots, ["visits"]);
  assert.deepEqual(options.rewards, ["terminal"]);
  assert.deepEqual(options.priors, ["none", "static"]);
  assert.equal(options.mctsPriorWeight, 2);
  assert.deepEqual(options.candidateLimits, [0, 2]);
  assert.deepEqual(options.candidateSources, ["static", "phase2"]);
  assert.equal(options.mctsCandidateDepth, 2);
  const report = runGrid(options);
  assert.equal(report.results.length, 16, "grid runs every requested MCTS combination");
  assert.ok(report.results.every((item) => item.games === 4),
    "each grid item aggregates every repeat");
  assert.ok(report.results.every((item) => item.reports.length === 2),
    "each grid item keeps its source benchmark reports");
  assert.ok(report.results[0].score >= report.results[1].score,
    "grid results are sorted by score");
}

assert.throws(() => parseArgs(["--games", "3"]), /Game count must be even/,
  "grid runs require paired games");
assert.throws(() => parseArgs(["--policies", "unknown"]), /Invalid --policies/,
  "unknown grid policies are rejected");
assert.throws(() => parseArgs(["--roots", "unknown"]), /Invalid --roots/,
  "unknown grid roots are rejected");
assert.throws(() => parseArgs(["--rewards", "unknown"]), /Invalid --rewards/,
  "unknown grid rewards are rejected");
assert.throws(() => parseArgs(["--priors", "unknown"]), /Invalid --priors/,
  "unknown grid priors are rejected");
assert.throws(() => parseArgs(["--candidate-sources", "unknown"]), /Invalid --candidate-sources/,
  "unknown grid candidate sources are rejected");

console.log("Bao MCTS grid tests passed");
