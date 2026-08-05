"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

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
  if (!Number.isInteger(value) || value < minimum) throw new Error(`Invalid ${name}: ${value}`);
}

function validateRange(range, name, expectedLength = null) {
  if (!Array.isArray(range) || range.length !== 2) throw new Error(`Invalid ${name}`);
  const [start, end] = range;
  assertInteger(start, `${name}[0]`);
  assertInteger(end, `${name}[1]`);
  if (end < start) throw new Error(`${name}: end before start`);
  if (expectedLength !== null && end - start + 1 !== expectedLength) throw new Error(`${name} length mismatch`);
}

function rangesOverlap([a0, a1], [b0, b1]) {
  return a0 <= b1 && b0 <= a1;
}

function conditionById(config, id) {
  const condition = config.corpus.conditions.find((item) => item.conditionId === id);
  if (!condition) throw new Error(`Unknown E-020 condition: ${id}`);
  return condition;
}

function validatePreregistration(config) {
  if (!config || typeof config !== "object") throw new Error("Invalid preregistration");
  if (config.experimentId !== "E-020") throw new Error("Expected E-020 preregistration");
  if (config.hypothesisId !== "H18") throw new Error("Expected H18 hypothesis");
  if (config.analysisVersion !== "18-d3-reversal-replication") throw new Error("Unexpected E-020 analysisVersion");
  if (config.status !== "preregistered-not-run") throw new Error("E-020 preregistration status must remain preregistered-not-run");

  const corpus = config.corpus || {};
  assertInteger(corpus.pairedSeeds, "pairedSeeds", 1);
  assertInteger(corpus.gamesPerCondition, "gamesPerCondition", 1);
  if (corpus.pairedSeeds !== corpus.gamesPerCondition) throw new Error("pairedSeeds must equal gamesPerCondition");
  if (corpus.totalGames !== corpus.gamesPerCondition * 2) throw new Error("totalGames mismatch");
  validateRange(corpus.seedRange, "seedRange", corpus.gamesPerCondition);
  if (corpus.level !== "hard") throw new Error("E-020 level must remain hard");
  if (corpus.evaluationProfile !== "bao") throw new Error("E-020 evaluator must remain bao");
  if (corpus.maxDepth !== 3) throw new Error("E-020 maxDepth must remain 3");
  if (corpus.pairedOpeningRequired !== true) throw new Error("pairedOpeningRequired must remain true");
  if (!Array.isArray(corpus.conditions) || corpus.conditions.length !== 2) throw new Error("E-020 requires exactly two conditions");
  if (conditionById(config, "P2").searchProfile !== "phase2") throw new Error("P2 must use phase2 search");
  if (conditionById(config, "LG").searchProfile !== "legacy") throw new Error("LG must use legacy search");

  const independence = config.independence || {};
  if (independence.overlapWithPriorFormalOrExploratoryBlocksAllowed !== false) throw new Error("Prior seed overlap must remain forbidden");
  validateRange(independence.newSeedRange, "newSeedRange", corpus.gamesPerCondition);
  if (canonicalJson(independence.newSeedRange) !== canonicalJson(corpus.seedRange)) throw new Error("newSeedRange must equal corpus.seedRange");
  if (!Array.isArray(independence.excludedSeedRanges)) throw new Error("Missing excludedSeedRanges");
  for (const range of independence.excludedSeedRanges) {
    validateRange(range, "excludedSeedRange");
    if (rangesOverlap(range, corpus.seedRange)) throw new Error("E-020 seed range overlaps a prior block");
  }
  if (independence.postStartThresholdRelaxationAllowed !== false) throw new Error("Post-start threshold relaxation must remain disabled");

  const endpoint = config.primaryEndpoint || {};
  if (endpoint.test !== "two-sided exact McNemar test on discordant pairs") throw new Error("Unexpected primary test");
  if (endpoint.alpha !== 0.05) throw new Error("E-020 alpha must remain 0.05");
  if (endpoint.minimumDiscordantPairs !== 20) throw new Error("E-020 minimum discordants must remain 20");
  if (endpoint.directionRequirement !== "legacy-only discordant pairs must exceed phase2-only discordant pairs") {
    throw new Error("E-020 prospective direction changed");
  }
  if (config.structuralSecondaryEndpoint?.decisionBoundary?.includes("never replace") !== true) {
    throw new Error("Structural secondary decision boundary is missing");
  }
  if (config.executionPolicy?.githubActionsFormalRunAllowed !== false
      || config.executionPolicy?.formalExecutionApproved !== false
      || config.executionPolicy?.formalCorpusGenerated !== false) {
    throw new Error("E-020 formal execution must remain disabled during infrastructure work");
  }
  return config;
}

function loadPreregistration(filePath) {
  const resolved = path.resolve(filePath);
  const text = fs.readFileSync(resolved, "utf8");
  return { path: resolved, text, sha256: sha256(text), config: validatePreregistration(JSON.parse(text)) };
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
