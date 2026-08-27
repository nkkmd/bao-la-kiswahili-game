#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const C = require("./lib/search-reliability-stage1-common.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/search-reliability-decision-robustness");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/search-reliability-decision-robustness/stage1-development-v1");
const STRATA = ["pooled", "namua", "mtaji"];
const CORE_METRICS = [
  "canonicalBestAgreement",
  "topSetJaccard",
  "referenceBestIncludedInComparisonTopSet",
  "kendallTauB",
  "pairwiseOrderingAgreement",
  "bestScoreSignAgreement",
  "pvFirstMoveAgreement",
  "pvNormalizedCommonPrefix",
];
const SECONDARY_METRICS = [
  "top3Jaccard",
  "spearman",
  "bestScoreDeltaComparisonMinusReference",
  "bestScoreAbsoluteDelta",
  "comparisonBestSecondGap",
  "referenceBestSecondGap",
  "gapAbsoluteDelta",
  "comparisonTopSetSize",
  "referenceTopSetSize",
  "pvCommonPrefixLength",
  "pvDivergencePly",
];

function shaBytes(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function write(file, v) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(v, null, 2)}\n`); }
function parseArgs(argv) { let output = DEFAULT_OUTPUT; for (let i = 0; i < argv.length; i += 1) { if (argv[i] === "--output") output = path.resolve(argv[++i]); else throw new Error(`Unknown argument: ${argv[i]}`); } return { output }; }
function quantile(values, q) { if (!values.length) return null; const a = values.slice().sort((x, y) => x - y); return a[Math.floor(q * (a.length - 1))]; }
function summary(values) {
  const v = values.filter((x) => x !== null && x !== undefined && Number.isFinite(x));
  if (!v.length) return { nDefined: 0, mean: null, median: null, p25: null, p75: null };
  return { nDefined: v.length, mean: v.reduce((a, b) => a + b, 0) / v.length, median: quantile(v, 0.5), p25: quantile(v, 0.25), p75: quantile(v, 0.75) };
}
function rowsForStratum(rows, stratum) { return stratum === "pooled" ? rows : rows.filter((r) => r.phase === stratum); }
function profilePair(rows, comparisonId, referenceId) {
  const comparisons = rows.map((row) => C.compareConditions(row.conditions[comparisonId], row.conditions[referenceId]));
  const defined = comparisons.filter((x) => x.defined);
  const metrics = {};
  for (const metric of [...CORE_METRICS, ...SECONDARY_METRICS]) metrics[metric] = summary(defined.map((x) => x[metric]));
  return {
    comparisonId,
    referenceId,
    nStates: rows.length,
    nDefinedComparisons: defined.length,
    estimableRate: rows.length ? defined.length / rows.length : null,
    metrics,
  };
}
function budgetRate(rows, id, minimumDepth) {
  if (!rows.length) return null;
  return rows.filter((row) => row.conditions[id] && row.conditions[id].completedDepth >= minimumDepth).length / rows.length;
}
function exactCompletionRate(rows, exactIds) {
  if (!rows.length || !exactIds.length) return null;
  let complete = 0; let total = 0;
  for (const row of rows) for (const id of exactIds) { total += 1; if (row.conditions[id] && row.conditions[id].estimable && row.conditions[id].completedDepth === row.conditions[id].result.depth) complete += 1; }
  return total ? complete / total : null;
}
function gate(observed, operator, threshold) {
  let passed;
  if (operator === ">=") passed = observed >= threshold;
  else if (operator === "===") passed = observed === threshold;
  else throw new Error(`Unsupported gate operator ${operator}`);
  return { observed, operator, threshold, passed };
}

function main() {
  const { output } = parseArgs(process.argv.slice(2));
  const specBytes = fs.readFileSync(SPEC_PATH); const spec = JSON.parse(specBytes); const specSha256 = shaBytes(specBytes);
  const manifestPath = path.join(output, "stage1-generation-manifest.json");
  const selectionPath = path.join(output, "stage1-selected-states.json");
  const measurementsPath = path.join(output, "stage1-measurements.json");
  const verificationPath = path.join(output, "stage1-verification.json");
  const manifest = read(manifestPath); const selection = read(selectionPath); const measurements = read(measurementsPath); const verification = read(verificationPath);
  for (const artifact of [manifest, selection, measurements, verification]) {
    if (artifact.studyId !== spec.studyId || artifact.stageId !== spec.stageId || artifact.specSha256 !== specSha256) throw new Error("Stage 1 artifact identity/spec mismatch");
  }
  if (manifest.games !== spec.population.games || manifest.seedStart !== spec.population.seedStart || manifest.seedEnd !== spec.population.seedEnd) throw new Error("Stage 1 population mismatch");
  if (!verification.passed || !verification.selectionHashMatches || !verification.measurementHashMatches) throw new Error("Independent verification must pass before Stage 1 analysis");
  if (measurements.selectionHash !== selection.selectionHash || measurements.measurementHash !== verification.recomputedMeasurementHash) throw new Error("Stage 1 hash chain mismatch before analysis");

  const rows = measurements.rows;
  const profile = {
    schemaVersion: 1,
    programLabel: spec.programLabel,
    researchGeneration: spec.researchGeneration,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    scientificInferenceAuthorized: false,
    developmentCharacterizationAuthorized: true,
    formalConfirmationClaimAuthorized: false,
    higherResourceReferenceIsTruth: false,
    strata: {},
  };
  const families = [
    ...spec.comparisonFamilies.depth.map((pair) => ({ family: "depth", pair })),
    ...spec.comparisonFamilies.quiescence.map((pair) => ({ family: "quiescence", pair })),
    ...spec.comparisonFamilies.nodeBudgetAgainstFrozenReference.map((pair) => ({ family: "nodeBudgetAgainstFrozenReference", pair })),
  ];
  for (const stratum of STRATA) {
    const sr = rowsForStratum(rows, stratum);
    profile.strata[stratum] = {
      nStates: sr.length,
      comparisons: families.map(({ family, pair }) => ({ family, ...profilePair(sr, pair[0], pair[1]) })),
      budgetCompletionRates: {
        B64_atLeastD1: budgetRate(sr, "B64_Q1_MAXD3", 1),
        B256_atLeastD2: budgetRate(sr, "B256_Q1_MAXD3", 2),
        B1024_atLeastD3: budgetRate(sr, "B1024_Q1_MAXD3", 3),
      },
    };
  }
  profile.profileHash = C.sha256(C.stableStringify({ strata: profile.strata, specSha256 }));
  write(path.join(output, "stage1-development-profile.json"), profile);

  const g = spec.readinessGates;
  const exactIds = spec.searchGrid.conditions.filter((x) => x.kind === "exact-depth").map((x) => x.id);
  const finalRawDuplicates = rows.length - new Set(rows.map((x) => x.rawStateKey)).size;
  const checks = {
    uniqueHistoricalTrajectories: gate(selection.audit.uniqueHistoricalTrajectories, ">=", g.minimumUniqueHistoricalTrajectories),
    selectedUniqueRawStates: gate(rows.length, ">=", g.minimumSelectedUniqueRawStates),
    namuaSelectedStates: gate(measurements.phaseCounts.namua, ">=", g.minimumNamuaSelectedStates),
    mtajiSelectedStates: gate(measurements.phaseCounts.mtaji, ">=", g.minimumMtajiSelectedStates),
    distinctOpeningPrefixes: gate(selection.audit.distinctOpeningPrefixes, ">=", g.minimumDistinctOpeningPrefixes),
    duplicateSelectedRawStatesAfterDedup: gate(finalRawDuplicates, "===", g.requiredDuplicateSelectedRawStatesAfterDedup),
    exactConditionMeasurementCompletionRate: gate(exactCompletionRate(rows, exactIds), ">=", g.requiredExactConditionMeasurementCompletionRate),
    B64AtLeastDepth1Pooled: gate(profile.strata.pooled.budgetCompletionRates.B64_atLeastD1, ">=", g.minimumB64AtLeastDepth1CompletionRatePooled),
    B64AtLeastDepth1Namua: gate(profile.strata.namua.budgetCompletionRates.B64_atLeastD1, ">=", g.minimumB64AtLeastDepth1CompletionRateEachPhase),
    B64AtLeastDepth1Mtaji: gate(profile.strata.mtaji.budgetCompletionRates.B64_atLeastD1, ">=", g.minimumB64AtLeastDepth1CompletionRateEachPhase),
    B256AtLeastDepth2Pooled: gate(profile.strata.pooled.budgetCompletionRates.B256_atLeastD2, ">=", g.minimumB256AtLeastDepth2CompletionRatePooled),
    B256AtLeastDepth2Namua: gate(profile.strata.namua.budgetCompletionRates.B256_atLeastD2, ">=", g.minimumB256AtLeastDepth2CompletionRateEachPhase),
    B256AtLeastDepth2Mtaji: gate(profile.strata.mtaji.budgetCompletionRates.B256_atLeastD2, ">=", g.minimumB256AtLeastDepth2CompletionRateEachPhase),
    B1024AtLeastDepth3Pooled: gate(profile.strata.pooled.budgetCompletionRates.B1024_atLeastD3, ">=", g.minimumB1024AtLeastDepth3CompletionRatePooled),
    B1024AtLeastDepth3Namua: gate(profile.strata.namua.budgetCompletionRates.B1024_atLeastD3, ">=", g.minimumB1024AtLeastDepth3CompletionRateEachPhase),
    B1024AtLeastDepth3Mtaji: gate(profile.strata.mtaji.budgetCompletionRates.B1024_atLeastD3, ">=", g.minimumB1024AtLeastDepth3CompletionRateEachPhase),
    independentVerification: gate(verification.passed, "===", g.independentVerificationRequired),
    selectionHashMatch: gate(verification.selectionHashMatches, "===", g.selectionHashMatchRequired),
    measurementHashMatch: gate(verification.measurementHashMatches, "===", g.measurementHashMatchRequired),
  };
  const readiness = { passed: Object.values(checks).every((x) => x.passed), checks };
  const decision = readiness.passed ? spec.stage1Decision.ifAllReadinessGatesPass : spec.stage1Decision.ifAnyReadinessGateFails;
  const result = {
    schemaVersion: 1,
    programLabel: spec.programLabel,
    researchGeneration: spec.researchGeneration,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    scientificInferenceAuthorized: false,
    developmentCharacterizationAuthorized: true,
    formalConfirmationClaimAuthorized: false,
    confirmatoryReuseAllowed: false,
    stage1Decision: decision,
    stage2GenerationAuthorized: false,
    inputAudit: {
      generationManifestSha256: shaBytes(fs.readFileSync(manifestPath)),
      selectedStatesSha256: shaBytes(fs.readFileSync(selectionPath)),
      measurementsSha256: shaBytes(fs.readFileSync(measurementsPath)),
      verificationSha256: shaBytes(fs.readFileSync(verificationPath)),
      selectionHash: selection.selectionHash,
      measurementHash: measurements.measurementHash,
      profileHash: profile.profileHash,
      readiness,
    },
    populationSummary: {
      generatedGames: manifest.games,
      uniqueHistoricalTrajectories: selection.audit.uniqueHistoricalTrajectories,
      distinctOpeningPrefixes: selection.audit.distinctOpeningPrefixes,
      unavailableAssignedPhase: selection.audit.unavailableAssignedPhase,
      duplicateHistoricalTrajectoriesCollapsed: selection.audit.duplicateHistoricalTrajectoriesCollapsed,
      duplicateSelectedRawStatesCollapsedBeforeFinalSelection: selection.audit.duplicateSelectedRawStatesCollapsed,
      selectedUniqueRawStates: rows.length,
      phaseCounts: measurements.phaseCounts,
    },
    developmentProfilePath: "stage1-development-profile.json",
    developmentProfileHash: profile.profileHash,
    interpretationBoundary: {
      higherResourceSearchReferenceIsGameTheoreticTruth: false,
      trueBestMoveClaimAuthorized: false,
      validatedOptimalMoveClaimAuthorized: false,
      humanDifficultyClaimAuthorized: false,
      engineCorrectnessClaimAuthorized: false,
      publicAiStrengthClaimAuthorized: false,
      publicAiChangeRecommendationAuthorized: false,
      priorStudyDecisionRevisionAuthorized: false,
      formalConfirmationClaimAuthorized: false,
    },
    nextStage: {
      stage2AuthorizedByThisResultAlone: false,
      requiresExplicitAuthorization: true,
      status: readiness.passed ? "STAGE2-NOT-AUTHORIZED-PENDING-PROSPECTIVE-FORMAL-RULE-FREEZE" : "STAGE2-NOT-AUTHORIZED-DEVELOPMENT-NOT-ESTIMABLE",
    },
  };
  write(path.join(output, "stage1-development-result.json"), result);
  console.log(JSON.stringify(result, null, 2));
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
