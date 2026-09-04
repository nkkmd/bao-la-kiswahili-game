#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const ind = require("./lib/drsse-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/prereg/STAGE_1_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/authorizations/STAGE_1_EXECUTE.json");
const LEASE_PATH = process.env.FDEGHV_STAGE1_LEASE
  ? path.resolve(process.env.FDEGHV_STAGE1_LEASE)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/stage1-lease/PRECOMPUTATION_LEASE.json");
const OUT_DIR = process.env.FDEGHV_STAGE1_OUT
  ? path.resolve(process.env.FDEGHV_STAGE1_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/stage1-formal-v1");

function fail(message) { throw new Error(message); }
function requireTrue(v, message) { if (!v) fail(message); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function hashFile(p) { return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex"); }
function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
}
function hashCanonical(value) { return crypto.createHash("sha256").update(canonical(value), "utf8").digest("hex"); }
function gitBlob(relative) { return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim(); }
function gitHead() { return childProcess.execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(); }
function directoryBytes(root) {
  let total = 0;
  if (!fs.existsSync(root)) return 0;
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, e.name);
    total += e.isDirectory() ? directoryBytes(p) : fs.statSync(p).size;
  }
  return total;
}
function profile(spec) {
  const p = spec.resourceProfile;
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
function independentTargets(summary) {
  requireTrue(summary.targetComplete === true && summary.targetDepth === 10, "independent targets require complete depth 10");
  const d9 = summary.layers.find((r) => r.depth === 9);
  const d10 = summary.layers.find((r) => r.depth === 10);
  requireTrue(d9 && d10, "independent depth 9/10 rows missing");
  const left = BigInt(d10.cumulativeTreeNodeOccurrences) * BigInt(d9.cumulativeRawStateCount);
  const right = BigInt(d9.cumulativeTreeNodeOccurrences) * BigInt(d10.cumulativeRawStateCount);
  return {
    H1: { condition: d10.newRawStateCount === d10.uniqueRawStateCount, exactComparison: `${d10.newRawStateCount} == ${d10.uniqueRawStateCount}` },
    H2: { condition: BigInt(d10.treeNodeOccurrences) > BigInt(d10.uniqueRawStateCount), exactComparison: `${d10.treeNodeOccurrences} > ${d10.uniqueRawStateCount}` },
    H3: { condition: left > right, exactCrossProducts: { left: left.toString(), right: right.toString() } },
    H4: {
      condition: d10.arrival.duplicateArrivalCount > 0 && d10.arrival.statesWithMultiplePredecessors > 0,
      duplicateArrivalCount: d10.arrival.duplicateArrivalCount,
      statesWithMultiplePredecessors: d10.arrival.statesWithMultiplePredecessors,
    },
  };
}
function resourceGate(summary, p, elapsedSeconds, peakResidentSetBytes) {
  const violations = [];
  const c = summary.cumulative;
  if (c.distinctRawStatesThroughLastCompleteDepth > p.maxCumulativeDistinctRawStates) violations.push("UNIQUE_STATE_CAP");
  if (c.depthLabelledLegalEdgesThroughLastCompleteParent > p.maxDepthLabelledEdges) violations.push("DEPTH_LABELLED_EDGE_CAP");
  if (BigInt(c.treeNodeOccurrencesThroughLastCompleteDepth) > BigInt(p.maxCumulativeTreeNodeOccurrences)) violations.push("TREE_OCCURRENCE_CAP");
  if (peakResidentSetBytes >= p.maxResidentSetBytes) violations.push("RSS_CAP");
  if (elapsedSeconds >= p.maxWallClockSeconds) violations.push("WALL_CLOCK_CAP");
  return { passed: violations.length === 0, violations, observed: { elapsedSeconds, peakResidentSetBytes } };
}
function targetLabels(targets) {
  return Object.fromEntries(Object.entries(targets).map(([k, v]) => [k, { ...v, decision: v.condition ? "DEEPER-CONFIRMED" : "COUNTEREXAMPLE-BOUNDARY" }]));
}
function prefixCore(core) {
  const d = core.lastCompleteDepth;
  return {
    ...core,
    targetDepth: d,
    targetComplete: true,
    lastCompleteDepth: d,
    firstIncompleteDepth: null,
    stopReason: null,
    technicalStopClassification: null,
    layers: core.layers.filter((r) => r.depth <= d),
    parentLayers: core.parentLayers.filter((r) => r.depth < d),
  };
}
function verifyBinding(spec, auth, lease) {
  requireTrue(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "authorization identity mismatch");
  requireTrue(auth.executionAuthorized === true && auth.executionCountAuthorized === 1, "authorization execution count invalid");
  requireTrue(auth.protectedDepth10AccessAuthorized === true, "protected evidence authorization missing");
  requireTrue(auth.g2_12EstimatorScientificInputAuthorized === false && auth.depth11AccessAuthorized === false, "firewall authorization invalid");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) requireTrue(gitBlob(relative) === expected, `source freeze mismatch: ${relative}`);
  requireTrue(lease.studyId === spec.studyId && lease.stageId === spec.stageId, "lease identity mismatch");
  requireTrue(lease.authorizationFileSha256 === hashFile(AUTH_PATH), "lease authorization hash mismatch");
  requireTrue(lease.sourceCommit === gitHead(), "lease source commit mismatch");
  requireTrue(lease.durableLease === true, "durable lease missing");
}

function main() {
  const started = process.hrtime.bigint();
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const lease = readJson(LEASE_PATH);
  verifyBinding(spec, auth, lease);
  requireTrue(spec.formalDomain.targetDepth === 10 && spec.formalDomain.depth11AccessAuthorized === false, "formal depth contract changed");
  requireTrue(spec.representation.mode === "RAW-ONLY" && spec.representation.validatedTransformSet.length === 0, "representation contract changed");
  requireTrue(spec.independentVerification.productionEnumeratorImportAuthorized === false && spec.independentVerification.productionTargetEvaluatorImportAuthorized === false,
    "independent import firewall changed");

  const corePath = path.join(OUT_DIR, "result-core.json");
  const summaryPath = path.join(OUT_DIR, "STAGE_1_PRODUCTION_SUMMARY.json");
  requireTrue(fs.existsSync(corePath) && fs.existsSync(summaryPath), "production artifacts missing");
  const core = readJson(corePath);
  const production = readJson(summaryPath);
  requireTrue(core.studyId === spec.studyId && core.stageId === spec.stageId && core.targetDepth === 10, "production core identity mismatch");
  requireTrue(production.productionResultCoreSha256 === core.resultCoreSha256, "production core digest binding mismatch");
  requireTrue(production.specFileSha256 === hashFile(SPEC_PATH) && production.authorizationFileSha256 === hashFile(AUTH_PATH), "production source metadata mismatch");
  requireTrue(production.g2_12EstimatorScientificInputUsed === false && production.depth11Accessed === false, "production firewall violation");
  requireTrue(ind.rawKey(engine.initialState()) === spec.formalDomain.requiredRootRawStateKey, "independent root identity mismatch");

  const materialized = ind.verifyMaterialized({ engine, outDir: OUT_DIR, productionCore: core });
  requireTrue(materialized.passed === true, "materialized independent verification failed");

  let independentAgreement = null;
  let prefixAgreement = null;
  let independentSummary = null;
  if (core.targetComplete) {
    independentAgreement = ind.verifyIndependentAgreement({
      engine,
      rootState: engine.initialState(),
      targetDepth: 10,
      profile: profile(spec),
      productionCore: core,
    });
    requireTrue(independentAgreement.passed === true, "full independent depth-10 recomputation mismatch");
    independentSummary = independentAgreement.independentSummary;
  } else {
    const prefix = prefixCore(core);
    prefixAgreement = ind.verifyIndependentAgreement({
      engine,
      rootState: engine.initialState(),
      targetDepth: prefix.targetDepth,
      profile: profile(spec),
      productionCore: prefix,
    });
    requireTrue(prefixAgreement.passed === true, "independent claimed-complete prefix verification failed");
    independentSummary = prefixAgreement.independentSummary;
  }

  const elapsed = Number(process.hrtime.bigint() - started) / 1e9;
  const rss = process.resourceUsage().maxRSS * 1024;
  const independentResourceGate = resourceGate(independentSummary, profile(spec), elapsed, rss);

  let formalDecision;
  let targets = { H1: { decision: "NON-ESTIMABLE" }, H2: { decision: "NON-ESTIMABLE" }, H3: { decision: "NON-ESTIMABLE" }, H4: { decision: "NON-ESTIMABLE" } };
  if (core.targetComplete && production.productionCandidate === "PRODUCTION-CANDIDATE-EXACT-PENDING-INDEPENDENT"
      && production.finalResourceGate.passed === true && independentAgreement && independentAgreement.passed && independentResourceGate.passed) {
    const independentComputed = independentTargets(independentSummary);
    requireTrue(canonical(independentComputed) === canonical(production.productionTargetCandidate), "production/independent target recomputation mismatch");
    formalDecision = "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN";
    targets = targetLabels(independentComputed);
  } else if (production.productionCandidate === "PRODUCTION-NON-ESTIMABLE-PENDING-INDEPENDENT" || !independentResourceGate.passed) {
    formalDecision = "NON-ESTIMABLE";
  } else {
    fail(`unexpected production disposition: ${production.productionCandidate}`);
  }

  const scientificCore = {
    studyId: spec.studyId,
    stageId: spec.stageId,
    formalDecision,
    rootRawStateKey: core.rootStateKey,
    targetDepth: 10,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    firstIncompleteDepth: core.firstIncompleteDepth,
    stopReason: core.stopReason,
    productionResultCoreSha256: core.resultCoreSha256,
    independentCoreSha256: independentAgreement ? independentAgreement.independentCoreSha256 : prefixAgreement.independentCoreSha256,
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

  const resultPath = path.join(OUT_DIR, "STAGE_1_FORMAL_RESULT.json");
  let result = {
    schemaVersion: 1,
    programLabel: "G3-11",
    studyId: spec.studyId,
    stageId: spec.stageId,
    evidenceClass: "FRESH-DEEPER-EXACT-HOLDOUT",
    formalDecisionEstablished: true,
    formalDecision,
    targetDecisions: targets,
    integrityPassed: true,
    materializedVerification: materialized,
    fullIndependentExactRecomputationPerformed: core.targetComplete,
    fullIndependentExactRecomputationPassed: independentAgreement ? independentAgreement.passed : false,
    independentCompletePrefixVerificationPerformed: !core.targetComplete,
    independentCompletePrefixVerificationPassed: prefixAgreement ? prefixAgreement.passed : false,
    productionFinalResourceGate: production.finalResourceGate,
    independentResourceGate,
    artifactFinalResourceGate: null,
    scientificCore,
    scientificResultCoreSha256: hashCanonical(scientificCore),
    productionCoreFileSha256: hashFile(corePath),
    productionSummaryFileSha256: hashFile(summaryPath),
    specFileSha256: hashFile(SPEC_PATH),
    authorizationFileSha256: hashFile(AUTH_PATH),
    leaseFileSha256: hashFile(LEASE_PATH),
    g2_12EstimatorScientificInputUsed: false,
    symmetryReductionUsed: false,
    canonicalizationUsed: false,
    depth11Accessed: false,
    sameEvidenceRerunAuthorized: false,
    interpretationBoundary: {
      upstreamStudyDecisionRevisionAuthorized: false,
      wholeBaoStateSpaceEstimateAuthorized: false,
      wholeBaoGameTreeEstimateAuthorized: false,
      g3_10TrajectoryClaimReDecisionAuthorized: false,
      g3_07SearchClaimReDecisionAuthorized: false,
      g3_04PhaseClaimReDecisionAuthorized: false
    }
  };
  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  const artifactBytes = directoryBytes(OUT_DIR);
  const artifactPassed = artifactBytes <= spec.resourceProfile.maxUncompressedArtifactBytes;
  result.artifactFinalResourceGate = { passed: artifactPassed, artifactBytes, maxUncompressedArtifactBytes: spec.resourceProfile.maxUncompressedArtifactBytes };
  if (!artifactPassed && result.formalDecision === "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN") {
    result.formalDecision = "NON-ESTIMABLE";
    result.targetDecisions = { H1: { decision: "NON-ESTIMABLE" }, H2: { decision: "NON-ESTIMABLE" }, H3: { decision: "NON-ESTIMABLE" }, H4: { decision: "NON-ESTIMABLE" } };
    result.scientificCore.formalDecision = "NON-ESTIMABLE";
    result.scientificCore.targets = result.targetDecisions;
    result.scientificResultCoreSha256 = hashCanonical(result.scientificCore);
  }
  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  console.log(`FDEGHV_STAGE1_INDEPENDENT=${JSON.stringify({
    formalDecision: result.formalDecision,
    targetComplete: core.targetComplete,
    lastCompleteDepth: core.lastCompleteDepth,
    targetDecisions: result.targetDecisions,
    scientificResultCoreSha256: result.scientificResultCoreSha256,
    artifactFinalResourceGate: result.artifactFinalResourceGate,
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
    evidenceClass: "FRESH-DEEPER-EXACT-HOLDOUT",
    formalDecisionEstablished: true,
    formalDecision: "TECHNICAL-INVALID",
    integrityPassed: false,
    message: error && error.message ? error.message : String(error),
    protectedEvidenceConsumed: true,
    sameEvidenceRerunAuthorized: false,
    depth11AccessAuthorized: false,
    partialFormalPromotionAuthorized: false
  };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_1_FORMAL_RESULT.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 2;
}
