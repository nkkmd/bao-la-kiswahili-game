"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { runSearch } = require("../public/ai-worker.js");

{
  const state = E.initialState();
  const original = E.clone(state);
  const result = runSearch({
    type: "search",
    id: 17,
    state,
    level: "hard",
    options: { maxDepth: 1, timeLimitMs: Infinity },
  }, E, AI);
  assert.equal(result.type, "result");
  assert.equal(result.id, 17);
  assert.equal(result.positionKey, AI.stateKey(state));
  assert.ok(result.move, "worker returns a move");
  assert.doesNotThrow(() => E.applyMove(state, result.move), "worker move is legal");
  assert.ok(result.stats.nodes > 0, "worker returns search statistics");
  assert.deepEqual(state, original, "worker search does not mutate its input state");
}

assert.throws(() => runSearch({ type: "unknown" }, E, AI), /Invalid worker request/);

console.log("Bao AI worker tests passed");
