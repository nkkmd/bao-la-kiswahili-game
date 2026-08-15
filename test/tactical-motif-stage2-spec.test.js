"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { validate } = require("../tools/experiments/validate-tactical-motif-stage2-formal-spec.js");

test("Stage 2 tactical-motif formal spec is prospectively frozen and internally consistent", () => {
  const result = validate();
  assert.equal(result.passed, true);
  assert.equal(result.stageId, "TM-S2-FORMAL-2026-08-14-v1");
  assert.equal(result.formalCandidates.length, 4);
  assert.equal(result.population.games, 3072);
  assert.equal(result.population.seedStart, 22000001);
  assert.equal(result.population.seedEnd, 22003072);
  assert.equal(result.population.strata.length, 6);
  assert.ok(result.population.strata.every((stratum) => stratum.expectedGames === 512));
  assert.equal(result.coPrimaryTests, 8);
  assert.equal(result.multiplicity, "Holm-Bonferroni");
  assert.equal(result.generationAuthorized, false);
});
