"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const EXPECTED_STRATA = {
  D1: { evaluationProfile: "bao", maxDepth: 1, pairedSeeds: 6500, seedRange: [20268001, 20274500] },
  D3: { evaluationProfile: "bao", maxDepth: 3, pairedSeeds: 4500, seedRange: [20268001, 20272500] },
  V2: { evaluationProfile: "bao-v2", maxDepth: 2, pairedSeeds: 2000, seedRange: [20268001, 20270000] },
};

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
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

function stratumById(config, id) {
  const stratum = config.corpus.strata.find((item) => item.stratumId === id);
  if (!stratum) throw new Error(`Unknown E-019 stratum: ${id}`);
  return stratum;
}

function conditionById(config, id) {
  for (const stratum of config.corpus.strata) {
    const condition = stratum.conditions.find((item) => item.conditionId === id);
    if (condition) return { ...condition, stratumId: stratum.stratumId, evaluationProfile: stratum.evaluationProfile, maxDepth: stratum.maxDepth };
  }
  throw new Error(`Unknown E-019 condition: ${id}`);
}

function allConditions(config) {
  return config.corpus.strata.flatMap((stratum) => stratum.conditions.map((condition) => ({
    ...condition,
    stratumId: stratum.stratumId,
    evaluationProfile: stratum.evaluationProfile,
    maxDepth: stratum.maxDepth,
    pairedSeeds: stratum.pairedSeeds,
    seedRange: stratum.seedRange,
  })));
}

function validatePreregistration(config) {
  if (!config || typeof config !== "object") throw new Error("Invalid preregistration");
  if (config.experimentId !== "E-019") throw new Error("Expected E-019 preregistration");
  if (config.analysisVersion !== "17-search-profile-generalization") throw new Error("Unexpected E-019 analysisVersion");
  if (config.status !== "preregistered-not-run") throw new Error("E-019 must remain preregistered-not-run before formal execution");
  if (config.hypothesisId !== "H17") throw new Error("E-019 must test H17");

  const corpus = config.corpus;
  if (!corpus || corpus.level !== "hard") throw new Error("E-019 corpus must use hard level");
  if (corpus.pairedOpeningRequiredWithinStratum !== true) throw new Error("Within-stratum paired openings are required");
  if (!Array.isArray(corpus.strata) || corpus.strata.length !== 3) throw new Error("E-019 requires exactly three strata");

  const ids = corpus.strata.map((stratum) => stratum.stratumId);
  if (canonicalJson(ids) !== canonicalJson(["D1", "D3", "V2"])) throw new Error("E-019 strata must be D1, D3, V2 in preregistered order");

  let totalPairs = 0;
  let totalGames = 0;
  const conditionIds = new Set();
  for (const stratum of corpus.strata) {
    const expected = EXPECTED_STRATA[stratum.stratumId];
    if (stratum.evaluationProfile !== expected.evaluationProfile) throw new Error(`${stratum.stratumId}: evaluator changed`);
    if (stratum.maxDepth !== expected.maxDepth) throw new Error(`${stratum.stratumId}: depth changed`);
    if (stratum.pairedSeeds !== expected.pairedSeeds) throw new Error(`${stratum.stratumId}: paired sample size changed`);
    validateRange(stratum.seedRange, `${stratum.stratumId}.seedRange`, stratum.pairedSeeds);
    if (canonicalJson(stratum.seedRange) !== canonicalJson(expected.seedRange)) throw new Error(`${stratum.stratumId}: formal seed range changed`);
    if (!Array.isArray(stratum.conditions) || stratum.conditions.length !== 2) throw new Error(`${stratum.stratumId}: exactly two search conditions required`);
    const p2 = stratum.conditions.find((condition) => condition.conditionId === `${stratum.stratumId}-P2`);
    const lg = stratum.conditions.find((condition) => condition.conditionId === `${stratum.stratumId}-LG`);
    if (!p2 || p2.searchProfile !== "phase2") throw new Error(`${stratum.stratumId}: phase2 condition mismatch`);
    if (!lg || lg.searchProfile !== "legacy") throw new Error(`${stratum.stratumId}: legacy condition mismatch`);
    for (const condition of stratum.conditions) {
      if (conditionIds.has(condition.conditionId)) throw new Error(`Duplicate condition: ${condition.conditionId}`);
      conditionIds.add(condition.conditionId);
    }
    totalPairs += stratum.pairedSeeds;
    totalGames += stratum.pairedSeeds * 2;
  }
  if (totalPairs !== 13000 || corpus.totalPairedComparisonsAcrossStrata !== 13000) throw new Error("E-019 total paired comparisons changed");
  if (totalGames !== 26000 || corpus.totalGames !== 26000) throw new Error("E-019 total games changed");

  const independence = config.independence || {};
  validateRange(independence.newMasterSeedRange, "newMasterSeedRange", 6500);
  if (canonicalJson(independence.newMasterSeedRange) !== canonicalJson([20268001, 20274500])) throw new Error("E-019 master seed range changed");
  if (independence.overlapWithPriorFormalOrExploratoryBlocksAllowed !== false) throw new Error("Prior-block overlap must remain disallowed");
  if (independence.crossStratumOverlapWithinE019Allowed !== true) throw new Error("Nested cross-stratum seed design must remain enabled");
  if (independence.postStartThresholdRelaxationAllowed !== false) throw new Error("Post-start relaxation must remain disabled");
  if (!Array.isArray(independence.excludedSeedRanges)) throw new Error("Missing excluded seed ranges");
  for (const range of independence.excludedSeedRanges) {
    validateRange(range, "excludedSeedRange");
    if (rangesOverlap(range, independence.newMasterSeedRange)) throw new Error("E-019 formal seed range overlaps prior experiment");
  }

  const endpoint = config.primaryEndpoint || {};
  if (endpoint.test !== "two-sided exact McNemar test on discordant pairs") throw new Error("Unexpected E-019 primary test");
  if (endpoint.componentAlpha !== 0.05) throw new Error("E-019 component alpha must remain 0.05");
  if (endpoint.minimumDiscordantPairsPerStratum !== 20) throw new Error("E-019 minimum discordant pairs must remain 20");
  if (config.primaryPopulation?.minimumPliesRemaining !== 9) throw new Error("E-019 primary population changed");
  if (config.individualStandaloneInference?.method !== "Holm-Bonferroni over the three exact McNemar p-values") throw new Error("E-019 Holm standalone rule changed");
  if (!String(config.globalDecisionRule?.framework || "").includes("intersection-union test")) throw new Error("E-019 global IUT rule missing");
  if (config.structuralSecondaryEndpoint?.status !== "preregistered-secondary-only") throw new Error("E-019 structural endpoint must remain secondary");
  if (!String(config.structuralSecondaryEndpoint?.decisionBoundary || "").includes("never replace")) throw new Error("E-019 primary/secondary boundary changed");
  if (config.executionPolicy?.githubActionsFormalRunAllowed !== false
      || config.executionPolicy?.formalExecutionApproved !== false
      || config.executionPolicy?.formalCorpusGenerated !== false) {
    throw new Error("E-019 formal execution must remain disabled during infrastructure work");
  }
  return config;
}

function loadPreregistration(filePath) {
  const resolved = path.resolve(filePath);
  const text = fs.readFileSync(resolved, "utf8");
  return { path: resolved, text, sha256: sha256(text), config: validatePreregistration(JSON.parse(text)) };
}

function fixtureRangeAllowed(config, baseSeed, games) {
  assertInteger(baseSeed, "fixtureBaseSeed");
  assertInteger(games, "fixtureGames", 1);
  const range = [baseSeed, baseSeed + games - 1];
  if (rangesOverlap(range, config.independence.newMasterSeedRange)) return false;
  return !config.independence.excludedSeedRanges.some((excluded) => rangesOverlap(range, excluded));
}

module.exports = {
  EXPECTED_STRATA,
  allConditions,
  canonicalJson,
  conditionById,
  fixtureRangeAllowed,
  loadPreregistration,
  rangesOverlap,
  sha256,
  stratumById,
  validatePreregistration,
  validateRange,
};
