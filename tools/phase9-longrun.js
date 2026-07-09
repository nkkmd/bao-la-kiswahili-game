#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const { runBenchmark } = require("./benchmark.js");
const { decide } = require("./phase9-decision.js");

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
    games: 500,
    chunks: 5,
    runChunks: 0,
    seed: 20261101,
    seedStep: 1000,
    openingPlies: null,
    openingPhases: null,
    baselines: null,
    timeLimitMs: 0,
    maxDepth: null,
    maxTurns: 300,
    minScore: 0.5,
    minGames: 500,
    minWilson: 0.5,
    output: "artifacts/phase9-longrun.json",
    decisionOutput: "artifacts/phase9-decision.json",
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--input") options.input = value;
    else if (arg === "--candidate") options.candidate = value;
    else if (arg === "--games") options.games = integerArg(value, arg, 1);
    else if (arg === "--chunks") options.chunks = integerArg(value, arg, 1);
    else if (arg === "--run-chunks") options.runChunks = integerArg(value, arg, 0);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--seed-step") options.seedStep = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = listArg(value).map((item) => integerArg(item, arg, 0));
    else if (arg === "--opening-phases") options.openingPhases = listArg(value);
    else if (arg === "--baselines") options.baselines = listArg(value);
    else if (arg === "--time-limit") options.timeLimitMs = numberArg(value, arg);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--max-turns") options.maxTurns = integerArg(value, arg, 1);
    else if (arg === "--min-score") options.minScore = numberArg(value, arg);
    else if (arg === "--min-games") options.minGames = integerArg(value, arg, 1);
    else if (arg === "--min-wilson") options.minWilson = numberArg(value, arg);
    else if (arg === "--output") options.output = value;
    else if (arg === "--decision-output") options.decisionOutput = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!options.input) throw new Error("Provide --input");
  if (!options.candidate) throw new Error("Provide --candidate");
  if (options.runChunks > options.chunks) throw new Error("Run chunks cannot exceed total chunks");
  if (options.minScore > 1) throw new Error("Invalid minimum score");
  if (options.minWilson > 1) throw new Error("Invalid minimum Wilson lower bound");
  return options;
}

function loadPhase9Report(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function candidateMatches(candidate, name) {
  return candidate.name === name || candidate.name?.endsWith(name);
}

function findCandidate(report, name) {
  const candidates = Array.isArray(report.finalists) ? report.finalists : report.candidates || [];
  const candidate = candidates.find((item) => candidateMatches(item, name));
  if (!candidate) throw new Error(`Candidate not found: ${name}`);
  return candidate;
}

function loadCandidateWeights(report, candidate) {
  const promoted = (report.promoted || []).find((item) => candidateMatches(item, candidate.name));
  if (promoted?.candidatePath && fs.existsSync(promoted.candidatePath)) {
    return WeightConfig.validateWeights(JSON.parse(fs.readFileSync(promoted.candidatePath, "utf8")));
  }
  if (candidate.weights) return WeightConfig.validateWeights(candidate.weights);
  throw new Error(`Candidate weights not found: ${candidate.name}`);
}

function baselineFromSource(source) {
  if (source === "default" || source === "bao") {
    return { name: "default", source: "default", weights: WeightConfig.DEFAULT_WEIGHTS };
  }
  const weights = WeightConfig.validateWeights(JSON.parse(fs.readFileSync(source, "utf8")));
  return { name: path.basename(source, ".json"), source, weights };
}

function loadBaselines(report, options) {
  const sources = options.baselines || (report.baselines || []).map((item) => item.source);
  if (!sources.length) throw new Error("No baselines found");
  return sources.map(baselineFromSource);
}

function runPlan(report, options) {
  const config = report.config || {};
  const baselines = loadBaselines(report, options);
  const openingPhases = options.openingPhases || config.openingPhases || ["namua", "mtaji"];
  const openingPlies = options.openingPlies || config.openingPlies || [4, 8, 12];
  const maxDepth = options.maxDepth || config.maxDepth || 1;
  if (openingPhases.some((phase) => !["namua", "mtaji"].includes(phase))) {
    throw new Error("Invalid opening phases");
  }
  const buckets = [];
  for (let baselineIndex = 0; baselineIndex < baselines.length; baselineIndex += 1) {
    for (let phaseIndex = 0; phaseIndex < openingPhases.length; phaseIndex += 1) {
      buckets.push({
        baseline: baselines[baselineIndex],
        openingPhase: openingPhases[phaseIndex],
        openingPlies: openingPlies[
          (openingPlies.length - 1 - phaseIndex + baselineIndex) % openingPlies.length
        ],
        bucketIndex: buckets.length,
      });
    }
  }
  const gamesPerBucketChunk = options.games / (options.chunks * buckets.length);
  if (!Number.isInteger(gamesPerBucketChunk)) {
    throw new Error("Games must divide evenly into chunks and baseline/phase buckets");
  }
  return { baselines, openingPhases, openingPlies, maxDepth, buckets, gamesPerBucketChunk };
}

function benchmarkBucket(candidateWeights, bucket, options, plan, chunkIndex) {
  return runBenchmark({
    games: plan.gamesPerBucketChunk,
    seed: options.seed + chunkIndex * options.seedStep + bucket.bucketIndex,
    first: "hard",
    second: "hard",
    firstProfile: "bao",
    secondProfile: "bao",
    firstSearch: "phase2",
    secondSearch: "phase2",
    firstWeights: candidateWeights,
    secondWeights: bucket.baseline.weights,
    maxTurns: options.maxTurns,
    openingPlies: bucket.openingPlies,
    openingPhase: bucket.openingPhase,
    timeLimitMs: options.timeLimitMs,
    maxDepth: plan.maxDepth,
    json: false,
  });
}

function emptySummary() {
  return {
    games: 0, wins: 0, losses: 0, draws: 0, moves: 0,
    elapsedMs: 0, maxMoveMs: 0, nodes: 0, timeouts: 0,
  };
}

function addBenchmark(summary, report) {
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
  return {
    games: summary.games,
    wins: summary.wins,
    losses: summary.losses,
    draws: summary.draws,
    score: summary.games ? (summary.wins + summary.draws * 0.5) / summary.games : 0,
    averageMoveMs: summary.moves ? summary.elapsedMs / summary.moves : 0,
    maxMoveMs: summary.maxMoveMs,
    averageNodes: summary.moves ? summary.nodes / summary.moves : 0,
    timeouts: summary.timeouts,
  };
}

function aggregateChunks(config, candidate, chunks) {
  const summary = emptySummary();
  const details = [];
  for (const chunk of chunks) {
    for (const item of chunk.reports) {
      addBenchmark(summary, item.report);
      const first = item.report.competitors[0];
      details.push({
        chunk: chunk.chunk,
        baseline: item.baseline,
        seed: item.report.config.seed,
        openingPhase: item.openingPhase,
        openingPlies: item.openingPlies,
        games: first.wins + first.losses + first.draws,
        wins: first.wins,
        losses: first.losses,
        draws: first.draws,
        score: (first.wins + first.draws * 0.5) / (first.wins + first.losses + first.draws),
        timeouts: first.timeouts,
      });
    }
  }
  return {
    config,
    chunks,
    candidates: [{
      name: candidate.name,
      tacticalPassed: candidate.tacticalPassed,
      tacticalTotal: candidate.tacticalTotal,
      tacticalFailures: candidate.tacticalFailures || [],
      finalDetails: details,
      ...finalizeSummary(summary),
    }],
  };
}

function readExisting(output) {
  if (!output || !fs.existsSync(output)) return null;
  return JSON.parse(fs.readFileSync(output, "utf8"));
}

function runLongrun(options) {
  const report = loadPhase9Report(options.input);
  const candidate = findCandidate(report, options.candidate);
  const weights = loadCandidateWeights(report, candidate);
  const plan = runPlan(report, options);
  const existing = readExisting(options.output);
  const chunks = existing?.chunks ? [...existing.chunks] : [];
  const start = chunks.length;
  const limit = options.runChunks ? Math.min(options.chunks, start + options.runChunks) : start;
  for (let chunkIndex = start; chunkIndex < limit; chunkIndex += 1) {
    const reports = plan.buckets.map((bucket) => ({
      baseline: bucket.baseline.name,
      openingPhase: bucket.openingPhase,
      openingPlies: bucket.openingPlies,
      report: benchmarkBucket(weights, bucket, options, plan, chunkIndex),
    }));
    chunks.push({ chunk: chunkIndex + 1, reports });
    fs.mkdirSync(path.dirname(options.output), { recursive: true });
    fs.writeFileSync(options.output, `${JSON.stringify(aggregateChunks(options, candidate, chunks), null, 2)}\n`);
  }
  const aggregate = aggregateChunks(options, candidate, chunks);
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(aggregate, null, 2)}\n`);
  if (options.decisionOutput && aggregate.candidates.length) {
    const decision = decide({
      input: options.output,
      candidate: options.candidate,
      finalReports: [],
      minScore: options.minScore,
      minGames: options.minGames,
      minWilson: options.minWilson,
      maxTacticalFailures: 0,
      output: null,
      json: false,
    });
    fs.mkdirSync(path.dirname(options.decisionOutput), { recursive: true });
    fs.writeFileSync(options.decisionOutput, `${JSON.stringify(decision, null, 2)}\n`);
  }
  return aggregate;
}

function printText(report) {
  const totalChunks = report.config.chunks;
  console.log(`Phase 9 longrun: chunks=${report.chunks.length}/${totalChunks} games=${report.config.games}`);
  for (const item of report.candidates) {
    console.log([
      item.name,
      `${item.wins}-${item.losses}-${item.draws}`,
      `score=${(item.score * 100).toFixed(1)}%`,
      `tactical=${item.tacticalPassed}/${item.tacticalTotal}`,
      `timeouts=${item.timeouts}`,
    ].join(" "));
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = runLongrun(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printText(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  parseArgs,
  runPlan,
  aggregateChunks,
  runLongrun,
};
