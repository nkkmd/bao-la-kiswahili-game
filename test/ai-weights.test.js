"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const WeightConfig = require("../public/ai-weights.js");

{
  const copy = WeightConfig.cloneWeights();
  copy.namua.maxCapture += 4;
  assert.notEqual(copy.namua.maxCapture, WeightConfig.DEFAULT_WEIGHTS.namua.maxCapture,
    "candidate weights do not mutate the baseline");
  assert.doesNotThrow(() => WeightConfig.validateWeights(copy));
  copy.mtaji.mobility = NaN;
  assert.throws(() => WeightConfig.validateWeights(copy), /Invalid AI weight/);
  assert.equal(WeightConfig.weightsForProfile("bao"), WeightConfig.DEFAULT_WEIGHTS,
    "bao profile resolves to the default weights");
  assert.equal(WeightConfig.weightsForProfile("bao-v2"), WeightConfig.DEFAULT_WEIGHTS,
    "bao-v2 currently shares the comparable base weights");
  assert.throws(() => WeightConfig.weightsForProfile("unknown"), /Invalid AI weight profile/,
    "unknown AI weight profiles are rejected");
  const adjustments = WeightConfig.cloneAdjustments();
  adjustments["mtaji-endurance"].mobility += 1;
  assert.notEqual(
    adjustments["mtaji-endurance"].mobility,
    WeightConfig.DEFAULT_V2_ADJUSTMENTS["mtaji-endurance"].mobility,
    "candidate adjustments do not mutate the baseline",
  );
  assert.doesNotThrow(() => WeightConfig.validateAdjustments(adjustments));
  adjustments["mtaji-endurance"].unknown = 1;
  assert.throws(() => WeightConfig.validateAdjustments(adjustments), /Invalid AI adjustment/);
}

{
  const state = E.initialState();
  const weights = WeightConfig.cloneWeights();
  weights.namua.tempo += 10;
  assert.notEqual(
    AI.evaluateWithWeights(state, 0, weights),
    AI.evaluate(state, 0),
    "an injected candidate changes evaluation without replacing defaults",
  );
}

console.log("Bao AI weight tests passed");
