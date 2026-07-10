"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");

{
  const original = E.initialState();
  const key = AI.stateKey(original);
  for (const mutate of [
    (state) => { state.pits[0][0][0] += 1; },
    (state) => { state.player = 1; },
    (state) => { state.phase = "mtaji"; },
    (state) => { state.reserve[0] -= 1; },
    (state) => { state.houseOwned[0] = false; },
  ]) {
    const changed = E.clone(original);
    mutate(changed);
    assert.notEqual(AI.stateKey(changed), key, "position key includes every rule-relevant field");
  }
  const later = E.clone(original);
  later.turn += 10;
  assert.equal(AI.stateKey(later), key, "display-only turn count is excluded from the position key");
}

{
  const analysis = AI.analyzeMove(E.initialState(), "hard", () => 0, {
    maxDepth: 4,
    timeLimitMs: Infinity,
    quiescenceDepth: 0,
  });
  assert.equal(analysis.stats.completedDepth, 4, "Phase 2 search completes iterative deepening");
  assert.ok(analysis.stats.cacheStores > 0, "Phase 2 search stores transpositions");
  assert.ok(analysis.stats.cacheHits > 0, "Phase 2 search reuses transpositions");
  assert.ok(analysis.stats.cutoffs > 0, "Phase 2 search records alpha-beta cutoffs");
}

{
  const position = E.initialState();
  const baseline = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 4,
    timeLimitMs: Infinity,
    quiescenceDepth: 0,
  });
  const ttFirst = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 4,
    timeLimitMs: Infinity,
    quiescenceDepth: 0,
    ttMoveFirst: true,
  });
  assert.equal(AI.moveKey(ttFirst.move), AI.moveKey(baseline.move),
    "TT-first ordering preserves the fixed-depth root choice");
  assert.ok(ttFirst.stats.nodes <= baseline.stats.nodes,
    "TT-first ordering does not expand more nodes in the baseline position");
}

{
  const position = E.initialState();
  const baseline = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 4,
    timeLimitMs: Infinity,
    quiescenceDepth: 0,
  });
  const history = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 4,
    timeLimitMs: Infinity,
    quiescenceDepth: 0,
    historyHeuristic: true,
  });
  assert.equal(AI.moveKey(history.move), AI.moveKey(baseline.move),
    "history ordering preserves the fixed-depth root choice");
  assert.ok(history.stats.historyUpdates > 0, "history ordering records quiet cutoffs");
}

{
  const position = E.initialState();
  position.pits = [
    [[1, 1, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1, 2]],
    [[0, 0, 1, 0, 7, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 1]],
  ];
  position.reserve = [19, 20];
  position.houseOwned = [false, true];
  position.player = 1;
  const baseline = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 3,
    timeLimitMs: Infinity,
  });
  const orderedCaptures = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 3,
    timeLimitMs: Infinity,
    orderQuiescenceCaptures: true,
  });
  assert.equal(AI.moveKey(orderedCaptures.move), AI.moveKey(baseline.move),
    "quiescence capture ordering preserves the fixed-depth root choice");
}

{
  const forced = {
    pits: [
      [[0, 0, 0, 0, 0, 4, 5, 1], [0, 0, 0, 0, 0, 0, 1, 1]],
      [[0, 1, 0, 6, 9, 0, 1, 0], [0, 0, 0, 0, 0, 0, 1, 1]],
    ],
    reserve: [16, 17],
    houseOwned: [false, true],
    player: 1,
    phase: "namua",
    winner: null,
    reason: "",
    turn: 12,
    pending: [0, 0],
  };
  assert.equal(E.legalMoves(forced).length, 1, "test position has a stable forced root move");
  const analysis = AI.analyzeMove(forced, "hard", () => 0, {
    maxDepth: 6,
    timeLimitMs: Infinity,
    stableBestDepths: 1,
    stableBestMinDepth: 2,
    adaptive: { baseTimeLimitMs: 500, complexityScore: 0.25 },
  });
  assert.equal(analysis.stats.allocatedTimeMs, Infinity, "search stats record the allocated budget");
  assert.equal(analysis.stats.baseTimeLimitMs, 500, "search stats keep the unadjusted budget");
  assert.equal(analysis.stats.adaptiveComplexity, 0.25, "search stats include adaptive complexity");
  assert.equal(analysis.stats.earlyStopped, true, "stable root choices can stop iterative deepening early");
  assert.ok(analysis.stats.completedDepth < 6, "early stop avoids spending the full depth budget");
}

{
  const position = E.initialState();
  const analysis = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 8,
    timeLimitMs: 1,
  });
  assert.ok(analysis.move, "a timeout still returns the last safe move");
  assert.doesNotThrow(() => E.applyMove(position, analysis.move), "the timeout move remains legal");
  assert.equal(analysis.stats.timedOut, true, "timeouts are reported");
}

{
  const position = E.initialState();
  position.pits = [
    [[1, 1, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1, 2]],
    [[0, 0, 1, 0, 7, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 1]],
  ];
  position.reserve = [19, 20];
  position.houseOwned = [false, true];
  position.player = 1;
  const analysis = AI.analyzeMove(position, "hard", () => 0, {
    maxDepth: 1,
    timeLimitMs: Infinity,
  });
  assert.ok(analysis.stats.quiescenceNodes > 0, "capture positions extend into quiescence search");
}

console.log("Bao search tests passed");
