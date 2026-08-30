#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STUDY_CONTRACT.json"), "utf8"));
const SOURCE = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_0_SOURCE_PREFLIGHT_SPEC.json"), "utf8"));
const BOUNDARY = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json"), "utf8"));
const UPSTREAM = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json"), "utf8"));

function assert(condition, message) { if (!condition) throw new Error(message); }
function rangeCount(start, end) { return end - start + 1; }
function nonOverlap(a0, a1, b0, b1) { return a1 < b0 || b1 < a0; }

assert(STUDY.studyId === "TMGC-STUDY1", "Study ID mismatch");
assert(BOUNDARY.stage1Id === "TMGC-S1-DEVELOPMENT-2026-08-30-v1", "Stage 1 ID mismatch");
assert(BOUNDARY.stage2Id === "TMGC-S2-FORMAL-2026-08-30-v1", "Stage 2 ID mismatch");
assert(BOUNDARY.stage1ScientificGenerationAuthorized === false, "Stage 1 unexpectedly authorized");
assert(BOUNDARY.stage2ScientificGenerationAuthorized === false, "Stage 2 unexpectedly authorized");

const s1 = BOUNDARY.sourcePopulation.stage1;
const s2 = BOUNDARY.sourcePopulation.stage2;
assert(rangeCount(s1.seedStart, s1.seedEnd) === s1.games, "Stage 1 seed range/count mismatch");
assert(rangeCount(s2.seedStart, s2.seedEnd) === s2.games, "Stage 2 seed range/count mismatch");
assert(nonOverlap(s1.seedStart, s1.seedEnd, s2.seedStart, s2.seedEnd), "Stage 1/2 seed overlap");
assert(nonOverlap(SOURCE.technicalPopulation.seedStart, SOURCE.technicalPopulation.seedEnd, s1.seedStart, s1.seedEnd), "Technical/Stage1 seed overlap");
assert(nonOverlap(SOURCE.technicalPopulation.seedStart, SOURCE.technicalPopulation.seedEnd, s2.seedStart, s2.seedEnd), "Technical/Stage2 seed overlap");
assert(nonOverlap(29010001, 29018192, s1.seedStart, s1.seedEnd), "G2-08 reserved Stage2 / TMGC Stage1 overlap");
assert(nonOverlap(29010001, 29018192, s2.seedStart, s2.seedEnd), "G2-08 reserved Stage2 / TMGC Stage2 overlap");

const strata = BOUNDARY.sourcePopulation.strata;
assert(strata.length === 8, "Expected exactly 8 source strata");
assert(new Set(strata.map((x) => x.id)).size === 8, "Duplicate source stratum ID");
assert(s1.games % strata.length === 0 && s1.games / strata.length === s1.gamesPerStratum, "Stage1 stratum allocation mismatch");
assert(s2.games % strata.length === 0 && s2.games / strata.length === s2.gamesPerStratum, "Stage2 stratum allocation mismatch");
assert(JSON.stringify(SOURCE.technicalPopulation.strata) === JSON.stringify(strata), "Source preflight strata differ from scientific contract");
assert(SOURCE.sourceContractForFutureScientificStages.stage1Games === s1.games, "Source preflight Stage1 game count mismatch");
assert(SOURCE.sourceContractForFutureScientificStages.stage2Games === s2.games, "Source preflight Stage2 game count mismatch");
assert(SOURCE.sourceContractForFutureScientificStages.scientificShardGames === s1.shardGames, "Stage1 shard mismatch");
assert(s1.shardGames === s2.shardGames, "Stage1/2 shard size mismatch");

assert(BOUNDARY.phaseBoundary.c03ExactPhase === "mtaji", "C03 exact phase drift");
assert(BOUNDARY.phaseBoundary.namuaDisposition === "TECHNICALLY-INELIGIBLE-FOR-C03-EXACT", "Namua phase boundary drift");
assert(BOUNDARY.phaseBoundary.namuaIsScientificCounterexample === false, "Namua incorrectly authorized as counterexample");
assert(BOUNDARY.phaseBoundary.newPhaseTransportConstructAuthorized === false, "New phase transport construct unexpectedly authorized");
assert(UPSTREAM.candidate.phase === "mtaji" && UPSTREAM.candidate.consequence === "actorNyumbaSeedsDeltaSign=0", "Upstream C03 reference drift");

const rawIncluded = ["pits","reserve","houseOwned","player","phase","winner","pending"];
const rawExcluded = ["turn","reason"];
assert(JSON.stringify(BOUNDARY.identityAndSelection.rawStateIncluded) === JSON.stringify(rawIncluded), "RAW included fields drift");
assert(JSON.stringify(BOUNDARY.identityAndSelection.rawStateExcluded) === JSON.stringify(rawExcluded), "RAW excluded fields drift");
assert(BOUNDARY.identityAndSelection.symmetryReduction === false, "Symmetry reduction unexpectedly enabled");
assert(BOUNDARY.identityAndSelection.canonicalization === false, "Canonicalization unexpectedly enabled");

for (const [key, value] of Object.entries(BOUNDARY.stage1ToStage2Firewall)) {
  if (key.endsWith("Reusable") || key.endsWith("Allowed")) assert(value === false, `Firewall weakened: ${key}`);
}
assert(BOUNDARY.stage1ToStage2Firewall.stage2OverlapHandling === "exclude-overlap-no-replacement", "Overlap policy drift");

const axisIds = BOUNDARY.prospectiveBoundaryAxes.map((x) => x.id);
assert(new Set(axisIds).size === axisIds.length, "Duplicate prospective axis ID");
for (const axis of BOUNDARY.prospectiveBoundaryAxes) {
  assert(Array.isArray(axis.levels) && axis.levels.length >= 2, `Axis ${axis.id} missing frozen levels`);
  assert(new Set(axis.levels).size === axis.levels.length, `Axis ${axis.id} has duplicate levels`);
}
assert(BOUNDARY.cellConstruction.rule.includes("marginal cells only"), "Marginal-only cell rule missing");
assert(BOUNDARY.cellConstruction.manualCellDroppingAllowed === false, "Manual cell dropping unexpectedly allowed");

assert(BOUNDARY.multiplicity.method === "Holm-Bonferroni", "Multiplicity method drift");
assert(BOUNDARY.multiplicity.alpha === 0.05, "Multiplicity alpha drift");
assert(BOUNDARY.multiplicity.manualTestDroppingAllowed === false, "Manual formal-test dropping unexpectedly allowed");

for (const [key, value] of Object.entries(BOUNDARY.noRescue)) assert(value === false, `No-rescue prohibition weakened: ${key}`);

const requiredDecisionTokens = [
  "VALIDATED-WITHIN-FROZEN-GENERALIZATION-DOMAIN",
  "COUNTEREXAMPLE-BOUNDARY-VALIDATED",
  "MIXED-BOUNDARY-VALIDATED",
  "NOT-GENERALIZED",
  "NON-ESTIMABLE",
  "TECHNICAL-INVALID",
  "RESOURCE-CENSORED",
  "NOT-AUTHORIZED-NOT-EXECUTED"
];
assert(JSON.stringify(Object.keys(BOUNDARY.studyDecisionRule)) === JSON.stringify(requiredDecisionTokens), "Study decision vocabulary drift");

const result = {
  schemaVersion: "TMGC_STAGE0_CONTRACT_VALIDATION_RESULT_V1",
  studyId: STUDY.studyId,
  stageId: "TMGC-S0-TECHNICAL-2026-08-30-v1",
  scientificInferenceAuthorized: false,
  scientificSeedUseAllowed: false,
  passed: true,
  checks: {
    studyAndStageIdentity: true,
    seedRangesAndNonOverlap: true,
    sourceStrataAndShardConsistency: true,
    phaseBoundary: true,
    rawIdentityBoundary: true,
    stage1Stage2Firewall: true,
    prospectiveAxes: true,
    multiplicity: true,
    noRescue: true,
    decisionVocabulary: true
  }
};
console.log(JSON.stringify(result, null, 2));
