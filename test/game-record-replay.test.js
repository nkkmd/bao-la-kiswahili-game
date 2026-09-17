"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const GameRecord = require("../public/game-record.js");
const Replay = require("../public/game-record-replay.js");

function completedRecord() {
  let state = E.initialState();
  const record = GameRecord.createRecord(state, {
    mode: "computer",
    humanSide: "south",
    ai: { difficulty: "normal", generation: "AI-GEN4", releaseId: "AI-GEN4-RELEASE-001" },
  });

  for (let ply = 0; state.winner === null && ply < 384; ply += 1) {
    const move = E.moveVariants(state)[0];
    assert.ok(move, `expected a legal move at ply ${ply + 1}`);
    GameRecord.appendMove(record, state, move);
    state = E.applyMove(state, move).state;
  }

  assert.notEqual(state.winner, null, "fixture should reach a real terminal position");
  GameRecord.finalize(record, state);
  return { record, state };
}

test("replay session validates and snapshots every ply", () => {
  const { record, state } = completedRecord();
  const session = Replay.buildSession(record, E);

  assert.equal(session.index, 0);
  assert.equal(session.states.length, record.moves.length + 1);
  assert.equal(session.transitions.length, record.moves.length);
  assert.equal(Replay.samePosition(session.states.at(-1), state), true);

  const first = Replay.transitionAt(session);
  assert.equal(first.entry.ply, 1);
  assert.deepEqual(Object.keys(first), ["entry"]);
  assert.equal(Replay.seek(session, 1).turn, session.states[1].turn);
  assert.equal(session.index, 1);
});

test("replay rejects move metadata that does not match the reconstructed state", () => {
  const { record } = completedRecord();
  record.moves[2].player = 1 - record.moves[2].player;
  assert.throws(() => Replay.buildSession(record, E), /metadata mismatch/);
});

test("replay rejects damaged final positions and result metadata", () => {
  const { record } = completedRecord();
  record.finalPosition.turn += 1;
  assert.throws(() => Replay.buildSession(record, E), /final position mismatch/);

  const second = completedRecord().record;
  second.result.plies -= 1;
  assert.throws(() => Replay.buildSession(second, E), /result mismatch/);
});

test("replay rejects unknown fields, unsupported rule baselines, and non-standard starting positions", () => {
  const unknown = completedRecord().record;
  unknown.trackingId = "not-allowed";
  assert.throws(() => Replay.buildSession(unknown, E), /Unknown Bao game record top-level field/);


  const { record } = completedRecord();
  record.rules.baseline = "R-999";
  assert.throws(() => Replay.buildSession(record, E), /Unsupported Bao game record rules/);

  const second = completedRecord().record;
  second.initialPosition.turn = 2;
  assert.throws(() => Replay.buildSession(second, E), /initial position mismatch/);
});

test("parseText rejects malformed and oversized input", () => {
  assert.throws(() => Replay.parseText("{", E), /JSON is invalid/);
  assert.throws(() => Replay.parseText("", E), /file is empty/);
  assert.throws(() => Replay.parseText(" ".repeat(Replay.MAX_FILE_BYTES + 1), E), /file is too large/);
});

test("descriptor exposes only replay display metadata", () => {
  const { record } = completedRecord();
  assert.deepEqual(Replay.descriptor(record), {
    mode: "computer",
    generation: "AI-GEN4",
    difficulty: "normal",
    releaseId: "AI-GEN4-RELEASE-001",
    adoptionId: "",
  });

  record.settings = { mode: "local" };
  assert.deepEqual(Replay.descriptor(record), { mode: "local" });
});
