"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const F = require("../tools/experiments/lib/phase-transition-features.js");

{
  const state = E.initialState();
  const snapshot = JSON.stringify(state);
  const result = F.extractPhaseTransitionFeatures(state, {
    gameId: "fixture-initial",
    conditionId: "fixture",
    seed: 20260721,
    ply: 0,
  });

  assert.equal(JSON.stringify(state), snapshot, "extractor must not mutate the engine state");
  assert.equal(result.schemaVersion, "1.0.0");
  assert.equal(result.phase, "namua");
  assert.deepEqual(result.reserve, [22, 22]);
  assert.deepEqual(result.frontRow.occupiedPits, [3, 3]);
  assert.deepEqual(result.frontRow.seedCount, [10, 10]);
  assert.equal(result.boardSeedCount, 20);
  assert.equal(result.nonEmptyPitCount, 6);
  assert.match(result.stateHash, /^[a-f0-9]{64}$/);
  assert.equal(result.stateHash, F.stateHash(E.clone(state)), "equivalent states have stable hashes");
}

{
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.reserve = [10, 10];
  state.houseOwned = [false, false];
  state.pits[0][E.FRONT][3] = 2;
  state.pits[1][E.FRONT][4] = 3;

  const result = F.extractPhaseTransitionFeatures(state, { ply: 12 });
  assert.equal(result.captureMoveCount, result.legalMoveCount);
  assert.equal(result.nonCaptureMoveCount, 0);
  assert.equal(result.forcedCapture, true);
  assert.equal(result.frontRow.occupancyRate[0], 1 / 8);
  assert.equal(result.frontRow.occupancyRate[1], 1 / 8);
}

{
  const state = E.initialState();
  state.phase = "mtaji";
  state.reserve = [0, 0];
  state.houseOwned = [false, false];
  const result = F.extractPhaseTransitionFeatures(state, { ply: 50 });
  assert.equal(result.phase, "mtaji");
  assert.deepEqual(result.reserve, [0, 0]);
}

console.log("phase-transition feature tests passed");
