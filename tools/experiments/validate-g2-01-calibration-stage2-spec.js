#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const C = require("./lib/g2-01-calibration-stage2-common.js");

function main() {
  const { spec, specSha256 } = C.loadSpec();
  assert.equal(specSha256, "6ef20e20f639797c3d98673980e6e4b2c4c63a522e0c052ce523f6132a94ea60");
  assert.equal(spec.studyId, "PEOCR-STUDY1");
  assert.equal(spec.stageId, "PEOCR-S2-FORMAL-2026-08-26-v1");
  assert.equal(spec.stage2GenerationAuthorized, false);
  assert.equal(spec.scientificInferenceAuthorized, true);
  assert.equal(spec.population.games, 8192);
  assert.equal(spec.population.seedStart, 24020001);
  assert.equal(spec.population.seedEnd, 24028192);
  assert.equal(spec.population.seedEnd - spec.population.seedStart + 1, 8192);
  assert.deepEqual(spec.rawStateIdentity.fields, ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
  assert.equal(spec.rawStateIdentity.symmetryCanonicalizationAllowed, false);
  assert.deepEqual(spec.identityFirewall.forbiddenAcrossStage1Stage2, ["historicalTrajectoryHash", "openingPrefixHash", "rawStateKey"]);
  assert.equal(spec.identityFirewall.overlapAction, "exclude-without-replacement");
  assert.equal(spec.identityFirewall.seedExtensionAllowed, false);
  assert.equal(spec.frozenModel.refitOnStage2Allowed, false);
  assert.deepEqual(spec.frozenModel.formalPredictionClipping, { lower: 0.01, upper: 0.99 });
  assert.equal(spec.primaryFormalEvaluation.uncertainty.replicates, 20000);
  assert.equal(spec.primaryFormalEvaluation.successCriteriaAllRequired.pairedBrierSkillLower95GreaterThan, 0);
  assert.equal(spec.primaryFormalEvaluation.successCriteriaAllRequired.pairedLogLossSkillLower95GreaterThan, 0);
  assert.equal(spec.primaryFormalEvaluation.successCriteriaAllRequired.pooledModelBrierMaximum, 0.18);
  assert.equal(spec.primaryFormalEvaluation.successCriteriaAllRequired.namuaModelBrierMaximum, 0.25);
  assert.equal(spec.primaryFormalEvaluation.successCriteriaAllRequired.mtajiModelBrierMaximum, 0.12);
  assert.equal(spec.interpretationBoundary.priorStudyDecisionRevisionAuthorized, false);
  assert.equal(spec.interpretationBoundary.publicAiQualityClaimAuthorized, false);

  const frozen = C.loadFrozenMapping();
  assert.equal(frozen.result.stage1Decision, "MODEL-FROZEN-DEVELOPMENT");
  assert.equal(frozen.mappingSha256, "b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac");
  const universe = C.readJson(C.STAGE1_UNIVERSE_MANIFEST_PATH);
  assert.equal(universe.canonicalSerialization.sha256, "5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063");
  assert.equal(universe.referenceUniverse.historicalTrajectoryHash.uniqueCount, 1602);
  assert.equal(universe.referenceUniverse.openingPrefixHash.uniqueCount, 1604);
  assert.equal(universe.referenceUniverse.rawStateKey.uniqueCount, 76010);
  assert.equal(universe.scientificBoundary.stage2GenerationAuthorized, false);

  if (fs.existsSync(C.AUTH_PATH)) {
    const auth = C.readJson(C.AUTH_PATH);
    assert.equal(auth.stage2GenerationAuthorized, true);
  }
  console.log(JSON.stringify({ passed: true, studyId: spec.studyId, stageId: spec.stageId, specSha256 }, null, 2));
}

if (require.main === module) main();
