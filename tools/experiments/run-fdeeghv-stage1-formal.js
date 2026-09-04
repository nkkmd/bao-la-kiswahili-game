#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/drsse-production.js");
const contract = require("./lib/fdeeghv-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/prereg/STAGE_1_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/authorizations/STAGE_1_EXECUTE.json");
const LEASE_PATH = process.env.FDEGHV_STAGE1_LEASE
  ? path.resolve(process.env.FDEGHV_STAGE1_LEASE)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/stage1-lease/PRECOMPUTATION_LEASE.json");
const OUT_DIR = process.env.FDEGHV_STAGE1_OUT
  ? path.resolve(process.env.FDEGHV_STAGE1_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/stage1-formal-v1");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}
function gitHead() { return childProcess.execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(); }
function sha256File(p) { return prod.sha256File(p); }
function peakRssBytes() { return process.resourceUsage().maxRSS * 1024; }
function elapsedSeconds(started) { return Number(process.hrtime.bigint() - started) / 1e9; }

function verifyAuthorization(spec, auth, lease) {
  contract.ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "Stage 1 authorization identity mismatch");
  contract.ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === true, "Stage 1 scientific execution not authorized");
  contract.ensure(auth.protectedDepth10AccessAuthorized === true, "protected depth-10 access not authorized");
  contract.ensure(auth.executionCountAuthorized === 1, "Stage 1 must authorize exactly one execution");
  contract.ensure(auth.stage0Decision === "STAGE0-PASS", "Stage 0 PASS not bound");
  contract.ensure(auth.preAccessDocumentationSync === "PASS", "pre-access documentation sync not PASS");
  contract.ensure(auth.g2_12EstimatorScientificInputAuthorized === false, "G2-12 estimator firewall opened");
  contract.ensure(auth.depth11AccessAuthorized === false, "depth-11 firewall opened");
  contract.ensure(auth.sameEvidenceRerunAuthorized === false, "same-evidence rerun firewall opened");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    contract.ensure(gitBlob(relative) === expected, `Stage 1 source freeze mismatch: ${relative}`);
  }
  contract.ensure(lease.studyId === spec.studyId && lease.stageId === spec.stageId, "lease identity mismatch");
  contract.ensure(lease.authorizationFileSha256 === sha256File(AUTH_PATH), "lease authorization hash mismatch");
  contract.ensure(lease.sourceCommit === gitHead(), "lease source commit mismatch");
  contract.ensure(lease.protectedDepth10AccessAuthorized === true, "lease does not authorize protected access");
  contract.ensure(lease.durableLease === true, "lease is not durable");
}

function main() {
  const started = process.hrtime.bigint();
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const lease = readJson(LEASE_PATH);
  contract.ensure(spec.studyId === "FDEGHV-STUDY1" && spec.stageId === "FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1", "unexpected Stage 1 identity");
  contract.ensure(spec.formalDomain.targetDepth === 10, "formal target depth changed");
  contract.ensure(spec.formalDomain.depth11AccessAuthorized === false, "depth-11 access enabled");
  contract.ensure(spec.representation.mode === "RAW-ONLY" && spec.representation.validatedTransformSet.length === 0, "RAW representation contract changed");
  contract.ensure(spec.representation.symmetryReductionAuthorized === false && spec.representation.canonicalizationAuthorized === false, "symmetry/canonicalization opened");
  contract.ensure(spec.firewall.g2_12EstimatorScientificInputAuthorized === false, "G2-12 firewall opened in spec");
  verifyAuthorization(spec, auth, lease);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const root = engine.initialState();
  prod.assertStudyState(root);
  const rootKey = prod.stateKey(root);
  contract.ensure(rootKey === spec.formalDomain.requiredRootRawStateKey, `formal root RAW key mismatch: ${rootKey}`);

  const profile = contract.profileFromSpec(spec);
  const core = prod.enumerateExactDepth({
    engine,
    rootState: root,
    targetDepth: 10,
    outDir: OUT_DIR,
    profile,
    studyId: spec.studyId,
    stageId: spec.stageId,
    rootLabel: "STANDARD-INITIAL-RAW-ROOT-FRESH-DEPTH10-HOLDOUT",
  });
  contract.assertCompletionMetadata(core, 10);

  const preliminary = {
    schemaVersion: 1,
    programLabel: "G3-11",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "formal-production-pending-independent-verification",
    protectedEvidenceOpened: true,
    evidenceClass: "FRESH-DEEPER-EXACT-HOLDOUT",
    executionCountThisStudyVersion: 1,
    specFileSha256: sha256File(SPEC_PATH),
    authorizationFileSha256: sha256File(AUTH_PATH),
    leaseFileSha256: sha256File(LEASE_PATH),
    sourceCommit: gitHead(),
    rootRawStateKey: rootKey,
    targetDepth: 10,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    technicalStopClassification: core.technicalStopClassification,
    productionResultCoreSha256: core.resultCoreSha256,
    productionTargetCandidate: core.targetComplete ? contract.exactTargets(core) : null,
    finalResourceGate: null,
    productionCandidate: "PENDING-FINAL-RESOURCE-RECHECK",
    g2_12EstimatorScientificInputUsed: false,
    symmetryReductionUsed: false,
    canonicalizationUsed: false,
    depth11Accessed: false,
    formalDecisionEstablished: false
  };
  const summaryPath = path.join(OUT_DIR, "STAGE_1_PRODUCTION_SUMMARY.json");
  prod.writeJson(summaryPath, preliminary);

  const finalGate = contract.evaluateFinalResources({
    core,
    profile,
    artifactBytes: contract.directoryBytes(OUT_DIR),
    elapsedSeconds: elapsedSeconds(started),
    peakResidentSetBytes: Math.max(peakRssBytes(), core.resourceUse.peakResidentSetBytes || 0),
  });
  let productionCandidate;
  if (core.targetComplete && finalGate.passed) {
    productionCandidate = "PRODUCTION-CANDIDATE-EXACT-PENDING-INDEPENDENT";
  } else if (["RESOURCE-LIMIT", "ADMIN-CUTOFF"].includes(core.technicalStopClassification) || !finalGate.passed) {
    productionCandidate = "PRODUCTION-NON-ESTIMABLE-PENDING-INDEPENDENT";
  } else {
    productionCandidate = "PRODUCTION-TECHNICAL-INVALID-PENDING-INDEPENDENT";
  }
  const summary = { ...preliminary, finalResourceGate: finalGate, productionCandidate };
  prod.writeJson(summaryPath, summary);

  const postWriteGate = contract.evaluateFinalResources({
    core,
    profile,
    artifactBytes: contract.directoryBytes(OUT_DIR),
    elapsedSeconds: elapsedSeconds(started),
    peakResidentSetBytes: Math.max(peakRssBytes(), core.resourceUse.peakResidentSetBytes || 0),
  });
  if (productionCandidate === "PRODUCTION-CANDIDATE-EXACT-PENDING-INDEPENDENT") {
    contract.ensure(postWriteGate.passed, `final materialization crossed resource ceiling: ${postWriteGate.violations.join(",")}`);
  }
  if (JSON.stringify(postWriteGate) !== JSON.stringify(finalGate)) {
    summary.finalResourceGate = postWriteGate;
    if (!postWriteGate.passed && summary.productionCandidate === "PRODUCTION-CANDIDATE-EXACT-PENDING-INDEPENDENT") {
      summary.productionCandidate = "PRODUCTION-NON-ESTIMABLE-PENDING-INDEPENDENT";
    }
    prod.writeJson(summaryPath, summary);
  }

  console.log(`FDEGHV_STAGE1_PRODUCTION=${JSON.stringify({
    productionCandidate: summary.productionCandidate,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    finalResourceGate: summary.finalResourceGate,
    productionResultCoreSha256: core.resultCoreSha256,
  })}`);
}

try { main(); }
catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true, force: false });
  const failure = {
    schemaVersion: 1,
    programLabel: "G3-11",
    studyId: "FDEGHV-STUDY1",
    stageId: "FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1",
    resultRole: "formal-production-failure",
    protectedEvidenceMayHaveBeenOpened: true,
    formalDecisionEstablished: false,
    classification: "TECHNICAL-INVALID",
    message: error && error.message ? error.message : String(error),
    sameEvidenceRerunAuthorized: false,
    depth11AccessAuthorized: false
  };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_1_PRODUCTION_FAILURE.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 2;
}
