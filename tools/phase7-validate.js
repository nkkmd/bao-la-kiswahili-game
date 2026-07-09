#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { runBenchmark } = require("./benchmark.js");
const WeightConfig = require("../public/ai-weights.js");
const { runTacticalSuite } = require("../test/tactical.test.js");

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
    candidates: [],
    games: 12,
    seed: 20260740,
    repeats: 2,
    seedStep: 100,
    openingPlies: [4, 8],
    openingPhases: ["namua", "mtaji"],
    timeLimitMs: 150,
    maxDepth: 4,
    maxTurns: 100,
    minScore: 0.5,
    maxTacticalFailures: 0,
    output: null,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--input") options.input = value;
    else if (arg === "--candidate") options.candidates.push(value);
    else if (arg === "--candidates") options.candidates.push(...value.split(",").filter(Boolean));
    else if (arg === "--games") options.games = integerArg(value, arg, 2);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--repeats") options.repeats = integerArg(value, arg, 1);
    else if (arg === "--seed-step") options.seedStep = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") {
      options.openingPlies = value.split(",").map((item) => integerArg(item, arg, 0));
    } else if (arg === "--opening-phases") options.openingPhases = value.split(",").filter(Boolean);
    else if (arg === "--time-limit") options.timeLimitMs = numberArg(value, arg);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--max-turns") options.maxTurns = integerArg(value, arg, 1);
    else if (arg === "--min-score") options.minScore = numberArg(value, arg);
    else if (arg === "--max-tactical-failures") {
      options.maxTacticalFailures = integerArg(value, arg, 0);
    } else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!options.input && !options.candidates.length) {
    throw new Error("Provide --input or --candidate");
  }
  if (options.games % 2) throw new Error("Game count must be even");
  if (!options.openingPlies.length) throw new Error("Invalid opening plies");
  if (!options.openingPhases.length
    || options.openingPhases.some((phase) => !["any", "namua", "mtaji"].includes(phase))) {
    throw new Error(`Invalid opening phases: ${options.openingPhases.join(",")}`);
  }
  if (options.minScore > 1) throw new Error("Invalid minimum score");
  return options;
}

function candidatesFromInput(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (Array.isArray(data.promoted)) {
    return data.promoted.map((item) => ({
      name: item.name,
      adjustments: WeightConfig.validateAdjustments(item.adjustments),
    }));
  }
  return [{
    name: file.replace(/^.*\//, "").replace(/\.json$/, ""),
    adjustments: WeightConfig.validateAdjustments(data),
  }];
}

function loadCandidates(options) {
  const result = [];
  if (options.input) result.push(...candidatesFromInput(options.input));
  for (const file of options.candidates) result.push(...candidatesFromInput(file));
  if (!result.length) throw new Error("No candidates found");
  return result;
}

function summarizeReports(reports) {
  const total = reports.reduce((sum, item) => {
    const first = item.report.competitors[0];
    return {
      wins: sum.wins + first.wins,
      losses: sum.losses + first.losses,
      draws: sum.draws + first.draws,
      moves: sum.moves + first.moves,
      elapsedMs: sum.elapsedMs + first.averageMoveMs * first.moves,
      maxMoveMs: Math.max(sum.maxMoveMs, first.maxMoveMs),
      nodes: sum.nodes + first.totalNodes,
      timeouts: sum.timeouts + first.timeouts,
    };
  }, {
    wins: 0, losses: 0, draws: 0, moves: 0, elapsedMs: 0,
    maxMoveMs: 0, nodes: 0, timeouts: 0,
  });
  const games = total.wins + total.losses + total.draws;
  return {
    games,
    wins: total.wins,
    losses: total.losses,
    draws: total.draws,
    score: games ? (total.wins + total.draws * 0.5) / games : 0,
    averageMoveMs: total.moves ? total.elapsedMs / total.moves : 0,
    maxMoveMs: total.maxMoveMs,
    averageNodes: total.moves ? total.nodes / total.moves : 0,
    timeouts: total.timeouts,
  };
}

function validateCandidate(candidate, options) {
  const tactical = runTacticalSuite({
    evaluationProfile: "bao-v2",
    evaluationWeights: null,
    evaluationAdjustments: candidate.adjustments,
    diagnostics: false,
  });
  const reports = [];
  const details = [];
  for (let repeat = 0; repeat < options.repeats; repeat += 1) {
    for (let phaseIndex = 0; phaseIndex < options.openingPhases.length; phaseIndex += 1) {
      const openingPhase = options.openingPhases[phaseIndex];
      const openingPlies = options.openingPlies[
        (repeat + phaseIndex) % options.openingPlies.length
      ];
      const seed = options.seed + repeat * options.seedStep + phaseIndex;
      const report = runBenchmark({
        games: options.games,
        seed,
        first: "hard",
        second: "hard",
        firstProfile: "bao-v2",
        secondProfile: "bao",
        firstSearch: "phase2",
        secondSearch: "phase2",
        firstWeights: null,
        secondWeights: null,
        firstAdjustments: candidate.adjustments,
        secondAdjustments: null,
        maxTurns: options.maxTurns,
        openingPlies,
        openingPhase,
        timeLimitMs: options.timeLimitMs,
        maxDepth: options.maxDepth,
        json: false,
      });
      reports.push({ seed, openingPhase, openingPlies, report });
      const first = report.competitors[0];
      details.push({
        repeat: repeat + 1,
        seed,
        openingPhase,
        openingPlies,
        wins: first.wins,
        losses: first.losses,
        draws: first.draws,
        score: (first.wins + first.draws * 0.5) / options.games,
        averageMoveMs: first.averageMoveMs,
        timeouts: first.timeouts,
      });
    }
  }
  const summary = summarizeReports(reports);
  return {
    name: candidate.name,
    adjustments: candidate.adjustments,
    tacticalPassed: tactical.passed,
    tacticalTotal: tactical.total,
    tacticalFailures: tactical.failures,
    eligible: tactical.failures.length <= options.maxTacticalFailures
      && summary.score >= options.minScore,
    details,
    ...summary,
  };
}

function runValidation(options) {
  const candidates = loadCandidates(options);
  const results = candidates.map((candidate) => validateCandidate(candidate, options))
    .sort((a, b) => a.tacticalFailures.length - b.tacticalFailures.length
      || b.score - a.score
      || a.averageMoveMs - b.averageMoveMs);
  return { config: options, candidates: results };
}

function printText(report) {
  console.log([
    "Phase 7 validation:",
    `candidates=${report.candidates.length}`,
    `games=${report.config.games}`,
    `repeats=${report.config.repeats}`,
    `phases=${report.config.openingPhases.join(",")}`,
  ].join(" "));
  for (const item of report.candidates) {
    console.log([
      item.name,
      `score=${(item.score * 100).toFixed(1)}%`,
      `${item.wins}-${item.losses}-${item.draws}`,
      `tactical=${item.tacticalPassed}/${item.tacticalTotal}`,
      item.eligible ? "eligible" : "hold",
      `avgMs=${item.averageMoveMs.toFixed(2)}`,
      `timeouts=${item.timeouts}`,
    ].join(" "));
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = runValidation(options);
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
  candidatesFromInput,
  loadCandidates,
  summarizeReports,
  validateCandidate,
  runValidation,
};
