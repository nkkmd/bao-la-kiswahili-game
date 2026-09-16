import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest, replayAndVerify, validateRecord } from "../cloudflare/game-record-ingest/src/index.mjs";

const E = globalThis.BaoEngine;

function oneMoveWinRecord() {
  const empty = () => [Array(8).fill(0), Array(8).fill(0)];
  const pits = [empty(), empty()];
  pits[0][0][0] = 1;
  pits[0][1][0] = 20;
  pits[1][0][7] = 1;
  pits[1][1][0] = 20;
  const initialPosition = {
    pits,
    reserve: [11, 11],
    houseOwned: [false, false],
    player: 0,
    phase: "namua",
    winner: null,
    reason: "",
    turn: 1,
    pending: [0, 0],
  };
  const move = { type: "capture", phase: "namua", row: 0, index: 0, direction: "right", side: "left" };
  const finalPosition = E.applyMoveForSearch(initialPosition, move).state;
  return {
    format: "bao-game-record",
    version: 1,
    rules: { guide: "bao-la-kiswahili-ja", guideVersion: "v0.1.0-draft", baseline: "R-002" },
    settings: {
      mode: "computer",
      humanSide: "south",
      ai: { difficulty: "normal", generation: "AI-GEN4", releaseId: "AI-GEN4-RELEASE-001" },
    },
    initialPosition,
    moves: [{ ply: 1, turn: 1, player: 0, side: "south", phase: "namua", move }],
    result: {
      winner: finalPosition.winner,
      winnerSide: finalPosition.winner === 0 ? "south" : "north",
      reason: finalPosition.reason || "",
      plies: 1,
    },
    finalPosition,
  };
}

function mockEnv() {
  const objects = new Map();
  return {
    ALLOWED_ORIGINS: "https://example.test",
    TURNSTILE_HOSTNAMES: "example.test",
    TURNSTILE_SECRET_KEY: "test-secret",
    MAX_REQUEST_BYTES: "65536",
    MAX_RECORD_BYTES: "49152",
    MAX_PLIES: "384",
    PER_CLIENT_RATE_LIMITER: { async limit() { return { success: true }; } },
    GLOBAL_ACCEPT_RATE_LIMITER: { async limit() { return { success: true }; } },
    GAME_RECORDS: {
      async head(key) { return objects.has(key) ? { key } : null; },
      async put(key, value, options) { objects.set(key, { value, options }); },
      objects,
    },
  };
}

function requestFor(record) {
  return new Request("https://collector.example/v1/game-records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://example.test",
      "CF-Connecting-IP": "192.0.2.1",
    },
    body: JSON.stringify({
      record,
      turnstileToken: "test-turnstile-token",
      consent: { version: 1, purpose: "ai-improvement" },
    }),
  });
}

test("worker accepts a structurally valid replayable computer game", async () => {
  const record = oneMoveWinRecord();
  assert.doesNotThrow(() => validateRecord(record));
  assert.doesNotThrow(() => replayAndVerify(record));

  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    success: true,
    action: "game_record_contribution",
    hostname: "example.test",
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    const env = mockEnv();
    const response = await handleRequest(requestFor(record), env);
    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.ok, true);
    assert.equal(payload.duplicate, false);
    assert.equal(env.GAME_RECORDS.objects.size, 1);
    const [{ value, options }] = [...env.GAME_RECORDS.objects.values()];
    assert.deepEqual(JSON.parse(value), record);
    assert.equal(options.customMetadata.validation, "schema+replay+turnstile");
    assert.equal(value.includes("test-turnstile-token"), false);
    assert.equal(value.includes("192.0.2.1"), false);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("worker rejects local two-player records", () => {
  const record = oneMoveWinRecord();
  record.settings = { mode: "local" };
  assert.throws(() => validateRecord(record), /computer games/);
});

test("worker rejects unexpected fields that could smuggle arbitrary text", () => {
  const record = oneMoveWinRecord();
  record.comment = "free form";
  assert.throws(() => validateRecord(record), /Unexpected field/);
});

test("worker replay rejects a tampered final position", () => {
  const record = oneMoveWinRecord();
  record.finalPosition.reserve[0] -= 1;
  record.finalPosition.pending[0] += 1;
  assert.doesNotThrow(() => validateRecord(record));
  assert.throws(() => replayAndVerify(record), /Final position mismatch/);
});

test("worker rejects disallowed origins before storage", async () => {
  const record = oneMoveWinRecord();
  const request = new Request("https://collector.example/v1/game-records", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Origin": "https://attacker.example" },
    body: JSON.stringify({ record, turnstileToken: "test-turnstile-token", consent: { version: 1, purpose: "ai-improvement" } }),
  });
  const response = await handleRequest(request, mockEnv());
  assert.equal(response.status, 403);
});
