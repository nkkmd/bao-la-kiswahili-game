"use strict";

const E = require("../../public/engine.js");

function swapPlayer(value) {
  return value === null ? null : 1 - value;
}

function swapDirection(value) {
  if (value === "left") return "right";
  if (value === "right") return "left";
  return value;
}

function transformState(state, options = {}) {
  const reverseColumns = Boolean(options.reverseColumns);
  const copyRows = (rows) => rows.map((row) => (
    reverseColumns ? row.slice().reverse() : row.slice()
  ));
  return {
    ...E.clone(state),
    pits: [copyRows(state.pits[1]), copyRows(state.pits[0])],
    reserve: [state.reserve[1], state.reserve[0]],
    houseOwned: [state.houseOwned[1], state.houseOwned[0]],
    player: swapPlayer(state.player),
    winner: swapPlayer(state.winner),
    pending: [state.pending?.[1] || 0, state.pending?.[0] || 0],
  };
}

function transformMove(move, options = {}) {
  const transformed = E.clone(move);
  if (typeof transformed.player === "number") transformed.player = 1 - transformed.player;
  if (options.reverseColumns) {
    if (typeof transformed.index === "number") transformed.index = 7 - transformed.index;
    if (typeof transformed.start === "number") transformed.start = 7 - transformed.start;
  }
  if (options.reverseDirections) {
    if (typeof transformed.side === "string") transformed.side = swapDirection(transformed.side);
    if (typeof transformed.direction === "string") {
      transformed.direction = swapDirection(transformed.direction);
    }
  }
  return transformed;
}

const CANDIDATES = {
  A: { playerSwap: true, reverseColumns: true, reverseDirections: true },
  B: { playerSwap: true, reverseColumns: true, reverseDirections: false },
  C: { playerSwap: true, reverseColumns: false, reverseDirections: true },
  D: { playerSwap: true, reverseColumns: false, reverseDirections: false },
};

function stateFor(candidate, state) {
  return transformState(state, CANDIDATES[candidate]);
}

function moveFor(candidate, move) {
  return transformMove(move, CANDIDATES[candidate]);
}

// Engine pit indices are local to each player's viewpoint. A 180-degree seat
// exchange therefore preserves index, side, and direction in those local
// coordinates; only player-indexed state is exchanged.
const mirrorState = (state) => stateFor("D", state);
const mirrorMove = (move) => moveFor("D", move);

module.exports = {
  CANDIDATES,
  mirrorMove,
  mirrorState,
  moveFor,
  stateFor,
  transformMove,
  transformState,
};
