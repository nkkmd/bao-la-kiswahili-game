#!/usr/bin/env node
"use strict";

const { runBenchmark } = require("./benchmark.js");

function integerArg(value, name, minimum = 1) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function numberArg(value, name, minimum = 0) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function listArg(value, allowed, name) {
  const result = value.split(",").filter(Boolean);
  if (!result.length || result.some((item) => !allowed.includes(item))) {
    throw new Error(`Invalid ${name}: ${value}`);
  }
  return result;
}

function parseArgs(argv) {
  const options = {
    games: 4,
    seed: 20260717,
    repeats: 1,
    seedStep: 100,
    openingPlies: 4,
    openingPhase: "any",
    timeLimitMs: 100,
    maxDepth: 4,
    maxTurns: 300,
    mctsIterations: null,
    mctsPlayoutTurns: 40,
    mctsExploration: Math.SQRT2,
    policies: ["capture"],
    roots: ["visits", "value"],
    rewards: ["evaluation", "fast-terminal"],
    priors: ["none"],
    mctsPriorWeight: 1,
    candidateLimits: [0],
    candidateSources: ["static"],
    mctsCandidateDepth: 1,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const name = argv[index];
    const value = argv[index + 1];
    if (name === "--json") { options.json = true; continue; }
    if (name === "--games") options.games = integerArg(value, name);
    else if (name === "--seed") options.seed = integerArg(value, name, 0);
    else if (name === "--repeats") options.repeats = integerArg(value, name);
    else if (name === "--seed-step") options.seedStep = integerArg(value, name, 1);
    else if (name === "--opening-plies") options.openingPlies = integerArg(value, name, 0);
    else if (name === "--opening-phase") options.openingPhase = value;
    else if (name === "--time-limit") options.timeLimitMs = numberArg(value, name);
    else if (name === "--max-depth") options.maxDepth = integerArg(value, name);
    else if (name === "--max-turns") options.maxTurns = integerArg(value, name);
    else if (name === "--mcts-iterations") options.mctsIterations = integerArg(value, name);
    else if (name === "--mcts-playout-turns") options.mctsPlayoutTurns = integerArg(value, name);
    else if (name === "--mcts-exploration") options.mctsExploration = numberArg(value, name);
    else if (name === "--policies") {
      options.policies = listArg(value, ["random", "capture", "balanced", "evaluation"], name);
    } else if (name === "--roots") {
      options.roots = listArg(value, ["visits", "value"], name);
    } else if (name === "--rewards") {
      options.rewards = listArg(value, ["evaluation", "terminal", "fast-terminal"], name);
    } else if (name === "--priors") {
      options.priors = listArg(value, ["none", "static"], name);
    } else if (name === "--mcts-prior-weight") {
      options.mctsPriorWeight = numberArg(value, name);
    } else if (name === "--candidate-limits") {
      options.candidateLimits = value.split(",").map((item) => integerArg(item, name, 0));
    } else if (name === "--candidate-sources") {
      options.candidateSources = listArg(value, ["all", "static", "phase2"], name);
    } else if (name === "--mcts-candidate-depth") {
      options.mctsCandidateDepth = integerArg(value, name);
    } else throw new Error(`Unknown argument: ${name}`);
    index += 1;
  }
  if (options.games % 2) throw new Error("Game count must be even");
  if (!["any", "namua", "mtaji"].includes(options.openingPhase)) {
    throw new Error(`Invalid opening phase: ${options.openingPhase}`);
  }
  return options;
}

function aggregateReports(reports, games) {
  const totals = reports.reduce((sum, report) => {
    const mcts = report.competitors[0];
    const phase2 = report.competitors[1];
    return {
      wins: sum.wins + mcts.wins,
      losses: sum.losses + mcts.losses,
      draws: sum.draws + mcts.draws,
      moves: sum.moves + mcts.moves,
      elapsedMs: sum.elapsedMs + mcts.averageMoveMs * mcts.moves,
      simulations: sum.simulations + mcts.totalSimulations,
      playoutTurns: sum.playoutTurns + mcts.averagePlayoutTurns * mcts.totalSimulations,
      timeouts: sum.timeouts + mcts.timeouts,
      phase2Wins: sum.phase2Wins + phase2.wins,
    };
  }, {
    wins: 0,
    losses: 0,
    draws: 0,
    moves: 0,
    elapsedMs: 0,
    simulations: 0,
    playoutTurns: 0,
    timeouts: 0,
    phase2Wins: 0,
  });
  return {
    games: reports.length * games,
    wins: totals.wins,
    losses: totals.losses,
    draws: totals.draws,
    score: (totals.wins + totals.draws * 0.5) / (reports.length * games),
    averageMoveMs: totals.moves ? totals.elapsedMs / totals.moves : 0,
    averageSimulations: totals.moves ? totals.simulations / totals.moves : 0,
    averagePlayoutTurns: totals.simulations ? totals.playoutTurns / totals.simulations : 0,
    timeouts: totals.timeouts,
    phase2Wins: totals.phase2Wins,
  };
}

function runGrid(options) {
  const results = [];
  for (const policy of options.policies) {
    for (const root of options.roots) {
      for (const reward of options.rewards) {
        for (const prior of options.priors) {
          for (const candidateSource of options.candidateSources) {
            for (const candidateLimit of options.candidateLimits) {
              const reports = Array.from({ length: options.repeats }, (_, repeat) => runBenchmark({
                games: options.games,
                seed: options.seed + repeat * options.seedStep,
                first: "hard",
                second: "hard",
                firstProfile: "bao",
                secondProfile: "bao",
                firstSearch: "mcts",
                secondSearch: "phase2",
                maxTurns: options.maxTurns,
                openingPlies: options.openingPlies,
                openingPhase: options.openingPhase,
                timeLimitMs: options.timeLimitMs,
                maxDepth: options.maxDepth,
                mctsIterations: options.mctsIterations,
                mctsPlayoutTurns: options.mctsPlayoutTurns,
                mctsExploration: options.mctsExploration,
                mctsPolicy: policy,
                mctsRoot: root,
                mctsReward: reward,
                mctsPrior: prior,
                mctsPriorWeight: options.mctsPriorWeight,
                mctsCandidateLimit: candidateLimit,
                mctsCandidateSource: candidateSource,
                mctsCandidateDepth: options.mctsCandidateDepth,
                json: false,
              }));
              const aggregate = aggregateReports(reports, options.games);
              results.push({
                policy,
                root,
                reward,
                prior,
                candidateSource,
                candidateLimit,
                ...aggregate,
                reports,
              });
            }
          }
        }
      }
    }
  }
  results.sort((a, b) => b.score - a.score
    || b.averageSimulations - a.averageSimulations
    || a.averageMoveMs - b.averageMoveMs);
  return { config: { ...options }, results };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printReport(report) {
  console.log(
    `Bao MCTS grid: ${report.config.games} games x ${report.config.repeats} repeats, seed ${report.config.seed}`,
  );
  console.log("policy/root/reward/prior/source/limit | score | W-L-D | ms | sims | playout | timeouts");
  for (const item of report.results) {
    console.log(`${item.policy}/${item.root}/${item.reward}/${item.prior}/${item.candidateSource}/${item.candidateLimit} | ${percent(item.score)} | `
      + `${item.wins}-${item.losses}-${item.draws} | ${item.averageMoveMs.toFixed(2)} | `
      + `${item.averageSimulations.toFixed(0)} | ${item.averagePlayoutTurns.toFixed(1)} | `
      + `${item.timeouts}`);
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = runGrid(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printReport(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, runGrid };
