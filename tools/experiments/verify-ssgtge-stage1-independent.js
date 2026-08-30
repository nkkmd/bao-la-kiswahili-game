#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ind = require("./lib/ssgtge-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "artifacts/local/state-space-game-tree-growth-estimation/stage1-development-v1");
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/state-space-game-tree-growth-estimation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json"), "utf8"));
const DRSSE_RESULT = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json"), "utf8"));

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a, b, tolerance) {
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

function centeredLinear(points) {
  ensure(points.length >= 2, "independent linear fit requires points");
  const mx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const my = points.reduce((s, p) => s + p.y, 0) / points.length;
  let cov = 0;
  let variance = 0;
  for (const p of points) {
    cov += (p.x - mx) * (p.y - my);
    variance += (p.x - mx) ** 2;
  }
  ensure(variance > 1e-15, "independent linear fit singular");
  const slope = cov / variance;
  return { intercept: my - slope * mx, slope };
}

function det3(m) {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}

function columnReplace(m, c, v) {
  return m.map((row, r) => row.map((x, j) => (j === c ? v[r] : x)));
}

function cramersQuadratic(points) {
  ensure(points.length >= 3, "independent quadratic fit requires points");
  let x1 = 0, x2 = 0, x3 = 0, x4 = 0, y = 0, xy = 0, x2y = 0;
  for (const p of points) {
    const sq = p.x * p.x;
    x1 += p.x;
    x2 += sq;
    x3 += sq * p.x;
    x4 += sq * sq;
    y += p.y;
    xy += p.x * p.y;
    x2y += sq * p.y;
  }
  const m = [[points.length, x1, x2], [x1, x2, x3], [x2, x3, x4]];
  const v = [y, xy, x2y];
  const d = det3(m);
  ensure(Math.abs(d) > 1e-15, "independent quadratic fit singular");
  return {
    a: det3(columnReplace(m, 0, v)) / d,
    b: det3(columnReplace(m, 1, v)) / d,
    c: det3(columnReplace(m, 2, v)) / d,
  };
}

function independentParameters(rows, field, candidateId) {
  const series = rows.map((row) => ({ depth: Number(row.depth), value: Number(row[field]) }));
  if (candidateId === ind.CANDIDATES[0]) {
    const chosen = series.slice(-5).map((row) => ({ x: row.depth, y: Math.log(row.value) }));
    return { model: "log-linear", trainingDepths: chosen.map((p) => p.x), ...centeredLinear(chosen) };
  }
  if (candidateId === ind.CANDIDATES[1]) {
    const chosen = series.filter((row) => row.depth >= 2).map((row) => ({ x: row.depth, y: Math.log(row.value) }));
    return { model: "log-quadratic", trainingDepths: chosen.map((p) => p.x), ...cramersQuadratic(chosen) };
  }
  const logs = series.map((row) => ({ depth: row.depth, logValue: Math.log(row.value) }));
  const increments = [];
  for (let i = 1; i < logs.length; i += 1) increments.push({ x: logs[i].depth, y: logs[i].logValue - logs[i - 1].logValue });
  const chosen = increments.slice(-4);
  return {
    model: "local-log-increment-linear-trend",
    incrementDepths: chosen.map((p) => p.x),
    lastObservedDepth: series[series.length - 1].depth,
    lastObservedValue: series[series.length - 1].value,
    ...centeredLinear(chosen),
  };
}

function evaluate(layers, candidateId) {
  const cells = [];
  for (const field of SPEC.modeledSeries) {
    for (const origin of SPEC.rollingOrigins) {
      const train = layers.filter((row) => row.depth <= origin.trainThroughDepth);
      const p = ind.predict(train, field, origin.targetDepth, candidateId).prediction;
      const observed = Number(layers[origin.targetDepth][field]);
      const prior = Number(layers[origin.trainThroughDepth][field]);
      cells.push({
        field,
        trainThroughDepth: origin.trainThroughDepth,
        targetDepth: origin.targetDepth,
        priorObserved: prior,
        prediction: p,
        observed,
        absoluteLogError: Math.abs(Math.log(p) - Math.log(observed)),
        finitePositive: Number.isFinite(p) && p > 0,
        nondecreasingVersusPriorObserved: p >= prior,
      });
    }
  }
  const maxAbsoluteLogError = Math.max(...cells.map((c) => c.absoluteLogError));
  const meanAbsoluteLogError = cells.reduce((s, c) => s + c.absoluteLogError, 0) / cells.length;
  const eligible = cells.every((c) => c.finitePositive && c.nondecreasingVersusPriorObserved)
    && maxAbsoluteLogError <= Number(SPEC.eligibility.maximumAbsoluteNaturalLogError);
  return { candidateId, cells, maxAbsoluteLogError, meanAbsoluteLogError, eligible };
}

function forecast(layers, field, candidateId) {
  const rows = layers.map((row) => ({ depth: row.depth, [field]: Number(row[field]) }));
  const depth10 = ind.predict(rows, field, 10, candidateId).prediction;
  const depth11 = ind.predict([...rows, { depth: 10, [field]: depth10 }], field, 11, candidateId).prediction;
  return { depth10, depth11 };
}

function compareParameters(a, b, tolerance, label) {
  ensure(a.model === b.model, `${label} model mismatch`);
  for (const key of Object.keys(a)) {
    if (typeof a[key] === "number") ensure(nearlyEqual(a[key], b[key], tolerance), `${label} numeric parameter mismatch: ${key}`);
    else if (Array.isArray(a[key])) ensure(JSON.stringify(a[key]) === JSON.stringify(b[key]), `${label} array parameter mismatch: ${key}`);
    else ensure(a[key] === b[key], `${label} parameter mismatch: ${key}`);
  }
}

function main() {
  const production = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "stage1-production-result.json"), "utf8"));
  ensure(production.studyId === "SSGTGE-STUDY1" && production.stageId === SPEC.stageId, "Stage 1 production identity mismatch");
  ensure(production.freshHoldoutOutcomeGenerated === false && production.freshHoldoutRead === false && production.maximumDepthRead === 9, "Stage 1 holdout leakage detected");

  const source = ind.inspectDevelopmentSource(DRSSE_RESULT);
  ensure(source.sourceSummarySha256 === SPEC.upstreamDevelopmentSource.expectedSourceSummarySha256, "independent development source mismatch");
  ensure(source.sourceSummarySha256 === production.developmentSourceSummarySha256, "production/independent source summary mismatch");

  const tolerance = Number(SPEC.crossImplementationRelativeTolerance);
  const candidates = SPEC.candidateEstimators.map((candidateId) => evaluate(source.layers, candidateId));
  ensure(candidates.length === production.candidates.length, "candidate count mismatch");
  for (let i = 0; i < candidates.length; i += 1) {
    const a = candidates[i];
    const b = production.candidates[i];
    ensure(a.candidateId === b.candidateId && a.eligible === b.eligible, `candidate eligibility mismatch: ${a.candidateId}`);
    ensure(nearlyEqual(a.maxAbsoluteLogError, b.maxAbsoluteLogError, tolerance), `max error mismatch: ${a.candidateId}`);
    ensure(nearlyEqual(a.meanAbsoluteLogError, b.meanAbsoluteLogError, tolerance), `mean error mismatch: ${a.candidateId}`);
    ensure(a.cells.length === b.cells.length, `cell count mismatch: ${a.candidateId}`);
    for (let j = 0; j < a.cells.length; j += 1) {
      ensure(a.cells[j].field === b.cells[j].field && a.cells[j].targetDepth === b.cells[j].targetDepth, "cell identity mismatch");
      ensure(nearlyEqual(a.cells[j].prediction, b.cells[j].prediction, tolerance), `prediction mismatch: ${a.candidateId}/${a.cells[j].field}/${a.cells[j].targetDepth}`);
      ensure(nearlyEqual(a.cells[j].absoluteLogError, b.cells[j].absoluteLogError, tolerance), `error mismatch: ${a.candidateId}/${a.cells[j].field}/${a.cells[j].targetDepth}`);
    }
  }

  const eligible = candidates.filter((row) => row.eligible).sort((a, b) => {
    if (a.maxAbsoluteLogError !== b.maxAbsoluteLogError) return a.maxAbsoluteLogError - b.maxAbsoluteLogError;
    if (a.meanAbsoluteLogError !== b.meanAbsoluteLogError) return a.meanAbsoluteLogError - b.meanAbsoluteLogError;
    return SPEC.candidateEstimators.indexOf(a.candidateId) - SPEC.candidateEstimators.indexOf(b.candidateId);
  });
  const selectedEstimator = eligible.length ? eligible[0].candidateId : null;
  const expectedDecision = selectedEstimator ? SPEC.stage1SuccessToken : SPEC.stage1NoEligibleToken;
  ensure(production.stage1Decision === expectedDecision && production.selectedEstimator === selectedEstimator, "Stage 1 deterministic selection mismatch");

  let independentFreeze = null;
  if (selectedEstimator) {
    const selected = eligible[0];
    const q = selected.maxAbsoluteLogError;
    const R1 = Math.max(0.15, 2 * q);
    const R2 = 2 * R1;
    ensure(nearlyEqual(q, production.calibration.q, tolerance) && nearlyEqual(R1, production.calibration.R1, tolerance) && nearlyEqual(R2, production.calibration.R2, tolerance), "calibration mismatch");
    const parameters = {};
    const forecasts = {};
    for (const field of SPEC.modeledSeries) {
      parameters[field] = independentParameters(source.layers, field, selectedEstimator);
      compareParameters(parameters[field], production.selectedEstimatorParameters[field], tolerance, field);
      const points = forecast(source.layers, field, selectedEstimator);
      forecasts[field] = {
        depth10: { point: points.depth10, lower: points.depth10 * Math.exp(-R1), upper: points.depth10 * Math.exp(R1) },
        depth11: { point: points.depth11, lower: points.depth11 * Math.exp(-R2), upper: points.depth11 * Math.exp(R2) },
      };
      ensure(nearlyEqual(points.depth10, production.forecasts[field].depth10.point, tolerance), `${field} depth10 forecast mismatch`);
      ensure(nearlyEqual(points.depth11, production.forecasts[field].depth11.point, tolerance), `${field} depth11 forecast mismatch`);
      ensure(nearlyEqual(forecasts[field].depth10.lower, production.forecasts[field].depth10.envelope.lower, tolerance), `${field} depth10 lower mismatch`);
      ensure(nearlyEqual(forecasts[field].depth10.upper, production.forecasts[field].depth10.envelope.upper, tolerance), `${field} depth10 upper mismatch`);
      ensure(nearlyEqual(forecasts[field].depth11.lower, production.forecasts[field].depth11.envelope.lower, tolerance), `${field} depth11 lower mismatch`);
      ensure(nearlyEqual(forecasts[field].depth11.upper, production.forecasts[field].depth11.envelope.upper, tolerance), `${field} depth11 upper mismatch`);
    }
    independentFreeze = { selectedEstimator, q, R1, R2, parameters, forecasts };
  }

  const resultCore = {
    schemaVersion: 1,
    studyId: "SSGTGE-STUDY1",
    stageId: SPEC.stageId,
    resultClass: "DEVELOPMENT-ESTIMATOR-SELECTION-AND-FREEZE",
    stage1Decision: expectedDecision,
    selectedEstimator,
    passed: true,
    productionCoreSha256: production.productionCoreSha256,
    independentSourceSummarySha256: source.sourceSummarySha256,
    independentCandidateCoreSha256: ind.digest(candidates),
    independentFreeze,
    crossImplementationRelativeTolerance: tolerance,
    freshHoldoutOutcomeGenerated: false,
    freshHoldoutRead: false,
    maximumDepthRead: 9,
    importsProductionGrowthEstimator: false,
    stage2ExecutionAuthorized: false,
  };
  const result = { ...resultCore, resultCoreSha256: ind.digest(resultCore) };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_1_DEVELOPMENT_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`SSGTGE_STAGE1_INDEPENDENT=${JSON.stringify({ passed: true, stage1Decision: expectedDecision, selectedEstimator, resultCoreSha256: result.resultCoreSha256 })}`);
}

main();
