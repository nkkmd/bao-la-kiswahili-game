"use strict";

const crypto = require("node:crypto");

function own(source, name) {
  if (!source || typeof source !== "object" || Array.isArray(source)) throw new Error("state object required");
  if (!Object.prototype.hasOwnProperty.call(source, name)) throw new Error(`missing required field ${name}`);
  return source[name];
}

function pair(source, name, predicate, error) {
  const value = own(source, name);
  if (!Array.isArray(value) || value.length !== 2 || !value.every(predicate)) throw new Error(error);
  return [value[0], value[1]];
}

function board(source) {
  const pits = own(source, "pits");
  if (!Array.isArray(pits) || pits.length !== 2) throw new Error("invalid pits player dimension");
  const copied = [];
  for (let player = 0; player < 2; player += 1) {
    const rows = pits[player];
    if (!Array.isArray(rows) || rows.length !== 2) throw new Error("invalid pits row dimension");
    const outRows = [];
    for (let row = 0; row < 2; row += 1) {
      const cells = rows[row];
      if (!Array.isArray(cells) || cells.length !== 8) throw new Error("invalid pit row width");
      if (!cells.every((n) => Number.isInteger(n) && n >= 0)) throw new Error("invalid pit count");
      outRows.push(cells.slice());
    }
    copied.push(outRows);
  }
  return copied;
}

function project(state) {
  const player = own(state, "player");
  const phase = own(state, "phase");
  const winner = own(state, "winner");
  if (player !== 0 && player !== 1) throw new Error("invalid player");
  if (phase !== "namua" && phase !== "mtaji") throw new Error("invalid phase");
  if (winner !== null && winner !== 0 && winner !== 1) throw new Error("invalid winner");
  return {
    pits: board(state),
    reserve: pair(state, "reserve", (n) => Number.isInteger(n) && n >= 0, "invalid reserve"),
    houseOwned: pair(state, "houseOwned", (v) => typeof v === "boolean", "invalid houseOwned"),
    player,
    phase,
    winner,
    pending: pair(state, "pending", (n) => Number.isInteger(n) && n >= 0, "invalid pending"),
  };
}

function seedCount(state) {
  const raw = project(state);
  let total = raw.reserve[0] + raw.reserve[1] + raw.pending[0] + raw.pending[1];
  for (const playerRows of raw.pits) for (const row of playerRows) for (const n of row) total += n;
  return total;
}

function assertStudyState(state) {
  project(state);
  const total = seedCount(state);
  if (total !== 64) throw new Error(`independent seed conservation failed: expected 64, got ${total}`);
  return state;
}

function canonical(value) {
  if (value === null) return "null";
  const kind = typeof value;
  if (kind === "string" || kind === "number" || kind === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) {
    let text = "[";
    for (let i = 0; i < value.length; i += 1) {
      if (i) text += ",";
      text += canonical(value[i]);
    }
    return `${text}]`;
  }
  if (kind !== "object") throw new Error(`unsupported canonical type: ${kind}`);
  const names = Object.keys(value).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  let text = "{";
  for (let i = 0; i < names.length; i += 1) {
    if (i) text += ",";
    const name = names[i];
    text += `${JSON.stringify(name)}:${canonical(value[name])}`;
  }
  return `${text}}`;
}

function serialize(state) {
  assertStudyState(state);
  return canonical(project(state));
}

function sha256(text) {
  const hash = crypto.createHash("sha256");
  hash.update(Buffer.from(text, "utf8"));
  return hash.digest("hex");
}

function key(state) {
  return sha256(serialize(state));
}

function moveIdentity(move) {
  if (!move || typeof move !== "object") throw new Error("move object required");
  const values = [
    move.type,
    move.phase,
    move.row,
    move.index,
    move.direction,
    move.side,
    move.houseChoice,
    move.houseTwo === true,
  ];
  return values.map((value) => (value === undefined || value === null ? "" : String(value))).join(":");
}

module.exports = {
  assertStudyState,
  canonical,
  key,
  moveIdentity,
  project,
  seedCount,
  serialize,
  sha256,
};
