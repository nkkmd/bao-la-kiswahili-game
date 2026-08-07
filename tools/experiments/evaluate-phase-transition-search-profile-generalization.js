#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E018Evaluator = require("./evaluate-phase-transition-search-profile-dependence.js");
const E019 = require("./lib/phase-transition-search-profile-generalization.js");

function pairedCounts(pairs) {
  return E018Evaluator.pairedCounts(pairs);
}

function rate(numerator, denominator) {
  return denominator === 0 ? null : numerator / denominator;
}

function evaluateStratum(config, stratum, pairs) {
  if (!Array.isArray(pairs)) throw new Error(`${stratum.stratumId}: pairs must be an array`);
  const counts = pairedCounts(pairs);
  const pairCount = pairs.length;
  const discordantPairs = counts.n10 + counts.n01;
  const pValue = E018Evaluator.exactMcNemarTwoSided(counts.n10, counts.n01);
  const p2EventGames = counts.n10 + counts.n11;
  const lgEventGames = counts.n01 + counts.n11;
  const p2Rate = rate(p2EventGames, pairCount);
  const lgRate = rate(lgEventGames, pairCount);
  const checks = {
    exactPairCount: pairCount === stratum.pairedSeeds,
    minimumDiscordantPairs: discordantPairs >= config.primaryEndpoint.minimumDiscordantPairsPerStratum,
    exactMcNemarAlpha: pValue <= config.primaryEndpoint.componentAlpha,
    directionP2GreaterThanLG: counts.n10 > counts.n01,
  };
  let decision;
  if (!checks.exactPairCount) decision = "inconclusive";
  else if (!checks.minimumDiscordantPairs) decision = "insufficient";
  else if (checks.exactMcNemarAlpha && checks.directionP2GreaterThanLG) decision = "pass";
  else decision = "fail";
  return {
    stratumId: stratum.stratumId,
    decision,
    pairCount,
    counts,
    discordantPairs,
    rates: {
      P2: p2Rate,
      LG: lgRate,
      pairedRiskDifference: p2Rate === null || lgRate === null ? null : p2Rate - lgRate,
    },
    discordantOddsRatio: counts.n01 === 0 ? null : counts.n10 / counts.n01,
    discordantOddsRatioLabel: counts.n01 === 0 && counts.n10 > 0 ? "Infinity" : null,
    exactMcNemarTwoSidedP: pValue,
    checks,
  };
}

function holmAdjusted(pValuesById) {
  const entries = Object.entries(pValuesById);
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  const m = sorted.length;
  const adjusted = {};
  let runningMaximum = 0;
  for (let index = 0; index < sorted.length; index += 1) {
    const [id, p] = sorted[index];
    const value = Math.min(1, (m - index) * p);
    runningMaximum = Math.max(runningMaximum, value);
    adjusted[id] = runningMaximum;
  }
  return adjusted;
}

function globalDecision(stratumResults) {
  const decisions = Object.values(stratumResults).map((result) => result.decision);
  if (decisions.every((decision) => decision === "pass")) return "confirmed";
  if (decisions.some((decision) => decision === "fail")) return "not-confirmed";
  return "inconclusive";
}

function evaluate(config, pairsByStratum) {
  const strata = {};
  for (const stratum of config.corpus.strata) {
    if (!Object.prototype.hasOwnProperty.call(pairsByStratum, stratum.stratumId)) {
      throw new Error(`Missing paired endpoint set for ${stratum.stratumId}`);
    }
    strata[stratum.stratumId] = evaluateStratum(config, stratum, pairsByStratum[stratum.stratumId]);
  }
  const rawP = Object.fromEntries(Object.entries(strata).map(([id, result]) => [id, result.exactMcNemarTwoSidedP]));
  const adjusted = holmAdjusted(rawP);
  for (const [id, result] of Object.entries(strata)) {
    result.holmAdjustedP = adjusted[id];
    result.standaloneHolmConfirmed = result.decision === "pass"
      && adjusted[id] <= config.individualStandaloneInference.familyAlpha;
  }
  const decision = globalDecision(strata);
  return {
    experimentId: config.experimentId,
    analysisVersion: config.analysisVersion,
    hypothesisId: config.hypothesisId,
    globalDecision: decision,
    globalFramework: "intersection-union test",
    componentAlpha: config.primaryEndpoint.componentAlpha,
    holmFamilyAlpha: config.individualStandaloneInference.familyAlpha,
    strata,
    interpretationBoundary: config.interpretationBoundary,
    structuralSecondaryMayChangePrimaryDecision: false,
  };
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-generalization-v2.json",
    pairs: null,
    output: "artifacts/local/search-profile-generalization-v2-fixture/evaluation",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--pairs") options.pairs = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!options.pairs) throw new Error("--pairs is required; evaluator does not generate corpus data");
  return options;
}

function run(options) {
  const loaded = E019.loadPreregistration(options.config);
  const input = JSON.parse(fs.readFileSync(path.resolve(options.pairs), "utf8"));
  if (input.experimentId !== "E-019" || !input.strata) throw new Error("Invalid E-019 paired endpoint input");
  const result = evaluate(loaded.config, input.strata);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "search-profile-generalization-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (require.main === module) {
  try { run(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = {
  evaluate,
  evaluateStratum,
  globalDecision,
  holmAdjusted,
  pairedCounts,
  parseArgs,
  run,
};
