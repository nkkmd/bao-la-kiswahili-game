"use strict";

const crypto = require("node:crypto");
const { stableStringify } = require("./position-typology-features.js");
const { abstractMoveFamily } = require("./tactical-motif-features.js");

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sign(value) {
  return value > 0 ? "+" : value < 0 ? "-" : "0";
}

function binCount(value, boundaries, labels) {
  for (let index = 0; index < boundaries.length; index += 1) {
    if (value <= boundaries[index]) return labels[index];
  }
  return labels.at(-1);
}

function binLegalMoves(value) {
  if (value === 2) return "2";
  if (value <= 4) return "3-4";
  return "5+";
}

function binCaptureMoves(value) {
  if (value === 0) return "0";
  if (value === 1) return "1";
  return "2+";
}

function binReserve(value) {
  if (value === 0) return "0";
  if (value <= 4) return "1-4";
  if (value <= 12) return "5-12";
  return "13+";
}

function binNyumba(value) {
  if (value === 0) return "0";
  if (value <= 4) return "1-4";
  return "5+";
}

function binFrontOccupied(value) {
  if (value <= 2) return "0-2";
  if (value <= 5) return "3-5";
  return "6-8";
}

function binFrontConnections(value) {
  if (value <= 1) return "0-1";
  if (value <= 4) return "2-4";
  return "5+";
}

function binReusable(value) {
  if (value <= 2) return "0-2";
  if (value <= 5) return "3-5";
  return "6+";
}

function binCapturedSeeds(value) {
  if (value === 0) return "0";
  if (value <= 2) return "1-2";
  if (value <= 5) return "3-5";
  return "6+";
}

function binRelayEvents(value) {
  if (value === 0) return "0";
  if (value === 1) return "1";
  return "2+";
}

function captureRegime(root) {
  if (root.captureMoveCount === 0) return "none";
  if (root.forcedCapture) return "forced";
  return "mixed";
}

function replyClass(transition) {
  if (transition.terminal) return "terminal";
  if (transition.replySet.forced) return "forced";
  if (transition.replySet.count <= 3) return "free-2-3";
  return "free-4+";
}

function preconditionTokens(measurement) {
  const root = measurement.root.actor;
  return [
    `captureRegime=${captureRegime(root)}`,
    `legalMoveCount=${binLegalMoves(root.legalMoveCount)}`,
    `captureMoveCount=${binCaptureMoves(root.captureMoveCount)}`,
    `reserve=${binReserve(root.reserve)}`,
    `houseOwned=${Boolean(root.houseOwned)}`,
    `nyumbaSeeds=${binNyumba(root.nyumbaSeeds)}`,
    `frontOccupied=${binFrontOccupied(root.frontOccupied)}`,
    `frontConnections=${binFrontConnections(root.frontConnections)}`,
    `reusablePits=${binReusable(root.reusablePits)}`,
  ].sort();
}

function consequenceTokens(moveRecord) {
  const transition = moveRecord.transition;
  const envelope = moveRecord.responseEnvelope;
  const worstLegal = envelope.actorDeltaFromRoot.legalMoveCount.min;
  const worstCapture = envelope.actorDeltaFromRoot.captureMoveCount.min;
  return [
    `capturedSeedsBin=${binCapturedSeeds(transition.events.capturedSeeds)}`,
    `relayEventsBin=${binRelayEvents(transition.events.relayEvents)}`,
    `actorLegalMoveDeltaSign=${sign(transition.actorDelta.legalMoveCount)}`,
    `actorCaptureMoveDeltaSign=${sign(transition.actorDelta.captureMoveCount)}`,
    `actorFrontConnectionsDeltaSign=${sign(transition.actorDelta.frontConnections)}`,
    `actorReusablePitsDeltaSign=${sign(transition.actorDelta.reusablePits)}`,
    `actorNyumbaSeedsDeltaSign=${sign(transition.actorDelta.nyumbaSeeds)}`,
    `actorHouseOwnershipChange=${sign(transition.houseOwnedDelta.actor)}`,
    `replyClass=${replyClass(transition)}`,
    `worstReplyActorLegalMoveDeltaSign=${worstLegal === null ? "NA" : sign(worstLegal)}`,
    `worstReplyActorCaptureMoveDeltaSign=${worstCapture === null ? "NA" : sign(worstCapture)}`,
  ].sort();
}

function combinations(values, size) {
  if (size === 1) return values.map((value) => [value]);
  const result = [];
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      result.push([values[left], values[right]]);
    }
  }
  return result;
}

function moveAbstractionToken(moveRecord, mode) {
  const family = abstractMoveFamily(moveRecord.transition.move, mode);
  return `move:${mode}:${stableStringify(family)}`;
}

function candidateDescriptor(measurement, moveRecord, mode, preconditions, consequence) {
  const descriptor = {
    schemaVersion: 1,
    phase: measurement.phase,
    moveAbstractionMode: mode,
    moveAbstractionToken: moveAbstractionToken(moveRecord, mode),
    preconditions: preconditions.slice().sort(),
    consequence,
  };
  return {
    ...descriptor,
    candidateKey: sha256Text(stableStringify(descriptor)),
  };
}

function recordCandidateInstances(measurement, spec) {
  const representation = spec.discoveryRepresentation;
  const patterns = [];
  const preconditions = preconditionTokens(measurement);
  const consequences = measurement.moves.flatMap((moveRecord) => {
    return consequenceTokens(moveRecord).map((token) => ({ moveRecord, token }));
  });
  for (const mode of representation.moveAbstractionModes) {
    for (const { moveRecord, token: consequence } of consequences) {
      for (let size = representation.candidatePattern.minimumPreconditionTokens;
        size <= representation.candidatePattern.maximumPreconditionTokens; size += 1) {
        for (const conjunction of combinations(preconditions, size)) {
          patterns.push({
            descriptor: candidateDescriptor(measurement, moveRecord, mode, conjunction, consequence),
            moveRecord,
          });
        }
      }
    }
  }
  return patterns;
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function ratio(count, total) {
  return total ? count / total : null;
}

function maxShare(counts, total) {
  if (!total || !counts.size) return 0;
  return Math.max(...counts.values()) / total;
}

function candidateGateResults(summary, spec) {
  const gate = spec.candidatePromotion;
  return {
    uniqueHistoricalTrajectories:
      summary.uniqueHistoricalTrajectorySupport >= gate.minimumUniqueHistoricalTrajectories,
    uniqueRuleStates: summary.uniqueRuleStates >= gate.minimumUniqueRuleStates,
    distinctOpeningPrefixes:
      summary.distinctOpeningPrefixes >= gate.minimumDistinctOpeningPrefixes,
    openingPrefixDomination:
      summary.maximumSingleOpeningPrefixShare <= gate.maximumSingleOpeningPrefixShare,
    generationStrata: summary.generationStrata >= gate.minimumGenerationStrata,
    generationStratumDomination:
      summary.maximumSingleGenerationStratumShare <= gate.maximumSingleGenerationStratumShare,
    d3TopSetRate: summary.d3TopSetRate >= gate.minimumD3TopSetRate,
    d3AtOrAboveStateMedianRate:
      summary.d3AtOrAboveStateMedianRate >= gate.minimumD3AtOrAboveStateMedianRate,
    d3UniqueWorstRate: summary.d3UniqueWorstRate <= gate.maximumD3UniqueWorstRate,
  };
}

function summarizeCandidate(descriptor, representatives, spec) {
  const selected = [...representatives.values()];
  const openingCounts = new Map();
  const conditionCounts = new Map();
  const ruleStates = new Set();
  for (const item of selected) {
    openingCounts.set(item.measurement.openingPrefixHash,
      (openingCounts.get(item.measurement.openingPrefixHash) || 0) + 1);
    conditionCounts.set(item.measurement.conditionId,
      (conditionCounts.get(item.measurement.conditionId) || 0) + 1);
    ruleStates.add(item.measurement.ruleStateKey);
  }
  const support = selected.length;
  const scoreAdvantages = selected.map(({ moveRecord }) => moveRecord.search.d3ScoreMinusStateMedian);
  const summary = {
    ...descriptor,
    uniqueHistoricalTrajectorySupport: support,
    uniqueRuleStates: ruleStates.size,
    distinctOpeningPrefixes: openingCounts.size,
    maximumSingleOpeningPrefixShare: maxShare(openingCounts, support),
    generationStrata: conditionCounts.size,
    maximumSingleGenerationStratumShare: maxShare(conditionCounts, support),
    d3TopSetRate: ratio(selected.filter(({ moveRecord }) => moveRecord.search.d3IsTopSet).length, support),
    d3AtOrAboveStateMedianRate:
      ratio(selected.filter(({ moveRecord }) => moveRecord.search.d3AtOrAboveStateMedian).length, support),
    d3UniqueWorstRate:
      ratio(selected.filter(({ moveRecord }) => moveRecord.search.d3UniqueWorst).length, support),
    medianD3ScoreMinusStateMedian: median(scoreAdvantages),
    patternComplexity: 2 + descriptor.preconditions.length,
    supportConditionCounts: Object.fromEntries([...conditionCounts].sort()),
    supportOpeningPrefixCounts: Object.fromEntries([...openingCounts].sort()),
    supportIdentityHash: sha256Text(stableStringify(selected.map(({ measurement, moveRecord }) => ({
      historicalTrajectoryHash: measurement.historicalTrajectoryHash,
      ruleStateKey: measurement.ruleStateKey,
      moveKey: moveRecord.moveKey,
    })).sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash)))),
  };
  summary.gates = candidateGateResults(summary, spec);
  summary.passesPromotionGates = Object.values(summary.gates).every(Boolean);
  return summary;
}

function compareCandidates(a, b) {
  return b.uniqueHistoricalTrajectorySupport - a.uniqueHistoricalTrajectorySupport
    || b.d3TopSetRate - a.d3TopSetRate
    || b.d3AtOrAboveStateMedianRate - a.d3AtOrAboveStateMedianRate
    || b.medianD3ScoreMinusStateMedian - a.medianD3ScoreMinusStateMedian
    || a.patternComplexity - b.patternComplexity
    || a.candidateKey.localeCompare(b.candidateKey);
}

function capPromoted(candidates, spec) {
  const cap = spec.candidatePromotion.candidateCap;
  const result = [];
  const phaseCounts = new Map();
  const moveCounts = new Map();
  for (const candidate of candidates.slice().sort(compareCandidates)) {
    if (!candidate.passesPromotionGates) continue;
    const phaseCount = phaseCounts.get(candidate.phase) || 0;
    const moveCount = moveCounts.get(candidate.moveAbstractionToken) || 0;
    if (phaseCount >= cap.maximumPerPhase) continue;
    if (moveCount >= cap.maximumPerMoveAbstractionKey) continue;
    result.push(candidate);
    phaseCounts.set(candidate.phase, phaseCount + 1);
    moveCounts.set(candidate.moveAbstractionToken, moveCount + 1);
    if (result.length >= cap.maximumTotal) break;
  }
  return result;
}

function discoverCandidates(measurements, spec) {
  const patternMap = new Map();
  let rawPatternInstances = 0;
  for (const measurement of measurements) {
    for (const instance of recordCandidateInstances(measurement, spec)) {
      rawPatternInstances += 1;
      const key = instance.descriptor.candidateKey;
      let entry = patternMap.get(key);
      if (!entry) {
        entry = { descriptor: instance.descriptor, representatives: new Map() };
        patternMap.set(key, entry);
      }
      const trajectory = measurement.historicalTrajectoryHash;
      const current = entry.representatives.get(trajectory);
      if (!current || instance.moveRecord.moveKey.localeCompare(current.moveRecord.moveKey) < 0) {
        entry.representatives.set(trajectory, {
          measurement,
          moveRecord: instance.moveRecord,
        });
      }
    }
  }

  const detailedThreshold = spec.discoveryRepresentation.candidateEnumeration
    .minimumUniqueHistoricalTrajectoriesForDetailedAudit;
  const detailed = [];
  const lowSupportKeys = [];
  for (const entry of patternMap.values()) {
    if (entry.representatives.size < detailedThreshold) {
      lowSupportKeys.push(entry.descriptor.candidateKey);
      continue;
    }
    detailed.push(summarizeCandidate(entry.descriptor, entry.representatives, spec));
  }
  detailed.sort(compareCandidates);
  const promoted = capPromoted(detailed, spec);

  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    exploratory: true,
    confirmatoryReuseAllowed: false,
    rawPatternInstances,
    uniquePatternKeys: patternMap.size,
    detailedCandidateCount: detailed.length,
    lowSupportPatternCount: lowSupportKeys.length,
    lowSupportPatternKeyHash: sha256Text(lowSupportKeys.sort().join("\n")),
    detailedCandidates: detailed,
    promotedForStage2Planning: promoted.map((candidate, index) => ({
      rank: index + 1,
      ...candidate,
    })),
    stage2GenerationAuthorized: false,
  };
}

module.exports = {
  binCaptureMoves,
  binCapturedSeeds,
  binFrontConnections,
  binFrontOccupied,
  binLegalMoves,
  binNyumba,
  binRelayEvents,
  binReserve,
  binReusable,
  candidateDescriptor,
  consequenceTokens,
  discoverCandidates,
  preconditionTokens,
  recordCandidateInstances,
  sign,
};
