#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const P = require("./lib/sfcdft4-artifact-pipeline.js");

function need(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    out[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  }
  return out;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function main() {
  const args = parseArgs();
  const mode = args.mode;
  need(mode === "build" || mode === "verify", "--mode must be build or verify");

  if (mode === "build") {
    need(typeof args.output === "string", "--output required");
    const output = path.resolve(args.output);
    const result = P.buildBundle(output);
    const summary = {
      event: "SFCDFT4-STAGE0-SYNTHETIC-BUNDLE-BUILT",
      studyId: P.STUDY_ID,
      stageId: P.STAGE_ID,
      fixtureOnly: true,
      scientificSeedReads: 0,
      scientificOutputsGenerated: 0,
      selectedPairCount: result.selectionManifest.selectedPairCount,
      bundleCoreSha256: result.bundleManifest.deterministicCoreSha256,
      selectionDigest: result.selectionManifest.selectionDigest
    };
    process.stdout.write(JSON.stringify(summary) + "\n");
    return;
  }

  need(typeof args.input === "string", "--input required");
  need(typeof args.output === "string", "--output required");
  const input = path.resolve(args.input);
  const output = path.resolve(args.output);
  const verified = P.validateBundle(input);
  const scratch = path.join(path.dirname(output), "negative-fixtures");
  const negativeFixturesPassed = P.runNegativeFixtures(input, scratch);
  fs.rmSync(scratch, { recursive: true, force: true });

  const requiredNegative = [
    "missing-bundle",
    "malformed-json",
    "schema-version-mismatch",
    "missing-selected-pair",
    "duplicate-pair-identity",
    "bundle-digest-mismatch",
    "manifest-content-mismatch",
    "wrong-study-stage-identity",
    "scientific-seed-marker-contamination"
  ];
  need(P.stable([...negativeFixturesPassed].sort()) === P.stable([...requiredNegative].sort()), "negative fixture coverage mismatch");

  const aggregateDigest = P.canonicalSha256(verified.aggregate);
  const core = {
    studyId: P.STUDY_ID,
    stageId: P.STAGE_ID,
    evidenceClass: "TECHNICAL-FIXTURE-E2E",
    decision: "STAGE0-PASS",
    artifactRoundTrip: {
      uploadBoundary: "GITHUB-ACTIONS-UPLOAD-ARTIFACT",
      retrievalBoundary: "GITHUB-ACTIONS-DOWNLOAD-ARTIFACT",
      retrievedBundleValidated: true,
      bundleCoreSha256: verified.manifest.deterministicCoreSha256
    },
    gates: {
      deterministicSyntheticSourceFixture: true,
      deterministicSourceClassification: true,
      deterministicFrozenSelectionRepresentation: true,
      productionEquivalentSourceBundleConstruction: true,
      artifactUploadRetrievalRoundTrip: true,
      retrievedBundleDigestManifestExact: true,
      measurementConsumerParse: true,
      productionIndependentDryRunExact: verified.selection.productionIndependentExact === true,
      aggregateFixedEightSchema: verified.aggregate.familySize === 8 && verified.aggregate.cells.length === 8,
      negativeFixturesFailClosed: negativeFixturesPassed.length === requiredNegative.length
    },
    negativeFixturesPassed,
    selectedPairCount: verified.selection.selectedPairCount,
    sourceFixtureCount: verified.sourceSummary.fixtureCount,
    aggregateStructureSha256: aggregateDigest,
    freshScientificSeedReads: 0,
    scientificOutputsGenerated: 0,
    scientificEffectMagnitudeGenerated: false,
    effectDirectionGenerated: false,
    pValueGenerated: false,
    generalizationDecisionGenerated: false,
    counterexampleDecisionGenerated: false,
    automaticStage1Authorization: false,
    stage1FreshScientificAccessAuthorized: false,
    stage2FreshScientificAccessAuthorized: false,
    mainIntegrationAuthorized: false,
    publicAiChangeAuthorized: false
  };
  const result = {
    schemaVersion: 1,
    ...core,
    deterministicCoreSha256: P.canonicalSha256(core)
  };
  writeJson(output, result);
  process.stdout.write(JSON.stringify({
    event: "SFCDFT4-STAGE0-E2E-VERIFIED",
    decision: result.decision,
    deterministicCoreSha256: result.deterministicCoreSha256,
    bundleCoreSha256: verified.manifest.deterministicCoreSha256,
    negativeFixtureCount: negativeFixturesPassed.length,
    freshScientificSeedReads: 0,
    scientificOutputsGenerated: 0
  }) + "\n");
}

main();
