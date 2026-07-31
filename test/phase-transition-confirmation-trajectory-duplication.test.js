"use strict";

const assert = require("node:assert/strict");
const Audit = require("../tools/experiments/analyze-confirmation-trajectory-duplication.js");

const games = [
  { gameId: "g1", trajectoryHash: "t1" },
  { gameId: "g2", trajectoryHash: "t1" },
  { gameId: "g3", trajectoryHash: "t2" },
  { gameId: "g4", trajectoryHash: "t3" },
];
const candidates = [
  {
    gameId: "g1", candidatePly: "7", distanceToTerminal: "20",
    archetypeId: "a1", classification: "capture-branch-expansion",
    phaseAtCandidate: "namua", captureDelta: "6", postPersistenceFraction: "1",
    postCaptureMax: "9",
  },
  {
    gameId: "g2", candidatePly: "7", distanceToTerminal: "20",
    archetypeId: "a1", classification: "capture-branch-expansion",
    phaseAtCandidate: "namua", captureDelta: "6", postPersistenceFraction: "1",
    postCaptureMax: "9",
  },
  {
    gameId: "g3", candidatePly: "12", distanceToTerminal: "15",
    archetypeId: "a2", classification: "forcing-release-precursor",
    phaseAtCandidate: "mtaji", captureDelta: "-2", postPersistenceFraction: "0",
    postCaptureMax: "5",
  },
  {
    gameId: "g4", candidatePly: "3", distanceToTerminal: "4",
    archetypeId: "excluded", classification: "capture-branch-expansion",
  },
];
const controls = [
  { gameId: "g1", candidatePly: "20", distanceToTerminal: "12", classification: "temporary-spike" },
  { gameId: "g2", candidatePly: "20", distanceToTerminal: "12", classification: "temporary-spike" },
  { gameId: "g3", candidatePly: "20", distanceToTerminal: "12", classification: "capture-branch-expansion" },
  { gameId: "g4", candidatePly: "20", distanceToTerminal: "12", classification: "temporary-spike" },
];

const result = Audit.analyze(games, candidates, controls, 9);
assert.equal(result.summary.rawEndpoint.counts.candidates, 3);
assert.equal(result.summary.rawEndpoint.counts.candidateExpansion, 2);
assert.equal(result.summary.rawEndpoint.counts.controls, 4);
assert.equal(result.summary.trajectoryPlyDeduplicatedEndpoint.counts.candidates, 2);
assert.equal(result.summary.trajectoryPlyDeduplicatedEndpoint.counts.candidateExpansion, 1);
assert.equal(result.summary.trajectoryPlyDeduplicatedEndpoint.counts.controls, 3);
assert.equal(result.summary.candidateStructure.uniqueTrajectoryCount, 2);
assert.equal(result.summary.candidateStructure.uniqueArchetypeCount, 2);
assert.equal(result.summary.candidateStructure.largestTrajectoryPlyMultiplicity, 2);
assert.equal(result.archetypes.length, 2);
assert.equal(result.duplicateGroups[0].candidateCount, 2);
assert.equal(result.duplicateGroups[0].gameCount, 2);
assert.equal(result.summary.interpretation.preregisteredDecisionChanged, false);

console.log("phase transition confirmation trajectory duplication tests passed");
