"use strict";

const assert = require("node:assert/strict");
const Formation = require("../tools/experiments/summarize-confirmation-capture-branch-formation.js");

const games = [
  { gameId: "g1", trajectoryHash: "t1" },
  { gameId: "g2", trajectoryHash: "t1" },
  { gameId: "g3", trajectoryHash: "t2" },
];
const deltas = [
  {
    gameId: "g1", candidatePly: "7", archetypeId: "a1",
    peakRelativePly: "2", peakCaptureMoveCount: "9",
    delta_captureMoveCount: "6", delta_actorMaxCapture: "4",
    delta_opponentMaxCapture: "-2", peakSamePlayerAsCandidate: "true",
    phaseChanged: "false", actorHouseLost: "false", opponentHouseLost: "false",
  },
  {
    gameId: "g2", candidatePly: "7", archetypeId: "a1",
    peakRelativePly: "2", peakCaptureMoveCount: "9",
    delta_captureMoveCount: "6", delta_actorMaxCapture: "4",
    delta_opponentMaxCapture: "-2", peakSamePlayerAsCandidate: "true",
    phaseChanged: "false", actorHouseLost: "false", opponentHouseLost: "false",
  },
  {
    gameId: "g3", candidatePly: "12", archetypeId: "a2",
    peakRelativePly: "1", peakCaptureMoveCount: "7",
    delta_captureMoveCount: "8", delta_actorMaxCapture: "2",
    delta_opponentMaxCapture: "-1", peakSamePlayerAsCandidate: "false",
    phaseChanged: "true", actorHouseLost: "false", opponentHouseLost: "true",
  },
];

const result = Formation.analyze(games, deltas);
assert.equal(result.summary.raw.candidateCount, 3);
assert.equal(result.summary.trajectoryPlyDeduplicated.candidateCount, 2);
assert.equal(result.summary.structure.uniqueTrajectoryCount, 2);
assert.equal(result.summary.structure.uniqueArchetypeCount, 2);
assert.equal(result.summary.structure.largestTrajectoryPlyMultiplicity, 2);
assert.equal(result.summary.raw.means.delta_actorMaxCapture, 10 / 3);
assert.equal(result.summary.trajectoryPlyDeduplicated.means.delta_actorMaxCapture, 3);
assert.equal(result.summary.trajectoryPlyDeduplicated.means.delta_opponentMaxCapture, -1.5);
assert.equal(result.summary.raw.counts.peakOnCandidatePlayer, 2);
assert.equal(result.summary.trajectoryPlyDeduplicated.counts.phaseChanged, 1);
assert.equal(result.duplicateGroups[0].candidateCount, 2);
assert.equal(result.summary.interpretation.preregisteredDecisionChanged, false);

console.log("phase transition confirmation capture formation sensitivity tests passed");
