#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/g2-01-calibration-stage2-common.js");

const PHASES = ["namua", "mtaji"];
const DIAGNOSTIC_BOOTSTRAP_REPLICATES = 2000;
const DIAGNOSTIC_BOOTSTRAP_SALT = "PEOCR-S2-CALDIAG-v1";
function mean(values) { return values.reduce((a, b) => a + b, 0) / values.length; }
function quantileFrozen(values, q) { const sorted = [...values].sort((a, b) => a - b); return sorted[Math.floor(q * (sorted.length - 1))]; }
function metric(rows, predictionField, loss) { return mean(rows.map((r) => loss(r[predictionField], r.actorWin))); }
function reliability(rows, edges) {
  const bins = [];
  for (let i = 0; i < edges.length - 1; i += 1) {
    const lo = edges[i]; const hi = edges[i + 1];
    const members = rows.filter((r) => r.modelPrediction >= lo && (i === edges.length - 2 ? r.modelPrediction <= hi : r.modelPrediction < hi));
    bins.push({ lower: lo, upper: hi, n: members.length,
      meanPrediction: members.length ? mean(members.map((r) => r.modelPrediction)) : null,
      observedWinRate: members.length ? mean(members.map((r) => r.actorWin)) : null });
  }
  const ece = bins.reduce((s, b) => s + (b.n ? (b.n / rows.length) * Math.abs(b.observedWinRate - b.meanPrediction) : 0), 0);
  return { bins, ece };
}
function auc(rows) {
  const pos = rows.filter((r) => r.actorWin === 1); const neg = rows.filter((r) => r.actorWin === 0);
  if (!pos.length || !neg.length) return null;
  let score = 0;
  for (const p of pos) for (const n of neg) { if (p.staticBaoEvaluation > n.staticBaoEvaluation) score += 1; else if (p.staticBaoEvaluation === n.staticBaoEvaluation) score += 0.5; }
  return score / (pos.length * neg.length);
}
function logit(p) { return Math.log(p / (1 - p)); }
function logistic(x) { if (x >= 0) { const z = Math.exp(-x); return 1 / (1 + z); } const z = Math.exp(x); return z / (1 + z); }
function calibrationIrls(rows, maxIterations = 200, gradientTolerance = 1e-8) {
  if (!rows.length) return { converged: false, reason: "no-rows" };
  let intercept = 0; let slope = 1; let maxAbsGradient = Infinity;
  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    let g0 = 0; let g1 = 0; let i00 = 0; let i01 = 0; let i11 = 0;
    for (const row of rows) {
      const x = logit(row.modelPrediction); const mu = logistic(intercept + slope * x); const w = mu * (1 - mu); const e = row.actorWin - mu;
      g0 += e; g1 += e * x; i00 += w; i01 += w * x; i11 += w * x * x;
    }
    maxAbsGradient = Math.max(Math.abs(g0), Math.abs(g1));
    if (maxAbsGradient <= gradientTolerance) return { converged: true, iterations: iteration - 1, intercept, slope, maxAbsGradient };
    const det = i00 * i11 - i01 * i01;
    if (!Number.isFinite(det) || Math.abs(det) <= 1e-12) return { converged: false, reason: "singular-information", iterations: iteration, intercept, slope, maxAbsGradient };
    const d0 = (i11 * g0 - i01 * g1) / det; const d1 = (-i01 * g0 + i00 * g1) / det;
    intercept += d0; slope += d1;
    if (!Number.isFinite(intercept) || !Number.isFinite(slope)) return { converged: false, reason: "non-finite-coefficients", iterations: iteration };
  }
  return { converged: false, reason: "max-iterations", iterations: maxIterations, intercept, slope, maxAbsGradient };
}
function diagnosticBootstrap(rows, phase) {
  const intercepts = []; const slopes = []; let failed = 0;
  for (let rep = 0; rep < DIAGNOSTIC_BOOTSTRAP_REPLICATES; rep += 1) {
    const sample = [];
    for (let draw = 0; draw < rows.length; draw += 1) {
      const digest = C.sha256(`${DIAGNOSTIC_BOOTSTRAP_SALT}|${rep}|${phase}|${draw}`);
      sample.push(rows[Number(BigInt(`0x${digest}`) % BigInt(rows.length))]);
    }
    const fit = calibrationIrls(sample);
    if (fit.converged) { intercepts.push(fit.intercept); slopes.push(fit.slope); } else failed += 1;
  }
  return {
    replicates: DIAGNOSTIC_BOOTSTRAP_REPLICATES,
    successfulFits: intercepts.length,
    failedFits: failed,
    intercept95: intercepts.length ? [quantileFrozen(intercepts, 0.025), quantileFrozen(intercepts, 0.975)] : null,
    slope95: slopes.length ? [quantileFrozen(slopes, 0.025), quantileFrozen(slopes, 0.975)] : null,
  };
}
function bootstrapPrimary(rows, spec) {
  const reps = spec.primaryFormalEvaluation.uncertainty.replicates;
  const byPhase = Object.fromEntries(PHASES.map((phase) => [phase, rows.filter((r) => r.phase === phase)]));
  const brierSkill = []; const logLossSkill = [];
  for (let rep = 0; rep < reps; rep += 1) {
    let sb = 0; let sl = 0; let n = 0;
    for (const phase of PHASES) {
      const group = byPhase[phase];
      for (let draw = 0; draw < group.length; draw += 1) {
        const digest = C.sha256(`PEOCR-S2-BOOT-v1|${rep}|${phase}|${draw}`);
        const row = group[Number(BigInt(`0x${digest}`) % BigInt(group.length))];
        sb += C.brierLoss(row.referencePrediction, row.actorWin) - C.brierLoss(row.modelPrediction, row.actorWin);
        sl += C.logLoss(row.referencePrediction, row.actorWin) - C.logLoss(row.modelPrediction, row.actorWin);
        n += 1;
      }
    }
    brierSkill.push(sb / n); logLossSkill.push(sl / n);
  }
  const summarize = (values) => ({ lowerOneSided95: quantileFrozen(values, 0.05), median: quantileFrozen(values, 0.5), upper95Descriptive: quantileFrozen(values, 0.95) });
  return { replicates: reps, brierSkill: summarize(brierSkill), logLossSkill: summarize(logLossSkill) };
}
function readiness(summary, verification, spec) {
  const g = spec.readinessGates;
  const checks = {
    uniqueHistoricalTrajectoriesAfterStage1Firewall: { observed: summary.uniqueHistoricalTrajectoriesAfterStage1TrajectoryOpeningFirewall, minimum: g.minimumUniqueHistoricalTrajectoriesAfterStage1Firewall },
    selectedUniqueRawStates: { observed: summary.selectedUniqueRawStates, minimum: g.minimumSelectedUniqueRawStates },
    namuaSelectedStates: { observed: summary.phaseCounts.namua, minimum: g.minimumNamuaSelectedStates },
    mtajiSelectedStates: { observed: summary.phaseCounts.mtaji, minimum: g.minimumMtajiSelectedStates },
    distinctOpeningPrefixes: { observed: summary.distinctOpeningPrefixes, minimum: g.minimumDistinctOpeningPrefixes },
    namuaDistinctStaticEvaluations: { observed: summary.distinctStaticEvaluationByPhase.namua, minimum: g.minimumDistinctStaticEvaluationsPerPhase },
    mtajiDistinctStaticEvaluations: { observed: summary.distinctStaticEvaluationByPhase.mtaji, minimum: g.minimumDistinctStaticEvaluationsPerPhase },
    namuaActorWins: { observed: summary.outcomeByPhase.namua.actorWins, minimum: g.minimumActorWinsPerPhase },
    namuaActorLosses: { observed: summary.outcomeByPhase.namua.actorLosses, minimum: g.minimumActorLossesPerPhase },
    mtajiActorWins: { observed: summary.outcomeByPhase.mtaji.actorWins, minimum: g.minimumActorWinsPerPhase },
    mtajiActorLosses: { observed: summary.outcomeByPhase.mtaji.actorLosses, minimum: g.minimumActorLossesPerPhase },
  };
  for (const c of Object.values(checks)) c.passed = c.observed >= c.minimum;
  checks.administrativeTruncationRate = { observed: summary.administrativeTruncationRate, maximum: g.maximumAdministrativeTruncationRate, passed: summary.administrativeTruncationRate <= g.maximumAdministrativeTruncationRate };
  checks.stage1HistoricalTrajectoryOverlap = { observed: verification.stage1HistoricalTrajectoryOverlap, required: g.requiredStage1HistoricalTrajectoryOverlap, passed: verification.stage1HistoricalTrajectoryOverlap === g.requiredStage1HistoricalTrajectoryOverlap };
  checks.stage1OpeningPrefixOverlap = { observed: verification.stage1OpeningPrefixOverlap, required: g.requiredStage1OpeningPrefixOverlap, passed: verification.stage1OpeningPrefixOverlap === g.requiredStage1OpeningPrefixOverlap };
  checks.stage1RawStateOverlap = { observed: verification.stage1RawStateOverlap, required: g.requiredStage1RawStateOverlap, passed: verification.stage1RawStateOverlap === g.requiredStage1RawStateOverlap };
  checks.independentVerification = { observed: verification.passed, required: true, passed: verification.passed === true && verification.measurementHashMatches === true && verification.selectionHashMatches === true };
  return { passed: Object.values(checks).every((c) => c.passed), checks };
}
function main() {
  const output = path.resolve(process.argv[2] || C.DEFAULT_OUTPUT); const { spec, specSha256 } = C.loadSpec();
  C.loadAuthorization(spec, specSha256);
  const summary = C.readJson(path.join(output, "stage2-selection-measurement-summary.json")); const verification = C.readJson(path.join(output, "verification.json"));
  if (summary.specSha256 !== specSha256 || verification.specSha256 !== specSha256) throw new Error("Stage 2 artifact/spec mismatch");
  const gate = readiness(summary, verification, spec);
  const files = fs.readdirSync(path.join(output, "measurements")).filter((n) => /^selected-\d{4}\.json$/.test(n)).sort();
  const measurements = files.map((n) => C.readJson(path.join(output, "measurements", n)));
  if (C.sha256(JSON.stringify(measurements)) !== summary.measurementHash) throw new Error("Stage 2 measurement hash mismatch before formal evaluation");
  const rows = measurements.filter((r) => !r.administrativeTruncation);
  let primary = null; let criteria = null; let allCriteriaPassed = false;
  if (gate.passed) {
    const modelBrier = metric(rows, "modelPrediction", C.brierLoss); const referenceBrier = metric(rows, "referencePrediction", C.brierLoss);
    const modelLogLoss = metric(rows, "modelPrediction", C.logLoss); const referenceLogLoss = metric(rows, "referencePrediction", C.logLoss);
    const bootstrap = bootstrapPrimary(rows, spec); const c = spec.primaryFormalEvaluation.successCriteriaAllRequired;
    const byPhaseBrier = Object.fromEntries(PHASES.map((phase) => [phase, metric(rows.filter((r) => r.phase === phase), "modelPrediction", C.brierLoss)]));
    criteria = {
      pairedBrierSkillLower95: { observed: bootstrap.brierSkill.lowerOneSided95, requiredGreaterThan: c.pairedBrierSkillLower95GreaterThan, passed: bootstrap.brierSkill.lowerOneSided95 > c.pairedBrierSkillLower95GreaterThan },
      pairedLogLossSkillLower95: { observed: bootstrap.logLossSkill.lowerOneSided95, requiredGreaterThan: c.pairedLogLossSkillLower95GreaterThan, passed: bootstrap.logLossSkill.lowerOneSided95 > c.pairedLogLossSkillLower95GreaterThan },
      pooledModelBrier: { observed: modelBrier, maximum: c.pooledModelBrierMaximum, passed: modelBrier <= c.pooledModelBrierMaximum },
      namuaModelBrier: { observed: byPhaseBrier.namua, maximum: c.namuaModelBrierMaximum, passed: byPhaseBrier.namua <= c.namuaModelBrierMaximum },
      mtajiModelBrier: { observed: byPhaseBrier.mtaji, maximum: c.mtajiModelBrierMaximum, passed: byPhaseBrier.mtaji <= c.mtajiModelBrierMaximum },
    };
    allCriteriaPassed = Object.values(criteria).every((x) => x.passed);
    primary = { n: rows.length, modelBrier, referenceBrier, observedPairedBrierSkill: referenceBrier - modelBrier,
      modelLogLoss, referenceLogLoss, observedPairedLogLossSkill: referenceLogLoss - modelLogLoss, bootstrap, criteria, allCriteriaPassed };
  }
  const formalDecision = !gate.passed ? "INCONCLUSIVE" : allCriteriaPassed ? "CONFIRMED" : "NOT-CONFIRMED";
  const diagnostics = Object.fromEntries(PHASES.map((phase) => {
    const rs = rows.filter((r) => r.phase === phase); const fit = calibrationIrls(rs); const boot = diagnosticBootstrap(rs, phase);
    return [phase, { n: rs.length, calibrationBias: mean(rs.map((r) => r.modelPrediction - r.actorWin)), reliability: reliability(rs, spec.requiredCalibrationDiagnostics.fixedReliabilityBins),
      calibrationSlopeIntercept: { fit, bootstrap: boot, bootstrapSalt: DIAGNOSTIC_BOOTSTRAP_SALT }, rawScoreAuc: auc(rs) }];
  }));
  const result = { schemaVersion: 1, programLabel: "G2-01", researchGeneration: "Research Generation 2", studyId: spec.studyId, stageId: spec.stageId,
    specSha256, formalDecision, estimabilityAndIdentityGates: gate, primary, requiredCalibrationDiagnostics: diagnostics,
    interpretationBoundary: spec.interpretationBoundary, source: C.provenance() };
  C.writeJson(path.join(output, "stage2-formal-result.json"), result); console.log(JSON.stringify(result, null, 2));
}
if (require.main === module) main();
module.exports = { auc, bootstrapPrimary, calibrationIrls, diagnosticBootstrap, quantileFrozen, readiness, reliability };
