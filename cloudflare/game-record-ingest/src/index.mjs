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
  if (Object.hasOwn(move, "houseTwo")) assert(typeof move.houseTwo === "boolean", "Invalid houseTwo");
  if (move.type === "capture" && move.phase === "namua") assert(SIDES.has(move.side), "Missing capture side");
  if (move.type !== "capture") assert(!Object.hasOwn(move, "side"), "Unexpected side");
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
  assertInteger(result.plies, 0, 10000);
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

export function replayAndVerify(record) {
  const engine = globalThis.BaoEngine;
  assert(engine && typeof engine.applyMoveForSearch === "function", "Bao engine unavailable");
  let state = structuredClone(record.initialPosition);
  for (const entry of record.moves) {
    assert(state.winner === null, "Moves continue after game end");
    assert(state.turn === entry.turn && state.player === entry.player && state.phase === entry.phase,
      "Move metadata does not match replay state");
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

async function verifyTurnstile(token, env) {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || token.length < 10 || token.length > 4096) return false;
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
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
  const declared = Number.parseInt(request.headers.get("Content-Length") || "0", 10);
  if (Number.isFinite(declared) && declared > maxBytes) throw new ValidationError("Request too large");
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxBytes) throw new ValidationError("Request too large");
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new ValidationError("Invalid JSON");
  }
}

async function checkRateLimit(binding, key) {
  if (!binding || typeof binding.limit !== "function") return true;
  const result = await binding.limit({ key });
  return result?.success === true;
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
  if (!(request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) {
    return jsonResponse(415, { ok: false, error: "unsupported_media_type" }, origin);
  }
  if (!env.GAME_RECORDS || typeof env.GAME_RECORDS.put !== "function") {
    return jsonResponse(503, { ok: false, error: "collection_unavailable" }, origin);
  }

  const clientKey = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await checkRateLimit(env.PER_CLIENT_RATE_LIMITER, clientKey)) {
    return jsonResponse(429, { ok: false, error: "rate_limited" }, origin);
  }

  const maxRequestBytes = integerEnv(env.MAX_REQUEST_BYTES, DEFAULT_MAX_REQUEST_BYTES, 4096, 256 * 1024);
  const maxRecordBytes = integerEnv(env.MAX_RECORD_BYTES, DEFAULT_MAX_RECORD_BYTES, 4096, 128 * 1024);
  const maxPlies = integerEnv(env.MAX_PLIES, DEFAULT_MAX_PLIES, 1, 1024);
  let envelope;
  try {
    envelope = await readJsonBody(request, maxRequestBytes);
    assertAllowedKeys(envelope, ["record", "turnstileToken", "consent"], ["record", "turnstileToken", "consent"]);
    assertAllowedKeys(envelope.consent, ["version", "purpose"]);
    assert(envelope.consent.version === 1 && envelope.consent.purpose === "ai-improvement", "Invalid consent marker");
  } catch (error) {
    const tooLarge = error instanceof ValidationError && error.message === "Request too large";
    return jsonResponse(tooLarge ? 413 : 400, { ok: false, error: tooLarge ? "request_too_large" : "invalid_request" }, origin);
  }

  if (!await verifyTurnstile(envelope.turnstileToken, env)) {
    return jsonResponse(403, { ok: false, error: "turnstile_failed" }, origin);
  }

  try {
    validateRecord(envelope.record, maxPlies);
    const recordText = JSON.stringify(envelope.record);
    if (new TextEncoder().encode(recordText).byteLength > maxRecordBytes) {
      return jsonResponse(413, { ok: false, error: "record_too_large" }, origin);
    }
    replayAndVerify(envelope.record);

    const hash = await sha256Hex(recordText);
    const key = `records/v1/${hash}.json`;
    if (typeof env.GAME_RECORDS.head === "function") {
      const existing = await env.GAME_RECORDS.head(key);
      if (existing) return jsonResponse(200, { ok: true, duplicate: true, id: hash.slice(0, 16) }, origin);
    }

    if (!await checkRateLimit(env.GLOBAL_ACCEPT_RATE_LIMITER, "accepted")) {
      return jsonResponse(429, { ok: false, error: "collection_busy" }, origin);
    }
    await env.GAME_RECORDS.put(key, recordText, {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
      customMetadata: {
        format: FORMAT,
        version: String(VERSION),
        aiGeneration: envelope.record.settings.ai.generation,
        difficulty: envelope.record.settings.ai.difficulty,
        winnerSide: envelope.record.result.winnerSide,
        plies: String(envelope.record.result.plies),
        validation: "schema+replay+turnstile",
      },
    });
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
