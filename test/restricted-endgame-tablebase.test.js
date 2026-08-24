"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const P = require("../tools/experiments/lib/restricted-endgame-tablebase.js");
const I = require("../tools/experiments/lib/restricted-endgame-tablebase-independent.js");

function fixture() {
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
  state.pits[0][0][2] = 2;
  state.pits[1][0][0] = 1;
  return state;
}

const p = P.solveExactTablebase([fixture()], { maxStates: 100, maxEdges: 100, maxMicrostates: 1000 });
const i = I.solveIndependentTablebase([fixture()], { maxStates: 100, maxEdges: 100, maxMicrostates: 1000 });
assert.equal(p.graph.stateCount, 3);
assert.equal(p.graph.edgeCount, 2);
assert.equal(p.graph.stateSetSha256, i.graph.stateSetSha256);
assert.equal(p.graph.transitionSetSha256, i.graph.transitionSetSha256);
assert.deepEqual(p.solution.counts, i.solution.counts);
assert.equal(p.solution.solutionSha256, i.solution.solutionSha256);
assert.deepEqual(p.solution.rows, i.solution.rows);
assert.deepEqual(p.solution.recurrentSccs, i.solution.recurrentSccs);
const root = p.solution.rows.find((row) => row.stateKey === p.graph.rootKeys[0]);
assert.equal(root.status, "WIN");
assert.equal(root.absoluteWinner, 0);
assert.equal(root.dtf, 1);
assert.equal(root.optimalMoveKeys.length, 2);

console.log("Restricted endgame Stage 1 tablebase fixture tests passed");
