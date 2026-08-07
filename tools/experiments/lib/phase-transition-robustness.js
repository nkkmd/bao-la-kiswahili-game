"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ALLOWED_LEVELS = new Set(["easy", "normal", "hard", "expert"]);
const ALLOWED_EVALUATORS = new Set(["legacy", "bao", "bao-v2"]);
const ALLOWED_SEARCHES = new Set(["legacy", "phase2", "mcts"]);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function assertInteger(value, name, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function rangesOverlap([leftStart, leftEnd], [rightStart, rightEnd]) {
  return leftStart <= rightEnd && rightStart <= leftEnd;
}

function validateSeedRange(range, name, expectedLength = null) {
  if (!Array.isArray(range) || range.length !== 2) {
    throw new Error(`Invalid ${name}`);
  }
  const [start, end] = range;
  assertInteger(start, `${name}[0]`);
  assertInteger(end, `${name}[1]`);
  if (end < start) throw new Error(`Invalid ${name}: end before start`);
  if (expectedLength !== null && end - start + 1 !== expectedLength) {
    throw new Error(`${name} length does not match gamesPerCondition`);
  }
}

function validateCondition(condition, seen) {
  if (!condition || typeof condition !== "object") throw new Error("Invalid condition");
  if (!/^[A-Z][A-Z0-9_-]*$/.test(condition.id || "")) {
    throw new Error(`Invalid condition id: ${condition.id}`);
  }
  if (seen.has(condition.id)) throw new Error(`Duplicate condition id: ${condition.id}`);
  seen.add(condition.id);
  if (!ALLOWED_LEVELS.has(condition.level)) {
    throw new Error(`Invalid level for ${condition.id}: ${condition.level}`);
  }
  if (!ALLOWED_EVALUATORS.has(condition.evaluationProfile)) {
    throw new Error(`Invalid evaluator for ${condition.id}: ${condition.evaluationProfile}`);
  }
  if (!ALLOWED_SEARCHES.has(condition.searchProfile)) {
    throw new Error(`Invalid search profile for ${condition.id}: ${condition.searchProfile}`);
  }
  assertInteger(condition.maxDepth, `${condition.id}.maxDepth`, 1);
}

function validatePreregistration(config) {
  if (!config || typeof config !== "object") throw new Error("Invalid preregistration");
  if (config.experimentId !== "E-011") throw new Error("Expected E-011 preregistration");
  if (config.status !== "preregistered") throw new Error("E-011 must remain preregistered");
  if (!config.corpus || typeof config.corpus !== "object") throw new Error("Missing corpus");
  assertInteger(config.corpus.gamesPerCondition, "gamesPerCondition", 1);
  assertInteger(config.corpus.sharedBaseSeed, "sharedBaseSeed", 0);
  validateSeedRange(
    config.corpus.sharedSeedRange,
    "corpus.sharedSeedRange",
    config.corpus.gamesPerCondition,
  );
  if (config.corpus.sharedSeedRange[0] !== config.corpus.sharedBaseSeed) {
    throw new Error("sharedBaseSeed must equal the first shared seed");
  }
  if (!config.corpus.pairedOpeningSeedsAcrossConditions) {
    throw new Error("E-011 requires paired opening seeds across conditions");
  }
  if (!Array.isArray(config.conditions) || config.conditions.length < 2) {
    throw new Error("E-011 requires multiple conditions");
  }
  const seen = new Set();
  for (const condition of config.conditions) validateCondition(condition, seen);
  if (!seen.has("C0")) throw new Error("E-011 requires reference condition C0");
  const reference = config.conditions.find((condition) => condition.id === "C0");
  if (reference.role !== "reference") throw new Error("C0 must be the reference condition");

  const independence = config.independence || {};
  validateSeedRange(independence.exploratorySeedRange, "exploratorySeedRange");
  validateSeedRange(independence.confirmationSeedRange, "confirmationSeedRange");
  validateSeedRange(
    independence.robustnessSeedRange,
    "robustnessSeedRange",
    config.corpus.gamesPerCondition,
  );
  if (independence.overlapAllowed !== false) {
    throw new Error("Seed overlap must remain disallowed");
  }
  for (const prior of [
    independence.exploratorySeedRange,
    independence.confirmationSeedRange,
  ]) {
    if (rangesOverlap(prior, independence.robustnessSeedRange)) {
      throw new Error("E-011 seed range overlaps a prior experiment");
    }
  }
  if (canonicalJson(independence.robustnessSeedRange)
      !== canonicalJson(config.corpus.sharedSeedRange)) {
    throw new Error("Corpus and independence robustness seed ranges differ");
  }

  const criteria = config.conditionSuccessCriteria;
  if (!criteria) throw new Error("Missing conditionSuccessCriteria");
  assertInteger(criteria.minimumPrimaryCandidateCount, "minimumPrimaryCandidateCount", 1);
  assertInteger(criteria.minimumExpansionCandidateCount, "minimumExpansionCandidateCount", 1);
  assertInteger(criteria.minimumControlPointCount, "minimumControlPointCount", 1);
  if (!(criteria.minimumRiskRatio > 0)) throw new Error("Invalid minimumRiskRatio");
  if (criteria.requireCandidateRateGreaterThanControlRate !== true) {
    throw new Error("Candidate rate direction criterion must remain enabled");
  }
  return config;
}

function loadPreregistration(filePath) {
  const resolved = path.resolve(filePath);
  const text = fs.readFileSync(resolved, "utf8");
  return {
    path: resolved,
    text,
    sha256: sha256(text),
    config: validatePreregistration(JSON.parse(text)),
  };
}

function conditionById(config, id) {
  const condition = config.conditions.find((item) => item.id === id);
  if (!condition) throw new Error(`Unknown E-011 condition: ${id}`);
  return condition;
}

function conditionStatus(result) {
  if (!result || result.decision === "inconclusive") return "inconclusive";
  const checks = result.checks || {};
  const countChecks = [
    checks.minimumPrimaryCandidateCount,
    checks.minimumExpansionCandidateCount,
    checks.minimumControlPointCount,
  ];
  if (countChecks.some((value) => value !== true)) return "insufficient";
  const effectChecks = [
    checks.minimumRiskRatio,
    checks.candidateRateGreaterThanControlRate,
  ];
  return effectChecks.every((value) => value === true) ? "pass" : "fail";
}

function globalDecision(config, conditionResults) {
  const byId = new Map(conditionResults.map((item) => [item.conditionId, item]));
  const expectedIds = config.conditions.map((condition) => condition.id);
  if (expectedIds.some((id) => !byId.has(id))) return "inconclusive";
  const reference = byId.get("C0");
  const perturbations = expectedIds.filter((id) => id !== "C0").map((id) => byId.get(id));
  const reversed = [...byId.values()].some((item) => {
    const ratio = item.result?.rates?.riskRatio;
    return Number.isFinite(ratio) && ratio <= 1
      && !["insufficient", "inconclusive"].includes(item.status);
  });
  const perturbationFailures = perturbations.filter((item) => item.status === "fail").length;
  const perturbationPasses = perturbations.filter((item) => item.status === "pass").length;

  if (reference.status === "fail" || perturbationFailures >= 2 || reversed) {
    return "not-robust";
  }
  if (reference.status === "pass" && perturbationPasses === perturbations.length) {
    return "robust";
  }
  if (reference.status === "pass"
      && perturbationPasses >= Math.max(1, perturbations.length - 1)
      && perturbationFailures === 0
      && perturbations.every((item) => ["pass", "insufficient"].includes(item.status))) {
    return "partially-robust";
  }
  return "inconclusive";
}

function stableConditionProjection(config) {
  return {
    study: config.study,
    studyVersion: config.studyVersion,
    schemaVersion: config.schemaVersion,
    profile: config.profile,
    games: config.games,
    baseSeed: config.baseSeed,
    maxPly: config.maxPly,
    opening: config.opening,
  };
}

module.exports = {
  canonicalJson,
  conditionById,
  conditionStatus,
  globalDecision,
  loadPreregistration,
  rangesOverlap,
  sha256,
  stableConditionProjection,
  validatePreregistration,
};
