"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");

(function initialStateIsNamua() {
  const state = E.initialState();
  assert.equal(state.phase, "namua");
  assert.deepEqual(state.reserve, [22, 22]);
})();

(function reserveExhaustionCreatesFormalMtaji() {
  const state = E.initialState();
  state.reserve = [0, 1];
  state.player = 1;
  const move = E.moveVariants(state)[0];
  assert.ok(move, "expected a legal Namua move");
  const result = E.applyMove(state, move);
  assert.deepEqual(result.state.reserve, [0, 0]);
  assert.equal(result.state.phase, "mtaji");
  assert.equal(result.events.filter(({ kind }) => kind === "phase").length, 1);
})();

(function exhaustedPlayerPassDoesNotPrematurelySwitchPhase() {
  let state = E.initialState();
  state.reserve = [0, 1];
  state.player = 0;
  const moves = E.moveVariants(state);
  assert.equal(moves.length, 1);
  assert.equal(moves[0].type, "pass");
  let result = E.applyMove(state, moves[0]);
  state = result.state;
  assert.equal(state.phase, "namua");
  assert.deepEqual(state.reserve, [0, 1]);
  assert.equal(state.player, 1);
  assert.equal(result.events.some(({ kind }) => kind === "phase"), false);

  const finalNamuaMove = E.moveVariants(state)[0];
  assert.ok(finalNamuaMove);
  result = E.applyMove(state, finalNamuaMove);
  assert.deepEqual(result.state.reserve, [0, 0]);
  assert.equal(result.state.phase, "mtaji");
  assert.equal(result.events.some(({ kind }) => kind === "phase"), true);
})();

(function mtajiDoesNotRevertOnNextMoveWhenGameContinues() {
  const state = E.initialState();
  state.reserve = [0, 1];
  state.player = 1;
  const transition = E.applyMove(state, E.moveVariants(state)[0]);
  assert.equal(transition.state.phase, "mtaji");
  if (transition.state.winner === null) {
    const moves = E.moveVariants(transition.state);
    assert.ok(moves.length > 0);
    const next = E.applyMove(transition.state, moves[0]);
    assert.equal(next.state.phase, "mtaji");
  }
})();

console.log("namua-mtaji-transition-engine.test.js: passed");
