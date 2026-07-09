#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { parseArgs: parseBenchmarkArgs, runBenchmark } = require("./benchmark.js");

function integerArg(value, name, minimum) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function numberArg(value, name, minimum = 0) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function listArg(value, name, parseItem = String) {
  const result = String(value).split(",").filter(Boolean).map(parseItem);
  if (!result.length) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function parseArgs(argv) {
  const options = {
    games: 4,
    seed: 20260880,
    repeats: 1,
    levels: ["hard"],
    openingPlies: [4],
    openingPhases: ["namua", "mtaji"],
    timeLimitMs: 500,
    maxDepth: 8,
    maxTurns: 80,
    output: null,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--games") options.games = integerArg(value, arg, 1);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--repeats") options.repeats = integerArg(value, arg, 1);
    else if (arg === "--levels") options.levels = listArg(value, arg);
    else if (arg === "--opening-plies") {
      options.openingPlies = listArg(value, arg, (item) => integerArg(item, arg, 0));
    } else if (arg === "--opening-phases") options.openingPhases = listArg(value, arg);
    else if (arg === "--time-limit") options.timeLimitMs = numberArg(value, arg);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--max-turns") options.maxTurns = integerArg(value, arg, 1);
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  for (const level of options.levels) {
    if (!["hard", "expert"].includes(level)) throw new Error(`Invalid level: ${level}`);
  }
  for (const phase of options.openingPhases) {
    if (!["any", "namua", "mtaji"].includes(phase)) throw new Error(`Invalid opening phase: ${phase}`);
  }
  return options;
}

function competitorById(report, id) {
  return report.competitors.find((item) => item.id === id);
}

function scenarioSummary(report, scenario) {
  const adaptive = competitorById(report, "first");
  const fixed = competitorById(report, "second");
  return {
    ...scenario,
    adaptive: {
      wins: adaptive.wins,
      losses: adaptive.losses,
      draws: adaptive.draws,
      winRate: adaptive.winRate,
      averageMoveMs: adaptive.averageMoveMs,
      maxMoveMs: adaptive.maxMoveMs,
      averageAllocatedMs: adaptive.averageAllocatedMs,
      maxAllocatedMs: adaptive.maxAllocatedMs,
      averageDepth: adaptive.averageDepth,
      maxDepth: adaptive.maxDepth,
      timeouts: adaptive.timeouts,
      earlyStops: adaptive.earlyStops,
      averageAdaptiveComplexity: adaptive.averageAdaptiveComplexity,
    },
    fixed: {
      wins: fixed.wins,
      losses: fixed.losses,
      draws: fixed.draws,
      winRate: fixed.winRate,
      averageMoveMs: fixed.averageMoveMs,
      maxMoveMs: fixed.maxMoveMs,
      averageAllocatedMs: fixed.averageAllocatedMs,
      maxAllocatedMs: fixed.maxAllocatedMs,
      averageDepth: fixed.averageDepth,
      maxDepth: fixed.maxDepth,
      timeouts: fixed.timeouts,
      earlyStops: fixed.earlyStops,
    },
  };
}

function runScenario(options, scenario) {
  const benchmarkArgs = [
    "--games", String(options.games),
    "--seed", String(scenario.seed),
    "--first", scenario.level,
    "--second", scenario.level,
    "--first-adaptive",
    "--opening-plies", String(scenario.openingPlies),
    "--opening-phase", scenario.openingPhase,
    "--time-limit", String(options.timeLimitMs),
    "--max-depth", String(options.maxDepth),
    "--max-turns", String(options.maxTurns),
  ];
  const report = runBenchmark(parseBenchmarkArgs(benchmarkArgs));
  return scenarioSummary(report, scenario);
}

function emptyAggregate() {
  return {
    wins: 0,
    losses: 0,
    draws: 0,
    moves: 0,
    averageMoveMsTotal: 0,
    maxMoveMs: 0,
    averageAllocatedMsTotal: 0,
    maxAllocatedMs: 0,
    averageDepthTotal: 0,
    timeouts: 0,
    earlyStops: 0,
    averageAdaptiveComplexityTotal: 0,
  };
}

function addSide(aggregate, side) {
  const games = side.wins + side.losses + side.draws;
  aggregate.wins += side.wins;
  aggregate.losses += side.losses;
  aggregate.draws += side.draws;
  aggregate.moves += games;
  aggregate.averageMoveMsTotal += side.averageMoveMs * games;
  aggregate.maxMoveMs = Math.max(aggregate.maxMoveMs, side.maxMoveMs);
  aggregate.averageAllocatedMsTotal += side.averageAllocatedMs * games;
  aggregate.maxAllocatedMs = Math.max(aggregate.maxAllocatedMs, side.maxAllocatedMs);
  aggregate.averageDepthTotal += side.averageDepth * games;
  aggregate.timeouts += side.timeouts;
  aggregate.earlyStops += side.earlyStops;
  aggregate.averageAdaptiveComplexityTotal += (side.averageAdaptiveComplexity || 0) * games;
}

function finishAggregate(aggregate) {
  const games = aggregate.wins + aggregate.losses + aggregate.draws;
  return {
    wins: aggregate.wins,
    losses: aggregate.losses,
    draws: aggregate.draws,
    winRate: games ? aggregate.wins / games : 0,
    averageMoveMs: games ? aggregate.averageMoveMsTotal / games : 0,
    maxMoveMs: aggregate.maxMoveMs,
    averageAllocatedMs: games ? aggregate.averageAllocatedMsTotal / games : 0,
    maxAllocatedMs: aggregate.maxAllocatedMs,
    averageDepth: games ? aggregate.averageDepthTotal / games : 0,
    timeouts: aggregate.timeouts,
    earlyStops: aggregate.earlyStops,
    averageAdaptiveComplexity: games ? aggregate.averageAdaptiveComplexityTotal / games : 0,
  };
}

function aggregateResults(results) {
  const adaptive = emptyAggregate();
  const fixed = emptyAggregate();
  for (const result of results) {
    addSide(adaptive, result.adaptive);
    addSide(fixed, result.fixed);
  }
  const adaptiveSummary = finishAggregate(adaptive);
  const fixedSummary = finishAggregate(fixed);
  return {
    adaptive: adaptiveSummary,
    fixed: fixedSummary,
    deltas: {
      winRate: adaptiveSummary.winRate - fixedSummary.winRate,
      averageMoveMs: adaptiveSummary.averageMoveMs - fixedSummary.averageMoveMs,
      maxMoveMs: adaptiveSummary.maxMoveMs - fixedSummary.maxMoveMs,
      timeouts: adaptiveSummary.timeouts - fixedSummary.timeouts,
      earlyStops: adaptiveSummary.earlyStops - fixedSummary.earlyStops,
    },
  };
}

function runComparison(options) {
  const scenarios = [];
  for (let repeat = 0; repeat < options.repeats; repeat += 1) {
    for (const level of options.levels) {
      for (const openingPhase of options.openingPhases) {
        for (const openingPlies of options.openingPlies) {
          scenarios.push({
            repeat,
            level,
            openingPhase,
            openingPlies,
            seed: options.seed + repeat * 1000 + scenarios.length,
          });
        }
      }
    }
  }
  const results = scenarios.map((scenario) => runScenario(options, scenario));
  return {
    config: { ...options },
    summary: aggregateResults(results),
    scenarios: results,
  };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printReport(report) {
  console.log(`Bao Phase 8 comparison: ${report.scenarios.length} scenarios`);
  console.log(`Summary adaptive ${report.summary.adaptive.wins}-${report.summary.adaptive.losses}-${report.summary.adaptive.draws}, win ${percent(report.summary.adaptive.winRate)}, move ${report.summary.adaptive.averageMoveMs.toFixed(1)}ms avg / ${report.summary.adaptive.maxMoveMs.toFixed(1)}ms max, timeouts ${report.summary.adaptive.timeouts}`);
  console.log(`Summary fixed    ${report.summary.fixed.wins}-${report.summary.fixed.losses}-${report.summary.fixed.draws}, win ${percent(report.summary.fixed.winRate)}, move ${report.summary.fixed.averageMoveMs.toFixed(1)}ms avg / ${report.summary.fixed.maxMoveMs.toFixed(1)}ms max, timeouts ${report.summary.fixed.timeouts}`);
  console.log(`Delta win ${percent(report.summary.deltas.winRate)}, move ${report.summary.deltas.averageMoveMs.toFixed(1)}ms avg / ${report.summary.deltas.maxMoveMs.toFixed(1)}ms max, timeouts ${report.summary.deltas.timeouts}`);
  for (const item of report.scenarios) {
    console.log(`${item.level} ${item.openingPhase}/${item.openingPlies} seed ${item.seed}`);
    console.log(`  adaptive ${item.adaptive.wins}-${item.adaptive.losses}-${item.adaptive.draws}, win ${percent(item.adaptive.winRate)}, move ${item.adaptive.averageMoveMs.toFixed(1)}ms avg / ${item.adaptive.maxMoveMs.toFixed(1)}ms max, budget ${item.adaptive.averageAllocatedMs.toFixed(1)}ms avg / ${item.adaptive.maxAllocatedMs.toFixed(1)}ms max, depth ${item.adaptive.averageDepth.toFixed(2)}, timeouts ${item.adaptive.timeouts}, early ${item.adaptive.earlyStops}, complexity ${item.adaptive.averageAdaptiveComplexity.toFixed(2)}`);
    console.log(`  fixed    ${item.fixed.wins}-${item.fixed.losses}-${item.fixed.draws}, win ${percent(item.fixed.winRate)}, move ${item.fixed.averageMoveMs.toFixed(1)}ms avg / ${item.fixed.maxMoveMs.toFixed(1)}ms max, budget ${item.fixed.averageAllocatedMs.toFixed(1)}ms avg / ${item.fixed.maxAllocatedMs.toFixed(1)}ms max, depth ${item.fixed.averageDepth.toFixed(2)}, timeouts ${item.fixed.timeouts}, early ${item.fixed.earlyStops}`);
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = runComparison(options);
    if (options.output) fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printReport(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, runComparison, aggregateResults };
