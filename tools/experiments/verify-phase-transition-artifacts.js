"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DIR = path.resolve("artifacts/phase-transition/fixture");
const OBSERVATIONS = path.join(DIR, "observations.jsonl");
const GAMES = path.join(DIR, "games.json");
const MANIFEST = path.join(DIR, "manifest.json");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readJsonl(file) {
  return fs.readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${file}:${index + 1}: invalid JSON: ${error.message}`);
    }
  });
}

function validateObservation(row) {
  assert.equal(row.schemaVersion, "1.0.0");
  assert.equal(typeof row.gameId, "string");
  assert.ok(Number.isInteger(row.ply) && row.ply >= 0);
  assert.ok(row.player === 0 || row.player === 1);
  assert.ok(row.phase === "namua" || row.phase === "mtaji");
  assert.match(row.stateHash, /^[a-f0-9]{64}$/);
  if (row.previousStateHash !== null) assert.match(row.previousStateHash, /^[a-f0-9]{64}$/);
  assert.equal(row.reserve.length, 2);
  assert.equal(row.houseOwned.length, 2);
  assert.equal(row.legalMoveCount, row.captureMoveCount + row.nonCaptureMoveCount);
  assert.equal(row.frontRow.occupiedPits.length, 2);
  assert.equal(row.frontRow.occupancyRate.length, 2);
  assert.equal(row.frontRow.seedCount.length, 2);
}

function main() {
  for (const file of [OBSERVATIONS, GAMES, MANIFEST]) {
    assert.ok(fs.existsSync(file), `missing artifact: ${file}`);
  }

  const observationsText = fs.readFileSync(OBSERVATIONS, "utf8");
  const gamesText = fs.readFileSync(GAMES, "utf8");
  const observations = readJsonl(OBSERVATIONS);
  const games = JSON.parse(gamesText);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

  assert.equal(manifest.gameCount, games.length);
  assert.equal(manifest.observationCount, observations.length);
  assert.equal(manifest.files["observations.jsonl"], sha256(observationsText));
  assert.equal(manifest.files["games.json"], sha256(gamesText));

  const byGame = new Map();
  const keys = new Set();
  for (const row of observations) {
    validateObservation(row);
    const key = `${row.gameId}:${row.ply}`;
    assert.equal(keys.has(key), false, `duplicate observation: ${key}`);
    keys.add(key);
    if (!byGame.has(row.gameId)) byGame.set(row.gameId, []);
    byGame.get(row.gameId).push(row);
  }

  for (const game of games) {
    const rows = byGame.get(game.gameId);
    assert.ok(rows?.length, `missing observations for ${game.gameId}`);
    rows.sort((a, b) => a.ply - b.ply);
    rows.forEach((row, index) => {
      assert.equal(row.ply, index, `${game.gameId}: non-contiguous ply`);
      assert.equal(row.previousStateHash, index === 0 ? null : rows[index - 1].stateHash,
        `${game.gameId}:${row.ply}: previousStateHash mismatch`);
    });
    assert.equal(rows.at(-1).stateHash, game.finalStateHash);
    assert.equal(rows.at(-1).ply, game.observedMaxPly);
  }

  assert.equal(byGame.size, games.length);
  console.log(`Verified ${observations.length} observations across ${games.length} games.`);
}

if (require.main === module) main();
module.exports = { readJsonl, validateObservation };
