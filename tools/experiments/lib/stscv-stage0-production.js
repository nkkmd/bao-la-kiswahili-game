"use strict";

const repr = require("./ssgtc-representation-production.js");

const IDS = Object.freeze({
  IDENTITY: "STSCV-C00-IDENTITY",
  SEAT_SWAP: "STSCV-T01-SEAT-SWAP-LOCAL",
  LR_MTAJI_HOUSELESS: "STSCV-T02-LR-MTAJI-HOUSELESS",
  SEAT_SWAP_LR_MTAJI_HOUSELESS: "STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS",
  NEGATIVE_LR_NO_DIRECTION: "STSCV-C01-LR-NO-DIRECTION-FLIP",
});

const DEFINITIONS = Object.freeze({
  [IDS.IDENTITY]: Object.freeze({ swapPlayers: false, reverseIndex: false, flipDirection: false, flipSide: false, applicability: "all", role: "positive-control" }),
  [IDS.SEAT_SWAP]: Object.freeze({ swapPlayers: true, reverseIndex: false, flipDirection: false, flipSide: false, applicability: "all", role: "provisional-scientific-candidate" }),
  [IDS.LR_MTAJI_HOUSELESS]: Object.freeze({ swapPlayers: false, reverseIndex: true, flipDirection: true, flipSide: true, applicability: "mtaji-houseless", role: "provisional-scientific-candidate" }),
  [IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS]: Object.freeze({ swapPlayers: true, reverseIndex: true, flipDirection: true, flipSide: true, applicability: "mtaji-houseless", role: "provisional-scientific-candidate" }),
  [IDS.NEGATIVE_LR_NO_DIRECTION]: Object.freeze({ swapPlayers: false, reverseIndex: true, flipDirection: false, flipSide: false, applicability: "mtaji-houseless", role: "negative-control" }),
});

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function swap01(value) {
  if (value === null) return null;
  if (value !== 0 && value !== 1) throw new Error(`invalid player-like value ${value}`);
  return 1 - value;
}
function flip(value) {
  if (value === undefined || value === null || value === "") return value;
  if (value === "left") return "right";
  if (value === "right") return "left";
  return value;
}
function def(id) {
  const value = DEFINITIONS[id];
  if (!value) throw new Error(`unknown STSCV transform ${id}`);
  return value;
}
function pair(values, swapPlayers) {
  if (!Array.isArray(values) || values.length !== 2) throw new Error("pair required");
  return swapPlayers ? [values[1], values[0]] : [values[0], values[1]];
}
function transformState(state, id) {
  repr.assertStudyState(state);
  const d = def(id);
  const out = clone(state);
  out.pits = [0, 1].map((targetPlayer) => {
    const sourcePlayer = d.swapPlayers ? 1 - targetPlayer : targetPlayer;
    return [0, 1].map((row) => {
      const cells = state.pits[sourcePlayer][row].slice();
      return d.reverseIndex ? cells.reverse() : cells;
    });
  });
  out.reserve = pair(state.reserve, d.swapPlayers);
  out.houseOwned = pair(state.houseOwned, d.swapPlayers);
  out.pending = pair(state.pending, d.swapPlayers);
  out.player = d.swapPlayers ? swap01(state.player) : state.player;
  out.winner = d.swapPlayers ? swap01(state.winner) : state.winner;
  repr.assertStudyState(out);
  return out;
}
function transformMove(move, id) {
  const d = def(id);
  const out = clone(move);
  if (typeof out.player === "number" && d.swapPlayers) out.player = 1 - out.player;
  if (typeof out.index === "number" && d.reverseIndex) out.index = 7 - out.index;
  if (typeof out.start === "number" && d.reverseIndex) out.start = 7 - out.start;
  if (d.flipDirection && typeof out.direction === "string") out.direction = flip(out.direction);
  if (d.flipSide && typeof out.side === "string") out.side = flip(out.side);
  return out;
}
function applicable(state, id) {
  repr.assertStudyState(state);
  const d = def(id);
  if (d.applicability === "all") return state.phase === "namua" || state.phase === "mtaji";
  return state.phase === "mtaji"
    && state.reserve[0] === 0 && state.reserve[1] === 0
    && state.houseOwned[0] === false && state.houseOwned[1] === false;
}
function mappedWinner(winner, id) {
  return def(id).swapPlayers ? swap01(winner) : winner;
}
function exactMoveKey(move) { return repr.moveKey(move); }
function rawStateKey(state) { return repr.stateKey(state); }
function rawRuleState(state) { return repr.rawRuleState(state); }

module.exports = {
  DEFINITIONS,
  IDS,
  applicable,
  exactMoveKey,
  mappedWinner,
  rawRuleState,
  rawStateKey,
  transformMove,
  transformState,
};
