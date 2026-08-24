"use strict";

const crypto = require("node:crypto");

function requireOwn(source, key) {
  if (!Object.prototype.hasOwnProperty.call(source, key)) throw new Error(`missing required field ${key}`);
  return source[key];
}

function copyPair(source, key, predicate, message) {
  const value = requireOwn(source, key);
  if (!Array.isArray(value) || value.length !== 2 || !value.every(predicate)) throw new Error(message);
  return [value[0], value[1]];
}

function copyBoard(source) {
  const pits = requireOwn(source, "pits");
  if (!Array.isArray(pits) || pits.length !== 2) throw new Error("invalid pits player dimension");
  const out = [];
  for (let player = 0; player < 2; player += 1) {
    const rows = pits[player];
    if (!Array.isArray(rows) || rows.length !== 2) throw new Error("invalid pits row dimension");
    const copiedRows = [];
    for (let row = 0; row < 2; row += 1) {
      const cells = rows[row];
      if (!Array.isArray(cells) || cells.length !== 8) throw new Error("invalid pit row width");
      if (!cells.every((n) => Number.isInteger(n) && n >= 0)) throw new Error("invalid pit count");
      copiedRows.push(cells.slice());
    }
    out.push(copiedRows);
  }
  return out;
}

function project(state) {
  if (state === null || typeof state !== "object") throw new Error("state object required");
  const player = requireOwn(state, "player");
  const phase = requireOwn(state, "phase");
  const winner = requireOwn(state, "winner");
  if (player !== 0 && player !== 1) throw new Error("invalid player");
  if (phase !== "namua" && phase !== "mtaji") throw new Error("invalid phase");
  if (winner !== null && winner !== 0 && winner !== 1) throw new Error("invalid winner");
  return {
    pits: copyBoard(state),
    reserve: copyPair(state, "reserve", (n) => Number.isInteger(n) && n >= 0, "invalid reserve"),
    houseOwned: copyPair(state, "houseOwned", (v) => typeof v === "boolean", "invalid houseOwned"),
    player,
    phase,
    winner,
    pending: copyPair(state, "pending", (n) => Number.isInteger(n) && n >= 0, "invalid pending"),
  };
}

function canonical(value) {
  if (value === null) return "null";
  const kind = typeof value;
  if (kind === "string" || kind === "number" || kind === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) {
    let text = "[";
    for (let index = 0; index < value.length; index += 1) {
      if (index) text += ",";
      text += canonical(value[index]);
    }
    return `${text}]`;
  }
  if (kind !== "object") throw new Error(`unsupported canonical value type: ${kind}`);
  const names = Object.keys(value).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  let text = "{";
  names.forEach((name, index) => {
    if (index) text += ",";
    text += `${JSON.stringify(name)}:${canonical(value[name])}`;
  });
  return `${text}}`;
}

function serialize(state) {
  return canonical(project(state));
}

function key(state) {
  const hash = crypto.createHash("sha256");
  hash.update(Buffer.from(serialize(state), "utf8"));
  return hash.digest("hex");
}

function seedCount(state) {
  const raw = project(state);
  let total = 0;
  for (const playerRows of raw.pits) {
    for (const row of playerRows) {
      for (const n of row) total += n;
    }
  }
  total += raw.reserve[0] + raw.reserve[1];
  total += raw.pending[0] + raw.pending[1];
  return total;
}

function moveIdentity(move) {
  if (move === null || typeof move !== "object") throw new Error("move object required");
  const parts = [
    move.type,
    move.phase,
    move.row,
    move.index,
    move.direction,
    move.side,
    move.houseChoice,
    move.houseTwo === true,
  ];
  return parts.map((part) => String(part)).join(":");
}

module.exports = {
  canonical,
  key,
  moveIdentity,
  project,
  seedCount,
  serialize,
};
