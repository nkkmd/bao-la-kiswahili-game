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
const OUT = path.resolve(process.argv[2] || "artifacts/local/psrre-stage1-packaging-preflight");
const DOC = "doc/prospective-strategic-regime-representation-eligibility";
function abs(p) { return path.join(ROOT, p); }
function readJson(p) { return JSON.parse(fs.readFileSync(abs(p), "utf8")); }
function stable(v) { return P.stableStringify(v); }
function exact(a, b) { return stable(a) === stable(b); }
function shaBuffer(b) { return crypto.createHash("sha256").update(b).digest("hex"); }
function sha(s) { return shaBuffer(Buffer.from(String(s), "utf8")); }
function fileSha256(p) { return shaBuffer(fs.readFileSync(abs(p))); }
function git(...args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function blobSha1(p) { return git("hash-object", p); }
function gzipBytes(v) { return zlib.gzipSync(Buffer.from(JSON.stringify(v)), { level: 9 }); }
function write(name, v) { fs.writeFileSync(path.join(OUT, name), JSON.stringify(v, null, 2) + "\n"); }
function syntheticRows(dict, n) {
  const rows = [];
  for (let i = 0; i < n; i += 1) {
    const features = {};
    for (let j = 0; j < dict.features.length; j += 1) {
      const group = i % 4;
      const anchor = [-6, -2, 2, 6][group];
      features[dict.features[j].id] = anchor + ((i % 11) - 5) * (j + 1) / 37 + ((i % 7) - 3) / 41;
    }
    rows.push({
      rawStateKey: sha(`PSRRE-PREFLIGHT-SYNTH|${String(i).padStart(4, "0")}`),
      seed: i,
      sourcePolicy: ["UNIFORM", "CAPTURE_FIRST", "HIGH_CAPTURE", "LOW_CAPTURE"][i % 4],
      phase: i % 2 ? "mtaji" : "namua",
      ply: 20 + (i % 60),
      trajectoryHash: sha(`PSRRE-PREFLIGHT-TR|${i}`),
      openingPrefixHash: sha(`PSRRE-PREFLIGHT-OP|${i}`),
      features,
    });
  }
  return rows;
}
function stripRoots(records) {
  return records.map((r) => ({ gameSummary: r.gameSummary, candidate: r.candidate ? { ...r.candidate, root: undefined } : null }));
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const specPath = `${DOC}/prereg/STAGE_1_DEVELOPMENT_SPEC.json`;
const dictPath = `${DOC}/prereg/STAGE_1_FEATURE_DICTIONARY.json`;
const stage2Path = `${DOC}/prereg/STAGE_2_VALIDATION_CONTRACT.json`;
const executionPath = `${DOC}/prereg/STAGE_1_EXECUTION_CONTRACT.json`;
const smokePath = `${DOC}/results/STAGE_1_TOOLING_SMOKE_RESULT.json`;
const spec = readJson(specPath);
const dict = readJson(dictPath);
const execution = readJson(executionPath);
const smoke = readJson(smokePath);
const sourceCommit = git("rev-parse", "HEAD");
const technicalStart = execution.preflight.technicalSeedStart;
const technicalEnd = execution.preflight.technicalSeedEnd;
if (smoke.disposition !== "TOOLING-SMOKE-PASS") throw new Error("tooling smoke not passed");
if (technicalStart !== 29500001 || technicalEnd !== 29500064) throw new Error("technical seed contract drift");
if (!(technicalEnd < spec.seedBlock.seedStart)) throw new Error("technical/scientific seed overlap");

const authorizationBindingInputs = {
  stage1SpecSha256: fileSha256(specPath),
  featureDictionarySha256: fileSha256(dictPath),
  stage2ValidationContractSha256: fileSha256(stage2Path),
  executionContractSha256: fileSha256(executionPath),
  toolingSmokeResultSha256: fileSha256(smokePath),
  sourceBlobSha1: Object.fromEntries(execution.sourcePathsToBind.map((p) => [p, blobSha1(p)])),
};

let t = performance.now();
const pg = P.generate(spec, { games: 64, seedStart: technicalStart, maxPly: spec.sourceGeneration.maxPly });
const ps = P.select(pg, spec, { quotaPerStratum: 1 });
const pa = ps.selected.map((r) => P.analyzeSelected(r, dict, 1));
const pScaler = P.fitScaler(pa, dict);
const pTechnicalMs = performance.now() - t;

t = performance.now();
const ig = I.generate(spec, { games: 64, seedStart: technicalStart, maxPly: spec.sourceGeneration.maxPly });
const is = I.select(ig, spec, { quotaPerStratum: 1 });
const ia = is.selected.map((r) => I.analyzeSelected(r, dict, 1));
const iScaler = I.fitScaler(ia, dict);
const iTechnicalMs = performance.now() - t;

const sourceExact = exact(stripRoots(pg), stripRoots(ig));
const selectionExact = exact({ ...ps, selected: ps.selected.map((x) => ({ ...x, root: undefined })) }, { ...is, selected: is.selected.map((x) => ({ ...x, root: undefined })) });
const featureExact = exact(pa, ia);
const scalerExact = exact(pScaler, iScaler);
if (ps.selectedRoots !== 8 || is.selectedRoots !== 8) throw new Error(`technical preflight expected 8 roots, got ${ps.selectedRoots}/${is.selectedRoots}`);

const synth = syntheticRows(dict, execution.preflight.syntheticStressRows);
t = performance.now();
const pModel = P.evaluateAll(synth, dict, spec);
const pModelMs = performance.now() - t;
t = performance.now();
const iModel = I.evaluateAll(synth, dict, spec);
const iModelMs = performance.now() - t;
const modelExact = exact(pModel, iModel);

const pSourcePayload = { records: pg, selection: ps, analyses: pa, scaler: pScaler };
const iSourcePayload = { records: ig, selection: is, analyses: ia, scaler: iScaler };
const pModelPayload = { syntheticModelStress: pModel };
const iModelPayload = { syntheticModelStress: iModel };
const pSourceGz = gzipBytes(pSourcePayload), iSourceGz = gzipBytes(iSourcePayload);
const pModelGz = gzipBytes(pModelPayload), iModelGz = gzipBytes(iModelPayload);
const pCombinedGz = gzipBytes({ ...pSourcePayload, ...pModelPayload });
const iCombinedGz = gzipBytes({ ...iSourcePayload, ...iModelPayload });
fs.writeFileSync(path.join(OUT, "production-preflight.json.gz"), pCombinedGz);
fs.writeFileSync(path.join(OUT, "independent-preflight.json.gz"), iCombinedGz);

const artifactSafety = execution.preflight.artifactProjectionSafetyMultiplier;
const sourceArtifactScale = execution.preflight.projectedRootScaleFactor * artifactSafety;
const modelRowScale = spec.readinessGates.selectedRootsExact / execution.preflight.syntheticStressRows;
if (!Number.isFinite(modelRowScale) || modelRowScale < 1) throw new Error("invalid model row scale");
const modelArtifactScale = modelRowScale * artifactSafety;
const pProjectedBytes = pSourceGz.length * sourceArtifactScale + pModelGz.length * modelArtifactScale;
const iProjectedBytes = iSourceGz.length * sourceArtifactScale + iModelGz.length * modelArtifactScale;

const modelScale = execution.preflight.modelCubicScaleFactorFrom128To512 * execution.preflight.runtimeProjectionSafetyMultiplier;
const sourceScale = execution.preflight.projectedRootScaleFactor * execution.preflight.runtimeProjectionSafetyMultiplier;
const pProjectedMs = pTechnicalMs * sourceScale + pModelMs * modelScale;
const iProjectedMs = iTechnicalMs * sourceScale + iModelMs * modelScale;
const rssKb = process.resourceUsage().maxRSS;

const checks = {
  toolingSmokePass: smoke.disposition === "TOOLING-SMOKE-PASS",
  noScientificSeedUse: technicalEnd < spec.seedBlock.seedStart,
  sourceGenerationExact: sourceExact,
  rootSelectionExact: selectionExact,
  featureExact,
  scalerExact,
  fullCandidateModelStressExact: modelExact,
  projectedProductionWall: pProjectedMs <= spec.artifactContract.productionWallClockCeilingMs,
  projectedIndependentWall: iProjectedMs <= spec.artifactContract.independentWallClockCeilingMs,
  projectedProductionShard: pProjectedBytes <= spec.artifactContract.compressedShardCeilingBytes,
  projectedIndependentShard: iProjectedBytes <= spec.artifactContract.compressedShardCeilingBytes,
  projectedTotalCompressed: pProjectedBytes + iProjectedBytes <= spec.artifactContract.totalCompressedArtifactCeilingBytes,
  rss: rssKb <= spec.artifactContract.peakRssCeilingKb,
};
const passed = Object.values(checks).every(Boolean);
const result = {
  schemaVersion: "PSRRE_STAGE1_PACKAGING_PREFLIGHT_RESULT_V1",
  studyId: spec.studyId,
  stageId: spec.stageId,
  sourceCommit,
  projectionImplementation: "COMPONENT-WISE-V2",
  projectionRepairOnly: true,
  scientificContractChangedByRepair: false,
  resourceCeilingChangedByRepair: false,
  authorizationBindingInputs,
  disposition: passed ? "STAGE1-PACKAGING-PREFLIGHT-PASS" : "STAGE1-PACKAGING-PREFLIGHT-FAIL",
  checks,
  technicalSeedsUsed: [technicalStart, technicalEnd],
  scientificSeedsUsed: [],
  scientificOutcomeGenerated: false,
  scientificPerformanceInterpreted: false,
  g2_11OutcomeInspected: false,
  technical: {
    games: 64,
    selectedRoots: ps.selectedRoots,
    productionMs: pTechnicalMs,
    independentMs: iTechnicalMs,
    syntheticStressRows: synth.length,
    productionModelStressMs: pModelMs,
    independentModelStressMs: iModelMs,
    productionSourceCompressedBytes: pSourceGz.length,
    independentSourceCompressedBytes: iSourceGz.length,
    productionModelCompressedBytes: pModelGz.length,
    independentModelCompressedBytes: iModelGz.length,
    productionCombinedCompressedBytes: pCombinedGz.length,
    independentCombinedCompressedBytes: iCombinedGz.length,
    maxRssKb: rssKb
  },
  projection: {
    sourceScaleFactorWithSafety: sourceScale,
    modelRuntimeScaleFactorWithSafety: modelScale,
    sourceArtifactScaleFactorWithSafety: sourceArtifactScale,
    modelRowScale: modelRowScale,
    modelArtifactScaleFactorWithSafety: modelArtifactScale,
    artifactProjectionSafetyMultiplier: artifactSafety,
    projectedProductionMs: pProjectedMs,
    projectedIndependentMs: iProjectedMs,
    projectedProductionShardBytes: pProjectedBytes,
    projectedIndependentShardBytes: iProjectedBytes,
    projectedTotalCompressedBytes: pProjectedBytes + iProjectedBytes,
    frozenProductionShardCeilingBytes: spec.artifactContract.compressedShardCeilingBytes,
    frozenIndependentShardCeilingBytes: spec.artifactContract.compressedShardCeilingBytes,
    frozenTotalCompressedCeilingBytes: spec.artifactContract.totalCompressedArtifactCeilingBytes
  },
  stage1ScientificExecutionAuthorized: false,
  stage2ScientificExecutionAuthorized: false,
  g2_11Authorized: false
};
write("preflight-result.json", result);
write("authorization-binding-inputs.json", authorizationBindingInputs);
console.log(JSON.stringify(result, null, 2));
if (!passed) process.exitCode = 2;
