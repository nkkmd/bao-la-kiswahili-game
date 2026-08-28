#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/drsse-production.js");

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

function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}

function verifyAuthorization(spec, auth) {
  ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "Stage 2 authorization identity mismatch");
  ensure(auth.executionAuthorized === true, "Stage 2 formal execution is not authorized");
  ensure(auth.scientificInferenceAuthorized === true, "Stage 2 scientific inference authorization must be true");
  ensure(auth.formalExactDecisionAuthorized === true, "Stage 2 formal decision authorization must be true");
  ensure(auth.executionCountAuthorized === 1, "Stage 2 authorization must permit exactly one formal execution");
  ensure(auth.stage0Decision === "STAGE0-TECHNICAL-PASS", "Stage 0 readiness is not frozen PASS");
  ensure(auth.stage1Decision === "STAGE1-DEVELOPMENT-PASS", "Stage 1 readiness is not frozen PASS");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    const observed = gitBlob(relative);
    ensure(observed === expected, `Stage 2 source freeze mismatch ${relative}: ${observed} != ${expected}`);
  }
  ensure(auth.firewall && auth.firewall.stage1ArtifactsReadableAsFormalInput === false, "Stage 1 artifact firewall not frozen closed");
  ensure(auth.firewall.g2_04RootsReusable === false, "G2-04 root firewall not frozen closed");
}

function formalProfile(spec) {
  const p = spec.formalResourceProfile;
  return Object.freeze({
    maxCumulativeDistinctRawStates: p.maxCumulativeDistinctRawStates,
    maxDepthLabelledEdges: p.maxDepthLabelledEdges,
    maxParentStateExpansions: p.maxParentStateExpansions,
    maxMoveEvaluations: p.maxMoveEvaluations,
    maxCumulativeTreeNodeOccurrences: p.maxCumulativeTreeNodeOccurrences,
    maxResidentSetBytes: p.maxResidentSetBytes,
    maxWallClockSeconds: p.maxWallClockSeconds,
    maxUncompressedArtifactBytes: p.maxUncompressedArtifactBytes,
  });
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  ensure(spec.studyId === "DRSSE-STUDY1" && spec.stageId === "DRSSE-S2-FORMAL-2026-08-28-v1", "unexpected formal spec identity");
  ensure(spec.formalDomain.targetDepth === 9, "formal target depth is not frozen 9");
  verifyAuthorization(spec, auth);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const root = engine.initialState();
  prod.assertStudyState(root);
  const rootKey = prod.stateKey(root);
  ensure(rootKey === spec.formalDomain.requiredRootRawStateKey, `formal root RAW key mismatch: ${rootKey}`);
  ensure(Array.isArray(spec.representation.validatedTransformSet) && spec.representation.validatedTransformSet.length === 0,
    "validated transform set must remain empty");
  ensure(spec.representation.symmetryReductionAuthorized === false && spec.representation.canonicalizationAuthorized === false,
    "formal representation boundary changed");
  ensure(spec.firewall.stage1ArtifactsReadableAsFormalInput === false && spec.firewall.stage1RowsReusable === false
    && spec.firewall.stage1RootsReusable === false, "Stage 1 firewall opened");

  const core = prod.enumerateExactDepth({
    engine,
    rootState: root,
    targetDepth: spec.formalDomain.targetDepth,
    outDir: OUT_DIR,
    profile: formalProfile(spec),
    studyId: spec.studyId,
    stageId: spec.stageId,
    rootLabel: "STANDARD-INITIAL-RAW-ROOT-FORMAL",
  });

  const productionCandidate = core.targetComplete
    ? "PRODUCTION-CANDIDATE-EXACT-PENDING-INDEPENDENT"
    : (core.technicalStopClassification === "RESOURCE-LIMIT" || core.technicalStopClassification === "ADMIN-CUTOFF")
      ? "PRODUCTION-NOT-EXACT-PENDING-INDEPENDENT"
      : "PRODUCTION-NON-ESTIMABLE-PENDING-INDEPENDENT";

  const summary = {
    schemaVersion: 1,
    programLabel: "G2-05",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "formal-production-pending-independent-verification",
    scientificInferenceAuthorized: true,
    formalExactDecisionAuthorized: true,
    specFileSha256: sha256File(SPEC_PATH),
    authorizationFileSha256: sha256File(AUTH_PATH),
    rootRawStateKey: rootKey,
    targetDepth: spec.formalDomain.targetDepth,
    productionCandidate,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    technicalStopClassification: core.technicalStopClassification,
    resultCoreSha256: core.resultCoreSha256,
    layers: core.layers,
    parentLayers: core.parentLayers,
    cumulative: core.cumulative,
    resourceUse: core.resourceUse,
    representation: core.representation,
    profile: core.profile,
    independentVerificationRequired: true,
    formalDecisionEstablished: false,
    stage1ArtifactInputUsed: false,
    g2_04RootInputUsed: false,
    g1PartialDepth9InputUsed: false
  };
  prod.writeJson(path.join(OUT_DIR, "stage2-production-summary.json"), summary);
  console.log(`DRSSE_STAGE2_PRODUCTION=${JSON.stringify({
    productionCandidate,
    rootRawStateKey: rootKey,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    resultCoreSha256: core.resultCoreSha256,
    cumulative: core.cumulative,
  })}`);
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failure = {
    schemaVersion: 1,
    studyId: "DRSSE-STUDY1",
    stageId: "DRSSE-S2-FORMAL-2026-08-28-v1",
    classification: "TECHNICAL-INVALID",
    formalDecisionEstablished: false,
    message: error && error.message ? error.message : String(error)
  };
  fs.writeFileSync(path.join(OUT_DIR, "stage2-production-failure.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  throw error;
}
