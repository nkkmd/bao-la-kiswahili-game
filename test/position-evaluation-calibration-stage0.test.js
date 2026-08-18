"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Validator = require("../tools/experiments/validate-position-evaluation-calibration-stage1-spec.js");

const loaded = Validator.loadSpec();
assert.equal(Validator.validateSpec(loaded.spec), true);
assert.match(loaded.specSha256, /^[a-f0-9]{64}$/);
assert.equal(loaded.spec.population.seedStart, 22200001);
assert.equal(loaded.spec.population.seedEnd, 22201024);
assert.equal(loaded.spec.stage2Reservation.seedStart, 22300001);
assert.equal(loaded.spec.stage2Reservation.seedEnd, 22302048);
assert.equal(loaded.spec.authorization.generationAuthorizedBySpecAlone, false);
assert.equal(loaded.spec.authorization.stage1GenerationAuthorized, false);

const authPath = path.resolve(
  __dirname,
  "../doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json",
);
if (fs.existsSync(authPath)) {
  const Common = require("../tools/experiments/lib/position-evaluation-calibration-common.js");
  assert.doesNotThrow(() => Common.loadAuthorization(loaded.spec, loaded.specSha256),
    "Any future Stage 1 authorization must be spec- and source-hash-bound");
}

console.log("Position evaluation calibration Stage 0 contract tests passed");
