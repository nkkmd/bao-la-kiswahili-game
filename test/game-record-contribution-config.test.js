"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const clientConfigSource = fs.readFileSync("public/game-record-contribution-config.js", "utf8");
const workerSource = fs.readFileSync("cloudflare/game-record-ingest/src/index.mjs", "utf8");
const wrangler = JSON.parse(fs.readFileSync("cloudflare/game-record-ingest/wrangler.jsonc", "utf8"));

test("public contribution config fails closed until Cloudflare is provisioned", () => {
  assert.match(clientConfigSource, /enabled:\s*false/);
  assert.match(clientConfigSource, /turnstileSiteKey:\s*""/);
  assert.match(clientConfigSource, /maxRecordBytes:\s*49152/);
});

test("Worker configuration uses private R2 binding and conservative application limits", () => {
  assert.equal(wrangler.r2_buckets.length, 1);
  assert.deepEqual(wrangler.r2_buckets[0], {
    binding: "GAME_RECORDS",
    bucket_name: "bao-game-record-contributions",
  });
  assert.equal(wrangler.vars.MAX_REQUEST_BYTES, "65536");
  assert.equal(wrangler.vars.MAX_RECORD_BYTES, "49152");
  assert.equal(wrangler.vars.MAX_PLIES, "384");
  assert.equal(wrangler.ratelimits.length, 2);
  assert.deepEqual(wrangler.ratelimits.map((entry) => [entry.name, entry.simple.limit, entry.simple.period]), [
    ["PER_CLIENT_RATE_LIMITER", 3, 60],
    ["GLOBAL_ACCEPT_RATE_LIMITER", 1, 60],
  ]);
});

test("Worker source contains no committed secret and never persists connection identifiers", () => {
  assert.doesNotMatch(workerSource, /TURNSTILE_SECRET_KEY\s*[:=]\s*["'][^"']+["']/);
  assert.match(workerSource, /env\.TURNSTILE_SECRET_KEY/);
  assert.match(workerSource, /CF-Connecting-IP/);
  assert.doesNotMatch(workerSource, /customMetadata[\s\S]{0,800}(?:ipAddress|clientIp|sourceIp|turnstileToken)/i);
  assert.match(workerSource, /records\/v1\/\$\{hash\}\.json/);
});
