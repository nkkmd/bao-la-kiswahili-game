#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const { runBenchmark, seededRandom } = require("./benchmark.js");
const { mutateWeights, changedWeights } = require("./tune-weights.js");
const { runTacticalSuite } = require("../test/tactical.test.js");
const { wilsonLower } = require("./phase7-decision.js");

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
    candidates: 16,
    roundGames: [2, 6, 12],
    roundRepeats: [2, 2, 1],
    keep: 0.5,
    validationGames: 48,
    finalGames: 500,
    trainingSeed: 20260901,
    validationSeed: 20261001,
    finalSeed: 20261101,
    seedStep: 100,
    step: 4,
    maxDepth: 1,
    openingPlies: [4, 8, 12],
    openingPhases: ["namua", "mtaji"],
    mutatePhases: ["namua", "mtaji"],
    baselines: ["default", "artifacts/ai-weights-phase3.json"],
    minScore: 0.5,
    maxTacticalFailures: 0,
    tacticalPenalty: 0.08,
    promoteTop: 1,
    promoteDir: "artifacts/phase9-promoted",
    output: "artifacts/phase9-tune.json",
    json: false,
  };
  let roundRepeatsProvided = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--candidates") options.candidates = integerArg(value, arg, 2);
    else if (arg === "--round-games") options.roundGames = listArg(value).map((item) => integerArg(item, arg, 2));
    else if (arg === "--round-repeats") {
      options.roundRepeats = listArg(value).map((item) => integerArg(item, arg, 1));
      roundRepeatsProvided = true;
    } else if (arg === "--keep") options.keep = numberArg(value, arg);
    else if (arg === "--validation-games") options.validationGames = integerArg(value, arg, 2);
    else if (arg === "--final-games") options.finalGames = integerArg(value, arg, 2);
    else if (arg === "--training-seed") options.trainingSeed = integerArg(value, arg, 0);
    else if (arg === "--validation-seed") options.validationSeed = integerArg(value, arg, 0);
    else if (arg === "--final-seed") options.finalSeed = integerArg(value, arg, 0);
    else if (arg === "--seed-step") options.seedStep = integerArg(value, arg, 1);
    else if (arg === "--step") options.step = integerArg(value, arg, 1);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = listArg(value).map((item) => integerArg(item, arg, 0));
    else if (arg === "--opening-phases") options.openingPhases = listArg(value);
    else if (arg === "--mutate-phases") options.mutatePhases = listArg(value);
    else if (arg === "--baselines") options.baselines = listArg(value);
    else if (arg === "--min-score") options.minScore = numberArg(value, arg);
    else if (arg === "--max-tactical-failures") options.maxTacticalFailures = integerArg(value, arg, 0);
    else if (arg === "--tactical-penalty") options.tacticalPenalty = numberArg(value, arg);
    else if (arg === "--promote-top") options.promoteTop = integerArg(value, arg, 0);
    else if (arg === "--promote-dir") options.promoteDir = value;
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!options.roundGames.length || options.roundGames.some((games) => games % 2)) {
    throw new Error("Round game counts must be even");
  }
  if (!roundRepeatsProvided && ![1, options.roundGames.length].includes(options.roundRepeats.length)) {
    options.roundRepeats = [options.roundRepeats[0]];
  }
  if (![1, options.roundGames.length].includes(options.roundRepeats.length)) {
    throw new Error("Round repeats must have one value or match round games");
  }
  if (!(options.keep > 0 && options.keep < 1)) throw new Error("Invalid keep ratio");
  for (const count of [options.validationGames, options.finalGames]) {
    if (count % 2) throw new Error("Validation and final game counts must be even");
  }
  for (const list of [options.openingPhases, options.mutatePhases]) {
    if (!list.length || list.some((phase) => !["namua", "mtaji"].includes(phase))) {
      throw new Error("Invalid phases");
    }
  }
  if (!options.baselines.length) throw new Error("At least one baseline is required");
  if (options.minScore > 1) throw new Error("Invalid minimum score");
  return options;
}

function loadBaselines(items) {
  return items.map((item) => {
    if (item === "default" || item === "bao") {
      return { name: "default", source: "default", weights: WeightConfig.DEFAULT_WEIGHTS };
    }
    const weights = WeightConfig.validateWeights(JSON.parse(fs.readFileSync(item, "utf8")));
    return { name: path.basename(item, ".json"), source: item, weights };
  });
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

function emptySummary() {
  return {
    games: 0, wins: 0, losses: 0, draws: 0, moves: 0,
    elapsedMs: 0, maxMoveMs: 0, nodes: 0, timeouts: 0,
  };
}

function addReport(summary, report) {
  const first = report.competitors[0];
  summary.games += first.wins + first.losses + first.draws;
  summary.wins += first.wins;
  summary.losses += first.losses;
  summary.draws += first.draws;
  summary.moves += first.moves;
  summary.elapsedMs += first.averageMoveMs * first.moves;
  summary.maxMoveMs = Math.max(summary.maxMoveMs, first.maxMoveMs);
  summary.nodes += first.totalNodes;
  summary.timeouts += first.timeouts;
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

function benchmarkCandidate(weights, baseline, options, seed, openingPhase, openingPlies, games) {
  return runBenchmark({
    games,
    seed,
    first: "hard",
    second: "hard",
    firstProfile: "bao",
    secondProfile: "bao",
    firstSearch: "phase2",
    secondSearch: "phase2",
    firstWeights: weights,
    secondWeights: baseline.weights,
    maxTurns: 300,
    openingPlies,
    openingPhase,
    timeLimitMs: 0,
    maxDepth: options.maxDepth,
    json: false,
  });
}

function scoreCandidate(candidate, baselines, options, round, games) {
  const tactical = runTacticalSuite({
    evaluationProfile: "bao",
    evaluationWeights: candidate.weights,
    diagnostics: false,
  });
  const summary = emptySummary();
  const categoryMap = new Map();
  const details = [];
  const repeats = options.roundRepeats.length === 1
    ? options.roundRepeats[0]
    : options.roundRepeats[round];
  for (let repeat = 0; repeat < repeats; repeat += 1) {
    for (let baselineIndex = 0; baselineIndex < baselines.length; baselineIndex += 1) {
      for (let phaseIndex = 0; phaseIndex < options.openingPhases.length; phaseIndex += 1) {
        const baseline = baselines[baselineIndex];
        const openingPhase = options.openingPhases[phaseIndex];
        const openingPlies = options.openingPlies[
          (round + repeat + baselineIndex + phaseIndex) % options.openingPlies.length
        ];
        const seed = options.trainingSeed
          + round * 10000 + repeat * options.seedStep + baselineIndex * 10 + phaseIndex;
        const report = benchmarkCandidate(
          candidate.weights, baseline, options, seed, openingPhase, openingPlies, games,
        );
        addReport(summary, report);
        const first = report.competitors[0];
        const score = (first.wins + first.draws * 0.5) / games;
        const key = `${baseline.name}/${openingPhase}/${openingPlies}`;
        if (!categoryMap.has(key)) categoryMap.set(key, { baseline: baseline.name, openingPhase, openingPlies, ...emptySummary() });
        addReport(categoryMap.get(key), report);
        details.push({
          repeat: repeat + 1,
          baseline: baseline.name,
          seed,
          openingPhase,
          openingPlies,
          wins: first.wins,
          losses: first.losses,
          draws: first.draws,
          score,
          timeouts: first.timeouts,
        });
      }
    }
  }
  const raw = finalizeSummary(summary);
  const tacticalFailures = tactical.failures.length;
  return {
    ...candidate,
    tacticalPassed: tactical.passed,
    tacticalTotal: tactical.total,
    tacticalFailures: tactical.failures,
    rawScore: raw.score,
    score: raw.score - tacticalFailures * options.tacticalPenalty,
    details,
    categories: [...categoryMap.values()].map((item) => ({
      baseline: item.baseline,
      openingPhase: item.openingPhase,
      openingPlies: item.openingPlies,
      ...finalizeSummary(item),
    })),
    ...raw,
  };
}

function selectSurvivors(scored, keep) {
  const count = Math.max(1, Math.ceil(scored.length * keep));
  return [...scored].sort((a, b) => b.score - a.score
    || b.rawScore - a.rawScore
    || a.tacticalFailures.length - b.tacticalFailures.length).slice(0, count);
}

function validateCandidate(candidate, baselines, options) {
  const summary = emptySummary();
  const details = [];
  const gamesPerBucket = options.validationGames / (baselines.length * options.openingPhases.length);
  if (!Number.isInteger(gamesPerBucket) || gamesPerBucket % 2) {
    throw new Error("Validation games must divide evenly into baseline/phase buckets");
  }
  for (let baselineIndex = 0; baselineIndex < baselines.length; baselineIndex += 1) {
    for (let phaseIndex = 0; phaseIndex < options.openingPhases.length; phaseIndex += 1) {
      const baseline = baselines[baselineIndex];
      const openingPhase = options.openingPhases[phaseIndex];
      const openingPlies = options.openingPlies[
        (options.openingPlies.length - 1 - phaseIndex + baselineIndex) % options.openingPlies.length
      ];
      const seed = options.validationSeed + baselineIndex * options.seedStep + phaseIndex;
      const report = benchmarkCandidate(
        candidate.weights, baseline, options, seed, openingPhase, openingPlies, gamesPerBucket,
      );
      addReport(summary, report);
      const first = report.competitors[0];
      details.push({
        baseline: baseline.name,
        seed,
        openingPhase,
        openingPlies,
        wins: first.wins,
        losses: first.losses,
        draws: first.draws,
        score: (first.wins + first.draws * 0.5) / gamesPerBucket,
        timeouts: first.timeouts,
      });
    }
  }
  return { details, ...finalizeSummary(summary) };
}

function commandQuote(value) {
  return /[^A-Za-z0-9_./:=,-]/.test(value) ? JSON.stringify(value) : value;
}

function finalCommands(candidatePath, baselines, options) {
  const gamesPerBucket = options.finalGames / (baselines.length * options.openingPhases.length);
  if (!Number.isInteger(gamesPerBucket)) return [];
  const commands = [];
  for (let baselineIndex = 0; baselineIndex < baselines.length; baselineIndex += 1) {
    for (let phaseIndex = 0; phaseIndex < options.openingPhases.length; phaseIndex += 1) {
      const baseline = baselines[baselineIndex];
      const openingPhase = options.openingPhases[phaseIndex];
      const openingPlies = options.openingPlies[
        (options.openingPlies.length - 1 - phaseIndex + baselineIndex) % options.openingPlies.length
      ];
      const args = [
        "node", "tools/benchmark.js",
        "--games", String(gamesPerBucket),
        "--seed", String(options.finalSeed + baselineIndex * options.seedStep + phaseIndex),
        "--first", "hard", "--second", "hard",
        "--first-profile", "bao", "--second-profile", "bao",
        "--first-search", "phase2", "--second-search", "phase2",
        "--first-weights", candidatePath,
        "--time-limit", "0",
        "--max-depth", String(options.maxDepth),
        "--opening-phase", openingPhase,
        "--opening-plies", String(openingPlies),
        "--max-turns", "300",
        "--json",
      ];
      if (baseline.source !== "default") args.push("--second-weights", baseline.source);
      commands.push(args.map(commandQuote).join(" "));
    }
  }
  return commands;
}

function phase9Tune(options) {
  const baselines = loadBaselines(options.baselines);
  const random = seededRandom(options.trainingSeed);
  let pool = createCandidates(
    WeightConfig.DEFAULT_WEIGHTS, options.candidates, random, options.step, options.mutatePhases,
  ).map((weights, index) => ({ name: `candidate-${String(index + 1).padStart(2, "0")}`, weights }));
  const rounds = [];

  for (let round = 0; round < options.roundGames.length; round += 1) {
    const scored = pool.map((candidate) => (
      scoreCandidate(candidate, baselines, options, round, options.roundGames[round])
    ));
    const survivors = selectSurvivors(scored, options.keep);
    rounds.push({
      round: round + 1,
      gamesPerBucket: options.roundGames[round],
      candidates: scored.length,
      survivors: survivors.length,
      candidatesSummary: scored.map((item) => ({
        name: item.name,
        score: item.score,
        rawScore: item.rawScore,
        games: item.games,
        wins: item.wins,
        losses: item.losses,
        draws: item.draws,
        tacticalPassed: item.tacticalPassed,
        tacticalTotal: item.tacticalTotal,
        tacticalFailures: item.tacticalFailures,
      })),
    });
    pool = survivors.map((item) => ({
      name: item.name,
      weights: item.weights,
      tacticalPassed: item.tacticalPassed,
      tacticalTotal: item.tacticalTotal,
      tacticalFailures: item.tacticalFailures,
      categories: item.categories,
    }));
  }

  const finalists = pool.map((candidate) => {
    const validation = validateCandidate(candidate, baselines, options);
    const eligible = candidate.tacticalFailures.length <= options.maxTacticalFailures
      && validation.score >= options.minScore;
    return {
      name: candidate.name,
      weights: candidate.weights,
      changes: changedWeights(WeightConfig.DEFAULT_WEIGHTS, candidate.weights),
      tacticalPassed: candidate.tacticalPassed,
      tacticalTotal: candidate.tacticalTotal,
      tacticalFailures: candidate.tacticalFailures,
      categories: candidate.categories,
      validation,
      eligible,
    };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible)
    || b.validation.score - a.validation.score
    || a.tacticalFailures.length - b.tacticalFailures.length);

  const promoted = finalists.filter((item) => item.eligible).slice(0, options.promoteTop);
  fs.mkdirSync(options.promoteDir, { recursive: true });
  for (const item of promoted) {
    const file = path.join(options.promoteDir, `${item.name}.json`);
    fs.writeFileSync(file, `${JSON.stringify(item.weights, null, 2)}\n`);
    item.candidatePath = file;
    item.finalVerificationCommands = finalCommands(file, baselines, options);
  }

  return {
    config: options,
    baselines: baselines.map(({ name, source }) => ({ name, source })),
    rounds,
    finalists,
    promoted: promoted.map((item) => ({
      name: item.name,
      candidatePath: item.candidatePath,
      finalVerificationCommands: item.finalVerificationCommands,
    })),
  };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printText(report) {
  console.log([
    "Phase 9 tuning:",
    `baselines=${report.baselines.map((item) => item.name).join(",")}`,
    `rounds=${report.rounds.length}`,
    `finalists=${report.finalists.length}`,
  ].join(" "));
  for (const item of report.finalists) {
    console.log([
      item.name,
      item.eligible ? "long-run-candidate" : "hold",
      `${item.validation.wins}-${item.validation.losses}-${item.validation.draws}`,
      `score=${percent(item.validation.score)}`,
      `wilson95=${percent(item.validation.wilsonLower95)}`,
      `tactical=${item.tacticalPassed}/${item.tacticalTotal}`,
    ].join(" "));
  }
  for (const item of report.promoted) {
    console.log(`${item.name} promoted: ${item.candidatePath}`);
    for (const command of item.finalVerificationCommands) console.log(`  ${command}`);
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = phase9Tune(options);
    fs.mkdirSync(path.dirname(options.output), { recursive: true });
    fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printText(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  parseArgs,
  loadBaselines,
  createCandidates,
  scoreCandidate,
  selectSurvivors,
  validateCandidate,
  finalCommands,
  phase9Tune,
};
