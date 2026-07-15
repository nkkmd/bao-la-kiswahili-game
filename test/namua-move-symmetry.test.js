"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { reachableStates } = require("../tools/symmetry/generate-states.js");
const { mirrorMove, mirrorState } = require("../tools/symmetry/transform-candidates.js");

for (const state of reachableStates(1000, 20260714)) {
  const expected = E.moveVariants(state).map(mirrorMove).map(AI.moveKey).sort();
  const actual = E.moveVariants(mirrorState(state)).map(AI.moveKey).sort();
  assert.deepEqual(actual, expected);
}

console.log("Namua move symmetry tests passed");
