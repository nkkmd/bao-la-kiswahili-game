#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const C = require("./lib/position-evaluation-calibration-common.js");

const PHASES = ["namua", "mtaji"];
const CV_SALT = "PEC-S1-CV-v1";
const ANALYSIS_ID = "PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1";
const METHOD_PATH = path.join(
  C.ROOT,
  "doc/position-evaluation-calibration/preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}
function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, {
      cwd: C.ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch { return fallback; }
}
function finiteNumber(value) { return typeof value === "number" && Number.isFinite(value); }
function sigmoid(eta) {
  if (eta >= 0) return 1 / (1 + Math.exp(-eta));
  const e = Math.exp(eta);
  return e / (1 + e);
}
function log1pExp(x) {
  if (x > 0) return x + Math.log1p(Math.exp(-x));
  return Math.log1p(Math.exp(x));
}
function logLikelihood(rows, beta0, beta1) {
  let value = 0;
  for (const row of rows) {
    const eta = beta0 + beta1 * row.z;
    value += row.y * eta - log1pExp(eta);
  }
  return value;
}
function logisticStats(rows, beta0, beta1) {
  let g0 = 0;
  let g1 = 0;
  let i00 = 0;
  let i01 = 0;
  let i11 = 0;
  for (const row of rows) {
    const eta = beta0 + beta1 * row.z;
    const p = sigmoid(eta);
    const r = row.y - p;
    const w = p * (1 - p);
    g0 += r;
    g1 += r * row.z;
    i00 += w;
    i01 += w * row.z;
    i11 += w * row.z * row.z;
  }
  return {
    g0, g1, i00, i01, i11,
    maxAbsGradient: Math.max(Math.abs(g0), Math.abs(g1)),
  };
}
function fitLogisticRows(rows, method) {
  if (!rows.length) return { eligible: false, reason: "no-rows" };
  let beta0 = method.initialParametersPerPhase[0];
  let beta1 = method.initialParametersPerPhase[1];
  for (let iteration = 0; iteration < method.maxIterations; iteration += 1) {
    const stats = logisticStats(rows, beta0, beta1);
    if (![stats.g0, stats.g1, stats.i00, stats.i01, stats.i11].every(finiteNumber)) {
      return { eligible: false, reason: "non-finite-gradient-or-information", iteration };
    }
    if (stats.maxAbsGradient <= method.gradientTolerance) {
      return {
        eligible: true,
        converged: true,
        iterations: iteration,
        beta0,
        beta1,
        maxAbsGradient: stats.maxAbsGradient,
        logLikelihood: logLikelihood(rows, beta0, beta1),
      };
    }
    const determinant = stats.i00 * stats.i11 - stats.i01 * stats.i01;
    if (!finiteNumber(determinant) || determinant === 0) {
      return { eligible: false, reason: "singular-or-non-finite-information", iteration };
    }
    const delta0 = (stats.g0 * stats.i11 - stats.g1 * stats.i01) / determinant;
    const delta1 = (stats.i00 * stats.g1 - stats.i01 * stats.g0) / determinant;
    if (![delta0, delta1].every(finiteNumber)) {
      return { eligible: false, reason: "non-finite-newton-step", iteration };
    }
    const current = logLikelihood(rows, beta0, beta1);
    let accepted = null;
    for (let halving = 0; halving <= method.maximumStepHalvings; halving += 1) {
      const factor = 2 ** (-halving);
      const candidate0 = beta0 + factor * delta0;
      const candidate1 = beta1 + factor * delta1;
      const candidateLl = logLikelihood(rows, candidate0, candidate1);
      if (finiteNumber(candidateLl) && candidateLl >= current) {
        accepted = { beta0: candidate0, beta1: candidate1 };
        break;
      }
    }
    if (!accepted) {
      return { eligible: false, reason: "step-halving-failed", iteration };
    }
    beta0 = accepted.beta0;
    beta1 = accepted.beta1;
  }
  const stats = logisticStats(rows, beta0, beta1);
  if (finiteNumber(stats.maxAbsGradient) && stats.maxAbsGradient <= method.gradientTolerance) {
    return {
      eligible: true,
      converged: true,
      iterations: method.maxIterations,
      beta0,
      beta1,
      maxAbsGradient: stats.maxAbsGradient,
      logLikelihood: logLikelihood(rows, beta0, beta1),
    };
  }
  return {
    eligible: false,
    reason: "maximum-iterations-without-gradient-convergence",
    iterations: method.maxIterations,
    beta0,
    beta1,
    maxAbsGradient: stats.maxAbsGradient,
  };
}
function fitPhaseAwareLogistic(rows, method) {
  const phaseFits = {};
  for (const phase of PHASES) {
    const fit = fitLogisticRows(rows.filter((row) => row.phase === phase), method);
    phaseFits[phase] = fit;
    if (!fit.eligible) return { eligible: false, reason: `${phase}:${fit.reason}`, phaseFits };
  }
  return { eligible: true, phaseFits };
}
function predictPhaseAwareLogistic(fit, row) {
  const p = fit.phaseFits[row.phase];
  return sigmoid(p.beta0 + p.beta1 * row.z);
}
function fitIsotonicPhase(rows) {
  if (!rows.length) return { eligible: false, reason: "no-rows" };
  const sorted = [...rows].sort((a, b) => a.z - b.z || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const support = [];
  for (const row of sorted) {
    const last = support[support.length - 1];
    if (last && last.z === row.z) {
      last.weight += 1;
      last.sumY += row.y;
    } else {
      support.push({ z: row.z, weight: 1, sumY: row.y });
    }
  }
  const blocks = [];
  for (const point of support) {
    blocks.push({
      minZ: point.z,
      maxZ: point.z,
      weight: point.weight,
      sumY: point.sumY,
      mean: point.sumY / point.weight,
    });
    while (blocks.length >= 2 && blocks[blocks.length - 2].mean > blocks[blocks.length - 1].mean) {
      const right = blocks.pop();
      const left = blocks.pop();
      const weight = left.weight + right.weight;
      const sumY = left.sumY + right.sumY;
      blocks.push({
        minZ: left.minZ,
        maxZ: right.maxZ,
        weight,
        sumY,
        mean: sumY / weight,
      });
    }
  }
  if (!blocks.length || blocks.some((block) => !finiteNumber(block.mean))) {
    return { eligible: false, reason: "non-finite-or-empty-blocks" };
  }
  return { eligible: true, supportPoints: support.length, blocks };
}
function fitPhaseStratifiedIsotonic(rows) {
  const phaseFits = {};
  for (const phase of PHASES) {
    const fit = fitIsotonicPhase(rows.filter((row) => row.phase === phase));
    phaseFits[phase] = fit;
    if (!fit.eligible) return { eligible: false, reason: `${phase}:${fit.reason}`, phaseFits };
  }
  return { eligible: true, phaseFits };
}
function predictIsotonicPhase(fit, z) {
  const blocks = fit.blocks;
  if (z < blocks[0].minZ) return blocks[0].mean;
  let chosen = blocks[0];
  for (const block of blocks) {
    if (block.minZ <= z) chosen = block;
    else break;
  }
  return chosen.mean;
}
function predictPhaseStratifiedIsotonic(fit, row) {
  return predictIsotonicPhase(fit.phaseFits[row.phase], row.z);
}
function fitCandidate(id, rows, method) {
  if (id === "phase-aware-logistic") return fitPhaseAwareLogistic(rows, method.phaseAwareLogistic);
  if (id === "phase-stratified-isotonic") return fitPhaseStratifiedIsotonic(rows);
  throw new Error(`Unknown candidate: ${id}`);
}
function predictCandidate(id, fit, row) {
  if (id === "phase-aware-logistic") return predictPhaseAwareLogistic(fit, row);
  if (id === "phase-stratified-isotonic") return predictPhaseStratifiedIsotonic(fit, row);
  throw new Error(`Unknown candidate: ${id}`);
}
function cvFold(hash, foldCount) {
  const digest = sha256(`${CV_SALT}|${hash}`);
  return Number(BigInt(`0x${digest}`) % BigInt(foldCount));
}
function metricSummary(predictions) {
  if (!predictions.length) return { n: 0, brier: null, logLoss: null };
  let brier = 0;
  let logLoss = 0;
  for (const row of predictions) {
    brier += (row.p - row.y) ** 2;
    const clipped = Math.min(1 - 1e-15, Math.max(1e-15, row.p));
    logLoss += -(row.y * Math.log(clipped) + (1 - row.y) * Math.log(1 - clipped));
  }
  return { n: predictions.length, brier: brier / predictions.length, logLoss: logLoss / predictions.length };
}
function crossValidate(id, rows, spec, method) {
  const foldCount = spec.modelDevelopment.folds.count;
  const predictions = [];
  const folds = [];
  for (let fold = 0; fold < foldCount; fold += 1) {
    const train = rows.filter((row) => row.fold !== fold);
    const test = rows.filter((row) => row.fold === fold);
    const fit = fitCandidate(id, train, method);
    if (!fit.eligible) {
      return {
        eligible: false,
        reason: `fold-${fold}:${fit.reason}`,
        failedFold: fold,
        fit,
      };
    }
    const foldPredictions = test.map((row) => ({
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      phase: row.phase,
      y: row.y,
      p: predictCandidate(id, fit, row),
    }));
    if (foldPredictions.some((row) => !finiteNumber(row.p) || row.p < 0 || row.p > 1)) {
      return { eligible: false, reason: `fold-${fold}:invalid-prediction`, failedFold: fold };
    }
    predictions.push(...foldPredictions);
    folds.push({ fold, trainN: train.length, testN: test.length, metrics: metricSummary(foldPredictions) });
  }
  const byPhase = Object.fromEntries(PHASES.map((phase) => [
    phase,
    metricSummary(predictions.filter((row) => row.phase === phase)),
  ]));
  return {
    eligible: true,
    metrics: metricSummary(predictions),
    byPhase,
    folds,
  };
}
function readinessAudit(summary, verification, spec) {
  const g = spec.readinessGates;
  const checks = {
    uniqueHistoricalTrajectories: {
      observed: summary.uniqueHistoricalTrajectories, minimum: g.minimumUniqueHistoricalTrajectories,
      passed: summary.uniqueHistoricalTrajectories >= g.minimumUniqueHistoricalTrajectories,
    },
    selectedUniqueRuleStates: {
      observed: summary.selectedUniqueRuleStates, minimum: g.minimumSelectedUniqueRuleStates,
      passed: summary.selectedUniqueRuleStates >= g.minimumSelectedUniqueRuleStates,
    },
    namuaSelectedStates: {
      observed: summary.phaseCounts.namua, minimum: g.minimumNamuaSelectedStates,
      passed: summary.phaseCounts.namua >= g.minimumNamuaSelectedStates,
    },
    mtajiSelectedStates: {
      observed: summary.phaseCounts.mtaji, minimum: g.minimumMtajiSelectedStates,
      passed: summary.phaseCounts.mtaji >= g.minimumMtajiSelectedStates,
    },
    distinctOpeningPrefixes: {
      observed: summary.distinctOpeningPrefixes, minimum: g.minimumDistinctOpeningPrefixes,
      passed: summary.distinctOpeningPrefixes >= g.minimumDistinctOpeningPrefixes,
    },
    namuaDistinctStaticEvaluations: {
      observed: summary.distinctStaticEvaluationByPhase.namua, minimum: g.minimumDistinctStaticEvaluationsPerPhase,
      passed: summary.distinctStaticEvaluationByPhase.namua >= g.minimumDistinctStaticEvaluationsPerPhase,
    },
    mtajiDistinctStaticEvaluations: {
      observed: summary.distinctStaticEvaluationByPhase.mtaji, minimum: g.minimumDistinctStaticEvaluationsPerPhase,
      passed: summary.distinctStaticEvaluationByPhase.mtaji >= g.minimumDistinctStaticEvaluationsPerPhase,
    },
    namuaActorWins: {
      observed: summary.outcomeByPhase.namua.actorWins, minimum: g.minimumActorWinsPerPhase,
      passed: summary.outcomeByPhase.namua.actorWins >= g.minimumActorWinsPerPhase,
    },
    namuaActorLosses: {
      observed: summary.outcomeByPhase.namua.actorLosses, minimum: g.minimumActorLossesPerPhase,
      passed: summary.outcomeByPhase.namua.actorLosses >= g.minimumActorLossesPerPhase,
    },
    mtajiActorWins: {
      observed: summary.outcomeByPhase.mtaji.actorWins, minimum: g.minimumActorWinsPerPhase,
      passed: summary.outcomeByPhase.mtaji.actorWins >= g.minimumActorWinsPerPhase,
    },
    mtajiActorLosses: {
      observed: summary.outcomeByPhase.mtaji.actorLosses, minimum: g.minimumActorLossesPerPhase,
      passed: summary.outcomeByPhase.mtaji.actorLosses >= g.minimumActorLossesPerPhase,
    },
    administrativeTruncationRate: {
      observed: summary.administrativeTruncationRate, maximum: g.maximumAdministrativeTruncationRate,
      passed: summary.administrativeTruncationRate <= g.maximumAdministrativeTruncationRate,
    },
    independentVerification: { observed: verification.passed, required: true, passed: verification.passed === true },
    measurementHashMatch: { observed: verification.measurementHashMatches, required: true, passed: verification.measurementHashMatches === true },
  };
  return { passed: Object.values(checks).every((row) => row.passed), checks };
}
function parseArgs(argv) {
  const options = { output: C.DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") options.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return options;
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  const { spec, specSha256 } = loaded;
  const methodText = fs.readFileSync(METHOD_PATH, "utf8");
  const method = JSON.parse(methodText);
  if (method.studyId !== spec.studyId || method.stageId !== spec.stageId || method.analysisId !== ANALYSIS_ID) {
    throw new Error("Stage 1 analysis method freeze identity mismatch");
  }
  if (method.scientificInferenceAuthorized !== false || method.confirmatoryReuseAllowed !== false
    || method.stage2GenerationAuthorized !== false) {
    throw new Error("Invalid analysis authorization boundary");
  }
  const generationPath = path.join(options.output, "generation-manifest.json");
  const summaryPath = path.join(options.output, "stage1-selection-measurement-summary.json");
  const verificationPath = path.join(options.output, "verification.json");
  const generation = readJson(generationPath);
  const summary = readJson(summaryPath);
  const verification = readJson(verificationPath);
  for (const artifact of [generation, summary, verification]) {
    if (artifact.studyId !== spec.studyId || artifact.stageId !== spec.stageId || artifact.specSha256 !== specSha256) {
      throw new Error("Stage 1 artifact identity/spec mismatch");
    }
  }
  if (generation.games !== spec.population.games || generation.seedStart !== spec.population.seedStart
    || generation.seedEnd !== spec.population.seedEnd) {
    throw new Error("Generation manifest does not match frozen population/seeds");
  }
  if (verification.passed !== true || verification.gamesVerified !== spec.population.games
    || verification.gameReplayMismatches !== 0 || verification.measurementMismatches !== 0
    || verification.measurementHashMatches !== true) {
    throw new Error("Independent verification gate failed");
  }
  const readiness = readinessAudit(summary, verification, spec);
  if (!readiness.passed) throw new Error("Stage 1 readiness gate failed; analysis is blocked");

  const measurementDir = path.join(options.output, "measurements");
  const measurementFiles = fs.readdirSync(measurementDir)
    .filter((name) => /^selected-\d{4}\.json$/.test(name)).sort();
  if (measurementFiles.length !== summary.selectedUniqueRuleStates) {
    throw new Error("Measurement file count does not match frozen selection summary");
  }
  const measurements = measurementFiles.map((name) => readJson(path.join(measurementDir, name)));
  const recomputedMeasurementHash = sha256(JSON.stringify(measurements));
  if (recomputedMeasurementHash !== summary.measurementHash
    || recomputedMeasurementHash !== verification.storedMeasurementHash) {
    throw new Error("Measurement hash mismatch before Stage 1 model fitting");
  }
  const rows = measurements.filter((row) => !row.administrativeTruncation).map((row) => {
    if (![0, 1].includes(row.actorWin)) throw new Error("Invalid binary actorWin value");
    if (!PHASES.includes(row.phase)) throw new Error("Invalid phase");
    return {
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      phase: row.phase,
      z: row.staticBaoEvaluation / 100,
      y: row.actorWin,
      fold: cvFold(row.historicalTrajectoryHash, spec.modelDevelopment.folds.count),
    };
  });

  const candidateIds = spec.modelDevelopment.candidateFamilies.map((row) => row.id);
  const candidateCv = Object.fromEntries(candidateIds.map((id) => [id, crossValidate(id, rows, spec, method)]));
  const logistic = candidateCv["phase-aware-logistic"];
  const isotonic = candidateCv["phase-stratified-isotonic"];
  let selectedFamily = null;
  let selectionReason = null;
  if (logistic.eligible && isotonic.eligible) {
    if (isotonic.metrics.brier <= logistic.metrics.brier - 0.002) {
      selectedFamily = "phase-stratified-isotonic";
      selectionReason = "isotonic-brier-at-least-0.002-lower";
    } else {
      selectedFamily = "phase-aware-logistic";
      selectionReason = "logistic-preferred-by-frozen-0.002-rule";
    }
  } else if (logistic.eligible) {
    selectedFamily = "phase-aware-logistic";
    selectionReason = "only-eligible-candidate";
  } else if (isotonic.eligible) {
    selectedFamily = "phase-stratified-isotonic";
    selectionReason = "only-eligible-candidate";
  } else {
    selectionReason = "both-candidates-ineligible-stage1-inconclusive";
  }

  const fullFit = selectedFamily ? fitCandidate(selectedFamily, rows, method) : null;
  if (selectedFamily && !fullFit.eligible) {
    throw new Error("Selected candidate failed full-data refit; Stage 1 cannot be frozen for Stage 2");
  }
  const pooledLogisticReference = fitLogisticRows(rows, method.phaseAwareLogistic);
  const baseRates = Object.fromEntries(PHASES.map((phase) => {
    const phaseRows = rows.filter((row) => row.phase === phase);
    return [phase, {
      n: phaseRows.length,
      actorWins: phaseRows.filter((row) => row.y === 1).length,
      actorLosses: phaseRows.filter((row) => row.y === 0).length,
      actorWinRate: phaseRows.reduce((sum, row) => sum + row.y, 0) / phaseRows.length,
      zMin: Math.min(...phaseRows.map((row) => row.z)),
      zMax: Math.max(...phaseRows.map((row) => row.z)),
    }];
  }));
  const foldCounts = Object.fromEntries(Array.from({ length: spec.modelDevelopment.folds.count }, (_, fold) => [
    String(fold), rows.filter((row) => row.fold === fold).length,
  ]));
  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    analysisId: ANALYSIS_ID,
    specSha256,
    analysisMethodFreezeSha256: sha256(methodText),
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    stage2GenerationAuthorized: false,
    inputAudit: {
      generationManifestSha256: sha256(fs.readFileSync(generationPath)),
      selectionMeasurementSummarySha256: sha256(fs.readFileSync(summaryPath)),
      verificationSha256: sha256(fs.readFileSync(verificationPath)),
      measurementHash: recomputedMeasurementHash,
      selectedBinaryRows: rows.length,
      readiness,
    },
    foldAssignment: {
      salt: CV_SALT,
      convention: method.crossValidation.shaIntegerConvention,
      counts: foldCounts,
    },
    baseRates,
    candidateCv,
    selection: {
      selectedFamily,
      reason: selectionReason,
      thresholdAbsoluteBrierImprovementRequiredForIsotonic: 0.002,
      stage1DevelopmentStatus: selectedFamily ? "MODEL-SELECTED-EXPLORATORY" : "INCONCLUSIVE-NO-STAGE2",
    },
    fullFit,
    pooledLogisticReference: {
      descriptiveOnly: true,
      fit: pooledLogisticReference,
    },
    interpretationBoundary: {
      empiricalWinProbabilityConditionalOnFrozenPopulationAndPolicy: true,
      formalCalibrationClaimAuthorized: false,
      gameTheoreticValueClaimAuthorized: false,
      humanAdvantagePerceptionClaimAuthorized: false,
      causalClaimAuthorized: false,
      priorStudyDecisionRevisionAuthorized: false,
    },
    analysisProvenance: {
      sourceCommit: gitValue(["rev-parse", "HEAD"]),
      analysisCodeSha256: sha256(fs.readFileSync(__filename)),
      analysisCodeDirty: Boolean(gitValue(["status", "--porcelain", "--", path.relative(C.ROOT, __filename), path.relative(C.ROOT, METHOD_PATH)], "")),
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };
  const resultPath = path.join(options.output, "stage1-exploratory-calibration-result.json");
  writeJsonAtomic(resultPath, result);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  crossValidate,
  cvFold,
  fitIsotonicPhase,
  fitLogisticRows,
  main,
  metricSummary,
  readinessAudit,
};
