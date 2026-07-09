#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const WeightConfig = require("../public/ai-weights.js");
const { seededRandom } = require("./benchmark.js");
const { mutateWeights, scoreMatch, wilsonLower, changedWeights } = require("./tune-weights.js");

function parseArgs(argv) {
  const options = {
    candidates: 24,
    roundGames: [2, 6, 20],
    roundRepeats: [3, 2, 1],
    keep: 0.25,
    validationGames: 100,
    trainingSeed: 121001,
    validationSeed: 122001,
    step: 8,
    maxDepth: 1,
    openingPlies: [6, 10, 14],
    openingPhases: ["namua"],
    mutatePhases: ["namua"],
    initialWeights: null,
    output: "artifacts/ai-weights-successive.json",
  };
  let roundRepeatsProvided = false;
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (name === "--candidates") options.candidates = Number(value);
    else if (name === "--round-games") options.roundGames = value.split(",").map(Number);
    else if (name === "--round-repeats") {
      options.roundRepeats = value.split(",").map(Number);
      roundRepeatsProvided = true;
    }
    else if (name === "--keep") options.keep = Number(value);
    else if (name === "--validation-games") options.validationGames = Number(value);
    else if (name === "--training-seed") options.trainingSeed = Number(value);
    else if (name === "--validation-seed") options.validationSeed = Number(value);
    else if (name === "--step") options.step = Number(value);
    else if (name === "--max-depth") options.maxDepth = Number(value);
    else if (name === "--opening-plies") options.openingPlies = value.split(",").map(Number);
    else if (name === "--opening-phases") options.openingPhases = value.split(",");
    else if (name === "--mutate-phases") options.mutatePhases = value.split(",");
    else if (name === "--initial-weights") {
      options.initialWeights = WeightConfig.validateWeights(JSON.parse(fs.readFileSync(value, "utf8")));
    } else if (name === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${name}`);
  }
  if (!Number.isInteger(options.candidates) || options.candidates < 2) {
    throw new Error("Invalid candidates");
  }
  if (!options.roundGames.length
    || options.roundGames.some((games) => !Number.isInteger(games) || games < 2 || games % 2)) {
    throw new Error("Round game counts must be positive and even");
  }
  if (!roundRepeatsProvided && ![1, options.roundGames.length].includes(options.roundRepeats.length)) {
    options.roundRepeats = [options.roundRepeats[0]];
  }
  if (!options.roundRepeats.length
    || options.roundRepeats.some((repeats) => !Number.isInteger(repeats) || repeats < 1)) {
    throw new Error("Round repeats must be positive integers");
  }
  if (![1, options.roundGames.length].includes(options.roundRepeats.length)) {
    throw new Error("Round repeats must have one value or match round games");
  }
  if (!(options.keep > 0 && options.keep < 1)) throw new Error("Invalid keep ratio");
  if (!Number.isInteger(options.validationGames) || options.validationGames < 2
    || options.validationGames % 2) throw new Error("Invalid validation games");
  for (const list of [options.openingPhases, options.mutatePhases]) {
    if (!list.length || list.some((phase) => !["namua", "mtaji"].includes(phase))) {
      throw new Error("Invalid phases");
    }
  }
  return options;
}

function createCandidates(source, count, random, step, phases) {
  const candidates = [];
  const seen = new Set([JSON.stringify(source)]);
  while (candidates.length < count) {
    const weights = mutateWeights(source, random, step, phases);
    const key = JSON.stringify(weights);
    if (!seen.has(key)) {
      seen.add(key);
      candidates.push(weights);
    }
  }
  return candidates;
}

function selectSurvivors(scored, keep) {
  const count = Math.max(1, Math.ceil(scored.length * keep));
  return [...scored].sort((a, b) => b.score - a.score).slice(0, count);
}

function scoreCandidate(weights, baseline, options, round, games) {
  let total = 0;
  const details = [];
  let samples = 0;
  const repeats = options.roundRepeats.length === 1
    ? options.roundRepeats[0]
    : options.roundRepeats[round];
  for (let repeat = 0; repeat < repeats; repeat += 1) {
    for (let index = 0; index < options.openingPhases.length; index += 1) {
      const phase = options.openingPhases[index];
      const opening = options.openingPlies[(round + repeat + index) % options.openingPlies.length];
      const match = scoreMatch(
        weights, baseline, options,
        options.trainingSeed + round * 10000 + repeat * 100 + index,
        opening, games, phase,
      );
      total += match.score;
      samples += 1;
      details.push({ repeat: repeat + 1, phase, opening, score: match.score });
    }
  }
  return { score: total / samples, details, samples };
}

function successiveTune(options) {
  const baseline = WeightConfig.cloneWeights(options.initialWeights || WeightConfig.DEFAULT_WEIGHTS);
  const random = seededRandom(options.trainingSeed);
  let pool = createCandidates(
    baseline, options.candidates, random, options.step, options.mutatePhases,
  ).map((weights, id) => ({ id, weights }));
  const rounds = [];

  for (let round = 0; round < options.roundGames.length; round += 1) {
    const scored = pool.map((candidate) => ({
      ...candidate,
      ...scoreCandidate(candidate.weights, baseline, options, round, options.roundGames[round]),
    }));
    const survivors = selectSurvivors(scored, options.keep);
    rounds.push({
      round: round + 1,
      gamesPerPhase: options.roundGames[round],
      repeats: options.roundRepeats.length === 1
        ? options.roundRepeats[0]
        : options.roundRepeats[round],
      candidates: scored.length,
      survivors: survivors.length,
      bestScore: survivors[0].score,
    });
    pool = survivors;
  }

  const winner = pool.sort((a, b) => b.score - a.score)[0];
  let validationWins = 0;
  let validationLosses = 0;
  let validationDraws = 0;
  const gamesPerPhase = options.validationGames / options.openingPhases.length;
  if (!Number.isInteger(gamesPerPhase) || gamesPerPhase % 2) {
    throw new Error("Validation games must divide evenly into phase pairs");
  }
  for (let index = 0; index < options.openingPhases.length; index += 1) {
    const match = scoreMatch(
      winner.weights, WeightConfig.DEFAULT_WEIGHTS, options,
      options.validationSeed + index,
      options.openingPlies[(options.openingPlies.length - 1 - index
        + options.openingPlies.length) % options.openingPlies.length],
      gamesPerPhase, options.openingPhases[index],
    ).report.competitors[0];
    validationWins += match.wins;
    validationLosses += match.losses;
    validationDraws += match.draws;
  }
  const lower = wilsonLower(validationWins, options.validationGames);
  return {
    weights: winner.weights,
    changes: changedWeights(WeightConfig.DEFAULT_WEIGHTS, winner.weights),
    rounds,
    validation: {
      seed: options.validationSeed,
      games: options.validationGames,
      wins: validationWins,
      losses: validationLosses,
      draws: validationDraws,
      winRate: (validationWins + validationDraws * 0.5) / options.validationGames,
      wilsonLower95: lower,
      statisticallySuperior: lower > 0.5,
    },
  };
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = successiveTune(options);
    fs.writeFileSync(options.output, `${JSON.stringify(result.weights, null, 2)}\n`);
    console.log(JSON.stringify({ output: options.output, ...result }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, createCandidates, selectSurvivors, scoreCandidate, successiveTune };
