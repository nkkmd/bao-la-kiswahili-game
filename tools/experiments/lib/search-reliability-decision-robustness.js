"use strict";

const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const WIN = 1_000_000;
const SCHEMA_VERSION = "1.0.0";
const SEARCH_SEMANTICS = "srdr-controlled-root-candidates/complete-iteration-budget/canonical-pv/v1";

class BudgetExhausted extends Error {
  constructor() {
    super("Search node budget exhausted");
    this.name = "BudgetExhausted";
  }
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function integer(value, label, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) throw new Error(`Invalid ${label}: ${value}`);
  return value;
}

function canonicalMoveKey(move) {
  return AI.moveKey(move);
}

function rawIdentityObject(state) {
  if (!state) throw new Error("state is required");
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

function rawIdentityKey(state) {
  return JSON.stringify(rawIdentityObject(state));
}

function scoreClass(score) {
  if (score > WIN / 2) return "root-win-mate-domain";
  if (score < -WIN / 2) return "root-loss-mate-domain";
  return "ordinary-evaluation-domain";
}

function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}

function evaluationFunction(options = {}) {
  const profile = options.evaluationProfile || "bao";
  if (options.evaluationWeights || options.evaluationAdjustments) {
    throw new Error("SRDR controlled search supports frozen named evaluator profiles only");
  }
  if (profile === "legacy") return (state, player) => AI.legacyEvaluate(state, player);
  if (!["bao", "bao-v2"].includes(profile)) throw new Error(`Unsupported evaluationProfile: ${profile}`);
  return (state, player) => AI.evaluateWithProfile(state, player, profile);
}

function searchOptions(options = {}) {
  const legalMoveOrdering = options.legalMoveOrdering || "engine";
  if (!["engine", "canonical", "reverse-canonical"].includes(legalMoveOrdering)) {
    throw new Error(`Unsupported legalMoveOrdering: ${legalMoveOrdering}`);
  }
  return {
    evaluationProfile: options.evaluationProfile || "bao",
    quiescenceDepth: integer(options.quiescenceDepth ?? 1, "quiescenceDepth", 0),
    orderQuiescenceCaptures: Boolean(options.orderQuiescenceCaptures),
    legalMoveOrdering,
  };
}

function orderedMoves(state, ordering) {
  const moves = E.moveVariants(state).slice();
  if (ordering === "canonical") moves.sort((a, b) => canonicalMoveKey(a).localeCompare(canonicalMoveKey(b)));
  else if (ordering === "reverse-canonical") moves.sort((a, b) => canonicalMoveKey(b).localeCompare(canonicalMoveKey(a)));
  return moves;
}

function captureCount(events) {
  return events.filter(({ kind }) => kind === "capture")
    .reduce((sum, event) => sum + (event.count || 0), 0);
}

function orderedCaptures(state, configured) {
  const captures = orderedMoves(state, configured.legalMoveOrdering)
    .filter(({ type }) => type === "capture");
  if (!configured.orderQuiescenceCaptures) return captures;
  return captures.map((move) => {
    const applied = E.applyMove(state, move);
    return {
      move,
      immediateWin: applied.state.winner === state.player ? 1 : 0,
      captured: captureCount(applied.events),
    };
  }).sort((a, b) => b.immediateWin - a.immediateWin
    || b.captured - a.captured
    || canonicalMoveKey(a.move).localeCompare(canonicalMoveKey(b.move)))
    .map(({ move }) => move);
}

function emptyCounters() {
  return {
    nodes: 0,
    nominalNodes: 0,
    quiescenceNodes: 0,
    evaluations: 0,
    cutoffs: 0,
  };
}

function makeBudget(limit = null) {
  if (limit === null || limit === undefined) return { limit: null, used: 0, exhausted: false };
  return { limit: integer(limit, "nodeBudget", 1), used: 0, exhausted: false };
}

function consumeNode(budget, counters, kind) {
  if (budget.limit !== null && budget.used >= budget.limit) {
    budget.exhausted = true;
    throw new BudgetExhausted();
  }
  budget.used += 1;
  counters.nodes += 1;
  if (kind === "nominal") counters.nominalNodes += 1;
  else if (kind === "quiescence") counters.quiescenceNodes += 1;
  else throw new Error(`Unknown node kind: ${kind}`);
}

function addCounters(target, source) {
  for (const key of Object.keys(target)) target[key] += source[key];
  return target;
}

function countedEvaluate(state, player, evaluator, counters) {
  counters.evaluations += 1;
  return evaluator(state, player);
}

function quiescence(state, alpha, beta, player, counters, evaluator, configured, ply, remaining, budget) {
  consumeNode(budget, counters, "quiescence");
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = orderedCaptures(state, configured);
  if (!captures.length || remaining === 0) return countedEvaluate(state, player, evaluator, counters);
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of captures) {
    const next = E.applyMove(state, move).state;
    const value = quiescence(
      next, alpha, beta, player, counters, evaluator, configured, ply + 1, remaining - 1, budget,
    );
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) {
      counters.cutoffs += 1;
      break;
    }
  }
  return best;
}

function alphaBeta(state, depth, alpha, beta, player, counters, evaluator, configured, ply, budget) {
  consumeNode(budget, counters, "nominal");
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) {
    return quiescence(
      state, alpha, beta, player, counters, evaluator, configured, ply,
      configured.quiescenceDepth, budget,
    );
  }
  const moves = orderedMoves(state, configured.legalMoveOrdering);
  if (!moves.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of moves) {
    const next = E.applyMove(state, move).state;
    const value = alphaBeta(
      next, depth - 1, alpha, beta, player, counters, evaluator, configured, ply + 1, budget,
    );
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) {
      counters.cutoffs += 1;
      break;
    }
  }
  return best;
}

function summarizeCandidates(candidates) {
  const ranked = candidates.slice().sort((a, b) => b.score - a.score
    || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSetMoveKeys = ranked.filter(({ score }) => score === bestScore)
    .map(({ moveKey }) => moveKey).sort();
  const secondBestScore = ranked.length >= 2 ? ranked[1].score : null;
  return {
    candidates: ranked.map((candidate, index) => ({
      ...candidate,
      ordinal: index + 1,
      scoreRank: 1 + ranked.filter(({ score }) => score > candidate.score).length,
      isTopSet: candidate.score === bestScore,
    })),
    bestScore,
    bestScoreClass: scoreClass(bestScore),
    secondBestScore,
    bestSecondGap: secondBestScore === null ? null : bestScore - secondBestScore,
    topSetMoveKeys,
    topSetSize: topSetMoveKeys.length,
    canonicalBestMoveKey: topSetMoveKeys[0],
  };
}

function analyzeDepthWithBudget(state, depth, options = {}, budget = makeBudget(null)) {
  integer(depth, "depth", 1);
  if (!state || state.winner !== null) throw new Error("Controlled search requires a nonterminal state");
  const before = JSON.stringify(state);
  const configured = searchOptions(options);
  const evaluator = evaluationFunction(configured);
  const player = state.player;
  const legalMoves = orderedMoves(state, "canonical");
  if (!legalMoves.length) throw new Error("Controlled search requires at least one legal root move");
  const candidates = [];
  const aggregateCounters = emptyCounters();
  for (const move of legalMoves) {
    const applied = E.applyMove(state, move);
    const counters = emptyCounters();
    const score = alphaBeta(
      applied.state, depth - 1, -Infinity, Infinity, player, counters, evaluator, configured, 1, budget,
    );
    addCounters(aggregateCounters, counters);
    candidates.push({
      move: cloneJson(move),
      moveKey: canonicalMoveKey(move),
      score,
      scoreClass: scoreClass(score),
      immediateTerminal: applied.state.winner === null ? null : {
        winner: applied.state.winner,
        reason: applied.state.reason || "",
      },
      counters,
    });
  }
  const summary = summarizeCandidates(candidates);
  if (JSON.stringify(state) !== before) throw new Error("Controlled search mutated source state");
  return {
    schemaVersion: SCHEMA_VERSION,
    searchSemantics: SEARCH_SEMANTICS,
    rawIdentityKey: rawIdentityKey(state),
    player,
    phase: state.phase,
    depth,
    options: configured,
    legalMoveCount: legalMoves.length,
    ...summary,
    aggregateCounters,
    cumulativeBudgetUsed: budget.used,
  };
}

function exhaustiveQuiescenceValue(state, player, evaluator, configured, ply, remaining) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = orderedMoves(state, "canonical").filter(({ type }) => type === "capture");
  if (!captures.length || remaining === 0) return evaluator(state, player);
  const values = captures.map((move) => exhaustiveQuiescenceValue(
    E.applyMove(state, move).state, player, evaluator, configured, ply + 1, remaining - 1,
  ));
  return state.player === player ? Math.max(...values) : Math.min(...values);
}

function canonicalPvTail(state, depth, player, evaluator, configured, ply) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null || depth === 0) return { score: depth === 0 && terminal === null
    ? exhaustiveQuiescenceValue(state, player, evaluator, configured, ply, configured.quiescenceDepth)
    : terminal, moveKeys: [] };
  const moves = orderedMoves(state, "canonical");
  if (!moves.length) return {
    score: state.player === player ? -WIN + ply : WIN - ply,
    moveKeys: [],
  };
  const maximizing = state.player === player;
  let selected = null;
  for (const move of moves) {
    const child = canonicalPvTail(E.applyMove(state, move).state, depth - 1, player, evaluator, configured, ply + 1);
    const candidate = { score: child.score, moveKey: canonicalMoveKey(move), tail: child.moveKeys };
    if (!selected
      || (maximizing && candidate.score > selected.score)
      || (!maximizing && candidate.score < selected.score)
      || (candidate.score === selected.score && candidate.moveKey.localeCompare(selected.moveKey) < 0)) {
      selected = candidate;
    }
  }
  return { score: selected.score, moveKeys: [selected.moveKey, ...selected.tail] };
}

function reconstructCanonicalPv(state, completedResult) {
  if (!completedResult || completedResult.depth < 1) return null;
  const configured = searchOptions(completedResult.options);
  const evaluator = evaluationFunction(configured);
  const rootMove = orderedMoves(state, "canonical")
    .find((move) => canonicalMoveKey(move) === completedResult.canonicalBestMoveKey);
  if (!rootMove) throw new Error("Canonical best move missing from current legal root set");
  const rootApplied = E.applyMove(state, rootMove).state;
  const tail = canonicalPvTail(rootApplied, completedResult.depth - 1, state.player, evaluator, configured, 1);
  const rootCandidate = completedResult.candidates.find(({ moveKey }) => moveKey === completedResult.canonicalBestMoveKey);
  if (!rootCandidate || rootCandidate.score !== tail.score) {
    throw new Error("Canonical PV reconstruction score does not match selected root candidate score");
  }
  return {
    semantics: "canonical-exact-nominal-pv/quiescence-score-only/v1",
    moveKeys: [completedResult.canonicalBestMoveKey, ...tail.moveKeys],
    nominalPlyLength: 1 + tail.moveKeys.length,
    score: tail.score,
  };
}

function analyzeExactCondition(state, depth, options = {}) {
  const budget = makeBudget(null);
  const result = analyzeDepthWithBudget(state, depth, options, budget);
  return {
    mode: "fixed-depth-exact-complete-root",
    requestedDepth: depth,
    completedDepth: depth,
    nodeBudget: null,
    nodeBudgetUsed: budget.used,
    budgetExhausted: false,
    result,
    principalVariation: reconstructCanonicalPv(state, result),
  };
}

function analyzeBudgetCondition(state, maxDepth, nodeBudget, options = {}) {
  integer(maxDepth, "maxDepth", 1);
  integer(nodeBudget, "nodeBudget", 1);
  const budget = makeBudget(nodeBudget);
  const completed = [];
  let attemptedDepth = 0;
  let abortedDepth = null;
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    attemptedDepth = depth;
    try {
      const result = analyzeDepthWithBudget(state, depth, options, budget);
      completed.push({ result, budgetUsedAtCompletion: budget.used });
    } catch (error) {
      if (!(error instanceof BudgetExhausted)) throw error;
      abortedDepth = depth;
      break;
    }
  }
  const latest = completed.length ? completed[completed.length - 1] : null;
  return {
    mode: "node-budgeted-iterative-deepening-last-complete-root-iteration",
    requestedMaxDepth: maxDepth,
    nodeBudget,
    nodeBudgetUsed: budget.used,
    budgetExhausted: budget.exhausted,
    attemptedDepth,
    abortedDepth,
    completedDepth: latest ? latest.result.depth : 0,
    completedDepths: completed.map(({ result }) => result.depth),
    budgetUsedAtCompletedDepths: completed.map(({ result, budgetUsedAtCompletion }) => ({
      depth: result.depth,
      budgetUsed: budgetUsedAtCompletion,
    })),
    result: latest ? latest.result : null,
    principalVariation: latest ? reconstructCanonicalPv(state, latest.result) : null,
    estimable: Boolean(latest),
    nonEstimableReason: latest ? null : "NODE_BUDGET_BELOW_COMPLETE_DEPTH1_ROOT_ITERATION",
  };
}

module.exports = {
  BudgetExhausted,
  SCHEMA_VERSION,
  SEARCH_SEMANTICS,
  WIN,
  analyzeBudgetCondition,
  analyzeExactCondition,
  canonicalMoveKey,
  rawIdentityKey,
  rawIdentityObject,
  reconstructCanonicalPv,
  scoreClass,
  searchOptions,
};
