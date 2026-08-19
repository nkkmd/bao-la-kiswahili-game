#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const Analysis = require("../tools/experiments/analyze-position-evaluation-calibration-stage1.js");

const logisticRows = [
  { z: -2, y: 0 },
  { z: -1, y: 1 },
  { z: 0, y: 0 },
  { z: 1, y: 1 },
  { z: 2, y: 1 },
  { z: 3, y: 0 },
];
const logisticMethod = {
  initialParametersPerPhase: [0, 0],
  maxIterations: 100,
  gradientTolerance: 1e-10,
  maximumStepHalvings: 20,
};
const fit = Analysis.fitLogisticRows(logisticRows, logisticMethod);
assert.equal(fit.eligible, true);
assert.equal(fit.converged, true);
assert.ok(Number.isFinite(fit.beta0));
assert.ok(Number.isFinite(fit.beta1));
assert.ok(fit.maxAbsGradient <= 1e-10);

const iso = Analysis.fitIsotonicPhase([
  { z: 0, y: 0, historicalTrajectoryHash: "a" },
  { z: 1, y: 1, historicalTrajectoryHash: "b" },
  { z: 2, y: 0, historicalTrajectoryHash: "c" },
  { z: 3, y: 1, historicalTrajectoryHash: "d" },
]);
assert.equal(iso.eligible, true);
assert.equal(iso.blocks.length, 3);
assert.equal(iso.blocks[1].minZ, 1);
assert.equal(iso.blocks[1].maxZ, 2);
assert.equal(iso.blocks[1].mean, 0.5);

for (const hash of ["a", "abc", "deadbeef", "trajectory-001"]) {
  const fold = Analysis.cvFold(hash, 5);
  assert.ok(Number.isInteger(fold));
  assert.ok(fold >= 0 && fold < 5);
  assert.equal(fold, Analysis.cvFold(hash, 5));
}

const metrics = Analysis.metricSummary([
  { y: 1, p: 0.75 },
  { y: 0, p: 0.25 },
]);
assert.equal(metrics.n, 2);
assert.equal(metrics.brier, 0.0625);
assert.ok(metrics.logLoss > 0);

console.log("Position evaluation calibration Stage 1 analysis mechanics tests passed");
