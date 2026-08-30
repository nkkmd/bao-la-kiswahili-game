"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const SRDR = require("./search-reliability-decision-robustness.js");

const SEMANTICS = "umssr-stage0-production/fresh-technical-observables/v1";
const RAW_FIELDS = Object.freeze(["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value, "utf8").digest("hex"); }
function binary64Hex(value) {
  const buf = Buffer.allocUnsafe(8);
  buf.writeDoubleBE(value, 0);
  return buf.toString("hex");
}
function rawIdentityObject(state) {
  return {
    pits: clone(state.pits),
    reserve: clone(state.reserve),
    houseOwned: clone(state.houseOwned),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: clone(state.pending),
  };
}
function rawIdentityHash(state) { return sha256(stableStringify(rawIdentityObject(state))); }
function pitStats(state, player) {
  const front = state.pits[player][E.FRONT];
  const back = state.pits[player][E.BACK];
  const frontTotal = front.reduce((sum, n) => sum + n, 0);
  const backTotal = back.reduce((sum, n) => sum + n, 0);
  return {
    frontTotal,
    backTotal,
    total: frontTotal + backTotal,
    frontOccupied: front.filter((n) => n > 0).length,
    backOccupied: back.filter((n) => n > 0).length,
    occupied: front.filter((n) => n > 0).length + back.filter((n) => n > 0).length,
    maxPit: Math.max(...front, ...back),
  };
}
function entropyFromCounts(counts) {
  const keys = Object.keys(counts).sort();
  const total = keys.reduce((sum, key) => sum + counts[key], 0);
  if (!total) return 0;
  let value = 0;
  for (const key of keys) {
    const count = counts[key];
    if (!count) continue;
    const p = count / total;
    value += -p * Math.log2(p);
  }
  return value;
}
function legalSummary(state) {
  const moves = E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
  const counts = { capture: 0, pass: 0, takata: 0 };
  for (const move of moves) counts[move.type] = (counts[move.type] || 0) + 1;
  return {
    count: moves.length,
    captureCount: counts.capture || 0,
    takataCount: counts.takata || 0,
    passCount: counts.pass || 0,
    moveKeys: moves.map((move) => AI.moveKey(move)),
    moveTypeEntropyHex: binary64Hex(entropyFromCounts(counts)),
    moves,
  };
}
function successorSummary(state, legal) {
  return legal.moves.map((move) => {
    const next = E.applyMove(state, move).state;
    return {
      moveKey: AI.moveKey(move),
      successorRawIdentityHash: rawIdentityHash(next),
      successorPhase: next.phase,
      successorPlayer: next.player,
      successorWinner: next.winner,
      successorLegalMoveCount: next.winner === null ? E.moveVariants(next).length : 0,
    };
  });
}
function technicalObservable(state) {
  const before = JSON.stringify(state);
  const actor = state.player;
  const opponent = 1 - actor;
  const legal = legalSummary(state);
  const result = {
    semantics: SEMANTICS,
    rawIdentityHash: rawIdentityHash(state),
    phase: state.phase,
    player: actor,
    reserveActor: state.reserve[actor],
    reserveOpponent: state.reserve[opponent],
    reserveTotal: state.reserve[0] + state.reserve[1],
    pendingActor: state.pending[actor],
    pendingOpponent: state.pending[opponent],
    pendingTotal: state.pending[0] + state.pending[1],
    houseOwnedActor: state.houseOwned[actor],
    houseOwnedOpponent: state.houseOwned[opponent],
    actorPits: pitStats(state, actor),
    opponentPits: pitStats(state, opponent),
    legal: {
      count: legal.count,
      captureCount: legal.captureCount,
      takataCount: legal.takataCount,
      passCount: legal.passCount,
      moveKeys: legal.moveKeys,
      moveTypeEntropyHex: legal.moveTypeEntropyHex,
    },
    successors: successorSummary(state, legal),
  };
  if (JSON.stringify(state) !== before) throw new Error("Production technical observable mutated source state");
  return result;
}
function searchSummary(state, depths, options) {
  const before = JSON.stringify(state);
  const rows = depths.map((depth) => {
    const condition = SRDR.analyzeExactCondition(state, depth, options);
    const result = condition.result;
    const scoreByMoveKey = Object.fromEntries(result.candidates
      .map(({ moveKey, score }) => [moveKey, score]).sort((a, b) => a[0].localeCompare(b[0])));
    return {
      depth,
      legalMoveCount: result.legalMoveCount,
      bestScore: result.bestScore,
      topSetMoveKeys: result.topSetMoveKeys.slice().sort(),
      canonicalBestMoveKey: result.canonicalBestMoveKey,
      scoreByMoveKey,
    };
  });
  if (JSON.stringify(state) !== before) throw new Error("Production search summary mutated source state");
  return { semantics: "UMSSR-TECHNICAL-REFERENCE/SRDR", rows };
}

module.exports = {
  SEMANTICS,
  RAW_FIELDS,
  binary64Hex,
  entropyFromCounts,
  rawIdentityHash,
  rawIdentityObject,
  searchSummary,
  stableStringify,
  technicalObservable,
};
