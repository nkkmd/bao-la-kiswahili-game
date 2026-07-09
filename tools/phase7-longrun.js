#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const {
  parseArgs: parseValidationArgs,
  runValidation,
} = require("./phase7-validate.js");
const { decide } = require("./phase7-decision.js");

function integerArg(value, name, minimum = 0) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function parseArgs(argv) {
  const options = {
    input: null,
    candidates: [],
    games: 50,
    chunks: 5,
    runChunks: 0,
    seed: 20260900,
    seedStep: 1000,
    openingPlies: "4,8",
    openingPhases: "namua,mtaji",
    timeLimitMs: 150,
    maxDepth: 4,
    maxTurns: 100,
    minScore: 0.5,
    minGames: 500,
    minWilson: 0.5,
    output: "artifacts/phase7-base-longrun.json",
    decisionOutput: "artifacts/phase7-base-longrun-decision.json",
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
    else if (arg === "--chunks") options.chunks = integerArg(value, arg, 1);
    else if (arg === "--run-chunks") options.runChunks = integerArg(value, arg, 0);
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--seed-step") options.seedStep = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = value;
    else if (arg === "--opening-phases") options.openingPhases = value;
    else if (arg === "--time-limit") options.timeLimitMs = Number(value);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--max-turns") options.maxTurns = integerArg(value, arg, 1);
    else if (arg === "--min-score") options.minScore = Number(value);
    else if (arg === "--min-games") options.minGames = integerArg(value, arg, 1);
    else if (arg === "--min-wilson") options.minWilson = Number(value);
    else if (arg === "--output") options.output = value;
    else if (arg === "--decision-output") options.decisionOutput = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!options.input && !options.candidates.length) {
    throw new Error("Provide --input or --candidate");
  }
  if (options.games % 2) throw new Error("Game count must be even");
  if (options.runChunks > options.chunks) throw new Error("Run chunks cannot exceed total chunks");
  return options;
}

function validationArgv(options, chunkIndex) {
  const result = [];
  if (options.input) result.push("--input", options.input);
  for (const candidate of options.candidates) result.push("--candidate", candidate);
  result.push(
    "--games", String(options.games),
    "--seed", String(options.seed + chunkIndex * options.seedStep),
    "--repeats", "1",
    "--opening-plies", options.openingPlies,
    "--opening-phases", options.openingPhases,
    "--time-limit", String(options.timeLimitMs),
    "--max-depth", String(options.maxDepth),
    "--max-turns", String(options.maxTurns),
    "--min-score", String(options.minScore),
  );
  return result;
}

function readExisting(output) {
  if (!output || !fs.existsSync(output)) return null;
  return JSON.parse(fs.readFileSync(output, "utf8"));
}

function mergeCandidate(existing, next) {
  if (!existing) return {
    ...next,
    details: [...next.details],
  };
  const wins = existing.wins + next.wins;
  const losses = existing.losses + next.losses;
  const draws = existing.draws + next.draws;
  const games = wins + losses + draws;
  const totalMovesEstimate = (existing.averageMoveMs ? 1 : 0) + (next.averageMoveMs ? 1 : 0);
  return {
    ...next,
    tacticalPassed: Math.min(existing.tacticalPassed, next.tacticalPassed),
    tacticalTotal: Math.max(existing.tacticalTotal, next.tacticalTotal),
    tacticalFailures: [...existing.tacticalFailures, ...next.tacticalFailures],
    details: [...existing.details, ...next.details],
    games,
    wins,
    losses,
    draws,
    score: games ? (wins + draws * 0.5) / games : 0,
    averageMoveMs: totalMovesEstimate
      ? (existing.averageMoveMs + next.averageMoveMs) / totalMovesEstimate
      : 0,
    maxMoveMs: Math.max(existing.maxMoveMs, next.maxMoveMs),
    averageNodes: totalMovesEstimate
      ? (existing.averageNodes + next.averageNodes) / totalMovesEstimate
      : 0,
    timeouts: existing.timeouts + next.timeouts,
  };
}

function aggregateChunks(config, chunks) {
  const candidates = new Map();
  for (const chunk of chunks) {
    for (const candidate of chunk.report.candidates) {
      candidates.set(candidate.name, mergeCandidate(candidates.get(candidate.name), candidate));
    }
  }
  const results = [...candidates.values()].map((candidate) => ({
    ...candidate,
    eligible: candidate.tacticalFailures.length <= 0 && candidate.score >= config.minScore,
  })).sort((a, b) => a.tacticalFailures.length - b.tacticalFailures.length
    || b.score - a.score
    || a.averageMoveMs - b.averageMoveMs);
  return { config, chunks, candidates: results };
}

function runLongrun(options) {
  const existing = readExisting(options.output);
  const chunks = existing?.chunks ? [...existing.chunks] : [];
  const start = chunks.length;
  const limit = options.runChunks ? Math.min(options.chunks, start + options.runChunks) : start;
  for (let index = start; index < limit; index += 1) {
    const validationOptions = parseValidationArgs(validationArgv(options, index));
    const report = runValidation(validationOptions);
    chunks.push({ chunk: index + 1, report });
    fs.writeFileSync(options.output, `${JSON.stringify(aggregateChunks(options, chunks), null, 2)}\n`);
  }
  const aggregate = aggregateChunks(options, chunks);
  if (options.output) fs.writeFileSync(options.output, `${JSON.stringify(aggregate, null, 2)}\n`);
  if (options.decisionOutput && aggregate.candidates.length) {
    const decision = decide({
      input: options.output,
      candidate: null,
      minScore: options.minScore,
      minGames: options.minGames,
      minWilson: options.minWilson,
      maxTacticalFailures: 0,
      output: null,
      json: false,
    });
    fs.writeFileSync(options.decisionOutput, `${JSON.stringify(decision, null, 2)}\n`);
  }
  return aggregate;
}

function printText(report) {
  const totalChunks = report.config.chunks;
  console.log(`Phase 7 longrun: chunks=${report.chunks.length}/${totalChunks} gamesPerChunk=${report.config.games}`);
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
  validationArgv,
  aggregateChunks,
  runLongrun,
};
