"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Diagnostics = require("../public/diagnostics.js");

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  setItem(key, value) {
    this.map.set(key, String(value));
  }

  removeItem(key) {
    this.map.delete(key);
  }
}

// Install the same hook used by the browser while keeping rendering inert in Node.
const originalDocument = globalThis.document;
const originalStorage = globalThis.localStorage;
const storage = new MemoryStorage();
globalThis.document = { querySelector() { return null; } };
globalThis.localStorage = storage;
const Review = require("../public/review-suggestion.js");

assert.equal(Review.eligible("hard"), true, "hard enables review suggestions");
assert.equal(Review.eligible("expert"), true, "expert enables review suggestions");
assert.equal(Review.eligible("normal"), false, "normal does not enable review suggestions");
assert.equal(Review.eligible("easy"), false, "easy does not enable review suggestions");
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
  let applyMoveCalls = 0;
  const instrumentedEngine = {
    ...E,
    applyMove(...args) {
      applyMoveCalls += 1;
      return E.applyMove(...args);
    },
  };
  const analysis = Review.analyze(instrumentedEngine, state, {
    ai: {
      level: "expert",
      move,
      stats: { completedDepth: 4, elapsedMs: 900, nodes: 2400, timedOut: false },
    },
  });

  assert.equal(analysis.enabled, true, "expert analysis is enabled");
  assert.ok(applyMoveCalls > 0, "post-move comparison uses engine.applyMove()");
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

{
  const state = E.initialState();
  const move = E.legalMoves(state)[0];
  const analysis = Review.analyze(E, state, {
    ai: {
      level: "easy",
      move,
      stats: { completedDepth: 1, elapsedMs: 10, nodes: 1, timedOut: true },
    },
  });

  assert.equal(analysis.enabled, false);
  assert.equal(analysis.recommendation, "none", "easy never displays a review suggestion");
  assert.deepEqual(analysis.signals, []);
}

{
  const state = E.initialState();
  const move = E.legalMoves(state)[0];
  const snapshot = Diagnostics.createSnapshot(state, {
    mode: "computer",
    ai: {
      level: "hard",
      profile: "bao",
      move,
      stats: { completedDepth: 2, elapsedMs: 700, nodes: 1200, timedOut: true },
    },
  });

  assert.equal(snapshot.format, "bao-ai-diagnostic");
  assert.equal(snapshot.version, 1);
  assert.equal(snapshot.mode, "computer");
  assert.equal(snapshot.ai.level, "hard");
  assert.equal(snapshot.ai.profile, "bao");
  assert.equal(snapshot.review.status, "unreviewed");
  assert.ok(["save", "none"].includes(snapshot.review.recommendation));
  assert.equal(typeof snapshot.review.score, "number");
  assert.ok(Array.isArray(snapshot.review.signals));
  assert.deepEqual(Diagnostics.stateFromSnapshot(snapshot), state,
    "review snapshots restore an engine-compatible state");

  const records = Diagnostics.markSnapshot(storage, snapshot);
  assert.equal(records.length, 1, "review snapshot is stored only when explicitly marked");
  assert.deepEqual(records[0], snapshot, "marking preserves review and existing fields");
  assert.equal(records[0].position.turn, snapshot.position.turn);
  assert.equal(records[0].ai.stats.timedOut, true);
}

if (originalDocument === undefined) delete globalThis.document;
else globalThis.document = originalDocument;
if (originalStorage === undefined) delete globalThis.localStorage;
else globalThis.localStorage = originalStorage;

console.log("review-suggestion.test.js: ok");
