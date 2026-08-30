#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");
const engine = require("../../public/engine.js");
const drsse = require("./lib/drsse-production.js");
const growth = require("./lib/ssgtge-production.js");

const STUDY_ID = "SSGTGE-STUDY1";
const STAGE_ID = "SSGTGE-S0-TECHNICAL-2026-08-30-v2";
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "artifacts/local/state-space-game-tree-growth-estimation/stage0-technical-v2");
const SPEC_PATH = path.join(ROOT, "doc/state-space-game-tree-growth-estimation/preregistration/STAGE_0_V2_TECHNICAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/state-space-game-tree-growth-estimation/authorizations/STAGE_0_V2_TECHNICAL_EXECUTE.json");
const DRSSE_RESULT_PATH = path.join(ROOT, "doc/deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(args) {
  return childProcess.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function verifyAuthorization(auth) {
  const head = git(["rev-parse", "HEAD"]);
  const parent = git(["rev-parse", "HEAD^"]);
  ensure(auth.studyId === STUDY_ID && auth.stageId === STAGE_ID, "authorization identity mismatch");
  ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === false, "Stage 0 v2 technical-only authorization required");
  ensure(auth.realDevelopmentCandidateEvaluationAuthorized === false, "real development candidate evaluation must remain unauthorized");
  ensure(auth.freshDepth10Or11GenerationAuthorized === false, "fresh holdout generation must remain forbidden");
  ensure(parent === auth.implementationFreezeCommitSha, "execution commit parent must equal v2 implementation-freeze commit");
  ensure(head !== parent, "v2 authorization must be a separate commit");
  for (const item of auth.frozenSources) {
    const actual = git(["hash-object", item.path]);
    ensure(actual === item.gitBlobSha, `Git blob identity mismatch: ${item.path}`);
  }
  return { head, parent };
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const provenance = verifyAuthorization(auth);
  ensure(spec.studyId === STUDY_ID && spec.stageId === STAGE_ID, "Stage 0 v2 spec identity mismatch");
  ensure(spec.correctiveVersionOf === "SSGTGE-S0-TECHNICAL-2026-08-30-v1", "v2 corrective lineage mismatch");
  ensure(spec.maximumTechnicalEnumerationDepth === 2, "Stage 0 v2 enumeration must be capped at depth 2");
  ensure(spec.realDevelopmentCandidateEvaluationAuthorized === false, "real development candidate evaluation must be forbidden in Stage 0 v2");
  ensure(spec.freshHoldoutGenerationAuthorized === false, "fresh holdout generation must be forbidden in Stage 0 v2");

  const enumDir = path.join(OUT_DIR, "depth2-enumeration-fixture");
  const enumCore = drsse.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    outDir: enumDir,
    profile: spec.technicalEnumerationResourceProfile,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    rootLabel: "SSGTGE-STAGE0-V2-DEPTH2-TECHNICAL-FIXTURE",
  });
  ensure(enumCore.targetComplete === true && enumCore.lastCompleteDepth === 2, "depth-2 technical enumeration incomplete");
  ensure(enumCore.cumulative.distinctRawStatesThroughLastCompleteDepth === 19, "depth-2 RAW fixture count mismatch");
  ensure(enumCore.cumulative.depthLabelledLegalEdgesThroughLastCompleteParent === 18, "depth-2 edge fixture count mismatch");

  const drsseResult = readJson(DRSSE_RESULT_PATH);
  const developmentSource = growth.extractDevelopmentSource(drsseResult);
  ensure(developmentSource.maximumDepthRead === 9, "Stage 0 v2 development source may read only depth 0..9");
  ensure(developmentSource.candidateEvaluationPerformed === false, "Stage 0 v2 must not evaluate real development candidates");
  ensure(developmentSource.freshHoldoutRead === false, "Stage 0 v2 must not read fresh holdout data");

  const syntheticFirst = growth.runSyntheticTechnicalFixtures();
  const syntheticSecond = growth.runSyntheticTechnicalFixtures();
  ensure(growth.stableStringify(syntheticFirst) === growth.stableStringify(syntheticSecond), "estimator implementation is not deterministic");
  ensure(syntheticFirst.checks.every((row) => row.absoluteLogError < 1e-10), "synthetic estimator fixture error too large");

  const limits = spec.formalResourceCeilingsReference;
  const baseSnapshot = {
    cumulativeRawStates: 100,
    depthLabelledEdges: 200,
    parentExpansions: 50,
    moveEvaluations: 200,
    cumulativeTreeNodeOccurrences: 300,
    residentSetBytes: 1000000,
    artifactBytes: 1000,
    wallClockSeconds: 1,
  };
  const noStop = growth.classifyResource(baseSnapshot, limits);
  const resourceStop = growth.classifyResource({ ...baseSnapshot, cumulativeRawStates: Number(limits.maximumCumulativeDistinctRawStates) + 1 }, limits);
  const adminStop = growth.classifyResource({ ...baseSnapshot, wallClockSeconds: Number(limits.maximumWallClockSeconds) + 1 }, limits);
  ensure(noStop.stopped === false, "resource no-stop control failed");
  ensure(resourceStop.classification === "RESOURCE-LIMIT", "resource-limit classification failed");
  ensure(adminStop.classification === "ADMIN-CUTOFF", "administrative cutoff classification failed");

  const resultCore = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    correctiveVersionOf: spec.correctiveVersionOf,
    resultClass: "TECHNICAL-DIAGNOSTIC-ONLY",
    scientificInferenceAuthorized: false,
    freshHoldoutOutcomeGenerated: false,
    realDevelopmentCandidateEvaluationPerformed: false,
    authorization: provenance,
    technicalEnumeration: {
      targetDepth: 2,
      targetComplete: enumCore.targetComplete,
      cumulativeRawStates: enumCore.cumulative.distinctRawStatesThroughLastCompleteDepth,
      depthLabelledLegalEdges: enumCore.cumulative.depthLabelledLegalEdgesThroughLastCompleteParent,
      cumulativeTreeNodeOccurrences: enumCore.cumulative.treeNodeOccurrencesThroughLastCompleteDepth,
      rawStateSetSha256: enumCore.cumulative.cumulativeRawStateSetSha256,
      graphEdgeSetSha256: enumCore.cumulative.cumulativeGlobalRawGraphEdgeSetSha256
    },
    developmentSourcePlumbing: developmentSource,
    syntheticEstimatorChecks: syntheticFirst,
    resourceClassificationChecks: { noStop, resourceStop, adminStop },
    independentVerificationRequired: true
  };
  const result = { ...resultCore, productionCoreSha256: growth.sha256Text(growth.stableStringify(resultCore)) };
  fs.writeFileSync(path.join(OUT_DIR, "stage0-v2-production-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`SSGTGE_STAGE0_V2_PRODUCTION=${JSON.stringify({ passed: true, productionCoreSha256: result.productionCoreSha256, outDir: OUT_DIR })}`);
}

main();
