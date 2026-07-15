"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  buildCorpus,
  parseArgs,
  writeCorpus,
} = require("../tools/experiments/generate-opening-corpus.js");
const {
  parseJsonLines,
  validateCorpus,
} = require("../tools/experiments/paired-first-player-common.js");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-opening-corpus-"));
const options = parseArgs([
  "--count", "12",
  "--plies", "8",
  "--policy", "uniform",
  "--unique",
  "--stratify", "first-move",
  "--seed", "20260716",
  "--corpus-id", "fixture-12",
  "--output", path.join(temp, "fixture.jsonl"),
]);
const first = buildCorpus(options);
const second = buildCorpus(options);
assert.deepEqual(first.accepted, second.accepted);
assert.equal(first.accepted.length, 12);
assert.equal(new Set(first.accepted.map(({ openingMovesHash }) => openingMovesHash)).size, 12);
assert.deepEqual(Object.values(first.firstMoves).sort((a, b) => a - b), [3, 3, 3, 3]);
assert.ok(first.accepted.every(({ terminal, playedPlies }) => !terminal && playedPlies === 8));

const { manifest } = writeCorpus(options, first);
const text = fs.readFileSync(options.output, "utf8");
const entries = parseJsonLines(text);
assert.deepEqual(validateCorpus(entries, manifest, text), {
  openings: 12,
  openingIds: 12,
  uniqueOpeningMoves: 12,
});
const damaged = structuredClone(entries);
damaged[0].openingState.reserve[0] -= 1;
assert.throws(() => validateCorpus(damaged), /Opening state hash mismatch/);
assert.throws(() => parseArgs(["--count", "10", "--unique", "--stratify", "first-move"]), /divisible by four/);

console.log("Opening corpus tests passed");
