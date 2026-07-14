#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { seededRandom, runBenchmark } = require("./benchmark.js");

function stableHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function playDeterministicGame({ depth, seed, maxTurns = 300 }) {
  const random = seededRandom(seed);
  let state = E.initialState();
  const transcript = [];

  for (let ply = 0; state.winner === null && ply < maxTurns; ply += 1) {
    const beforeHash = stableHash(state);
    const analysis = AI.analyzeMove(state, "hard", random, {
      timeLimitMs: Infinity,
      maxDepth: depth,
      evaluationProfile: "bao",
      searchProfile: "phase2",
    });
    if (!analysis.move) break;
    transcript.push({
      ply,
      player: state.player,
      phase: state.phase,
      beforeHash,
      move: analysis.move,
      completedDepth: analysis.stats.completedDepth,
      rootScore: analysis.stats.rootScore ?? null,
    });
    state = E.applyMove(state, analysis.move).state;
  }

  return {
    depth,
    seed,
    winner: state.winner,
    turns: transcript.length,
    terminalHash: stableHash(state),
    transcriptHash: stableHash(transcript.map((item) => ({
      player: item.player,
      phase: item.phase,
      beforeHash: item.beforeHash,
      move: item.move,
    }))),
    transcript,
  };
}

function benchmarkCondition({ seed, openingPlies, openingPhase, depth = 2, games = 100 }) {
  return runBenchmark({
    games,
    seed,
    first: "hard",
    second: "hard",
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
    firstEvaluationCacheEntries: 50_000,
    secondEvaluationCacheEntries: 50_000,
    firstNormalizeTtMateScores: false,
    secondNormalizeTtMateScores: false,
    maxTurns: 300,
    openingPlies,
    openingPhase,
    timeLimitMs: 0,
    maxDepth: depth,
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
    output: null,
    json: true,
  });
}

function main() {
  const output = process.argv[2] || "artifacts/first-player-study/diagnostics.json";
  const standard = [1, 2, 3, 4].map((depth) => playDeterministicGame({
    depth,
    seed: 20260714,
  }));
  const repeatedDepth2 = [20260714, 20260764, 20260814, 20260864].map((seed) => (
    playDeterministicGame({ depth: 2, seed })
  ));
  const conditions = [
    benchmarkCondition({ seed: 20261714, openingPlies: 8, openingPhase: "namua" }),
    benchmarkCondition({ seed: 20262714, openingPlies: 8, openingPhase: "mtaji" }),
  ];

  const result = {
    generatedAt: new Date().toISOString(),
    standard,
    repeatedDepth2: repeatedDepth2.map((game) => ({
      seed: game.seed,
      winner: game.winner,
      turns: game.turns,
      transcriptHash: game.transcriptHash,
      terminalHash: game.terminalHash,
    })),
    repeatedDepth2UniqueTranscriptHashes: [...new Set(repeatedDepth2.map((game) => game.transcriptHash))],
    randomOpeningConditions: conditions.map((report) => ({
      seed: report.config.seed,
      openingPlies: report.config.openingPlies,
      openingPhase: report.config.openingPhase,
      games: report.games,
      southWins: report.southWins,
      northWins: report.northWins,
      draws: report.draws,
      averageTurns: report.averageTurns,
    })),
  };

  fs.mkdirSync(require("node:path").dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = { stableHash, playDeterministicGame, benchmarkCondition };
