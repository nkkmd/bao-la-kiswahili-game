#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/search-reliability-decision-robustness");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/search-reliability-decision-robustness/stage1-development-v1");
const CORRECTION_ID = "SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1";

function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function write(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function shaBytes(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function shaStable(value) { return shaBytes(Buffer.from(stable(value))); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function measurementCore(rows) {
  return rows.map((row) => ({
    historicalTrajectoryHash: row.historicalTrajectoryHash,
    rawStateKey: row.rawStateKey,
    phase: row.phase,
    conditions: row.conditions,
  }));
}
function parseArgs(argv) {
  let output = DEFAULT_OUTPUT;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return { output };
}

function main() {
  const { output } = parseArgs(process.argv.slice(2));
  const specBytes = fs.readFileSync(SPEC_PATH);
  const spec = JSON.parse(specBytes.toString("utf8"));
  const specSha256 = shaBytes(specBytes);
  const measurementsPath = path.join(output, "stage1-measurements.json");
  const verificationPath = path.join(output, "stage1-verification.json");
  const originalBackupPath = path.join(output, "stage1-verification-original.json");
  if (!fs.existsSync(measurementsPath) || !fs.existsSync(verificationPath)) throw new Error("Frozen Stage 1 artifact is incomplete");

  const originalVerificationBytes = fs.readFileSync(verificationPath);
  const originalVerification = JSON.parse(originalVerificationBytes.toString("utf8"));
  const measurements = read(measurementsPath);

  for (const artifact of [originalVerification, measurements]) {
    if (artifact.studyId !== spec.studyId || artifact.stageId !== spec.stageId || artifact.specSha256 !== specSha256) {
      throw new Error("Stage 1 artifact identity/spec mismatch during verification correction");
    }
  }

  const frozenVerifierEvidencePasses = originalVerification.passed === false
    && originalVerification.independentImplementation === true
    && originalVerification.productionStage1CommonImported === false
    && originalVerification.productionControlledSearchImported === false
    && originalVerification.gamesVerified === spec.population.games
    && originalVerification.gameReplayMismatches === 0
    && originalVerification.selectedUniqueRawStates === measurements.selectedUniqueRawStates
    && originalVerification.selectedStateMismatches === 0
    && originalVerification.measurementMismatches === 0
    && originalVerification.selectionHashMatches === true
    && originalVerification.measurementHashMatches === false;
  if (!frozenVerifierEvidencePasses) throw new Error("Frozen independent verifier evidence does not satisfy correction preconditions");
  if (originalVerification.storedMeasurementHash !== measurements.measurementHash) throw new Error("Stored measurement hash identity mismatch");

  // Canonical artifact hash: JSON-persisted rows only. The frozen independent verifier
  // independently reconstructed the same semantic rows and produced this hash.
  const canonicalArtifactMeasurementHash = shaStable(measurementCore(measurements.rows));
  if (canonicalArtifactMeasurementHash !== originalVerification.recomputedMeasurementHash) {
    throw new Error("Canonical artifact hash does not match the frozen independent verifier recomputation");
  }

  // Reconstruct the exact pre-serialization production hash semantics. In the frozen
  // production compactSearchResult(), exact-depth conditions included attemptedDepth
  // and abortedDepth with value undefined. stableStringify encoded those object keys as
  // literal `undefined`, while JSON.stringify omitted them from the persisted artifact.
  const legacyRows = clone(measurements.rows);
  const exactConditionIds = spec.searchGrid.conditions.filter((condition) => condition.kind === "exact-depth").map((condition) => condition.id);
  for (const row of legacyRows) {
    for (const id of exactConditionIds) {
      if (!row.conditions[id]) throw new Error(`Missing exact condition ${id} in persisted measurement row`);
      row.conditions[id].attemptedDepth = undefined;
      row.conditions[id].abortedDepth = undefined;
    }
  }
  const reconstructedLegacyProductionMeasurementHash = shaStable(measurementCore(legacyRows));
  if (reconstructedLegacyProductionMeasurementHash !== measurements.measurementHash) {
    throw new Error("Frozen production pre-serialization measurement hash could not be reconstructed exactly");
  }

  if (!fs.existsSync(originalBackupPath)) fs.copyFileSync(verificationPath, originalBackupPath);

  const corrected = {
    schemaVersion: 2,
    programLabel: spec.programLabel,
    researchGeneration: spec.researchGeneration,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    correctionId: CORRECTION_ID,
    passed: true,
    independentImplementation: true,
    productionStage1CommonImported: false,
    productionControlledSearchImported: false,
    scientificGenerationReexecuted: false,
    scientificSeedsReconsumed: false,
    searchReplayReexecutedByCorrection: false,
    originalFrozenVerifierCompletedFullReplayAndRemeasurement: true,
    originalVerificationSha256: shaBytes(originalVerificationBytes),
    originalVerificationPassed: originalVerification.passed,
    gamesVerified: originalVerification.gamesVerified,
    gameReplayMismatches: originalVerification.gameReplayMismatches,
    uniqueHistoricalTrajectories: originalVerification.uniqueHistoricalTrajectories,
    selectedUniqueRawStates: originalVerification.selectedUniqueRawStates,
    selectedStateMismatches: originalVerification.selectedStateMismatches,
    measurementMismatches: originalVerification.measurementMismatches,
    storedSelectionHash: originalVerification.storedSelectionHash,
    recomputedSelectionHash: originalVerification.recomputedSelectionHash,
    selectionHashMatches: true,
    storedMeasurementHash: measurements.measurementHash,
    recomputedMeasurementHash: reconstructedLegacyProductionMeasurementHash,
    measurementHashMatches: true,
    measurementHashSemantics: "frozen-production-pre-json-stable-stringify-with-exact-depth-undefined-fields/v1",
    canonicalArtifactMeasurementHash,
    independentCanonicalMeasurementHash: originalVerification.recomputedMeasurementHash,
    canonicalMeasurementHashMatches: true,
    rootCause: {
      class: "verification-hash-serialization-defect",
      scientificMeasurementMismatch: false,
      affectedFields: exactConditionIds.flatMap((id) => [`${id}.attemptedDepth`, `${id}.abortedDepth`]),
      frozenProductionValue: "undefined",
      persistedJsonBehavior: "object properties with undefined values omitted by JSON.stringify",
      correctionChangesScientificRows: false,
      correctionChangesSearchGrid: false,
      correctionChangesPopulation: false,
      correctionChangesEndpoints: false,
      correctionChangesReadinessThresholds: false,
    },
    scientificInferenceAuthorized: false,
    formalConfirmationClaimAuthorized: false,
    confirmatoryReuseAllowed: false,
    stage2GenerationAuthorized: false,
  };

  write(verificationPath, corrected);
  console.log(JSON.stringify(corrected, null, 2));
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
