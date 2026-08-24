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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertPair(name, value) {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error(`${name} must be a two-element array`);
  }
}

function assertRawStateShape(state) {
  if (!state || typeof state !== "object") throw new Error("state must be an object");
  for (const field of RAW_IDENTITY_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(state, field)) {
      throw new Error(`raw identity field missing: ${field}`);
    }
  }
  if (!Array.isArray(state.pits) || state.pits.length !== 2) throw new Error("pits must have two players");
  for (const rows of state.pits) {
    if (!Array.isArray(rows) || rows.length !== 2) throw new Error("each player must have FRONT/BACK rows");
    for (const row of rows) {
      if (!Array.isArray(row) || row.length !== 8) throw new Error("each pit row must have eight pits");
      if (!row.every((value) => Number.isInteger(value) && value >= 0)) throw new Error("pit counts must be non-negative integers");
    }
  }
  assertPair("reserve", state.reserve);
  assertPair("houseOwned", state.houseOwned);
  assertPair("pending", state.pending);
  if (!state.reserve.every((value) => Number.isInteger(value) && value >= 0)) throw new Error("reserve counts must be non-negative integers");
  if (!state.pending.every((value) => Number.isInteger(value) && value >= 0)) throw new Error("pending counts must be non-negative integers");
  if (!state.houseOwned.every((value) => typeof value === "boolean")) throw new Error("houseOwned values must be boolean");
  if (![0, 1].includes(state.player)) throw new Error("player must be 0 or 1");
  if (!["namua", "mtaji"].includes(state.phase)) throw new Error("phase must be namua or mtaji");
  if (!(state.winner === null || state.winner === 0 || state.winner === 1)) throw new Error("winner must be null, 0, or 1");
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

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function stateSerialization(state) {
  return stableStringify(rawRuleState(state));
}

function stateKey(state) {
  return crypto.createHash("sha256").update(stateSerialization(state), "utf8").digest("hex");
}

function representedSeeds(state) {
  assertRawStateShape(state);
  const pits = state.pits.flat(2).reduce((sum, value) => sum + value, 0);
  const reserve = state.reserve.reduce((sum, value) => sum + value, 0);
  const pending = state.pending.reduce((sum, value) => sum + value, 0);
  return pits + reserve + pending;
}

function exactMoveKey(move) {
  if (!move || typeof move !== "object") throw new Error("move must be an object");
  return [
    move.type,
    move.phase,
    move.row,
    move.index,
    move.direction,
    move.side,
    move.houseChoice,
    Boolean(move.houseTwo),
  ].join(":");
}

module.exports = {
  RAW_IDENTITY_FIELDS,
  assertRawStateShape,
  clone,
  exactMoveKey,
  rawRuleState,
  representedSeeds,
  stableStringify,
  stateKey,
  stateSerialization,
};
