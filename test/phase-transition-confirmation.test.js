"use strict";

const assert = require("node:assert/strict");
const { evaluate, terminalDistance } = require("../tools/experiments/evaluate-phase-transition-confirmation.js");

const config = {
  analysisVersion: "test",
  experimentId: "E-010",
  status: "preregistered",
  primaryPopulation: { minimumPliesRemaining: 9 },
  successCriteria: {
    minimumPrimaryCandidateCount: 2,
    minimumExpansionCandidateCount: 1,
    minimumControlPointCount: 3,
    minimumRiskRatio: 3,
    requireCandidateRateGreaterThanControlRate: true,
  },
};

assert.equal(terminalDistance({ distanceToTerminal: "12" }), 12);
assert.equal(terminalDistance({ pliesRemaining: "7" }), 7);

const confirmed = evaluate(config, [
  { group: "candidate", classification: "capture-branch-expansion", distanceToTerminal: "12" },
  { group: "candidate", classification: "temporary-spike", distanceToTerminal: "15" },
  { group: "candidate", classification: "capture-branch-expansion", distanceToTerminal: "4" },
  { group: "control", classification: "temporary-spike", distanceToTerminal: "12" },
  { group: "control", classification: "temporary-spike", distanceToTerminal: "13" },
  { group: "control", classification: "temporary-spike", distanceToTerminal: "14" },
]);
assert.equal(confirmed.counts.primaryCandidates, 2);
assert.equal(confirmed.counts.candidateExpansion, 1);
assert.equal(confirmed.counts.primaryControls, 3);
assert.equal(confirmed.decision, "confirmed");

const failed = evaluate(config, [
  { group: "candidate", classification: "temporary-spike", distanceToTerminal: "12" },
  { group: "candidate", classification: "temporary-spike", distanceToTerminal: "15" },
  { group: "control", classification: "capture-branch-expansion", distanceToTerminal: "12" },
  { group: "control", classification: "temporary-spike", distanceToTerminal: "13" },
  { group: "control", classification: "temporary-spike", distanceToTerminal: "14" },
]);
assert.equal(failed.decision, "not-confirmed");
assert.equal(failed.checks.minimumExpansionCandidateCount, false);

console.log("phase transition confirmation evaluator tests passed");
