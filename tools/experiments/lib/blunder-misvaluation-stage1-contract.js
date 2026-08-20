"use strict";

const crypto = require("node:crypto");

const STAGE1_ID = "BMP-S1-EXPLORATORY-2026-08-20-v1";
const GAME_COUNT = 2048;
const SEED_START = 22400001;
const SEED_END = 22402048;
const PHASE_QUOTA = Object.freeze({ namua: 600, mtaji: 600 });
const PRIMARY_REFERENCE = Object.freeze({
  searchSemantics: "exact-full-window-root-candidates/phase2-value-semantics/v1",
  depth: 3,
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
  perspective: "root-actor",
});
const MOVE_ABSTRACTION_MODES = Object.freeze(["coarse-no-index", "indexed"]);
const PRECONDITION_TOKEN_FAMILIES = Object.freeze({
  captureRegime: Object.freeze(["none", "forced", "mixed"]),
  legalMoveCountBins: Object.freeze(["2", "3-4", "5+"]),
  captureMoveCountBins: Object.freeze(["0", "1", "2+"]),
  reserveBins: Object.freeze(["0", "1-4", "5-12", "13+"]),
  houseOwned: Object.freeze(["false", "true"]),
  nyumbaSeedsBins: Object.freeze(["0", "1-4", "5+"]),
  frontOccupiedBins: Object.freeze(["0-2", "3-5", "6-8"]),
  frontConnectionsBins: Object.freeze(["0-1", "2-4", "5+"]),
  reusablePitsBins: Object.freeze(["0-2", "3-5", "6+"]),
});
const FAILURE_TOKEN_FAMILIES = Object.freeze({
  "immediate-structural": Object.freeze([
    "actorLegalMoveDeltaNegative",
    "actorCaptureMoveDeltaNegative",
    "actorFrontConnectionsDeltaNegative",
    "actorReusablePitsDeltaNegative",
    "actorNyumbaSeedsDeltaNegative",
    "actorHouseOwnershipLost",
  ]),
  "response-envelope": Object.freeze([
    "allRepliesActorLegalMoveDeltaNegative",
    "allRepliesActorCaptureMoveDeltaNegative",
    "worstReplyActorFrontConnectionsDeltaNegative",
    "worstReplyActorReusablePitsDeltaNegative",
    "opponentImmediateWinningReplyExists",
  ]),
  "forcing-response": Object.freeze([
    "singleReplyAndActorLegalMoveDeltaNegative",
    "singleReplyAndActorCaptureMoveDeltaNegative",
  ]),
  "horizon-misvaluation": Object.freeze([
    "d1TopSetAndD3NonTop",
    "d2TopSetAndD3NonTop",
    "d2AtOrAboveMedianAndD3BelowMedian",
  ]),
  "static-misvaluation": Object.freeze([
    "staticTopSetAndD3NonTop",
    "staticAtOrAboveMedianAndD3BelowMedian",
  ]),
});
const PROMOTION = Object.freeze({
  minimumOpportunityUniqueHistoricalTrajectories: 24,
  minimumOpportunityUniqueRuleStates: 24,
  minimumFailurePositiveUniqueHistoricalTrajectories: 16,
  minimumDistinctOpeningPrefixes: 6,
  maximumSingleOpeningPrefixShare: 0.40,
  minimumGenerationStrata: 3,
  maximumSingleGenerationStratumShare: 0.60,
  minimumFailureSignatureRate: 0.65,
  minimumD3InferiorRate: 0.70,
  maximumD3TopSetRate: 0.20,
  minimumMedianNormalizedRankLoss: 0.50,
});

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableObject(value) {
  if (Array.isArray(value)) return value.map(stableObject);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableObject(value[key])]));
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stableObject(value));
}

function assertPhase(phase) {
  if (!["namua", "mtaji"].includes(phase)) throw new Error(`Unsupported phase: ${phase}`);
}

function normalizePreconditionTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length < 1 || tokens.length > 2) {
    throw new Error("preconditionTokens must contain one or two tokens");
  }
  const normalized = tokens.map((token) => {
    if (!token || typeof token.family !== "string" || typeof token.value !== "string") {
      throw new Error("Each precondition token must have string family/value");
    }
    if (!Object.hasOwn(PRECONDITION_TOKEN_FAMILIES, token.family)) {
      throw new Error(`Unknown precondition family: ${token.family}`);
    }
    if (!PRECONDITION_TOKEN_FAMILIES[token.family].includes(token.value)) {
      throw new Error(`Unsupported precondition value: ${token.family}=${token.value}`);
    }
    return { family: token.family, value: token.value };
  });
  if (new Set(normalized.map(({ family }) => family)).size !== normalized.length) {
    throw new Error("At most one precondition token per family is allowed");
  }
  return normalized.sort((a, b) =>
    a.family.localeCompare(b.family) || a.value.localeCompare(b.value));
}

function failureFamilyForToken(token) {
  const matches = Object.entries(FAILURE_TOKEN_FAMILIES)
    .filter(([, tokens]) => tokens.includes(token))
    .map(([family]) => family);
  if (matches.length !== 1) throw new Error(`Unknown or ambiguous failure token: ${token}`);
  return matches[0];
}

function matcherKey({ phase, preconditionTokens, moveAbstractionMode, moveAbstractionKey }) {
  assertPhase(phase);
  if (!MOVE_ABSTRACTION_MODES.includes(moveAbstractionMode)) {
    throw new Error(`Unsupported move abstraction mode: ${moveAbstractionMode}`);
  }
  if (typeof moveAbstractionKey !== "string" || !moveAbstractionKey) {
    throw new Error("moveAbstractionKey must be non-empty");
  }
  return stableStringify({
    phase,
    preconditionTokens: normalizePreconditionTokens(preconditionTokens),
    moveAbstractionMode,
    moveAbstractionKey,
  });
}

function candidateKey({ failureToken, ...matcher }) {
  failureFamilyForToken(failureToken);
  return stableStringify({
    matcher: JSON.parse(matcherKey(matcher)),
    failureToken,
  });
}

function patternComplexity({ preconditionTokens, moveAbstractionMode }) {
  const tokens = normalizePreconditionTokens(preconditionTokens);
  if (!MOVE_ABSTRACTION_MODES.includes(moveAbstractionMode)) {
    throw new Error(`Unsupported move abstraction mode: ${moveAbstractionMode}`);
  }
  return tokens.length + (moveAbstractionMode === "indexed" ? 1 : 0);
}

function d3InferiorEvent(candidate) {
  if (!candidate || typeof candidate.isTopSet !== "boolean"
      || typeof candidate.isBelowStateMedian !== "boolean"
      || !candidate.decisionLoss) {
    throw new Error("candidate must contain D3 top-set/median/decisionLoss fields");
  }
  const crossDomainWorse = candidate.decisionLoss.crossDomain === true
    && Number(candidate.decisionLoss.domainDrop) > 0;
  return candidate.isTopSet === false
    && (candidate.isBelowStateMedian === true || crossDomainWorse);
}

function supportIdentityHash(items) {
  if (!Array.isArray(items) || !items.length) throw new Error("support items must be non-empty");
  const tuples = items.map((item) => {
    for (const key of ["historicalTrajectoryHash", "ruleStateKey", "moveKey"]) {
      if (typeof item[key] !== "string" || !item[key]) throw new Error(`Missing support identity: ${key}`);
    }
    return `${item.historicalTrajectoryHash}|${item.ruleStateKey}|${item.moveKey}`;
  }).sort();
  return sha256Text(tuples.join("\n"));
}

function candidatePassesPromotion(summary, thresholds = PROMOTION) {
  const required = [
    "opportunityUniqueHistoricalTrajectories",
    "opportunityUniqueRuleStates",
    "failurePositiveUniqueHistoricalTrajectories",
    "distinctOpeningPrefixes",
    "maximumSingleOpeningPrefixShare",
    "generationStrata",
    "maximumSingleGenerationStratumShare",
    "failureSignatureRate",
    "d3InferiorRate",
    "d3TopSetRate",
    "medianNormalizedRankLoss",
  ];
  for (const field of required) {
    if (typeof summary[field] !== "number" || !Number.isFinite(summary[field])) {
      throw new Error(`Promotion summary missing finite numeric field: ${field}`);
    }
  }
  return (
    summary.opportunityUniqueHistoricalTrajectories >= thresholds.minimumOpportunityUniqueHistoricalTrajectories
    && summary.opportunityUniqueRuleStates >= thresholds.minimumOpportunityUniqueRuleStates
    && summary.failurePositiveUniqueHistoricalTrajectories >= thresholds.minimumFailurePositiveUniqueHistoricalTrajectories
    && summary.distinctOpeningPrefixes >= thresholds.minimumDistinctOpeningPrefixes
    && summary.maximumSingleOpeningPrefixShare <= thresholds.maximumSingleOpeningPrefixShare
    && summary.generationStrata >= thresholds.minimumGenerationStrata
    && summary.maximumSingleGenerationStratumShare <= thresholds.maximumSingleGenerationStratumShare
    && summary.failureSignatureRate >= thresholds.minimumFailureSignatureRate
    && summary.d3InferiorRate >= thresholds.minimumD3InferiorRate
    && summary.d3TopSetRate <= thresholds.maximumD3TopSetRate
    && summary.medianNormalizedRankLoss >= thresholds.minimumMedianNormalizedRankLoss
  );
}

module.exports = {
  FAILURE_TOKEN_FAMILIES,
  GAME_COUNT,
  MOVE_ABSTRACTION_MODES,
  PHASE_QUOTA,
  PRECONDITION_TOKEN_FAMILIES,
  PRIMARY_REFERENCE,
  PROMOTION,
  SEED_END,
  SEED_START,
  STAGE1_ID,
  candidateKey,
  candidatePassesPromotion,
  d3InferiorEvent,
  failureFamilyForToken,
  matcherKey,
  normalizePreconditionTokens,
  patternComplexity,
  sha256Text,
  stableStringify,
  supportIdentityHash,
};
