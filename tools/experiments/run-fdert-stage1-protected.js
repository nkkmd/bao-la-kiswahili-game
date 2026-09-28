#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/fdert-production.js");
const contract = require("./lib/fdert-stage1-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_1_PROTECTED_EXACT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/authorizations/STAGE_1_EXECUTE.json");
const S0_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/results/stage-0-v3/STAGE_0_HARDENING_RESULT.json");
const LEASE_PATH = process.env.FDERT_STAGE1_LEASE
  ? path.resolve(process.env.FDERT_STAGE1_LEASE)
  : path.join(ROOT, "artifacts/local/fdert-stage1-lease/PRECOMPUTATION_LEASE.json");
const OUT_DIR = process.env.FDERT_STAGE1_OUT
  ? path.resolve(process.env.FDERT_STAGE1_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth11-exact-reachability-topology/stage1-protected-v1");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}
function gitHead() {
  return childProcess.execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
}
function elapsedSeconds(started) { return Number(process.hrtime.bigint() - started) / 1e9; }
function peakRssBytes() { return process.resourceUsage().maxRSS * 1024; }

function verifyAuthorization(spec, auth, s0, lease) {
  contract.ensure(auth.authorizationDecision === "RELEASE-TO-PROTECTED-DEPTH11-EVIDENCE", "Stage 1 release decision mismatch");
  contract.ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "Stage 1 identity mismatch");
  contract.ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === true, "Stage 1 scientific execution not authorized");
  contract.ensure(auth.protectedDepth11AccessAuthorized === true, "protected depth-11 access not authorized");
  contract.ensure(auth.executionCountAuthorized === 1 && auth.maximumScientificExecutionsAuthorized === 1, "Stage 1 must be one-shot");
  contract.ensure(auth.authorizedDepth === 11 && auth.depth12AccessAuthorized === false, "depth authorization mismatch");
  contract.ensure(auth.sameEvidenceRerunAuthorized === false && auth.partialFormalPromotionAuthorized === false, "no-rescue firewall opened");
  contract.ensure(auth.g2_12EstimatorScientificInputAuthorized === false && auth.historicalSearchDepth11ScientificInputAuthorized === false, "historical-input firewall opened");
  contract.ensure(auth.stage0Decision === "STAGE0-HARDENING-PASS", "Stage 0 v3 PASS not bound");
  contract.ensure(s0.stageDisposition === "STAGE0-HARDENING-PASS" && s0.protectedDepth11Access === false, "canonical Stage 0 v3 result invalid");
  contract.ensure(auth.specSha256 === prod.sha256FileChunked(SPEC_PATH), "Stage 1 spec SHA mismatch");
  contract.ensure(auth.stage0ResultSha256 === prod.sha256FileChunked(S0_PATH), "Stage 0 result SHA mismatch");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    contract.ensure(gitBlob(relative) === expected, `Stage 1 source freeze mismatch: ${relative}`);
  }
  contract.ensure(lease.studyId === spec.studyId && lease.stageId === spec.stageId, "lease identity mismatch");
  contract.ensure(lease.durableLease === true && lease.protectedDepth11AccessAuthorized === true, "durable protected lease missing");
  contract.ensure(lease.authorizationFileSha256 === prod.sha256FileChunked(AUTH_PATH), "lease authorization hash mismatch");
  contract.ensure(lease.sourceCommit === gitHead(), "lease source commit mismatch");
  contract.ensure(lease.sameEvidenceRerunAuthorized === false && lease.depth12AccessAuthorized === false, "lease no-rescue firewall invalid");
}

function main() {
  const started = process.hrtime.bigint();
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const s0 = readJson(S0_PATH);
  const lease = readJson(LEASE_PATH);

  contract.ensure(spec.studyId === "FDERT-STUDY1", "unexpected Study identity");
  contract.ensure(spec.stageId === "FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1", "unexpected Stage identity");
  contract.ensure(spec.formalDomain.targetDepth === 11 && spec.formalDomain.depth12AccessAuthorized === false, "formal depth contract changed");
  contract.ensure(spec.representation.mode === "RAW-ONLY" && spec.representation.validatedTransformSet.length === 0, "RAW representation contract changed");
  contract.ensure(spec.representation.symmetryReductionAuthorized === false && spec.representation.canonicalizationAuthorized === false, "transform firewall opened");
  contract.ensure(spec.firewall.depth11PartialProbeBeforeAuthorizationAuthorized === false, "preauthorization probe firewall opened");
  verifyAuthorization(spec, auth, s0, lease);

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
    targetDepth: 11,
    outDir: OUT_DIR,
    profile,
    studyId: spec.studyId,
    stageId: spec.stageId,
    rootLabel: "STANDARD-INITIAL-RAW-ROOT-FRESH-DEPTH11-HOLDOUT",
  });
  contract.assertCompletionMetadata(core, 11);

  const preliminary = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "protected-production-pending-independent-verification",
    protectedEvidenceOpened: true,
    evidenceClass: spec.evidenceClass,
    executionCountThisStudyVersion: 1,
    sourceCommit: gitHead(),
    specFileSha256: prod.sha256FileChunked(SPEC_PATH),
    authorizationFileSha256: prod.sha256FileChunked(AUTH_PATH),
    leaseFileSha256: prod.sha256FileChunked(LEASE_PATH),
    stage0ResultSha256: prod.sha256FileChunked(S0_PATH),
    rootRawStateKey: rootKey,
    targetDepth: 11,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    technicalStopClassification: core.technicalStopClassification,
    productionResultCoreSha256: core.resultCoreSha256,
    protectedDepth11AccessOccurred: true,
    depth12Accessed: false,
    g2_12EstimatorScientificInputUsed: false,
    historicalSearchDepth11ScientificInputUsed: false,
    symmetryReductionUsed: false,
    canonicalizationUsed: false,
    formalDecisionEstablished: false,
    productionCandidate: "PENDING-FINAL-RESOURCE-RECHECK",
    finalResourceGate: null
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
    productionCandidate = "PRODUCTION-CANDIDATE-EXACT-PENDING-PREFIX-AND-INDEPENDENT";
  } else if (core.technicalStopClassification === "RESOURCE-LIMIT" || core.technicalStopClassification === "ADMIN-CUTOFF" || !finalGate.passed) {
    productionCandidate = "PRODUCTION-NON-ESTIMABLE-PENDING-INDEPENDENT-INTEGRITY";
  } else {
    productionCandidate = "PRODUCTION-TECHNICAL-INVALID-PENDING-AUDIT";
  }
  const summary = { ...preliminary, productionCandidate, finalResourceGate: finalGate };
  prod.writeJson(summaryPath, summary);

  console.log(`FDERT_STAGE1_PRODUCTION=${JSON.stringify({
    productionCandidate,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    productionResultCoreSha256: core.resultCoreSha256,
    finalResourceGate: finalGate
  })}`);
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failure = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: "FDERT-STUDY1",
    stageId: "FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1",
    resultRole: "protected-production-failure",
    protectedEvidenceMayHaveBeenOpened: true,
    formalDecisionEstablished: false,
    classification: "TECHNICAL-INVALID",
    message: error && error.message ? error.message : String(error),
    sameEvidenceRerunAuthorized: false,
    depth12AccessAuthorized: false
  };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_1_PRODUCTION_FAILURE.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 2;
}
