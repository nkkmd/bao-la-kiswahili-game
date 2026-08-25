"use strict";

const crypto = require("node:crypto");

const RAW_IDENTITY_FIELDS = Object.freeze([
  "pits",
  "reserve",
  "houseOwned",
  "player",
  "phase",
  "winner",
  "pending",
]);

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function assertPair(name, value) {
  if (!Array.isArray(value) || value.length !== 2) throw new Error(`${name} must be a two-element array`);
}

function assertRawStateShape(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) throw new Error("state must be an object");
  for (const field of RAW_IDENTITY_FIELDS) {
    if (!hasOwn(state, field)) throw new Error(`raw identity field missing: ${field}`);
  }
  if (!Array.isArray(state.pits) || state.pits.length !== 2) throw new Error("pits must have two players");
  for (const rows of state.pits) {
    if (!Array.isArray(rows) || rows.length !== 2) throw new Error("each player must have two rows");
    for (const row of rows) {
      if (!Array.isArray(row) || row.length !== 8) throw new Error("each row must have eight pits");
      if (!row.every((n) => Number.isInteger(n) && n >= 0)) throw new Error("pit counts must be non-negative integers");
    }
  }
  assertPair("reserve", state.reserve);
  assertPair("houseOwned", state.houseOwned);
  assertPair("pending", state.pending);
  if (!state.reserve.every((n) => Number.isInteger(n) && n >= 0)) throw new Error("reserve counts must be non-negative integers");
  if (!state.pending.every((n) => Number.isInteger(n) && n >= 0)) throw new Error("pending counts must be non-negative integers");
  if (!state.houseOwned.every((v) => typeof v === "boolean")) throw new Error("houseOwned values must be boolean");
  if (state.player !== 0 && state.player !== 1) throw new Error("player must be 0 or 1");
  if (state.phase !== "namua" && state.phase !== "mtaji") throw new Error("phase must be namua or mtaji");
  if (state.winner !== null && state.winner !== 0 && state.winner !== 1) throw new Error("winner must be null, 0, or 1");
}

function rawRuleState(state) {
  assertRawStateShape(state);
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}

function representedSeeds(state) {
  const raw = rawRuleState(state);
  return raw.pits.flat(2).reduce((sum, n) => sum + n, 0)
    + raw.reserve[0] + raw.reserve[1]
    + raw.pending[0] + raw.pending[1];
}

function assertStudyState(state) {
  assertRawStateShape(state);
  const total = representedSeeds(state);
  if (total !== 64) throw new Error(`seed conservation failed: expected 64, got ${total}`);
  return state;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function stateSerialization(state) {
  assertStudyState(state);
  return stableStringify(rawRuleState(state));
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function stateKey(state) {
  return sha256Text(stateSerialization(state));
}

function moveKey(move) {
  if (!move || typeof move !== "object") throw new Error("move must be an object");
  const fields = ["type", "phase", "row", "index", "direction", "side", "houseChoice"];
  const parts = fields.map((field) => (move[field] === undefined || move[field] === null ? "" : String(move[field])));
  parts.push(move.houseTwo === true ? "true" : "false");
  return parts.join(":");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = {
  RAW_IDENTITY_FIELDS,
  assertRawStateShape,
  assertStudyState,
  clone,
  moveKey,
  rawRuleState,
  representedSeeds,
  sha256Text,
  stableStringify,
  stateKey,
  stateSerialization,
};
