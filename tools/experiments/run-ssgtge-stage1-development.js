#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");
const growth = require("./lib/ssgtge-production.js");

const STUDY_ID = "SSGTGE-STUDY1";
const STAGE_ID = "SSGTGE-S1-DEVELOPMENT-2026-08-30-v1";
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "artifacts/local/state-space-game-tree-growth-estimation/stage1-development-v1");
const SPEC_PATH = path.join(ROOT, "doc/state-space-game-tree-growth-estimation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/state-space-game-tree-growth-estimation/authorizations/STAGE_1_DEVELOPMENT_EXECUTE.json");
const DRSSE_RESULT_PATH = path.join(ROOT, "doc/deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(args) {
  return childProcess.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function verifyAuthorization(auth) {
  const head = git(["rev-parse", "HEAD"]);
  const parent = git(["rev-parse", "HEAD^"]);
  ensure(auth.studyId === STUDY_ID && auth.stageId === STAGE_ID, "Stage 1 authorization identity mismatch");
  ensure(auth.executionAuthorized === true, "Stage 1 execution authorization required");
  ensure(auth.realDevelopmentCandidateEvaluationAuthorized === true, "Stage 1 development evaluation must be explicitly authorized");
  ensure(auth.freshDepth10Or11GenerationAuthorized === false, "fresh holdout generation must remain forbidden");
  ensure(auth.freshDepth10ReadAuthorized === false && auth.freshDepth11ReadAuthorized === false, "fresh holdout read must remain forbidden");
  ensure(auth.stage2ExecutionAuthorized === false, "Stage 2 must remain unauthorized");
  ensure(parent === auth.implementationFreezeCommitSha, "Stage 1 execution commit parent must equal implementation/source freeze commit");
  ensure(head !== parent, "Stage 1 authorization must be a separate commit");
  for (const item of auth.frozenSources) {
    const actual = git(["hash-object", item.path]);
    ensure(actual === item.gitBlobSha, `Stage 1 Git blob identity mismatch: ${item.path}`);
  }
  return { head, parent };
}

function linearFit(points) {
  ensure(points.length >= 2, "linear fit requires at least two points");
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const denom = n * sxx - sx * sx;
  ensure(Math.abs(denom) > 1e-15, "linear fit singular");
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  ensure(Number.isFinite(intercept) && Number.isFinite(slope), "linear parameters non-finite");
  return { intercept, slope };
}

function solve3(matrix, vector) {
  const a = matrix.map((row, i) => [...row, vector[i]]);
  for (let col = 0; col < 3; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < 3; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    ensure(Math.abs(a[pivot][col]) > 1e-15, "quadratic fit singular");
    if (pivot !== col) [a[pivot], a[col]] = [a[col], a[pivot]];
    const divisor = a[col][col];
    for (let j = col; j < 4; j += 1) a[col][j] /= divisor;
    for (let row = 0; row < 3; row += 1) {
      if (row === col) continue;
      const factor = a[row][col];
      for (let j = col; j < 4; j += 1) a[row][j] -= factor * a[col][j];
    }
  }
  return { a: a[0][3], b: a[1][3], c: a[2][3] };
}

function quadraticFit(points) {
  ensure(points.length >= 3, "quadratic fit requires at least three points");
  let s0 = 0, s1 = 0, s2 = 0, s3 = 0, s4 = 0, sy = 0, sxy = 0, sx2y = 0;
  for (const point of points) {
    const x = point.x;
    const x2 = x * x;
    s0 += 1;
    s1 += x;
    s2 += x2;
    s3 += x2 * x;
    s4 += x2 * x2;
    sy += point.y;
    sxy += x * point.y;
    sx2y += x2 * point.y;
  }
  const fit = solve3([[s0, s1, s2], [s1, s2, s3], [s2, s3, s4]], [sy, sxy, sx2y]);
  ensure(Object.values(fit).every(Number.isFinite), "quadratic parameters non-finite");
  return fit;
}

function fittedParameters(rows, field, candidateId) {
  const series = rows.map((row) => ({ depth: Number(row.depth), value: Number(row[field]) }));
  if (candidateId === growth.CANDIDATE_IDS[0]) {
    const chosen = series.slice(-5).map((row) => ({ x: row.depth, y: Math.log(row.value) }));
    return { model: "log-linear", trainingDepths: chosen.map((p) => p.x), ...linearFit(chosen) };
  }
  if (candidateId === growth.CANDIDATE_IDS[1]) {
    const chosen = series.filter((row) => row.depth >= 2).map((row) => ({ x: row.depth, y: Math.log(row.value) }));
    return { model: "log-quadratic", trainingDepths: chosen.map((p) => p.x), ...quadraticFit(chosen) };
  }
  const logs = series.map((row) => ({ depth: row.depth, logValue: Math.log(row.value) }));
  const increments = [];
  for (let i = 1; i < logs.length; i += 1) {
    increments.push({ x: logs[i].depth, y: logs[i].logValue - logs[i - 1].logValue });
  }
  const chosen = increments.slice(-4);
  return {
    model: "local-log-increment-linear-trend",
    incrementDepths: chosen.map((p) => p.x),
    lastObservedDepth: series[series.length - 1].depth,
    lastObservedValue: series[series.length - 1].value,
    ...linearFit(chosen),
  };
}

function evaluateCandidate(layers, spec, candidateId) {
  const cells = [];
  for (const field of spec.modeledSeries) {
    for (const origin of spec.rollingOrigins) {
      const rows = layers.filter((row) => row.depth <= origin.trainThroughDepth);
      const predicted = growth.predictCandidate(rows, field, origin.targetDepth, candidateId);
      const observed = Number(layers[origin.targetDepth][field]);
      const priorObserved = Number(layers[origin.trainThroughDepth][field]);
      const absoluteLogError = Math.abs(Math.log(predicted.prediction) - Math.log(observed));
      cells.push({
        field,
        trainThroughDepth: origin.trainThroughDepth,
        targetDepth: origin.targetDepth,
        priorObserved,
        prediction: predicted.prediction,
        observed,
        absoluteLogError,
        finitePositive: Number.isFinite(predicted.prediction) && predicted.prediction > 0,
        nondecreasingVersusPriorObserved: predicted.prediction >= priorObserved,
      });
    }
  }
  ensure(cells.length === spec.eligibility.cellCount, "unexpected Stage 1 backtest cell count");
  const maxAbsoluteLogError = Math.max(...cells.map((cell) => cell.absoluteLogError));
  const meanAbsoluteLogError = cells.reduce((sum, cell) => sum + cell.absoluteLogError, 0) / cells.length;
  const eligible = cells.every((cell) => cell.finitePositive && cell.nondecreasingVersusPriorObserved)
    && maxAbsoluteLogError <= Number(spec.eligibility.maximumAbsoluteNaturalLogError);
  return { candidateId, cells, maxAbsoluteLogError, meanAbsoluteLogError, eligible };
}

function recursiveForecast(layers, field, candidateId) {
  const rows10 = layers.map((row) => ({ depth: row.depth, [field]: Number(row[field]) }));
  const depth10 = growth.predictCandidate(rows10, field, 10, candidateId).prediction;
  const rows11 = [...rows10, { depth: 10, [field]: depth10 }];
  const depth11 = growth.predictCandidate(rows11, field, 11, candidateId).prediction;
  return { depth10, depth11 };
}

function envelope(point, radius) {
  return { lower: point * Math.exp(-radius), upper: point * Math.exp(radius), radius };
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const provenance = verifyAuthorization(auth);
  ensure(spec.studyId === STUDY_ID && spec.stageId === STAGE_ID, "Stage 1 spec identity mismatch");
  ensure(spec.freshHoldoutGenerationAuthorized === false && spec.freshDepth10ReadAuthorized === false && spec.freshDepth11ReadAuthorized === false, "Stage 1 fresh holdout firewall failure");

  const drsseResult = readJson(DRSSE_RESULT_PATH);
  const source = growth.extractDevelopmentSource(drsseResult);
  ensure(source.maximumDepthRead === 9 && source.freshHoldoutRead === false, "Stage 1 development source exceeded depth 9");
  ensure(source.sourceSummarySha256 === spec.upstreamDevelopmentSource.expectedSourceSummarySha256, "Stage 1 development source hash mismatch");

  const candidates = spec.candidateEstimators.map((candidateId) => evaluateCandidate(source.layers, spec, candidateId));
  const eligible = candidates.filter((row) => row.eligible);
  eligible.sort((a, b) => {
    if (a.maxAbsoluteLogError !== b.maxAbsoluteLogError) return a.maxAbsoluteLogError - b.maxAbsoluteLogError;
    if (a.meanAbsoluteLogError !== b.meanAbsoluteLogError) return a.meanAbsoluteLogError - b.meanAbsoluteLogError;
    return spec.candidateEstimators.indexOf(a.candidateId) - spec.candidateEstimators.indexOf(b.candidateId);
  });

  let decisionCore;
  if (eligible.length === 0) {
    decisionCore = {
      stage1Decision: spec.stage1NoEligibleToken,
      selectedEstimator: null,
      selectedEstimatorParameters: null,
      calibration: null,
      forecasts: null,
    };
  } else {
    const selected = eligible[0];
    const q = selected.maxAbsoluteLogError;
    const R1 = Math.max(0.15, 2 * q);
    const R2 = 2 * R1;
    const selectedEstimatorParameters = {};
    const forecasts = {};
    for (const field of spec.modeledSeries) {
      selectedEstimatorParameters[field] = fittedParameters(source.layers, field, selected.candidateId);
      const points = recursiveForecast(source.layers, field, selected.candidateId);
      forecasts[field] = {
        depth10: { point: points.depth10, envelope: envelope(points.depth10, R1) },
        depth11: { point: points.depth11, envelope: envelope(points.depth11, R2) },
      };
    }
    decisionCore = {
      stage1Decision: spec.stage1SuccessToken,
      selectedEstimator: selected.candidateId,
      selectedEstimatorParameters,
      calibration: { q, R1, R2 },
      forecasts,
    };
  }

  const resultCore = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    resultClass: "DEVELOPMENT-ESTIMATOR-SELECTION-AND-FREEZE",
    formalScientificInferenceAuthorized: false,
    freshHoldoutOutcomeGenerated: false,
    freshHoldoutRead: false,
    maximumDepthRead: 9,
    authorization: provenance,
    developmentSourceSummarySha256: source.sourceSummarySha256,
    candidateOrder: spec.candidateEstimators,
    modeledSeries: spec.modeledSeries,
    rollingOrigins: spec.rollingOrigins,
    eligibilityThreshold: spec.eligibility.maximumAbsoluteNaturalLogError,
    candidates,
    ...decisionCore,
    stage2ExecutionAuthorized: false,
  };
  const result = { ...resultCore, productionCoreSha256: growth.sha256Text(growth.stableStringify(resultCore)) };
  fs.writeFileSync(path.join(OUT_DIR, "stage1-production-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`SSGTGE_STAGE1_PRODUCTION=${JSON.stringify({ passed: true, stage1Decision: result.stage1Decision, selectedEstimator: result.selectedEstimator, productionCoreSha256: result.productionCoreSha256, outDir: OUT_DIR })}`);
}

main();
