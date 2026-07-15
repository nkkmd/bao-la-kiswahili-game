"use strict";

const assert = require("node:assert/strict");
const AI = require("../public/ai.js");
const { reachableStates } = require("../tools/symmetry/generate-states.js");
const { mirrorState, stateFor } = require("../tools/symmetry/transform-candidates.js");
const { oneEntryCapture } = require("./fixtures/namua-symmetry-cases.js");

for (const state of reachableStates(1000, 20260714)) {
  const mirrored = mirrorState(state);
  assert.equal(AI.legacyEvaluate(state, state.player), AI.legacyEvaluate(mirrored, mirrored.player));
  for (const profile of ["bao", "bao-v2"]) {
    assert.deepEqual(
      AI.evaluationBreakdown(state, state.player, { evaluationProfile: profile }),
      AI.evaluationBreakdown(mirrored, mirrored.player, { evaluationProfile: profile }),
    );
  }
}

const counterexample = oneEntryCapture();
assert.notEqual(
  AI.evaluationBreakdown(counterexample, counterexample.player, { evaluationProfile: "bao" }).total,
  AI.evaluationBreakdown(stateFor("A", counterexample), 1 - counterexample.player, {
    evaluationProfile: "bao",
  }).total,
  "the former transform changes capture-dependent evaluation features",
);

console.log("Evaluation symmetry tests passed");
