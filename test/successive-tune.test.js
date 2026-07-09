"use strict";

const assert = require("node:assert/strict");
const WeightConfig = require("../public/ai-weights.js");
const { seededRandom } = require("../tools/benchmark.js");
const {
  parseArgs, createCandidates, selectSurvivors, scoreCandidate,
} = require("../tools/successive-tune.js");

{
  const candidates = createCandidates(
    WeightConfig.DEFAULT_WEIGHTS, 12, seededRandom(9), 4, ["namua"],
  );
  assert.equal(candidates.length, 12);
  assert.equal(new Set(candidates.map(JSON.stringify)).size, 12, "candidates are unique");
  assert.ok(candidates.every((weights) => (
    JSON.stringify(weights.mtaji) === JSON.stringify(WeightConfig.DEFAULT_WEIGHTS.mtaji)
  )), "phase-scoped candidates leave mtaji unchanged");
}

{
  const survivors = selectSurvivors([
    { id: 1, score: 0.25 }, { id: 2, score: 0.75 },
    { id: 3, score: 0.5 }, { id: 4, score: 1 },
  ], 0.5);
  assert.deepEqual(survivors.map((item) => item.id), [4, 2]);
}

assert.throws(() => parseArgs(["--round-games", "3,4"]), /positive and even/);
assert.throws(() => parseArgs(["--round-repeats", "1,2,3,4"]), /one value or match/);
assert.throws(() => parseArgs(["--round-repeats", "0"]), /positive integers/);
assert.throws(() => parseArgs(["--keep", "1"]), /Invalid keep ratio/);

{
  const options = parseArgs(["--round-games", "2,4"]);
  assert.deepEqual(options.roundRepeats, [3], "custom rounds reuse the first default repeat");
}

{
  const options = parseArgs([
    "--round-games", "2",
    "--round-repeats", "2",
    "--opening-phases", "namua",
    "--opening-plies", "0,2",
    "--max-depth", "1",
  ]);
  const result = scoreCandidate(
    WeightConfig.DEFAULT_WEIGHTS, WeightConfig.DEFAULT_WEIGHTS, options, 0, 2,
  );
  assert.equal(result.samples, 2);
  assert.equal(result.details.length, 2);
  assert.equal(result.score, 0.5, "default weights should split mirrored self-play");
}

console.log("Bao successive tuner tests passed");
