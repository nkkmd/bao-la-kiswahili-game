#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { seededRandom } = require("./benchmark.js");

function parseArgs(argv) {
  const options = {
    games: 50,
    seed: 20260714,
    randomPlies: 4,
    maxDepth: 2,
    maxTurns: 300,
    output: "artifacts/first-player-study/game-start.json",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--games") options.games = Number(value);
    else if (key === "--seed") options.seed = Number(value);
    else if (key === "--random-plies") options.randomPlies = Number(value);
    else if (key === "--max-depth") options.maxDepth = Number(value);
    else if (key === "--max-turns") options.maxTurns = Number(value);
    else if (key === "--output") options.output = value;
    else continue;
    i += 1;
  }
  if (!Number.isInteger(options.games) || options.games < 1) throw new Error("games must be a positive integer");
  if (!Number.isInteger(options.randomPlies) || options.randomPlies < 0) throw new Error("random-plies must be a non-negative integer");
  return options;
}

function playGame(random, options) {
  let state = E.initialState();
  let randomPlayed = 0;
  let aiPlayed = 0;

  while (state.winner === null && randomPlayed < options.randomPlies) {
    const moves = E.moveVariants(state);
    if (moves.length === 0) break;
    const move = moves[Math.floor(random() * moves.length)];
    state = E.applyMove(state, move).state;
    randomPlayed += 1;
  }

  const handoff = {
    player: state.player,
    phase: state.phase,
    turn: state.turn,
    randomPlayed,
  };

  while (state.winner === null && randomPlayed + aiPlayed < options.maxTurns) {
    const analysis = AI.analyzeMove(state, "hard", random, {
      timeLimitMs: Infinity,
      maxDepth: options.maxDepth,
      evaluationProfile: "bao",
      searchProfile: "phase2",
    });
    if (!analysis.move) break;
    state = E.applyMove(state, analysis.move).state;
    aiPlayed += 1;
  }

  return {
    winner: state.winner,
    totalTurns: randomPlayed + aiPlayed,
    randomPlayed,
    aiPlayed,
    handoff,
    reason: state.reason || "",
  };
}

function wilson(successes, total) {
  if (!total) return [0, 0];
  const z = 1.959963984540054;
  const p = successes / total;
  const denom = 1 + (z * z) / total;
  const center = (p + (z * z) / (2 * total)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * total)) / total) / denom;
  return [center - margin, center + margin];
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const random = seededRandom(options.seed);
  const games = [];
  let southWins = 0;
  let northWins = 0;
  let draws = 0;
  let totalTurns = 0;
  const handoffPlayers = [0, 0];
  const handoffPhases = {};

  for (let game = 0; game < options.games; game += 1) {
    const result = playGame(random, options);
    games.push({ game: game + 1, ...result });
    totalTurns += result.totalTurns;
    handoffPlayers[result.handoff.player] += 1;
    handoffPhases[result.handoff.phase] = (handoffPhases[result.handoff.phase] || 0) + 1;
    if (result.winner === 0) southWins += 1;
    else if (result.winner === 1) northWins += 1;
    else draws += 1;
  }

  const decisive = southWins + northWins;
  const report = {
    generatedAt: new Date().toISOString(),
    methodology: {
      games: options.games,
      seed: options.seed,
      randomPlies: options.randomPlies,
      firstPlayer: "South (player 0)",
      secondPlayer: "North (player 1)",
      randomOpeningPolicy: "uniform over legal move variants",
      continuationAI: "hard / bao / phase2",
      maxDepth: options.maxDepth,
      maxTurns: options.maxTurns,
    },
    totals: {
      games: options.games,
      southWins,
      northWins,
      draws,
      averageTurns: totalTurns / options.games,
      southWinRateAllGames: southWins / options.games,
      southWinRateDecisive: decisive ? southWins / decisive : 0,
      southWinRateWilson95: wilson(southWins, decisive),
      handoffPlayers: { south: handoffPlayers[0], north: handoffPlayers[1] },
      handoffPhases,
    },
    games,
  };

  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.totals, null, 2));
}

if (require.main === module) main();

module.exports = { parseArgs, playGame, wilson };
