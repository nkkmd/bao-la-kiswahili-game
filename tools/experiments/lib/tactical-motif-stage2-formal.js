"use strict";

const AI = require("../../../public/ai.js");
const TM = require("./tactical-motif-features.js");
const Discovery = require("./tactical-motif-discovery.js");
const { stableStringify } = require("./position-typology-features.js");

function parseMoveAbstractionToken(token) {
  const marker = "move:";
  if (!token.startsWith(marker)) throw new Error(`Invalid move abstraction token: ${token}`);
  const rest = token.slice(marker.length);
  const split = rest.indexOf(":");
  if (split < 0) throw new Error(`Invalid move abstraction token: ${token}`);
  return { mode: rest.slice(0, split), family: JSON.parse(rest.slice(split + 1)) };
}

function moveMatchesCandidate(move, candidate) {
  const parsed = parseMoveAbstractionToken(candidate.moveAbstractionToken);
  if (parsed.mode !== candidate.moveAbstractionMode) return false;
  return stableStringify(TM.abstractMoveFamily(move, parsed.mode)) === stableStringify(parsed.family);
}

function canonicalMatchingMoves(moves, candidate) {
  return moves.filter((move) => moveMatchesCandidate(move, candidate))
    .slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function rootPreconditionTokens(actorFeatures) {
  return Discovery.preconditionTokens({ root: { actor: actorFeatures } });
}

function rootSatisfiesCandidate(actorFeatures, candidate) {
  const tokens = new Set(rootPreconditionTokens(actorFeatures));
  return candidate.preconditions.every((token) => tokens.has(token));
}

function pairedPreconditionHolds(actorFeatures, candidate) {
  const paired = candidate.pairedDiagnosticDefinition;
  const tokens = new Set(rootPreconditionTokens(actorFeatures));
  return paired.preconditions.every((token) => tokens.has(token));
}

function consequenceHolds(moveRecord, consequence) {
  return Discovery.consequenceTokens(moveRecord).includes(consequence);
}

function candidateConsequenceHolds(moveRecord, candidate) {
  return consequenceHolds(moveRecord, candidate.consequence);
}

function pairedConsequenceHolds(moveRecord, candidate) {
  return consequenceHolds(moveRecord, candidate.pairedDiagnosticDefinition.consequence);
}

function exactBinomialUpper(successes, total, nullProbability = 0.5) {
  if (!Number.isInteger(successes) || !Number.isInteger(total) || successes < 0 || total < 0 || successes > total) {
    throw new Error("Invalid binomial counts");
  }
  if (!(nullProbability >= 0 && nullProbability <= 1)) throw new Error("Invalid null probability");
  if (total === 0) return 1;
  if (nullProbability === 0) return successes === 0 ? 1 : 0;
  if (nullProbability === 1) return 1;
  let probability = 0;
  const q = 1 - nullProbability;
  let term = Math.pow(nullProbability, successes) * Math.pow(q, total - successes);
  let combination = 1;
  for (let i = 1; i <= successes; i += 1) combination *= (total - successes + i) / i;
  term *= combination;
  probability += term;
  for (let k = successes; k < total; k += 1) {
    term *= ((total - k) / (k + 1)) * (nullProbability / q);
    probability += term;
  }
  return Math.min(1, Math.max(0, probability));
}

function holmBonferroni(entries, alpha = 0.05) {
  const sorted = entries.map((entry, index) => ({ ...entry, _index: index }))
    .sort((a, b) => a.pValue - b.pValue || String(a.id).localeCompare(String(b.id)));
  let running = 0;
  const adjusted = new Map();
  const m = sorted.length;
  for (let i = 0; i < m; i += 1) {
    running = Math.max(running, Math.min(1, (m - i) * sorted[i].pValue));
    adjusted.set(sorted[i]._index, running);
  }
  return entries.map((entry, index) => ({
    ...entry,
    adjustedPValue: adjusted.get(index),
    rejected: adjusted.get(index) <= alpha,
  }));
}

function maxShare(counts, total) {
  const values = Object.values(counts || {});
  return total && values.length ? Math.max(...values) / total : 0;
}

function estimabilityGates(summary, spec) {
  const gate = spec.estimabilityAndTransferabilityGates;
  return {
    uniqueHistoricalTrajectories:
      summary.uniqueHistoricalTrajectories >= gate.minimumSelectedUniqueHistoricalTrajectoriesPerCandidate,
    uniqueRuleStates:
      summary.uniqueRuleStates >= gate.minimumSelectedUniqueRuleStatesPerCandidate,
    distinctOpeningPrefixes:
      summary.distinctOpeningPrefixes >= gate.minimumDistinctOpeningPrefixesPerCandidate,
    openingPrefixDomination:
      summary.maximumSingleOpeningPrefixShare <= gate.maximumSingleOpeningPrefixShare,
    generationStrata:
      summary.generationStrata >= gate.minimumGenerationStrataPerCandidate,
    generationStratumDomination:
      summary.maximumSingleGenerationStratumShare <= gate.maximumSingleGenerationStratumShare,
  };
}

function candidateDecision(summary, adjustedEndpoints, spec) {
  const estimable = Object.values(summary.estimabilityGates).every(Boolean);
  if (!estimable) return "INCONCLUSIVE-NOT-ESTIMABLE";
  const structural = adjustedEndpoints.find((x) => x.endpoint === "structuralSuccess");
  const value = adjustedEndpoints.find((x) => x.endpoint === "tacticalValueSuccess");
  const endpoint = spec.formalEndpoints;
  const confirmed = summary.structuralSuccessRate >= endpoint.structuralSuccess.minimumObservedRate
    && summary.d3TopSetRate >= endpoint.tacticalValueSuccess.minimumObservedRate
    && structural.adjustedPValue <= spec.multiplicity.alpha
    && value.adjustedPValue <= spec.multiplicity.alpha
    && summary.d3AtOrAboveStateMedianRate >= endpoint.consistencyGates.minimumD3AtOrAboveStateMedianRate
    && summary.d3UniqueWorstRate <= endpoint.consistencyGates.maximumD3UniqueWorstRate;
  return confirmed ? "CONFIRMED" : "NOT-CONFIRMED";
}

module.exports = {
  candidateConsequenceHolds,
  candidateDecision,
  canonicalMatchingMoves,
  consequenceHolds,
  estimabilityGates,
  exactBinomialUpper,
  holmBonferroni,
  maxShare,
  moveMatchesCandidate,
  pairedConsequenceHolds,
  pairedPreconditionHolds,
  parseMoveAbstractionToken,
  rootPreconditionTokens,
  rootSatisfiesCandidate,
};
