import test from "node:test";
import assert from "node:assert/strict";
import {
  handleRequest,
  replayAndVerify,
  reserveDailyAcceptanceSlot,
  validateRecord,
} from "../cloudflare/game-record-ingest/src/index.mjs";

const E = globalThis.BaoEngine;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function completeStandardRecord() {
  let state = E.initialState();
  const initialPosition = clone(state);
  const moves = [];

  while (state.winner === null && moves.length < 384) {
    const variants = E.moveVariantsForSearch(state);
    assert.ok(Array.isArray(variants) && variants.length > 0, "expected a legal move variant");
    const move = clone(variants[0]);
    moves.push({
      ply: moves.length + 1,
      turn: state.turn,
      player: state.player,
      side: state.player === 0 ? "south" : "north",
      phase: state.phase,
      move,
    });
    state = E.applyMoveForSearch(state, move).state;
  }

  assert.notEqual(state.winner, null, "deterministic test game must finish within contribution limit");
  const finalPosition = clone(state);
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
    moves,
    result: {
      winner: finalPosition.winner,
      winnerSide: finalPosition.winner === 0 ? "south" : "north",
      reason: finalPosition.reason || "",
      plies: moves.length,
    },
    finalPosition,
  };
}

function mockEnv() {
  const objects = new Map();
  let etagSequence = 0;
  const objectView = (key, entry, withBody) => {
    if (!entry) return null;
    const view = { key, etag: entry.etag, customMetadata: entry.options?.customMetadata || {} };
    if (withBody) view.text = async () => entry.value;
    return view;
  };
  return {
    COLLECTION_ENABLED: "true",
    ALLOWED_ORIGINS: "https://example.test",
    TURNSTILE_HOSTNAMES: "example.test",
    TURNSTILE_SECRET_KEY: "test-secret",
    MAX_REQUEST_BYTES: "65536",
    MAX_RECORD_BYTES: "49152",
    MAX_PLIES: "384",
    MAX_ACCEPTED_PER_UTC_DAY: "500",
    PER_CLIENT_RATE_LIMITER: { async limit() { return { success: true }; } },
    LOCATION_ACCEPT_RATE_LIMITER: { async limit() { return { success: true }; } },
    GAME_RECORDS: {
      async head(key) { return objectView(key, objects.get(key), false); },
      async get(key) { return objectView(key, objects.get(key), true); },
      async put(key, value, options = {}) {
        const current = objects.get(key);
        if (options.onlyIf instanceof Headers) {
          if (options.onlyIf.get("If-None-Match") === "*" && current) return null;
        } else if (options.onlyIf?.etagMatches) {
          if (!current || current.etag !== options.onlyIf.etagMatches) return null;
        }
        const entry = {
          value: String(value),
          options,
          etag: `etag-${++etagSequence}`,
        };
        objects.set(key, entry);
        return objectView(key, entry, false);
      },
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

async function withPassingTurnstile(callback) {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    success: true,
    action: "game_record_contribution",
    hostname: "example.test",
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    return await callback();
  } finally {
    globalThis.fetch = previousFetch;
  }
}

test("worker accepts a standard, structurally valid, replayable computer game", async () => {
  const record = completeStandardRecord();
  assert.doesNotThrow(() => validateRecord(record));
  assert.doesNotThrow(() => replayAndVerify(record));

  await withPassingTurnstile(async () => {
    const env = mockEnv();
    const response = await handleRequest(requestFor(record), env);
    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.ok, true);
    assert.equal(payload.duplicate, false);

    const storedRecords = [...env.GAME_RECORDS.objects.entries()]
      .filter(([key]) => key.startsWith("records/v1/"));
    assert.equal(storedRecords.length, 1);
    const [{ value, options }] = storedRecords.map(([, entry]) => entry);
    assert.deepEqual(JSON.parse(value), record);
    assert.equal(options.customMetadata.validation,
      "standard-initial+exact-moves+replay+turnstile");
    assert.equal(value.includes("test-turnstile-token"), false);
    assert.equal(value.includes("192.0.2.1"), false);
  });
});

test("worker rejects local two-player records", () => {
  const record = completeStandardRecord();
  record.settings.mode = "local";
  assert.throws(() => validateRecord(record), /computer games/);
});

test("worker rejects unexpected fields that could smuggle arbitrary text", () => {
  const record = completeStandardRecord();
  record.comment = "free form";
  assert.throws(() => validateRecord(record), /Unexpected field/);
});

test("worker rejects non-standard initial positions even when the record is otherwise shaped correctly", () => {
  const record = completeStandardRecord();
  record.initialPosition.pits[0][0][0] += 1;
  record.initialPosition.pits[0][0][4] -= 1;
  assert.doesNotThrow(() => validateRecord(record));
  assert.throws(() => replayAndVerify(record), /Non-standard initial position/);
});

test("worker rejects non-canonical move fields", () => {
  const record = completeStandardRecord();
  record.moves[0].move.houseChoice = "stop";
  assert.throws(() => validateRecord(record), /house choice/);
});

test("worker replay rejects a tampered final position", () => {
  const record = completeStandardRecord();
  record.finalPosition.reserve[0] -= 1;
  record.finalPosition.pending[0] += 1;
  assert.doesNotThrow(() => validateRecord(record));
  assert.throws(() => replayAndVerify(record), /Final position mismatch/);
});

test("worker rejects disallowed origins before storage", async () => {
  const record = completeStandardRecord();
  const request = new Request("https://collector.example/v1/game-records", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Origin": "https://attacker.example" },
    body: JSON.stringify({
      record,
      turnstileToken: "test-turnstile-token",
      consent: { version: 1, purpose: "ai-improvement" },
    }),
  });
  const response = await handleRequest(request, mockEnv());
  assert.equal(response.status, 403);
});

test("worker stays fail-closed until server-side collection is enabled", async () => {
  const env = mockEnv();
  env.COLLECTION_ENABLED = "false";
  const response = await handleRequest(requestFor(completeStandardRecord()), env);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "collection_disabled");
});

test("R2-backed daily quota provides a hard acceptance cap independent of edge rate-limit locality", async () => {
  const env = mockEnv();
  const first = await reserveDailyAcceptanceSlot(env.GAME_RECORDS, 1, new Date("2026-09-16T01:00:00Z"));
  const second = await reserveDailyAcceptanceSlot(env.GAME_RECORDS, 1, new Date("2026-09-16T23:59:00Z"));
  const nextDay = await reserveDailyAcceptanceSlot(env.GAME_RECORDS, 1, new Date("2026-09-17T00:00:00Z"));
  assert.deepEqual(first, { accepted: true, count: 1 });
  assert.deepEqual(second, { accepted: false, reason: "daily_limit" });
  assert.deepEqual(nextDay, { accepted: true, count: 1 });
});

test("duplicate submissions are detected before consuming another daily slot", async () => {
  await withPassingTurnstile(async () => {
    const env = mockEnv();
    env.MAX_ACCEPTED_PER_UTC_DAY = "1";
    const record = completeStandardRecord();
    const first = await handleRequest(requestFor(record), env);
    const duplicate = await handleRequest(requestFor(record), env);
    assert.equal(first.status, 201);
    assert.equal(duplicate.status, 200);
    assert.equal((await duplicate.json()).duplicate, true);

    const quotaEntries = [...env.GAME_RECORDS.objects.entries()]
      .filter(([key]) => key.startsWith("control/daily/"));
    assert.equal(quotaEntries.length, 1);
    assert.equal(JSON.parse(quotaEntries[0][1].value).accepted, 1);
  });
});

test("daily quota refuses a second distinct record after the configured cap", async () => {
  await withPassingTurnstile(async () => {
    const env = mockEnv();
    env.MAX_ACCEPTED_PER_UTC_DAY = "1";
    const firstRecord = completeStandardRecord();
    const secondRecord = clone(firstRecord);
    secondRecord.settings.ai.difficulty = "hard";

    const first = await handleRequest(requestFor(firstRecord), env);
    const second = await handleRequest(requestFor(secondRecord), env);
    assert.equal(first.status, 201);
    assert.equal(second.status, 429);
    assert.equal((await second.json()).error, "daily_collection_limit");
  });
});
