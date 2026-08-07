"use strict";

const assert = require("node:assert/strict");
const StageB = require("../tools/experiments/analyze-phase-transition-stage-b-mechanism.js");

assert.equal(StageB.ANALYSIS_BOUNDARY.generatesGames, false);
assert.equal(StageB.ANALYSIS_BOUNDARY.invokesFormalRunner, false);
assert.equal(StageB.ANALYSIS_BOUNDARY.changesPrimaryDecision, false);
assert.deepEqual(StageB.ANALYSIS_BOUNDARY.formalDecisions, {
  E018: "confirmed",
  E019: "not-confirmed",
  E020: "confirmed",
});
assert.equal(StageB.MINIMUM_PLIES_REMAINING, 9);

const definition = {
  key: "SYNTH-P2",
  experimentId: "SYNTH",
  depth: 2,
  evaluator: "bao",
  searchProfile: "phase2",
  gameCount: 10,
  expectedPrimaryExpansionGames: 1,
};
const rows = [
  {
    gameId: "g1",
    distanceToTerminal: "20",
    classification: "capture-branch-expansion",
    regimeId: "g1:4-6",
    regimeLength: "3",
    positionInRegime: "1",
    normalizedPositionInRegime: "0.5",
    candidateCaptureMoveCount: "5",
    preCaptureMean: "1",
    postCaptureMean: "4",
    postCaptureMax: "6",
    captureDelta: "4",
    postPersistenceFraction: "0.75",
    recoveryDistance: "4",
    distanceToForcingRelease: "2",
    phaseAtCandidate: "mtaji",
    forcedCaptureAtCandidate: "true",
  },
  {
    gameId: "g2",
    distanceToTerminal: "12",
    classification: "temporary-spike",
    regimeId: "g2:8-8",
    regimeLength: "1",
    positionInRegime: "0",
    normalizedPositionInRegime: "0",
    candidateCaptureMoveCount: "2",
    preCaptureMean: "1",
    postCaptureMean: "2",
    postCaptureMax: "3",
    captureDelta: "1",
    postPersistenceFraction: "0.25",
    recoveryDistance: "1",
    distanceToForcingRelease: "1",
    phaseAtCandidate: "mtaji",
    forcedCaptureAtCandidate: "true",
  },
  {
    gameId: "g3",
    distanceToTerminal: "8",
    classification: "capture-branch-expansion",
    regimeId: "g3:1-2",
    regimeLength: "2",
    positionInRegime: "0",
    normalizedPositionInRegime: "0",
    candidateCaptureMoveCount: "9",
    captureDelta: "7",
    postPersistenceFraction: "1",
  },
];

const summary = StageB.summarizeCondition(definition, rows);
assert.equal(summary.counts.rawCandidateRows, 3);
assert.equal(summary.counts.eligibleCandidateRows, 2);
assert.equal(summary.counts.eligibleCandidateGames, 2);
assert.equal(summary.counts.primaryExpansionCandidateRows, 1);
assert.equal(summary.counts.primaryExpansionGames, 1);
assert.equal(summary.rates.candidateGameRate, 0.2);
assert.equal(summary.rates.primaryExpansionGameRate, 0.1);
assert.equal(summary.rates.candidateToExpansionManifestationRate, 0.5);
assert.equal(summary.rates.expansionGamesAmongCandidateGames, 0.5);
assert.equal(summary.morphology.regimeLength.mean, 2);
assert.equal(summary.morphology.normalizedPositionInRegime.mean, 0.25);
assert.equal(summary.morphology.candidateCaptureMoveCount.mean, 3.5);
assert.equal(summary.expansionMorphology.captureDelta.mean, 4);
assert.deepEqual(summary.composition.classificationCounts, {
  "capture-branch-expansion": 1,
  "temporary-spike": 1,
});

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
    regimeId: "l1:2-6",
    regimeLength: "5",
    positionInRegime: "3",
    normalizedPositionInRegime: "0.75",
    candidateCaptureMoveCount: "7",
    preCaptureMean: "1",
    postCaptureMean: "5",
    postCaptureMax: "8",
    captureDelta: "6",
    postPersistenceFraction: "0.875",
    recoveryDistance: "5",
    distanceToForcingRelease: "3",
    phaseAtCandidate: "mtaji",
    forcedCaptureAtCandidate: "true",
  },
];
const lg = StageB.summarizeCondition(lgDefinition, lgRows);
const comparison = StageB.compareProfiles(summary, lg);
assert.equal(comparison.candidateAvailability.candidateGameRateDifference, 0.1);
assert.ok(comparison.manifestation.candidateToExpansionRateDifference < 0);
assert.ok(comparison.forcedCaptureRegime.meanRegimeLengthDifference < 0);
assert.equal(StageB.direction(comparison.manifestation.candidateToExpansionRateDifference), "LG>P2");

assert.throws(
  () => StageB.summarizeCondition({ ...definition, expectedPrimaryExpansionGames: 2 }, rows),
  /expected 2 primary expansion games, found 1/,
);
assert.throws(() => StageB.parseArgs([]), /--e018-p2-candidates is required/);

console.log("phase transition Stage B mechanism tests passed");
