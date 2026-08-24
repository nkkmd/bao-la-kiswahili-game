"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const T = require("../tools/experiments/lib/restricted-endgame-transition.js");
const V = require("../tools/experiments/lib/restricted-endgame-independent-verifier.js");

function blankMtaji() {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.reserve = [0, 0];
  state.phase = "mtaji";
  state.houseOwned = [false, false];
  state.player = 0;
  state.winner = null;
  state.reason = "";
  state.pending = [0, 0];
  state.turn = 45;
  return state;
}

function keys(moves) {
  return moves.map((move) => V.moveKey(move)).sort();
}

function assertCase(state) {
  const canonicalMoves = T.exactMtajiMoves(state);
  const independentMoves = V.legalMtajiMoves(state);
  assert.deepEqual(keys(independentMoves), keys(canonicalMoves), "independent legal move set must match");
  assert.equal(V.stateKey(state), T.directStateKey(state), "independent raw state hash must match");
  for (const move of independentMoves) {
    const a = V.applyGuardFree(state, move);
    const b = T.applyMtajiGuardFree(state, move);
    assert.equal(a.status, b.status, "independent transition status must match");
    if (a.status === "TERMINATED") {
      assert.equal(V.stateKey(a.state), T.directStateKey(b.state), "independent successor state must match");
    }
  }
}

{
  const state = blankMtaji();
  state.pits[0][0][2] = 2;
  state.pits[0][0][3] = 1;
  state.pits[0][0][4] = 1;
  state.pits[1][0][3] = 3;
  state.pits[1][0][0] = 1;
  assertCase(state);
}

{
  const state = blankMtaji();
  state.pits[0][0][0] = 8;
  state.pits[0][1][3] = 2;
  state.pits[1][0][0] = 1;
  assertCase(state);
}

{
  const state = blankMtaji();
  state.pits[0][0][3] = 2;
  state.pits[0][1][3] = 5;
  state.pits[1][0][0] = 1;
  assertCase(state);
}

console.log("Restricted endgame independent verifier unit tests passed");
