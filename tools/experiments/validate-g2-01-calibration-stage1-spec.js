#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
function sha256(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function ensure(ok, message) { if (!ok) throw new Error(message); }
function main() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  const s = JSON.parse(text);
  ensure(s.schemaVersion === 1, "schemaVersion");
  ensure(s.programLabel === "G2-01", "programLabel");
  ensure(s.researchGeneration === "Research Generation 2", "researchGeneration");
  ensure(s.studyId === "PEOCR-STUDY1", "studyId");
  ensure(s.stageId === "PEOCR-S1-DEVELOPMENT-2026-08-26-v1", "stageId");
  ensure(s.baselineMainHead === "9e9cb6e2525f09a873e741db9f8fa42696839fbe", "baselineMainHead");
  ensure(s.scientificInferenceAuthorized === false && s.stage1GenerationAuthorized === false, "authorization must be closed in spec");
  ensure(s.generation1Boundary?.upstreamStudyId === "PEC-STUDY1" && s.generation1Boundary?.upstreamFormalDecision === "INCONCLUSIVE", "upstream boundary");
  ensure(s.generation1Boundary?.decisionImmutable === true && s.generation1Boundary?.upstreamDataFormalReuseAllowed === false && s.generation1Boundary?.upstreamIsotonicMappingFormalReuseAllowed === false, "no rescue boundary");
  ensure(s.population?.games === 2048 && s.population?.seedStart === 24011001 && s.population?.seedEnd === 24013048, "population/seeds");
  ensure(s.population.seedEnd - s.population.seedStart + 1 === s.population.games, "seed count");
  ensure(s.population.opening?.policy === "seeded-uniform-exact-E.moveVariants" && s.population.opening?.plies === 8, "opening");
  const g = s.population.continuation;
  ensure(g.level === "hard" && g.evaluationProfile === "bao" && g.searchProfile === "phase2" && g.maxDepth === 2 && g.timeLimitMs === "Infinity", "continuation identity");
  ensure(g.quiescenceDepth === 1 && g.orderQuiescenceCaptures === false && g.adaptive === false && g.stableBestDepths === 0 && g.aspirationWindow === 0 && g.randomnessUsedForMoveChoiceAfterOpening === false, "continuation semantics");
  ensure(s.population.maxPly === 160, "maxPly");
  ensure(s.score?.definition === "AI.evaluate(state,state.player)" && s.score?.perspective === "actor-relative" && s.score?.transform === "z=staticBaoEvaluation/100", "score semantics");
  const raw = s.rawStateIdentity;
  ensure(JSON.stringify(raw.fields) === JSON.stringify(["pits","reserve","houseOwned","player","phase","winner","pending"]), "RAW identity fields");
  ensure(JSON.stringify(raw.excluded) === JSON.stringify(["turn","reason"]) && raw.symmetryCanonicalizationAllowed === false, "RAW exclusions");
  ensure(s.trajectoryIdentity?.primary === "historicalTrajectoryHash" && s.trajectoryIdentity?.duplicateHandling === "collapse-identical-trajectories" && s.trajectoryIdentity?.maximumSelectedStatesPerHistoricalTrajectory === 1, "trajectory identity");
  ensure(s.stateSelection?.minimumPly === 8 && s.stateSelection?.terminalIncluded === false, "selection minimum");
  ensure(s.stateSelection?.unavailableAssignedPhase === "no-replacement" && /no-replacement/.test(s.stateSelection?.duplicateSelectedRawStateHandling || ""), "selection no replacement");
  ensure(s.modelDevelopment?.primaryFamily === "phase-stratified-isotonic-PAVA" && s.modelDevelopment?.candidateFamilySelectionPerformed === false && s.modelDevelopment?.fitSeparatelyByPhase === true, "mapping family");
  ensure(s.modelDevelopment?.formalPredictionClipping?.lower === 0.01 && s.modelDevelopment?.formalPredictionClipping?.upper === 0.99 && s.modelDevelopment?.formalPredictionClipping?.appliedAfterPAVAFit === true && s.modelDevelopment?.formalPredictionClipping?.appliedToAllStage2FormalMetrics === true, "clipping");
  ensure(s.modelDevelopment?.refitOnStage2Allowed === false, "no Stage2 refit");
  const r = s.readinessGates;
  ensure(r.minimumUniqueHistoricalTrajectories === 1500 && r.minimumSelectedUniqueRawStates === 1400 && r.minimumNamuaSelectedStates === 600 && r.minimumMtajiSelectedStates === 600, "count gates");
  ensure(r.minimumDistinctStaticEvaluationsPerPhase === 100 && r.minimumActorWinsPerPhase === 150 && r.minimumActorLossesPerPhase === 150 && r.maximumAdministrativeTruncationRate === 0.01, "support gates");
  ensure(s.stage1Decision?.ifAllReadinessGatesPass === "MODEL-FROZEN-DEVELOPMENT" && s.stage1Decision?.ifAnyReadinessGateFails === "DEVELOPMENT-NOT-ESTIMABLE" && s.stage1Decision?.stage2AuthorizedByStage1ResultAlone === false, "decision tree");
  ensure(s.stopping?.gamesFixed === 2048 && s.stopping?.earlyStopAllowed === false && s.stopping?.seedExtensionAllowed === false && s.stopping?.outcomeDependentExtensionAllowed === false && s.stopping?.replacementAllowed === false, "stopping");
  ensure(s.interpretationBoundary?.stage1FormalCalibrationClaimAuthorized === false && s.interpretationBoundary?.gameTheoreticValueClaimAuthorized === false && s.interpretationBoundary?.humanClaimAuthorized === false && s.interpretationBoundary?.causalClaimAuthorized === false && s.interpretationBoundary?.priorStudyDecisionRevisionAuthorized === false && s.interpretationBoundary?.publicAiQualityClaimAuthorized === false, "interpretation boundary");
  console.log(JSON.stringify({ passed: true, studyId: s.studyId, stageId: s.stageId, specSha256: sha256(text) }, null, 2));
}
try { main(); } catch (e) { console.error(e.stack || e.message); process.exitCode = 1; }
