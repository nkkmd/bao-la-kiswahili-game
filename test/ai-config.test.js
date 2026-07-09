"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Config = require("../public/ai-config.js");

assert.equal(Config.deviceTier({ hardwareConcurrency: 2, deviceMemory: 8 }), "low");
assert.equal(Config.deviceTier({ hardwareConcurrency: 4, deviceMemory: 4 }), "standard");
assert.equal(Config.deviceTier({ hardwareConcurrency: 8, deviceMemory: 8 }), "high");

{
  const low = Config.searchOptions("expert", { hardwareConcurrency: 2, deviceMemory: 2 });
  const high = Config.searchOptions("expert", { hardwareConcurrency: 8, deviceMemory: 8 });
  assert.ok(high.maxDepth > low.maxDepth, "faster devices receive a larger depth ceiling");
  assert.ok(high.timeLimitMs > low.timeLimitMs, "faster devices receive a larger time budget");
}

assert.deepEqual(Config.searchOptions("normal", { hardwareConcurrency: 8 }), {},
  "non-search difficulty does not receive a search budget");

{
  const state = E.initialState();
  const fixed = Config.baseSearchOptions("hard", { hardwareConcurrency: 4, deviceMemory: 4 });
  const expertFixed = Config.baseSearchOptions("expert", { hardwareConcurrency: 4, deviceMemory: 4 });
  const hard = Config.searchOptions("hard", { hardwareConcurrency: 4, deviceMemory: 4 }, state);
  const expert = Config.searchOptions("expert", { hardwareConcurrency: 4, deviceMemory: 4 }, state);
  const adaptive = Config.adaptiveSearchOptions("expert", expertFixed, state);
  assert.deepEqual(hard, fixed, "hard keeps the fixed UI budget by default");
  assert.deepEqual(expert, expertFixed, "expert keeps the fixed UI budget by default");
  assert.equal(adaptive.adaptive.enabled, true, "expert experiments can include position-aware budget data");
  assert.equal(adaptive.adaptive.baseTimeLimitMs, 2000,
    "adaptive config records the fixed budget it adjusted");
  assert.ok(adaptive.timeLimitMs > 0, "adaptive config keeps a positive time budget");
  assert.ok(adaptive.maxDepth >= 1, "adaptive config keeps a positive depth limit");
  assert.equal(adaptive.adaptive.metrics.legalMoves, E.legalMoves(state).length,
    "adaptive metrics describe the current position");
}

{
  const difficult = E.initialState();
  difficult.phase = "mtaji";
  difficult.reserve = [0, 0];
  difficult.pits = [
    [[1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2, 2, 2, 2, 2, 2]],
    [[8, 7, 6, 5, 4, 3, 2, 1], [2, 2, 2, 2, 2, 2, 2, 2]],
  ];
  const hard = Config.adaptiveSearchOptions("hard", { maxDepth: 8, timeLimitMs: 600 }, difficult);
  const expert = Config.adaptiveSearchOptions("expert", { maxDepth: 12, timeLimitMs: 3000 }, difficult);
  assert.ok(hard.timeLimitMs <= 600, "hard adaptive budgets never exceed the fixed UI budget");
  assert.equal(hard.maxDepth, 8, "hard adaptive budgets keep the fixed depth ceiling");
  assert.ok(expert.timeLimitMs <= 3000, "expert adaptive budgets stay within the long-think target");
}

console.log("Bao AI config tests passed");
