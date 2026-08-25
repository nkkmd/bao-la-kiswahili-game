#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const manifestPath = path.join(
  ROOT,
  "doc/ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json",
);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.program, "PBAI-P1");
assert.equal(manifest.phase, "PBAI-B");
assert.equal(manifest.baselineId, "AI-GEN2-BASELINE-2026-08-26-v1");
assert.equal(manifest.baselineFrozen, true);
assert.equal(manifest.generationLineage, "AI-GEN2");
assert.equal(manifest.sourceOfTruth.repositoryCommit,
  "f4ae3b11901180cbe417b3e643e2b357d8045d2d");
assert.equal(manifest.sourceOfTruth.publicDirectory, "public/");
assert.equal(manifest.sourceOfTruth.publicEndpoint,
  "https://bao-la-kiswahili.cultivationdata.net/");
assert.equal(manifest.sourceOfTruth.providerDeploymentId, null);
assert.equal(manifest.sourceOfTruth.exactLiveAssetByteComparisonPerformed, false);

const expectedFiles = [
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "public/ai-config.js",
  "public/ai-worker.js",
  "public/main.js",
  "public/index.html",
  "public/service-worker.js",
];
assert.deepEqual(Object.keys(manifest.fileIdentity), expectedFiles);

for (const rel of expectedFiles) {
  const bytes = fs.readFileSync(path.join(ROOT, rel));
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  assert.equal(bytes.length, manifest.fileIdentity[rel].bytes, `${rel} byte length matches freeze`);
  assert.equal(sha256, manifest.fileIdentity[rel].sha256, `${rel} SHA-256 matches freeze`);
}

assert.equal(manifest.evaluation.publicDefaultProfile, "bao");
assert.equal(manifest.evaluation.baoV2IsAI_GEN2, false);
assert.equal(manifest.search.adaptivePublicDefault, false);
assert.equal(manifest.search.hard.standard.maxDepth, 8);
assert.equal(manifest.search.hard.standard.timeLimitMs, 500);
assert.equal(manifest.search.expert.standard.maxDepth, 12);
assert.equal(manifest.search.expert.standard.timeLimitMs, 2000);
assert.equal(manifest.search.quiescence.depth, 1);
assert.equal(manifest.search.transpositionTable.maxEntries, 50000);
assert.equal(manifest.search.evaluationCache.maxEntries, 2048);
assert.equal(manifest.identityBoundary.currentAIStateKeyIncludesPending, false);
assert.equal(manifest.identityBoundary.authoritativeResearchRawIdentityInterchangeable, false);
assert.equal(manifest.pwa.cacheVersion, "bao-la-kiswahili-v24");
assert.equal(manifest.deterministicInspection.relevantRegressionSuite, "PASS");
assert.equal(manifest.operationalInspection.notAcceptanceThreshold, true);
assert.equal(manifest.operationalInspection.notCrossDeviceGuarantee, true);
assert.equal(manifest.authorization.candidateImplementationAuthorized, false);
assert.equal(manifest.authorization.authorizedForDevelopmentCount, 0);
assert.equal(manifest.authorization.PBAI_C_numericGatesFrozen, false);
assert.equal(manifest.authorization.AI_GEN3PromotionAuthorized, false);

console.log("PBAI-P1 AI-GEN2 frozen baseline verification: PASS");
