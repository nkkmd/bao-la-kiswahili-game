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

function validateRange(range, name, expectedLength = null) {
  if (!Array.isArray(range) || range.length !== 2) throw new Error(`Invalid ${name}`);
  const [start, end] = range;
  assertInteger(start, `${name}[0]`);
  assertInteger(end, `${name}[1]`);
  if (end < start) throw new Error(`${name}: end before start`);
  if (expectedLength !== null && end - start + 1 !== expectedLength) {
    throw new Error(`${name} length mismatch`);
  }
}

function rangesOverlap([a0, a1], [b0, b1]) {
  return a0 <= b1 && b0 <= a1;
}

function conditionById(config, id) {
  const condition = config.corpus.conditions.find((item) => item.conditionId === id);
  if (!condition) throw new Error(`Unknown E-018 condition: ${id}`);
  return condition;
}

function validatePreregistration(config) {
  if (!config || typeof config !== "object") throw new Error("Invalid preregistration");
  if (config.experimentId !== "E-018") throw new Error("Expected E-018 preregistration");
  if (config.analysisVersion !== "16-search-profile-dependence") {
    throw new Error("Unexpected E-018 analysisVersion");
  }
  if (config.status !== "preregistered-not-run") {
    throw new Error("E-018 must remain preregistered-not-run before formal execution");
  }
  const corpus = config.corpus;
  if (!corpus || typeof corpus !== "object") throw new Error("Missing corpus");
  assertInteger(corpus.gamesPerCondition, "gamesPerCondition", 1);
  assertInteger(corpus.totalGames, "totalGames", 2);
  if (corpus.totalGames !== corpus.gamesPerCondition * 2) {
    throw new Error("totalGames must equal two conditions times gamesPerCondition");
  }
  assertInteger(corpus.sharedBaseSeed, "sharedBaseSeed");
  validateRange(corpus.sharedSeedRange, "sharedSeedRange", corpus.gamesPerCondition);
  if (corpus.sharedSeedRange[0] !== corpus.sharedBaseSeed) {
    throw new Error("sharedBaseSeed must equal sharedSeedRange[0]");
  }
  if (!ALLOWED_LEVELS.has(corpus.level)) throw new Error(`Invalid level: ${corpus.level}`);
  if (!ALLOWED_EVALUATORS.has(corpus.evaluationProfile)) {
    throw new Error(`Invalid evaluationProfile: ${corpus.evaluationProfile}`);
  }
  assertInteger(corpus.maxDepth, "maxDepth", 1);
  if (corpus.pairedOpeningRequired !== true) throw new Error("pairedOpeningRequired must be true");
  if (!Array.isArray(corpus.conditions) || corpus.conditions.length !== 2) {
    throw new Error("E-018 requires exactly two conditions");
  }
  const ids = new Set();
  for (const condition of corpus.conditions) {
    if (!/^[A-Z][A-Z0-9_-]*$/.test(condition.conditionId || "")) {
      throw new Error(`Invalid conditionId: ${condition.conditionId}`);
    }
    if (ids.has(condition.conditionId)) throw new Error(`Duplicate condition: ${condition.conditionId}`);
    ids.add(condition.conditionId);
    if (!ALLOWED_SEARCHES.has(condition.searchProfile)) {
      throw new Error(`Invalid search profile: ${condition.searchProfile}`);
    }
  }
  if (!ids.has("P2") || !ids.has("LG")) throw new Error("E-018 requires P2 and LG conditions");
  if (conditionById(config, "P2").searchProfile !== "phase2") {
    throw new Error("P2 must use phase2 search");
  }
  if (conditionById(config, "LG").searchProfile !== "legacy") {
    throw new Error("LG must use legacy search");
  }

  const independence = config.independence || {};
  if (independence.overlapAllowed !== false) throw new Error("Seed overlap must remain disallowed");
  if (!Array.isArray(independence.excludedSeedRanges)) {
    throw new Error("Missing excludedSeedRanges");
  }
  for (const range of independence.excludedSeedRanges) {
    validateRange(range, "excludedSeedRange");
    if (rangesOverlap(range, corpus.sharedSeedRange)) {
      throw new Error("E-018 seed range overlaps prior experiment");
    }
  }
  if (independence.postStartThresholdRelaxationAllowed !== false) {
    throw new Error("Post-start threshold relaxation must remain disabled");
  }

  const endpoint = config.primaryEndpoint || {};
  if (endpoint.test !== "two-sided exact McNemar test on discordant pairs") {
    throw new Error("Unexpected primary test");
  }
  if (endpoint.alpha !== 0.05) throw new Error("E-018 alpha must remain 0.05");
  assertInteger(endpoint.minimumDiscordantPairs, "minimumDiscordantPairs", 1);
  if (endpoint.minimumDiscordantPairs !== 20) {
    throw new Error("E-018 minimum discordant pairs must remain 20");
  }
  if (config.structuralSecondaryEndpoint?.legacyExpansionMinimumRequired !== false) {
    throw new Error("E-018 must not require a minimum LG expansion count");
  }
  if (config.executionPolicy?.githubActionsFormalRunAllowed !== false
      || config.executionPolicy?.formalExecutionApproved !== false
      || config.executionPolicy?.formalCorpusGenerated !== false) {
    throw new Error("E-018 formal execution must remain disabled during preregistration infrastructure work");
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

module.exports = {
  canonicalJson,
  conditionById,
  loadPreregistration,
  rangesOverlap,
  sha256,
  validatePreregistration,
  validateRange,
};
