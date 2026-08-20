"use strict";

const Tactical = require("./tactical-motif-features.js");
const Contract = require("./blunder-misvaluation-stage1-contract.js");

function bin(value, cuts) {
  for (const [label, predicate] of cuts) if (predicate(value)) return label;
  throw new Error(`No bin for value: ${value}`);
}
function captureRegime(actor) {
  if (actor.captureMoveCount === 0) return "none";
  if (actor.captureMoveCount === actor.legalMoveCount) return "forced";
  return "mixed";
}
function rootPreconditionTokens(root) {
  const a = root.actor;
  return [
    { family: "captureRegime", value: captureRegime(a) },
    { family: "legalMoveCountBins", value: bin(a.legalMoveCount, [["2", (x) => x === 2], ["3-4", (x) => x >= 3 && x <= 4], ["5+", (x) => x >= 5]]) },
    { family: "captureMoveCountBins", value: bin(a.captureMoveCount, [["0", (x) => x === 0], ["1", (x) => x === 1], ["2+", (x) => x >= 2]]) },
    { family: "reserveBins", value: bin(a.reserve, [["0", (x) => x === 0], ["1-4", (x) => x >= 1 && x <= 4], ["5-12", (x) => x >= 5 && x <= 12], ["13+", (x) => x >= 13]]) },
    { family: "houseOwned", value: String(Boolean(a.houseOwned)) },
    { family: "nyumbaSeedsBins", value: bin(a.nyumbaSeeds, [["0", (x) => x === 0], ["1-4", (x) => x >= 1 && x <= 4], ["5+", (x) => x >= 5]]) },
    { family: "frontOccupiedBins", value: bin(a.frontOccupied, [["0-2", (x) => x <= 2], ["3-5", (x) => x >= 3 && x <= 5], ["6-8", (x) => x >= 6 && x <= 8]]) },
    { family: "frontConnectionsBins", value: bin(a.frontConnections, [["0-1", (x) => x <= 1], ["2-4", (x) => x >= 2 && x <= 4], ["5+", (x) => x >= 5]]) },
    { family: "reusablePitsBins", value: bin(a.reusablePits, [["0-2", (x) => x <= 2], ["3-5", (x) => x >= 3 && x <= 5], ["6+", (x) => x >= 6]]) },
  ];
}
function combinations(tokens) {
  const out = tokens.map((x) => [x]);
  for (let i = 0; i < tokens.length; i += 1) {
    for (let j = i + 1; j < tokens.length; j += 1) out.push([tokens[i], tokens[j]]);
  }
  return out;
}
function moveAbstractionKey(move, mode) {
  return Contract.stableStringify(Tactical.abstractMoveFamily(move, mode));
}
function aggregateNegative(envelope, field, aggregateKey) {
  const value = envelope?.actorDeltaFromRoot?.[field]?.[aggregateKey];
  return typeof value === "number" && value < 0;
}
function failureFlags(move) {
  const t = move.transition;
  const e = move.responseEnvelope;
  const d1 = move.search.d1;
  const d2 = move.search.d2;
  const d3 = move.search.d3;
  const flags = {
    actorLegalMoveDeltaNegative: t.actorDelta.legalMoveCount < 0,
    actorCaptureMoveDeltaNegative: t.actorDelta.captureMoveCount < 0,
    actorFrontConnectionsDeltaNegative: t.actorDelta.frontConnections < 0,
    actorReusablePitsDeltaNegative: t.actorDelta.reusablePits < 0,
    actorNyumbaSeedsDeltaNegative: t.actorDelta.nyumbaSeeds < 0,
    actorHouseOwnershipLost: t.houseOwnedDelta.actor < 0,
    allRepliesActorLegalMoveDeltaNegative: e.replyCount > 0 && aggregateNegative(e, "legalMoveCount", "max"),
    allRepliesActorCaptureMoveDeltaNegative: e.replyCount > 0 && aggregateNegative(e, "captureMoveCount", "max"),
    worstReplyActorFrontConnectionsDeltaNegative: e.replyCount > 0 && aggregateNegative(e, "frontConnections", "min"),
    worstReplyActorReusablePitsDeltaNegative: e.replyCount > 0 && aggregateNegative(e, "reusablePits", "min"),
    opponentImmediateWinningReplyExists: e.replyCount > 0 && (e.terminalCounts?.opponentWin || 0) > 0,
    singleReplyAndActorLegalMoveDeltaNegative: e.replyCount === 1 && aggregateNegative(e, "legalMoveCount", "mean"),
    singleReplyAndActorCaptureMoveDeltaNegative: e.replyCount === 1 && aggregateNegative(e, "captureMoveCount", "mean"),
    d1TopSetAndD3NonTop: d1.isTopSet === true && d3.isTopSet === false,
    d2TopSetAndD3NonTop: d2.isTopSet === true && d3.isTopSet === false,
    d2AtOrAboveMedianAndD3BelowMedian: d2.isAtOrAboveStateMedian === true && d3.isBelowStateMedian === true,
    staticTopSetAndD3NonTop: move.staticPostMove.isTopSet === true && d3.isTopSet === false,
    staticAtOrAboveMedianAndD3BelowMedian: move.staticPostMove.isAtOrAboveStateMedian === true && d3.isBelowStateMedian === true,
  };
  for (const token of Object.values(Contract.FAILURE_TOKEN_FAMILIES).flat()) {
    if (typeof flags[token] !== "boolean") throw new Error(`Missing failure flag implementation: ${token}`);
  }
  return flags;
}
function median(values) {
  if (!values.length) return null;
  const a = values.slice().sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function maxShare(values) {
  if (!values.length) return 0;
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return Math.max(...counts.values()) / values.length;
}
function candidateSummary(matcher, failureToken, opportunities) {
  const flags = opportunities.map((o) => o.failureFlags[failureToken]);
  const failurePositive = opportunities.filter((o) => o.failureFlags[failureToken]);
  const d3Inferior = opportunities.filter((o) => o.d3Inferior);
  const d3Top = opportunities.filter((o) => o.d3TopSet);
  const summary = {
    opportunityUniqueHistoricalTrajectories: new Set(opportunities.map((o) => o.historicalTrajectoryHash)).size,
    opportunityUniqueRuleStates: new Set(opportunities.map((o) => o.ruleStateKey)).size,
    failurePositiveUniqueHistoricalTrajectories: new Set(failurePositive.map((o) => o.historicalTrajectoryHash)).size,
    distinctOpeningPrefixes: new Set(opportunities.map((o) => o.openingPrefixHash)).size,
    maximumSingleOpeningPrefixShare: maxShare(opportunities.map((o) => o.openingPrefixHash)),
    generationStrata: new Set(opportunities.map((o) => o.conditionId)).size,
    maximumSingleGenerationStratumShare: maxShare(opportunities.map((o) => o.conditionId)),
    failureSignatureRate: flags.filter(Boolean).length / opportunities.length,
    d3InferiorRate: d3Inferior.length / opportunities.length,
    d3TopSetRate: d3Top.length / opportunities.length,
    medianNormalizedRankLoss: median(opportunities.map((o) => o.normalizedRankLoss)),
  };
  const candidate = {
    candidateKey: Contract.candidateKey({ ...matcher, failureToken }),
    matcherKey: Contract.matcherKey(matcher),
    phase: matcher.phase,
    preconditionTokens: Contract.normalizePreconditionTokens(matcher.preconditionTokens),
    moveAbstractionMode: matcher.moveAbstractionMode,
    moveAbstractionKey: matcher.moveAbstractionKey,
    failureToken,
    failureFamily: Contract.failureFamilyForToken(failureToken),
    patternComplexity: Contract.patternComplexity(matcher),
    opportunityIdentityHash: Contract.supportIdentityHash(opportunities),
    summary,
    promotionPassed: Contract.candidatePassesPromotion(summary),
  };
  return candidate;
}
function opportunityRecords(rows) {
  const byMatcherTrajectory = new Map();
  for (const row of rows) {
    const preconditions = combinations(rootPreconditionTokens(row.root));
    for (const move of row.moves) {
      const flags = move.failureFlags || failureFlags(move);
      for (const mode of Contract.MOVE_ABSTRACTION_MODES) {
        const abstraction = moveAbstractionKey(move.move, mode);
        for (const preconditionTokens of preconditions) {
          const matcher = {
            phase: row.phase,
            preconditionTokens,
            moveAbstractionMode: mode,
            moveAbstractionKey: abstraction,
          };
          const matcherKey = Contract.matcherKey(matcher);
          const groupKey = `${matcherKey}\n${row.historicalTrajectoryHash}`;
          const record = {
            matcher,
            matcherKey,
            historicalTrajectoryHash: row.historicalTrajectoryHash,
            ruleStateKey: row.ruleStateKey,
            moveKey: move.moveKey,
            openingPrefixHash: row.openingPrefixHash,
            conditionId: row.conditionId,
            failureFlags: flags,
            d3Inferior: move.search.d3Inferior,
            d3TopSet: move.search.d3.isTopSet,
            normalizedRankLoss: move.search.d3.normalizedRankLoss,
          };
          const existing = byMatcherTrajectory.get(groupKey);
          if (!existing || record.moveKey.localeCompare(existing.moveKey) < 0) {
            byMatcherTrajectory.set(groupKey, record);
          }
        }
      }
    }
  }
  const byMatcher = new Map();
  for (const record of byMatcherTrajectory.values()) {
    const list = byMatcher.get(record.matcherKey) || [];
    list.push(record);
    byMatcher.set(record.matcherKey, list);
  }
  for (const list of byMatcher.values()) {
    list.sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash)
      || a.ruleStateKey.localeCompare(b.ruleStateKey) || a.moveKey.localeCompare(b.moveKey));
  }
  return byMatcher;
}
function compareCandidates(a, b) {
  const ar = Math.min(a.summary.d3InferiorRate, a.summary.failureSignatureRate);
  const br = Math.min(b.summary.d3InferiorRate, b.summary.failureSignatureRate);
  return br - ar
    || b.summary.opportunityUniqueHistoricalTrajectories - a.summary.opportunityUniqueHistoricalTrajectories
    || b.summary.d3InferiorRate - a.summary.d3InferiorRate
    || b.summary.failureSignatureRate - a.summary.failureSignatureRate
    || b.summary.medianNormalizedRankLoss - a.summary.medianNormalizedRankLoss
    || a.patternComplexity - b.patternComplexity
    || a.candidateKey.localeCompare(b.candidateKey);
}
function collapseSupportEquivalent(candidates) {
  const groups = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.opportunityIdentityHash}|${candidate.failureToken}`;
    const list = groups.get(key) || [];
    list.push(candidate);
    groups.set(key, list);
  }
  return [...groups.values()].map((list) => list.sort((a, b) =>
    a.patternComplexity - b.patternComplexity || a.candidateKey.localeCompare(b.candidateKey))[0]);
}
function capPromoted(candidates, spec) {
  const cap = spec.candidatePromotion.candidateCap;
  const selected = [];
  const phaseCounts = new Map();
  const familyCounts = new Map();
  for (const c of candidates.slice().sort(compareCandidates)) {
    if (selected.length >= cap.maximumTotal) break;
    if ((phaseCounts.get(c.phase) || 0) >= cap.maximumPerPhase) continue;
    if ((familyCounts.get(c.failureFamily) || 0) >= cap.maximumPerFailureFamily) continue;
    selected.push(c);
    phaseCounts.set(c.phase, (phaseCounts.get(c.phase) || 0) + 1);
    familyCounts.set(c.failureFamily, (familyCounts.get(c.failureFamily) || 0) + 1);
  }
  return selected;
}
function discoverCandidates(rows, spec) {
  const byMatcher = opportunityRecords(rows);
  const detailed = [];
  const lowSupportMatcherKeys = [];
  for (const [matcherKey, opportunities] of byMatcher.entries()) {
    if (opportunities.length < spec.discoveryRepresentation.candidateEnumeration.minimumMatcherOpportunityTrajectoriesForDetailedAudit) {
      lowSupportMatcherKeys.push(matcherKey);
      continue;
    }
    const matcher = opportunities[0].matcher;
    for (const failureToken of Object.values(Contract.FAILURE_TOKEN_FAMILIES).flat()) {
      detailed.push(candidateSummary(matcher, failureToken, opportunities));
    }
  }
  const passing = detailed.filter((c) => c.promotionPassed);
  const equivalenceCollapsed = collapseSupportEquivalent(passing);
  const promoted = capPromoted(equivalenceCollapsed, spec);
  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    exploratory: true,
    confirmatoryReuseAllowed: false,
    matcherCount: byMatcher.size,
    lowSupportMatcherCount: lowSupportMatcherKeys.length,
    lowSupportMatcherKeyHash: lowSupportMatcherKeys.length ? Contract.sha256Text(lowSupportMatcherKeys.sort().join("\n")) : null,
    detailedCandidateCount: detailed.length,
    promotionPassingBeforeSupportEquivalence: passing.length,
    promotionPassingAfterSupportEquivalence: equivalenceCollapsed.length,
    promotedCandidateCount: promoted.length,
    promotedCandidates: promoted,
    failedCandidates: detailed.filter((c) => !c.promotionPassed),
    manualOverridePerformed: false,
  };
}

module.exports = {
  candidateSummary,
  captureRegime,
  collapseSupportEquivalent,
  combinations,
  discoverCandidates,
  failureFlags,
  moveAbstractionKey,
  opportunityRecords,
  rootPreconditionTokens,
};
