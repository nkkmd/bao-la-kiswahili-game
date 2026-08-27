#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const C = require("./lib/search-reliability-stage1-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/search-reliability-decision-robustness/preregistration/STAGE_2_FORMAL_SPEC.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/search-reliability-decision-robustness/stage2-formal-v1");
const Z95 = 1.959963984540054;

function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function write(file, v) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(v, null, 2)}\n`); }
function shaBytes(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function parseArgs(argv) { let output = DEFAULT_OUTPUT; for (let i = 0; i < argv.length; i += 1) { if (argv[i] === "--output") output = path.resolve(argv[++i]); else throw new Error(`Unknown argument: ${argv[i]}`); } return { output }; }
function gate(observed, operator, threshold) { let passed; if (operator === ">=") passed = observed >= threshold; else if (operator === "===") passed = observed === threshold; else throw new Error(`Unsupported operator ${operator}`); return { observed, operator, threshold, passed }; }
function rate(rows, predicate) { return rows.length ? rows.filter(predicate).length / rows.length : null; }
function exactCompletionRate(rows, exactIds) { let n = 0; let ok = 0; for (const row of rows) for (const id of exactIds) { n += 1; const c = row.conditions[id]; if (c && c.estimable && c.result && c.completedDepth === c.result.depth) ok += 1; } return n ? ok / n : null; }
function budgetDepthRate(rows, id, depth) { return rate(rows, (row) => row.conditions[id] && row.conditions[id].completedDepth >= depth); }
function definedComparisonRows(rows, a, b) { return rows.map((row) => ({ row, cmp: C.compareConditions(row.conditions[a], row.conditions[b]) })).filter((x) => x.cmp.defined); }
function wilson(successes, n, z = Z95) {
  if (!n) return { n: 0, successes: 0, proportion: null, lower: null, upper: null };
  const p = successes / n; const z2 = z * z; const denom = 1 + z2 / n; const center = (p + z2 / (2 * n)) / denom;
  const half = z * Math.sqrt((p * (1 - p) / n) + (z2 / (4 * n * n))) / denom;
  return { n, successes, proportion: p, lower: Math.max(0, center - half), upper: Math.min(1, center + half) };
}
function mean(values) { const v = values.filter((x) => x !== null && x !== undefined && Number.isFinite(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }
function profile(rows, pairs) {
  const out = {};
  for (const [a, b] of pairs) {
    const d = definedComparisonRows(rows, a, b);
    out[`${a}_vs_${b}`] = {
      nStates: rows.length,
      nDefined: d.length,
      estimableRate: rows.length ? d.length / rows.length : null,
      canonicalBestAgreement: mean(d.map((x) => x.cmp.canonicalBestAgreement)),
      topSetJaccard: mean(d.map((x) => x.cmp.topSetJaccard)),
      referenceBestIncludedInComparisonTopSet: mean(d.map((x) => x.cmp.referenceBestIncludedInComparisonTopSet)),
      kendallTauB: mean(d.map((x) => x.cmp.kendallTauB)),
      pairwiseOrderingAgreement: mean(d.map((x) => x.cmp.pairwiseOrderingAgreement)),
      bestScoreSignAgreement: mean(d.map((x) => x.cmp.bestScoreSignAgreement)),
      pvFirstMoveAgreement: mean(d.map((x) => x.cmp.pvFirstMoveAgreement)),
      pvNormalizedCommonPrefix: mean(d.map((x) => x.cmp.pvNormalizedCommonPrefix))
    };
  }
  return out;
}

function main() {
  const { output } = parseArgs(process.argv.slice(2)); const specBytes = fs.readFileSync(SPEC_PATH); const spec = JSON.parse(specBytes.toString("utf8")); const specSha256 = shaBytes(specBytes);
  const manifestPath = path.join(output, "stage2-generation-manifest.json"); const selectionPath = path.join(output, "stage2-selected-states.json"); const measurementsPath = path.join(output, "stage2-measurements.json"); const verificationPath = path.join(output, "stage2-verification.json");
  const manifest = read(manifestPath); const selection = read(selectionPath); const measurements = read(measurementsPath); const verification = read(verificationPath);
  for (const artifact of [manifest, selection, measurements, verification]) if (artifact.studyId !== spec.studyId || artifact.stageId !== spec.stageId || artifact.specSha256 !== specSha256) throw new Error("Stage 2 artifact identity/spec mismatch");
  if (manifest.games !== spec.population.games || manifest.seedStart !== spec.population.seedStart || manifest.seedEnd !== spec.population.seedEnd) throw new Error("Stage 2 population mismatch");
  if (!verification.passed || !verification.selectionHashMatches || !verification.measurementHashMatches) throw new Error("Independent Stage 2 verification must pass before formal analysis");
  if (measurements.selectionHash !== selection.selectionHash || measurements.measurementHash !== verification.recomputedMeasurementHash) throw new Error("Stage 2 hash chain mismatch");

  const rows = measurements.rows; const g = spec.estimabilityAndReproducibilityGates; const exactIds = spec.searchGrid.conditions.filter((x) => x.kind === "exact-depth").map((x) => x.id);
  const namua = rows.filter((x) => x.phase === "namua"); const mtaji = rows.filter((x) => x.phase === "mtaji"); const rawDuplicates = rows.length - new Set(rows.map((x) => x.rawStateKey)).size;
  const b1024Defined = (subset) => definedComparisonRows(subset, "B1024_Q1_MAXD3", "D3_Q1").length / (subset.length || 1);
  const checks = {
    uniqueHistoricalTrajectoriesAfterStage1Firewall: gate(selection.audit.uniqueHistoricalTrajectoriesAfterStage1Firewall, ">=", g.minimumUniqueHistoricalTrajectoriesAfterStage1Firewall),
    selectedUniqueRawStates: gate(rows.length, ">=", g.minimumSelectedUniqueRawStates),
    namuaSelectedStates: gate(namua.length, ">=", g.minimumNamuaSelectedStates),
    mtajiSelectedStates: gate(mtaji.length, ">=", g.minimumMtajiSelectedStates),
    distinctOpeningPrefixesAfterStage1Firewall: gate(selection.audit.distinctOpeningPrefixesAfterStage1Firewall, ">=", g.minimumDistinctOpeningPrefixesAfterStage1Firewall),
    stage1HistoricalTrajectoryOverlap: gate(selection.audit.postFirewallOverlapCounts.historicalTrajectory, "===", g.requiredStage1HistoricalTrajectoryOverlap),
    stage1OpeningPrefixOverlap: gate(selection.audit.postFirewallOverlapCounts.openingPrefix, "===", g.requiredStage1OpeningPrefixOverlap),
    stage1SelectedRawStateOverlap: gate(selection.audit.postFirewallOverlapCounts.selectedRawState, "===", g.requiredStage1SelectedRawStateOverlap),
    duplicateSelectedRawStatesAfterDedup: gate(rawDuplicates, "===", g.requiredDuplicateSelectedRawStatesAfterDedup),
    exactConditionMeasurementCompletionRate: gate(exactCompletionRate(rows, exactIds), ">=", g.requiredExactConditionMeasurementCompletionRate),
    B64AtLeastDepth1Pooled: gate(budgetDepthRate(rows, "B64_Q1_MAXD3", 1), ">=", g.minimumB64AtLeastDepth1CompletionRatePooled),
    B64AtLeastDepth1Namua: gate(budgetDepthRate(namua, "B64_Q1_MAXD3", 1), ">=", g.minimumB64AtLeastDepth1CompletionRateEachPhase),
    B64AtLeastDepth1Mtaji: gate(budgetDepthRate(mtaji, "B64_Q1_MAXD3", 1), ">=", g.minimumB64AtLeastDepth1CompletionRateEachPhase),
    B256AtLeastDepth2Pooled: gate(budgetDepthRate(rows, "B256_Q1_MAXD3", 2), ">=", g.minimumB256AtLeastDepth2CompletionRatePooled),
    B256AtLeastDepth2Namua: gate(budgetDepthRate(namua, "B256_Q1_MAXD3", 2), ">=", g.minimumB256AtLeastDepth2CompletionRateEachPhase),
    B256AtLeastDepth2Mtaji: gate(budgetDepthRate(mtaji, "B256_Q1_MAXD3", 2), ">=", g.minimumB256AtLeastDepth2CompletionRateEachPhase),
    B1024AtLeastDepth3Pooled: gate(budgetDepthRate(rows, "B1024_Q1_MAXD3", 3), ">=", g.minimumB1024AtLeastDepth3CompletionRatePooled),
    B1024AtLeastDepth3Namua: gate(budgetDepthRate(namua, "B1024_Q1_MAXD3", 3), ">=", g.minimumB1024AtLeastDepth3CompletionRateEachPhase),
    B1024AtLeastDepth3Mtaji: gate(budgetDepthRate(mtaji, "B1024_Q1_MAXD3", 3), ">=", g.minimumB1024AtLeastDepth3CompletionRateEachPhase),
    B1024ComparisonEstimablePooled: gate(b1024Defined(rows), ">=", g.minimumB1024ComparisonEstimableRatePooled),
    B1024ComparisonEstimableNamua: gate(b1024Defined(namua), ">=", g.minimumB1024ComparisonEstimableRateEachPhase),
    B1024ComparisonEstimableMtaji: gate(b1024Defined(mtaji), ">=", g.minimumB1024ComparisonEstimableRateEachPhase),
    independentVerification: gate(verification.passed, "===", g.independentVerificationRequired),
    selectionHashMatch: gate(verification.selectionHashMatches, "===", g.selectionHashMatchRequired),
    measurementHashMatch: gate(verification.measurementHashMatches, "===", g.measurementHashMatchRequired)
  };
  const gatesPassed = Object.values(checks).every((x) => x.passed);
  let primary = null; let decision = spec.formalDecisionRule.ifAnyEstimabilityIdentityMeasurementOrReproducibilityGateFails;
  if (gatesPassed) {
    const depth = definedComparisonRows(rows, "D2_Q1", "D3_Q1"); const q = definedComparisonRows(rows, "D2_Q2", "D2_Q1"); const budget = definedComparisonRows(rows, "B1024_Q1_MAXD3", "D3_Q1");
    const p1 = wilson(depth.filter((x) => x.cmp.canonicalBestAgreement === 0).length, depth.length);
    const p2 = wilson(q.filter((x) => x.cmp.canonicalBestAgreement === 0).length, q.length);
    const p3 = wilson(budget.filter((x) => x.cmp.canonicalBestAgreement === 1).length, budget.length);
    const criteria = {
      P1_DEPTH_MATERIAL_INSTABILITY: { ...p1, decisionStatistic: p1.lower, operator: ">=", threshold: 0.20, passed: p1.lower >= 0.20 },
      P2_QUIESCENCE_MATERIAL_INSTABILITY: { ...p2, decisionStatistic: p2.lower, operator: ">=", threshold: 0.20, passed: p2.lower >= 0.20 },
      P3_HIGH_BUDGET_CONVERGENCE: { ...p3, decisionStatistic: p3.lower, operator: ">=", threshold: 0.90, passed: p3.lower >= 0.90 }
    };
    const passed = Object.values(criteria).every((x) => x.passed); primary = { name: spec.primaryFormalCriterion.name, confidenceMethod: spec.primaryFormalCriterion.confidenceMethod, criteria, passed };
    decision = passed ? spec.formalDecisionRule.ifAllGatesPassAndAllPrimaryFormalCriteriaPass : spec.formalDecisionRule.ifAllGatesPassAndAnyPrimaryFormalCriterionFails;
  }
  const pairs = [["D1_Q1", "D2_Q1"], ["D2_Q1", "D3_Q1"], ["D2_Q0", "D2_Q1"], ["D2_Q2", "D2_Q1"], ["B64_Q1_MAXD3", "D3_Q1"], ["B256_Q1_MAXD3", "D3_Q1"], ["B1024_Q1_MAXD3", "D3_Q1"]];
  const secondaryProfile = { pooled: profile(rows, pairs), namua: profile(namua, pairs), mtaji: profile(mtaji, pairs) };
  const result = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration, studyId: spec.studyId, stageId: spec.stageId, specSha256,
    formalDecision: decision, gates: { passed: gatesPassed, checks }, primaryFormalCriterion: primary, secondaryProfile,
    populationSummary: { generatedGames: manifest.games, trajectoriesAfterStage1TrajectoryOpeningFirewall: selection.audit.trajectoriesAfterStage1TrajectoryOpeningFirewall, uniqueHistoricalTrajectoriesAfterStage1Firewall: selection.audit.uniqueHistoricalTrajectoriesAfterStage1Firewall, selectedUniqueRawStates: rows.length, phaseCounts: measurements.phaseCounts, postFirewallOverlapCounts: selection.audit.postFirewallOverlapCounts },
    hashes: { generationManifestSha256: shaBytes(fs.readFileSync(manifestPath)), selectedStatesSha256: shaBytes(fs.readFileSync(selectionPath)), measurementsSha256: shaBytes(fs.readFileSync(measurementsPath)), verificationSha256: shaBytes(fs.readFileSync(verificationPath)), selectionHash: selection.selectionHash, measurementHash: measurements.measurementHash },
    interpretationBoundary: { higherResourceSearchReferenceIsGameTheoreticTruth: false, trueBestMoveClaimAuthorized: false, validatedOptimalMoveClaimAuthorized: false, humanDifficultyClaimAuthorized: false, engineCorrectnessClaimAuthorized: false, publicAiStrengthClaimAuthorized: false, publicAiChangeRecommendationAuthorized: false, priorStudyDecisionRevisionAuthorized: false }
  };
  result.canonicalResultHash = C.sha256(C.stableStringify({ formalDecision: result.formalDecision, gates: result.gates, primaryFormalCriterion: result.primaryFormalCriterion, populationSummary: result.populationSummary, hashes: result.hashes, specSha256 }));
  write(path.join(output, "stage2-formal-result.json"), result); console.log(JSON.stringify(result, null, 2));
}
try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
