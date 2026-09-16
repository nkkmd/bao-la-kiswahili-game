import "../../../public/engine.js";

const FORMAT = "bao-game-record";
const VERSION = 1;
const RULES = Object.freeze({
  guide: "bao-la-kiswahili-ja",
  guideVersion: "v0.1.0-draft",
  baseline: "R-002",
});
const DEFAULT_MAX_REQUEST_BYTES = 64 * 1024;
const DEFAULT_MAX_RECORD_BYTES = 48 * 1024;
const DEFAULT_MAX_PLIES = 384;
const DEFAULT_MAX_ACCEPTED_PER_UTC_DAY = 500;
const HARD_MAX_ACCEPTED_PER_UTC_DAY = 1000;
const QUOTA_PREFIX = "control/daily/";
const RECORD_PREFIX = "records/v1/";
const SAFE_TOKEN = /^[A-Za-z0-9._:+/-]+$/;
const PHASES = new Set(["namua", "mtaji"]);
const DIFFICULTIES = new Set(["easy", "normal", "hard", "expert"]);
const MOVE_TYPES = new Set(["capture", "takata", "pass"]);
const DIRECTIONS = new Set(["left", "right"]);
const SIDES = new Set(["left", "right"]);
const HOUSE_CHOICES = new Set(["stop", "use"]);
const TOP_LEVEL_KEYS = ["format", "version", "rules", "settings", "initialPosition", "moves", "result", "finalPosition"];
const POSITION_KEYS = ["pits", "reserve", "houseOwned", "player", "phase", "winner", "reason", "turn", "pending"];
const MOVE_ENTRY_KEYS = ["ply", "turn", "player", "side", "phase", "move"];
const MOVE_KEYS = ["type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo"];

class ValidationError extends Error {}

function integerEnv(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assert(condition, message) {
  if (!condition) throw new ValidationError(message);
}

function assertAllowedKeys(value, allowed, required = allowed) {
  assert(isPlainObject(value), "Expected object");
  const keys = Object.keys(value);
  assert(keys.every((key) => allowed.includes(key)), "Unexpected field");
  assert(required.every((key) => Object.hasOwn(value, key)), "Missing field");
}

function assertToken(value, maxLength = 96) {
  assert(typeof value === "string" && value.length >= 1 && value.length <= maxLength && SAFE_TOKEN.test(value), "Invalid token");
}

function assertSmallString(value, maxLength = 96) {
  assert(typeof value === "string" && value.length <= maxLength, "Invalid string");
  assert(!/[\u0000-\u001f\u007f]/.test(value), "Invalid control character");
}

function assertInteger(value, min, max) {
  assert(Number.isInteger(value) && value >= min && value <= max, "Invalid integer");
}

function validatePosition(position, { completed = false } = {}) {
  assertAllowedKeys(position, POSITION_KEYS);
  assert(Array.isArray(position.pits) && position.pits.length === 2, "Invalid pits");
  let total = 0;
  for (const player of position.pits) {
    assert(Array.isArray(player) && player.length === 2, "Invalid pit rows");
    for (const row of player) {
      assert(Array.isArray(row) && row.length === 8, "Invalid pit row");
      for (const count of row) {
        assertInteger(count, 0, 64);
        total += count;
      }
    }
  }
  assert(Array.isArray(position.reserve) && position.reserve.length === 2, "Invalid reserve");
  for (const value of position.reserve) {
    assertInteger(value, 0, 32);
    total += value;
  }
  assert(Array.isArray(position.pending) && position.pending.length === 2, "Invalid pending");
  for (const value of position.pending) {
    assertInteger(value, 0, 64);
    total += value;
  }
  assert(total === 64, "Invalid kete total");
  assert(Array.isArray(position.houseOwned) && position.houseOwned.length === 2
    && position.houseOwned.every((value) => typeof value === "boolean"), "Invalid house ownership");
  assert(position.player === 0 || position.player === 1, "Invalid player");
  assert(PHASES.has(position.phase), "Invalid phase");
  assert(position.winner === null || position.winner === 0 || position.winner === 1, "Invalid winner");
  if (completed) assert(position.winner === 0 || position.winner === 1, "Game is not complete");
  assertSmallString(position.reason, 64);
  assertInteger(position.turn, 1, 10000);
}

function validateMove(move) {
  assertAllowedKeys(move, MOVE_KEYS, ["type"]);
  assert(MOVE_TYPES.has(move.type), "Invalid move type");
  if (move.type === "pass") {
    assert(Object.keys(move).length === 1, "Invalid pass move");
    return;
  }
  assert(PHASES.has(move.phase), "Invalid move phase");
  assertInteger(move.row, 0, 1);
  assertInteger(move.index, 0, 7);
  assert(DIRECTIONS.has(move.direction), "Invalid direction");
  if (Object.hasOwn(move, "side")) assert(SIDES.has(move.side), "Invalid capture side");
  if (Object.hasOwn(move, "houseChoice")) assert(HOUSE_CHOICES.has(move.houseChoice), "Invalid house choice");
  if (Object.hasOwn(move, "houseTwo")) assert(move.houseTwo === true, "Invalid houseTwo");

  const namuaCapture = move.type === "capture" && move.phase === "namua";
  if (namuaCapture) assert(SIDES.has(move.side), "Missing capture side");
  else assert(!Object.hasOwn(move, "side"), "Unexpected side");

  if (Object.hasOwn(move, "houseChoice")) {
    assert(namuaCapture, "Unexpected house choice");
  }
  if (Object.hasOwn(move, "houseTwo")) {
    assert(move.type === "takata" && move.phase === "namua", "Unexpected houseTwo");
  }
}

function validateSettings(settings) {
  assertAllowedKeys(settings, ["mode", "humanSide", "ai"], ["mode", "humanSide", "ai"]);
  assert(settings.mode === "computer", "Only computer games are accepted");
  assert(settings.humanSide === "south" || settings.humanSide === "north", "Invalid human side");
  assertAllowedKeys(settings.ai,
    ["difficulty", "generation", "releaseId", "adoptionId", "evaluator"],
    ["difficulty", "generation", "releaseId"]);
  assert(DIFFICULTIES.has(settings.ai.difficulty), "Invalid difficulty");
  assertToken(settings.ai.generation, 48);
  assertToken(settings.ai.releaseId, 96);
  if (Object.hasOwn(settings.ai, "adoptionId")) assertToken(settings.ai.adoptionId, 96);
  if (Object.hasOwn(settings.ai, "evaluator")) assertToken(settings.ai.evaluator, 96);
}

function validateRules(rules) {
  assertAllowedKeys(rules, ["guide", "guideVersion", "baseline"]);
  assert(rules.guide === RULES.guide && rules.guideVersion === RULES.guideVersion
    && rules.baseline === RULES.baseline, "Unsupported rules baseline");
}

function validateResult(result, finalPosition, moveCount) {
  assertAllowedKeys(result, ["winner", "winnerSide", "reason", "plies"]);
  assert(result.winner === 0 || result.winner === 1, "Invalid result winner");
  assert(result.winnerSide === (result.winner === 0 ? "south" : "north"), "Invalid winner side");
  assertSmallString(result.reason, 64);
  assertInteger(result.plies, 1, 10000);
  assert(result.plies === moveCount, "Ply count mismatch");
  assert(finalPosition.winner === result.winner && finalPosition.reason === result.reason, "Result mismatch");
}

export function validateRecord(record, maxPlies = DEFAULT_MAX_PLIES) {
  assertAllowedKeys(record, TOP_LEVEL_KEYS);
  assert(record.format === FORMAT && record.version === VERSION, "Unsupported record format");
  validateRules(record.rules);
  validateSettings(record.settings);
  validatePosition(record.initialPosition);
  assert(record.initialPosition.winner === null, "Initial position is already complete");
  assert(Array.isArray(record.moves), "Invalid moves");
  assert(record.moves.length >= 1 && record.moves.length <= maxPlies, "Unsupported game length");
  for (let index = 0; index < record.moves.length; index += 1) {
    const entry = record.moves[index];
    assertAllowedKeys(entry, MOVE_ENTRY_KEYS);
    assert(entry.ply === index + 1, "Invalid ply sequence");
    assertInteger(entry.turn, 1, 10000);
    assert(entry.player === 0 || entry.player === 1, "Invalid move player");
    assert(entry.side === (entry.player === 0 ? "south" : "north"), "Invalid move side");
    assert(PHASES.has(entry.phase), "Invalid entry phase");
    validateMove(entry.move);
    if (entry.move.type !== "pass") assert(entry.move.phase === entry.phase, "Move phase mismatch");
  }
  validatePosition(record.finalPosition, { completed: true });
  validateResult(record.result, record.finalPosition, record.moves.length);
  return true;
}

function canonicalPosition(state) {
  return {
    pits: state.pits,
    reserve: state.reserve,
    houseOwned: state.houseOwned,
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    reason: state.reason || "",
    turn: state.turn,
    pending: state.pending || [0, 0],
  };
}

function exactMoveKey(move) {
  return MOVE_KEYS.map((key) => Object.hasOwn(move, key)
    ? `${key}:${JSON.stringify(move[key])}` : `${key}:<absent>`).join("|");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

export function replayAndVerify(record) {
  const engine = globalThis.BaoEngine;
  assert(engine && typeof engine.applyMoveForSearch === "function"
    && typeof engine.moveVariantsForSearch === "function" && typeof engine.initialState === "function",
  "Bao engine unavailable");

  const expectedInitial = canonicalPosition(engine.initialState());
  assert(JSON.stringify(canonicalPosition(record.initialPosition)) === JSON.stringify(expectedInitial),
    "Non-standard initial position");

  let state = structuredClone(record.initialPosition);
  for (const entry of record.moves) {
    assert(state.winner === null, "Moves continue after game end");
    assert(state.turn === entry.turn && state.player === entry.player && state.phase === entry.phase,
      "Move metadata does not match replay state");
    const submittedKey = exactMoveKey(entry.move);
    const legalVariants = engine.moveVariantsForSearch(state);
    assert(Array.isArray(legalVariants)
      && legalVariants.some((candidate) => exactMoveKey(candidate) === submittedKey),
    "Non-canonical or illegal move in record");
    try {
      state = engine.applyMoveForSearch(state, entry.move).state;
    } catch {
      throw new ValidationError("Illegal move in record");
    }
  }
  assert(JSON.stringify(canonicalPosition(state)) === JSON.stringify(record.finalPosition), "Final position mismatch");
  return true;
}

function allowedOrigins(env) {
  return new Set(String(env.ALLOWED_ORIGINS || "")
    .split(",").map((value) => value.trim()).filter(Boolean));
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(status, payload, origin = null) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (origin) Object.assign(headers, corsHeaders(origin));
  return new Response(JSON.stringify(payload), { status, headers });
}

async function verifyTurnstile(token, env, remoteIp = "") {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || token.length < 10 || token.length > 4096) return false;
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!response.ok) return false;
  const result = await response.json();
  const hostnames = new Set(String(env.TURNSTILE_HOSTNAMES || "")
    .split(",").map((value) => value.trim()).filter(Boolean));
  return result?.success === true
    && result.action === "game_record_contribution"
    && typeof result.hostname === "string"
    && hostnames.has(result.hostname);
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function readJsonBody(request, maxBytes) {
  const rawLength = request.headers.get("Content-Length");
  if (rawLength !== null) {
    const declared = Number.parseInt(rawLength, 10);
    if (!Number.isFinite(declared) || declared < 0 || declared > maxBytes) {
      throw new ValidationError("Request too large");
    }
  }
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxBytes) throw new ValidationError("Request too large");
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new ValidationError("Invalid JSON");
  }
}

async function checkRateLimit(binding, key) {
  if (!binding || typeof binding.limit !== "function") return true;
  const result = await binding.limit({ key });
  return result?.success === true;
}

function utcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function readQuotaObject(object) {
  if (!object) return null;
  try {
    const parsed = JSON.parse(await object.text());
    return Number.isInteger(parsed.accepted) && parsed.accepted >= 0 ? parsed.accepted : null;
  } catch {
    return null;
  }
}

export async function reserveDailyAcceptanceSlot(bucket, maxAccepted, date = new Date()) {
  if (!bucket || typeof bucket.get !== "function" || typeof bucket.put !== "function") {
    return { accepted: false, reason: "unavailable" };
  }
  const day = utcDay(date);
  const key = `${QUOTA_PREFIX}${day}.json`;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const current = await bucket.get(key);
    if (!current) {
      const created = await bucket.put(key, JSON.stringify({ day, accepted: 1 }), {
        onlyIf: new Headers({ "If-None-Match": "*" }),
        httpMetadata: { contentType: "application/json; charset=utf-8" },
        customMetadata: { type: "daily-acceptance-quota", day },
      });
      if (created) return { accepted: true, count: 1 };
      continue;
    }

    const accepted = await readQuotaObject(current);
    if (accepted === null) return { accepted: false, reason: "invalid_control_state" };
    if (accepted >= maxAccepted) return { accepted: false, reason: "daily_limit" };

    const updated = await bucket.put(key, JSON.stringify({ day, accepted: accepted + 1 }), {
      onlyIf: { etagMatches: current.etag },
      httpMetadata: { contentType: "application/json; charset=utf-8" },
      customMetadata: { type: "daily-acceptance-quota", day },
    });
    if (updated) return { accepted: true, count: accepted + 1 };
  }
  return { accepted: false, reason: "contention" };
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";
  const origins = allowedOrigins(env);
  const originAllowed = origins.has(origin);

  if (url.pathname !== "/v1/game-records") return jsonResponse(404, { ok: false, error: "not_found" });
  if (request.method === "OPTIONS") {
    if (!originAllowed) return jsonResponse(403, { ok: false, error: "origin_not_allowed" });
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== "POST") return jsonResponse(405, { ok: false, error: "method_not_allowed" }, originAllowed ? origin : null);
  if (!originAllowed) return jsonResponse(403, { ok: false, error: "origin_not_allowed" });
  if (String(env.COLLECTION_ENABLED || "").toLowerCase() !== "true") {
    return jsonResponse(503, { ok: false, error: "collection_disabled" }, origin);
  }
  if (!(request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) {
    return jsonResponse(415, { ok: false, error: "unsupported_media_type" }, origin);
  }
  if (!env.GAME_RECORDS || typeof env.GAME_RECORDS.put !== "function"
    || typeof env.GAME_RECORDS.head !== "function" || typeof env.GAME_RECORDS.get !== "function") {
    return jsonResponse(503, { ok: false, error: "collection_unavailable" }, origin);
  }

  const clientKey = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await checkRateLimit(env.PER_CLIENT_RATE_LIMITER, clientKey)) {
    return jsonResponse(429, { ok: false, error: "rate_limited" }, origin);
  }

  const maxRequestBytes = integerEnv(env.MAX_REQUEST_BYTES,
    DEFAULT_MAX_REQUEST_BYTES, 4096, DEFAULT_MAX_REQUEST_BYTES);
  const maxRecordBytes = integerEnv(env.MAX_RECORD_BYTES,
    DEFAULT_MAX_RECORD_BYTES, 4096, DEFAULT_MAX_RECORD_BYTES);
  const maxPlies = integerEnv(env.MAX_PLIES, DEFAULT_MAX_PLIES, 1, DEFAULT_MAX_PLIES);
  const maxAcceptedPerUtcDay = integerEnv(env.MAX_ACCEPTED_PER_UTC_DAY,
    DEFAULT_MAX_ACCEPTED_PER_UTC_DAY, 1, HARD_MAX_ACCEPTED_PER_UTC_DAY);

  let envelope;
  try {
    envelope = await readJsonBody(request, maxRequestBytes);
    assertAllowedKeys(envelope, ["record", "turnstileToken", "consent"], ["record", "turnstileToken", "consent"]);
    assertAllowedKeys(envelope.consent, ["version", "purpose"]);
    assert(envelope.consent.version === 1 && envelope.consent.purpose === "ai-improvement", "Invalid consent marker");
  } catch (error) {
    const tooLarge = error instanceof ValidationError && error.message === "Request too large";
    return jsonResponse(tooLarge ? 413 : 400,
      { ok: false, error: tooLarge ? "request_too_large" : "invalid_request" }, origin);
  }

  if (!await verifyTurnstile(envelope.turnstileToken, env, clientKey === "unknown" ? "" : clientKey)) {
    return jsonResponse(403, { ok: false, error: "turnstile_failed" }, origin);
  }

  try {
    validateRecord(envelope.record, maxPlies);
    const recordText = stableStringify(envelope.record);
    if (new TextEncoder().encode(recordText).byteLength > maxRecordBytes) {
      return jsonResponse(413, { ok: false, error: "record_too_large" }, origin);
    }
    replayAndVerify(envelope.record);

    const hash = await sha256Hex(recordText);
    const key = `${RECORD_PREFIX}${hash}.json`;
    const existing = await env.GAME_RECORDS.head(key);
    if (existing) return jsonResponse(200, { ok: true, duplicate: true, id: hash.slice(0, 16) }, origin);

    if (!await checkRateLimit(env.LOCATION_ACCEPT_RATE_LIMITER, "accepted")) {
      return jsonResponse(429, { ok: false, error: "collection_busy" }, origin);
    }

    const quota = await reserveDailyAcceptanceSlot(env.GAME_RECORDS, maxAcceptedPerUtcDay);
    if (!quota.accepted) {
      const error = quota.reason === "daily_limit" ? "daily_collection_limit" : "collection_busy";
      return jsonResponse(429, { ok: false, error }, origin);
    }

    const stored = await env.GAME_RECORDS.put(key, recordText, {
      onlyIf: new Headers({ "If-None-Match": "*" }),
      httpMetadata: { contentType: "application/json; charset=utf-8" },
      customMetadata: {
        format: FORMAT,
        version: String(VERSION),
        aiGeneration: envelope.record.settings.ai.generation,
        difficulty: envelope.record.settings.ai.difficulty,
        winnerSide: envelope.record.result.winnerSide,
        plies: String(envelope.record.result.plies),
        validation: "standard-initial+exact-moves+replay+turnstile",
      },
    });
    if (!stored) return jsonResponse(200, { ok: true, duplicate: true, id: hash.slice(0, 16) }, origin);
    return jsonResponse(201, { ok: true, duplicate: false, id: hash.slice(0, 16) }, origin);
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonResponse(400, { ok: false, error: "invalid_game_record" }, origin);
    }
    console.error("game record contribution failed", error);
    return jsonResponse(503, { ok: false, error: "collection_unavailable" }, origin);
  }
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
