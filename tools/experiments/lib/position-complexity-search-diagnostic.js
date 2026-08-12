"use strict";

const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const WIN = 1_000_000;
const SCHEMA_VERSION = "1.0.0";
const SEARCH_SEMANTICS = "exact-full-window-root-candidates/phase2-value-semantics/v1";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function canonicalMoveKey(move) {
  return AI.moveKey(move);
}

function integer(value, label, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) throw new Error(`Invalid ${label}: ${value}`);
  return value;
}

function bool(value, fallback = false) {
  return value === undefined ? fallback : Boolean(value);
}

function evaluationFunction(options = {}) {
  const profile = options.evaluationProfile || "bao";
  if (options.evaluationWeights || options.evaluationAdjustments) {
    throw new Error("Stage 0 diagnostic currently supports frozen named evaluator profiles only");
  }
  if (profile === "legacy") return (state, player) => AI.legacyEvaluate(state, player);
  if (!["bao", "bao-v2"].includes(profile)) throw new Error(`Unsupported evaluationProfile: ${profile}`);
  return (state, player) => AI.evaluateWithProfile(state, player, profile);
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

function captureCount(events) {
  return events.filter(({ kind }) => kind === "capture")
    .reduce((total, event) => total + (event.count || 0), 0);
}

function emptyCounters() {
  return {
    nodes: 0,
    quiescenceNodes: 0,
    cutoffs: 0,
    evaluations: 0,
  };
}

function countedEvaluate(state, player, evaluator, counters) {
  counters.evaluations += 1;
  return evaluator(state, player);
}

function quiescence(
  state, alpha, beta, player, counters, evaluator, ply, remaining,
  orderCaptures = false,
) {
  counters.nodes += 1;
  counters.quiescenceNodes += 1;
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter(({ type }) => type === "capture");
  if (!captures.length || remaining === 0) return countedEvaluate(state, player, evaluator, counters);
  const maximizing = state.player === player;
  const choices = orderCaptures
    ? captures.map((move) => {
      const result = E.applyMove(state, move);
      return {
        move,
        next: result.state,
        immediateWin: result.state.winner === state.player ? 1 : 0,
        captured: captureCount(result.events),
      };
    }).sort((a, b) => b.immediateWin - a.immediateWin
      || b.captured - a.captured
      || canonicalMoveKey(a.move).localeCompare(canonicalMoveKey(b.move)))
    : captures.map((move) => ({ move, next: null }));
  let best = maximizing ? -Infinity : Infinity;
  for (const choice of choices) {
    const next = choice.next || E.applyMove(state, choice.move).state;
    const value = quiescence(
      next, alpha, beta, player, counters, evaluator, ply + 1, remaining - 1,
      orderCaptures,
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

function exactSearch(state, depth, alpha, beta, player, counters, evaluator, options, ply) {
  counters.nodes += 1;
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) {
    return quiescence(
      state, alpha, beta, player, counters, evaluator, ply,
      options.quiescenceDepth, options.orderQuiescenceCaptures,
    );
  }
  const choices = E.moveVariants(state);
  if (!choices.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of choices) {
    const next = E.applyMove(state, move).state;
    const value = exactSearch(
      next, depth - 1, alpha, beta, player, counters, evaluator, options, ply + 1,
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

function diagnosticOptions(options = {}) {
  const quiescenceDepth = integer(options.quiescenceDepth ?? 1, "quiescenceDepth", 0);
  return {
    evaluationProfile: options.evaluationProfile || "bao",
    quiescenceDepth,
    orderQuiescenceCaptures: bool(options.orderQuiescenceCaptures, false),
  };
}

function sumCounters(candidates) {
  return candidates.reduce((total, candidate) => {
    for (const key of Object.keys(total)) total[key] += candidate.counters[key];
    return total;
  }, emptyCounters());
}

function analyzeRootCandidates(state, depth, options = {}) {
  integer(depth, "depth", 1);
  if (!state || state.winner !== null) throw new Error("Diagnostic requires a nonterminal state");
  const before = JSON.stringify(state);
  const configured = diagnosticOptions(options);
  const evaluator = evaluationFunction(configured);
  const player = state.player;
  const legalMoves = E.moveVariants(state);
  if (!legalMoves.length) throw new Error("Diagnostic requires at least one legal root move");

  const candidates = legalMoves.map((move) => {
    const applied = E.applyMove(state, move);
    const counters = emptyCounters();
    const score = exactSearch(
      applied.state, depth - 1, -Infinity, Infinity, player, counters, evaluator, configured, 1,
    );
    return {
      move: cloneJson(move),
      moveKey: canonicalMoveKey(move),
      score,
      scoreClass: scoreClass(score),
      immediateTerminal: applied.state.winner === null ? null : {
        winner: applied.state.winner,
        reason: applied.state.reason || "",
      },
      counters,
    };
  });

  const ranked = candidates.slice().sort((a, b) => b.score - a.score
    || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSetMoveKeys = ranked.filter(({ score }) => score === bestScore)
    .map(({ moveKey }) => moveKey).sort();
  const secondBestScore = ranked.length >= 2 ? ranked[1].score : null;
  const bestSecondGap = secondBestScore === null ? null : bestScore - secondBestScore;
  const rankedCandidates = ranked.map((candidate, index) => ({
    ...candidate,
    ordinal: index + 1,
    scoreRank: 1 + ranked.filter(({ score }) => score > candidate.score).length,
    isTopSet: candidate.score === bestScore,
  }));

  if (JSON.stringify(state) !== before) throw new Error("Search diagnostic mutated source state");
  return {
    schemaVersion: SCHEMA_VERSION,
    searchSemantics: SEARCH_SEMANTICS,
    stateKey: AI.stateKey(state),
    player,
    phase: state.phase,
    depth,
    options: configured,
    legalMoveCount: legalMoves.length,
    bestScore,
    bestScoreClass: scoreClass(bestScore),
    secondBestScore,
    bestSecondGap,
    topSetMoveKeys,
    topSetSize: topSetMoveKeys.length,
    canonicalBestMoveKey: topSetMoveKeys[0],
    candidates: rankedCandidates,
    aggregateCounters: sumCounters(rankedCandidates),
  };
}

function sign(value) {
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

function analyzeDepthTrace(state, depths = [1, 2, 3], options = {}) {
  if (!Array.isArray(depths) || !depths.length) throw new Error("depths must be a non-empty array");
  const orderedDepths = [...new Set(depths.map((depth) => integer(depth, "depth", 1)))].sort((a, b) => a - b);
  const results = orderedDepths.map((depth) => analyzeRootCandidates(state, depth, options));
  const transitions = [];
  for (let index = 1; index < results.length; index += 1) {
    const from = results[index - 1];
    const to = results[index];
    const overlap = from.topSetMoveKeys.filter((key) => to.topSetMoveKeys.includes(key)).sort();
    transitions.push({
      fromDepth: from.depth,
      toDepth: to.depth,
      topSetOverlap: overlap,
      topSetDisjoint: overlap.length === 0,
      canonicalBestChanged: from.canonicalBestMoveKey !== to.canonicalBestMoveKey,
      bestScoreDelta: to.bestScore - from.bestScore,
      bestScoreSignReversal: sign(from.bestScore) !== 0 && sign(to.bestScore) !== 0
        && sign(from.bestScore) !== sign(to.bestScore),
    });
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    searchSemantics: SEARCH_SEMANTICS,
    stateKey: AI.stateKey(state),
    player: state.player,
    phase: state.phase,
    depths: orderedDepths,
    results,
    transitions,
  };
}

module.exports = {
  SCHEMA_VERSION,
  SEARCH_SEMANTICS,
  WIN,
  analyzeDepthTrace,
  analyzeRootCandidates,
  diagnosticOptions,
  scoreClass,
};
