"use strict";

const P = require("./practical-comeback-stage0-production.js");

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function shareMax(values) {
  if (!values.length) return 1;
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return Math.max(...counts.values()) / values.length;
}
function binLegalReplyCount(n) { if (n === 1) return "1"; if (n === 2) return "2"; if (n <= 4) return "3-4"; return "5+"; }
function binDefenseFraction(x) { if (!(x > 0 && x <= 0.5)) return null; return x <= 0.25 ? "(0,0.25]" : "(0.25,0.5]"; }
function binErrorProbability(x) {
  if (!Number.isFinite(x) || x < 0 || x > 1) return null;
  if (x === 0) return "0";
  if (x <= 1 / 3) return "(0,1/3]";
  if (x <= 2 / 3) return "(1/3,2/3]";
  return "(2/3,1]";
}
function binReserve(n) { if (n === 0) return "0"; if (n <= 4) return "1-4"; return "5+"; }
function binReusable(n) { if (n <= 2) return "0-2"; if (n <= 5) return "3-5"; return "6+"; }
function binFrontOccupied(n) { if (n <= 3) return "0-3"; if (n <= 5) return "4-5"; return "6+"; }

function eligibleMove(root, move, spec) {
  const e = spec.moveAnalysisEligibility;
  return move.strictReferenceInferior === true
    && move.reply.referenceDefenseMaintainedCount >= e.referenceDefenseMaintainedCountMinimum
    && move.reply.referenceDefenseMaintainedFraction <= e.referenceDefenseMaintainedFractionMaximum
    && Number.isFinite(move.reply.exactFirstReplyReferenceErrorProbability);
}

function featureRow(root, move) {
  return {
    phase: root.phase,
    moveType: String(move.move.type),
    legalReplyCountBin: binLegalReplyCount(move.reply.legalReplyCount),
    referenceDefenseMaintainedFractionBin: binDefenseFraction(move.reply.referenceDefenseMaintainedFraction),
    firstReplyReferenceErrorProbabilityBin: binErrorProbability(move.reply.exactFirstReplyReferenceErrorProbability),
    actorReserveBin: binReserve(root.rootMorphology.actorReserve),
    actorHouseOwned: root.rootMorphology.actorHouseOwned,
    actorReusablePitsBin: binReusable(root.rootMorphology.actorReusablePits),
    actorFrontOccupiedBin: binFrontOccupied(root.rootMorphology.actorFrontOccupied),
  };
}

function candidateKey(template, row) {
  const values = template.tokens.map((token) => `${token}=${String(row[token])}`);
  return `${template.id}|${values.join("|")}`;
}

function collectOccurrences(measurements, spec) {
  const groups = new Map();
  for (const root of measurements) {
    for (const move of root.moves) {
      if (!eligibleMove(root, move, spec)) continue;
      const features = featureRow(root, move);
      if (Object.values(features).some((value) => value === null || value === undefined)) continue;
      for (const template of spec.candidateFeatureUniverse.templates) {
        const key = candidateKey(template, features);
        const occurrence = {
          candidateKey: key,
          templateId: template.id,
          features: Object.fromEntries(template.tokens.map((token) => [token, features[token]])),
          rawStateKey: root.rawStateKey,
          historicalTrajectoryHash: root.historicalTrajectoryHash,
          openingPrefixHash: root.openingPrefixHash,
          conditionId: root.conditionId,
          phase: root.phase,
          moveKey: move.moveKey,
          primaryComebackDifferenceVersusCanonicalBest: move.primaryComebackDifferenceVersusCanonicalBest,
          exactFirstReplyReferenceErrorProbability: move.reply.exactFirstReplyReferenceErrorProbability,
          referenceDefenseMaintainedFraction: move.reply.referenceDefenseMaintainedFraction,
          primaryRecords: move.continuation.primary.records,
        };
        const list = groups.get(key) || [];
        list.push(occurrence);
        groups.set(key, list);
      }
    }
  }
  return groups;
}

function deterministicRootRepresentatives(occurrences) {
  const map = new Map();
  for (const row of occurrences) {
    const current = map.get(row.rawStateKey);
    if (!current || row.moveKey.localeCompare(current.moveKey) < 0) map.set(row.rawStateKey, row);
  }
  return [...map.values()].sort((a, b) => a.rawStateKey.localeCompare(b.rawStateKey));
}

function auditCandidate(key, occurrences, spec) {
  const rows = deterministicRootRepresentatives(occurrences);
  const p = spec.promotion;
  const deltas = rows.map((row) => row.primaryComebackDifferenceVersusCanonicalBest);
  const errorProbabilities = rows.map((row) => row.exactFirstReplyReferenceErrorProbability);
  const defenseFractions = rows.map((row) => row.referenceDefenseMaintainedFraction);
  const errorRecords = [];
  const defenseRecords = [];
  const errorRoots = new Set();
  const defenseRoots = new Set();
  for (const row of rows) for (const record of row.primaryRecords) {
    if (record.firstReplyReferenceError === true) { errorRecords.push(record); errorRoots.add(row.rawStateKey); }
    else if (record.firstReplyReferenceError === false) { defenseRecords.push(record); defenseRoots.add(row.rawStateKey); }
  }
  const errorWins = errorRecords.reduce((sum, row) => sum + row.boundedComeback96, 0);
  const defenseWins = defenseRecords.reduce((sum, row) => sum + row.boundedComeback96, 0);
  const errorFrequency = errorRecords.length ? errorWins / errorRecords.length : null;
  const defenseFrequency = defenseRecords.length ? defenseWins / defenseRecords.length : null;
  const conditionalDifference = errorFrequency === null || defenseFrequency === null ? null : errorFrequency - defenseFrequency;
  const metrics = {
    uniqueRoots: rows.length,
    uniqueHistoricalTrajectories: new Set(rows.map((r) => r.historicalTrajectoryHash)).size,
    distinctOpeningPrefixes: new Set(rows.map((r) => r.openingPrefixHash)).size,
    generationStrata: new Set(rows.map((r) => r.conditionId)).size,
    maximumSingleGenerationStratumShare: shareMax(rows.map((r) => r.conditionId)),
    maximumSingleOpeningPrefixShare: shareMax(rows.map((r) => r.openingPrefixHash)),
    medianPrimaryComebackDifferenceVersusCanonicalBest: median(deltas),
    proportionRootsWithPrimaryComebackDifferenceAtLeast0_25: rows.length ? deltas.filter((x) => x >= 0.25).length / rows.length : 0,
    medianExactFirstReplyReferenceErrorProbability: median(errorProbabilities),
    medianReferenceDefenseMaintainedFraction: median(defenseFractions),
    errorConditionedReplicates: errorRecords.length,
    defenseConditionedReplicates: defenseRecords.length,
    uniqueRootsContributingErrorCondition: errorRoots.size,
    uniqueRootsContributingDefenseCondition: defenseRoots.size,
    pooledBoundedComebackFrequencyGivenError: errorFrequency,
    pooledBoundedComebackFrequencyGivenDefense: defenseFrequency,
    pooledBoundedComebackDifferenceErrorMinusDefense: conditionalDifference,
  };
  const c = p.conditionalErrorDependence;
  const gates = {
    minimumUniqueRoots: metrics.uniqueRoots >= p.minimumUniqueRoots,
    minimumUniqueHistoricalTrajectories: metrics.uniqueHistoricalTrajectories >= p.minimumUniqueHistoricalTrajectories,
    minimumDistinctOpeningPrefixes: metrics.distinctOpeningPrefixes >= p.minimumDistinctOpeningPrefixes,
    minimumGenerationStrata: metrics.generationStrata >= p.minimumGenerationStrata,
    maximumSingleGenerationStratumShare: metrics.maximumSingleGenerationStratumShare <= p.maximumSingleGenerationStratumShare,
    maximumSingleOpeningPrefixShare: metrics.maximumSingleOpeningPrefixShare <= p.maximumSingleOpeningPrefixShare,
    minimumMedianPrimaryComebackDifferenceVersusCanonicalBest: metrics.medianPrimaryComebackDifferenceVersusCanonicalBest !== null && metrics.medianPrimaryComebackDifferenceVersusCanonicalBest >= p.minimumMedianPrimaryComebackDifferenceVersusCanonicalBest,
    minimumProportionRootsWithPrimaryComebackDifferenceAtLeast0_25: metrics.proportionRootsWithPrimaryComebackDifferenceAtLeast0_25 >= p.minimumProportionRootsWithPrimaryComebackDifferenceAtLeast0_25,
    minimumMedianExactFirstReplyReferenceErrorProbability: metrics.medianExactFirstReplyReferenceErrorProbability !== null && metrics.medianExactFirstReplyReferenceErrorProbability >= p.minimumMedianExactFirstReplyReferenceErrorProbability,
    maximumMedianReferenceDefenseMaintainedFraction: metrics.medianReferenceDefenseMaintainedFraction !== null && metrics.medianReferenceDefenseMaintainedFraction <= p.maximumMedianReferenceDefenseMaintainedFraction,
    minimumErrorConditionedReplicates: metrics.errorConditionedReplicates >= c.minimumErrorConditionedReplicates,
    minimumDefenseConditionedReplicates: metrics.defenseConditionedReplicates >= c.minimumDefenseConditionedReplicates,
    minimumUniqueRootsContributingErrorCondition: metrics.uniqueRootsContributingErrorCondition >= c.minimumUniqueRootsContributingErrorCondition,
    minimumUniqueRootsContributingDefenseCondition: metrics.uniqueRootsContributingDefenseCondition >= c.minimumUniqueRootsContributingDefenseCondition,
    minimumPooledBoundedComebackDifferenceErrorMinusDefense: metrics.pooledBoundedComebackDifferenceErrorMinusDefense !== null && metrics.pooledBoundedComebackDifferenceErrorMinusDefense >= c.minimumPooledBoundedComebackDifferenceErrorMinusDefense,
  };
  const representativeMap = rows.map((row) => ({ rawStateKey: row.rawStateKey, moveKey: row.moveKey }));
  return {
    candidateKey: key,
    templateId: rows[0]?.templateId || key.split("|")[0],
    features: rows[0]?.features || {},
    metrics,
    gates,
    passedAllPromotionGates: Object.values(gates).every(Boolean),
    supportEquivalenceHash: P.canonicalHash(representativeMap),
    representativeMap,
  };
}

function discover(measurements, spec) {
  const groups = collectOccurrences(measurements, spec);
  const audits = [...groups.entries()].map(([key, rows]) => auditCandidate(key, rows, spec))
    .sort((a, b) => a.candidateKey.localeCompare(b.candidateKey));
  const passed = audits.filter((row) => row.passedAllPromotionGates);
  const equivalenceGroups = new Map();
  for (const row of passed) {
    const list = equivalenceGroups.get(row.supportEquivalenceHash) || [];
    list.push(row);
    equivalenceGroups.set(row.supportEquivalenceHash, list);
  }
  const representatives = [...equivalenceGroups.values()].map((list) => list.slice().sort((a,b) => a.candidateKey.localeCompare(b.candidateKey))[0]);
  representatives.sort((a, b) => {
    const a1 = a.metrics.medianPrimaryComebackDifferenceVersusCanonicalBest;
    const b1 = b.metrics.medianPrimaryComebackDifferenceVersusCanonicalBest;
    if (a1 !== b1) return b1 - a1;
    const a2 = a.metrics.pooledBoundedComebackDifferenceErrorMinusDefense;
    const b2 = b.metrics.pooledBoundedComebackDifferenceErrorMinusDefense;
    if (a2 !== b2) return b2 - a2;
    if (a.metrics.uniqueRoots !== b.metrics.uniqueRoots) return b.metrics.uniqueRoots - a.metrics.uniqueRoots;
    return a.candidateKey.localeCompare(b.candidateKey);
  });
  const promoted = representatives.slice(0, spec.promotion.maximumPromotedCandidates).map((row, index) => ({
    promotionRank: index + 1,
    candidateId: `PCEM-S1-C${String(index + 1).padStart(2,"0")}`,
    candidateKey: row.candidateKey,
    templateId: row.templateId,
    features: row.features,
    metrics: row.metrics,
    supportEquivalenceHash: row.supportEquivalenceHash,
  }));
  const gatePassCounts = {};
  for (const audit of audits) for (const [gate, ok] of Object.entries(audit.gates)) {
    gatePassCounts[gate] = (gatePassCounts[gate] || 0) + (ok ? 1 : 0);
  }
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    scientificLabel: "EXPLORATORY-ONLY",
    candidateAuditCount: audits.length,
    candidatesPassingPromotionGates: passed.length,
    supportEquivalenceRepresentativeCount: representatives.length,
    promotedCandidateCount: promoted.length,
    zeroPromotedCandidatesAllowed: spec.promotion.zeroPromotedCandidatesAllowed,
    manualPromotionPerformed: false,
    gatePassCounts,
    promotedCandidates: promoted,
    audits,
  };
  result.discoveryHash = P.canonicalHash(result);
  return result;
}

module.exports = { auditCandidate, candidateKey, discover, eligibleMove, featureRow };
