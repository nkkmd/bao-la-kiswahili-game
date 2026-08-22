"use strict";

const AI = require("../../../public/ai.js");
const Tactical = require("./tactical-motif-features.js");
const Contract = require("./blunder-misvaluation-stage1-contract.js");
const Discovery = require("./blunder-misvaluation-stage1-discovery.js");

function supportGroupById(candidateFreeze, supportGroupId) {
  const group = candidateFreeze.supportGroups.find((row) => row.supportGroupId === supportGroupId);
  if (!group) throw new Error(`Unknown Stage 2 support group: ${supportGroupId}`);
  return group;
}

function candidateById(candidateFreeze, formalCandidateId) {
  const candidate = candidateFreeze.formalCandidates.find((row) => row.formalCandidateId === formalCandidateId);
  if (!candidate) throw new Error(`Unknown Stage 2 formal candidate: ${formalCandidateId}`);
  return candidate;
}

function rootSatisfiesSupport(actorFeatures, supportGroup) {
  const tokens = Discovery.rootPreconditionTokens({ actor: actorFeatures });
  const byFamily = new Map(tokens.map((token) => [token.family, token.value]));
  return supportGroup.preconditionTokens.every((token) => byFamily.get(token.family) === token.value);
}

function moveMatchesSupport(move, supportGroup) {
  const actual = Tactical.abstractMoveFamily(move, supportGroup.moveAbstractionMode);
  return Contract.stableStringify(actual) === Contract.stableStringify(supportGroup.moveAbstraction);
}

function canonicalMatchingMoves(moves, supportGroup) {
  return moves.filter((move) => moveMatchesSupport(move, supportGroup))
    .slice()
    .sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function responseAggregateNegative(envelope, field, aggregate) {
  const value = envelope?.actorDeltaFromRoot?.[field]?.[aggregate];
  return typeof value === "number" && value < 0;
}

function failureTokenHolds(moveRecord, candidate) {
  const token = candidate.failureToken;
  const transition = moveRecord.transition;
  const envelope = moveRecord.responseEnvelope;
  if (token === "worstReplyActorFrontConnectionsDeltaNegative") {
    return envelope.replyCount > 0
      && responseAggregateNegative(envelope, "frontConnections", "min");
  }
  if (token === "actorCaptureMoveDeltaNegative") {
    return transition.actorDelta.captureMoveCount < 0;
  }
  if (token === "actorLegalMoveDeltaNegative") {
    return transition.actorDelta.legalMoveCount < 0;
  }
  if (token === "allRepliesActorCaptureMoveDeltaNegative") {
    return envelope.replyCount > 0
      && responseAggregateNegative(envelope, "captureMoveCount", "max");
  }
  throw new Error(`Unsupported frozen Stage 2 failure token: ${token}`);
}

function median(values) {
  if (!Array.isArray(values) || !values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function maxShare(counts, total) {
  const values = Object.values(counts || {});
  return total && values.length ? Math.max(...values) / total : 0;
}

function estimabilityGates(summary, spec) {
  const gate = spec.estimabilityGates;
  return {
    uniqueHistoricalTrajectories:
      summary.uniqueHistoricalTrajectories >= gate.minimumOpportunityUniqueHistoricalTrajectories,
    uniqueRuleStates:
      summary.uniqueRuleStates >= gate.minimumOpportunityUniqueRuleStates,
    distinctOpeningPrefixes:
      summary.distinctOpeningPrefixes >= gate.minimumDistinctOpeningPrefixes,
    openingPrefixDomination:
      summary.maximumSingleOpeningPrefixShare <= gate.maximumSingleOpeningPrefixShare,
    generationStrata:
      summary.generationStrata >= gate.minimumGenerationStrata,
    generationStratumDomination:
      summary.maximumSingleGenerationStratumShare <= gate.maximumSingleGenerationStratumShare,
  };
}

function logCombination(total, successes) {
  const r = Math.min(successes, total - successes);
  let value = 0;
  for (let i = 1; i <= r; i += 1) {
    value += Math.log(total - r + i) - Math.log(i);
  }
  return value;
}

function exactBinomialUpper(successes, total, nullProbability = 0.5) {
  if (!Number.isInteger(successes) || !Number.isInteger(total)
      || successes < 0 || total < 0 || successes > total) {
    throw new Error("Invalid binomial counts");
  }
  if (!(nullProbability >= 0 && nullProbability <= 1)) {
    throw new Error("Invalid null probability");
  }
  if (total === 0) return 1;
  if (nullProbability === 0) return successes === 0 ? 1 : 0;
  if (nullProbability === 1) return 1;

  const q = 1 - nullProbability;
  const logP = Math.log(nullProbability);
  const logQ = Math.log(q);
  const logTerms = [];
  let logTerm = logCombination(total, successes)
    + successes * logP
    + (total - successes) * logQ;
  for (let k = successes; k <= total; k += 1) {
    logTerms.push(logTerm);
    if (k < total) {
      logTerm += Math.log(total - k) - Math.log(k + 1) + logP - logQ;
    }
  }
  const maxLog = Math.max(...logTerms);
  const scaled = logTerms.reduce((sum, value) => sum + Math.exp(value - maxLog), 0);
  return Math.min(1, Math.max(0, Math.exp(maxLog) * scaled));
}

function holmBonferroni(entries, alpha = 0.05) {
  const sorted = entries.map((entry, index) => ({ ...entry, _index: index }))
    .sort((a, b) => a.pValue - b.pValue || String(a.id).localeCompare(String(b.id)));
  const m = sorted.length;
  let running = 0;
  const adjusted = new Map();
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

function candidateDecision(summary, adjustedEndpoints, spec) {
  if (summary.technicalIntegrityPassed !== true) return "TECHNICAL-INCONCLUSIVE";
  if (!Object.values(summary.estimabilityGates).every(Boolean)) {
    return "INCONCLUSIVE-NOT-ESTIMABLE";
  }
  const failure = adjustedEndpoints.find((row) => row.endpoint === "failure-signature-recurrence");
  const d3 = adjustedEndpoints.find((row) => row.endpoint === "d3-inferior-recurrence");
  if (!failure || !d3) throw new Error(`Missing co-primary endpoint result: ${summary.formalCandidateId}`);
  const failureSpec = spec.coPrimaryEndpoints.find((row) => row.id === "failure-signature-recurrence");
  const d3Spec = spec.coPrimaryEndpoints.find((row) => row.id === "d3-inferior-recurrence");
  const confirmed = summary.failureSignatureRate >= failureSpec.minimumObservedRateForConfirmation
    && summary.d3InferiorRate >= d3Spec.minimumObservedRateForConfirmation
    && failure.adjustedPValue <= spec.multiplicity.familyWiseAlpha
    && d3.adjustedPValue <= spec.multiplicity.familyWiseAlpha
    && summary.d3TopSetRate <= spec.consistencyGates.maximumD3TopSetRate
    && summary.medianNormalizedRankLoss >= spec.consistencyGates.minimumMedianNormalizedRankLoss;
  return confirmed ? "CONFIRMED" : "NOT-CONFIRMED";
}

module.exports = {
  candidateById,
  candidateDecision,
  canonicalMatchingMoves,
  estimabilityGates,
  exactBinomialUpper,
  failureTokenHolds,
  holmBonferroni,
  logCombination,
  maxShare,
  median,
  moveMatchesSupport,
  responseAggregateNegative,
  rootSatisfiesSupport,
  supportGroupById,
};
