"use strict";

const assert = require("node:assert/strict");
const Subgroups = require("../tools/experiments/analyze-phase-transition-stage-b-subgroups.js");

assert.equal(Subgroups.BOUNDARY.generatesGames, false);
assert.equal(Subgroups.BOUNDARY.invokesFormalRunner, false);
assert.equal(Subgroups.BOUNDARY.changesPrimaryDecision, false);
assert.equal(Subgroups.BOUNDARY.continuousOutcomeChosenCutpointsUsed, false);

const rows = [
  {
    gameId: "g1",
    distanceToTerminal: "20",
    classification: "capture-branch-expansion",
    regimeId: "g1:2-10",
    phaseAtCandidate: "namua",
    forcedCaptureAtCandidate: "true",
  },
  {
    gameId: "g2",
    distanceToTerminal: "15",
    classification: "temporary-spike",
    regimeId: "",
    phaseAtCandidate: "namua",
    forcedCaptureAtCandidate: "false",
  },
  {
    gameId: "g3",
    distanceToTerminal: "12",
    classification: "capture-branch-expansion",
    regimeId: "g3:4-20",
    phaseAtCandidate: "mtaji",
    forcedCaptureAtCandidate: "true",
  },
  {
    gameId: "g4",
    distanceToTerminal: "8",
    classification: "capture-branch-expansion",
    regimeId: "g4:1-3",
    phaseAtCandidate: "namua",
    forcedCaptureAtCandidate: "true",
  },
];

const definition = {
  key: "SYNTH-P2",
  experimentId: "SYNTH",
  depth: 3,
  evaluator: "bao",
  searchProfile: "phase2",
  gameCount: 10,
  expectedPrimaryExpansionGames: 2,
};

const summary = Subgroups.summarizeCondition(definition, rows);
assert.equal(summary.eligibleCandidateRows, 3);
assert.deepEqual(summary.subgroupDimensions.regimeMembership["inside-regime"], {
  candidateRows: 2,
  candidateGames: 2,
  expansionRows: 2,
  expansionGames: 2,
  rowExpansionRate: 1,
  gameExpansionRateAmongSubgroupCandidateGames: 1,
});
assert.deepEqual(summary.subgroupDimensions.regimeMembership["outside-regime"], {
  candidateRows: 1,
  candidateGames: 1,
  expansionRows: 0,
  expansionGames: 0,
  rowExpansionRate: 0,
  gameExpansionRateAmongSubgroupCandidateGames: 0,
});
assert.equal(summary.subgroupDimensions.phaseAtCandidate.namua.candidateRows, 2);
assert.equal(summary.subgroupDimensions.phaseAtCandidate.namua.expansionRows, 1);
assert.equal(summary.subgroupDimensions.phaseAtCandidate.mtaji.rowExpansionRate, 1);
assert.equal(
  summary.subgroupDimensions.phaseByRegimeMembership["namua|outside-regime"].rowExpansionRate,
  0,
);

const lgDefinition = {
  ...definition,
  key: "SYNTH-LG",
  searchProfile: "legacy",
  expectedPrimaryExpansionGames: 1,
};
const lgRows = [
  {
    gameId: "l1",
    distanceToTerminal: "20",
    classification: "capture-branch-expansion",
    regimeId: "l1:2-20",
    phaseAtCandidate: "namua",
    forcedCaptureAtCandidate: "true",
  },
  {
    gameId: "l2",
    distanceToTerminal: "18",
    classification: "temporary-spike",
    regimeId: "l2:4-12",
    phaseAtCandidate: "mtaji",
    forcedCaptureAtCandidate: "true",
  },
];
const lg = Subgroups.summarizeCondition(lgDefinition, lgRows);
const comparison = Subgroups.compareProfiles(summary, lg);
assert.equal(
  comparison.regimeMembership["inside-regime"].rowExpansionRateDifferenceP2MinusLG,
  0.5,
);
assert.equal(
  comparison.phaseAtCandidate.namua.rowExpansionRiskRatioP2OverLG,
  0.5,
);
assert.equal(
  comparison.phaseAtCandidate.mtaji.gameExpansionRateDifferenceP2MinusLG,
  1,
);
assert.equal(Subgroups.regimeMembership({ regimeId: "x" }), "inside-regime");
assert.equal(Subgroups.regimeMembership({ regimeId: "" }), "outside-regime");
assert.throws(() => Subgroups.parseArgs([]), /--e018-p2-candidates is required/);

console.log("phase transition Stage B subgroup tests passed");
