"use strict";

const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const Search = require("./position-complexity-search-diagnostic.js");
const Tactical = require("./tactical-motif-features.js");

const SCHEMA_VERSION = "1.0.0";
const PRIMARY_DEPTH = 3;
const PRIMARY_SEARCH_OPTIONS = Object.freeze({
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
});

const DOMAIN_ORDER = Object.freeze({
  "root-loss-mate-domain": 0,
  "ordinary-evaluation-domain": 1,
  "root-win-mate-domain": 2,
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function configuredOptions(options = {}) {
  return {
    ...PRIMARY_SEARCH_OPTIONS,
    ...options,
  };
}

function median(values) {
  if (!Array.isArray(values) || !values.length) return null;
  const ordered = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[middle]
    : (ordered[middle - 1] + ordered[middle]) / 2;
}

function domainRank(domain) {
  if (!Object.hasOwn(DOMAIN_ORDER, domain)) throw new Error(`Unknown score domain: ${domain}`);
  return DOMAIN_ORDER[domain];
}

function lossCategory(bestDomain, candidateDomain, rawRegret) {
  if (rawRegret === 0) return "none";
  if (bestDomain === candidateDomain) {
    if (bestDomain === "ordinary-evaluation-domain") return "ordinary-regret";
    if (bestDomain === "root-win-mate-domain") return "win-mate-distance-regret";
    return "loss-mate-distance-regret";
  }
  if (bestDomain === "root-win-mate-domain" && candidateDomain === "ordinary-evaluation-domain") {
    return "win-mate-to-ordinary";
  }
  if (bestDomain === "root-win-mate-domain" && candidateDomain === "root-loss-mate-domain") {
    return "win-mate-to-loss-mate";
  }
  if (bestDomain === "ordinary-evaluation-domain" && candidateDomain === "root-loss-mate-domain") {
    return "ordinary-to-loss-mate";
  }
  throw new Error(`Unexpected score-domain ordering: ${bestDomain} -> ${candidateDomain}`);
}

function decisionLoss(bestScore, candidateScore) {
  if (!Number.isFinite(bestScore) || !Number.isFinite(candidateScore)) {
    throw new Error("Decision-loss scores must be finite");
  }
  if (candidateScore > bestScore) {
    throw new Error(`Candidate score exceeds declared best score: ${candidateScore} > ${bestScore}`);
  }
  const bestDomain = Search.scoreClass(bestScore);
  const candidateDomain = Search.scoreClass(candidateScore);
  const rawRegret = bestScore - candidateScore;
  const sameDomain = bestDomain === candidateDomain;
  const domainDrop = domainRank(bestDomain) - domainRank(candidateDomain);
  if (domainDrop < 0) throw new Error("Candidate cannot occupy a better score domain than the best move");
  return {
    bestScore,
    candidateScore,
    rawRegret,
    bestDomain,
    candidateDomain,
    sameDomain,
    domainDrop,
    category: lossCategory(bestDomain, candidateDomain, rawRegret),
    ordinaryRegret: sameDomain && bestDomain === "ordinary-evaluation-domain" ? rawRegret : null,
    mateDistanceRegret: sameDomain && bestDomain !== "ordinary-evaluation-domain" ? rawRegret : null,
    crossDomain: !sameDomain,
  };
}

function analyzeRootDecisionLoss(state, depth = PRIMARY_DEPTH, options = {}) {
  if (!state || state.winner !== null) throw new Error("Decision-loss analysis requires a nonterminal root");
  const before = JSON.stringify(state);
  const diagnostic = Search.analyzeRootCandidates(state, depth, configuredOptions(options));
  const scores = diagnostic.candidates.map(({ score }) => score);
  const stateMedianScore = median(scores);
  const minimumScore = Math.min(...scores);
  const minimumCount = scores.filter((score) => score === minimumScore).length;
  const denominator = Math.max(1, diagnostic.legalMoveCount - 1);
  const candidates = diagnostic.candidates.map((candidate) => {
    const loss = decisionLoss(diagnostic.bestScore, candidate.score);
    return {
      ...candidate,
      decisionLoss: loss,
      scoreMinusStateMedian: candidate.score - stateMedianScore,
      isBelowStateMedian: candidate.score < stateMedianScore,
      isAtOrBelowStateMedian: candidate.score <= stateMedianScore,
      isUniqueWorst: candidate.score === minimumScore && minimumCount === 1,
      normalizedRankLoss: diagnostic.legalMoveCount <= 1
        ? 0
        : (candidate.scoreRank - 1) / denominator,
    };
  });
  if (JSON.stringify(state) !== before) throw new Error("Decision-loss analysis mutated root state");
  return {
    ...diagnostic,
    schemaVersion: SCHEMA_VERSION,
    primaryReference: depth === PRIMARY_DEPTH,
    stateMedianScore,
    minimumScore,
    candidates,
  };
}

function staticPostMoveEvaluation(state, move, options = {}) {
  if (!state || state.winner !== null) throw new Error("Static post-move evaluation requires a nonterminal root");
  const actor = state.player;
  const profile = options.evaluationProfile || "bao";
  const applied = E.applyMove(state, move);
  return {
    actor,
    profile,
    moveKey: AI.moveKey(move),
    score: AI.evaluateWithProfile(applied.state, actor, profile),
    terminal: applied.state.winner !== null,
    winnerRelativeToActor: applied.state.winner === null
      ? null
      : applied.state.winner === actor ? "actor" : "opponent",
  };
}

function summarizeCandidate(state, move, depth = PRIMARY_DEPTH, options = {}) {
  const before = JSON.stringify(state);
  const moveKey = AI.moveKey(move);
  const root = analyzeRootDecisionLoss(state, depth, options);
  const candidate = root.candidates.find((item) => item.moveKey === moveKey);
  if (!candidate) throw new Error(`Move is not an exact legal root moveVariant: ${moveKey}`);
  const result = {
    schemaVersion: SCHEMA_VERSION,
    actor: state.player,
    phase: state.phase,
    move: clone(move),
    moveKey,
    root: {
      searchSemantics: root.searchSemantics,
      depth: root.depth,
      options: root.options,
      legalMoveCount: root.legalMoveCount,
      bestScore: root.bestScore,
      bestScoreClass: root.bestScoreClass,
      stateMedianScore: root.stateMedianScore,
      topSetMoveKeys: root.topSetMoveKeys,
    },
    candidate,
    staticPostMove: staticPostMoveEvaluation(state, move, options),
    transition: Tactical.summarizeMoveTransition(state, move),
    responseEnvelope: Tactical.summarizeReplyEnvelope(state, move),
  };
  if (JSON.stringify(state) !== before) throw new Error("Candidate summary mutated root state");
  return result;
}

function analyzeDepthAgreement(state, depths = [1, 2, 3], options = {}) {
  return Search.analyzeDepthTrace(state, depths, configuredOptions(options));
}

module.exports = {
  DOMAIN_ORDER,
  PRIMARY_DEPTH,
  PRIMARY_SEARCH_OPTIONS,
  SCHEMA_VERSION,
  analyzeDepthAgreement,
  analyzeRootDecisionLoss,
  configuredOptions,
  decisionLoss,
  domainRank,
  median,
  staticPostMoveEvaluation,
  summarizeCandidate,
};
