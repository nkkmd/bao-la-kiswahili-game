#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const cp = require("node:child_process");
const { performance } = require("node:perf_hooks");
const P = require("./lib/psrre-stage1-production.js");
const I = require("./lib/psrre-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.resolve(process.argv[2] || "artifacts/local/psrre-stage1-development");
const DOC = "doc/prospective-strategic-regime-representation-eligibility";
const PATHS = {
  spec: `${DOC}/prereg/STAGE_1_DEVELOPMENT_SPEC.json`,
  dict: `${DOC}/prereg/STAGE_1_FEATURE_DICTIONARY.json`,
  stage2: `${DOC}/prereg/STAGE_2_VALIDATION_CONTRACT.json`,
  execution: `${DOC}/prereg/STAGE_1_EXECUTION_CONTRACT.json`,
  smoke: `${DOC}/results/STAGE_1_TOOLING_SMOKE_RESULT.json`,
  preflight: `${DOC}/results/STAGE_1_PACKAGING_PREFLIGHT_RESULT.json`,
  authorization: `${DOC}/authorizations/STAGE_1_EXECUTION_AUTHORIZATION.json`,
};

function abs(p) { return path.join(ROOT, p); }
function readJson(p) { return JSON.parse(fs.readFileSync(abs(p), "utf8")); }
function sha256Buffer(b) { return crypto.createHash("sha256").update(b).digest("hex"); }
function fileSha256(p) { return sha256Buffer(fs.readFileSync(abs(p))); }
function stable(v) { return P.stableStringify(v); }
function exact(a, b) { return stable(a) === stable(b); }
function canonicalHash(v) { return sha256Buffer(Buffer.from(stable(v), "utf8")); }
function git(...args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function blobSha(p) { return git("hash-object", p); }
function ensure(x, m) { if (!x) throw new Error(m); }
function write(name, value) {
  const target = path.join(OUT, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n");
}
function gzip(name, value) {
  const target = path.join(OUT, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const bytes = zlib.gzipSync(Buffer.from(JSON.stringify(value)), { level: 9 });
  fs.writeFileSync(target, bytes);
  return { bytes: bytes.length, sha256: sha256Buffer(bytes) };
}
function walkFiles(dir, rel = "", out = {}) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name), r = path.join(rel, e.name);
    if (e.isDirectory()) walkFiles(p, r, out);
    else out[r] = { bytes: fs.statSync(p).size, sha256: sha256Buffer(fs.readFileSync(p)) };
  }
  return out;
}
function summarizeCandidate(c) {
  return {
    familyId: c.familyId,
    k: c.k,
    eligible: c.summary.eligible,
    minimumSupportFraction: c.summary.minimumSupportFraction,
    meanSilhouette: c.summary.meanSilhouette,
    fiveFoldAssignmentStability: c.summary.fiveFoldAssignmentStability,
    maximumSingleSourcePolicyShare: c.summary.maximumSingleSourcePolicyShare,
    support: c.summary.support,
    foldScores: c.summary.foldScores,
    trainingPrototypeDistanceP99ByRegime: c.metrics.trainingPrototypeDistanceP99ByRegime,
  };
}
function readiness(spec, dict, selection, scaler, comparison) {
  const rawKeys = selection.selected.map((x) => x.rawStateKey);
  const active = new Set(scaler.nonzeroMadFeatureIds);
  const activeFamilies = new Set(dict.features.filter((f) => active.has(f.id)).map((f) => f.family));
  const requiredStrata = spec.rootSelection.stratumQuota.fixedStratumOrder;
  const checks = {
    generatedGames: selection.generatedGames === spec.readinessGates.generatedGamesExact,
    uniqueTrajectories: selection.uniqueTrajectories >= spec.readinessGates.minimumUniqueTrajectoriesGenerated,
    distinctOpeningPrefixes: selection.distinctOpeningPrefixes >= spec.readinessGates.minimumDistinctOpeningPrefixesGenerated,
    selectedRoots: selection.selectedRoots === spec.readinessGates.selectedRootsExact,
    strata: requiredStrata.every((s) => selection.stratumCounts[s] === spec.readinessGates.eachPhaseSourcePolicyStratumExact),
    rawUnique: new Set(rawKeys).size === rawKeys.length,
    selectedOpeningPrefixes: selection.selectedDistinctOpeningPrefixes >= spec.readinessGates.minimumDistinctSelectedOpeningPrefixes,
    maxOpeningShare: selection.maximumSingleSelectedOpeningPrefixShare <= spec.readinessGates.maximumSingleSelectedOpeningPrefixShare,
    nonzeroMadFeatures: scaler.nonzeroMadFeatureIds.length >= spec.readinessGates.minimumNonzeroMadFeatures,
    activeFeatureFamilies: activeFamilies.size >= spec.readinessGates.minimumFeatureFamiliesWithNonzeroMad,
    sourceExact: comparison.sourceExact,
    selectionExact: comparison.selectionExact,
    featureExact: comparison.featureExact,
    scalerExact: comparison.scalerExact,
    pcaWardPamCandidateExact: comparison.candidateEvaluationExact,
    selectedRepresentationExact: comparison.frozenRepresentationExact,
  };
  return {
    checks,
    passed: Object.values(checks).every(Boolean),
    nonzeroMadFeatureIds: scaler.nonzeroMadFeatureIds,
    zeroMadFeatureIds: scaler.zeroMadFeatureIds,
    activeFeatureFamilies: [...activeFamilies].sort(),
  };
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "production"), { recursive: true });
fs.mkdirSync(path.join(OUT, "independent"), { recursive: true });
let consumed = false;

try {
  const spec = readJson(PATHS.spec);
  const dict = readJson(PATHS.dict);
  const stage2 = readJson(PATHS.stage2);
  const execution = readJson(PATHS.execution);
  const smoke = readJson(PATHS.smoke);
  const preflight = readJson(PATHS.preflight);
  const auth = readJson(PATHS.authorization);
  const head = git("rev-parse", "HEAD");
  const parent = git("rev-parse", "HEAD^");

  ensure(auth.authorized === true, "Stage 1 scientific authorization absent");
  ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "authorization identity mismatch");
  ensure(auth.sourceFreezeCommit === parent, "authorization commit must directly follow source-freeze commit");
  ensure(preflight.sourceCommit === auth.sourceFreezeCommit, "preflight/source-freeze mismatch");
  ensure(smoke.disposition === "TOOLING-SMOKE-PASS", "tooling smoke not passed");
  ensure(preflight.disposition === "STAGE1-PACKAGING-PREFLIGHT-PASS", "packaging preflight not passed");
  ensure(auth.seedBlock.start === spec.seedBlock.seedStart && auth.seedBlock.end === spec.seedBlock.seedEnd, "authorized seed mismatch");
  ensure(auth.seedBlock.statusBeforeExecution === "RESERVED_UNCONSUMED", "seed status not reserved/unconsumed");
  ensure(auth.stage2ScientificExecutionAuthorized === false && auth.g2_11Authorized === false, "downstream authorization unexpectedly true");

  const bindings = {
    stage1SpecSha256: fileSha256(PATHS.spec),
    featureDictionarySha256: fileSha256(PATHS.dict),
    stage2ValidationContractSha256: fileSha256(PATHS.stage2),
    executionContractSha256: fileSha256(PATHS.execution),
    toolingSmokeResultSha256: fileSha256(PATHS.smoke),
    packagingPreflightResultSha256: fileSha256(PATHS.preflight),
  };
  for (const [k, v] of Object.entries(bindings)) ensure(auth.bindings[k] === v, `authorization binding mismatch ${k}`);
  for (const p of execution.sourcePathsToBind) ensure(auth.sourceBlobSha1[p] === blobSha(p), `source blob mismatch ${p}`);

  const consumption = {
    schemaVersion: "PSRRE_STAGE1_CONSUMPTION_RECORD_V1",
    studyId: spec.studyId,
    stageId: spec.stageId,
    executionHead: head,
    sourceFreezeCommit: auth.sourceFreezeCommit,
    seedStart: spec.seedBlock.seedStart,
    seedEnd: spec.seedBlock.seedEnd,
    games: spec.seedBlock.games,
    status: "CONSUMED",
    consumeOnce: true,
    sameBlockRerunAuthorized: false,
    scientificGenerationStartedAfterThisRecord: true,
    g2_11OutcomeInspected: false,
    bindings,
  };
  write("CONSUMPTION_RECORD.json", consumption);
  consumed = true;

  let t = performance.now();
  const pRecords = P.generate(spec, {});
  const pSelection = P.select(pRecords, spec, {});
  const pAnalyses = pSelection.selected.map((r) => P.analyzeSelected(r, dict, 1));
  const pScaler = P.fitScaler(pAnalyses, dict);
  const pEvaluation = P.evaluateAll(pAnalyses, dict, spec);
  const pFrozen = P.frozenRepresentation(pEvaluation.winner, pAnalyses, dict, bindings.featureDictionarySha256);
  const productionMs = performance.now() - t;

  t = performance.now();
  const iRecords = I.generate(spec, {});
  const iSelection = I.select(iRecords, spec, {});
  const iAnalyses = iSelection.selected.map((r) => I.analyzeSelected(r, dict, 1));
  const iScaler = I.fitScaler(iAnalyses, dict);
  const iEvaluation = I.evaluateAll(iAnalyses, dict, spec);
  const iFrozen = I.frozenRepresentation(iEvaluation.winner, iAnalyses, dict, bindings.featureDictionarySha256);
  const independentMs = performance.now() - t;

  const comparison = {
    sourceExact: exact(pRecords, iRecords),
    selectionExact: exact(pSelection, iSelection),
    featureExact: exact(pAnalyses, iAnalyses),
    scalerExact: exact(pScaler, iScaler),
    candidateEvaluationExact: exact(pEvaluation, iEvaluation),
    frozenRepresentationExact: exact(pFrozen, iFrozen),
  };
  comparison.fullExact = Object.values(comparison).every(Boolean);
  write("FINAL_EXACT_COMPARISON.json", comparison);

  const readinessResult = readiness(spec, dict, pSelection, pScaler, comparison);
  const selectedRepresentation = pFrozen;
  const candidateSummaries = pEvaluation.candidates.map(summarizeCandidate);

  const productionPayload = {
    records: pRecords,
    selection: pSelection,
    analyses: pAnalyses,
    scaler: pScaler,
    evaluation: pEvaluation,
    frozenRepresentation: pFrozen,
  };
  const independentPayload = {
    records: iRecords,
    selection: iSelection,
    analyses: iAnalyses,
    scaler: iScaler,
    evaluation: iEvaluation,
    frozenRepresentation: iFrozen,
  };
  const pShard = gzip("production/full-shard-0001.json.gz", productionPayload);
  const iShard = gzip("independent/full-shard-0001.json.gz", independentPayload);

  const maxRssKb = process.resourceUsage().maxRSS;
  const resourceChecks = {
    productionWall: productionMs <= spec.artifactContract.productionWallClockCeilingMs,
    independentWall: independentMs <= spec.artifactContract.independentWallClockCeilingMs,
    rss: maxRssKb <= spec.artifactContract.peakRssCeilingKb,
    productionShard: pShard.bytes <= spec.artifactContract.compressedShardCeilingBytes,
    independentShard: iShard.bytes <= spec.artifactContract.compressedShardCeilingBytes,
    totalCompressed: pShard.bytes + iShard.bytes <= spec.artifactContract.totalCompressedArtifactCeilingBytes,
  };
  const resourcePass = Object.values(resourceChecks).every(Boolean);

  let disposition;
  if (!comparison.fullExact) disposition = "STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID";
  else if (!resourcePass) disposition = "STAGE1-RESOURCE-CENSORED";
  else if (!readinessResult.passed) disposition = "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE";
  else if (!selectedRepresentation) disposition = "STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION";
  else disposition = "STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN";

  const core = {
    schemaVersion: "PSRRE_STAGE1_DEVELOPMENT_RESULT_V1",
    researchGeneration: "Research Generation 2",
    agendaLabel: null,
    studyId: spec.studyId,
    stageId: spec.stageId,
    executionHead: head,
    sourceFreezeCommit: auth.sourceFreezeCommit,
    seedBlock: { start: spec.seedBlock.seedStart, end: spec.seedBlock.seedEnd, games: spec.seedBlock.games, status: "CONSUMED" },
    technicalVerification: comparison,
    population: {
      generatedGames: pSelection.generatedGames,
      uniqueTrajectories: pSelection.uniqueTrajectories,
      distinctOpeningPrefixes: pSelection.distinctOpeningPrefixes,
      selectedRoots: pSelection.selectedRoots,
      stratumCounts: pSelection.stratumCounts,
      selectedDistinctOpeningPrefixes: pSelection.selectedDistinctOpeningPrefixes,
      maximumSingleSelectedOpeningPrefixShare: pSelection.maximumSingleSelectedOpeningPrefixShare,
      selectionHash: pSelection.selectionHash,
    },
    features: {
      featureWidth: dict.featureCount,
      nonzeroMadFeatureCount: pScaler.nonzeroMadFeatureIds.length,
      nonzeroMadFeatureIds: pScaler.nonzeroMadFeatureIds,
      zeroMadFeatureIds: pScaler.zeroMadFeatureIds,
      activeFeatureFamilies: readinessResult.activeFeatureFamilies,
    },
    candidateRepresentations: candidateSummaries,
    scientificReadiness: readinessResult,
    selectedRepresentation: selectedRepresentation ? {
      familyId: selectedRepresentation.familyId,
      K: selectedRepresentation.K,
      trainingSupportByRegime: selectedRepresentation.trainingSupportByRegime,
      meanSilhouette: selectedRepresentation.meanSilhouette,
      fiveFoldAssignmentStability: selectedRepresentation.fiveFoldAssignmentStability,
      sourcePolicyShareByRegime: selectedRepresentation.sourcePolicyShareByRegime,
      trainingPrototypeDistanceP99ByRegime: selectedRepresentation.trainingPrototypeDistanceP99ByRegime,
    } : null,
    resource: {
      productionMs,
      independentMs,
      maxRssKb,
      productionFullShard: pShard,
      independentFullShard: iShard,
      checks: resourceChecks,
      passed: resourcePass,
    },
    disposition,
    scientificInferenceAuthorized: comparison.fullExact && resourcePass,
    scientificOutcomeGenerated: true,
    stage2AutomaticallyAuthorized: false,
    stage2ScientificExecutionAuthorized: false,
    g2_11Authorized: false,
    g2_11OutcomeInspected: false,
    interpretationBoundary: {
      humanClaimAuthorized: false,
      gameTheoreticTruthAuthorized: false,
      longHorizonTransitionAuthorized: false,
      c03GeneralizationAuthorized: false,
      g2_10RescueAuthorized: false,
      developmentPopulationReusableAsStage2Evidence: false,
    },
  };
  core.resultSha256 = canonicalHash(core);
  write("ESSENTIAL_CORE.json", core);
  write("STAGE_1_DEVELOPMENT_RESULT.json", core);
  if (disposition === "STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN") write("FROZEN_REPRESENTATION.json", selectedRepresentation);

  const mandatoryExpected = execution.artifactContract.mandatoryAlways.slice();
  if (disposition === "STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN") mandatoryExpected.push(...execution.artifactContract.mandatoryOnRepresentationPass);
  const presentBeforeManifest = new Set(Object.keys(walkFiles(OUT)));
  const mandatoryMissingBeforeManifest = mandatoryExpected.filter((p) => p !== "HASH_MANIFEST.json" && !presentBeforeManifest.has(p));
  ensure(mandatoryMissingBeforeManifest.length === 0, `mandatory artifact missing: ${mandatoryMissingBeforeManifest.join(",")}`);

  const manifest = { schemaVersion: "PSRRE_STAGE1_HASH_MANIFEST_V1", studyId: spec.studyId, stageId: spec.stageId, files: walkFiles(OUT) };
  write("HASH_MANIFEST.json", manifest);

  console.log(JSON.stringify({
    studyId: spec.studyId,
    stageId: spec.stageId,
    disposition,
    selectedRepresentation: core.selectedRepresentation,
    scientificReadinessPassed: readinessResult.passed,
    fullExact: comparison.fullExact,
    scientificSeedsUsed: [spec.seedBlock.seedStart, spec.seedBlock.seedEnd],
    stage2ScientificExecutionAuthorized: false,
    g2_11Authorized: false,
  }, null, 2));
} catch (error) {
  if (consumed) {
    write("STAGE_1_EXECUTION_FAILURE.json", {
      schemaVersion: "PSRRE_STAGE1_EXECUTION_FAILURE_V1",
      studyId: "PSRRE-STUDY1",
      stageId: "PSRRE-S1-DEVELOPMENT-2026-08-30-v1",
      seedStatus: "CONSUMED",
      disposition: "STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID",
      error: { name: error.name, message: error.message, stack: error.stack },
      sameBlockRerunAuthorized: false,
      stage2ScientificExecutionAuthorized: false,
      g2_11Authorized: false,
    });
  }
  throw error;
}
