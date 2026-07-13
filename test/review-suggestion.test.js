"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Review = require("../public/review-suggestion.js");

assert.equal(Review.eligible("hard"), true, "hard enables review suggestions");
assert.equal(Review.eligible("expert"), true, "expert enables review suggestions");
assert.equal(Review.eligible("normal"), false, "normal does not enable review suggestions");
assert.equal(Review.median([2, 4, 3]), 3, "median handles odd history");
assert.equal(Review.median([2, 4]), 3, "median handles even history");

{
  const state = E.initialState();
  const move = E.legalMoves(state)[0];
  const analysis = Review.analyze(E, state, {
    ai: {
      level: "hard",
      move,
      stats: { completedDepth: 2, elapsedMs: 700, nodes: 1200, timedOut: true },
    },
  }, [4, 4, 5]);

  assert.equal(analysis.enabled, true);
  assert.equal(analysis.recommendation, "save", "timeout and shallow depth recommend saving");
  assert.ok(analysis.score >= 2);
  assert.ok(analysis.signals.some((signal) => signal.type === "timeout"));
  assert.ok(analysis.signals.some((signal) => signal.type === "shallow-depth"));
  assert.ok(analysis.signals.some((signal) => signal.type === "depth-below-recent-median"));
}

{
  const state = E.initialState();
  const move = E.legalMoves(state)[0];
  const analysis = Review.analyze(E, state, {
    ai: {
      level: "normal",
      move,
      stats: { completedDepth: 1, elapsedMs: 10, nodes: 1, timedOut: true },
    },
  });

  assert.equal(analysis.enabled, false);
  assert.equal(analysis.recommendation, "none", "normal never displays a review suggestion");
  assert.deepEqual(analysis.signals, []);
}

console.log("review-suggestion.test.js: ok");
