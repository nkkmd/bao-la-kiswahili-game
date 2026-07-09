"use strict";

const assert = require("node:assert/strict");
const { parseArgs, runComparison } = require("../tools/phase8-compare.js");

{
  const options = parseArgs([
    "--games", "2",
    "--seed", "123",
    "--repeats", "2",
    "--levels", "hard,expert",
    "--opening-plies", "2,4",
    "--opening-phases", "namua,mtaji",
    "--time-limit", "25",
    "--max-depth", "3",
    "--max-turns", "8",
    "--json",
  ]);
  assert.equal(options.games, 2);
  assert.equal(options.repeats, 2);
  assert.deepEqual(options.levels, ["hard", "expert"]);
  assert.deepEqual(options.openingPlies, [2, 4]);
  assert.deepEqual(options.openingPhases, ["namua", "mtaji"]);
  assert.equal(options.timeLimitMs, 25);
  assert.equal(options.maxDepth, 3);
  assert.equal(options.maxTurns, 8);
  assert.equal(options.json, true);
}

assert.throws(() => parseArgs(["--levels", "normal"]), /Invalid level/,
  "Phase 8 comparison only targets hard/expert search levels");

{
  const report = runComparison(parseArgs([
    "--games", "2",
    "--seed", "456",
    "--levels", "hard",
    "--opening-plies", "2",
    "--opening-phases", "namua",
    "--time-limit", "10",
    "--max-depth", "2",
    "--max-turns", "4",
  ]));
  assert.equal(report.scenarios.length, 1);
  assert.equal(report.summary.adaptive.wins + report.summary.adaptive.losses + report.summary.adaptive.draws, 2,
    "comparison summary aggregates adaptive game results");
  assert.equal(Number.isFinite(report.summary.deltas.averageMoveMs), true,
    "comparison summary includes timing deltas");
  assert.equal(report.scenarios[0].adaptive.averageAllocatedMs > 0, true,
    "comparison reports adaptive search budgets");
  assert.equal(report.scenarios[0].fixed.averageAllocatedMs, 10,
    "comparison reports fixed search budgets");
}

console.log("Bao Phase 8 comparison tests passed");
