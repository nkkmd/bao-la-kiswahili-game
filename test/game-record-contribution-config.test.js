"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const clientConfigSource = fs.readFileSync("public/game-record-contribution-config.js", "utf8");
const workerSource = fs.readFileSync("cloudflare/game-record-ingest/src/index.mjs", "utf8");
const wrangler = JSON.parse(fs.readFileSync("cloudflare/game-record-ingest/wrangler.jsonc", "utf8"));

test("public contribution config is enabled only for the controlled test endpoint", () => {
  assert.match(clientConfigSource, /enabled:\s*true/);
  assert.match(clientConfigSource,
    /endpoint:\s*"https:\/\/bao-game-record-ingest\.oruorane\.workers\.dev\/v1\/game-records"/);
  assert.match(clientConfigSource, /turnstileSiteKey:\s*"0x4AAAAAAE4W_jsKIMA65M99"/);
  assert.match(clientConfigSource, /maxRecordBytes:\s*49152/);
});

test("Worker configuration uses private R2 binding and Free-plan-compatible application limits", () => {
  assert.equal(wrangler.r2_buckets.length, 1);
  assert.deepEqual(wrangler.r2_buckets[0], {
    binding: "GAME_RECORDS",
    bucket_name: "bao-game-record-contributions",
  });
  // Cloudflare Workers Free enforces its own 10 ms CPU ceiling and does not
  // allow an explicit cpu_ms limit in Wrangler. Keep the limits block absent
  // so deployment remains Free-plan compatible; application-specific limits
  // below still bound request size, game length, rate, and daily acceptance.
  assert.equal(Object.hasOwn(wrangler, "limits"), false);
  // Even while the test client is configured, repository-controlled Worker
  // deployment remains fail-closed. COLLECTION_ENABLED is changed only for a
  // deliberate test window in Cloudflare and returns to false afterward.
  assert.equal(wrangler.vars.COLLECTION_ENABLED, "false");
  assert.equal(wrangler.vars.MAX_REQUEST_BYTES, "65536");
  assert.equal(wrangler.vars.MAX_RECORD_BYTES, "49152");
  assert.equal(wrangler.vars.MAX_PLIES, "384");
  assert.equal(wrangler.vars.MAX_ACCEPTED_PER_UTC_DAY, "500");
  assert.equal(wrangler.ratelimits.length, 2);
  assert.deepEqual(wrangler.ratelimits.map((entry) => [entry.name, entry.simple.limit, entry.simple.period]), [
    ["PER_CLIENT_RATE_LIMITER", 3, 60],
    ["LOCATION_ACCEPT_RATE_LIMITER", 6, 60],
  ]);
});

test("Worker source contains no committed secret and never persists connection identifiers", () => {
  assert.doesNotMatch(workerSource, /TURNSTILE_SECRET_KEY\s*[:=]\s*["'][^"']+["']/);
  assert.match(workerSource, /env\.TURNSTILE_SECRET_KEY/);
  assert.match(workerSource, /CF-Connecting-IP/);
  assert.doesNotMatch(workerSource, /customMetadata[\s\S]{0,800}(?:ipAddress|clientIp|sourceIp|turnstileToken)/i);
  assert.match(workerSource, /const RECORD_PREFIX = "records\/v1\/"/);
  assert.match(workerSource, /const QUOTA_PREFIX = "control\/daily\/"/);
  assert.match(workerSource, /DEFAULT_MAX_ACCEPTED_PER_UTC_DAY = 500/);
  assert.match(workerSource, /HARD_MAX_ACCEPTED_PER_UTC_DAY = 1000/);
  assert.match(workerSource, /Non-standard initial position/);
  assert.match(workerSource, /Non-canonical or illegal move in record/);
});
