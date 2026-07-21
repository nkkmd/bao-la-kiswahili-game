"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");

function canonicalState(state) {
  return {
    pits: state.pits,
    reserve: state.reserve,
    houseOwned: state.houseOwned,
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    reason: state.reason || "",
    turn: state.turn,
    pending: state.pending || [0, 0],
  };
}

function stateHash(state) {
  return crypto.createHash("sha256")
    .update(JSON.stringify(canonicalState(state)))
    .digest("hex");
}

function count(values, predicate) {
  return values.reduce((total, value) => total + (predicate(value) ? 1 : 0), 0);
}

function extractPhaseTransitionFeatures(state, context = {}) {
  const before = JSON.stringify(state);
  const moves = E.moveVariants(state);
  const captureMoveCount = count(moves, (move) => move.type === "capture");
  const frontSeedCount = state.pits.map((rows) => rows[E.FRONT].reduce((a, b) => a + b, 0));
  const occupiedPits = state.pits.map((rows) => count(rows[E.FRONT], (value) => value > 0));
  const allPits = state.pits.flat(2);

  const observation = {
    schemaVersion: "1.0.0",
    ...(context.gameId === undefined ? {} : { gameId: context.gameId }),
    ...(context.conditionId === undefined ? {} : { conditionId: context.conditionId }),
    ...(context.seed === undefined ? {} : { seed: context.seed }),
    ply: context.ply ?? 0,
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    reason: state.reason || "",
    stateHash: stateHash(state),
    previousStateHash: context.previousStateHash ?? null,
    reserve: [...state.reserve],
    houseOwned: [...state.houseOwned],
    pending: [...(state.pending || [0, 0])],
    legalMoveCount: moves.length,
    captureMoveCount,
    nonCaptureMoveCount: moves.length - captureMoveCount,
    forcedCapture: moves.length > 0 && captureMoveCount === moves.length,
    boardSeedCount: allPits.reduce((a, b) => a + b, 0),
    nonEmptyPitCount: count(allPits, (value) => value > 0),
    frontRow: {
      occupiedPits,
      occupancyRate: occupiedPits.map((value) => value / 8),
      seedCount: frontSeedCount,
    },
  };

  if (JSON.stringify(state) !== before) {
    throw new Error("Feature extraction mutated the source state");
  }
  return observation;
}

module.exports = { canonicalState, stateHash, extractPhaseTransitionFeatures };
