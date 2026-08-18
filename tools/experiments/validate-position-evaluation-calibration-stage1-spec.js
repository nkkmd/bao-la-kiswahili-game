"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_SPEC_PATH = path.join(
  ROOT,
  "doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function loadSpec(file = DEFAULT_SPEC_PATH) {
  const text = fs.readFileSync(file, "utf8");
  return { spec: JSON.parse(text), text, specSha256: sha256(text), path: file };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateSpec(spec) {
  assert(spec?.schemaVersion === 1, "schemaVersion must be 1");
  assert(spec.studyId === "PEC-STUDY1", "unexpected studyId");
  assert(spec.stageId === "PEC-S1-EXPLORATORY-2026-08-18-v1", "unexpected stageId");
  assert(spec.scientificInferenceAuthorized === false, "Stage 1 must remain exploratory");
  assert(spec.confirmatoryReuseAllowed === false, "Stage 1 confirmation reuse must be false");

  const p = spec.population;
  assert(Number.isInteger(p.games) && p.games > 0, "invalid population.games");
  assert(Number.isInteger(p.seedStart) && Number.isInteger(p.seedEnd), "invalid seed range");
  assert(p.seedEnd - p.seedStart + 1 === p.games, "Stage 1 seed range must exactly equal games");
  assert(p.opening?.policy === "seeded-uniform-exact-E.moveVariants", "unexpected opening policy");
  assert(p.opening?.plies === 8, "opening plies must be 8");
  assert(p.continuation?.level === "hard", "continuation level must be hard");
  assert(p.continuation?.evaluationProfile === "bao", "continuation evaluator must be bao");
  assert(p.continuation?.searchProfile === "phase2", "continuation search must be phase2");
  assert(p.continuation?.maxDepth === 2, "continuation depth must be 2");
  assert(p.continuation?.timeLimitMs === "Infinity", "time limit must be Infinity");
  assert(p.continuation?.randomnessUsedForMoveChoiceAfterOpening === false,
    "hard continuation must be declared deterministic");
  assert(Number.isInteger(p.maxPly) && p.maxPly >= 100, "maxPly too small");

  const s = spec.stateSelection;
  assert(s.maximumSelectedStatesPerHistoricalTrajectory === 1,
    "maximum one selected state per trajectory is required");
  assert(s.unavailableAssignedPhase === "no-replacement", "assigned-phase replacement is prohibited");
  assert(s.duplicateSelectedRuleStateHandling.includes("no-replacement"),
    "duplicate rule-state handling must prohibit replacement");

  assert(spec.measurement?.primary?.function === "AI.evaluate(state, actor)",
    "primary evaluator mismatch");
  assert(spec.measurement?.keySecondary?.searchSemantics
    === "exact-full-window-root-candidates/phase2-value-semantics/v1",
  "D2 search semantics mismatch");

  const model = spec.modelDevelopment;
  assert(model?.folds?.count === 5, "Stage 1 CV must use five folds");
  assert(Array.isArray(model.candidateFamilies) && model.candidateFamilies.length === 2,
    "exactly two candidate model families are required");
  assert(model.candidateFamilies.map((item) => item.id).join("|")
    === "phase-aware-logistic|phase-stratified-isotonic",
  "candidate family order/identity mismatch");
  assert(model.selectionMetric === "five-fold-out-of-fold-Brier-score",
    "Stage 1 selection metric must be Brier score");

  const stop = spec.stopping;
  assert(stop.gamesFixed === p.games, "fixed stopping count mismatch");
  for (const field of [
    "earlyStopAllowed",
    "outcomeDependentExtensionAllowed",
    "seedExtensionAllowed",
    "replacementForUnavailableAssignedPhase",
    "replacementForDuplicateRuleState",
    "extensionForAdministrativeTruncation",
  ]) assert(stop[field] === false, `${field} must be false`);

  const auth = spec.authorization;
  assert(auth?.generationAuthorizedBySpecAlone === false, "spec-alone authorization must be false");
  assert(auth?.stage1GenerationAuthorized === false, "Stage 1 spec must not self-authorize generation");
  assert(typeof auth.requiredAuthorizationFile === "string", "authorization file path missing");

  const s2 = spec.stage2Reservation;
  assert(Number.isInteger(s2.seedStart) && Number.isInteger(s2.seedEnd), "invalid Stage 2 seed reservation");
  assert(s2.seedEnd - s2.seedStart + 1 === s2.gamesReserved,
    "Stage 2 reserved seed range must exactly equal reserved games");
  assert(p.seedEnd < s2.seedStart || s2.seedEnd < p.seedStart,
    "Stage 1 and Stage 2 seed reservations overlap");
  assert(s2.scientificGenerationAuthorized === false, "Stage 2 must not be authorized");

  assert(Array.isArray(spec.sourceFreeze?.files) && spec.sourceFreeze.files.length >= 10,
    "source freeze file list is incomplete");
  assert(new Set(spec.sourceFreeze.files).size === spec.sourceFreeze.files.length,
    "source freeze file list contains duplicates");
  return true;
}

function main() {
  const file = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SPEC_PATH;
  const loaded = loadSpec(file);
  validateSpec(loaded.spec);
  console.log(JSON.stringify({
    passed: true,
    stageId: loaded.spec.stageId,
    specSha256: loaded.specSha256,
    stage1Seeds: [loaded.spec.population.seedStart, loaded.spec.population.seedEnd],
    stage2ReservedSeeds: [
      loaded.spec.stage2Reservation.seedStart,
      loaded.spec.stage2Reservation.seedEnd,
    ],
    generationAuthorizedBySpecAlone: loaded.spec.authorization.generationAuthorizedBySpecAlone,
  }, null, 2));
}

if (require.main === module) main();

module.exports = { DEFAULT_SPEC_PATH, loadSpec, sha256, validateSpec };
