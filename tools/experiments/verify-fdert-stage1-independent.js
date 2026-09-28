#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const ind = require("./lib/drsse-independent.js");
const contract = require("./lib/fdert-stage1-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_1_PROTECTED_EXACT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/authorizations/STAGE_1_EXECUTE.json");
const LEASE_PATH = process.env.FDERT_STAGE1_LEASE
  ? path.resolve(process.env.FDERT_STAGE1_LEASE)
  : path.join(ROOT, "artifacts/local/fdert-stage1-lease/PRECOMPUTATION_LEASE.json");
const OUT_DIR = process.env.FDERT_STAGE1_OUT
  ? path.resolve(process.env.FDERT_STAGE1_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth11-exact-reachability-topology/stage1-protected-v1");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function writeJson(p, value) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
function sha256FileChunked(filePath) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.allocUnsafe(8 * 1024 * 1024);
  try {
    while (true) {
      const n = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (!n) break;
      hash.update(buffer.subarray(0, n));
    }
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest("hex");
}
function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}
function gitHead() {
  return childProcess.execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
}
function resourceStop(reason) {
  return new Set([
    "UNIQUE_STATE_CAP", "DEPTH_LABELLED_EDGE_CAP", "PARENT_EXPANSION_CAP",
    "MOVE_EVALUATION_CAP", "TREE_OCCURRENCE_CAP", "RSS_CAP", "WALL_CLOCK_CAP",
    "ARTIFACT_BYTE_CAP"
  ]).has(reason);
}

function verifyBinding(spec, auth, lease) {
  contract.ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "authorization identity mismatch");
  contract.ensure(auth.authorizationDecision === "RELEASE-TO-PROTECTED-DEPTH11-EVIDENCE", "authorization decision mismatch");
  contract.ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === true, "scientific authorization missing");
  contract.ensure(auth.protectedDepth11AccessAuthorized === true && auth.authorizedDepth === 11, "depth-11 authorization missing");
  contract.ensure(auth.executionCountAuthorized === 1 && auth.maximumScientificExecutionsAuthorized === 1, "execution count invalid");
  contract.ensure(auth.depth12AccessAuthorized === false && auth.sameEvidenceRerunAuthorized === false, "no-rescue firewall invalid");
  contract.ensure(auth.specSha256 === sha256FileChunked(SPEC_PATH), "spec SHA mismatch");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    contract.ensure(gitBlob(relative) === expected, `source freeze mismatch: ${relative}`);
  }
  contract.ensure(lease.studyId === spec.studyId && lease.stageId === spec.stageId, "lease identity mismatch");
  contract.ensure(lease.authorizationFileSha256 === sha256FileChunked(AUTH_PATH), "lease auth hash mismatch");
  contract.ensure(lease.sourceCommit === gitHead(), "lease source commit mismatch");
  contract.ensure(lease.durableLease === true && lease.protectedDepth11AccessAuthorized === true, "durable lease invalid");
}

function verifyProductionFiles(core) {
  for (const layer of core.layers) {
    const p = path.join(OUT_DIR, layer.stateFile);
    contract.ensure(fs.existsSync(p), `missing production state file depth ${layer.depth}`);
    contract.ensure(sha256FileChunked(p) === layer.stateFileSha256, `production state file SHA mismatch depth ${layer.depth}`);
  }
  for (const parent of core.parentLayers) {
    const p = path.join(OUT_DIR, parent.edgeFile);
    contract.ensure(fs.existsSync(p), `missing production edge file depth ${parent.depth}`);
    contract.ensure(sha256FileChunked(p) === parent.edgeFileSha256, `production edge file SHA mismatch depth ${parent.depth}`);
  }
  return true;
}

function independentResourceGate(summary, profile, elapsedSeconds, peakResidentSetBytes) {
  const violations = [];
  if (summary.cumulative.distinctRawStatesThroughLastCompleteDepth > profile.maxCumulativeDistinctRawStates) violations.push("UNIQUE_STATE_CAP");
  if (summary.cumulative.depthLabelledLegalEdgesThroughLastCompleteParent > profile.maxDepthLabelledEdges) violations.push("DEPTH_LABELLED_EDGE_CAP");
  if (BigInt(summary.cumulative.treeNodeOccurrencesThroughLastCompleteDepth) > BigInt(profile.maxCumulativeTreeNodeOccurrences)) violations.push("TREE_OCCURRENCE_CAP");
  if (elapsedSeconds >= profile.maxWallClockSeconds) violations.push("WALL_CLOCK_CAP");
  if (peakResidentSetBytes >= profile.maxResidentSetBytes) violations.push("RSS_CAP");
  return { passed: violations.length === 0, violations, observed: { elapsedSeconds, peakResidentSetBytes } };
}

function main() {
  const started = process.hrtime.bigint();
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const lease = readJson(LEASE_PATH);
  verifyBinding(spec, auth, lease);

  const productionFailure = path.join(OUT_DIR, "STAGE_1_PRODUCTION_FAILURE.json");
  const corePath = path.join(OUT_DIR, "result-core.json");
  const summaryPath = path.join(OUT_DIR, "STAGE_1_PRODUCTION_SUMMARY.json");
  const resultPath = path.join(OUT_DIR, "STAGE_1_FORMAL_RESULT.json");

  if (fs.existsSync(productionFailure) || !fs.existsSync(corePath) || !fs.existsSync(summaryPath)) {
    const result = {
      schemaVersion: 1,
      programLabel: "G4-10",
      studyId: spec.studyId,
      stageId: spec.stageId,
      evidenceClass: spec.evidenceClass,
      formalDecisionEstablished: true,
      formalDecision: "TECHNICAL-INVALID",
      integrityPassed: false,
      classification: "PRODUCTION-RESULT-INCOMPLETE-OR-FAILURE",
      protectedDepth11AccessOccurred: true,
      sameEvidenceRerunAuthorized: false,
      depth12AccessAuthorized: false
    };
    writeJson(resultPath, result);
    console.log(`FDERT_STAGE1_INDEPENDENT=${JSON.stringify(result)}`);
    return;
  }

  const core = readJson(corePath);
  const production = readJson(summaryPath);
  contract.ensure(core.studyId === spec.studyId && core.stageId === spec.stageId && core.targetDepth === 11, "production core identity mismatch");
  contract.ensure(production.productionResultCoreSha256 === core.resultCoreSha256, "production core digest binding mismatch");
  contract.ensure(production.depth12Accessed === false, "production depth-12 firewall violation");
  contract.ensure(verifyProductionFiles(core), "production file hash verification failed");

  const historicalPath = path.join(ROOT, spec.historicalPrefixIntegrityReference.canonicalResultPath);
  contract.ensure(gitBlob(spec.historicalPrefixIntegrityReference.canonicalResultPath) === spec.historicalPrefixIntegrityReference.canonicalResultGitBlobSha, "historical G3-11 canonical result blob changed");
  const historical = readJson(historicalPath);
  contract.ensure(historical.formalDecision === spec.historicalPrefixIntegrityReference.requiredHistoricalFormalDecision, "historical G3-11 decision mismatch");

  let prefixIntegrity = null;
  if (core.lastCompleteDepth >= 10) {
    prefixIntegrity = contract.verifyHistoricalPrefix(core, historical);
  }

  const profile = contract.profileFromSpec(spec);
  let independentSummary;
  let fullAgreement = false;
  let prefixAgreement = false;
  let independentStoppedForResource = false;

  if (core.targetComplete) {
    independentSummary = ind.independentEnumerate({ engine, rootState: engine.initialState(), targetDepth: 11, profile });
    if (independentSummary.targetComplete) {
      contract.ensure(
        ind.canonical(ind.projectForComparison(core)) === ind.canonical(ind.projectForComparison(independentSummary)),
        "production / independent full depth-11 topology mismatch",
      );
      fullAgreement = true;
    } else {
      independentStoppedForResource = resourceStop(independentSummary.stopReason);
      contract.ensure(independentStoppedForResource, `unexpected independent stop: ${independentSummary.stopReason}`);
      const d = independentSummary.lastCompleteDepth;
      contract.ensure(
        contract.canonical(contract.completePrefixProjection(core, d)) === contract.canonical(contract.completePrefixProjection(independentSummary, d)),
        "production / independent resource-censored prefix mismatch",
      );
      prefixAgreement = true;
    }
  } else {
    contract.ensure(resourceStop(core.stopReason) || production.productionCandidate.startsWith("PRODUCTION-NON-ESTIMABLE"), "incomplete production is not a resource/admin stop");
    const d = core.lastCompleteDepth;
    independentSummary = ind.independentEnumerate({ engine, rootState: engine.initialState(), targetDepth: d, profile });
    contract.ensure(independentSummary.targetComplete === true, `independent complete-prefix verification stopped: ${independentSummary.stopReason}`);
    contract.ensure(
      contract.canonical(contract.completePrefixProjection(core, d)) === contract.canonical(contract.completePrefixProjection(independentSummary, d)),
      "production / independent claimed-complete prefix mismatch",
    );
    prefixAgreement = true;
  }

  const elapsed = Number(process.hrtime.bigint() - started) / 1e9;
  const rss = process.resourceUsage().maxRSS * 1024;
  const independentGate = independentResourceGate(independentSummary, profile, elapsed, rss);

  let formalDecision;
  let targets = contract.nonEstimableTargets();
  let independentCoreSha256;
  if (core.targetComplete && production.finalResourceGate.passed === true && fullAgreement && independentGate.passed) {
    contract.ensure(prefixIntegrity && prefixIntegrity.passed, "exact classification requires historical prefix integrity PASS");
    const prodTargets = contract.targetValues(core);
    const indTargets = contract.targetValues(independentSummary);
    contract.ensure(contract.canonical(prodTargets) === contract.canonical(indTargets), "production / independent target mismatch");
    formalDecision = "EXACT-WITHIN-FROZEN-DEPTH-11-DOMAIN";
    targets = contract.labelTargets(indTargets);
    independentCoreSha256 = contract.hashCanonical(ind.projectForComparison(independentSummary));
  } else if ((core.targetComplete === false && (resourceStop(core.stopReason) || production.productionCandidate.startsWith("PRODUCTION-NON-ESTIMABLE")))
      || independentStoppedForResource || !independentGate.passed) {
    contract.ensure(prefixAgreement || fullAgreement, "NON-ESTIMABLE classification lacks independent integrity verification");
    formalDecision = "NON-ESTIMABLE";
    independentCoreSha256 = contract.hashCanonical(ind.projectForComparison(independentSummary));
  } else {
    throw new Error("unexpected production/independent disposition");
  }

  const scientificCore = {
    studyId: spec.studyId,
    stageId: spec.stageId,
    formalDecision,
    rootRawStateKey: core.rootStateKey,
    targetDepth: 11,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    productionResultCoreSha256: core.resultCoreSha256,
    independentCoreSha256,
    historicalPrefixIntegrity: prefixIntegrity,
    cumulative: core.cumulative,
    layers: core.layers.map((r) => ({
      depth: r.depth,
      uniqueRawStateCount: r.uniqueRawStateCount,
      newRawStateCount: r.newRawStateCount,
      cumulativeRawStateCount: r.cumulativeRawStateCount,
      treeNodeOccurrences: r.treeNodeOccurrences,
      cumulativeTreeNodeOccurrences: r.cumulativeTreeNodeOccurrences,
      stateSetSha256: r.stateSetSha256,
      arrival: r.arrival,
    })),
    parentLayers: core.parentLayers.map((r) => ({
      depth: r.depth,
      uniqueParentRawStateCount: r.uniqueParentRawStateCount,
      legalEdgeCount: r.legalEdgeCount,
      treeEdgeOccurrences: r.treeEdgeOccurrences,
      branchingDistribution: r.branchingDistribution,
      edgeSetSha256: r.edgeSetSha256,
    })),
    targets,
  };

  const result = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: spec.studyId,
    stageId: spec.stageId,
    evidenceClass: spec.evidenceClass,
    formalDecisionEstablished: true,
    formalDecision,
    targetDecisions: targets,
    integrityPassed: true,
    productionMaterializedFileHashVerificationPassed: true,
    historicalPrefixIntegrity: prefixIntegrity,
    fullIndependentExactRecomputationPerformed: core.targetComplete,
    fullIndependentExactRecomputationPassed: fullAgreement,
    independentCompletePrefixVerificationPassed: prefixAgreement,
    independentStoppedForResource,
    independentStopReason: independentSummary.stopReason,
    productionFinalResourceGate: production.finalResourceGate,
    independentResourceGate: independentGate,
    protectedDepth11AccessOccurred: true,
    depth12Accessed: false,
    sameEvidenceRerunAuthorized: false,
    partialFormalPromotionAuthorized: false,
    scientificCore,
    scientificResultCoreSha256: contract.hashCanonical(scientificCore),
  };
  writeJson(resultPath, result);
  console.log(`FDERT_STAGE1_INDEPENDENT=${JSON.stringify({ formalDecision, targets, scientificResultCoreSha256: result.scientificResultCoreSha256 })}`);
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const result = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: "FDERT-STUDY1",
    stageId: "FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1",
    evidenceClass: "FRESH-DEEPER-EXACT-HOLDOUT",
    formalDecisionEstablished: true,
    formalDecision: "TECHNICAL-INVALID",
    integrityPassed: false,
    classification: "INDEPENDENT-OR-INTEGRITY-FAILURE",
    message: error && error.message ? error.message : String(error),
    protectedDepth11AccessOccurred: true,
    sameEvidenceRerunAuthorized: false,
    depth12AccessAuthorized: false
  };
  writeJson(path.join(OUT_DIR, "STAGE_1_FORMAL_RESULT.json"), result);
  console.error(error);
  process.exitCode = 2;
}
