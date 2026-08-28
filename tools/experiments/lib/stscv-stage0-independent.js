"use strict";

const repr = require("./ssgtc-representation-independent.js");

const IDS = Object.freeze({
  IDENTITY: "STSCV-C00-IDENTITY",
  SEAT_SWAP: "STSCV-T01-SEAT-SWAP-LOCAL",
  LR_MTAJI_HOUSELESS: "STSCV-T02-LR-MTAJI-HOUSELESS",
  SEAT_SWAP_LR_MTAJI_HOUSELESS: "STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS",
  NEGATIVE_LR_NO_DIRECTION: "STSCV-C01-LR-NO-DIRECTION-FLIP",
});

function flags(id) {
  switch (id) {
    case IDS.IDENTITY: return { swap: false, reverse: false, turn: false, side: false, scope: "all" };
    case IDS.SEAT_SWAP: return { swap: true, reverse: false, turn: false, side: false, scope: "all" };
    case IDS.LR_MTAJI_HOUSELESS: return { swap: false, reverse: true, turn: true, side: true, scope: "mtaji-houseless" };
    case IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS: return { swap: true, reverse: true, turn: true, side: true, scope: "mtaji-houseless" };
    case IDS.NEGATIVE_LR_NO_DIRECTION: return { swap: false, reverse: true, turn: false, side: false, scope: "mtaji-houseless" };
    default: throw new Error(`unknown independent STSCV transform ${id}`);
  }
}
function copied(value) { return JSON.parse(JSON.stringify(value)); }
function oppositePlayer(value) {
  if (value === null) return null;
  if (value === 0) return 1;
  if (value === 1) return 0;
  throw new Error("invalid player-like value");
}
function oppositeDirection(value) {
  if (value === "left") return "right";
  if (value === "right") return "left";
  return value;
}
function transformState(state, id) {
  repr.assertStudyState(state);
  const f = flags(id);
  const out = copied(state);
  const board = [];
  for (let target = 0; target < 2; target += 1) {
    const source = f.swap ? 1 - target : target;
    const rows = [];
    for (let row = 0; row < 2; row += 1) {
      const targetRow = Array(8);
      for (let index = 0; index < 8; index += 1) {
        const targetIndex = f.reverse ? 7 - index : index;
        targetRow[targetIndex] = state.pits[source][row][index];
      }
      rows.push(targetRow);
    }
    board.push(rows);
  }
  out.pits = board;
  out.reserve = f.swap ? [state.reserve[1], state.reserve[0]] : [state.reserve[0], state.reserve[1]];
  out.houseOwned = f.swap ? [state.houseOwned[1], state.houseOwned[0]] : [state.houseOwned[0], state.houseOwned[1]];
  out.pending = f.swap ? [state.pending[1], state.pending[0]] : [state.pending[0], state.pending[1]];
  out.player = f.swap ? oppositePlayer(state.player) : state.player;
  out.winner = f.swap ? oppositePlayer(state.winner) : state.winner;
  repr.assertStudyState(out);
  return out;
}
function transformMove(move, id) {
  const f = flags(id);
  const out = copied(move);
  if (f.swap && typeof out.player === "number") out.player = oppositePlayer(out.player);
  if (f.reverse && Number.isInteger(out.index)) out.index = 7 - out.index;
  if (f.reverse && Number.isInteger(out.start)) out.start = 7 - out.start;
  if (f.turn && typeof out.direction === "string") out.direction = oppositeDirection(out.direction);
  if (f.side && typeof out.side === "string") out.side = oppositeDirection(out.side);
  return out;
}
function applicable(state, id) {
  repr.assertStudyState(state);
  const f = flags(id);
  if (f.scope === "all") return state.phase === "namua" || state.phase === "mtaji";
  return state.phase === "mtaji"
    && state.reserve[0] === 0 && state.reserve[1] === 0
    && state.houseOwned[0] === false && state.houseOwned[1] === false;
}
function mappedWinner(winner, id) { return flags(id).swap ? oppositePlayer(winner) : winner; }
function exactMoveKey(move) { return repr.moveIdentity(move); }
function rawStateKey(state) { return repr.key(state); }
function rawRuleState(state) { return repr.project(state); }

module.exports = {
  IDS,
  applicable,
  exactMoveKey,
  mappedWinner,
  rawRuleState,
  rawStateKey,
  transformMove,
  transformState,
};
