"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../public/engine.js");
const Production = require("../tools/engineering/run-pbai-p3-c010-predevelopment-support.js");
const Independent = require("../tools/engineering/verify-pbai-p3-c010-predevelopment-support-independent.js");

const ROOT = path.resolve(__dirname, "..");
const PROGRAM = "doc/ai-engineering/public-ai-improvement-program-3";
const SPEC = JSON.parse(fs.readFileSync(path.join(
  ROOT, PROGRAM, "candidates/PBAI-C010-v1-predevelopment-support-spec.json",
), "utf8"));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(
  ROOT, PROGRAM, "candidates/PBAI-C010-v1-predevelopment-support-run-manifest.json",
), "utf8"));

function sha256(relative) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relative))).digest("hex");
}

assert.equal(SPEC.specId, MANIFEST.supportSpecId);
assert.equal(SPEC.candidateVersion, "PBAI-C010-v1");
assert.equal(MANIFEST.status, "FROZEN-BEFORE-SUPPORT-OUTCOME");
assert.equal(MANIFEST.executionAuthorized, true);
assert.equal(MANIFEST.candidateCodeAllowed, false);
assert.equal(MANIFEST.candidateBenefitMetricsAllowed, false);
assert.equal(SPEC.authorization.candidateImplementationAuthorizedNow, false);
assert.equal(SPEC.authorization.developmentBenchmarkAuthorizedNow, false);
assert.equal(SPEC.authorization.validationSeedAccessAuthorizedNow, false);
assert.equal(SPEC.authorization.releaseHoldoutSeedAccessAuthorizedNow, false);
assert.ok(fs.existsSync(path.join(ROOT, MANIFEST.authorizationArtifact)));
for (const [relative, expected] of Object.entries(MANIFEST.sourceBindings)) {
  assert.equal(sha256(relative), expected, `${relative} remains bound to AI-GEN2 baseline`);
}

{
  const tinySpec = { sourcePopulation: { seedStart: 1, seedEnd: 4 } };
  const tinyManifest = {
    phaseAssignment: {
      salt: "pre-generation-fixture",
      assignedCounts: { namua: 2, mtaji: 2 },
    },
  };
  const assigned = Production.phaseAssignments(tinySpec, tinyManifest);
  assert.equal([...assigned.values()].filter((phase) => phase === "namua").length, 2);
  assert.equal([...assigned.values()].filter((phase) => phase === "mtaji").length, 2);
}

{
  const d2 = [["a", "b"], ["c"], ["d"]];
  const d3 = [["c"], ["a", "b"], ["d"]];
  assert.equal(Production.preorderChangeCount(d2, d3), 2);
  assert.equal(Independent.independentChangeCount(d2, d3, 4), 2);
  assert.deepEqual(Production.topThree(d3), ["c", "a", "b"]);
  assert.deepEqual(Independent.independentlyTopThree(d3), ["c", "a", "b"]);
  for (const [high, churn, expected] of [
    [true, true, "trigger"],
    [true, false, "high-width/no-churn"],
    [false, true, "low-or-equal-width/churn"],
    [false, false, "low-or-equal-width/no-churn"],
  ]) {
    assert.equal(Production.controlClass(high, churn), expected);
    assert.equal(Independent.independentControl(high, churn), expected);
  }
}

{
  const instrumented = Production.instrumentedAi();
  const measured = Production.fixedMeasurement(instrumented, E.initialState(), SPEC);
  assert.equal(measured.complete, true);
  assert.deepEqual(measured.completedDepths, [1, 2, 3]);
  assert.equal(measured.moveMatch, true);
  assert.equal(measured.rootScoreMatch, true);
  assert.equal(measured.statsMatch, true);
  assert.equal(measured.d2Groups.flat().length, E.moveVariants(E.initialState()).length);
  assert.equal(measured.d3Groups.flat().length, E.moveVariants(E.initialState()).length);
  const productionProbe = Production.boundedProbe(E.initialState(), measured.top3, 65536);
  const independentProbe = Independent.independentlyProbe(E.initialState(), measured.top3, 65536);
  assert.deepEqual(productionProbe, independentProbe);
}

console.log("PBAI-P3-D pre-generation support tooling tests passed");
