"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const { initialNyumba, oneEntryCapture } = require("./fixtures/namua-symmetry-cases.js");
const { mirrorMove, mirrorState, moveFor, stateFor } = require("../tools/symmetry/transform-candidates.js");

for (const state of [initialNyumba(), oneEntryCapture()]) {
  assert.deepEqual(mirrorState(mirrorState(state)), state);
  assert.equal(mirrorState(state).pits[1 - state.player][E.FRONT][E.HOUSE], 6);
  for (const move of E.moveVariants(state)) assert.deepEqual(mirrorMove(mirrorMove(move)), move);
}

const initial = initialNyumba();
assert.notDeepEqual(
  E.moveVariants(initial).map((move) => moveFor("A", move)),
  E.moveVariants(stateFor("A", initial)),
  "the former transform moves nyumba seeds away from HOUSE=4",
);

console.log("Symmetry transform tests passed");
