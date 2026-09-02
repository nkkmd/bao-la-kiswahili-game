#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const util = require("node:util");
const E = require("../../public/engine.js");
const P = require("./lib/tctgd-stage1-production.js");
const I = require("./lib/tctgd-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/transposition-concentration-tree-graph-divergence");
const OUT = path.join(DOC, "results/stage-1");
const SPEC_PATH = path.join(DOC, "prereg/STUDY_1_SPEC.json");
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const LEASE_PATH = path.join(DOC, "executions/stage-1-execution-started.json");
const STAGE0_PATH = path.join(DOC, "results/stage-0/STAGE_0_TECHNICAL_RESULT.json");
const RESULT_PATH = path.join(OUT, "scientific-result.json");
const STAGE_ID = "TCTGD-S1-DEVELOPMENT-2026-09-02-v1";
const deep = util.isDeepStrictEqual;

function requireTrue(x, message) { if (!x) throw new Error(message); }
function textSha256(text) { return crypto.createHash("sha256").update(text, "utf8").digest("hex"); }
function gitBlobSha(text) {
  const b = Buffer.from(text, "utf8");
  return crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`, "utf8")).update(b).digest("hex");
}
function stable(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  return `{${Object.keys(x).sort().map(k => `${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`;
}
function maxRssBytes() { return process.resourceUsage().maxRSS * 1024; }
function timed(fn) {
  const started = process.hrtime.bigint();
  const value = fn();
  return {
    value,
    elapsedMs: Number(process.hrtime.bigint() - started) / 1e6,
    peakRssBytes: maxRssBytes(),
    artifactBytes: Buffer.byteLength(JSON.stringify(value), "utf8")
  };
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function sourceOnly(x) {
  return {
    phase: x.phase,
    sourceSeed: x.sourceSeed,
    selectedPly: x.selectedPly,
    rootRawSha256: x.rootRawSha256,
    sourceTrajectorySha256: x.sourceTrajectorySha256,
    openingPrefixSha256: x.openingPrefixSha256,
    openingPrefixLength: x.openingPrefixLength
  };
}
function pairSources(selection) {
  return selection.pairs.map(p => ({ pairId: p.pairId, sourceSeed: p.sourceSeed, namua: sourceOnly(p.namua), mtaji: sourceOnly(p.mtaji) }));
}
function verifyBlobBindings(auth) {
  for (const [relative, expected] of Object.entries(auth.sourceBlobBindings || {})) {
    const file = path.join(ROOT, relative);
    requireTrue(fs.existsSync(file), `bound source missing: ${relative}`);
    const actual = gitBlobSha(fs.readFileSync(file, "utf8"));
    requireTrue(actual === expected, `bound source blob mismatch ${relative}: ${actual} != ${expected}`);
  }
}
function loadIdentityDocuments() {
  const paths = [
    path.join(ROOT, "doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-1/scientific-result.json"),
    path.join(ROOT, "doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-2/scientific-result.json")
  ];
  return paths.map(file => readJson(file));
}
function resource(record, timing, ceiling) {
  const raw = record.tctgd.rawPrimitives;
  const uniqueRawStates = Number(raw.distinctRawStatesDepth0To5);
  const uniqueTransitions = Number(raw.depthLabelledUniqueTransitionCountParentDepth0To4);
  const parentExpansions = raw.uniqueRawStateCountByDepth
    .filter(x => x.depth < 5)
    .reduce((a, x) => a + Number(x.count), 0);
  const treeNodeOccurrences = BigInt(raw.treeOccurrenceCountDepth0To5);
  const within = uniqueRawStates <= ceiling.uniqueRawStates &&
    uniqueTransitions <= ceiling.uniqueTransitions &&
    parentExpansions <= ceiling.parentExpansions &&
    uniqueTransitions <= ceiling.legalMoveEvaluations &&
    treeNodeOccurrences <= BigInt(ceiling.treeNodeOccurrencesSummedAcrossLayers) &&
    timing.elapsedMs <= ceiling.elapsedMs &&
    timing.peakRssBytes <= ceiling.peakRssBytes &&
    timing.artifactBytes <= ceiling.rootArtifactBytes;
  return {
    uniqueRawStates,
    uniqueTransitions,
    parentExpansions,
    legalMoveEvaluations: uniqueTransitions,
    treeNodeOccurrences: String(treeNodeOccurrences),
    elapsedMs: timing.elapsedMs,
    peakRssBytes: timing.peakRssBytes,
    artifactBytes: timing.artifactBytes,
    within
  };
}
function publicMeasurement(row) {
  return {
    source: row.source,
    upstreamRootReconstructionCoreSha256: row.upstreamRootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: row.upstreamFamilyCoreSha256,
    tctgd: row.tctgd
  };
}
function rootScientificRow(pairId, phase, measured) {
  return {
    pairId,
    phase,
    source: measured.source,
    upstreamRootReconstructionCoreSha256: measured.upstreamRootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: measured.upstreamFamilyCoreSha256,
    rawPrimitives: measured.tctgd.rawPrimitives,
    endpoints: measured.tctgd.endpoints
  };
}

function main() {
  requireTrue(fs.existsSync(SPEC_PATH), "prereg spec missing");
  requireTrue(fs.existsSync(AUTH_PATH), "Stage 1 authorization missing");
  requireTrue(fs.existsSync(LEASE_PATH), "durable execution lease missing");
  requireTrue(fs.existsSync(STAGE0_PATH), "Stage 0 result missing");
  requireTrue(!fs.existsSync(RESULT_PATH), "Stage 1 scientific result already exists; rerun prohibited");
  requireTrue(process.env.TCTGD_EXECUTION_LEASE_CONFIRMED === "true", "execution lease environment not confirmed");

  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const lease = readJson(LEASE_PATH);
  const stage0 = readJson(STAGE0_PATH);
  const stageSpec = spec.stages.find(x => x.stageId === STAGE_ID);

  requireTrue(spec.studyId === "TCTGD-STUDY1", "study ID mismatch");
  requireTrue(stageSpec && stageSpec.evidenceClass === "FRESH-DEVELOPMENT", "Stage 1 spec mismatch");
  requireTrue(auth.studyId === spec.studyId && auth.stageId === STAGE_ID, "authorization identity mismatch");
  requireTrue(auth.authorizationDecision === "STAGE1-AUTHORIZED", "Stage 1 not authorized");
  requireTrue(auth.maxScientificExecutions === 1, "exactly-one authorization mismatch");
  requireTrue(lease.studyId === spec.studyId && lease.stageId === STAGE_ID, "lease identity mismatch");
  requireTrue(String(lease.workflowRunId) === String(process.env.GITHUB_RUN_ID), "lease workflow run mismatch");
  requireTrue(lease.authorizationNonce === auth.authorizationNonce, "lease authorization nonce mismatch");
  requireTrue(lease.authorizedScientificContentHead === auth.authorizedScientificContentHead, "lease frozen content mismatch");
  requireTrue(stage0.disposition === "STAGE0-PASS", "Stage 0 not PASS");
  requireTrue(spec.protectedEvidence.standardInitialRawRootCompleteExactDepth10Holdout === "SEALED / NOT GENERATED / NOT READ", "protected holdout contract mismatch");
  verifyBlobBindings(auth);

  const prodSelectorSource = fs.readFileSync(path.join(__dirname, "lib/tctgd-stage1-production.js"), "utf8");
  const indSelectorSource = fs.readFileSync(path.join(__dirname, "lib/tctgd-stage1-independent.js"), "utf8");
  const prodEndpointSource = fs.readFileSync(path.join(__dirname, "lib/tctgd-production.js"), "utf8");
  const indEndpointSource = fs.readFileSync(path.join(__dirname, "lib/tctgd-independent.js"), "utf8");
  const staticIndependence =
    !prodSelectorSource.includes("tctgd-stage1-independent") &&
    !indSelectorSource.includes("tctgd-stage1-production") &&
    !prodEndpointSource.includes("tctgd-independent") &&
    !indEndpointSource.includes("tctgd-production") &&
    prodSelectorSource.includes("lgtgmiv-stage1-production") &&
    indSelectorSource.includes("lgtgmiv-stage1-independent") &&
    prodEndpointSource.includes("lgtgmiv-stage1-production") &&
    indEndpointSource.includes("lgtgmiv-stage1-independent") &&
    textSha256(prodSelectorSource) !== textSha256(indSelectorSource) &&
    textSha256(prodEndpointSource) !== textSha256(indEndpointSource);

  const identityDocuments = loadIdentityDocuments();
  const S = {
    seedStart: stageSpec.seedStart,
    seedEnd: stageSpec.seedEnd,
    targetPairs: stageSpec.targetPairs,
    maxSourcePly: spec.trajectoryPolicy.maxSourcePly,
    namuaPly: 24,
    mtajiMinPly: 44,
    depth: spec.relativeLocalHorizon
  };
  const perRootCeiling = spec.resourceCeilings.perRoot;
  const stageCeiling = spec.resourceCeilings.stage1;
  const stageStarted = process.hrtime.bigint();

  const pSelection = P.selectPairedRoots(E, S, identityDocuments, null);
  const iSelection = I.selectPairedRoots(E, S, identityDocuments, null);
  const pSources = pairSources(pSelection);
  const iSources = pairSources(iSelection);
  const sourceIdentityExact = deep(pSources, iSources) &&
    deep(pSelection.rejections, iSelection.rejections) &&
    pSelection.firewallDigestSha256 === iSelection.firewallDigestSha256 &&
    deep(pSelection.firewallCounts, iSelection.firewallCounts);

  const productionRoots = [], independentRoots = [], pairComparisonsP = [], pairComparisonsI = [];
  const rootChecks = [], rootTelemetry = [];
  const pairCount = Math.min(pSelection.pairs.length, iSelection.pairs.length);

  for (let idx = 0; idx < pairCount; idx++) {
    const pp = pSelection.pairs[idx], ip = iSelection.pairs[idx];
    const phases = ["namua", "mtaji"];
    const pMeasured = {}, iMeasured = {};
    for (const phase of phases) {
      const pt = timed(() => P.measureRoot(E, pp[phase]));
      const it = timed(() => I.measureRoot(E, ip[phase]));
      const pm = pt.value, im = it.value;
      pMeasured[phase] = pm;
      iMeasured[phase] = im;
      const reconstructionExact = pm.upstreamRootReconstructionCoreSha256 === im.upstreamRootReconstructionCoreSha256;
      const familyExact = {};
      for (const family of spec.eligibleMeasurementFamilies) {
        familyExact[family] = pm.upstreamFamilyCoreSha256[family] === im.upstreamFamilyCoreSha256[family];
      }
      const endpointExact = deep(pm.tctgd, im.tctgd);
      rootChecks.push({ pairId: pp.pairId, phase, source: pm.source, reconstructionExact, familyExact, endpointExact });
      rootTelemetry.push({ pairId: pp.pairId, phase, source: pm.source, production: resource(pm, pt, perRootCeiling), independent: resource(im, it, perRootCeiling) });
      productionRoots.push(rootScientificRow(pp.pairId, phase, pm));
      independentRoots.push(rootScientificRow(ip.pairId, phase, im));
    }
    pairComparisonsP.push(P.comparePair(pp.pairId, pMeasured.namua, pMeasured.mtaji));
    pairComparisonsI.push(I.comparePair(ip.pairId, iMeasured.namua, iMeasured.mtaji));
  }

  const pDevelopment = P.summarizeDevelopment(pairComparisonsP, stageSpec.targetPairs);
  const iDevelopment = I.summarizeDevelopment(pairComparisonsI, stageSpec.targetPairs);
  const pairComparisonExact = deep(pairComparisonsP, pairComparisonsI);
  const developmentExact = deep(pDevelopment, iDevelopment);
  const allRootExact = rootChecks.length === stageSpec.targetPairs * 2 && rootChecks.every(x =>
    x.reconstructionExact && x.endpointExact && spec.eligibleMeasurementFamilies.every(f => x.familyExact[f])
  );
  const populationComplete = pSelection.populationComplete && iSelection.populationComplete &&
    pSelection.selectedPairCount === stageSpec.targetPairs && iSelection.selectedPairCount === stageSpec.targetPairs;
  const rootResourcePass = rootTelemetry.length === stageSpec.targetPairs * 2 && rootTelemetry.every(x => x.production.within && x.independent.within);

  const pCore = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: STAGE_ID,
    evidenceClass: "FRESH-DEVELOPMENT",
    pairedSources: pSources,
    rootScientificRows: productionRoots,
    pairComparisons: pairComparisonsP,
    developmentSummary: pDevelopment,
    promotedCandidates: pDevelopment.promotedCandidates
  };
  const iCore = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: STAGE_ID,
    evidenceClass: "FRESH-DEVELOPMENT",
    pairedSources: iSources,
    rootScientificRows: independentRoots,
    pairComparisons: pairComparisonsI,
    developmentSummary: iDevelopment,
    promotedCandidates: iDevelopment.promotedCandidates
  };
  const pStageHash = P.digest(P.canonical(pCore));
  const iStageHash = I.digest(I.canonical(iCore));
  const stageScientificExact = pStageHash === iStageHash && deep(pCore, iCore);

  const stageElapsedMs = Number(process.hrtime.bigint() - stageStarted) / 1e6;
  const integrityPass = sourceIdentityExact && staticIndependence && allRootExact && pairComparisonExact && developmentExact && stageScientificExact;

  let stageResourcePass = rootResourcePass && stageElapsedMs <= stageCeiling.totalElapsedMs;
  let scientificResult = null, telemetry = null, resultText = "", telemetryText = "";
  for (let pass = 0; pass < 4; pass++) {
    let disposition;
    if (!integrityPass) disposition = "TECHNICAL-INVALID";
    else if (!populationComplete || !stageResourcePass) disposition = "NON-ESTIMABLE";
    else disposition = "STAGE1-PASS";

    scientificResult = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: STAGE_ID,
      evidenceClass: "FRESH-DEVELOPMENT",
      authorizedScientificExecutions: 1,
      executionLease: {
        workflowRunId: Number(lease.workflowRunId),
        authorizationNonce: lease.authorizationNonce,
        authorizedScientificContentHead: lease.authorizedScientificContentHead,
        leaseCommitSha: lease.leaseCommitSha || null
      },
      seedBlock: `${stageSpec.seedStart}..${stageSpec.seedEnd}`,
      seedBlockConsumed: true,
      noRescueBoundaryCrossed: true,
      upstreamIdentityFirewall: {
        sources: [
          { path: "doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-1/scientific-result.json", gitBlobSha: "f7eac33b14c322064dd4eb533c57ca3ba7890e77" },
          { path: "doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-2/scientific-result.json", gitBlobSha: "48ff0bcd94569db4ebd1a7f068ad7cb96031df6b" }
        ],
        productionDigestSha256: pSelection.firewallDigestSha256,
        independentDigestSha256: iSelection.firewallDigestSha256,
        counts: pSelection.firewallCounts,
        g302ScientificOutcomeLoaded: false,
        g302SelectedRootsReconstructed: false
      },
      sourceSelection: {
        production: { populationComplete: pSelection.populationComplete, selectedPairCount: pSelection.selectedPairCount, rejections: pSelection.rejections, pairs: pSources },
        independent: { populationComplete: iSelection.populationComplete, selectedPairCount: iSelection.selectedPairCount, rejections: iSelection.rejections, pairs: iSources },
        sourceIdentityExact
      },
      production: { stageScientificCore: pCore, stageScientificCoreSha256: pStageHash },
      independent: { stageScientificCoreSha256: iStageHash },
      verification: {
        populationComplete,
        staticIndependence,
        allRootExact,
        pairComparisonExact,
        developmentExact,
        stageScientificExact,
        rootChecks,
        protectedDepth10Generated: false,
        protectedDepth10Read: false
      },
      promotedCandidates: pDevelopment.promotedCandidates,
      stageResourcePass,
      stageDisposition: disposition,
      stage2AuthorizationEligible: disposition === "STAGE1-PASS" && pDevelopment.promotedCandidates.length > 0,
      noPromotedCandidateStop: disposition === "STAGE1-PASS" && pDevelopment.promotedCandidates.length === 0,
      protectedStandardRootDepth10Generated: false,
      protectedStandardRootDepth10Read: false,
      stage2Executed: false
    };
    telemetry = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: STAGE_ID,
      scientificIdentityExcluded: true,
      workflowRunId: Number(process.env.GITHUB_RUN_ID || 0),
      rootTelemetry,
      stageElapsedMs,
      stageArtifactBytes: 0,
      stageResourceCeilings: stageCeiling
    };
    resultText = JSON.stringify(scientificResult, null, 2) + "\n";
    telemetryText = JSON.stringify(telemetry, null, 2) + "\n";
    telemetry.stageArtifactBytes = Buffer.byteLength(resultText) + Buffer.byteLength(telemetryText);
    telemetryText = JSON.stringify(telemetry, null, 2) + "\n";
    const actual = rootResourcePass && stageElapsedMs <= stageCeiling.totalElapsedMs && telemetry.stageArtifactBytes <= stageCeiling.totalArtifactBytes;
    if (actual === stageResourcePass) break;
    stageResourcePass = actual;
  }

  const summary = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: STAGE_ID,
    stageDisposition: scientificResult.stageDisposition,
    selectedPairCount: pSelection.selectedPairCount,
    selectedRootCount: pSelection.selectedRootCount,
    promotedCandidates: scientificResult.promotedCandidates,
    stage2AuthorizationEligible: scientificResult.stage2AuthorizationEligible,
    noPromotedCandidateStop: scientificResult.noPromotedCandidateStop,
    productionStageScientificCoreSha256: pStageHash,
    independentStageScientificCoreSha256: iStageHash,
    scientificResultFileSha256: textSha256(resultText),
    telemetryFileSha256: textSha256(telemetryText),
    freshScientificSeedAccessed: true,
    noRescueBoundaryCrossed: true,
    protectedStandardRootDepth10Generated: false,
    protectedStandardRootDepth10Read: false
  };

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "scientific-result.json"), resultText);
  fs.writeFileSync(path.join(OUT, "telemetry.json"), telemetryText);
  fs.writeFileSync(path.join(OUT, "execution-summary.json"), JSON.stringify(summary, null, 2) + "\n");
  console.log("TCTGD_STAGE1_RESULT=" + JSON.stringify(summary));

  if (scientificResult.stageDisposition === "TECHNICAL-INVALID") process.exitCode = 2;
  else if (scientificResult.stageDisposition === "NON-ESTIMABLE") process.exitCode = 3;
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT, { recursive: true });
  const failure = {
    schemaVersion: 1,
    studyId: "TCTGD-STUDY1",
    stageId: STAGE_ID,
    stageDisposition: "TECHNICAL-INVALID",
    errorName: error && error.name ? error.name : "Error",
    errorMessage: error && error.message ? error.message : String(error),
    freshScientificEvidenceMayHaveBeenAccessed: true,
    protectedStandardRootDepth10Generated: false,
    protectedStandardRootDepth10Read: false,
    sameEvidenceRerunAuthorized: false
  };
  fs.writeFileSync(path.join(OUT, "technical-failure.json"), JSON.stringify(failure, null, 2) + "\n");
  console.error("TCTGD_STAGE1_TECHNICAL_FAILURE=" + JSON.stringify(failure));
  process.exitCode = 2;
}
