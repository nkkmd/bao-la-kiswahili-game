"use strict";

const assert = require("node:assert/strict");
const Gates = require("../tools/experiments/analyze-phase-transition-stage-b-classifier-gates.js");

assert.equal(Gates.BOUNDARY.generatesGames, false);
assert.equal(Gates.BOUNDARY.invokesFormalRunner, false);
assert.equal(Gates.BOUNDARY.changesPrimaryDecision, false);
assert.equal(Gates.BOUNDARY.resultChosenThresholdsUsed, false);
assert.equal(Gates.BOUNDARY.thresholdsArePreExistingClassifierDefaults, true);
assert.deepEqual(Gates.FIXED_CLASSIFIER, {
  eventWindow: 8,
  expansionDelta: 3,
  persistenceFraction: 0.5,
});

function row(overrides = {}) {
  return {
    gameId: "g",
    phaseAtCandidate: "namua",
    regimeId: "g:1-20",
    distanceToMtaji: "20",
    distanceToForcingRelease: "20",
    captureDelta: "4",
    postPersistenceFraction: "0.75",
    classification: "capture-branch-expansion",
    ...overrides,
  };
}

assert.equal(Gates.primaryContext(row()), true);
assert.equal(Gates.primaryContext(row({ phaseAtCandidate: "mtaji" })), false);
assert.equal(Gates.primaryContext(row({ regimeId: "" })), false);

assert.equal(Gates.gateDisposition(row({ distanceToMtaji: "8" })), "blocked-near-mtaji");
assert.equal(
  Gates.gateDisposition(row({ distanceToMtaji: "20", distanceToForcingRelease: "8" })),
  "blocked-near-forcing-release",
);
assert.equal(Gates.gateDisposition(row({ captureDelta: "2.99" })), "insufficient-capture-delta");
assert.equal(Gates.gateDisposition(row({ postPersistenceFraction: "0.49" })), "insufficient-persistence");
assert.equal(Gates.gateDisposition(row()), "expansion-compatible");

const rows = [
  row({ gameId: "g1", distanceToMtaji: "4", classification: "namua-to-mtaji-precursor" }),
  row({ gameId: "g2", distanceToForcingRelease: "3", classification: "forcing-release-precursor" }),
  row({ gameId: "g3", captureDelta: "1", classification: "temporary-spike" }),
  row({ gameId: "g4", postPersistenceFraction: "0.25", classification: "temporary-spike" }),
  row({ gameId: "g5" }),
  row({ gameId: "g6", phaseAtCandidate: "mtaji", classification: "capture-branch-expansion" }),
  row({ gameId: "g7", regimeId: "", classification: "forcing-release-precursor" }),
];

const summary = Gates.summarizeGates(rows);
assert.deepEqual(summary.context, { rows: 5, games: 5 });
assert.deepEqual(summary.blockedAtGate["blocked-near-mtaji"], { rows: 1, games: 1 });
assert.deepEqual(summary.blockedAtGate["blocked-near-forcing-release"], { rows: 1, games: 1 });
assert.deepEqual(summary.blockedAtGate["insufficient-capture-delta"], { rows: 1, games: 1 });
assert.deepEqual(summary.blockedAtGate["insufficient-persistence"], { rows: 1, games: 1 });
assert.deepEqual(summary.blockedAtGate["expansion-compatible"], { rows: 1, games: 1 });
assert.deepEqual(summary.sequentialSurvival.enteredContext, { rows: 5, games: 5 });
assert.deepEqual(summary.sequentialSurvival.survivedMtajiPrecursorGate, { rows: 4, games: 4 });
assert.deepEqual(summary.sequentialSurvival.survivedForcingReleaseGate, { rows: 3, games: 3 });
assert.deepEqual(summary.sequentialSurvival.survivedCaptureDeltaGate, { rows: 2, games: 2 });
assert.deepEqual(summary.sequentialSurvival.survivedPersistenceGate, { rows: 1, games: 1 });
assert.equal(summary.rates.expansionCompatibleRowsAmongContext, 0.2);
assert.equal(summary.integrityCheck.exactMatch, true);

assert.throws(
  () => Gates.summarizeGates([row({ classification: "temporary-spike" })]),
  /Classifier reconstruction mismatch/,
);
assert.throws(() => Gates.parseArgs([]), /--e018-p2-candidates is required/);

console.log("phase transition Stage B classifier gate tests passed");
