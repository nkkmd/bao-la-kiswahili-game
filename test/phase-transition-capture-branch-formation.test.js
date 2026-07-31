"use strict";
const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const F = require("../tools/experiments/analyze-capture-branch-formation.js");

const game = { moves: [] };
const states = F.replayStates(game);
assert.equal(states.length, 1);
assert.deepEqual(states[0], E.initialState());
assert.equal(F.candidatePlyValue({ candidatePly: "7" }), 7);

const candidate = { archetypeId: "a", gameId: "g", candidatePly: 3 };
const rows = [
  { relativePly: 0, captureMoveCount: 2, legalMoveCount: 2, actorFrontOccupied: 3, opponentFrontOccupied: 4, actorReusablePits: 2, opponentReusablePits: 3, actorMaxCapture: 1, opponentMaxCapture: 2, actorFrontSeeds: 5, opponentFrontSeeds: 6, actorReserve: 10, opponentReserve: 11, phase: "namua", actorHouseOwned: true, opponentHouseOwned: true, samePlayerAsCandidate: true },
  { relativePly: 2, captureMoveCount: 6, legalMoveCount: 6, actorFrontOccupied: 4, opponentFrontOccupied: 3, actorReusablePits: 5, opponentReusablePits: 2, actorMaxCapture: 3, opponentMaxCapture: 1, actorFrontSeeds: 8, opponentFrontSeeds: 4, actorReserve: 8, opponentReserve: 9, phase: "namua", actorHouseOwned: false, opponentHouseOwned: true, samePlayerAsCandidate: true },
];
const delta = F.deltaRecord(candidate, rows);
assert.equal(delta.peakRelativePly, 2);
assert.equal(delta.delta_captureMoveCount, 4);
assert.equal(delta.delta_actorReusablePits, 3);
assert.equal(delta.actorHouseLost, true);
console.log("capture branch formation helper tests passed");
