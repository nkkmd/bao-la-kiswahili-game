"use strict";

const Search = require("./search-reliability-decision-robustness.js");

function compactSearchResult(condition) {
  if (!condition.result) {
    return {
      estimable: false,
      mode: condition.mode,
      completedDepth: condition.completedDepth,
      attemptedDepth: condition.attemptedDepth,
      abortedDepth: condition.abortedDepth,
      nodeBudget: condition.nodeBudget,
      nodeBudgetUsed: condition.nodeBudgetUsed,
      budgetExhausted: condition.budgetExhausted,
      result: null,
      principalVariation: null,
    };
  }
  const r = condition.result;
  return {
    estimable: true,
    mode: condition.mode,
    completedDepth: condition.completedDepth,
    attemptedDepth: condition.attemptedDepth,
    abortedDepth: condition.abortedDepth,
    nodeBudget: condition.nodeBudget,
    nodeBudgetUsed: condition.nodeBudgetUsed,
    budgetExhausted: condition.budgetExhausted,
    result: {
      depth: r.depth,
      legalMoveCount: r.legalMoveCount,
      bestScore: r.bestScore,
      secondBestScore: r.secondBestScore,
      bestSecondGap: r.bestSecondGap,
      topSetMoveKeys: r.topSetMoveKeys,
      topSetSize: r.topSetSize,
      canonicalBestMoveKey: r.canonicalBestMoveKey,
      aggregateCounters: r.aggregateCounters,
      candidates: r.candidates.map((candidate) => ({
        moveKey: candidate.moveKey,
        score: candidate.score,
        scoreClass: candidate.scoreClass,
        ordinal: candidate.ordinal,
        scoreRank: candidate.scoreRank,
        isTopSet: candidate.isTopSet,
      })),
    },
    principalVariation: condition.principalVariation ? {
      semantics: condition.principalVariation.semantics,
      moveKeys: condition.principalVariation.moveKeys,
      nominalPlyLength: condition.principalVariation.nominalPlyLength,
      score: condition.principalVariation.score,
    } : null,
  };
}

function measureState(selectedRow, spec) {
  const common = spec.searchGrid.common;
  const conditions = {};
  for (const configured of spec.searchGrid.conditions) {
    const options = {
      evaluationProfile: common.evaluationProfile,
      quiescenceDepth: configured.quiescenceDepth,
      orderQuiescenceCaptures: common.orderQuiescenceCaptures,
      legalMoveOrdering: common.legalMoveOrdering,
    };
    const observed = configured.kind === "exact-depth"
      ? Search.analyzeExactCondition(selectedRow.state, configured.depth, options)
      : Search.analyzeBudgetCondition(selectedRow.state, configured.maxDepth, configured.nodeBudget, options);
    conditions[configured.id] = compactSearchResult(observed);
  }
  return {
    seed: selectedRow.seed,
    gameId: selectedRow.gameId,
    historicalTrajectoryHash: selectedRow.historicalTrajectoryHash,
    openingPrefixHash: selectedRow.openingPrefixHash,
    selectionRank: selectedRow.selectionRank,
    ply: selectedRow.ply,
    phase: selectedRow.phase,
    rawStateKey: selectedRow.rawStateKey,
    legalMoveCount: selectedRow.legalMoveCount,
    conditions,
  };
}

module.exports = { compactSearchResult, measureState };
