"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Diagnostics = require("../public/diagnostics.js");

function memoryStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
  };
}

const state = E.initialState();
const snapshot = Diagnostics.createSnapshot(state, {
  mode: "computer",
  ai: {
    level: "hard",
    profile: "bao",
    move: {
      type: "takata", phase: "namua", row: 0, index: 5, direction: "left",
      privateNote: "must not be copied",
    },
    stats: { nodes: 123, completedDepth: 4, timedOut: false, secret: "excluded" },
  },
  reason: "unexpected-ai-move",
  timestamp: "excluded",
  device: "excluded",
  playerName: "excluded",
});

assert.equal(snapshot.format, "bao-ai-diagnostic");
assert.equal(snapshot.version, 1);
assert.deepEqual(Diagnostics.stateFromSnapshot(snapshot), state,
  "diagnostic positions restore an engine-compatible state");
assert.equal(snapshot.ai.move.privateNote, undefined, "move serialization uses an allowlist");
assert.equal(snapshot.ai.stats.secret, undefined, "stat serialization uses an allowlist");
assert.equal(snapshot.timestamp, undefined, "snapshots do not include timestamps");
assert.equal(snapshot.device, undefined, "snapshots do not include device identifiers");
assert.equal(snapshot.playerName, undefined, "snapshots do not include player names");

const originalSeeds = snapshot.position.pits[0][0][4];
state.pits[0][0][4] += 10;
assert.equal(snapshot.position.pits[0][0][4], originalSeeds,
  "snapshots do not retain mutable state references");

const storage = memoryStorage();
Diagnostics.markSnapshot(storage, snapshot, 2);
Diagnostics.markSnapshot(storage, Diagnostics.createSnapshot(E.initialState()), 2);
Diagnostics.markSnapshot(storage, Diagnostics.createSnapshot(E.initialState()), 2);
assert.equal(Diagnostics.readMarked(storage).length, 2, "marked positions respect the local limit");
assert.doesNotThrow(() => JSON.parse(Diagnostics.stringify(snapshot)),
  "diagnostic exports are valid JSON");
Diagnostics.clearMarked(storage);
assert.deepEqual(Diagnostics.readMarked(storage), [], "marked positions can be cleared locally");

assert.throws(() => Diagnostics.stateFromSnapshot({ version: 999 }), /Unsupported/);
assert.throws(() => Diagnostics.createSnapshot({}), /Invalid Bao state/);

console.log("Bao diagnostics tests passed");
