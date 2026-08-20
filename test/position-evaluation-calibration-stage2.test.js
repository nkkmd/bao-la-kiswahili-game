"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Validator = require("../tools/experiments/validate-position-evaluation-calibration-stage2-spec.js");
const C = require("../tools/experiments/lib/position-evaluation-calibration-stage2-common.js");
const Eval = require("../tools/experiments/evaluate-position-evaluation-calibration-stage2.js");

const loaded = Validator.loadSpec();
assert.doesNotThrow(() => Validator.validateSpec(loaded.spec));
assert.equal(loaded.spec.population.seedEnd - loaded.spec.population.seedStart + 1, 2048);
assert.equal(loaded.spec.stage1Dependency.refitOnStage2Allowed, false);
assert.equal(loaded.spec.authorization.generationAuthorizedBySpecAlone, false);
assert.equal(loaded.spec.stage2GenerationAuthorized, false);
assert.equal(Eval.quantileFrozen([5, 1, 4, 2, 3], 0.05), 1);
assert.equal(Eval.quantileFrozen([5, 1, 4, 2, 3], 0.5), 3);
const aucRows = [
  { actorWin: 1, staticBaoEvaluation: 3 },
  { actorWin: 1, staticBaoEvaluation: 2 },
  { actorWin: 0, staticBaoEvaluation: 2 },
  { actorWin: 0, staticBaoEvaluation: 1 },
];
assert.equal(Eval.auc(aucRows), 0.875);
const authPath = path.resolve(__dirname, "../doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
if (fs.existsSync(authPath)) {
  assert.doesNotThrow(() => C.loadAuthorization(loaded.spec, loaded.specSha256),
    "Any future Stage 2 authorization must be spec- and source-hash-bound");
}
console.log("Position evaluation calibration Stage 2 contract tests passed");
