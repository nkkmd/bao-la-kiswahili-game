"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const SRDR = require("./search-reliability-decision-robustness.js");

const SCHEMA_VERSION = "1.0.0";
const SEMANTICS = "mdft-stage0-production/search-grid-reference-consensus/v1";

function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : stableStringify(value)).digest("hex");
}

function rawIdentityObject(state) {
  if (!state || !Array.isArray(state.pending)) throw new Error("G2-08 RAW identity requires explicit pending");
  return {
    pits: cloneJson(state.pits), reserve: cloneJson(state.reserve), houseOwned: cloneJson(state.houseOwned),
    player: state.player, phase: state.phase, winner: state.winner, pending: cloneJson(state.pending),
  };
}

function rawIdentityKey(state) { return stableStringify(rawIdentityObject(state)); }
function moveKey(move) { return AI.moveKey(move); }
function canonicalMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }

function conditionOptions(quiescenceDepth) {
  return { evaluationProfile: "bao", quiescenceDepth, legalMoveOrdering: "canonical", orderQuiescenceCaptures: false };
}

function coreSearchResult(condition) {
  const result = condition.result;
  return {
    mode: condition.mode,
    completedDepth: condition.completedDepth,
    nodeBudget: condition.nodeBudget,
    nodeBudgetUsed: condition.nodeBudgetUsed,
    budgetExhausted: condition.budgetExhausted,
    estimable: condition.estimable === undefined ? true : condition.estimable,
    nonEstimableReason: condition.nonEstimableReason || null,
    topSetMoveKeys: result ? result.topSetMoveKeys.slice() : null,
    canonicalBestMoveKey: result ? result.canonicalBestMoveKey : null,
    bestScore: result ? result.bestScore : null,
    bestScoreClass: result ? result.bestScoreClass : null,
    candidates: result ? result.candidates.map(({ moveKey: key, score, scoreClass, scoreRank, isTopSet }) => ({
      moveKey: key, score, scoreClass, scoreRank, isTopSet,
    })) : null,
    principalVariation: condition.principalVariation ? cloneJson(condition.principalVariation) : null,
  };
}

function analyzeSearchGrid(state) {
  const d1 = SRDR.analyzeExactCondition(state, 1, conditionOptions(1));
  const d2 = SRDR.analyzeExactCondition(state, 2, conditionOptions(1));
  const d3 = SRDR.analyzeExactCondition(state, 3, conditionOptions(1));
  const d2q0 = SRDR.analyzeExactCondition(state, 2, conditionOptions(0));
  const d2q2 = SRDR.analyzeExactCondition(state, 2, conditionOptions(2));
  const b256 = SRDR.analyzeBudgetCondition(state, 3, 256, conditionOptions(1));
  const b1024 = SRDR.analyzeBudgetCondition(state, 3, 1024, conditionOptions(1));
  return {
    D1_Q1: coreSearchResult(d1), D2_Q1_BASE: coreSearchResult(d2), D3_Q1_REFERENCE: coreSearchResult(d3),
    D2_Q0: coreSearchResult(d2q0), D2_Q2: coreSearchResult(d2q2),
    B256_Q1_MAXD3: coreSearchResult(b256), B1024_Q1_MAXD3: coreSearchResult(b1024),
  };
}

function sameStringArray(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

function referenceDisposition(grid) {
  const deep = grid.D3_Q1_REFERENCE;
  const budget = grid.B1024_Q1_MAXD3;
  if (budget.completedDepth !== 3 || !budget.estimable) return {
    status: "REFERENCE-NON-ESTIMABLE-BUDGET", referenceConsensus: false, referenceDisagreementEvent: false,
  };
  const referenceConsensus = sameStringArray(deep.topSetMoveKeys, budget.topSetMoveKeys)
    && deep.canonicalBestMoveKey === budget.canonicalBestMoveKey;
  if (!referenceConsensus) return {
    status: "REFERENCE-AMBIGUOUS", referenceConsensus: false, referenceDisagreementEvent: false,
  };
  const referenceDisagreementEvent = !deep.topSetMoveKeys.includes(grid.D2_Q1_BASE.canonicalBestMoveKey);
  return {
    status: referenceDisagreementEvent ? "REFERENCE-DISAGREEMENT-EVENT" : "REFERENCE-CONSENSUS-NO-DISAGREEMENT",
    referenceConsensus: true, referenceDisagreementEvent,
  };
}

function evaluatorDiagnostics(state) {
  const breakdown = AI.evaluationBreakdown(state, state.player, { evaluationProfile: "bao" });
  return {
    profile: breakdown.profile,
    category: breakdown.category,
    phase: breakdown.phase,
    total: breakdown.total,
    reserveEfficiency: {
      feature: breakdown.features.reserveEfficiency ?? null,
      weight: breakdown.weights.reserveEfficiency ?? null,
      contribution: breakdown.contributions.reserveEfficiency ?? null,
    },
    houseValue: {
      feature: breakdown.features.houseValue ?? null,
      weight: breakdown.weights.houseValue ?? null,
      contribution: breakdown.contributions.houseValue ?? null,
    },
  };
}

function analyzeFixture(state, id) {
  const before = stableStringify(state);
  const grid = analyzeSearchGrid(state);
  const output = {
    schemaVersion: SCHEMA_VERSION, semantics: SEMANTICS, fixtureId: id,
    rawIdentityKey: rawIdentityKey(state), phase: state.phase, player: state.player,
    legalMoveKeys: canonicalMoves(state).map(moveKey), searchGrid: grid,
    reference: referenceDisposition(grid), evaluator: evaluatorDiagnostics(state),
  };
  if (stableStringify(state) !== before) throw new Error("Production Stage 0 mutated fixture state");
  output.outputSha256 = sha256(output);
  return output;
}

module.exports = {
  SCHEMA_VERSION, SEMANTICS, analyzeFixture, analyzeSearchGrid, canonicalMoves, moveKey,
  rawIdentityKey, rawIdentityObject, referenceDisposition, sha256, stableStringify,
};
