"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");

function analyze(state, options = {}) {
  return AI.analyzeMove(state, "hard", () => 0.5, {
    timeLimitMs: Infinity,
    maxDepth: 3,
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    ...options,
  });
}

function comparable(result) {
  const stats = { ...result.stats };
  delete stats.elapsedMs;
  delete stats.pbaiC004TriggerCount;
  delete stats.pbaiC004RootTtFirstDepths;
  return {
    moveKey: AI.moveKey(result.move),
    stats,
  };
}

const initial = E.initialState();

// Frozen baseline smoke remains exact with the feature implicitly off.
const implicitOff = analyze(initial);
assert.equal(AI.moveKey(implicitOff.move), "takata:namua:0:5:right:::false");
assert.equal(implicitOff.stats.rootScore, 13);
assert.equal(implicitOff.stats.pbaiC004TriggerCount, 0);
assert.equal(implicitOff.stats.pbaiC004RootTtFirstDepths, 0);

// Explicit feature-off is exactly baseline-equivalent apart from wall-clock timing.
const explicitOff = analyze(initial, { pbaiC004D23RootTtFirst: false });
assert.deepEqual(comparable(explicitOff), comparable(implicitOff));
assert.equal(explicitOff.stats.pbaiC004TriggerCount, 0);

// Enabling the feature cannot affect D1..D3 because activation is only after D3 completes.
const enabledD3 = analyze(initial, { pbaiC004D23RootTtFirst: true });
assert.deepEqual(comparable(enabledD3), comparable(implicitOff));
assert.equal(enabledD3.stats.pbaiC004RootTtFirstDepths, 0);

// Ineligible search modes never expose the candidate trigger.
const normal = AI.analyzeMove(initial, "normal", () => 0.5, {
  pbaiC004D23RootTtFirst: true,
  evaluationProfile: "bao",
});
assert.equal(normal.stats.pbaiC004TriggerCount, 0);
assert.equal(normal.stats.pbaiC004RootTtFirstDepths, 0);

const legacy = AI.analyzeMove(initial, "hard", () => 0.5, {
  timeLimitMs: Infinity,
  maxDepth: 3,
  evaluationProfile: "bao",
  searchProfile: "legacy",
  pbaiC004D23RootTtFirst: true,
});
assert.equal(legacy.stats.pbaiC004TriggerCount, 0);
assert.equal(legacy.stats.pbaiC004RootTtFirstDepths, 0);

const mcts = AI.analyzeMove(initial, "hard", () => 0.5, {
  timeLimitMs: Infinity,
  evaluationProfile: "bao",
  searchProfile: "mcts",
  mctsIterations: 2,
  mctsPlayoutTurns: 2,
  pbaiC004D23RootTtFirst: true,
});
assert.equal(mcts.stats.pbaiC004TriggerCount, 0);
assert.equal(mcts.stats.pbaiC004RootTtFirstDepths, 0);

console.log("PBAI-C004-v1 isolated implementation checks: PASS");
