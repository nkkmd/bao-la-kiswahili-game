"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const WIN = 1_000_000;
const SEMANTICS = "tmgc-stage0-independent/direct-c03-and-search-reconstruction/v1";

function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function moveKey(move) {
  if (!move) return "";
  return [move.type, move.phase, move.row, move.index, move.direction, move.side,
    move.houseChoice, Boolean(move.houseTwo)].join(":");
}
function rawIdentityObject(state) {
  if (!state || !Array.isArray(state.pending)) throw new Error("Independent RAW identity requires pending");
  return {
    pits: cloneJson(state.pits),
    reserve: cloneJson(state.reserve),
    houseOwned: cloneJson(state.houseOwned),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: cloneJson(state.pending),
  };
}
function rawIdentityHash(state) { return sha256(stableStringify(rawIdentityObject(state))); }
function normalizedFamily(move, mode) {
  const family = {
    type: move.type || null,
    phase: move.phase || null,
    row: Number.isInteger(move.row) ? move.row : null,
    index: Number.isInteger(move.index) ? move.index : null,
    direction: move.direction || null,
    side: move.side || null,
    houseChoice: move.houseChoice || null,
    houseTwo: Boolean(move.houseTwo),
  };
  if (mode === "coarse-no-index") delete family.index;
  else if (mode !== "indexed") throw new Error(`Unsupported independent abstraction mode: ${mode}`);
  return family;
}
function parseMoveToken(token) {
  const marker = "move:";
  if (!token.startsWith(marker)) throw new Error("Invalid candidate move token");
  const rest = token.slice(marker.length);
  const split = rest.indexOf(":");
  if (split < 0) throw new Error("Invalid candidate move token");
  return { mode: rest.slice(0, split), family: JSON.parse(rest.slice(split + 1)) };
}
function moveMatchesCandidate(move, candidate) {
  const parsed = parseMoveToken(candidate.moveAbstractionToken);
  if (parsed.mode !== candidate.moveAbstractionMode) return false;
  return stableStringify(normalizedFamily(move, parsed.mode)) === stableStringify(parsed.family);
}
function matchingMoves(state, candidate) {
  return E.moveVariants(state).filter((move) => moveMatchesCandidate(move, candidate))
    .sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
}
function reusablePits(state, player) {
  return state.pits[player].flat().filter((value) => value >= 2).length;
}
function rootPreconditionHolds(state, candidate) {
  if (state.phase !== candidate.phase) return false;
  if (candidate.preconditions.length !== 1 || candidate.preconditions[0] !== "reusablePits=0-2") {
    throw new Error("Independent C03 reconstruction encountered unexpected precondition");
  }
  return reusablePits(state, state.player) <= 2;
}
function signToken(value) { return value > 0 ? "+" : value < 0 ? "-" : "0"; }
function structuralSuccess(state, move, candidate) {
  if (candidate.consequence !== "actorNyumbaSeedsDeltaSign=0") {
    throw new Error("Independent C03 reconstruction encountered unexpected primary consequence");
  }
  const actor = state.player;
  const before = state.pits[actor][E.FRONT][E.HOUSE];
  const after = E.applyMove(state, move).state.pits[actor][E.FRONT][E.HOUSE];
  return signToken(after - before) === "0";
}
function actorCaptureMoveCount(state, actor) {
  if (state.winner !== null) return 0;
  const view = E.clone(state);
  view.player = actor;
  return E.moveVariants(view).filter((move) => move.type === "capture").length;
}
function pairedConsequenceHolds(state, move, candidate) {
  const paired = candidate.pairedDiagnosticDefinition;
  if (!paired || paired.consequence !== "worstReplyActorCaptureMoveDeltaSign=0") {
    throw new Error("Independent C03 reconstruction encountered unexpected paired consequence");
  }
  const actor = state.player;
  const rootCount = actorCaptureMoveCount(state, actor);
  const applied = E.applyMove(state, move).state;
  if (applied.winner !== null) return false;
  const replies = E.moveVariants(applied);
  if (!replies.length) return false;
  const deltas = replies.map((reply) => {
    const afterReply = E.applyMove(applied, reply).state;
    return actorCaptureMoveCount(afterReply, actor) - rootCount;
  });
  const worst = Math.min(...deltas);
  return signToken(worst) === "0";
}
function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}
function evaluator(state, player) { return AI.evaluateWithProfile(state, player, "bao"); }
function orderedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function qsearch(state, alpha, beta, player, ply, remaining) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = orderedMoves(state).filter((move) => move.type === "capture");
  if (!captures.length || remaining === 0) return evaluator(state, player);
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of captures) {
    const value = qsearch(E.applyMove(state, move).state, alpha, beta, player, ply + 1, remaining - 1);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}
function alphabeta(state, depth, alpha, beta, player, ply) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return qsearch(state, alpha, beta, player, ply, 1);
  const moves = orderedMoves(state);
  if (!moves.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of moves) {
    const value = alphabeta(E.applyMove(state, move).state, depth - 1, alpha, beta, player, ply + 1);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}
function analyzeDepth(state, depth) {
  const player = state.player;
  const rows = orderedMoves(state).map((move) => ({
    moveKey: moveKey(move),
    score: alphabeta(E.applyMove(state, move).state, depth - 1, -Infinity, Infinity, player, 1),
  }));
  const ranked = rows.slice().sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSetMoveKeys = ranked.filter((row) => row.score === bestScore).map((row) => row.moveKey).sort();
  return {
    depth,
    bestScore,
    topSetMoveKeys,
    candidates: ranked.map((row) => ({
      moveKey: row.moveKey,
      score: row.score,
      scoreRank: 1 + ranked.filter((other) => other.score > row.score).length,
      isTopSet: row.score === bestScore,
    })).sort((a, b) => a.moveKey.localeCompare(b.moveKey)),
  };
}
function analyzeFixture(state, candidate) {
  const before = stableStringify(state);
  const legalMoves = orderedMoves(state);
  const preconditionHolds = rootPreconditionHolds(state, candidate);
  const matches = matchingMoves(state, candidate);
  const eligible = preconditionHolds && matches.length > 0;
  const base = {
    semantics: SEMANTICS,
    rawIdentityHash: rawIdentityHash(state),
    phase: state.phase,
    player: state.player,
    legalMoveKeys: legalMoves.map(moveKey),
    preconditionHolds,
    matchingMoveKeys: matches.map(moveKey),
    eligible,
  };
  if (!eligible) {
    if (stableStringify(state) !== before) throw new Error("Independent analysis mutated ineligible fixture");
    return base;
  }
  const move = matches[0];
  const successor = E.applyMove(state, move).state;
  const result = {
    ...base,
    candidateMoveKey: moveKey(move),
    successorRawIdentityHash: rawIdentityHash(successor),
    structuralSuccess: structuralSuccess(state, move, candidate),
    pairedPreconditionHolds: rootPreconditionHolds(state, { ...candidate, preconditions: candidate.pairedDiagnosticDefinition.preconditions }),
    pairedConsequenceHolds: pairedConsequenceHolds(state, move, candidate),
    search: [1, 2, 3].map((depth) => analyzeDepth(state, depth)),
  };
  if (stableStringify(state) !== before) throw new Error("Independent analysis mutated fixture");
  return result;
}

module.exports = {
  SEMANTICS, analyzeFixture, moveKey, rawIdentityHash, rawIdentityObject, stableStringify,
};
