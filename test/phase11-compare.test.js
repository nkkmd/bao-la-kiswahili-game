"use strict";

const assert = require("node:assert/strict");
const { parseArgs, runComparison } = require("../tools/phase11-compare.js");

const options = parseArgs([
  "--seed", "20261000",
  "--positions-per-phase", "2",
  "--opening-plies", "4",
  "--opening-phases", "namua,mtaji",
  "--max-depth", "2",
  "--candidate", "tt-first",
  "--aspiration-window", "75",
]);

assert.deepEqual(options.openingPhases, ["namua", "mtaji"]);
assert.equal(options.positionsPerPhase, 2);
assert.equal(options.maxDepth, 2);
assert.equal(options.aspirationWindow, 75);

const report = runComparison(options);
assert.equal(report.summary.positions, 4, "comparison covers every requested position");
assert.equal(report.summary.moveMatches, 4, "TT-first preserves shallow fixed-depth choices");
assert.ok(report.summary.baselineNodes > 0, "comparison records baseline nodes");
assert.ok(report.summary.candidateNodes > 0, "comparison records candidate nodes");
assert.equal(report.summary.nodeImprovements + report.summary.nodeRegressions
  + report.results.filter((item) => item.candidate.nodes === item.baseline.nodes).length, 4,
  "node outcomes account for every position");
assert.equal(report.results.length, 4, "comparison keeps per-position diagnostics");

assert.throws(() => parseArgs(["--candidate", "unknown"]), /Invalid candidate/);
assert.throws(() => parseArgs(["--opening-phases", "any"]), /Invalid opening phase/);

const qCapture = runComparison({ ...options, candidate: "q-capture" });
assert.equal(qCapture.summary.moveMatches, 4,
  "quiescence capture ordering preserves shallow fixed-depth choices");

const history = runComparison({ ...options, candidate: "history" });
assert.equal(history.summary.moveMatches, 4,
  "history ordering preserves shallow fixed-depth choices");
assert.ok(history.results.some((item) => item.candidate.historyUpdates > 0),
  "history comparison records quiet cutoff updates");

const aspiration = runComparison({ ...options, candidate: "aspiration" });
assert.equal(aspiration.summary.moveMatches, 4,
  "aspiration windows preserve shallow fixed-depth choices");

console.log("Bao Phase 11 comparison tests passed");
