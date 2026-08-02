"use strict";

const assert = require("node:assert/strict");
const E019 = require("../tools/experiments/lib/phase-transition-search-profile-generalization.js");
const Evaluator = require("../tools/experiments/evaluate-phase-transition-search-profile-generalization.js");
const Runner = require("../tools/experiments/run-phase-transition-search-profile-generalization.js");

const loaded = E019.loadPreregistration(
  "config/experiments/phase-transition-search-profile-generalization-v2.json",
);
assert.equal(loaded.config.experimentId, "E-019");
assert.equal(loaded.config.hypothesisId, "H17");
assert.deepEqual(loaded.config.corpus.strata.map((row) => row.stratumId), ["D1", "D3", "V2"]);
assert.equal(E019.stratumById(loaded.config, "D1").pairedSeeds, 6500);
assert.equal(E019.stratumById(loaded.config, "D3").pairedSeeds, 4500);
assert.equal(E019.stratumById(loaded.config, "V2").pairedSeeds, 2000);
assert.equal(E019.conditionById(loaded.config, "D3-P2").searchProfile, "phase2");
assert.equal(E019.conditionById(loaded.config, "V2-LG").searchProfile, "legacy");
assert.equal(loaded.config.executionPolicy.formalExecutionApproved, false);
assert.equal(loaded.config.executionPolicy.githubActionsFormalRunAllowed, false);
assert.equal(loaded.config.structuralSecondaryEndpoint.status, "preregistered-secondary-only");
assert.equal(E019.fixtureRangeAllowed(loaded.config, 20267101, 3), true);
assert.equal(E019.fixtureRangeAllowed(loaded.config, 20268001, 3), false);
assert.equal(E019.fixtureRangeAllowed(loaded.config, 20265001, 3), false);
assert.throws(() => Runner.parseArgs([]), /fixture-only/);

const d1 = Runner.normalizeCondition(loaded.config, "D1-P2");
assert.equal(d1.evaluationProfile, "bao");
assert.equal(d1.maxDepth, 1);
assert.equal(d1.searchProfile, "phase2");
const v2 = Runner.normalizeCondition(loaded.config, "V2-LG");
assert.equal(v2.evaluationProfile, "bao-v2");
assert.equal(v2.maxDepth, 2);
assert.equal(v2.searchProfile, "legacy");

const synthetic = JSON.parse(JSON.stringify(loaded.config));
for (const stratum of synthetic.corpus.strata) stratum.pairedSeeds = 20;

function pairs(seedBase, n10, n01, n11 = 0) {
  const rows = [];
  let index = 0;
  for (let i = 0; i < n10; i += 1) rows.push({ seed: seedBase + index++, P2: true, LG: false });
  for (let i = 0; i < n01; i += 1) rows.push({ seed: seedBase + index++, P2: false, LG: true });
  for (let i = 0; i < n11; i += 1) rows.push({ seed: seedBase + index++, P2: true, LG: true });
  while (rows.length < 20) rows.push({ seed: seedBase + index++, P2: false, LG: false });
  return rows;
}

const allPass = Evaluator.evaluate(synthetic, {
  D1: pairs(1000, 18, 2),
  D3: pairs(2000, 18, 2),
  V2: pairs(3000, 18, 2),
});
assert.equal(allPass.globalDecision, "confirmed");
for (const id of ["D1", "D3", "V2"]) {
  assert.equal(allPass.strata[id].decision, "pass");
  assert.equal(allPass.strata[id].discordantPairs, 20);
  assert.equal(allPass.strata[id].standaloneHolmConfirmed, true);
}

const oneFail = Evaluator.evaluate(synthetic, {
  D1: pairs(4000, 18, 2),
  D3: pairs(5000, 11, 9),
  V2: pairs(6000, 18, 2),
});
assert.equal(oneFail.strata.D3.decision, "fail");
assert.equal(oneFail.globalDecision, "not-confirmed");

const oneInsufficient = Evaluator.evaluate(synthetic, {
  D1: pairs(7000, 18, 2),
  D3: pairs(8000, 7, 3),
  V2: pairs(9000, 18, 2),
});
assert.equal(oneInsufficient.strata.D3.decision, "insufficient");
assert.equal(oneInsufficient.globalDecision, "inconclusive");

const holm = Evaluator.holmAdjusted({ A: 0.01, B: 0.03, C: 0.04 });
assert.ok(Math.abs(holm.A - 0.03) < 1e-12);
assert.ok(Math.abs(holm.B - 0.06) < 1e-12);
assert.ok(Math.abs(holm.C - 0.06) < 1e-12);

const openingGame = {
  openingPliesApplied: 2,
  initialStateHash: "initial",
  moves: [{ afterStateHash: "opening-1" }, { afterStateHash: "opening-2" }],
};
assert.equal(Runner.openingBoundaryHash(openingGame), "opening-2");

console.log("phase transition search profile generalization tests passed");
