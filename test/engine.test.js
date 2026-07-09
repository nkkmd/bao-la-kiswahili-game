"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");

function blank(phase = "namua") {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.reserve = phase === "namua" ? [10, 10] : [0, 0];
  state.phase = phase;
  state.houseOwned = [false, false];
  return state;
}

function total(state) {
  return state.pits.flat(3).reduce((sum, value) => sum + value, 0)
    + state.reserve[0] + state.reserve[1]
    + (state.pending?.[0] || 0) + (state.pending?.[1] || 0);
}

{
  const state = E.initialState();
  assert.equal(total(state), 64, "initial setup has 64 kete");
  assert.deepEqual(state.pits[0][0], [0, 0, 0, 0, 6, 2, 2, 0]);
  assert.equal(E.legalMoves(state).every((move) => move.type === "takata"), true,
    "the mirrored opening position has no facing occupied pits");
}

{
  const state = blank();
  state.pits[0][0][3] = 2;
  state.pits[1][0][4] = 3;
  state.pits[0][0][5] = 2;
  const moves = E.legalMoves(state);
  assert.equal(moves.every((move) => move.index === 3 && move.type === "capture"), true,
    "takata is hidden when a physical facing capture exists");
  const result = E.applyMove(state, moves[0]).state;
  assert.equal(total(result), 27, "capture moves kete instead of removing them");
  assert.equal(result.pits[1][0][4], 0, "physically opposite front pit is captured");
}

{
  const state = blank();
  state.player = 1;
  state.pits[1][0][2] = 2;
  state.pits[0][0][5] = 3;
  const move = E.legalMoves(state)[0];
  const result = E.applyMove(state, move).state;
  assert.equal(result.pits[0][0][5], 0, "facing-pit mapping is symmetric for North");
}

{
  const state = blank();
  state.pits[0][0][2] = 1;
  state.pits[0][0][5] = 2;
  state.pits[1][0][0] = 1;
  const starts = new Set(E.legalMoves(state).map((move) => move.index));
  assert.deepEqual([...starts], [5], "E11: a singleton cannot start while a multi pit exists");
}

{
  const state = blank("mtaji");
  state.pits[0][0][2] = 2;
  state.pits[0][0][3] = 1;
  state.pits[0][0][4] = 1;
  state.pits[1][0][3] = 3;
  state.pits[1][0][0] = 1;
  const moves = E.legalMoves(state);
  assert.equal(moves.some((move) => move.index === 2 && move.direction === "right" && move.type === "capture"), true,
    "E18: mtaji detects capture at the sowing endpoint");
  assert.equal(moves.every((move) => move.type === "capture"), true,
    "E19: mtaji capture suppresses takata");
}

{
  const state = blank();
  state.pits[0][0][3] = 1;
  state.pits[1][0][4] = 3;
  const result = E.applyMove(state, E.legalMoves(state)[0]).state;
  assert.equal(result.winner, 0, "E31: capturing the last opposing front pit wins immediately");
  assert.equal(result.pending[0], 3, "unsown captured kete remain accounted for at game end");
  assert.equal(total(result), 24, "an immediate win still accounts for every kete");
}

{
  const state = blank("mtaji");
  state.pits[0][0][0] = 8;
  state.pits[0][1][3] = 2;
  state.pits[1][0][0] = 1;
  const moves = E.legalMoves(state);
  assert.equal(moves.some((move) => move.index === 0 && move.direction === "right"), true,
    "a sole front kichwa may sow inward even when the final seed reaches the back row");
  assert.equal(moves.some((move) => move.index === 0 && move.direction === "left"), false,
    "a sole front kichwa may not sow directly toward the back row");
}

{
  const state = blank("mtaji");
  state.houseOwned[0] = true;
  state.pits[0][0][E.HOUSE] = 2;
  state.pits[1][0][0] = 1;
  const move = E.legalMoves(state).find((candidate) => candidate.direction === "right");
  const result = E.applyMove(state, move).state;
  assert.equal(result.houseOwned[0], false, "emptying nyumba removes its ownership");
}

{
  const state = blank("mtaji");
  state.pits[0][0][3] = 2;
  state.pits[0][1][3] = 5;
  state.pits[1][0][0] = 1;
  const moves = E.legalMoves(state);
  assert.equal(moves.every((move) => move.row === E.FRONT), true,
    "E21: a front-row takata is preferred to the back row");
}

for (let game = 0; game < 50; game += 1) {
  let state = E.initialState();
  for (let turn = 0; turn < 300 && state.winner === null; turn += 1) {
    const moves = E.legalMoves(state);
    assert.ok(moves.length > 0, "a running game has a legal move");
    state = E.applyMove(state, moves[Math.floor(Math.random() * moves.length)]).state;
    assert.equal(total(state), 64, "every move conserves all 64 kete");
  }
}

console.log("Bao engine tests passed");
