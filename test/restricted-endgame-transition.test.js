"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const T = require("../tools/experiments/lib/restricted-endgame-transition.js");

function blankMtaji() {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.reserve = [0, 0];
  state.phase = "mtaji";
  state.houseOwned = [false, false];
  state.pending = [0, 0];
  state.winner = null;
  state.reason = "";
  state.player = 0;
  state.turn = 45;
  return state;
}

function assertParityForAllMoves(state, label) {
  const moves = T.exactMtajiMoves(state);
  assert.ok(moves.length > 0, `${label}: expected legal moves`);
  for (const move of moves) {
    const comparison = T.compareWithRuntimeEngine(state, move, {
      administrativeMaxMicrostates: 100_000,
    });
    assert.equal(comparison.runtimeGuardHit, false, `${label}: unexpected runtime relay guard`);
    assert.equal(comparison.exact.status, "TERMINATED", `${label}: exact transition did not terminate`);
    assert.equal(comparison.equal, true, `${label}: transition mismatch for ${T.moveKey(move)}`);
  }
}

{
  const state = blankMtaji();
  state.pits[0][0][2] = 2;
  state.pits[0][0][3] = 1;
  state.pits[0][0][4] = 1;
  state.pits[1][0][3] = 3;
  state.pits[1][0][0] = 1;
  assertParityForAllMoves(state, "forced capture endpoint fixture");
}

{
  const state = blankMtaji();
  state.pits[0][0][0] = 8;
  state.pits[0][1][3] = 2;
  state.pits[1][0][0] = 1;
  assertParityForAllMoves(state, "sole-front direction fixture");
}

{
  const state = blankMtaji();
  state.houseOwned[0] = true;
  state.pits[0][0][E.HOUSE] = 2;
  state.pits[1][0][0] = 1;
  assertParityForAllMoves(state, "house ownership loss fixture");
}

{
  const state = blankMtaji();
  state.pits[0][0][3] = 2;
  state.pits[0][1][3] = 5;
  state.pits[1][0][0] = 1;
  assertParityForAllMoves(state, "front priority fixture");
}

{
  const base = {
    type: "capture", phase: "namua", row: 0, index: 4,
    direction: "left", side: "right", houseTwo: false,
  };
  assert.notEqual(
    T.moveKey({ ...base, houseChoice: "stop" }),
    T.moveKey({ ...base, houseChoice: "use" }),
    "exact move identity must distinguish nyumba stop/use",
  );
}

{
  const state = blankMtaji();
  state.pits[0][0][2] = 2;
  state.pits[1][0][0] = 1;
  const a = T.directStateKey(state);
  const historyOnly = E.clone(state);
  historyOnly.turn += 100;
  historyOnly.reason = "diagnostic-only";
  const b = T.directStateKey(historyOnly);
  assert.equal(a, b, "direct rule-state identity excludes turn/reason metadata");
}

{
  const state = blankMtaji();
  state.pits[0][0][2] = 2;
  state.pits[1][0][0] = 1;
  const move = T.exactMtajiMoves(state)[0];
  const result = T.applyMtajiGuardFree(state, move, { administrativeMaxMicrostates: 1 });
  assert.ok(["TERMINATED", "ADMIN-CUTOFF"].includes(result.status));
  if (result.status === "ADMIN-CUTOFF") {
    assert.equal(result.state, null, "administrative cutoff must not invent a game result");
  }
}

console.log("Restricted endgame guard-free Mtaji transition tests passed");
