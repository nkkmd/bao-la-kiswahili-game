"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const E = require("../public/engine.js");
const GameRecord = require("../public/game-record.js");

function stable(value) {
  return JSON.stringify(value);
}

test("game record keeps only confirmed moves and can replay them", () => {
  let state = E.initialState();
  const record = GameRecord.createRecord(state, {
    mode: "computer",
    humanSide: "south",
    ai: { difficulty: "normal", generation: "AI-GEN4", releaseId: "AI-GEN4-RELEASE-001" },
  });

  for (let ply = 0; ply < 12 && state.winner === null; ply += 1) {
    const move = E.moveVariants(state)[0];
    assert.ok(move, `expected a legal move at ply ${ply + 1}`);
    GameRecord.appendMove(record, state, move);
    state = E.applyMove(state, move).state;
  }

  const replayed = GameRecord.replay(record, E);
  assert.equal(stable(replayed), stable(state));
  assert.equal(record.moves.length > 0, true);
  assert.deepEqual(Object.keys(record.moves[0]).sort(), ["move", "phase", "player", "ply", "side", "turn"].sort());
  assert.equal("events" in record.moves[0], false);
  assert.equal("state" in record.moves[0], false);
});

test("completed records contain result and final position", () => {
  const initial = E.initialState();
  const record = GameRecord.createRecord(initial, { mode: "local" });
  const move = E.moveVariants(initial)[0];
  GameRecord.appendMove(record, initial, move);
  const finalState = E.applyMove(initial, move).state;
  finalState.winner = 0;
  finalState.reason = "front-empty";

  GameRecord.finalize(record, finalState);
  assert.equal(record.result.winner, 0);
  assert.equal(record.result.winnerSide, "south");
  assert.equal(record.result.reason, "front-empty");
  assert.equal(record.result.plies, 1);
  assert.equal(record.finalPosition.winner, 0);
  assert.doesNotThrow(() => GameRecord.stringify(record));
  assert.throws(() => GameRecord.appendMove(record, finalState, move), /cannot be changed/);
});

test("record schema carries rule compatibility metadata", () => {
  const record = GameRecord.createRecord(E.initialState(), { mode: "local" });
  assert.equal(record.format, "bao-game-record");
  assert.equal(record.version, 1);
  assert.equal(record.rules.guide, "bao-la-kiswahili-ja");
  assert.equal(record.rules.guideVersion, "v0.1.0-draft");
  assert.equal(record.rules.baseline, "R-002");
});

test("game-record implementation does not persist records to localStorage", () => {
  const source = fs.readFileSync("public/game-record.js", "utf8");
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /\.events\b/);
  assert.match(source, /Save game record/);
  assert.match(source, /棋譜を保存/);
});

test("game record filename is stable and JSON-specific", () => {
  const date = new Date(2026, 8, 15, 16, 8, 9);
  assert.equal(GameRecord.filename(date), "bao-game-record-20260915-160809.json");
});
