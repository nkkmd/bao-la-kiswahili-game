#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { runBenchmark, seededRandom } = require("./benchmark.js");
const WeightConfig = require("../public/ai-weights.js");

function parseArgs(argv) {
  const options = {
    generations: 3,
    candidates: 6,
    games: 20,
    validationGames: 100,
    trainingSeed: 41001,
    validationSeed: 42001,
    step: 2,
    maxDepth: 1,
    openingPlies: [4, 8, 12],
    openingPhases: ["namua"],
    mutatePhases: ["namua", "mtaji"],
    initialWeights: null,
    output: "artifacts/ai-weights-tuned.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (name === "--generations") options.generations = Number(value);
    else if (name === "--candidates") options.candidates = Number(value);
    else if (name === "--games") options.games = Number(value);
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
    }
    else if (name === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${name}`);
  }
  for (const name of ["generations", "candidates", "games", "validationGames", "step", "maxDepth"]) {
    if (!Number.isInteger(options[name]) || options[name] < 1) throw new Error(`Invalid ${name}`);
  }
  if (options.games % 2 || options.validationGames % 2) throw new Error("Game counts must be even");
  if (!options.openingPlies.length || options.openingPlies.some((value) => !Number.isInteger(value))) {
    throw new Error("Invalid opening plies");
  }
  if (!options.openingPhases.length
    || options.openingPhases.some((phase) => !["namua", "mtaji"].includes(phase))) {
    throw new Error("Invalid opening phases");
  }
  if (!options.mutatePhases.length
    || options.mutatePhases.some((phase) => !["namua", "mtaji"].includes(phase))) {
    throw new Error("Invalid mutation phases");
  }
  return options;
}

function mutateWeights(source, random, step, phases = ["namua", "mtaji"]) {
  const result = WeightConfig.cloneWeights(source);
  const genes = phases.flatMap((phase) => Object.keys(result[phase])
    .map((name) => ({ phase, name })));
  const changes = 1 + Math.floor(random() * 3);
  for (let count = 0; count < changes; count += 1) {
    const gene = genes[Math.floor(random() * genes.length)];
    const delta = random() < 0.5 ? -step : step;
    result[gene.phase][gene.name] = Math.max(-20, Math.min(30,
      result[gene.phase][gene.name] + delta));
  }
  return result;
}

function scoreMatch(candidate, opponent, options, seed, openingPlies, games, openingPhase = "any") {
  const report = runBenchmark({
    games,
    seed,
    first: "hard",
    second: "hard",
    firstProfile: "bao",
    secondProfile: "bao",
    firstSearch: "phase2",
    secondSearch: "phase2",
    firstWeights: candidate,
    secondWeights: opponent,
    maxTurns: 300,
    openingPlies,
    openingPhase,
    timeLimitMs: 0,
    maxDepth: options.maxDepth,
    json: false,
  });
  const result = report.competitors[0];
  return { score: (result.wins + result.draws * 0.5) / games, report };
}

function wilsonLower(wins, games, z = 1.959963984540054) {
  if (!games) return 0;
  const p = wins / games;
  const denominator = 1 + z * z / games;
  const center = p + z * z / (2 * games);
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * games)) / games);
  return (center - margin) / denominator;
}

function changedWeights(before, after) {
  const result = [];
  for (const phase of ["namua", "mtaji"]) {
    for (const name of Object.keys(before[phase])) {
      if (before[phase][name] !== after[phase][name]) {
        result.push({ phase, name, before: before[phase][name], after: after[phase][name] });
      }
    }
  }
  return result;
}

function tune(options) {
  const random = seededRandom(options.trainingSeed);
  let champion = WeightConfig.cloneWeights(options.initialWeights || WeightConfig.DEFAULT_WEIGHTS);
  const archive = [WeightConfig.cloneWeights(WeightConfig.DEFAULT_WEIGHTS)];
  if (JSON.stringify(champion) !== JSON.stringify(WeightConfig.DEFAULT_WEIGHTS)) {
    archive.push(WeightConfig.cloneWeights(champion));
  }
  const history = [];

  for (let generation = 0; generation < options.generations; generation += 1) {
    const pool = Array.from({ length: options.candidates }, () => (
      mutateWeights(champion, random, options.step, options.mutatePhases)
    ));
    let best = { weights: champion, score: 0.5 };
    for (let index = 0; index < pool.length; index += 1) {
      const opponents = archive.slice(-3);
      let total = 0;
      for (let opponent = 0; opponent < opponents.length; opponent += 1) {
        const opening = options.openingPlies[(generation + opponent) % options.openingPlies.length];
        const phase = options.openingPhases[(generation + opponent) % options.openingPhases.length];
        total += scoreMatch(
          pool[index], opponents[opponent], options,
          options.trainingSeed + generation * 1000 + opponent,
          opening, options.games, phase,
        ).score;
      }
      const score = total / opponents.length;
      if (score > best.score) best = { weights: pool[index], score };
    }
    const accepted = best.weights !== champion;
    const changes = accepted ? changedWeights(champion, best.weights) : [];
    if (accepted) {
      champion = best.weights;
      archive.push(WeightConfig.cloneWeights(champion));
    }
    history.push({ generation: generation + 1, score: best.score, accepted, changes });
  }

  const validation = scoreMatch(
    champion,
    WeightConfig.DEFAULT_WEIGHTS,
    options,
    options.validationSeed,
    options.openingPlies[options.openingPlies.length - 1],
    options.validationGames,
    options.openingPhases[options.openingPhases.length - 1],
  ).report;
  const result = validation.competitors[0];
  const lower = wilsonLower(result.wins, options.validationGames);
  return {
    weights: champion,
    history,
    validation: {
      seed: options.validationSeed,
      games: options.validationGames,
      wins: result.wins,
      losses: result.losses,
      draws: result.draws,
      winRate: result.winRate,
      wilsonLower95: lower,
      statisticallySuperior: lower > 0.5,
    },
  };
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = tune(options);
    fs.writeFileSync(options.output, `${JSON.stringify(result.weights, null, 2)}\n`);
    console.log(JSON.stringify({ output: options.output, ...result }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, mutateWeights, scoreMatch, wilsonLower, changedWeights, tune };
