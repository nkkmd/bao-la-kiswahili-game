"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");

for (const level of ["easy", "normal", "hard"]) {
  const state = E.initialState();
  state.player = 1;
  const move = AI.chooseMove(state, level, () => 0);
  assert.ok(move, `${level} returns a move`);
  assert.doesNotThrow(() => E.applyMove(state, move), `${level} returns a legal move`);
}

{
  const analysis = AI.analyzeMove(E.initialState(), "hard", () => 0, {
    maxDepth: 2, timeLimitMs: Infinity,
  });
  assert.ok(analysis.move, "analysis returns a move");
  assert.equal(analysis.stats.completedDepth, 2, "analysis reports the completed depth");
  assert.equal(typeof analysis.stats.rootScore, "number", "analysis reports the completed root score");
  assert.ok(analysis.stats.nodes > 0, "analysis reports searched nodes");
  assert.ok(analysis.stats.elapsedMs >= 0, "analysis reports elapsed time");
  assert.doesNotThrow(() => AI.analyzeMove(E.initialState(), "hard", () => 0, {
    maxDepth: 1, timeLimitMs: Infinity, evaluationProfile: "legacy",
  }), "the Phase 0 evaluation remains available as a benchmark profile");
  assert.doesNotThrow(() => AI.analyzeMove(E.initialState(), "hard", () => 0, {
    maxDepth: 1, timeLimitMs: Infinity, evaluationProfile: "bao-v2",
  }), "the Bao v2 evaluation is available as an experimental profile");
  assert.throws(() => AI.analyzeMove(E.initialState(), "hard", () => 0, {
    maxDepth: 1, timeLimitMs: Infinity, evaluationProfile: "unknown",
  }), /Invalid AI weight profile/, "unknown Bao evaluation profiles are rejected");
}

{
  const first = AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: Infinity,
    mctsIterations: 12,
    mctsPlayoutTurns: 8,
    mctsPolicy: "capture",
  });
  const second = AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: Infinity,
    mctsIterations: 12,
    mctsPlayoutTurns: 8,
    mctsPolicy: "capture",
  });
  assert.ok(first.move, "MCTS profile returns a move");
  assert.doesNotThrow(() => E.applyMove(E.initialState(), first.move), "MCTS move is legal");
  assert.equal(first.stats.simulations, 12, "MCTS reports simulations");
  assert.ok(first.stats.playoutTurns > 0, "MCTS reports playout effort");
  assert.deepEqual(first.move, second.move, "MCTS experiments can be seeded through the random callback");
  assert.doesNotThrow(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: Infinity,
    mctsIterations: 4,
    mctsPlayoutTurns: 4,
    mctsPolicy: "random",
    mctsRoot: "value",
    mctsReward: "terminal",
  }), "MCTS supports random playout experiments");
  assert.doesNotThrow(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: Infinity,
    mctsIterations: 4,
    mctsPlayoutTurns: 4,
    mctsPolicy: "balanced",
    mctsPrior: "static",
    mctsCandidateLimit: 3,
  }), "MCTS supports balanced playout experiments");
  assert.doesNotThrow(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: Infinity,
    mctsIterations: 4,
    mctsPlayoutTurns: 4,
    mctsPolicy: "capture",
    mctsCandidateLimit: 3,
    mctsCandidateSource: "phase2",
    mctsCandidateDepth: 2,
  }), "MCTS can use a shallow Phase 2 search to limit root candidates");
  assert.throws(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    mctsPolicy: "unknown",
  }), /Invalid MCTS policy/, "unknown MCTS playout policies are rejected");
  assert.throws(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    mctsRoot: "unknown",
  }), /Invalid MCTS root selection/, "unknown MCTS root selectors are rejected");
  assert.throws(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    mctsReward: "unknown",
  }), /Invalid MCTS reward/, "unknown MCTS rewards are rejected");
  assert.throws(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    mctsPrior: "unknown",
  }), /Invalid MCTS prior/, "unknown MCTS priors are rejected");
  assert.throws(() => AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    mctsCandidateSource: "unknown",
  }), /Invalid MCTS candidate source/, "unknown MCTS candidate sources are rejected");
  const timed = AI.analyzeMove(E.initialState(), "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: 0,
    mctsIterations: 100,
  });
  assert.ok(timed.move, "MCTS timeout still returns a fallback move");
  assert.equal(timed.stats.timedOut, true, "MCTS reports timeouts");
  const win = E.initialState();
  win.phase = "mtaji";
  win.reserve = [0, 0];
  win.pits = [
    [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
    [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
  ];
  win.player = 1;
  const move = AI.analyzeMove(win, "hard", () => 0.25, {
    searchProfile: "mcts",
    timeLimitMs: Infinity,
    mctsIterations: 8,
    mctsPlayoutTurns: 4,
    mctsPolicy: "capture",
  }).move;
  assert.equal(E.applyMove(win, move).state.winner, 1,
    "MCTS capture policy can take a cheap immediate win");
}

{
  const state = E.initialState();
  state.phase = "mtaji";
  state.reserve = [0, 0];
  state.pits = [
    [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
    [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
  ];
  state.player = 1;
  const move = AI.chooseMove(state, "hard", () => 0);
  const result = E.applyMove(state, move).state;
  assert.equal(result.winner, 1, "hard AI takes an immediate win");
}

console.log("Bao AI tests passed");
