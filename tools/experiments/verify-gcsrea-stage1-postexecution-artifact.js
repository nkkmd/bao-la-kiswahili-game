#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function need(value, message) {
  if (!value) throw new Error(message);
}
function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function collectForbiddenPayload(value, pathPrefix = "$") {
  const findings = [];
  const allowedFalseFlags = new Set([
    "pValuesComputed",
    "riskDifferencesComputed",
    "effectDirectionSummarized",
    "formalInferencePerformed",
    "winnerSubgroupSummarized"
  ]);
  const forbiddenStringTokens = new Set([
    "HIGHER-IN-HIGH",
    "LOWER-IN-HIGH",
    "GENERALIZATION-CONFIRMED",
    "COUNTEREXAMPLE-CONFIRMED"
  ]);

  function walk(v, p) {
    if (Array.isArray(v)) {
      v.forEach((x, i) => walk(x, `${p}[${i}]`));
      return;
    }
    if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) {
        const child = `${p}.${k}`;
        if (allowedFalseFlags.has(k)) {
          if (x !== false) findings.push(`${child}=expected-false`);
        } else {
          const lk = k.toLowerCase();
          if (lk === "pvalue" || lk === "p-value" || lk === "riskdifference" || lk === "effectdirection") {
            findings.push(`${child}=forbidden-data-bearing-key`);
          }
        }
        walk(x, child);
      }
      return;
    }
    if (typeof v === "string" && forbiddenStringTokens.has(v)) {
      findings.push(`${p}=forbidden-label:${v}`);
    }
  }

  walk(value, pathPrefix);
  return findings;
}

function main() {
  const artifactRoot = process.argv[2];
  const outputPath = process.argv[3];
  need(artifactRoot && outputPath, "usage: verify-gcsrea-stage1-postexecution-artifact.js <artifact-root> <output-json>");

  const resultPath = path.join(artifactRoot, "result", "STAGE_1_RESULT.json");
  const exclusionPath = path.join(artifactRoot, "result", "STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json");
  need(fs.existsSync(resultPath), "missing STAGE_1_RESULT.json");
  need(fs.existsSync(exclusionPath), "missing STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json");

  const resultRaw = fs.readFileSync(resultPath);
  const exclusionRaw = fs.readFileSync(exclusionPath);
  const x = JSON.parse(resultRaw.toString("utf8"));

  need(x.studyId === "GCSREA-STUDY1", "studyId mismatch");
  need(x.stageId === "GCSREA-S1-DEVELOPMENT-2026-09-27-v1", "stageId mismatch");
  need(x.stageDisposition === "STAGE1-DEVELOPMENT-COMPLETE", "Stage 1 did not complete");
  need(x.evidenceClass === "FRESH-DEVELOPMENT", "evidence class mismatch");
  need(x.scientificSeedsRead === 768, "fresh seed accounting mismatch");
  need(x.authorizedScientificExecutions === 1 && x.actualScientificExecutions === 1, "one-shot execution accounting mismatch");

  need(x.formalInferencePerformed === false, "formal inference must be false");
  need(x.pValuesComputed === false, "p-values must not be computed");
  need(x.riskDifferencesComputed === false, "risk differences must not be computed");
  need(x.effectDirectionSummarized === false, "effect direction must not be summarized");
  need(x.winnerSubgroupSummarized === false, "winner subgroup must not be summarized");

  need(x.actualG405SearchVsExactMeasurements === 0, "G4-05 actual agreement measurement detected");
  need(x.g405CandidateRescanCount === 0, "G4-05 candidate rescan detected");
  need(x.g405DomainReplacementCount === 0, "G4-05 domain replacement detected");
  need(x.g410Depth11AccessCount === 0, "G4-10 depth-11 access detected");
  need(x.stage2SeedAccess === false, "Stage 2 seed access detected");
  need(x.publicAiChanged === false, "public AI change detected");

  need(x.productionIndependentExact === true, "production/independent mismatch");
  need(x.allEightCellsRepresented === true, "all eight source cells required");
  need(x.selectedRootCount === 128, "selected root count mismatch");
  need(Object.keys(x.sourceCells || {}).length === 8, "source cell count mismatch");
  for (const [cell, row] of Object.entries(x.sourceCells || {})) {
    need(row.target === 16 && row.selectedAfterRawDedup === 16, `source cell target mismatch ${cell}`);
  }

  const expectedSearchIds = [
    "D2_Q1",
    "D3_Q1",
    "D2_Q0",
    "D2_Q2",
    "B256_Q1_MAXD3",
    "B1024_Q1_MAXD3"
  ];
  for (const id of expectedSearchIds) need(x.searchConfigurationDefinedness?.[id] === 109, `search definedness mismatch ${id}`);
  for (const id of ["SC1-DEPTH", "SC2-NODE-BUDGET", "SC3-QUIESCENCE"]) {
    need(x.searchContrastDefinedness?.[id] === 109, `contrast definedness mismatch ${id}`);
  }

  need(Array.isArray(x.supportOnlySlots) && x.supportOnlySlots.length === 9, "support slot count mismatch");
  need(x.supportedSlotCount === 0, "supported slot count must be zero");
  for (const row of x.supportOnlySlots) {
    need(row.decision === "NOT-SUPPORTED-FOR-FORMAL-HOLDOUT", `unexpected support decision ${row.slotId}`);
    need(row.searchDefined === 109, `unexpected search support ${row.slotId}`);
  }

  const forbiddenPayload = collectForbiddenPayload(x);
  need(forbiddenPayload.length === 0, `forbidden scientific payload detected: ${forbiddenPayload.join(", ")}`);

  const expectedResultSha256 = "353906fc38939c2a02fd99e46ca7f44af8bc36d99fa71e9bd3fec1757ae7f499";
  const expectedExclusionSha256 = "8526e4c01ba304eb88721c80c5c4280f6806dae2e7007a1a4fbcbcc191a4e8f4";
  need(sha256(resultRaw) === expectedResultSha256, "canonical Stage 1 result SHA-256 mismatch");
  need(sha256(exclusionRaw) === expectedExclusionSha256, "Stage 2 exclusion manifest SHA-256 mismatch");

  const audit = {
    schemaVersion: 1,
    studyId: x.studyId,
    stageId: x.stageId,
    auditClass: "POST-EXECUTION-ARTIFACT-ONLY / NO-SCIENTIFIC-RERUN",
    disposition: "STAGE1-POSTEXECUTION-ARTIFACT-AUDIT-PASS",
    canonicalRunId: 36326278830,
    canonicalRunAttempt: 1,
    canonicalArtifactId: 10934387075,
    canonicalArtifactZipSha256: "2ee8edf9c988de7a721f14887181b80bf517e810a2d49f6d429228eeeb425cd0",
    resultSha256: expectedResultSha256,
    stage2IdentityExclusionSha256: expectedExclusionSha256,
    scientificSeedsRead: x.scientificSeedsRead,
    selectedRootCount: x.selectedRootCount,
    productionIndependentExact: x.productionIndependentExact,
    supportedSlotCount: x.supportedSlotCount,
    searchContrastDefinedness: x.searchContrastDefinedness,
    outputBoundary: {
      formalInferencePerformed: x.formalInferencePerformed,
      pValuesComputed: x.pValuesComputed,
      riskDifferencesComputed: x.riskDifferencesComputed,
      effectDirectionSummarized: x.effectDirectionSummarized,
      winnerSubgroupSummarized: x.winnerSubgroupSummarized,
      forbiddenPayloadFindings: forbiddenPayload
    },
    protectedBoundary: {
      actualG405SearchVsExactMeasurements: x.actualG405SearchVsExactMeasurements,
      g405CandidateRescanCount: x.g405CandidateRescanCount,
      g405DomainReplacementCount: x.g405DomainReplacementCount,
      g410Depth11AccessCount: x.g410Depth11AccessCount,
      stage2SeedAccess: x.stage2SeedAccess,
      publicAiChanged: x.publicAiChanged
    },
    originalWorkflowFailureClassification: "OUTPUT-BOUNDARY-VERIFIER-FALSE-POSITIVE-ON-NEGATIVE-BOOLEAN-FIELD-NAME",
    originalMatchedToken: "pValue",
    originalMatchedField: "pValuesComputed:false",
    scientificRerunPerformed: false
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
}

main();
