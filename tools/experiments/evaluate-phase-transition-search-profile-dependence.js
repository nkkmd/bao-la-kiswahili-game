#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E018 = require("./lib/phase-transition-search-profile-dependence.js");

const LOG2 = Math.log(2);

function logChoose(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) return -Infinity;
  const m = Math.min(k, n - k);
  let value = 0;
  for (let i = 1; i <= m; i += 1) {
    value += Math.log(n - m + i) - Math.log(i);
  }
  return value;
}

function logSumExp(values) {
  if (!values.length) return -Infinity;
  const maximum = Math.max(...values);
  if (!Number.isFinite(maximum)) return maximum;
  let sum = 0;
  for (const value of values) sum += Math.exp(value - maximum);
  return maximum + Math.log(sum);
}

function exactMcNemarTwoSided(n10, n01) {
  if (!Number.isInteger(n10) || n10 < 0 || !Number.isInteger(n01) || n01 < 0) {
    throw new Error("McNemar counts must be non-negative integers");
  }
  const n = n10 + n01;
  if (n === 0) return 1;
  const lower = Math.min(n10, n01);
  const logs = [];
  for (let k = 0; k <= lower; k += 1) {
    logs.push(logChoose(n, k) - n * LOG2);
  }
  const lowerTail = Math.exp(logSumExp(logs));
  return Math.min(1, 2 * lowerTail);
}

function pairedCounts(pairs) {
  const counts = { n00: 0, n01: 0, n10: 0, n11: 0 };
  const seeds = new Set();
  for (const pair of pairs) {
    if (!Number.isInteger(pair.seed)) throw new Error("Each pair requires an integer seed");
    if (seeds.has(pair.seed)) throw new Error(`Duplicate paired seed: ${pair.seed}`);
    seeds.add(pair.seed);
    if (typeof pair.P2 !== "boolean" || typeof pair.LG !== "boolean") {
      throw new Error(`Pair ${pair.seed} requires boolean P2 and LG endpoints`);
    }
    if (pair.P2 && pair.LG) counts.n11 += 1;
    else if (pair.P2) counts.n10 += 1;
    else if (pair.LG) counts.n01 += 1;
    else counts.n00 += 1;
  }
  return counts;
}

function rate(numerator, denominator) {
  return denominator === 0 ? null : numerator / denominator;
}

function evaluate(config, pairs) {
  const counts = pairedCounts(pairs);
  const pairCount = pairs.length;
  const expectedPairs = config.corpus.gamesPerCondition;
  const discordantPairs = counts.n10 + counts.n01;
  const pValue = exactMcNemarTwoSided(counts.n10, counts.n01);
  const p2EventGames = counts.n10 + counts.n11;
  const lgEventGames = counts.n01 + counts.n11;
  const p2Rate = rate(p2EventGames, pairCount);
  const lgRate = rate(lgEventGames, pairCount);
  const checks = {
    exactPairCount: pairCount === expectedPairs,
    minimumDiscordantPairs: discordantPairs >= config.primaryEndpoint.minimumDiscordantPairs,
    exactMcNemarAlpha: pValue <= config.primaryEndpoint.alpha,
    directionP2GreaterThanLG: counts.n10 > counts.n01,
  };
  let decision;
  if (!checks.exactPairCount || !checks.minimumDiscordantPairs) decision = "inconclusive";
  else if (checks.exactMcNemarAlpha && checks.directionP2GreaterThanLG) decision = "confirmed";
  else decision = "not-confirmed";

  return {
    experimentId: config.experimentId,
    analysisVersion: config.analysisVersion,
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

function hypergeomLogProbability(a, b, c, d) {
  const row1 = a + b;
  const row2 = c + d;
  const col1 = a + c;
  const total = row1 + row2;
  return logChoose(col1, a) + logChoose(total - col1, row1 - a) - logChoose(total, row1);
}

function fisherExactTwoSided(a, b, c, d) {
  for (const value of [a, b, c, d]) {
    if (!Number.isInteger(value) || value < 0) throw new Error("Fisher table counts must be non-negative integers");
  }
  const row1 = a + b;
  const row2 = c + d;
  const col1 = a + c;
  const total = row1 + row2;
  if (total === 0) return 1;
  const minimumA = Math.max(0, row1 - (total - col1));
  const maximumA = Math.min(row1, col1);
  const observedLog = hypergeomLogProbability(a, b, c, d);
  const includedLogs = [];
  for (let x = minimumA; x <= maximumA; x += 1) {
    const y = row1 - x;
    const z = col1 - x;
    const w = row2 - z;
    const logProbability = hypergeomLogProbability(x, y, z, w);
    if (logProbability <= observedLog + 1e-12) includedLogs.push(logProbability);
  }
  return Math.min(1, Math.exp(logSumExp(includedLogs)));
}

function structuralComparison(p2Candidates, p2Expansion, lgCandidates, lgExpansion) {
  const values = [p2Candidates, p2Expansion, lgCandidates, lgExpansion];
  if (values.some((value) => !Number.isInteger(value) || value < 0)) {
    throw new Error("Structural counts must be non-negative integers");
  }
  if (p2Expansion > p2Candidates || lgExpansion > lgCandidates) {
    throw new Error("Expansion count cannot exceed candidate count");
  }
  const p2Rate = rate(p2Expansion, p2Candidates);
  const lgRate = rate(lgExpansion, lgCandidates);
  const riskRatio = p2Rate === null || lgRate === null || lgRate === 0 ? null : p2Rate / lgRate;
  return {
    counts: { p2Candidates, p2Expansion, lgCandidates, lgExpansion },
    rates: { P2: p2Rate, LG: lgRate },
    riskDifference: p2Rate === null || lgRate === null ? null : p2Rate - lgRate,
    riskRatio,
    riskRatioLabel: lgRate === 0 && p2Rate !== null && p2Rate > 0 ? "Infinity" : null,
    fisherExactTwoSidedP: fisherExactTwoSided(
      p2Expansion,
      p2Candidates - p2Expansion,
      lgExpansion,
      lgCandidates - lgExpansion,
    ),
  };
}

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-dependence-v1.json",
    pairs: null,
    output: "artifacts/phase-transition/search-profile-dependence-v1-fixture/evaluation",
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
  if (!options.pairs) throw new Error("--pairs is required; evaluator does not generate formal data");
  return options;
}

function run(options) {
  const loaded = E018.loadPreregistration(options.config);
  const pairs = JSON.parse(fs.readFileSync(path.resolve(options.pairs), "utf8"));
  if (!Array.isArray(pairs)) throw new Error("Pairs input must be a JSON array");
  const result = evaluate(loaded.config, pairs);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "search-profile-dependence-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (result.decision === "inconclusive") process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try {
    run(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  evaluate,
  exactMcNemarTwoSided,
  fisherExactTwoSided,
  hypergeomLogProbability,
  logChoose,
  logSumExp,
  pairedCounts,
  parseArgs,
  run,
  structuralComparison,
};
