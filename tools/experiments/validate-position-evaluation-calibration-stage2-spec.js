#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json");
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function assert(condition, message) { if (!condition) throw new Error(message); }
function loadSpec(file = SPEC_PATH) {
  const text = fs.readFileSync(file, "utf8");
  return { spec: JSON.parse(text), specSha256: sha256(text) };
}
function validateSpec(spec) {
  assert(spec.schemaVersion === 1, "schemaVersion");
  assert(spec.studyId === "PEC-STUDY1", "studyId");
  assert(spec.stageId === "PEC-S2-FORMAL-2026-08-20-v1", "stageId");
  assert(spec.status === "prospective-frozen-pending-technical-validation", "status");
  assert(spec.scientificInferenceAuthorized === true, "Stage 2 formal inference role must be true");
  assert(spec.stage2GenerationAuthorized === false, "spec alone must not authorize generation");
  assert(spec.stage1Dependency.stage1ResultSha256 === "136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449", "Stage 1 result hash");
  assert(spec.stage1Dependency.stage1MeasurementHash === "0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa", "Stage 1 measurement hash");
  assert(spec.stage1Dependency.selectedFamily === "phase-stratified-isotonic", "selected model family");
  assert(spec.stage1Dependency.refitOnStage2Allowed === false, "Stage 2 refit forbidden");
  assert(spec.population.games === 2048, "games");
  assert(spec.population.seedStart === 22300001 && spec.population.seedEnd === 22302048, "seed range");
  assert(spec.population.seedEnd - spec.population.seedStart + 1 === spec.population.games, "seed count");
  assert(spec.population.opening.plies === 8, "opening plies");
  assert(spec.population.continuation.level === "hard", "continuation level");
  assert(spec.population.continuation.evaluationProfile === "bao", "evaluation profile");
  assert(spec.population.continuation.searchProfile === "phase2", "search profile");
  assert(spec.population.continuation.maxDepth === 2, "depth");
  assert(spec.population.maxPly === 160, "maxPly");
  assert(spec.identityFirewall.overlapAction === "exclude-without-replacement", "identity overlap action");
  assert(spec.identityFirewall.outcomeDependentReplacementAllowed === false, "no replacement");
  assert(spec.stateSelection.phaseAssignment.salt === "PEC-S2-PHASE-v1", "phase salt");
  assert(spec.stateSelection.withinAssignedPhase.salt === "PEC-S2-STATE-v1", "state salt");
  assert(spec.readinessGates.minimumUniqueHistoricalTrajectoriesAfterStage1TrajectoryFirewall === 1600, "trajectory readiness");
  assert(spec.readinessGates.minimumSelectedUniqueRuleStates === 1500, "state readiness");
  assert(spec.readinessGates.minimumNamuaSelectedStates === 650 && spec.readinessGates.minimumMtajiSelectedStates === 650, "phase readiness");
  assert(spec.primaryFormalEvaluation.modelMetric === "Brier score", "primary metric");
  assert(spec.primaryFormalEvaluation.referencePrediction.namua === 0.4418604651162791, "Namua reference");
  assert(spec.primaryFormalEvaluation.referencePrediction.mtaji === 0.5, "Mtaji reference");
  assert(spec.primaryFormalEvaluation.uncertainty.replicates === 10000, "bootstrap replicates");
  assert(spec.primaryFormalEvaluation.uncertainty.lowerQuantile === 0.05, "bootstrap lower quantile");
  const c = spec.primaryFormalEvaluation.successCriteriaAllRequired;
  assert(c.pairedSkillLower95GreaterThan === 0, "skill criterion");
  assert(c.pooledModelBrierMaximum === 0.18, "pooled Brier cap");
  assert(c.namuaModelBrierMaximum === 0.25, "Namua Brier cap");
  assert(c.mtajiModelBrierMaximum === 0.12, "Mtaji Brier cap");
  assert(spec.stopping.gamesFixed === 2048 && spec.stopping.seedExtensionAllowed === false, "stopping");
  assert(spec.authorization.generationAuthorizedBySpecAlone === false, "authorization firewall");
  assert(spec.authorization.stage2GenerationAuthorized === false, "generation blocked in spec");
  assert(Array.isArray(spec.sourceFreeze?.files) && spec.sourceFreeze.files.length >= 10, "source freeze files");
  return true;
}
function main() {
  const loaded = loadSpec();
  validateSpec(loaded.spec);
  console.log(JSON.stringify({
    passed: true,
    studyId: loaded.spec.studyId,
    stageId: loaded.spec.stageId,
    status: loaded.spec.status,
    specSha256: loaded.specSha256,
    games: loaded.spec.population.games,
    seedStart: loaded.spec.population.seedStart,
    seedEnd: loaded.spec.population.seedEnd,
    selectedFamily: loaded.spec.stage1Dependency.selectedFamily,
    stage2GenerationAuthorized: loaded.spec.stage2GenerationAuthorized,
    generationAuthorizedBySpecAlone: loaded.spec.authorization.generationAuthorizedBySpecAlone,
  }, null, 2));
}
if (require.main === module) main();
module.exports = { loadSpec, validateSpec };
