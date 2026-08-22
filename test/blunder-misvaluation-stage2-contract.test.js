"use strict";

const assert = require("node:assert/strict");
const Validator = require("../tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js");

function testStage2FormalContract() {
  const result = Validator.validate();
  assert.equal(result.passed, true);
  assert.equal(result.stageId, "BMP-S2-FORMAL-2026-08-22-v1");
  assert.equal(result.candidateDefinitionSha256,
    "12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b");
  assert.equal(result.specSha256,
    "4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab");
  assert.equal(result.formalCandidates.length, 4);
  assert.equal(result.population.games, 4096);
  assert.equal(result.population.seedStart, 22500001);
  assert.equal(result.population.seedEnd, 22504096);
  assert.equal(result.population.strata.reduce((sum, row) => sum + row.expectedGames, 0), 4096);
  assert.equal(result.plannedCoPrimaryTests, 8);
  assert.equal(result.multiplicity, "Holm-Bonferroni");
  assert.equal(result.independentMeasurementVerificationRequired, true);
  assert.equal(result.generationAuthorized, false);
}

testStage2FormalContract();
console.log("blunder-misvaluation-stage2-contract.test.js: PASS");