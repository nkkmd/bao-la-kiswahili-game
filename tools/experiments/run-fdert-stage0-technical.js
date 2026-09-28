#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/drsse-production.js");
const ind = require("./lib/drsse-independent.js");
const contract = require("./lib/fdert-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_0_TECHNICAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/authorizations/STAGE_0_EXECUTE.json");
const OUT_DIR = process.env.FDERT_STAGE0_OUT
  ? path.resolve(process.env.FDERT_STAGE0_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth11-exact-reachability-topology/stage0-technical-v1");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}
function checkSourceBinding(auth) {
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    contract.ensure(gitBlob(relative) === expected, `source freeze mismatch: ${relative}`);
  }
}
function profile(base, overrides = {}) { return Object.freeze({ ...base, ...overrides }); }
function tmp(label) { return fs.mkdtempSync(path.join(os.tmpdir(), `fdert-s0-${label}-`)); }
function expectStop(base, label, overrides, accepted) {
  const core = prod.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    outDir: tmp(label),
    profile: profile(base, overrides),
    studyId: "FDERT-STUDY1",
    stageId: "FDERT-S0-TECHNICAL-2026-09-28-v1",
    rootLabel: `TECHNICAL-${label}`,
  });
  contract.ensure(core.targetComplete === false, `${label} did not fail closed`);
  contract.ensure(accepted.includes(core.stopReason), `${label} unexpected stopReason ${core.stopReason}`);
  return core.stopReason;
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);

  contract.ensure(spec.studyId === "FDERT-STUDY1", "unexpected Study identity");
  contract.ensure(spec.stageId === "FDERT-S0-TECHNICAL-2026-09-28-v1", "unexpected Stage identity");
  contract.ensure(spec.scientificInferenceAuthorized === false, "Stage 0 scientific inference opened");
  contract.ensure(spec.protectedDepth11AccessAuthorized === false, "Stage 0 depth-11 access opened");
  contract.ensure(spec.maximumRealFixtureDepth === 2, "Stage 0 maximum fixture depth changed");
  contract.ensure(auth.executionAuthorized === true, "Stage 0 execution not authorized");
  contract.ensure(auth.executionCountAuthorized === 1, "Stage 0 must be one-shot");
  contract.ensure(auth.scientificInferenceAuthorized === false, "authorization opened scientific inference");
  contract.ensure(auth.protectedDepth11AccessAuthorized === false, "authorization opened depth-11 access");
  contract.ensure(auth.maximumRealFixtureDepthAuthorized === 2, "authorization real fixture depth mismatch");
  contract.ensure(auth.stage1ExecutionAuthorized === false, "Stage 0 authorization opened Stage 1");
  checkSourceBinding(auth);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const base = spec.technicalProfile;
  const positiveDir = path.join(OUT_DIR, "positive-depth2");
  const positive = prod.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    outDir: positiveDir,
    profile: profile(base),
    studyId: spec.studyId,
    stageId: spec.stageId,
    rootLabel: "STANDARD-INITIAL-RAW-ROOT-TECHNICAL-DEPTH2",
  });

  contract.ensure(positive.targetComplete === true, "depth-2 positive fixture incomplete");
  contract.assertCompletionMetadata(positive, 2);
  contract.ensure(positive.rootStateKey === spec.realFixture.requiredRootRawStateKey, "current engine standard-root identity mismatch");
  contract.ensure(
    JSON.stringify(positive.layers.map((row) => row.uniqueRawStateCount)) === JSON.stringify(spec.realFixture.historicalExpectedUniqueRawStatesByDepth),
    "depth-2 historical RAW prefix mismatch",
  );
  contract.ensure(
    JSON.stringify(positive.layers.map((row) => row.treeNodeOccurrences)) === JSON.stringify(spec.realFixture.historicalExpectedTreeOccurrencesByDepth),
    "depth-2 historical tree prefix mismatch",
  );

  const materialized = ind.verifyMaterialized({ engine, outDir: positiveDir, productionCore: positive });
  contract.ensure(materialized.passed === true, "depth-2 materialized independent verification failed");

  const independent = ind.verifyIndependentAgreement({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    profile: profile(base),
    productionCore: positive,
  });
  contract.ensure(independent.passed === true, "depth-2 independent recomputation failed");

  const forcedStops = {
    uniqueState: expectStop(base, "unique-state", { maxCumulativeDistinctRawStates: 1 }, ["UNIQUE_STATE_CAP"]),
    work: expectStop(base, "work", { maxMoveEvaluations: 1 }, ["MOVE_EVALUATION_CAP"]),
    tree: expectStop(base, "tree", { maxCumulativeTreeNodeOccurrences: 1 }, ["TREE_OCCURRENCE_CAP"]),
    artifact: expectStop(base, "artifact", { maxUncompressedArtifactBytes: 1 }, ["ARTIFACT_BYTE_CAP"]),
  };

  const gateCore = {
    cumulative: {
      distinctRawStatesThroughLastCompleteDepth: 10,
      depthLabelledLegalEdgesThroughLastCompleteParent: 20,
      treeNodeOccurrencesThroughLastCompleteDepth: "30",
    },
    resourceUse: { parentStateExpansions: 10, moveEvaluations: 20 },
  };
  const gateProfile = {
    maxCumulativeDistinctRawStates: 100,
    maxDepthLabelledEdges: 100,
    maxParentStateExpansions: 100,
    maxMoveEvaluations: 100,
    maxCumulativeTreeNodeOccurrences: 1000,
    maxResidentSetBytes: 1000,
    maxWallClockSeconds: 100,
    maxUncompressedArtifactBytes: 100,
  };
  contract.ensure(
    contract.evaluateFinalResources({ core: gateCore, profile: gateProfile, artifactBytes: 99, elapsedSeconds: 1, peakResidentSetBytes: 1 }).passed,
    "final-resource below-cap control failed",
  );
  const above = contract.evaluateFinalResources({
    core: gateCore,
    profile: gateProfile,
    artifactBytes: 101,
    elapsedSeconds: 1,
    peakResidentSetBytes: 1,
  });
  contract.ensure(!above.passed && above.violations.includes("ARTIFACT_BYTE_CAP"), "final-resource above-cap control failed");

  const corrupt = JSON.parse(JSON.stringify(positive));
  corrupt.firstIncompleteDepth = 2;
  let corruptionRejected = false;
  try { contract.assertCompletionMetadata(corrupt, 2); } catch (_) { corruptionRejected = true; }
  contract.ensure(corruptionRejected, "corrupted completion metadata was not rejected");

  const classificationControls = {
    exact: contract.classifyDomain({
      targetComplete: true,
      resourceGatePassed: true,
      integrityPassed: true,
      independentPassed: true,
      stopReason: null,
    }),
    resourceCutoff: contract.classifyDomain({
      targetComplete: false,
      resourceGatePassed: false,
      integrityPassed: true,
      independentPassed: false,
      stopReason: "MOVE_EVALUATION_CAP",
    }),
    integrityDefect: contract.classifyDomain({
      targetComplete: true,
      resourceGatePassed: true,
      integrityPassed: true,
      independentPassed: false,
      stopReason: null,
    }),
  };
  contract.ensure(classificationControls.exact === "EXACT-WITHIN-FROZEN-DOMAIN", "exact classification control failed");
  contract.ensure(classificationControls.resourceCutoff === "NON-ESTIMABLE", "partial-resource quarantine control failed");
  contract.ensure(classificationControls.integrityDefect === "TECHNICAL-INVALID", "integrity-defect classification control failed");

  const independentSource = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/drsse-independent.js"), "utf8");
  contract.ensure(!independentSource.includes("drsse-production"), "independent enumerator imports production enumerator");

  const runnerSource = fs.readFileSync(__filename, "utf8");
  contract.ensure(!runnerSource.includes("targetDepth: 11"), "Stage 0 runner contains forbidden depth-11 real computation");

  const result = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: spec.studyId,
    stageId: spec.stageId,
    stageDisposition: "STAGE0-PASS",
    scientificInferencePerformed: false,
    protectedDepth11Access: false,
    stage1ExecutionAuthorized: false,
    maximumRealFixtureDepthObserved: 2,
    currentEngineStandardRootIdentityMatched: true,
    positiveControl: {
      rootRawStateKey: positive.rootStateKey,
      layerRawCounts: positive.layers.map((row) => row.uniqueRawStateCount),
      layerTreeOccurrences: positive.layers.map((row) => row.treeNodeOccurrences),
      materializedIndependentVerification: materialized.passed,
      fullIndependentRecomputation: independent.passed,
    },
    forcedStops,
    finalResourceBoundaryControls: { belowCapPassed: true, aboveCapRejected: true },
    completionMetadataCorruptionRejected: true,
    partialResultQuarantinePassed: true,
    classificationControls,
    staticImplementationSeparationPassed: true,
    noDepth11ComputationControlPassed: true,
    allMandatoryControlsPassed: true,
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };

  prod.writeJson(path.join(OUT_DIR, "STAGE_0_TECHNICAL_RESULT.json"), result);
  console.log(`FDERT_STAGE0=${JSON.stringify(result)}`);
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failure = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: "FDERT-STUDY1",
    stageId: "FDERT-S0-TECHNICAL-2026-09-28-v1",
    stageDisposition: "STAGE0-TECHNICAL-INVALID",
    scientificInferencePerformed: false,
    protectedDepth11Access: false,
    stage1ExecutionAuthorized: false,
    message: error && error.message ? error.message : String(error),
  };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_0_TECHNICAL_RESULT.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 2;
}
