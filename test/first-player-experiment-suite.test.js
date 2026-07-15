"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  aggregateGames,
  checkpointPath,
  loadCheckpoint,
  parseArgs,
} = require("../tools/first-player-experiment-suite.js");

const options = parseArgs([
  "--condition-name", "eval-mcts",
  "--experiment-profile", "screening-2026-07",
  "--games", "10",
  "--mcts-iterations", "12",
  "--mcts-playout-turns", "16",
  "--checkpoint-every", "1",
  "--progress-every", "2",
  "--output", "/tmp/first-player-suite-test.json",
]);

assert.equal(options.conditionName, "eval-mcts");
assert.equal(options.experimentProfile, "screening-2026-07");
assert.equal(options.mctsIterations, 12);
assert.equal(options.mctsPlayoutTurns, 16);
assert.equal(options.checkpointEvery, 1);
assert.equal(options.progressEvery, 2);
assert.equal(checkpointPath(options.output), "/tmp/first-player-suite-test.partial.json");

const aggregate = aggregateGames([
  { winner: 0, turns: 20, firstMove: "a" },
  { winner: 1, turns: 30, firstMove: "a" },
  { winner: null, turns: 40, firstMove: "b" },
]);
assert.deepEqual(
  { games: aggregate.totals.games, southWins: aggregate.totals.southWins, northWins: aggregate.totals.northWins, draws: aggregate.totals.draws },
  { games: 3, southWins: 1, northWins: 1, draws: 1 },
);
assert.equal(aggregate.totals.averageTurns, 30);
assert.equal(aggregate.firstMoves.find((item) => item.move === "a").games, 2);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-first-player-checkpoint-"));
const checkpoint = path.join(temp, "batch.partial.json");
const games = [{ game: 1, seed: 10, winner: 0, turns: 20, firstMove: "a" }];
fs.writeFileSync(checkpoint, JSON.stringify({ config: options, games }));
assert.deepEqual(loadCheckpoint(checkpoint, options), games);
assert.throws(
  () => loadCheckpoint(checkpoint, { ...options, games: 20 }),
  /Checkpoint configuration mismatch/,
);

console.log("First-player experiment suite tests passed");
