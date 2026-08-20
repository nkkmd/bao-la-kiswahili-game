#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/position-evaluation-calibration-stage2-common.js");

const PHASES = ["namua", "mtaji"];
function brier(rows, field) { return rows.reduce((s, r) => s + (r[field] - r.actorWin) ** 2, 0) / rows.length; }
function referenceProbability(spec, phase) { return spec.primaryFormalEvaluation.referencePrediction[phase]; }
function mean(values) { return values.reduce((a, b) => a + b, 0) / values.length; }
function quantileFrozen(values, q) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(q * (sorted.length - 1))];
}
function bootstrapSkill(rows, spec) {
  const reps = spec.primaryFormalEvaluation.uncertainty.replicates;
  const byPhase = Object.fromEntries(PHASES.map((p) => [p, rows.filter((r) => r.phase === p)]));
  const replicateMeans = [];
  for (let rep = 0; rep < reps; rep += 1) {
    let sum = 0; let n = 0;
    for (const phase of PHASES) {
      const group = byPhase[phase];
      for (let draw = 0; draw < group.length; draw += 1) {
        const digest = C.sha256(`PEC-S2-BOOT-v1|${rep}|${phase}|${draw}`);
        const index = Number(BigInt(`0x${digest}`) % BigInt(group.length));
        const row = group[index];
        const ref = referenceProbability(spec, phase);
        sum += (ref - row.actorWin) ** 2 - (row.frozenWinProbability - row.actorWin) ** 2;
        n += 1;
      }
    }
    replicateMeans.push(sum / n);
  }
  return {
    replicates: reps,
    lowerOneSided95: quantileFrozen(replicateMeans, spec.primaryFormalEvaluation.uncertainty.lowerQuantile),
    median: quantileFrozen(replicateMeans, 0.5),
    upper95Descriptive: quantileFrozen(replicateMeans, 0.95),
  };
}
function reliability(rows, edges) {
  const bins = [];
  for (let i = 0; i < edges.length - 1; i += 1) {
    const lo = edges[i]; const hi = edges[i + 1];
    const members = rows.filter((r) => r.frozenWinProbability >= lo
      && (i === edges.length - 2 ? r.frozenWinProbability <= hi : r.frozenWinProbability < hi));
    bins.push({
      lower: lo, upper: hi, n: members.length,
      meanPrediction: members.length ? mean(members.map((r) => r.frozenWinProbability)) : null,
      observedWinRate: members.length ? mean(members.map((r) => r.actorWin)) : null,
    });
  }
  const ece = bins.reduce((sum, bin) => sum + (bin.n ? bin.n / rows.length * Math.abs(bin.observedWinRate - bin.meanPrediction) : 0), 0);
  return { bins, ece };
}
function exactLogLoss(rows) {
  let total = 0; let boundaryContradictions = 0;
  for (const r of rows) {
    const p = r.frozenWinProbability;
    if ((p === 0 && r.actorWin === 1) || (p === 1 && r.actorWin === 0)) { boundaryContradictions += 1; continue; }
    if (p === 0 || p === 1) continue;
    total += -(r.actorWin * Math.log(p) + (1 - r.actorWin) * Math.log(1 - p));
  }
  return boundaryContradictions
    ? { finite: false, value: null, boundaryContradictions }
    : { finite: true, value: total / rows.length, boundaryContradictions: 0 };
}
function auc(rows) {
  const pos = rows.filter((r) => r.actorWin === 1); const neg = rows.filter((r) => r.actorWin === 0);
  if (!pos.length || !neg.length) return null;
  let score = 0;
  for (const p of pos) for (const n of neg) {
    if (p.staticBaoEvaluation > n.staticBaoEvaluation) score += 1;
    else if (p.staticBaoEvaluation === n.staticBaoEvaluation) score += 0.5;
  }
  return score / (pos.length * neg.length);
}
function groupLabel(name, r) {
  if (name === "forcedCapture") return String(Boolean(r.forcedCapture));
  if (name === "actorSeat") return String(r.actorSeat);
  if (name === "legalMoveCount") return r.legalMoveCount === 1 ? "1" : r.legalMoveCount <= 3 ? "2-3" : ">=4";
  if (name === "captureMoveCount") return r.captureMoveCount === 0 ? "0" : r.captureMoveCount === 1 ? "1" : ">=2";
  if (name === "actorHouseOwned") return String(Boolean(r.actorHouseOwned));
  if (name === "actorNyumbaSeeds") return r.actorNyumbaSeeds === 0 ? "0" : ">0";
  throw new Error(`Unknown heterogeneity group ${name}`);
}
function heterogeneity(rows, spec) {
  const result = {};
  for (const [name, labels] of Object.entries(spec.descriptiveStructuralHeterogeneity.groups)) {
    result[name] = Object.fromEntries(labels.map((raw) => {
      const label = String(raw); const members = rows.filter((r) => groupLabel(name, r) === label);
      return [label, { n: members.length, brier: members.length >= 30 ? brier(members, "frozenWinProbability") : null }];
    }));
  }
  return result;
}
function readiness(summary, verification, spec) {
  const g = spec.readinessGates;
  const checks = {
    uniqueHistoricalTrajectories: { observed: summary.uniqueHistoricalTrajectoriesAfterStage1TrajectoryOpeningFirewall, minimum: g.minimumUniqueHistoricalTrajectoriesAfterStage1TrajectoryFirewall },
    selectedUniqueRuleStates: { observed: summary.selectedUniqueRuleStates, minimum: g.minimumSelectedUniqueRuleStates },
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
  for (const value of Object.values(checks)) value.passed = value.observed >= value.minimum;
  checks.administrativeTruncationRate = { observed: summary.administrativeTruncationRate, maximum: g.maximumAdministrativeTruncationRate, passed: summary.administrativeTruncationRate <= g.maximumAdministrativeTruncationRate };
  checks.stage1HistoricalTrajectoryOverlap = { observed: verification.stage1HistoricalTrajectoryOverlap, required: g.requiredStage1HistoricalTrajectoryOverlap, passed: verification.stage1HistoricalTrajectoryOverlap === g.requiredStage1HistoricalTrajectoryOverlap };
  checks.stage1OpeningPrefixOverlap = { observed: verification.stage1OpeningPrefixOverlap, required: g.requiredStage1OpeningPrefixOverlap, passed: verification.stage1OpeningPrefixOverlap === g.requiredStage1OpeningPrefixOverlap };
  checks.stage1RuleStateOverlap = { observed: verification.stage1RuleStateOverlap, required: g.requiredStage1RuleStateOverlap, passed: verification.stage1RuleStateOverlap === g.requiredStage1RuleStateOverlap };
  checks.independentVerification = { observed: verification.passed, required: true, passed: verification.passed === true && verification.measurementHashMatches === true };
  return { passed: Object.values(checks).every((c) => c.passed), checks };
}
function main() {
  const output = path.resolve(process.argv[2] || C.DEFAULT_OUTPUT);
  const { spec, specSha256 } = C.loadSpec();
  const summary = C.readJson(path.join(output, "stage2-selection-measurement-summary.json"));
  const verification = C.readJson(path.join(output, "verification.json"));
  if (summary.specSha256 !== specSha256 || verification.specSha256 !== specSha256) throw new Error("Stage 2 formal artifact/spec mismatch");
  const gate = readiness(summary, verification, spec);
  const files = fs.readdirSync(path.join(output, "measurements")).filter((n) => /^selected-\d{4}\.json$/.test(n)).sort();
  const measurements = files.map((n) => C.readJson(path.join(output, "measurements", n)));
  if (C.sha256(JSON.stringify(measurements)) !== summary.measurementHash) throw new Error("Stage 2 measurement hash mismatch before formal evaluation");
  const rows = measurements.filter((r) => !r.administrativeTruncation);
  const pooledModelBrier = brier(rows, "frozenWinProbability");
  const byPhase = Object.fromEntries(PHASES.map((phase) => {
    const rs = rows.filter((r) => r.phase === phase); const ref = referenceProbability(spec, phase);
    return [phase, {
      n: rs.length,
      modelBrier: brier(rs, "frozenWinProbability"),
      referenceBrier: mean(rs.map((r) => (ref - r.actorWin) ** 2)),
      calibrationBias: mean(rs.map((r) => r.frozenWinProbability - r.actorWin)),
      aucRawStaticEvaluation: auc(rs),
      reliability: reliability(rs, spec.keySecondary.fixedReliabilityBins),
      logLoss: exactLogLoss(rs),
    }];
  }));
  const pooledReferenceBrier = mean(rows.map((r) => (referenceProbability(spec, r.phase) - r.actorWin) ** 2));
  const observedSkill = pooledReferenceBrier - pooledModelBrier;
  const bootstrap = gate.passed ? bootstrapSkill(rows, spec) : null;
  const c = spec.primaryFormalEvaluation.successCriteriaAllRequired;
  const criteria = gate.passed ? {
    pairedSkillLower95: { observed: bootstrap.lowerOneSided95, requiredGreaterThan: c.pairedSkillLower95GreaterThan, passed: bootstrap.lowerOneSided95 > c.pairedSkillLower95GreaterThan },
    pooledModelBrier: { observed: pooledModelBrier, maximum: c.pooledModelBrierMaximum, passed: pooledModelBrier <= c.pooledModelBrierMaximum },
    namuaModelBrier: { observed: byPhase.namua.modelBrier, maximum: c.namuaModelBrierMaximum, passed: byPhase.namua.modelBrier <= c.namuaModelBrierMaximum },
    mtajiModelBrier: { observed: byPhase.mtaji.modelBrier, maximum: c.mtajiModelBrierMaximum, passed: byPhase.mtaji.modelBrier <= c.mtajiModelBrierMaximum },
  } : null;
  const criteriaPassed = criteria ? Object.values(criteria).every((x) => x.passed) : false;
  const formalDecision = !gate.passed ? "INCONCLUSIVE" : criteriaPassed ? "CONFIRMED" : "NOT-CONFIRMED";
  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    formalDecision,
    estimabilityAndIdentityGates: gate,
    primary: {
      n: rows.length,
      frozenModelBrier: pooledModelBrier,
      frozenPhaseOnlyReferenceBrier: pooledReferenceBrier,
      observedPairedBrierSkill: observedSkill,
      bootstrap,
      criteria,
      allCriteriaPassed: criteriaPassed,
    },
    keySecondary: {
      pooledCalibrationBias: mean(rows.map((r) => r.frozenWinProbability - r.actorWin)),
      pooledReliability: reliability(rows, spec.keySecondary.fixedReliabilityBins),
      pooledLogLoss: exactLogLoss(rows),
      byPhase,
    },
    descriptiveStructuralHeterogeneity: heterogeneity(rows, spec),
    interpretationBoundary: spec.interpretationBoundary,
    source: C.provenance(spec),
  };
  C.writeJson(path.join(output, "stage2-formal-result.json"), result);
  console.log(JSON.stringify(result, null, 2));
}
if (require.main === module) main();
module.exports = { auc, bootstrapSkill, exactLogLoss, quantileFrozen, readiness, reliability };
