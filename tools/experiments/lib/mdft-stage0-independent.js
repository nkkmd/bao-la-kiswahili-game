"use strict";

const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const WIN = 1_000_000;
const SEMANTICS = "mdft-stage0-independent/independent-alpha-beta-budget/v1";

class IndependentBudgetExhausted extends Error {}
function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}
function moveKey(move) {
  if (!move) return "";
  return [move.type, move.phase, move.row, move.index, move.direction, move.side, move.houseChoice, Boolean(move.houseTwo)].join(":");
}
function rawIdentityObject(state) {
  if (!state || !Array.isArray(state.pending)) throw new Error("Independent RAW identity requires explicit pending");
  return {
    pits: cloneJson(state.pits), reserve: cloneJson(state.reserve), houseOwned: cloneJson(state.houseOwned),
    player: state.player, phase: state.phase, winner: state.winner, pending: cloneJson(state.pending),
  };
}
function rawIdentityKey(state) { return stableStringify(rawIdentityObject(state)); }
function orderedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function scoreClass(score) {
  if (score > WIN / 2) return "root-win-mate-domain";
  if (score < -WIN / 2) return "root-loss-mate-domain";
  return "ordinary-evaluation-domain";
}
function terminalScore(state, rootPlayer, ply) {
  if (state.winner === null) return null;
  return state.winner === rootPlayer ? WIN - ply : -WIN + ply;
}
function budgetObject(limit) { return { limit, used: 0, exhausted: false }; }
function consume(budget) {
  if (budget.limit !== null && budget.used >= budget.limit) {
    budget.exhausted = true;
    throw new IndependentBudgetExhausted();
  }
  budget.used += 1;
}
function evaluator(state, player) { return AI.evaluateWithProfile(state, player, "bao"); }
function captures(state) { return orderedMoves(state).filter((move) => move.type === "capture"); }

function qsearch(state, alpha, beta, rootPlayer, ply, remaining, budget) {
  consume(budget);
  const terminal = terminalScore(state, rootPlayer, ply);
  if (terminal !== null) return terminal;
  const choices = captures(state);
  if (!choices.length || remaining === 0) return evaluator(state, rootPlayer);
  const maximizing = state.player === rootPlayer;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of choices) {
    const value = qsearch(E.applyMove(state, move).state, alpha, beta, rootPlayer, ply + 1, remaining - 1, budget);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}

function alphabeta(state, depth, alpha, beta, rootPlayer, ply, qdepth, budget) {
  consume(budget);
  const terminal = terminalScore(state, rootPlayer, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return qsearch(state, alpha, beta, rootPlayer, ply, qdepth, budget);
  const choices = orderedMoves(state);
  if (!choices.length) return state.player === rootPlayer ? -WIN + ply : WIN - ply;
  const maximizing = state.player === rootPlayer;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of choices) {
    const value = alphabeta(E.applyMove(state, move).state, depth - 1, alpha, beta, rootPlayer, ply + 1, qdepth, budget);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}

function summarize(candidates) {
  const ranked = candidates.slice().sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSetMoveKeys = ranked.filter((row) => row.score === bestScore).map((row) => row.moveKey).sort();
  return {
    candidates: ranked.map((row) => ({
      moveKey: row.moveKey, score: row.score, scoreClass: scoreClass(row.score),
      scoreRank: 1 + ranked.filter((other) => other.score > row.score).length,
      isTopSet: row.score === bestScore,
    })),
    bestScore, bestScoreClass: scoreClass(bestScore), topSetMoveKeys,
    canonicalBestMoveKey: topSetMoveKeys[0],
  };
}

function analyzeDepth(state, depth, qdepth, budget) {
  const rootPlayer = state.player;
  const candidates = [];
  for (const move of orderedMoves(state)) {
    const next = E.applyMove(state, move).state;
    const score = alphabeta(next, depth - 1, -Infinity, Infinity, rootPlayer, 1, qdepth, budget);
    candidates.push({ moveKey: moveKey(move), score });
  }
  return { depth, ...summarize(candidates) };
}

function exhaustiveQ(state, rootPlayer, ply, remaining) {
  const terminal = terminalScore(state, rootPlayer, ply);
  if (terminal !== null) return terminal;
  const choices = captures(state);
  if (!choices.length || remaining === 0) return evaluator(state, rootPlayer);
  const values = choices.map((move) => exhaustiveQ(E.applyMove(state, move).state, rootPlayer, ply + 1, remaining - 1));
  return state.player === rootPlayer ? Math.max(...values) : Math.min(...values);
}
function canonicalTail(state, depth, rootPlayer, ply, qdepth) {
  const terminal = terminalScore(state, rootPlayer, ply);
  if (terminal !== null || depth === 0) return {
    score: terminal !== null ? terminal : exhaustiveQ(state, rootPlayer, ply, qdepth), moveKeys: [],
  };
  const choices = orderedMoves(state);
  if (!choices.length) return { score: state.player === rootPlayer ? -WIN + ply : WIN - ply, moveKeys: [] };
  const maximizing = state.player === rootPlayer;
  let chosen = null;
  for (const move of choices) {
    const child = canonicalTail(E.applyMove(state, move).state, depth - 1, rootPlayer, ply + 1, qdepth);
    const candidate = { score: child.score, moveKey: moveKey(move), tail: child.moveKeys };
    if (!chosen || (maximizing ? candidate.score > chosen.score : candidate.score < chosen.score)
      || (candidate.score === chosen.score && candidate.moveKey.localeCompare(chosen.moveKey) < 0)) chosen = candidate;
  }
  return { score: chosen.score, moveKeys: [chosen.moveKey, ...chosen.tail] };
}
function principalVariation(state, result, qdepth) {
  const root = orderedMoves(state).find((move) => moveKey(move) === result.canonicalBestMoveKey);
  if (!root) throw new Error("Independent canonical best move missing");
  const tail = canonicalTail(E.applyMove(state, root).state, result.depth - 1, state.player, 1, qdepth);
  const selected = result.candidates.find((row) => row.moveKey === result.canonicalBestMoveKey);
  if (!selected || selected.score !== tail.score) throw new Error("Independent PV score mismatch");
  return { moveKeys: [result.canonicalBestMoveKey, ...tail.moveKeys], score: tail.score };
}

function normalizeCondition(mode, result, budget, nodeBudget, extra = {}) {
  return {
    mode, completedDepth: result ? result.depth : 0, nodeBudget, nodeBudgetUsed: budget.used,
    budgetExhausted: budget.exhausted, estimable: Boolean(result),
    nonEstimableReason: result ? null : "NODE_BUDGET_BELOW_COMPLETE_DEPTH1_ROOT_ITERATION",
    topSetMoveKeys: result ? result.topSetMoveKeys : null,
    canonicalBestMoveKey: result ? result.canonicalBestMoveKey : null,
    bestScore: result ? result.bestScore : null,
    bestScoreClass: result ? result.bestScoreClass : null,
    candidates: result ? result.candidates : null,
    principalVariation: result ? principalVariation(extra.state, result, extra.qdepth) : null,
  };
}
function exact(state, depth, qdepth) {
  const budget = budgetObject(null);
  const result = analyzeDepth(state, depth, qdepth, budget);
  return normalizeCondition("fixed-depth-exact-complete-root", result, budget, null, { state, qdepth });
}
function budgeted(state, maxDepth, limit, qdepth) {
  const budget = budgetObject(limit);
  let latest = null;
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    try { latest = analyzeDepth(state, depth, qdepth, budget); }
    catch (error) {
      if (!(error instanceof IndependentBudgetExhausted)) throw error;
      break;
    }
  }
  return normalizeCondition("node-budgeted-iterative-deepening-last-complete-root-iteration", latest, budget, limit, { state, qdepth });
}
function analyzeSearchGrid(state) {
  return {
    D1_Q1: exact(state, 1, 1), D2_Q1_BASE: exact(state, 2, 1), D3_Q1_REFERENCE: exact(state, 3, 1),
    D2_Q0: exact(state, 2, 0), D2_Q2: exact(state, 2, 2),
    B256_Q1_MAXD3: budgeted(state, 3, 256, 1), B1024_Q1_MAXD3: budgeted(state, 3, 1024, 1),
  };
}
function analyzeFixture(state, id) {
  const before = stableStringify(state);
  const output = { semantics: SEMANTICS, fixtureId: id, rawIdentityKey: rawIdentityKey(state), legalMoveKeys: orderedMoves(state).map(moveKey), searchGrid: analyzeSearchGrid(state) };
  if (stableStringify(state) !== before) throw new Error("Independent Stage 0 mutated fixture state");
  return output;
}

module.exports = { SEMANTICS, analyzeFixture, analyzeSearchGrid, moveKey, orderedMoves, rawIdentityKey, rawIdentityObject, stableStringify };
