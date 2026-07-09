"use strict";

const assert = require("node:assert/strict");
const WeightConfig = require("../public/ai-weights.js");
const { seededRandom } = require("../tools/benchmark.js");
const { parseArgs, mutateWeights, wilsonLower, changedWeights } = require("../tools/tune-weights.js");

{
  const source = WeightConfig.cloneWeights();
  const first = mutateWeights(source, seededRandom(123), 2);
  const second = mutateWeights(source, seededRandom(123), 2);
  assert.deepEqual(first, second, "candidate generation is reproducible");
  assert.notDeepEqual(first, source, "a candidate changes at least one weight");
  assert.deepEqual(source, WeightConfig.DEFAULT_WEIGHTS, "mutation does not alter default weights");
  WeightConfig.validateWeights(first);
}

assert.ok(wilsonLower(350, 500) > 0.5, "a clear 500-game advantage is significant");
assert.ok(wilsonLower(260, 500) < 0.5, "a narrow 500-game result is not significant");
assert.throws(() => parseArgs(["--games", "3"]), /even/);
assert.throws(() => parseArgs(["--opening-phases", "unknown"]), /Invalid opening phases/);
assert.throws(() => parseArgs(["--mutate-phases", "unknown"]), /Invalid mutation phases/);

{
  const source = WeightConfig.cloneWeights();
  const changed = mutateWeights(source, seededRandom(7), 2, ["mtaji"]);
  assert.deepEqual(changed.namua, source.namua, "phase-scoped mutation leaves other phases unchanged");
}

{
  const before = WeightConfig.cloneWeights();
  const after = WeightConfig.cloneWeights();
  after.mtaji.mobility += 2;
  assert.deepEqual(changedWeights(before, after), [
    { phase: "mtaji", name: "mobility", before: 3, after: 5 },
  ]);
}

console.log("Bao weight tuner tests passed");
