"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const Raw = require("./ssgtc-representation-production.js");

const WIN = 1_000_000;
const STAGE_SALT = "PCEM-S0-TECHNICAL-2026-08-25-v1";
const SEARCH_SEMANTICS = "pcem-exact-full-window-root-candidates/bao/q0/v1";
const POLICY_IDS = Object.freeze([
  "P_REFERENCE_D2_BEST",
  "P_MEDIUM_D1_TOP3",
  "P_SHALLOW_UNIFORM",
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(text) {
  return crypto.createHash("sha256").update(String(text), "utf8").digest("hex");
}

function canonicalHash(value) {
  return sha256(Raw.stableStringify(value));
}

function normalizeMove(move) {
  const out = {};
  for (const field of ["type", "phase", "row", "index", "direction", "side", "houseChoice"]) {
    if (move[field] !== undefined) out[field] = move[field];
  }
  if (move.houseTwo === true) out.houseTwo = true;
  return out;
}

function assertNonterminal(state) {
  Raw.assertStudyState(state);
  if (state.winner !== null) throw new Error("Expected nonterminal state");
}

function exactLegalMoves(state) {
  assertNonterminal(state);
  return E.moveVariants(state)
    .map(normalizeMove)
    .sort((a, b) => Raw.moveKey(a).localeCompare(Raw.moveKey(b)));
}

function exactMove(state, moveLike) {
  const key = Raw.moveKey(moveLike);
  const move = exactLegalMoves(state).find((candidate) => Raw.moveKey(candidate) === key);
  if (!move) throw new Error(`Exact legal move not found: ${key}`);
  return move;
}

function applyExactMove(state, moveLike) {
  Raw.assertStudyState(state);
  const move = exactMove(state, moveLike);
  const applied = E.applyMove(state, move);
  Raw.assertStudyState(applied.state);
  return { move, state: applied.state, events: applied.events || [] };
}

function terminalScore(state, actor, ply) {
  if (state.winner === null) return null;
  return state.winner === actor ? WIN - ply : -WIN + ply;
}

function searchValue(state, depth, actor, ply, counters) {
  Raw.assertStudyState(state);
  counters.nodes += 1;
  const terminal = terminalScore(state, actor, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) {
    counters.evaluations += 1;
    return AI.evaluateWithProfile(state, actor, "bao");
  }
  const legal = exactLegalMoves(state);
  if (!legal.length) return state.player === actor ? -WIN + ply : WIN - ply;
  const maximizing = state.player === actor;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of legal) {
    const child = applyExactMove(state, move).state;
    const value = searchValue(child, depth - 1, actor, ply + 1, counters);
    if (maximizing) best = Math.max(best, value);
    else best = Math.min(best, value);
  }
  return best;
}

function referenceSearch(state, depth) {
  assertNonterminal(state);
  if (!Number.isInteger(depth) || depth < 1) throw new Error(`Invalid reference depth: ${depth}`);
  const actor = state.player;
  const candidates = exactLegalMoves(state).map((move) => {
    const child = applyExactMove(state, move).state;
    const counters = { nodes: 0, evaluations: 0 };
    const score = searchValue(child, depth - 1, actor, 1, counters);
    return {
      move,
      moveKey: Raw.moveKey(move),
      score,
      counters,
    };
  });
  const ranked = candidates.slice().sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSetMoveKeys = ranked.filter((row) => row.score === bestScore).map((row) => row.moveKey).sort();
  const rows = ranked.map((row, index) => ({
    ...row,
    ordinal: index + 1,
    scoreRank: 1 + ranked.filter((other) => other.score > row.score).length,
    isTopSet: row.score === bestScore,
  }));
  return {
    searchSemantics: SEARCH_SEMANTICS,
    rawStateKey: Raw.stateKey(state),
    actor,
    phase: state.phase,
    depth,
    legalMoveCount: rows.length,
    bestScore,
    topSetMoveKeys,
    canonicalBestMoveKey: topSetMoveKeys[0],
    candidates: rows,
    aggregateCounters: rows.reduce((acc, row) => ({
      nodes: acc.nodes + row.counters.nodes,
      evaluations: acc.evaluations + row.counters.evaluations,
    }), { nodes: 0, evaluations: 0 }),
  };
}

function replyAudit(root, rootMove, referenceDepth = 2) {
  assertNonterminal(root);
  const applied = applyExactMove(root, rootMove);
  if (applied.state.winner !== null) {
    return {
      rootMoveKey: Raw.moveKey(applied.move),
      successorRawStateKey: Raw.stateKey(applied.state),
      terminalAfterRootMove: true,
      legalReplyCount: 0,
      legalReplyMoveKeys: [],
      referenceBestReplyMoveKeys: [],
      referenceReplyTable: null,
    };
  }
  const replies = exactLegalMoves(applied.state);
  const reference = referenceSearch(applied.state, referenceDepth);
  return {
    rootMoveKey: Raw.moveKey(applied.move),
    successorRawStateKey: Raw.stateKey(applied.state),
    terminalAfterRootMove: false,
    legalReplyCount: replies.length,
    legalReplyMoveKeys: replies.map(Raw.moveKey),
    referenceBestReplyMoveKeys: reference.topSetMoveKeys,
    referenceReplyTable: reference,
  };
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function deriveReplicateSeed32(root, replicateIndex, stageSalt = STAGE_SALT) {
  assertNonterminal(root);
  if (!Number.isInteger(replicateIndex) || replicateIndex < 0) throw new Error(`Invalid replicate index: ${replicateIndex}`);
  const material = `${stageSalt}|${Raw.stateKey(root)}|${root.player}|${replicateIndex}`;
  return Number.parseInt(sha256(material).slice(0, 8), 16) >>> 0;
}

function selectPolicyMove(state, policyId, random) {
  assertNonterminal(state);
  if (!POLICY_IDS.includes(policyId)) throw new Error(`Unknown policy: ${policyId}`);
  const legal = exactLegalMoves(state);
  if (policyId === "P_REFERENCE_D2_BEST") {
    const table = referenceSearch(state, 2);
    const move = legal.find((candidate) => Raw.moveKey(candidate) === table.canonicalBestMoveKey);
    return { move, moveKey: table.canonicalBestMoveKey, poolMoveKeys: table.topSetMoveKeys };
  }
  if (policyId === "P_MEDIUM_D1_TOP3") {
    const table = referenceSearch(state, 1);
    const pool = table.candidates.slice(0, Math.min(3, table.candidates.length));
    const index = Math.floor(random() * pool.length);
    const selected = pool[index];
    const move = legal.find((candidate) => Raw.moveKey(candidate) === selected.moveKey);
    return { move, moveKey: selected.moveKey, poolMoveKeys: pool.map((row) => row.moveKey) };
  }
  const index = Math.floor(random() * legal.length);
  const move = legal[index];
  return { move, moveKey: Raw.moveKey(move), poolMoveKeys: legal.map(Raw.moveKey) };
}

function encodeOutcome(state, rootActor, horizonExhausted) {
  Raw.assertStudyState(state);
  if (state.winner !== null) {
    return {
      category: state.winner === rootActor ? "ROOT_ACTOR_TERMINAL_WIN" : "ROOT_ACTOR_TERMINAL_LOSS",
      winner: state.winner,
      reason: state.reason || "",
    };
  }
  if (horizonExhausted) return { category: "ADMINISTRATIVE_HORIZON_EXHAUSTED", winner: null, reason: "post-root-horizon" };
  return { category: "TECHNICALLY_INVALID", winner: null, reason: "unaccounted-nonterminal" };
}

function runAsymmetricContinuation(root, rootMove, replicateIndex, options = {}) {
  assertNonterminal(root);
  const before = Raw.stableStringify(root);
  const rootActor = root.player;
  const actorPolicyId = options.actorPolicyId || "P_REFERENCE_D2_BEST";
  const opponentPolicyId = options.opponentPolicyId || "P_MEDIUM_D1_TOP3";
  const maxPostRootPlies = options.maxPostRootPlies ?? 24;
  const stageSalt = options.stageSalt || STAGE_SALT;
  if (!Number.isInteger(maxPostRootPlies) || maxPostRootPlies < 0) throw new Error(`Invalid horizon: ${maxPostRootPlies}`);
  const seed32 = deriveReplicateSeed32(root, replicateIndex, stageSalt);
  const random = seededRandom(seed32);
  const rootApplied = applyExactMove(root, rootMove);
  let state = rootApplied.state;
  const moves = [];
  for (let ply = 0; ply < maxPostRootPlies && state.winner === null; ply += 1) {
    const policyId = state.player === rootActor ? actorPolicyId : opponentPolicyId;
    const selection = selectPolicyMove(state, policyId, random);
    const applied = applyExactMove(state, selection.move);
    moves.push({
      postRootPly: ply,
      player: state.player,
      policyId,
      moveKey: selection.moveKey,
      poolMoveKeys: selection.poolMoveKeys,
      afterRawStateKey: Raw.stateKey(applied.state),
    });
    state = applied.state;
  }
  const outcome = encodeOutcome(state, rootActor, state.winner === null && moves.length >= maxPostRootPlies);
  const result = {
    schemaVersion: 1,
    stageSalt,
    rootRawStateKey: Raw.stateKey(root),
    rootActor,
    rootMoveKey: Raw.moveKey(rootApplied.move),
    replicateIndex,
    seed32,
    actorPolicyId,
    opponentPolicyId,
    maxPostRootPlies,
    moves,
    outcome,
    finalRawStateKey: Raw.stateKey(state),
  };
  result.recordSha256 = canonicalHash(result);
  if (Raw.stableStringify(root) !== before) throw new Error("Continuation mutated root");
  return result;
}

module.exports = {
  POLICY_IDS,
  SEARCH_SEMANTICS,
  STAGE_SALT,
  WIN,
  applyExactMove,
  canonicalHash,
  clone,
  deriveReplicateSeed32,
  exactLegalMoves,
  normalizeMove,
  referenceSearch,
  replyAudit,
  runAsymmetricContinuation,
  seededRandom,
  selectPolicyMove,
  sha256,
};
