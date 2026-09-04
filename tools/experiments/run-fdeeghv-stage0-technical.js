#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/drsse-production.js");
const ind = require("./lib/drsse-independent.js");
const contract = require("./lib/fdeeghv-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/prereg/STAGE_0_TECHNICAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/authorizations/STAGE_0_EXECUTE.json");
const OUT_DIR = process.env.FDEGHV_STAGE0_OUT
  ? path.resolve(process.env.FDEGHV_STAGE0_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/stage0-technical-v1");

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
function tmp(label) { return fs.mkdtempSync(path.join(os.tmpdir(), `fdeeghv-s0-${label}-`)); }
function expectStop(base, label, overrides, accepted) {
  const core = prod.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    outDir: tmp(label),
    profile: profile(base, overrides),
    studyId: "FDEGHV-STUDY1",
    stageId: "FDEGHV-S0-TECHNICAL-2026-09-04-v1",
    rootLabel: `TECHNICAL-${label}`,
  });
  contract.ensure(core.targetComplete === false, `${label} did not fail closed`);
  contract.ensure(accepted.includes(core.stopReason), `${label} unexpected stopReason ${core.stopReason}`);
  return core.stopReason;
}

function syntheticTargetCore({ through9Tree, through9Raw, through10Tree, through10Raw }) {
  return {
    targetComplete: true,
    targetDepth: 10,
    layers: [
      { depth: 9, cumulativeTreeNodeOccurrences: String(through9Tree), cumulativeRawStateCount: through9Raw },
      {
        depth: 10,
        newRawStateCount: through10Raw - through9Raw,
        uniqueRawStateCount: through10Raw - through9Raw,
        treeNodeOccurrences: String(Math.max(through10Raw - through9Raw + 1, 2)),
        cumulativeTreeNodeOccurrences: String(through10Tree),
        cumulativeRawStateCount: through10Raw,
        arrival: { duplicateArrivalCount: 1, statesWithMultiplePredecessors: 1 },
      },
    ],
  };
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  contract.ensure(spec.studyId === "FDEGHV-STUDY1", "unexpected Study identity");
  contract.ensure(spec.stageId === "FDEGHV-S0-TECHNICAL-2026-09-04-v1", "unexpected Stage identity");
  contract.ensure(spec.scientificInferenceAuthorized === false, "Stage 0 scientific inference opened");
  contract.ensure(spec.protectedDepth10AccessAuthorized === false, "Stage 0 depth-10 access opened");
  contract.ensure(spec.maximumRealFixtureDepth === 2, "Stage 0 maximum fixture depth changed");
  contract.ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === false, "Stage 0 authorization flags invalid");
  contract.ensure(auth.protectedDepth10AccessAuthorized === false, "Stage 0 authorization exposes depth 10");
  contract.ensure(auth.executionCountAuthorized === 1, "Stage 0 authorization must permit exactly one execution");
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
  contract.ensure(positive.rootStateKey === spec.realFixture.requiredRootRawStateKey, "depth-2 root identity mismatch");
  contract.ensure(JSON.stringify(positive.layers.map((r) => r.uniqueRawStateCount)) === JSON.stringify(spec.realFixture.historicalExpectedUniqueRawStatesByDepth),
    "depth-2 historical RAW prefix mismatch");
  contract.ensure(JSON.stringify(positive.layers.map((r) => r.treeNodeOccurrences)) === JSON.stringify(spec.realFixture.historicalExpectedTreeOccurrencesByDepth),
    "depth-2 historical tree prefix mismatch");

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
  contract.ensure(contract.evaluateFinalResources({ core: gateCore, profile: gateProfile, artifactBytes: 99, elapsedSeconds: 1, peakResidentSetBytes: 1 }).passed,
    "final-resource below-cap control failed");
  const above = contract.evaluateFinalResources({ core: gateCore, profile: gateProfile, artifactBytes: 101, elapsedSeconds: 1, peakResidentSetBytes: 1 });
  contract.ensure(!above.passed && above.violations.includes("ARTIFACT_BYTE_CAP"), "final-resource above-cap control failed");

  const corrupt = JSON.parse(JSON.stringify(positive));
  corrupt.firstIncompleteDepth = 2;
  let corruptionRejected = false;
  try { contract.assertCompletionMetadata(corrupt, 2); } catch (_) { corruptionRejected = true; }
  contract.ensure(corruptionRejected, "corrupted completion metadata was not rejected");

  const h3Positive = contract.exactTargets(syntheticTargetCore({ through9Tree: 100, through9Raw: 100, through10Tree: 120, through10Raw: 110 }));
  const h3Negative = contract.exactTargets(syntheticTargetCore({ through9Tree: 100, through9Raw: 100, through10Tree: 110, through10Raw: 120 }));
  contract.ensure(h3Positive.H3.condition === true && h3Negative.H3.condition === false, "exact-rational H3 controls failed");

  const independentSource = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/drsse-independent.js"), "utf8");
  const g311VerifierSource = fs.readFileSync(path.join(ROOT, "tools/experiments/verify-fdeeghv-stage1-independent.js"), "utf8");
  contract.ensure(!independentSource.includes("drsse-production"), "independent enumerator imports production enumerator");
  contract.ensure(!g311VerifierSource.includes("fdeeghv-contract"), "G3-11 independent verifier imports production target evaluator");
  contract.ensure(!g311VerifierSource.includes("drsse-production"), "G3-11 independent verifier imports production enumerator");

  const result = {
    schemaVersion: 1,
    programLabel: "G3-11",
    studyId: spec.studyId,
    stageId: spec.stageId,
    stageDisposition: "STAGE0-PASS",
    scientificInferencePerformed: false,
    protectedDepth10Access: false,
    maximumRealFixtureDepthObserved: 2,
    positiveControl: {
      rootRawStateKey: positive.rootStateKey,
      layerRawCounts: positive.layers.map((r) => r.uniqueRawStateCount),
      layerTreeOccurrences: positive.layers.map((r) => r.treeNodeOccurrences),
      materializedIndependentVerification: materialized.passed,
      fullIndependentRecomputation: independent.passed,
    },
    forcedStops,
    finalResourceBoundaryControls: { belowCapPassed: true, aboveCapRejected: true },
    completionMetadataCorruptionRejected: true,
    exactRationalTargetControlsPassed: true,
    staticImplementationSeparationPassed: true,
    allMandatoryControlsPassed: true,
    stage1AutomaticallyAuthorized: false,
  };
  prod.writeJson(path.join(OUT_DIR, "STAGE_0_TECHNICAL_RESULT.json"), result);
  console.log(`FDEGHV_STAGE0=${JSON.stringify(result)}`);
}

try { main(); }
catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failure = {
    schemaVersion: 1,
    programLabel: "G3-11",
    studyId: "FDEGHV-STUDY1",
    stageId: "FDEGHV-S0-TECHNICAL-2026-09-04-v1",
    stageDisposition: "STAGE0-TECHNICAL-INVALID",
    scientificInferencePerformed: false,
    protectedDepth10Access: false,
    message: error && error.message ? error.message : String(error),
  };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_0_TECHNICAL_RESULT.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 2;
}
