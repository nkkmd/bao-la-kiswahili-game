"use strict";

const assert = require("node:assert/strict");
const { seededRandom } = require("../tools/benchmark.js");
const { playGame } = require("../tools/game-start-first-player-study.js");

const options = { randomPlies: 2, maxDepth: 1, maxTurns: 30 };
const first = playGame(seededRandom(20262001), options);
const second = playGame(seededRandom(20262001), options);

assert.deepEqual(first, second, "the same seed must reproduce the complete audited game record");
assert.equal(first.openingMoves.length, 2);
assert.equal(first.randomPlayed, 2);
for (const field of ["openingMovesHash", "openingStateHash", "transcriptHash", "finalStateHash"]) {
  assert.match(first[field], /^[0-9a-f]{64}$/, `${field} must be a SHA-256 digest`);
}

console.log("Game-start first-player study tests passed");
