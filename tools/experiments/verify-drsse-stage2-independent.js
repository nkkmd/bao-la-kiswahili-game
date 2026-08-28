#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const ind = require("./lib/drsse-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/deep-raw-state-space-enumeration/preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/deep-raw-state-space-enumeration/authorizations/STAGE_2_EXECUTE.json");
const OUT_DIR = process.env.DRSSE_STAGE2_OUT
  ? path.resolve(process.env.DRSSE_STAGE2_OUT)
  : path.join(ROOT, "artifacts/local/deep-raw-state-space-enumeration/stage2-formal-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function sha256Canonical(value) {
  return crypto.createHash("sha256").update(ind.canonical(value), "utf8").digest("hex");
}

function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}

function profile(spec) {
  const p = spec.formalResourceProfile;
  return {
    maxCumulativeDistinctRawStates: p.maxCumulativeDistinctRawStates,
    maxDepthLabelledEdges: p.maxDepthLabelledEdges,
    maxParentStateExpansions: p.maxParentStateExpansions,
    maxMoveEvaluations: p.maxMoveEvaluations,
    maxCumulativeTreeNodeOccurrences: p.maxCumulativeTreeNodeOccurrences,
    maxResidentSetBytes: p.maxResidentSetBytes,
    maxWallClockSeconds: p.maxWallClockSeconds,
    maxUncompressedArtifactBytes: p.maxUncompressedArtifactBytes,
  };
}

function verifyAuthorization(spec, auth) {
  ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "independent Stage 2 authorization identity mismatch");
  ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === true
    && auth.formalExactDecisionAuthorized === true && auth.executionCountAuthorized === 1,
    "independent Stage 2 authorization flags invalid");
  ensure(auth.stage0Decision === "STAGE0-TECHNICAL-PASS", "independent Stage 0 readiness mismatch");
  ensure(auth.stage1Decision === "STAGE1-DEVELOPMENT-PASS", "independent Stage 1 readiness mismatch");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    ensure(gitBlob(relative) === expected, `independent Stage 2 source freeze mismatch ${relative}`);
  }
  ensure(auth.firewall.stage1ArtifactsReadableAsFormalInput === false, "independent Stage 1 firewall opened");
  ensure(auth.firewall.stage1RowsReusable === false && auth.firewall.stage1RootsReusable === false,
    "independent Stage 1 reuse firewall opened");
  ensure(auth.firewall.g2_04RootsReusable === false, "independent G2-04 root firewall opened");
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  verifyAuthorization(spec, auth);
  ensure(spec.studyId === "DRSSE-STUDY1" && spec.stageId === "DRSSE-S2-FORMAL-2026-08-28-v1", "unexpected Stage 2 identity");
  ensure(spec.formalDomain.targetDepth === 9, "independent target depth changed");
  ensure(Array.isArray(spec.representation.validatedTransformSet) && spec.representation.validatedTransformSet.length === 0,
    "independent validated transform set is not empty");
  ensure(spec.representation.symmetryReductionAuthorized === false && spec.representation.canonicalizationAuthorized === false,
    "independent representation authorization changed");

  const summaryPath = path.join(OUT_DIR, "stage2-production-summary.json");
  const corePath = path.join(OUT_DIR, "result-core.json");
  const production = readJson(summaryPath);
  const core = readJson(corePath);
  ensure(production.studyId === spec.studyId && production.stageId === spec.stageId, "production summary Stage 2 identity mismatch");
  ensure(production.specFileSha256 === sha256File(SPEC_PATH), "formal spec file hash mismatch");
  ensure(production.authorizationFileSha256 === sha256File(AUTH_PATH), "formal authorization file hash mismatch");
  ensure(production.stage1ArtifactInputUsed === false && production.g2_04RootInputUsed === false
    && production.g1PartialDepth9InputUsed === false, "formal evidence firewall violation");
  ensure(core.studyId === spec.studyId && core.stageId === spec.stageId, "formal core identity mismatch");
  ensure(core.resultCoreSha256 === production.resultCoreSha256, "formal result-core identity mismatch");
  ensure(core.rootStateKey === production.rootRawStateKey, "formal root summary/core mismatch");
  ensure(core.rootStateKey === spec.formalDomain.requiredRootRawStateKey, "formal root does not match preregistration");
  ensure(ind.rawKey(engine.initialState()) === spec.formalDomain.requiredRootRawStateKey, "independent engine initial root RAW key mismatch");
  ensure(core.targetDepth === 9 && production.targetDepth === 9, "formal target depth mismatch");

  const materialized = ind.verifyMaterialized({ engine, outDir: OUT_DIR, productionCore: core });
  ensure(materialized.passed === true, "materialized formal artifact verification failed");

  const expectedStopClass = core.stopReason === null ? null : spec.stopClassification[core.stopReason];
  ensure((core.stopReason === null && core.technicalStopClassification === null)
    || (typeof expectedStopClass === "string" && core.technicalStopClassification === expectedStopClass),
    "formal resource-stop classification mismatch");
  ensure(core.targetComplete === production.targetComplete
    && core.lastCompleteDepth === production.lastCompleteDepth
    && core.firstIncompleteDepth === production.firstIncompleteDepth
    && core.stopReason === production.stopReason
    && core.technicalStopClassification === production.technicalStopClassification,
    "formal completion/stop summary mismatch");

  let independentAgreement = null;
  if (core.targetComplete) {
    independentAgreement = ind.verifyIndependentAgreement({
      engine,
      rootState: engine.initialState(),
      targetDepth: spec.formalDomain.targetDepth,
      profile: profile(spec),
      productionCore: core,
    });
    ensure(independentAgreement.passed === true, "full independent formal recomputation failed");
  }

  let formalDecision;
  if (core.targetComplete) {
    const exactReady = core.lastCompleteDepth === 9
      && core.firstIncompleteDepth === null
      && core.stopReason === null
      && core.technicalStopClassification === null
      && core.layers.length === 10
      && core.parentLayers.length === 9
      && core.layers.every((row, i) => row.depth === i && row.complete === true)
      && core.parentLayers.every((row, i) => row.depth === i && row.complete === true)
      && independentAgreement && independentAgreement.passed === true;
    ensure(exactReady, "formal exact decision prerequisites not met");
    formalDecision = spec.decisionRule.exact;
  } else if (core.technicalStopClassification === "RESOURCE-LIMIT" || core.technicalStopClassification === "ADMIN-CUTOFF") {
    formalDecision = spec.decisionRule.resourceOrAdminIncompleteWithValidIntegrity;
  } else {
    formalDecision = spec.decisionRule.technicalOrVerificationDefectAfterFormalExecution;
  }

  const decisionCore = {
    studyId: spec.studyId,
    stageId: spec.stageId,
    formalDecision,
    rootRawStateKey: core.rootStateKey,
    targetDepth: core.targetDepth,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    technicalStopClassification: core.technicalStopClassification,
    layers: core.layers,
    parentLayers: core.parentLayers,
    cumulative: core.cumulative,
    resultCoreSha256: core.resultCoreSha256,
    independentCoreSha256: independentAgreement ? independentAgreement.independentCoreSha256 : null,
  };

  const result = {
    schemaVersion: 1,
    programLabel: "G2-05",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "formal-independent-verification-and-decision",
    scientificInferenceAuthorized: true,
    formalDecisionEstablished: true,
    formalDecision,
    integrityPassed: true,
    materializedVerification: materialized,
    fullIndependentExactRecomputationPerformed: core.targetComplete,
    fullIndependentExactRecomputationPassed: independentAgreement ? independentAgreement.passed : false,
    independentCoreSha256: independentAgreement ? independentAgreement.independentCoreSha256 : null,
    productionResultCoreSha256: core.resultCoreSha256,
    productionResultCoreFileSha256: sha256File(corePath),
    productionSummarySha256: sha256File(summaryPath),
    specFileSha256: sha256File(SPEC_PATH),
    authorizationFileSha256: sha256File(AUTH_PATH),
    decisionCore,
    decisionCoreSha256: sha256Canonical(decisionCore),
    interpretationBoundary: {
      exactOnlyWithinFrozenDepth9Domain: formalDecision === spec.decisionRule.exact,
      fullBaoStateSpaceClaimAuthorized: false,
      fullBaoGameTreeComplexityClaimAuthorized: false,
      fullGameExtrapolationAuthorized: false,
      symmetryReducedClaimAuthorized: false,
      g2_04RescueLanguageAuthorized: false,
      g1SsgtcRevisionAuthorized: false,
      engineeringEndpointAuthorized: false,
    },
    verifierIndependence: {
      importsProductionEnumerator: false,
      importsProductionSerializer: false,
      importsIndependentRepresentationAndEnumeratorOnly: true,
    },
  };

  fs.writeFileSync(path.join(OUT_DIR, "stage2-independent-verification.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "stage2-formal-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`DRSSE_STAGE2_INDEPENDENT=${JSON.stringify({
    formalDecision: result.formalDecision,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    cumulative: core.cumulative,
    independentCoreSha256: result.independentCoreSha256,
    decisionCoreSha256: result.decisionCoreSha256,
  })}`);
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failure = {
    schemaVersion: 1,
    programLabel: "G2-05",
    studyId: "DRSSE-STUDY1",
    stageId: "DRSSE-S2-FORMAL-2026-08-28-v1",
    resultRole: "formal-independent-verification-failure",
    formalDecisionEstablished: true,
    formalDecision: "NON-ESTIMABLE",
    integrityPassed: false,
    classification: "VERIFICATION-FAILED",
    message: error && error.message ? error.message : String(error),
    interpretationBoundary: {
      exactClaimAuthorized: false,
      estimateFromPartialFormalArtifactAuthorized: false,
      rerunSameFormalEvidenceToRescueAuthorized: false,
    }
  };
  fs.writeFileSync(path.join(OUT_DIR, "stage2-independent-failure.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "stage2-formal-result.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  throw error;
}
