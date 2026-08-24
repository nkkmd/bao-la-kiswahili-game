"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const T = require("../tools/experiments/lib/restricted-endgame-transition.js");
const S0 = require("../tools/experiments/lib/restricted-endgame-stage0.js");

function tinyClosureRoot() {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.reserve = [0, 0];
  state.houseOwned = [false, false];
  state.pending = [0, 0];
  state.phase = "mtaji";
  state.player = 0;
  state.winner = null;
  state.reason = "";
  state.turn = 45;
  state.pits[0][E.FRONT][0] = 2;
  state.pits[1][E.FRONT][7] = 1;
  return state;
}

{
  let state = E.initialState();
  const rows = [];
  for (let ply = 0; ply < 4; ply += 1) {
    const moves = E.moveVariants(state)
      .slice()
      .sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    assert.ok(moves.length > 0);
    const move = moves[0];
    const beforeStateKey = T.directStateKey(state);
    const next = E.applyMove(state, move).state;
    assert.notEqual(next.reason, "relay-limit");
    const afterStateKey = T.directStateKey(next);
    rows.push({
      ply,
      move: E.clone(move),
      moveKey: T.moveKey(move),
      beforeStateKey,
      afterStateKey,
    });
    state = next;
  }
  const witness = {
    seed: 0,
    rootPly: 4,
    rootStateKey: T.directStateKey(state),
    moves: rows,
  };
  const replay = S0.replayWitness(witness);
  assert.equal(replay.passed, true, "legal witness path must replay to exact direct root state");
}

{
  const root = tinyClosureRoot();
  const moves = T.exactMtajiMoves(root);
  assert.equal(moves.length, 1, "technical closure fixture has one legal move");
  const closureA = S0.enumerateClosure([root], {
    maxStates: 100,
    maxEdges: 100,
    administrativeMaxMicrostates: 10_000,
  });
  const closureB = S0.enumerateClosure([root], {
    maxStates: 100,
    maxEdges: 100,
    administrativeMaxMicrostates: 10_000,
  });
  assert.equal(closureA.complete, true);
  assert.equal(closureA.stateCount, 2);
  assert.equal(closureA.edgeCount, 1);
  assert.equal(closureA.branching.expandedStates, 1);
  assert.equal(closureA.stateSetSha256, closureB.stateSetSha256);
  assert.equal(closureA.transitionSetSha256, closureB.transitionSetSha256);
  assert.equal("win" in closureA, false, "Stage 0 closure summary must not emit scientific value fields");
  assert.equal("loss" in closureA, false);
  assert.equal("recurrent" in closureA, false);
}

{
  const root = tinyClosureRoot();
  const stopped = S0.enumerateClosure([root], {
    maxStates: 1,
    maxEdges: 100,
    administrativeMaxMicrostates: 10_000,
  });
  assert.equal(stopped.complete, false);
  assert.equal(stopped.technicalStopReason, "STATE-LIMIT");
  assert.equal("winner" in stopped, false, "resource stop is technical, not a game outcome");
}

{
  const roots = [
    { rootStateKey: "a", nonEmptyPitCount: 7, legalMoveCount: 2 },
    { rootStateKey: "b", nonEmptyPitCount: 9, legalMoveCount: 3 },
    { rootStateKey: "c", nonEmptyPitCount: 11, legalMoveCount: 5 },
    { rootStateKey: "d", nonEmptyPitCount: 13, legalMoveCount: 6 },
  ];
  const plans = S0.buildCandidatePlans(roots);
  assert.ok(plans.length > 0);
  assert.ok(plans.every((plan) => plan.rootKeys.every((key) => ["a", "b", "c", "d"].includes(key))));
  assert.ok(plans.every((plan) => plan.origins.length > 0));
}

console.log("Restricted endgame Stage 0 witness/closure tests passed");
