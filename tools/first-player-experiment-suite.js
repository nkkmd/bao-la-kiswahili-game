#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { seededRandom } = require("./benchmark.js");

function parseArgs(argv) {
  const options = {
    conditionName: "",
    games: 50,
    seed: 20260714,
    randomPlies: 8,
    maxDepth: 2,
    maxTurns: 300,
    openingPolicy: "uniform",
    evaluationProfile: "bao",
    searchProfile: "phase2",
    mctsIterations: 400,
    mctsPlayoutTurns: 80,
    output: "artifacts/first-player-suite/result.json",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--condition-name") options.conditionName = value;
    else if (key === "--games") options.games = Number(value);
    else if (key === "--seed") options.seed = Number(value);
    else if (key === "--random-plies") options.randomPlies = Number(value);
    else if (key === "--max-depth") options.maxDepth = Number(value);
    else if (key === "--max-turns") options.maxTurns = Number(value);
    else if (key === "--opening-policy") options.openingPolicy = value;
    else if (key === "--evaluation-profile") options.evaluationProfile = value;
    else if (key === "--search-profile") options.searchProfile = value;
    else if (key === "--mcts-iterations") options.mctsIterations = Number(value);
    else if (key === "--mcts-playout-turns") options.mctsPlayoutTurns = Number(value);
    else if (key === "--output") options.output = value;
    else continue;
    i += 1;
  }
  if (!Number.isInteger(options.games) || options.games < 1) throw new Error("games must be positive");
  if (!Number.isInteger(options.randomPlies) || options.randomPlies < 0) throw new Error("random-plies must be non-negative");
  if (!Number.isInteger(options.mctsIterations) || options.mctsIterations < 1) throw new Error("mcts-iterations must be positive");
  if (!Number.isInteger(options.mctsPlayoutTurns) || options.mctsPlayoutTurns < 1) throw new Error("mcts-playout-turns must be positive");
  if (!["uniform", "top3", "softmax"].includes(options.openingPolicy)) throw new Error("unsupported opening policy");
  return options;
}

function moveScore(state, move, profile) {
  const player = state.player;
  const next = E.applyMove(state, move).state;
  return AI.evaluationBreakdown(next, player, { evaluationProfile: profile }).total;
}

function chooseOpeningMove(state, random, policy, profile) {
  const moves = E.moveVariants(state);
  if (!moves.length) return null;
  if (policy === "uniform") return moves[Math.floor(random() * moves.length)];
  const ranked = moves.map((move) => ({ move, score: moveScore(state, move, profile) }))
    .sort((a, b) => b.score - a.score);
  if (policy === "top3") {
    const candidates = ranked.slice(0, Math.min(3, ranked.length));
    return candidates[Math.floor(random() * candidates.length)].move;
  }
  const max = ranked[0].score;
  const temperature = 80;
  const weights = ranked.map((item) => Math.exp(Math.max(-20, (item.score - max) / temperature)));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let target = random() * total;
  for (let i = 0; i < ranked.length; i += 1) {
    target -= weights[i];
    if (target <= 0) return ranked[i].move;
  }
  return ranked.at(-1).move;
}

function moveKey(move) {
  return AI.moveKey ? AI.moveKey(move) : JSON.stringify(move);
}

function playGame(random, options) {
  let state = E.initialState();
  let firstMove = null;
  let randomPlayed = 0;
  let aiPlayed = 0;
  while (state.winner === null && randomPlayed < options.randomPlies) {
    const move = chooseOpeningMove(state, random, options.openingPolicy, options.evaluationProfile);
    if (!move) break;
    if (!firstMove) firstMove = moveKey(move);
    state = E.applyMove(state, move).state;
    randomPlayed += 1;
  }
  while (state.winner === null && randomPlayed + aiPlayed < options.maxTurns) {
    const analysis = AI.analyzeMove(state, "hard", random, {
      timeLimitMs: Infinity,
      maxDepth: options.maxDepth,
      evaluationProfile: options.evaluationProfile,
      searchProfile: options.searchProfile,
      mctsIterations: options.mctsIterations,
      mctsPlayoutTurns: options.mctsPlayoutTurns,
      mctsExploration: Math.SQRT2,
      mctsPolicy: "evaluation",
      mctsRoot: "visits",
      mctsReward: "evaluation",
    });
    if (!analysis.move) break;
    if (!firstMove) firstMove = moveKey(analysis.move);
    state = E.applyMove(state, analysis.move).state;
    aiPlayed += 1;
  }
  return { winner: state.winner, turns: randomPlayed + aiPlayed, firstMove, reason: state.reason || "" };
}

function wilson(successes, total) {
  if (!total) return [0, 0];
  const z = 1.959963984540054;
  const p = successes / total;
  const denom = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denom;
  return [center - margin, center + margin];
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const random = seededRandom(options.seed);
  const totals = { games: options.games, southWins: 0, northWins: 0, draws: 0, totalTurns: 0 };
  const firstMoves = {};
  for (let game = 0; game < options.games; game += 1) {
    const result = playGame(random, options);
    totals.totalTurns += result.turns;
    if (result.winner === 0) totals.southWins += 1;
    else if (result.winner === 1) totals.northWins += 1;
    else totals.draws += 1;
    const key = result.firstMove || "none";
    firstMoves[key] ||= { games: 0, southWins: 0, northWins: 0, draws: 0 };
    firstMoves[key].games += 1;
    if (result.winner === 0) firstMoves[key].southWins += 1;
    else if (result.winner === 1) firstMoves[key].northWins += 1;
    else firstMoves[key].draws += 1;
  }
  const decisive = totals.southWins + totals.northWins;
  const report = {
    generatedAt: new Date().toISOString(),
    config: options,
    totals: {
      games: totals.games,
      southWins: totals.southWins,
      northWins: totals.northWins,
      draws: totals.draws,
      averageTurns: totals.totalTurns / totals.games,
      southWinRate: decisive ? totals.southWins / decisive : 0,
      southWinRateWilson95: wilson(totals.southWins, decisive),
    },
    firstMoves: Object.entries(firstMoves).map(([move, value]) => ({
      move,
      ...value,
      southWinRate: value.southWins + value.northWins ? value.southWins / (value.southWins + value.northWins) : 0,
    })).sort((a, b) => b.games - a.games),
  };
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.totals, null, 2));
}

if (require.main === module) main();
module.exports = { parseArgs, chooseOpeningMove, playGame, wilson };
