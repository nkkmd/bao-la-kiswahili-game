#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

function integerArg(value, name, minimum = 0) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function numberArg(value, name, minimum = 0) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function parseArgs(argv) {
  const options = {
    input: null,
    candidate: null,
    minScore: 0.5,
    minGames: 500,
    minWilson: 0.5,
    maxTacticalFailures: 0,
    output: null,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--input") options.input = value;
    else if (arg === "--candidate") options.candidate = value;
    else if (arg === "--min-score") options.minScore = numberArg(value, arg);
    else if (arg === "--min-games") options.minGames = integerArg(value, arg, 1);
    else if (arg === "--min-wilson") options.minWilson = numberArg(value, arg);
    else if (arg === "--max-tactical-failures") {
      options.maxTacticalFailures = integerArg(value, arg, 0);
    } else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!options.input) throw new Error("Provide --input");
  if (options.minScore > 1) throw new Error("Invalid minimum score");
  if (options.minWilson > 1) throw new Error("Invalid minimum Wilson lower bound");
  return options;
}

function wilsonLower(successes, games, z = 1.959963984540054) {
  if (!games) return 0;
  const p = successes / games;
  const denominator = 1 + z * z / games;
  const center = p + z * z / (2 * games);
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * games)) / games);
  return (center - margin) / denominator;
}

function minimumSuccessesForWilson(games, threshold) {
  for (let successes = 0; successes <= games; successes += 1) {
    if (wilsonLower(successes, games) > threshold) return successes;
  }
  return null;
}

function candidatesFromReport(report) {
  if (Array.isArray(report.candidates)) return report.candidates;
  if (Array.isArray(report.variants)) return report.variants;
  if (report.name && Number.isFinite(report.wins)) return [report];
  throw new Error("Invalid Phase 7 report");
}

function candidateMatches(candidate, name) {
  return !name || candidate.name === name || candidate.name?.endsWith(name);
}

function summarizeCandidate(candidate, options) {
  const games = candidate.games ?? candidate.wins + candidate.losses + candidate.draws;
  const draws = candidate.draws || 0;
  const successes = candidate.wins + draws * 0.5;
  const score = Number.isFinite(candidate.score) ? candidate.score : successes / games;
  const tacticalFailures = Array.isArray(candidate.tacticalFailures)
    ? candidate.tacticalFailures.length
    : Math.max(0, (candidate.tacticalTotal || 0) - (candidate.tacticalPassed || 0));
  const tacticalOk = tacticalFailures <= options.maxTacticalFailures;
  const scoreOk = score >= options.minScore;
  const enoughGames = games >= options.minGames;
  const wilsonLower95 = wilsonLower(successes, games);
  const wilsonOk = wilsonLower95 > options.minWilson;
  const minimumSuccesses = minimumSuccessesForWilson(options.minGames, options.minWilson);
  let decision = "hold";
  if (tacticalOk && scoreOk && enoughGames && wilsonOk) decision = "adopt-candidate";
  else if (tacticalOk && scoreOk && !enoughGames) decision = "long-run-candidate";
  return {
    name: candidate.name,
    games,
    wins: candidate.wins,
    losses: candidate.losses,
    draws,
    score,
    wilsonLower95,
    tacticalPassed: candidate.tacticalPassed,
    tacticalTotal: candidate.tacticalTotal,
    tacticalFailures,
    tacticalOk,
    scoreOk,
    enoughGames,
    wilsonOk,
    targetGames: options.minGames,
    additionalGamesNeeded: Math.max(0, options.minGames - games),
    minimumSuccessesForWilson: minimumSuccesses,
    minimumScoreForWilson: minimumSuccesses === null ? null : minimumSuccesses / options.minGames,
    decision,
  };
}

function decide(options) {
  const report = JSON.parse(fs.readFileSync(options.input, "utf8"));
  const candidates = candidatesFromReport(report)
    .filter((candidate) => candidateMatches(candidate, options.candidate));
  if (!candidates.length) throw new Error(`Candidate not found: ${options.candidate}`);
  return {
    config: options,
    candidates: candidates.map((candidate) => summarizeCandidate(candidate, options)),
  };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printText(report) {
  console.log([
    "Phase 7 decision:",
    `minGames=${report.config.minGames}`,
    `minScore=${percent(report.config.minScore)}`,
    `minWilson=${percent(report.config.minWilson)}`,
  ].join(" "));
  for (const item of report.candidates) {
    console.log([
      item.name,
      item.decision,
      `${item.wins}-${item.losses}-${item.draws}`,
      `score=${percent(item.score)}`,
      `wilson95=${percent(item.wilsonLower95)}`,
      `tactical=${item.tacticalPassed}/${item.tacticalTotal}`,
      `target=${item.minimumSuccessesForWilson}/${item.targetGames}`,
      item.enoughGames ? "games-ok" : "needs-more-games",
    ].join(" "));
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = decide(options);
    if (options.output) fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printText(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  parseArgs,
  wilsonLower,
  minimumSuccessesForWilson,
  candidatesFromReport,
  summarizeCandidate,
  decide,
};
