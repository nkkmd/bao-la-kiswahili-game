"use strict";
const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const F = require("../tools/experiments/analyze-capture-branch-formation.js");

const game = { moves: [] };
const states = F.replayStates(game);
assert.equal(states.length, 1);
assert.deepEqual(states[0], E.initialState());

const candidate = { archetypeId: "a", gameId: "g", ply: 3 };
const rows = [
  { relativePly: 0, captureMoveCount: 2, legalMoveCount: 2, ownFrontOccupied: 3, enemyFrontOccupied: 4, ownReusablePits: 2, enemyReusablePits: 3, ownMaxCapture: 1, enemyMaxCapture: 2, ownFrontSeeds: 5, enemyFrontSeeds: 6, ownReserve: 10, enemyReserve: 11, phase: "namua", ownHouseOwned: true, enemyHouseOwned: true },
  { relativePly: 2, captureMoveCount: 6, legalMoveCount: 6, ownFrontOccupied: 4, enemyFrontOccupied: 3, ownReusablePits: 5, enemyReusablePits: 2, ownMaxCapture: 3, enemyMaxCapture: 1, ownFrontSeeds: 8, enemyFrontSeeds: 4, ownReserve: 8, enemyReserve: 9, phase: "namua", ownHouseOwned: false, enemyHouseOwned: true },
];
const delta = F.deltaRecord(candidate, rows);
assert.equal(delta.peakRelativePly, 2);
assert.equal(delta.delta_captureMoveCount, 4);
assert.equal(delta.delta_ownReusablePits, 3);
assert.equal(delta.ownHouseLost, true);
console.log("capture branch formation helper tests passed");
