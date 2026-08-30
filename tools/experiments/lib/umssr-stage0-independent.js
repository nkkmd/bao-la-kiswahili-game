"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const Legacy = require("./position-complexity-search-diagnostic.js");

const SEMANTICS = "umssr-stage0-independent/fresh-technical-observables/v1";
const RAW_FIELDS = Object.freeze(["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);

function copyJson(value) { return JSON.parse(JSON.stringify(value)); }
function canonicalText(value) {
  if (Array.isArray(value)) return `[${value.map((item) => canonicalText(item)).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const pairs = [];
    for (const key of Object.keys(value).sort()) pairs.push(`${JSON.stringify(key)}:${canonicalText(value[key])}`);
    return `{${pairs.join(",")}}`;
  }
  return JSON.stringify(value);
}
function digest(text) { return crypto.createHash("sha256").update(text, "utf8").digest("hex"); }
function encodeDouble(value) {
  const array = new ArrayBuffer(8);
  const view = new DataView(array);
  view.setFloat64(0, value, false);
  return Buffer.from(array).toString("hex");
}
function rawObject(state) {
  const out = {};
  out.pits = copyJson(state.pits);
  out.reserve = copyJson(state.reserve);
  out.houseOwned = copyJson(state.houseOwned);
  out.player = state.player;
  out.phase = state.phase;
  out.winner = state.winner;
  out.pending = copyJson(state.pending);
  return out;
}
function rawHash(state) { return digest(canonicalText(rawObject(state))); }
function scanPits(state, player) {
  let frontTotal = 0;
  let backTotal = 0;
  let frontOccupied = 0;
  let backOccupied = 0;
  let maxPit = 0;
  for (let i = 0; i < 8; i += 1) {
    const front = state.pits[player][E.FRONT][i];
    const back = state.pits[player][E.BACK][i];
    frontTotal += front;
    backTotal += back;
    if (front > 0) frontOccupied += 1;
    if (back > 0) backOccupied += 1;
    if (front > maxPit) maxPit = front;
    if (back > maxPit) maxPit = back;
  }
  return {
    frontTotal,
    backTotal,
    total: frontTotal + backTotal,
    frontOccupied,
    backOccupied,
    occupied: frontOccupied + backOccupied,
    maxPit,
  };
}
function entropyFromCounts(counts) {
  const keys = Object.keys(counts).slice().sort();
  let total = 0;
  for (const key of keys) total += counts[key];
  if (total === 0) return 0;
  let entropy = 0;
  for (const key of keys) {
    const n = counts[key];
    if (n === 0) continue;
    const probability = n / total;
    entropy = entropy + (-probability * Math.log2(probability));
  }
  return entropy;
}
function exactMoves(state) {
  return E.moveVariants(state).map((move) => copyJson(move))
    .sort((left, right) => AI.moveKey(left).localeCompare(AI.moveKey(right)));
}
function summarizeLegal(state) {
  const moves = exactMoves(state);
  const counts = { capture: 0, pass: 0, takata: 0 };
  for (const move of moves) {
    if (counts[move.type] === undefined) counts[move.type] = 0;
    counts[move.type] += 1;
  }
  return {
    moves,
    count: moves.length,
    captureCount: counts.capture || 0,
    takataCount: counts.takata || 0,
    passCount: counts.pass || 0,
    moveKeys: moves.map((move) => AI.moveKey(move)),
    moveTypeEntropyHex: encodeDouble(entropyFromCounts(counts)),
  };
}
function nextRows(state, legal) {
  const rows = [];
  for (const move of legal.moves) {
    const applied = E.applyMove(state, move);
    const next = applied.state;
    rows.push({
      moveKey: AI.moveKey(move),
      successorRawIdentityHash: rawHash(next),
      successorPhase: next.phase,
      successorPlayer: next.player,
      successorWinner: next.winner,
      successorLegalMoveCount: next.winner === null ? exactMoves(next).length : 0,
    });
  }
  return rows;
}
function technicalObservable(state) {
  const before = JSON.stringify(state);
  const actor = state.player;
  const opponent = actor === 0 ? 1 : 0;
  const legal = summarizeLegal(state);
  const output = {
    semantics: SEMANTICS,
    rawIdentityHash: rawHash(state),
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
    actorPits: scanPits(state, actor),
    opponentPits: scanPits(state, opponent),
    legal: {
      count: legal.count,
      captureCount: legal.captureCount,
      takataCount: legal.takataCount,
      passCount: legal.passCount,
      moveKeys: legal.moveKeys,
      moveTypeEntropyHex: legal.moveTypeEntropyHex,
    },
    successors: nextRows(state, legal),
  };
  if (JSON.stringify(state) !== before) throw new Error("Independent technical observable mutated source state");
  return output;
}
function searchSummary(state, depths, options) {
  const before = JSON.stringify(state);
  const rows = [];
  for (const depth of depths) {
    const result = Legacy.analyzeRootCandidates(state, depth, options);
    const pairs = result.candidates.map((candidate) => [candidate.moveKey, candidate.score]);
    pairs.sort((a, b) => a[0].localeCompare(b[0]));
    rows.push({
      depth,
      legalMoveCount: result.legalMoveCount,
      bestScore: result.bestScore,
      topSetMoveKeys: result.topSetMoveKeys.slice().sort(),
      canonicalBestMoveKey: result.canonicalBestMoveKey,
      scoreByMoveKey: Object.fromEntries(pairs),
    });
  }
  if (JSON.stringify(state) !== before) throw new Error("Independent search summary mutated source state");
  return { semantics: "UMSSR-TECHNICAL-REFERENCE/LEGACY-INDEPENDENT", rows };
}

module.exports = {
  SEMANTICS,
  RAW_FIELDS,
  binary64Hex: encodeDouble,
  entropyFromCounts,
  rawIdentityHash: rawHash,
  rawIdentityObject: rawObject,
  searchSummary,
  stableStringify: canonicalText,
  technicalObservable,
};
