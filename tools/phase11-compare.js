#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const AI = require("../public/ai.js");
const { seededRandom, createOpening } = require("./benchmark.js");

function integerArg(value, name, minimum) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function listArg(value, name) {
  const result = String(value).split(",").filter(Boolean);
  if (!result.length) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function parseArgs(argv) {
  const options = {
    seed: 20261000,
    positionsPerPhase: 8,
    openingPlies: 8,
    openingPhases: ["namua", "mtaji"],
    maxDepth: 4,
    candidate: "tt-first",
    output: null,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--positions-per-phase") options.positionsPerPhase = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = integerArg(value, arg, 0);
    else if (arg === "--opening-phases") options.openingPhases = listArg(value, arg);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--candidate") options.candidate = value;
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  for (const phase of options.openingPhases) {
    if (!["namua", "mtaji"].includes(phase)) throw new Error(`Invalid opening phase: ${phase}`);
  }
  if (options.candidate !== "tt-first") throw new Error(`Invalid candidate: ${options.candidate}`);
  return options;
}

function search(position, maxDepth, candidate) {
  return AI.analyzeMove(position, "hard", () => 0, {
    maxDepth,
    timeLimitMs: Infinity,
    ttMoveFirst: candidate === "tt-first",
  });
}

function compactAnalysis(analysis) {
  return {
    move: AI.moveKey(analysis.move),
    nodes: analysis.stats.nodes,
    quiescenceNodes: analysis.stats.quiescenceNodes,
    cutoffs: analysis.stats.cutoffs,
    cacheHits: analysis.stats.cacheHits,
    cacheStores: analysis.stats.cacheStores,
    completedDepth: analysis.stats.completedDepth,
    elapsedMs: analysis.stats.elapsedMs,
  };
}

function summarize(results) {
  const total = (side, name) => results.reduce((sum, item) => sum + item[side][name], 0);
  const baselineNodes = total("baseline", "nodes");
  const candidateNodes = total("candidate", "nodes");
  return {
    positions: results.length,
    moveMatches: results.filter((item) => item.moveMatches).length,
    nodeImprovements: results.filter((item) => item.candidate.nodes < item.baseline.nodes).length,
    nodeRegressions: results.filter((item) => item.candidate.nodes > item.baseline.nodes).length,
    baselineNodes,
    candidateNodes,
    nodeReduction: baselineNodes - candidateNodes,
    nodeReductionRate: baselineNodes ? (baselineNodes - candidateNodes) / baselineNodes : 0,
    baselineQuiescenceNodes: total("baseline", "quiescenceNodes"),
    candidateQuiescenceNodes: total("candidate", "quiescenceNodes"),
    baselineElapsedMs: total("baseline", "elapsedMs"),
    candidateElapsedMs: total("candidate", "elapsedMs"),
  };
}

function runComparison(options) {
  const results = [];
  for (let phaseIndex = 0; phaseIndex < options.openingPhases.length; phaseIndex += 1) {
    const openingPhase = options.openingPhases[phaseIndex];
    for (let index = 0; index < options.positionsPerPhase; index += 1) {
      const seed = options.seed + phaseIndex * 100 + index;
      const position = createOpening(seededRandom(seed), options.openingPlies, openingPhase);
      const baseline = compactAnalysis(search(position, options.maxDepth, "baseline"));
      const candidate = compactAnalysis(search(position, options.maxDepth, options.candidate));
      results.push({
        openingPhase,
        seed,
        positionKey: AI.stateKey(position),
        moveMatches: baseline.move === candidate.move,
        baseline,
        candidate,
      });
    }
  }
  return { config: { ...options }, summary: summarize(results), results };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printReport(report) {
  const { summary } = report;
  console.log(`Bao Phase 11 comparison: ${report.config.candidate}`);
  console.log(`Moves ${summary.moveMatches}/${summary.positions} match`);
  console.log(`Nodes ${summary.baselineNodes} -> ${summary.candidateNodes} (${percent(summary.nodeReductionRate)} reduction)`);
  console.log(`Improved ${summary.nodeImprovements}, regressed ${summary.nodeRegressions}`);
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

module.exports = { parseArgs, runComparison, summarize };
