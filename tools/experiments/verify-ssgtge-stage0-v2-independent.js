#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const engine = require("../../public/engine.js");
const drsseIndependent = require("./lib/drsse-independent.js");
const ind = require("./lib/ssgtge-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "artifacts/local/state-space-game-tree-growth-estimation/stage0-technical-v2");
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/state-space-game-tree-growth-estimation/preregistration/STAGE_0_V2_TECHNICAL_SPEC.json"), "utf8"));
const DRSSE_RESULT = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json"), "utf8"));

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function expectFailure(label, fn) {
  let failed = false;
  try { fn(); } catch (_) { failed = true; }
  ensure(failed, `negative control not detected: ${label}`);
  return true;
}

function nearlyEqual(a, b, tolerance) {
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

function main() {
  const production = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "stage0-v2-production-result.json"), "utf8"));
  ensure(production.studyId === "SSGTGE-STUDY1" && production.stageId === SPEC.stageId, "production identity mismatch");
  ensure(production.correctiveVersionOf === "SSGTGE-S0-TECHNICAL-2026-08-30-v1", "corrective lineage mismatch");
  ensure(production.freshHoldoutOutcomeGenerated === false, "fresh holdout leakage detected");
  ensure(production.realDevelopmentCandidateEvaluationPerformed === false, "Stage 0 v2 development evaluation leakage detected");

  const enumDir = path.join(OUT_DIR, "depth2-enumeration-fixture");
  const enumCore = JSON.parse(fs.readFileSync(path.join(enumDir, "result-core.json"), "utf8"));
  const materialized = drsseIndependent.verifyMaterialized({ engine, outDir: enumDir, productionCore: enumCore });
  const agreement = drsseIndependent.verifyIndependentAgreement({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    profile: SPEC.technicalEnumerationResourceProfile,
    productionCore: enumCore
  });
  ensure(materialized.passed === true && agreement.passed === true, "independent depth-2 enumeration verification failed");

  const developmentSource = ind.inspectDevelopmentSource(DRSSE_RESULT);
  ensure(developmentSource.sourceSummarySha256 === production.developmentSourcePlumbing.sourceSummarySha256, "development source summary mismatch");
  ensure(developmentSource.maximumDepthRead === 9 && developmentSource.freshHoldoutRead === false, "development source firewall failure");
  ensure(developmentSource.candidateEvaluationPerformed === false, "real-data candidate evaluation leakage detected");

  const synthetic = ind.syntheticChecks();
  const tolerance = Number(SPEC.crossImplementationRelativeTolerance);
  ensure(synthetic.checks.length === production.syntheticEstimatorChecks.checks.length, "synthetic check count mismatch");
  for (let i = 0; i < synthetic.checks.length; i += 1) {
    const a = synthetic.checks[i];
    const b = production.syntheticEstimatorChecks.checks[i];
    ensure(a.fixture === b.fixture && a.candidateId === b.candidateId, "synthetic fixture identity mismatch");
    ensure(nearlyEqual(a.prediction, b.prediction, tolerance), `synthetic prediction mismatch: ${a.fixture}`);
    ensure(a.absoluteLogError < 1e-10, `independent synthetic fixture error too large: ${a.fixture}`);
  }

  const limits = SPEC.formalResourceCeilingsReference;
  const snapshot = {
    cumulativeRawStates: 1,
    depthLabelledEdges: 1,
    parentExpansions: 1,
    moveEvaluations: 1,
    cumulativeTreeNodeOccurrences: 1,
    residentSetBytes: 1,
    artifactBytes: 1,
    wallClockSeconds: 1
  };
  ensure(ind.resourceDisposition(snapshot, limits).stopped === false, "independent resource no-stop failed");
  ensure(ind.resourceDisposition({ ...snapshot, cumulativeRawStates: Number(limits.maximumCumulativeDistinctRawStates) + 1 }, limits).classification === "RESOURCE-LIMIT", "independent resource-limit mapping failed");
  ensure(ind.resourceDisposition({ ...snapshot, wallClockSeconds: Number(limits.maximumWallClockSeconds) + 1 }, limits).classification === "ADMIN-CUTOFF", "independent admin-cutoff mapping failed");

  const controls = {};
  {
    const corrupt = JSON.parse(JSON.stringify(DRSSE_RESULT));
    corrupt.layers.splice(5, 1);
    controls.missingDepth = expectFailure("missing depth", () => ind.inspectDevelopmentSource(corrupt));
  }
  {
    const corrupt = JSON.parse(JSON.stringify(DRSSE_RESULT));
    corrupt.layers[4].newRawStateCount = 0;
    controls.nonPositiveCount = expectFailure("non-positive count", () => ind.inspectDevelopmentSource(corrupt));
  }
  {
    const corrupt = JSON.parse(JSON.stringify(DRSSE_RESULT));
    corrupt.representation.validatedTransformSet = ["UNAUTHORIZED-TRANSFORM"];
    controls.transformLeakage = expectFailure("transform leakage", () => ind.inspectDevelopmentSource(corrupt));
  }
  {
    const corruptRows = [
      { depth: 0, syntheticCount: 1 },
      { depth: 2, syntheticCount: 2 },
      { depth: 3, syntheticCount: 3 },
      { depth: 4, syntheticCount: 4 },
      { depth: 5, syntheticCount: 5 }
    ];
    controls.depthGap = expectFailure("depth gap", () => ind.predict(corruptRows, "syntheticCount", 6, ind.CANDIDATES[0]));
  }
  {
    const badPrediction = production.syntheticEstimatorChecks.checks[0].prediction * 1.01;
    controls.numericMismatch = !nearlyEqual(badPrediction, synthetic.checks[0].prediction, tolerance);
    ensure(controls.numericMismatch, "numeric mismatch negative control failed");
  }

  const passed = Object.values(controls).every(Boolean);
  ensure(passed, "Stage 0 v2 negative control failure");
  const resultCore = {
    schemaVersion: 1,
    studyId: "SSGTGE-STUDY1",
    stageId: SPEC.stageId,
    correctiveVersionOf: SPEC.correctiveVersionOf,
    resultClass: "TECHNICAL-DIAGNOSTIC-ONLY",
    scientificInferenceAuthorized: false,
    stage0Decision: "STAGE0-TECHNICAL-PASS",
    passed: true,
    freshHoldoutOutcomeGenerated: false,
    realDevelopmentCandidateEvaluationPerformed: false,
    productionCoreSha256: production.productionCoreSha256,
    independentEnumeration: {
      materializedPassed: materialized.passed,
      fullIndependentDepth2RecomputationPassed: agreement.passed,
      independentCoreSha256: agreement.independentCoreSha256
    },
    developmentSourceSummarySha256: developmentSource.sourceSummarySha256,
    independentSyntheticCoreSha256: synthetic.syntheticCoreSha256,
    crossImplementationRelativeTolerance: tolerance,
    negativeControls: controls,
    importsProductionGrowthEstimator: false,
    importsProductionGrowthSerializer: false
  };
  const finalResult = { ...resultCore, resultCoreSha256: ind.digest(resultCore) };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_0_V2_TECHNICAL_RESULT.json"), `${JSON.stringify(finalResult, null, 2)}\n`, "utf8");
  console.log(`SSGTGE_STAGE0_V2_INDEPENDENT=${JSON.stringify({ passed: true, resultCoreSha256: finalResult.resultCoreSha256 })}`);
}

main();
