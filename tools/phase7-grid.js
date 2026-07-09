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
    games: 8,
    seed: 20260731,
    repeats: 1,
    seedStep: 100,
    openingPlies: [4],
    openingPhases: ["any"],
    timeLimitMs: 150,
    maxDepth: 4,
    maxTurns: 80,
    variants: ["base", "endurance-light", "endurance-heavy", "namua-transition-heavy"],
    minScore: 0.5,
    maxTacticalFailures: 0,
    promoteTop: 0,
    promoteDir: null,
    output: null,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--games") options.games = integerArg(value, arg, 2);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--repeats") options.repeats = integerArg(value, arg, 1);
    else if (arg === "--seed-step") options.seedStep = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") {
      options.openingPlies = value.split(",").map((item) => integerArg(item, arg, 0));
    } else if (arg === "--opening-phase") options.openingPhases = [value];
    else if (arg === "--opening-phases") options.openingPhases = value.split(",").filter(Boolean);
    else if (arg === "--time-limit") options.timeLimitMs = numberArg(value, arg);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--max-turns") options.maxTurns = integerArg(value, arg, 1);
    else if (arg === "--variants") options.variants = value.split(",").filter(Boolean);
    else if (arg === "--min-score") options.minScore = numberArg(value, arg);
    else if (arg === "--max-tactical-failures") {
      options.maxTacticalFailures = integerArg(value, arg, 0);
    } else if (arg === "--promote-top") options.promoteTop = integerArg(value, arg, 0);
    else if (arg === "--promote-dir") options.promoteDir = value;
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (options.games % 2) throw new Error("Game count must be even");
  if (!options.openingPlies.length) throw new Error("Invalid opening plies");
  if (!options.openingPhases.length
    || options.openingPhases.some((phase) => !["any", "namua", "mtaji"].includes(phase))) {
    throw new Error(`Invalid opening phases: ${options.openingPhases.join(",")}`);
  }
  if (options.minScore > 1) throw new Error("Invalid minimum score");
  options.variants.forEach((name) => variantAdjustments(name));
  return options;
}

function variantAdjustments(name) {
  const adjustments = WeightConfig.cloneAdjustments();
  if (name === "base") return adjustments;
  if (name === "endurance-light") {
    adjustments["mtaji-endurance"] = {
      mobility: 1, frontOccupied: 1, frontSafety: 2, maxCapture: -1,
    };
  } else if (name === "endurance-namua-safe") {
    adjustments["namua-opening"] = {};
    adjustments["mtaji-endurance"] = {
      mobility: 1, frontOccupied: 1, frontSafety: 2, maxCapture: -1,
    };
  } else if (name === "endurance-heavy") {
    adjustments["mtaji-endurance"] = {
      mobility: 3, frontOccupied: 3, frontSafety: 4, maxCapture: -3,
    };
  } else if (name === "namua-transition-heavy") {
    adjustments["namua-endgame"] = {
      transitionShape: 4, frontConnections: 2, houseValue: 4,
    };
  } else if (name === "attack-light") {
    adjustments["mtaji-attack"] = { maxCapture: 1, captureMoves: 1, tempo: 1 };
  } else {
    throw new Error(`Invalid Phase 7 variant: ${name}`);
  }
  return WeightConfig.validateAdjustments(adjustments);
}

function summarizeReports(reports) {
  const totals = reports.reduce((sum, report) => {
    const first = report.competitors[0];
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
  const games = totals.wins + totals.losses + totals.draws;
  return {
    games,
    wins: totals.wins,
    losses: totals.losses,
    draws: totals.draws,
    score: games ? (totals.wins + totals.draws * 0.5) / games : 0,
    averageMoveMs: totals.moves ? totals.elapsedMs / totals.moves : 0,
    maxMoveMs: totals.maxMoveMs,
    averageNodes: totals.moves ? totals.nodes / totals.moves : 0,
    timeouts: totals.timeouts,
  };
}

function runVariant(name, options) {
  const adjustments = variantAdjustments(name);
  const tactical = runTacticalSuite({
    evaluationProfile: "bao-v2",
    evaluationWeights: null,
    evaluationAdjustments: adjustments,
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
        firstAdjustments: adjustments,
        secondAdjustments: null,
        maxTurns: options.maxTurns,
        openingPlies,
        openingPhase,
        timeLimitMs: options.timeLimitMs,
        maxDepth: options.maxDepth,
        json: false,
      });
      reports.push(report);
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
      });
    }
  }
  return {
    name,
    adjustments,
    details,
    tacticalPassed: tactical.passed,
    tacticalTotal: tactical.total,
    tacticalFailures: tactical.failures,
    ...summarizeReports(reports),
  };
}

function runGrid(options) {
  const variants = options.variants.map((name) => runVariant(name, options))
    .map((item) => ({
      ...item,
      eligible: item.tacticalFailures.length <= options.maxTacticalFailures
        && item.score >= options.minScore,
    }))
    .sort((a, b) => a.tacticalFailures.length - b.tacticalFailures.length
      || b.score - a.score
      || a.averageMoveMs - b.averageMoveMs);
  const promoted = variants.filter((item) => item.eligible)
    .slice(0, options.promoteTop || variants.length)
    .map((item) => ({
      name: item.name,
      score: item.score,
      wins: item.wins,
      losses: item.losses,
      draws: item.draws,
      tacticalPassed: item.tacticalPassed,
      tacticalTotal: item.tacticalTotal,
      averageMoveMs: item.averageMoveMs,
      timeouts: item.timeouts,
      adjustments: item.adjustments,
    }));
  return {
    config: options,
    variants,
    promoted,
  };
}

function printText(report) {
  console.log([
    "Phase 7 grid:",
    `games=${report.config.games}`,
    `repeats=${report.config.repeats}`,
    `phases=${report.config.openingPhases.join(",")}`,
    `plies=${report.config.openingPlies.join(",")}`,
  ].join(" "));
  for (const item of report.variants) {
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
  if (report.promoted.length) {
    console.log(`promoted=${report.promoted.map((item) => item.name).join(",")}`);
  }
}

function writePromoted(report, directory) {
  if (!directory) return [];
  fs.mkdirSync(directory, { recursive: true });
  return report.promoted.map((item, index) => {
    const file = `${String(index + 1).padStart(2, "0")}-${item.name}.json`;
    const path = `${directory.replace(/\/$/, "")}/${file}`;
    fs.writeFileSync(path, `${JSON.stringify(item.adjustments, null, 2)}\n`);
    return path;
  });
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = runGrid(options);
    const promotedFiles = writePromoted(report, options.promoteDir);
    if (promotedFiles.length) report.promotedFiles = promotedFiles;
    if (options.output) {
      fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
    }
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printText(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  parseArgs, variantAdjustments, summarizeReports, runVariant, runGrid, writePromoted,
};
