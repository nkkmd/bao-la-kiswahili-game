"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const { runGame, stableMove } = require("../tools/experiments/generate-phase-transition-fixture.js");

{
  const moves = E.moveVariants(E.initialState());
  const a = stableMove(moves);
  const b = stableMove([...moves].reverse());
  assert.deepEqual(a, b, "fixture move selection is independent of input order");
}

{
  const first = runGame("determinism", 16);
  const second = runGame("determinism", 16);
  assert.deepEqual(first, second, "fixture generation is deterministic");
  assert.equal(first.observations[0].previousStateHash, null);
  first.observations.slice(1).forEach((row, index) => {
    assert.equal(row.previousStateHash, first.observations[index].stateHash);
  });
  assert.equal(first.game.finalStateHash, first.observations.at(-1).stateHash);
}

console.log("phase-transition fixture tests passed");
