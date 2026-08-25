#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXPLORATORY_SPEC.json");
const FEATURE_PATH = path.join(ROOT, "doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_FEATURE_DEFINITIONS.json");
const AUTH_PATH = path.join(ROOT, "doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json");

function sha256(text) { return crypto.createHash("sha256").update(text).digest("hex"); }
function load(file) { const text = fs.readFileSync(file, "utf8"); return { text, value: JSON.parse(text), sha256: sha256(text) }; }
function ensure(ok, message) { if (!ok) throw new Error(message); }

function validate(spec, features) {
  ensure(spec.schemaVersion === 1 && spec.studyId === "PCEM-STUDY1", "invalid study identity");
  ensure(spec.stageId === "PCEM-S1-EXPLORATORY-2026-08-25-v1", "invalid stage id");
  ensure(spec.status === "prospective-frozen-not-authorized", "stage spec status must remain not authorized");
  ensure(spec.scientificInferenceAuthorized === false && spec.exploratoryAnalysisAuthorized === true && spec.confirmatoryReuseAllowed === false, "invalid inference flags");
  ensure(spec.baseMainHead === "587472b7e1a3f6e390cdfea6ed0d8e0971d5711d", "baseline mismatch");
  ensure(JSON.stringify(spec.representation.identityFields) === JSON.stringify(["pits","reserve","houseOwned","player","phase","winner","pending"]), "raw identity mismatch");
  ensure(spec.representation.pendingRequiredBeforeEngineEntry === true && spec.representation.representedSeedTotal === 64, "representation firewall weakened");
  ensure(spec.representation.symmetryReduction === false && spec.representation.canonicalization === false, "symmetry/canonicalization forbidden");
  ensure(spec.population.games === 3072 && spec.population.seedStart === 23200001 && spec.population.seedEnd === 23203072, "Stage 1 seed block mismatch");
  ensure(spec.population.seedEnd - spec.population.seedStart + 1 === spec.population.games, "seed count mismatch");
  ensure(spec.population.conditionAssignment.strata.length === 6, "expected six source strata");
  ensure(spec.rootSelection.referenceDisadvantage.depth === 3 && spec.rootSelection.referenceDisadvantage.criterion === "bestScore < 0", "root disadvantage changed");
  ensure(spec.rootSelection.phaseQuota.namua === 150 && spec.rootSelection.phaseQuota.mtaji === 150, "phase quota mismatch");
  ensure(spec.referenceComparator.depth === 3 && spec.referenceComparator.strictReferenceInferior === "moveOptimalityGap > 0", "reference comparator changed");
  ensure(spec.continuation.rootActorPolicy === "P_REFERENCE_D2_BEST", "root actor policy changed");
  ensure(spec.continuation.primaryOpponentPolicy.id === "P_MEDIUM_D1_TOP3" && spec.continuation.primaryOpponentPolicy.replicatesPerExactRootMove === 12, "primary opponent policy changed");
  ensure(spec.continuation.secondaryOpponentPolicy.id === "P_SHALLOW_UNIFORM" && spec.continuation.secondaryOpponentPolicy.replicatesPerExactRootMove === 4, "secondary policy changed");
  ensure(spec.continuation.referenceOpponentPolicy.id === "P_REFERENCE_D2_BEST" && spec.continuation.referenceOpponentPolicy.replicatesPerExactRootMove === 1, "reference opponent policy changed");
  ensure(spec.continuation.maximumPostRootPlies === 96, "comeback horizon changed");
  ensure(spec.moveAnalysisEligibility.strictReferenceInferiorRequired === true && spec.moveAnalysisEligibility.referenceDefenseMaintainedCountMinimum === 1 && spec.moveAnalysisEligibility.referenceDefenseMaintainedFractionMaximum === 0.5, "move eligibility changed");
  ensure(spec.candidateFeatureUniverse.templates.length === 8 && spec.candidateFeatureUniverse.maximumTokensIncludingPhase === 4, "candidate universe changed");
  ensure(spec.promotion.zeroPromotedCandidatesAllowed === true && spec.promotion.manualPromotionAllowed === false && spec.promotion.maximumPromotedCandidates === 4, "promotion firewall changed");
  ensure(spec.readinessGates.requiredSelectedUniqueRawStates === 300 && spec.readinessGates.requiredNamuaSelectedRoots === 150 && spec.readinessGates.requiredMtajiSelectedRoots === 150, "readiness roots changed");
  ensure(spec.readinessGates.seedExtensionAllowed === false && spec.readinessGates.replacementAllowed === false, "rescue forbidden");
  ensure(spec.stage2Reservation.seedStart === 23300001 && spec.stage2Reservation.seedEnd === 23306144 && spec.stage2Reservation.stage1MayConsume === false, "Stage 2 reservation changed");
  ensure(spec.population.seedEnd < spec.stage2Reservation.seedStart, "Stage 1/2 seed overlap");
  ensure(features.schemaVersion === 1 && features.studyId === spec.studyId && features.stageId === spec.stageId, "feature definition binding mismatch");
  ensure(features.rawIdentityOnly === true && features.symmetryFeaturesUsed === false, "feature representation firewall changed");
  ensure(Object.keys(features.definitions).length >= 8, "feature definitions incomplete");
  return true;
}

function loadValidated() {
  const spec = load(SPEC_PATH); const features = load(FEATURE_PATH);
  validate(spec.value, features.value);
  return { spec: spec.value, specSha256: spec.sha256, featureDefinitions: features.value, featureSha256: features.sha256 };
}

if (require.main === module) {
  const loaded = loadValidated();
  process.stdout.write(`${JSON.stringify({ passed:true, stageId:loaded.spec.stageId, specSha256:loaded.specSha256, featureSha256:loaded.featureSha256, authorizationExists:fs.existsSync(AUTH_PATH) }, null, 2)}\n`);
}

module.exports = { ROOT, SPEC_PATH, FEATURE_PATH, AUTH_PATH, loadValidated, sha256, validate };
