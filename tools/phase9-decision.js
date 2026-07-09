#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const {
  wilsonLower,
  minimumSuccessesForWilson,
} = require("./phase7-decision.js");

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

function listArg(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseArgs(argv) {
  const options = {
    input: null,
    candidate: null,
    finalReports: [],
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
    else if (arg === "--final-report") options.finalReports.push(value);
    else if (arg === "--final-reports") options.finalReports.push(...listArg(value));
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

function candidatesFromReport(report) {
  if (Array.isArray(report.finalists)) return report.finalists;
  if (Array.isArray(report.candidates)) return report.candidates;
  if (report.name && (report.validation || Number.isFinite(report.wins))) return [report];
  throw new Error("Invalid Phase 9 report");
}

function candidateMatches(candidate, name) {
  return !name || candidate.name === name || candidate.name?.endsWith(name);
}

function emptySummary() {
  return {
    games: 0, wins: 0, losses: 0, draws: 0, moves: 0,
    elapsedMs: 0, maxMoveMs: 0, nodes: 0, timeouts: 0,
  };
}

function addBenchmark(summary, report) {
  if (!report || !Array.isArray(report.competitors) || !report.competitors[0]) {
    throw new Error("Invalid benchmark report");
  }
  const first = report.competitors[0];
  const games = first.wins + first.losses + first.draws;
  summary.games += games;
  summary.wins += first.wins;
  summary.losses += first.losses;
  summary.draws += first.draws;
  summary.moves += first.moves || 0;
  summary.elapsedMs += (first.averageMoveMs || 0) * (first.moves || 0);
  summary.maxMoveMs = Math.max(summary.maxMoveMs, first.maxMoveMs || 0);
  summary.nodes += first.totalNodes || 0;
  summary.timeouts += first.timeouts || 0;
}

function finalizeSummary(summary) {
  const successes = summary.wins + summary.draws * 0.5;
  return {
    games: summary.games,
    wins: summary.wins,
    losses: summary.losses,
    draws: summary.draws,
    score: summary.games ? successes / summary.games : 0,
    wilsonLower95: wilsonLower(successes, summary.games),
    averageMoveMs: summary.moves ? summary.elapsedMs / summary.moves : 0,
    maxMoveMs: summary.maxMoveMs,
    averageNodes: summary.moves ? summary.nodes / summary.moves : 0,
    timeouts: summary.timeouts,
  };
}

function aggregateFinalReports(files) {
  const summary = emptySummary();
  const details = [];
  for (const file of files) {
    const report = JSON.parse(fs.readFileSync(file, "utf8"));
    addBenchmark(summary, report);
    const first = report.competitors[0];
    details.push({
      file,
      seed: report.config?.seed,
      openingPhase: report.config?.openingPhase,
      openingPlies: report.config?.openingPlies,
      games: first.wins + first.losses + first.draws,
      wins: first.wins,
      losses: first.losses,
      draws: first.draws,
      score: (first.wins + first.draws * 0.5) / (first.wins + first.losses + first.draws),
      timeouts: first.timeouts || 0,
    });
  }
  return { details, ...finalizeSummary(summary) };
}

function validationSummary(candidate) {
  if (candidate.validation) {
    const validation = candidate.validation;
    const games = validation.games ?? validation.wins + validation.losses + (validation.draws || 0);
    const wins = validation.wins || 0;
    const losses = validation.losses || 0;
    const draws = validation.draws || 0;
    const successes = wins + draws * 0.5;
    return {
      ...validation,
      games,
      wins,
      losses,
      draws,
      score: Number.isFinite(validation.score) ? validation.score : successes / games,
      wilsonLower95: Number.isFinite(validation.wilsonLower95)
        ? validation.wilsonLower95
        : wilsonLower(successes, games),
    };
  }
  const games = candidate.games ?? candidate.wins + candidate.losses + (candidate.draws || 0);
  const summary = {
    games,
    wins: candidate.wins,
    losses: candidate.losses,
    draws: candidate.draws || 0,
    moves: Number.isFinite(candidate.averageMoveMs) ? 1 : 0,
    elapsedMs: Number.isFinite(candidate.averageMoveMs) ? candidate.averageMoveMs : 0,
    maxMoveMs: candidate.maxMoveMs || 0,
    nodes: Number.isFinite(candidate.averageNodes) ? candidate.averageNodes : 0,
    timeouts: candidate.timeouts || 0,
  };
  return finalizeSummary(summary);
}

function summarizeCandidate(candidate, options, finalSummary = null) {
  const source = finalSummary || validationSummary(candidate);
  const sourceName = finalSummary ? "final-reports"
    : Array.isArray(candidate.finalDetails) ? "longrun"
      : "validation";
  const tacticalFailures = Array.isArray(candidate.tacticalFailures)
    ? candidate.tacticalFailures.length
    : Math.max(0, (candidate.tacticalTotal || 0) - (candidate.tacticalPassed || 0));
  const tacticalOk = tacticalFailures <= options.maxTacticalFailures;
  const scoreOk = source.score >= options.minScore;
  const enoughGames = source.games >= options.minGames;
  const wilsonOk = source.wilsonLower95 > options.minWilson;
  const minimumSuccesses = minimumSuccessesForWilson(options.minGames, options.minWilson);
  let decision = "hold";
  if (tacticalOk && scoreOk && enoughGames && wilsonOk) decision = "adopt-candidate";
  else if (tacticalOk && scoreOk && !enoughGames) decision = "long-run-candidate";
  return {
    name: candidate.name,
    source: sourceName,
    games: source.games,
    wins: source.wins,
    losses: source.losses,
    draws: source.draws,
    score: source.score,
    wilsonLower95: source.wilsonLower95,
    tacticalPassed: candidate.tacticalPassed,
    tacticalTotal: candidate.tacticalTotal,
    tacticalFailures,
    tacticalOk,
    scoreOk,
    enoughGames,
    wilsonOk,
    targetGames: options.minGames,
    additionalGamesNeeded: Math.max(0, options.minGames - source.games),
    minimumSuccessesForWilson: minimumSuccesses,
    minimumScoreForWilson: minimumSuccesses === null ? null : minimumSuccesses / options.minGames,
    averageMoveMs: source.averageMoveMs || 0,
    maxMoveMs: source.maxMoveMs || 0,
    averageNodes: source.averageNodes || 0,
    timeouts: source.timeouts || 0,
    finalDetails: finalSummary?.details || candidate.finalDetails || [],
    decision,
  };
}

function decide(options) {
  const report = JSON.parse(fs.readFileSync(options.input, "utf8"));
  const candidates = candidatesFromReport(report)
    .filter((candidate) => candidateMatches(candidate, options.candidate));
  if (!candidates.length) throw new Error(`Candidate not found: ${options.candidate}`);
  if (options.finalReports.length && candidates.length !== 1) {
    throw new Error("Use --candidate when providing final reports for a multi-candidate input");
  }
  const finalSummary = options.finalReports.length
    ? aggregateFinalReports(options.finalReports)
    : null;
  return {
    config: options,
    candidates: candidates.map((candidate) => summarizeCandidate(candidate, options, finalSummary)),
  };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printText(report) {
  console.log([
    "Phase 9 decision:",
    `minGames=${report.config.minGames}`,
    `minScore=${percent(report.config.minScore)}`,
    `minWilson=${percent(report.config.minWilson)}`,
  ].join(" "));
  for (const item of report.candidates) {
    console.log([
      item.name,
      item.decision,
      item.source,
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
  candidatesFromReport,
  aggregateFinalReports,
  summarizeCandidate,
  decide,
};
