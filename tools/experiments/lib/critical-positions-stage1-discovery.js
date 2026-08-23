"use strict";

const { hashValue } = require("./position-typology-features.js");
const Contract = require("./critical-positions-stage1-contract.js");

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function maxShare(values) {
  if (!values.length) return 1;
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return Math.max(...counts.values()) / values.length;
}

function primaryTokenFamily(families) {
  return Contract.FAMILY_ORDER.find((family) => families.includes(family)) || null;
}

function buildCandidateAudits(selected, measurements, spec) {
  if (selected.length !== measurements.length) {
    throw new Error("Selected roots and measurements must have the same length");
  }
  const byKey = new Map();
  for (let index = 0; index < selected.length; index += 1) {
    const root = selected[index];
    const measurement = measurements[index];
    if (measurement.selectedIndex !== index) throw new Error(`Measurement index mismatch: ${index}`);
    if (measurement.ruleStateKey !== root.ruleStateKey) throw new Error(`Rule-state mismatch: ${index}`);
    if (!measurement.divergence.estimable) continue;

    const matchers = Contract.enumerateCandidateMatchers(root.state);
    for (const matcher of matchers) {
      const list = byKey.get(matcher.candidateKey) || [];
      list.push({
        historicalTrajectoryHash: root.historicalTrajectoryHash,
        ruleStateKey: root.ruleStateKey,
        openingPrefixHash: root.openingPrefixHash,
        conditionId: root.conditionId,
        dRange: measurement.divergence.dRange,
        highDivergence: measurement.divergence.highDivergence,
      });
      byKey.set(matcher.candidateKey, list);
    }
  }

  const audits = [];
  for (const [candidateKey, opportunities] of byKey.entries()) {
    const [phase, tokenPart] = candidateKey.split("|");
    const tokens = tokenPart.split("&");
    const families = tokens.map((token) => token.split("=")[0]);
    const high = opportunities.filter((item) => item.highDivergence);
    const uniqueTrajectories = new Set(opportunities.map((item) => item.historicalTrajectoryHash)).size;
    const uniqueRuleStates = new Set(opportunities.map((item) => item.ruleStateKey)).size;
    const openingPrefixes = opportunities.map((item) => item.openingPrefixHash);
    const strata = opportunities.map((item) => item.conditionId);
    const dRanges = opportunities.map((item) => item.dRange);
    const opportunityIdentityHash = Contract.supportIdentity(opportunities);
    const checks = {
      opportunityUniqueHistoricalTrajectories:
        uniqueTrajectories >= spec.candidatePromotion.minimumOpportunityUniqueHistoricalTrajectories,
      opportunityUniqueRuleStates:
        uniqueRuleStates >= spec.candidatePromotion.minimumOpportunityUniqueRuleStates,
      highDivergenceUniqueHistoricalTrajectories:
        new Set(high.map((item) => item.historicalTrajectoryHash)).size
          >= spec.candidatePromotion.minimumHighDivergenceUniqueHistoricalTrajectories,
      distinctOpeningPrefixes:
        new Set(openingPrefixes).size >= spec.candidatePromotion.minimumDistinctOpeningPrefixes,
      maximumSingleOpeningPrefixShare:
        maxShare(openingPrefixes) <= spec.candidatePromotion.maximumSingleOpeningPrefixShare,
      generationStrata:
        new Set(strata).size >= spec.candidatePromotion.minimumGenerationStrata,
      maximumSingleGenerationStratumShare:
        maxShare(strata) <= spec.candidatePromotion.maximumSingleGenerationStratumShare,
      highDivergenceRate:
        high.length / opportunities.length >= spec.candidatePromotion.minimumHighDivergenceRate,
      medianDRange:
        median(dRanges) >= spec.candidatePromotion.minimumMedianDRange,
    };
    audits.push({
      candidateKey,
      phase,
      tokens,
      families,
      primaryTokenFamily: primaryTokenFamily(families),
      patternComplexity: tokens.length,
      opportunityIdentityHash,
      opportunityUniqueHistoricalTrajectorySupport: uniqueTrajectories,
      opportunityUniqueRuleStateSupport: uniqueRuleStates,
      highDivergenceUniqueHistoricalTrajectorySupport:
        new Set(high.map((item) => item.historicalTrajectoryHash)).size,
      distinctOpeningPrefixes: new Set(openingPrefixes).size,
      maximumSingleOpeningPrefixShare: maxShare(openingPrefixes),
      generationStrata: new Set(strata).size,
      maximumSingleGenerationStratumShare: maxShare(strata),
      highDivergenceRate: high.length / opportunities.length,
      medianDRange: median(dRanges),
      gates: checks,
      passesPromotionGates: Object.values(checks).every(Boolean),
    });
  }
  return audits.sort((a, b) => a.candidateKey.localeCompare(b.candidateKey));
}

function collapseSupportEquivalent(candidates) {
  const groups = new Map();
  for (const candidate of candidates) {
    const list = groups.get(candidate.opportunityIdentityHash) || [];
    list.push(candidate);
    groups.set(candidate.opportunityIdentityHash, list);
  }
  const representatives = [];
  for (const list of groups.values()) {
    const ordered = list.slice().sort((a, b) => a.patternComplexity - b.patternComplexity
      || a.candidateKey.localeCompare(b.candidateKey));
    representatives.push({
      ...ordered[0],
      supportEquivalentCandidateKeys: ordered.map((item) => item.candidateKey),
    });
  }
  return representatives;
}

function candidateRanking(a, b) {
  return b.highDivergenceRate - a.highDivergenceRate
    || b.medianDRange - a.medianDRange
    || b.opportunityUniqueHistoricalTrajectorySupport - a.opportunityUniqueHistoricalTrajectorySupport
    || a.patternComplexity - b.patternComplexity
    || a.candidateKey.localeCompare(b.candidateKey);
}

function applyCandidateCaps(candidates, spec) {
  const cap = spec.candidatePromotion.candidateCap;
  const selected = [];
  const phaseCounts = new Map();
  const familyCounts = new Map();
  for (const candidate of candidates.slice().sort(candidateRanking)) {
    if (selected.length >= cap.maximumTotal) break;
    const phaseCount = phaseCounts.get(candidate.phase) || 0;
    const familyCount = familyCounts.get(candidate.primaryTokenFamily) || 0;
    if (phaseCount >= cap.maximumPerPhase) continue;
    if (familyCount >= cap.maximumPerPrimaryTokenFamily) continue;
    selected.push(candidate);
    phaseCounts.set(candidate.phase, phaseCount + 1);
    familyCounts.set(candidate.primaryTokenFamily, familyCount + 1);
  }
  return selected;
}

function discover(selected, measurements, spec) {
  const candidateAudits = buildCandidateAudits(selected, measurements, spec);
  const passing = candidateAudits.filter((candidate) => candidate.passesPromotionGates);
  const supportRepresentatives = collapseSupportEquivalent(passing).sort(candidateRanking);
  const promoted = applyCandidateCaps(supportRepresentatives, spec);
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    exploratoryOnly: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    selectedRoots: selected.length,
    primaryEstimableRoots: measurements.filter((item) => item.divergence.estimable).length,
    primaryNonEstimableRoots: measurements.filter((item) => !item.divergence.estimable).length,
    candidateAuditCount: candidateAudits.length,
    candidatesPassingPromotionGates: passing.length,
    supportEquivalenceRepresentativeCount: supportRepresentatives.length,
    promotedCandidateCount: promoted.length,
    zeroPromotedCandidatesAllowed: true,
    manualOverridePerformed: false,
    candidateAudits,
    supportEquivalenceRepresentatives: supportRepresentatives,
    promotedCandidates: promoted,
  };
  result.resultHash = hashValue(result);
  return result;
}

module.exports = {
  applyCandidateCaps,
  buildCandidateAudits,
  candidateRanking,
  collapseSupportEquivalent,
  discover,
  maxShare,
  median,
  primaryTokenFamily,
};
