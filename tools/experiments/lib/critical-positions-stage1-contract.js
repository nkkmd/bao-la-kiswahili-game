"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const STAGE1_ID = "CPOB-S1-EXPLORATORY-2026-08-23-v1";
const GAME_COUNT = 3072;
const SEED_START = 22600001;
const SEED_END = 22603072;
const PHASE_QUOTA = Object.freeze({ namua: 300, mtaji: 300 });
const REPLICATES = 64;
const MAX_CONTINUATION_PLIES = 200;
const HIGH_DIVERGENCE_THRESHOLD = 0.30;
const POLICY_ID = "P1_NORMAL_TOP3";

const TOKEN_FAMILIES = Object.freeze({
  legalMoveCount: ["2", "3-4", "5+"],
  captureMoveCount: ["0", "1", "2+"],
  actorReserveNamuaOnly: ["0", "1-4", "5-12", "13+"],
  opponentReserveNamuaOnly: ["0", "1-4", "5-12", "13+"],
  actorHouseOwned: ["false", "true"],
  opponentHouseOwned: ["false", "true"],
  actorNyumbaSeeds: ["0", "1-4", "5+"],
  opponentNyumbaSeeds: ["0", "1-4", "5+"],
  actorFrontOccupied: ["0-2", "3-5", "6-8"],
  opponentFrontOccupied: ["0-2", "3-5", "6-8"],
  actorFrontConnections: ["0-1", "2-4", "5+"],
  opponentFrontConnections: ["0-1", "2-4", "5+"],
  actorReusablePits: ["0-2", "3-5", "6+"],
  opponentReusablePits: ["0-2", "3-5", "6+"],
});
const FAMILY_ORDER = Object.freeze(Object.keys(TOKEN_FAMILIES));

const PROMOTION = Object.freeze({
  minimumOpportunityUniqueHistoricalTrajectories: 24,
  minimumOpportunityUniqueRuleStates: 24,
  minimumHighDivergenceUniqueHistoricalTrajectories: 16,
  minimumDistinctOpeningPrefixes: 6,
  maximumSingleOpeningPrefixShare: 0.4,
  minimumGenerationStrata: 3,
  maximumSingleGenerationStratumShare: 0.6,
  minimumHighDivergenceRate: 0.65,
  minimumMedianDRange: 0.35,
});

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function bin(value, rules, label) {
  for (const [predicate, token] of rules) if (predicate(value)) return token;
  throw new Error(`No ${label} bin for ${value}`);
}

function exactMoveCounts(state) {
  const moves = E.moveVariants(state);
  return {
    legalMoveCount: moves.length,
    captureMoveCount: moves.filter(({ type }) => type === "capture").length,
  };
}

function structuralTokenMap(state) {
  if (!state || state.winner !== null) throw new Error("Structural matcher requires nonterminal state");
  const actor = state.player;
  const opponent = 1 - actor;
  const actorMetrics = AI.playerMetrics(state, actor);
  const opponentMetrics = AI.playerMetrics(state, opponent);
  const counts = exactMoveCounts(state);
  const result = {
    legalMoveCount: bin(counts.legalMoveCount, [
      [(v) => v === 2, "2"], [(v) => v >= 3 && v <= 4, "3-4"], [(v) => v >= 5, "5+"],
    ], "legalMoveCount"),
    captureMoveCount: bin(counts.captureMoveCount, [
      [(v) => v === 0, "0"], [(v) => v === 1, "1"], [(v) => v >= 2, "2+"],
    ], "captureMoveCount"),
    actorHouseOwned: String(Boolean(state.houseOwned[actor])),
    opponentHouseOwned: String(Boolean(state.houseOwned[opponent])),
    actorNyumbaSeeds: bin(state.pits[actor][E.FRONT][E.HOUSE], [
      [(v) => v === 0, "0"], [(v) => v >= 1 && v <= 4, "1-4"], [(v) => v >= 5, "5+"],
    ], "actorNyumbaSeeds"),
    opponentNyumbaSeeds: bin(state.pits[opponent][E.FRONT][E.HOUSE], [
      [(v) => v === 0, "0"], [(v) => v >= 1 && v <= 4, "1-4"], [(v) => v >= 5, "5+"],
    ], "opponentNyumbaSeeds"),
    actorFrontOccupied: bin(actorMetrics.frontOccupied, [
      [(v) => v <= 2, "0-2"], [(v) => v <= 5, "3-5"], [(v) => v <= 8, "6-8"],
    ], "actorFrontOccupied"),
    opponentFrontOccupied: bin(opponentMetrics.frontOccupied, [
      [(v) => v <= 2, "0-2"], [(v) => v <= 5, "3-5"], [(v) => v <= 8, "6-8"],
    ], "opponentFrontOccupied"),
    actorFrontConnections: bin(actorMetrics.frontConnections, [
      [(v) => v <= 1, "0-1"], [(v) => v <= 4, "2-4"], [(v) => v >= 5, "5+"],
    ], "actorFrontConnections"),
    opponentFrontConnections: bin(opponentMetrics.frontConnections, [
      [(v) => v <= 1, "0-1"], [(v) => v <= 4, "2-4"], [(v) => v >= 5, "5+"],
    ], "opponentFrontConnections"),
    actorReusablePits: bin(actorMetrics.reusablePits, [
      [(v) => v <= 2, "0-2"], [(v) => v <= 5, "3-5"], [(v) => v >= 6, "6+"],
    ], "actorReusablePits"),
    opponentReusablePits: bin(opponentMetrics.reusablePits, [
      [(v) => v <= 2, "0-2"], [(v) => v <= 5, "3-5"], [(v) => v >= 6, "6+"],
    ], "opponentReusablePits"),
  };
  if (state.phase === "namua") {
    result.actorReserveNamuaOnly = bin(state.reserve[actor], [
      [(v) => v === 0, "0"], [(v) => v <= 4, "1-4"], [(v) => v <= 12, "5-12"], [(v) => v >= 13, "13+"],
    ], "actorReserveNamuaOnly");
    result.opponentReserveNamuaOnly = bin(state.reserve[opponent], [
      [(v) => v === 0, "0"], [(v) => v <= 4, "1-4"], [(v) => v <= 12, "5-12"], [(v) => v >= 13, "13+"],
    ], "opponentReserveNamuaOnly");
  }
  return result;
}

function structuralTokens(state) {
  const map = structuralTokenMap(state);
  return FAMILY_ORDER.filter((family) => map[family] !== undefined)
    .map((family) => ({ family, value: map[family], token: `${family}=${map[family]}` }));
}

function enumerateCandidateMatchers(state) {
  const tokens = structuralTokens(state);
  const result = [];
  for (let i = 0; i < tokens.length; i += 1) {
    result.push({
      phase: state.phase,
      tokens: [tokens[i].token],
      families: [tokens[i].family],
      patternComplexity: 1,
    });
    for (let j = i + 1; j < tokens.length; j += 1) {
      result.push({
        phase: state.phase,
        tokens: [tokens[i].token, tokens[j].token],
        families: [tokens[i].family, tokens[j].family],
        patternComplexity: 2,
      });
    }
  }
  return result.map((item) => ({
    ...item,
    candidateKey: `${item.phase}|${item.tokens.join("&")}`,
  }));
}

function summarizeRootDivergence(measurement) {
  if (!measurement || !Array.isArray(measurement.moves) || measurement.moves.length < 2) {
    throw new Error("Divergence measurement requires at least two exact root moves");
  }
  const moveRates = [];
  let estimable = true;
  for (const item of measurement.moves) {
    const summary = item.summary;
    const counts = summary?.counts;
    const completed = summary?.completed;
    const total = summary?.total;
    if (!counts || total !== REPLICATES || completed !== REPLICATES
      || counts.ADMINISTRATIVE_UNFINISHED !== 0
      || counts.ROOT_ACTOR_WIN + counts.ROOT_ACTOR_LOSS !== REPLICATES) {
      estimable = false;
    }
    moveRates.push({
      moveKey: item.moveKey,
      winRate: estimable && counts ? counts.ROOT_ACTOR_WIN / REPLICATES : null,
    });
  }
  if (!estimable) {
    return { estimable: false, moveRates, dRange: null, highDivergence: null };
  }
  const rates = moveRates.map(({ winRate }) => winRate);
  const dRange = Math.max(...rates) - Math.min(...rates);
  return {
    estimable: true,
    moveRates,
    dRange,
    highDivergence: dRange >= HIGH_DIVERGENCE_THRESHOLD,
  };
}

function supportIdentity(rows) {
  const tuples = rows.map((row) => `${row.historicalTrajectoryHash}|${row.ruleStateKey}`).sort();
  return sha256(tuples.join("\n"));
}

module.exports = {
  FAMILY_ORDER,
  GAME_COUNT,
  HIGH_DIVERGENCE_THRESHOLD,
  MAX_CONTINUATION_PLIES,
  PHASE_QUOTA,
  POLICY_ID,
  PROMOTION,
  REPLICATES,
  SEED_END,
  SEED_START,
  STAGE1_ID,
  TOKEN_FAMILIES,
  enumerateCandidateMatchers,
  exactMoveCounts,
  structuralTokenMap,
  structuralTokens,
  summarizeRootDivergence,
  supportIdentity,
};
