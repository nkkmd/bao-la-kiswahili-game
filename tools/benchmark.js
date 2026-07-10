#!/usr/bin/env node
"use strict";

const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const AIConfig = require("../public/ai-config.js");
const WeightConfig = require("../public/ai-weights.js");
const fs = require("node:fs");

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function numberArg(value, name, minimum = 0) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function integerArg(value, name, minimum) {
  const result = numberArg(value, name, minimum);
  if (!Number.isInteger(result)) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function parseArgs(argv) {
  const options = {
    games: 100,
    seed: 20260706,
    first: "hard",
    second: "normal",
    firstProfile: "bao",
    secondProfile: "bao",
    firstSearch: "phase2",
    secondSearch: "phase2",
    firstWeights: null,
    secondWeights: null,
    firstAdjustments: null,
    secondAdjustments: null,
    firstAdaptive: false,
    secondAdaptive: false,
    firstTtMoveFirst: false,
    secondTtMoveFirst: false,
    firstQCaptureOrdering: false,
    secondQCaptureOrdering: false,
    firstHistoryHeuristic: false,
    secondHistoryHeuristic: false,
    firstAspirationWindow: 0,
    secondAspirationWindow: 0,
    firstEvaluationCache: false,
    secondEvaluationCache: false,
    maxTurns: 300,
    openingPlies: 0,
    openingPhase: "any",
    timeLimitMs: 50,
    maxDepth: 4,
    mctsIterations: null,
    mctsPlayoutTurns: 80,
    mctsExploration: Math.SQRT2,
    mctsPolicy: "evaluation",
    mctsRoot: "visits",
    mctsReward: "evaluation",
    mctsPrior: "none",
    mctsPriorWeight: 1,
    mctsCandidateLimit: 0,
    mctsCandidateSource: "static",
    mctsCandidateDepth: 1,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--first-adaptive") { options.firstAdaptive = true; continue; }
    if (arg === "--second-adaptive") { options.secondAdaptive = true; continue; }
    if (arg === "--first-tt-move-first") { options.firstTtMoveFirst = true; continue; }
    if (arg === "--second-tt-move-first") { options.secondTtMoveFirst = true; continue; }
    if (arg === "--first-q-capture-ordering") { options.firstQCaptureOrdering = true; continue; }
    if (arg === "--second-q-capture-ordering") { options.secondQCaptureOrdering = true; continue; }
    if (arg === "--first-history-heuristic") { options.firstHistoryHeuristic = true; continue; }
    if (arg === "--second-history-heuristic") { options.secondHistoryHeuristic = true; continue; }
    if (arg === "--first-evaluation-cache") { options.firstEvaluationCache = true; continue; }
    if (arg === "--second-evaluation-cache") { options.secondEvaluationCache = true; continue; }
    if (arg === "--games") options.games = integerArg(value, arg, 1);
    else if (arg === "--first-aspiration-window") {
      options.firstAspirationWindow = integerArg(value, arg, 1);
    } else if (arg === "--second-aspiration-window") {
      options.secondAspirationWindow = integerArg(value, arg, 1);
    }
    else if (arg === "--seed") options.seed = integerArg(value, arg, 0);
    else if (arg === "--first") options.first = value;
    else if (arg === "--second") options.second = value;
    else if (arg === "--first-profile") options.firstProfile = value;
    else if (arg === "--second-profile") options.secondProfile = value;
    else if (arg === "--first-search") options.firstSearch = value;
    else if (arg === "--second-search") options.secondSearch = value;
    else if (arg === "--first-weights") {
      options.firstWeights = WeightConfig.validateWeights(JSON.parse(fs.readFileSync(value, "utf8")));
    } else if (arg === "--second-weights") {
      options.secondWeights = WeightConfig.validateWeights(JSON.parse(fs.readFileSync(value, "utf8")));
    } else if (arg === "--first-adjustments") {
      options.firstAdjustments = WeightConfig.validateAdjustments(JSON.parse(fs.readFileSync(value, "utf8")));
    } else if (arg === "--second-adjustments") {
      options.secondAdjustments = WeightConfig.validateAdjustments(JSON.parse(fs.readFileSync(value, "utf8")));
    }
    else if (arg === "--max-turns") options.maxTurns = integerArg(value, arg, 1);
    else if (arg === "--opening-plies") options.openingPlies = integerArg(value, arg, 0);
    else if (arg === "--opening-phase") options.openingPhase = value;
    else if (arg === "--time-limit") options.timeLimitMs = numberArg(value, arg);
    else if (arg === "--max-depth") options.maxDepth = integerArg(value, arg, 1);
    else if (arg === "--mcts-iterations") options.mctsIterations = integerArg(value, arg, 1);
    else if (arg === "--mcts-playout-turns") options.mctsPlayoutTurns = integerArg(value, arg, 1);
    else if (arg === "--mcts-exploration") options.mctsExploration = numberArg(value, arg);
    else if (arg === "--mcts-policy") options.mctsPolicy = value;
    else if (arg === "--mcts-root") options.mctsRoot = value;
    else if (arg === "--mcts-reward") options.mctsReward = value;
    else if (arg === "--mcts-prior") options.mctsPrior = value;
    else if (arg === "--mcts-prior-weight") options.mctsPriorWeight = numberArg(value, arg);
    else if (arg === "--mcts-candidate-limit") options.mctsCandidateLimit = integerArg(value, arg, 0);
    else if (arg === "--mcts-candidate-source") options.mctsCandidateSource = value;
    else if (arg === "--mcts-candidate-depth") options.mctsCandidateDepth = integerArg(value, arg, 1);
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  for (const level of [options.first, options.second]) {
    if (!["easy", "normal", "hard", "expert"].includes(level)) {
      throw new Error(`Invalid level: ${level}`);
    }
  }
  for (const profile of [options.firstProfile, options.secondProfile]) {
    if (!["legacy", ...WeightConfig.PROFILES].includes(profile)) throw new Error(`Invalid profile: ${profile}`);
  }
  for (const profile of [options.firstSearch, options.secondSearch]) {
    if (!["phase2", "legacy", "mcts"].includes(profile)) throw new Error(`Invalid search: ${profile}`);
  }
  if (!["any", "namua", "mtaji"].includes(options.openingPhase)) {
    throw new Error(`Invalid opening phase: ${options.openingPhase}`);
  }
  if (!["random", "capture", "balanced", "evaluation"].includes(options.mctsPolicy)) {
    throw new Error(`Invalid MCTS policy: ${options.mctsPolicy}`);
  }
  if (!["visits", "value"].includes(options.mctsRoot)) {
    throw new Error(`Invalid MCTS root selection: ${options.mctsRoot}`);
  }
  if (!["evaluation", "terminal", "fast-terminal"].includes(options.mctsReward)) {
    throw new Error(`Invalid MCTS reward: ${options.mctsReward}`);
  }
  if (!["none", "static"].includes(options.mctsPrior)) {
    throw new Error(`Invalid MCTS prior: ${options.mctsPrior}`);
  }
  if (!["all", "static", "phase2"].includes(options.mctsCandidateSource)) {
    throw new Error(`Invalid MCTS candidate source: ${options.mctsCandidateSource}`);
  }
  return options;
}

function createOpening(random, openingPlies, openingPhase = "any") {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    let state = E.initialState();
    let extra = openingPhase === "mtaji" ? null : openingPlies;
    for (let ply = 0; ply < 300 && state.winner === null; ply += 1) {
      if (openingPhase === "mtaji" && state.phase === "mtaji" && extra === null) {
        extra = openingPlies;
      }
      if (extra !== null && extra === 0) {
        if (openingPhase === "any" || state.phase === openingPhase) return state;
        break;
      }
      const moves = E.moveVariants(state);
      const move = moves[Math.floor(random() * moves.length)];
      state = E.applyMove(state, move).state;
      if (extra !== null) extra -= 1;
    }
  }
  throw new Error(`Unable to create a ${openingPhase} opening`);
}

function newSummary(level, profile, search, weights, adjustments) {
  return {
    level, profile, search, weights, adjustments, wins: 0, losses: 0, draws: 0, moves: 0,
    elapsedMs: 0, maxElapsedMs: 0, nodes: 0, quiescenceNodes: 0,
    cacheHits: 0, cacheStores: 0, totalDepth: 0, maxDepth: 0, timeouts: 0,
    historyUpdates: 0,
    aspirationResearches: 0,
    evaluationRequests: 0, evaluations: 0, evaluationCacheHits: 0, evaluationCacheStores: 0,
    earlyStops: 0, allocatedTimeMs: 0, maxAllocatedTimeMs: 0,
    baseTimeLimitMs: 0, adaptiveComplexity: 0,
    simulations: 0, playoutTurns: 0, maxPlayoutTurns: 0,
    asSouth: { games: 0, wins: 0 },
    asNorth: { games: 0, wins: 0 },
  };
}

function recordMove(summary, stats) {
  summary.moves += 1;
  summary.elapsedMs += stats.elapsedMs;
  summary.maxElapsedMs = Math.max(summary.maxElapsedMs, stats.elapsedMs);
  summary.nodes += stats.nodes;
  summary.quiescenceNodes += stats.quiescenceNodes;
  summary.cacheHits += stats.cacheHits;
  summary.cacheStores += stats.cacheStores;
  summary.historyUpdates += stats.historyUpdates || 0;
  summary.aspirationResearches += stats.aspirationResearches || 0;
  summary.evaluationRequests += stats.evaluationRequests || 0;
  summary.evaluations += stats.evaluations || 0;
  summary.evaluationCacheHits += stats.evaluationCacheHits || 0;
  summary.evaluationCacheStores += stats.evaluationCacheStores || 0;
  summary.totalDepth += stats.completedDepth;
  summary.maxDepth = Math.max(summary.maxDepth, stats.completedDepth);
  summary.simulations += stats.simulations || 0;
  summary.playoutTurns += stats.playoutTurns || 0;
  summary.maxPlayoutTurns = Math.max(summary.maxPlayoutTurns, stats.maxPlayoutTurns || 0);
  if (stats.timedOut) summary.timeouts += 1;
  if (stats.earlyStopped) summary.earlyStops += 1;
  summary.allocatedTimeMs += stats.allocatedTimeMs || 0;
  summary.maxAllocatedTimeMs = Math.max(summary.maxAllocatedTimeMs, stats.allocatedTimeMs || 0);
  summary.baseTimeLimitMs += stats.baseTimeLimitMs || 0;
  summary.adaptiveComplexity += stats.adaptiveComplexity || 0;
}

function runBenchmark(options) {
  const random = seededRandom(options.seed);
  const competitors = [
    newSummary(
      options.first, options.firstProfile, options.firstSearch,
      options.firstWeights, options.firstAdjustments,
    ),
    newSummary(
      options.second, options.secondProfile, options.secondSearch,
      options.secondWeights, options.secondAdjustments,
    ),
  ];
  const results = { southWins: 0, northWins: 0, draws: 0, totalTurns: 0 };
  const searchOptions = {
    timeLimitMs: options.timeLimitMs === 0 ? Infinity : options.timeLimitMs,
    maxDepth: options.maxDepth,
    mctsIterations: options.mctsIterations,
    mctsPlayoutTurns: options.mctsPlayoutTurns,
    mctsExploration: options.mctsExploration,
    mctsPolicy: options.mctsPolicy,
    mctsRoot: options.mctsRoot,
    mctsReward: options.mctsReward,
    mctsPrior: options.mctsPrior,
    mctsPriorWeight: options.mctsPriorWeight,
    mctsCandidateLimit: options.mctsCandidateLimit,
    mctsCandidateSource: options.mctsCandidateSource,
    mctsCandidateDepth: options.mctsCandidateDepth,
  };
  const adaptiveFlags = [options.firstAdaptive, options.secondAdaptive];
  const ttMoveFirstFlags = [options.firstTtMoveFirst, options.secondTtMoveFirst];
  const qCaptureOrderingFlags = [options.firstQCaptureOrdering, options.secondQCaptureOrdering];
  const historyHeuristicFlags = [options.firstHistoryHeuristic, options.secondHistoryHeuristic];
  const aspirationWindows = [options.firstAspirationWindow, options.secondAspirationWindow];
  const evaluationCacheFlags = [options.firstEvaluationCache, options.secondEvaluationCache];
  let pairedOpening = null;

  for (let game = 0; game < options.games; game += 1) {
    if (game % 2 === 0 || !pairedOpening) {
      pairedOpening = createOpening(random, options.openingPlies, options.openingPhase || "any");
    }
    let state = E.clone(pairedOpening);
    const south = game % 2;
    const seats = [south, 1 - south];
    competitors[seats[0]].asSouth.games += 1;
    competitors[seats[1]].asNorth.games += 1;
    let played = 0;
    while (state.winner === null && played < options.maxTurns) {
      const competitor = seats[state.player];
      const activeSearchOptions = adaptiveFlags[competitor]
        ? AIConfig.adaptiveSearchOptions(competitors[competitor].level, searchOptions, state)
        : searchOptions;
      const analysis = AI.analyzeMove(state, competitors[competitor].level, random, {
        ...activeSearchOptions,
        evaluationProfile: competitors[competitor].profile,
        searchProfile: competitors[competitor].search,
        ttMoveFirst: ttMoveFirstFlags[competitor],
        orderQuiescenceCaptures: qCaptureOrderingFlags[competitor],
        historyHeuristic: historyHeuristicFlags[competitor],
        aspirationWindow: aspirationWindows[competitor],
        evaluationCache: evaluationCacheFlags[competitor],
        evaluationWeights: competitors[competitor].weights,
        evaluationAdjustments: competitors[competitor].adjustments,
      });
      if (!analysis.move) break;
      recordMove(competitors[competitor], analysis.stats);
      state = E.applyMove(state, analysis.move).state;
      played += 1;
    }
    results.totalTurns += played;
    if (state.winner === null) {
      results.draws += 1;
      competitors.forEach((item) => { item.draws += 1; });
    } else {
      if (state.winner === 0) results.southWins += 1;
      else results.northWins += 1;
      const winner = seats[state.winner];
      const loser = 1 - winner;
      competitors[winner].wins += 1;
      competitors[loser].losses += 1;
      const seat = state.winner === 0 ? "asSouth" : "asNorth";
      competitors[winner][seat].wins += 1;
    }
  }

  return {
    config: { ...options },
    games: options.games,
    southWins: results.southWins,
    northWins: results.northWins,
    draws: results.draws,
    averageTurns: results.totalTurns / options.games,
    competitors: competitors.map((item, id) => ({
      id: id === 0 ? "first" : "second",
      level: item.level,
      profile: item.profile,
      search: item.search,
      wins: item.wins,
      losses: item.losses,
      draws: item.draws,
      winRate: item.wins / options.games,
      southWinRate: item.asSouth.games ? item.asSouth.wins / item.asSouth.games : 0,
      northWinRate: item.asNorth.games ? item.asNorth.wins / item.asNorth.games : 0,
      moves: item.moves,
      averageMoveMs: item.moves ? item.elapsedMs / item.moves : 0,
      maxMoveMs: item.maxElapsedMs,
      totalNodes: item.nodes,
      averageNodes: item.moves ? item.nodes / item.moves : 0,
      averageQuiescenceNodes: item.moves ? item.quiescenceNodes / item.moves : 0,
      cacheHits: item.cacheHits,
      cacheStores: item.cacheStores,
      historyUpdates: item.historyUpdates,
      aspirationResearches: item.aspirationResearches,
      evaluationRequests: item.evaluationRequests,
      evaluations: item.evaluations,
      evaluationCacheHits: item.evaluationCacheHits,
      evaluationCacheStores: item.evaluationCacheStores,
      cacheHitRate: item.cacheHits + item.cacheStores
        ? item.cacheHits / (item.cacheHits + item.cacheStores) : 0,
      averageDepth: item.moves ? item.totalDepth / item.moves : 0,
      maxDepth: item.maxDepth,
      totalSimulations: item.simulations,
      averageSimulations: item.moves ? item.simulations / item.moves : 0,
      averagePlayoutTurns: item.simulations ? item.playoutTurns / item.simulations : 0,
      maxPlayoutTurns: item.maxPlayoutTurns,
      timeouts: item.timeouts,
      earlyStops: item.earlyStops,
      averageAllocatedMs: item.moves ? item.allocatedTimeMs / item.moves : 0,
      maxAllocatedMs: item.maxAllocatedTimeMs,
      averageBaseTimeLimitMs: item.moves ? item.baseTimeLimitMs / item.moves : 0,
      averageAdaptiveComplexity: item.moves ? item.adaptiveComplexity / item.moves : 0,
    })),
  };
}

function percent(value) { return `${(value * 100).toFixed(1)}%`; }

function printReport(report) {
  console.log(`Bao AI benchmark: ${report.games} games, seed ${report.config.seed}`);
  console.log(`South ${report.southWins} / North ${report.northWins} / Draw ${report.draws}`);
  console.log(`Average turns: ${report.averageTurns.toFixed(1)}`);
  for (const item of report.competitors) {
    console.log(`${item.id} (${item.level}/${item.profile}/${item.search}): ${item.wins}-${item.losses}-${item.draws}, win ${percent(item.winRate)}`);
    console.log(`  South ${percent(item.southWinRate)}, North ${percent(item.northWinRate)}`);
    console.log(`  move ${item.averageMoveMs.toFixed(2)}ms avg / ${item.maxMoveMs.toFixed(2)}ms max, nodes ${item.averageNodes.toFixed(0)} avg, depth ${item.averageDepth.toFixed(2)} avg / ${item.maxDepth} max, timeouts ${item.timeouts}`);
    if (item.averageAllocatedMs) {
      console.log(`  budget ${item.averageAllocatedMs.toFixed(1)}ms avg / ${item.maxAllocatedMs.toFixed(1)}ms max, early stops ${item.earlyStops}, complexity ${item.averageAdaptiveComplexity.toFixed(2)}`);
    }
    console.log(`  qnodes ${item.averageQuiescenceNodes.toFixed(0)} avg, cache ${item.cacheHits}/${item.cacheStores} (${percent(item.cacheHitRate)})`);
    if (item.totalSimulations) {
      console.log(`  mcts ${item.averageSimulations.toFixed(0)} sims/move, playout ${item.averagePlayoutTurns.toFixed(1)} turns avg / ${item.maxPlayoutTurns} max`);
    }
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = runBenchmark(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printReport(report);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { seededRandom, parseArgs, createOpening, runBenchmark };
