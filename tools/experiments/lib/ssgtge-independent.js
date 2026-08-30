"use strict";

const crypto = require("node:crypto");

const CANDIDATES = [
  "E1-TRAILING-LOG-LINEAR-W5",
  "E2-LOG-QUADRATIC-D2PLUS",
  "E3-LOCAL-LOG-INCREMENT-TREND-W4",
];

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}

function digest(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : canonical(value), "utf8").digest("hex");
}

function readSeries(rows, field) {
  assertOk(Array.isArray(rows) && rows.length > 0, "series rows required");
  const out = rows.map((row) => [Number(row.depth), Number(row[field])]).sort((a, b) => a[0] - b[0]);
  out.forEach((pair, i) => {
    assertOk(Number.isInteger(pair[0]) && pair[0] >= 0, "invalid depth");
    assertOk(Number.isFinite(pair[1]) && pair[1] > 0, "invalid positive value");
    if (i) assertOk(pair[0] === out[i - 1][0] + 1, "noncontiguous depth series");
  });
  return out;
}

function linearRegression(xs, ys) {
  assertOk(xs.length === ys.length && xs.length >= 2, "linear regression shape");
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let variance = 0;
  for (let i = 0; i < n; i += 1) {
    cov += (xs[i] - meanX) * (ys[i] - meanY);
    variance += (xs[i] - meanX) ** 2;
  }
  assertOk(variance > 1e-15, "linear regression singular");
  const slope = cov / variance;
  return [meanY - slope * meanX, slope];
}

function determinant3(m) {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}

function replaceColumn(m, column, v) {
  return m.map((row, r) => row.map((value, c) => (c === column ? v[r] : value)));
}

function quadraticRegression(xs, ys) {
  assertOk(xs.length === ys.length && xs.length >= 3, "quadratic regression shape");
  const sums = { n: xs.length, x: 0, x2: 0, x3: 0, x4: 0, y: 0, xy: 0, x2y: 0 };
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs[i];
    const x2 = x * x;
    sums.x += x;
    sums.x2 += x2;
    sums.x3 += x2 * x;
    sums.x4 += x2 * x2;
    sums.y += ys[i];
    sums.xy += x * ys[i];
    sums.x2y += x2 * ys[i];
  }
  const m = [[sums.n, sums.x, sums.x2], [sums.x, sums.x2, sums.x3], [sums.x2, sums.x3, sums.x4]];
  const v = [sums.y, sums.xy, sums.x2y];
  const det = determinant3(m);
  assertOk(Math.abs(det) > 1e-15, "quadratic regression singular");
  return [0, 1, 2].map((column) => determinant3(replaceColumn(m, column, v)) / det);
}

function predict(rows, field, targetDepth, candidateId) {
  assertOk(CANDIDATES.includes(candidateId), "unknown candidate");
  const pairs = readSeries(rows, field).filter(([depth]) => depth < targetDepth);
  assertOk(pairs[pairs.length - 1][0] === targetDepth - 1, "target must be next depth");
  let logPrediction;
  if (candidateId === CANDIDATES[0]) {
    assertOk(pairs.length >= 5, "E1 minimum history");
    const chosen = pairs.slice(-5);
    const [a, b] = linearRegression(chosen.map((p) => p[0]), chosen.map((p) => Math.log(p[1])));
    logPrediction = a + b * targetDepth;
  } else if (candidateId === CANDIDATES[1]) {
    const chosen = pairs.filter((p) => p[0] >= 2);
    assertOk(chosen.length >= 3, "E2 minimum history");
    const [a, b, c] = quadraticRegression(chosen.map((p) => p[0]), chosen.map((p) => Math.log(p[1])));
    logPrediction = a + b * targetDepth + c * targetDepth * targetDepth;
  } else {
    assertOk(pairs.length >= 5, "E3 minimum history");
    const logValues = pairs.map((p) => Math.log(p[1]));
    const incrementDepths = [];
    const increments = [];
    for (let i = 1; i < pairs.length; i += 1) {
      incrementDepths.push(pairs[i][0]);
      increments.push(logValues[i] - logValues[i - 1]);
    }
    const [a, b] = linearRegression(incrementDepths.slice(-4), increments.slice(-4));
    logPrediction = logValues[logValues.length - 1] + a + b * targetDepth;
  }
  const prediction = Math.exp(logPrediction);
  assertOk(Number.isFinite(logPrediction) && Number.isFinite(prediction) && prediction > 0, "non-finite prediction");
  return { candidateId, field, targetDepth, logPrediction, prediction };
}

function inspectDevelopmentSource(result) {
  assertOk(result && result.studyId === "DRSSE-STUDY1", "wrong upstream study");
  assertOk(result.formalDecision === "EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN", "wrong upstream decision");
  assertOk(result.targetDepth === 9 && result.targetComplete === true, "depth-9 exact result required");
  assertOk(result.representation && result.representation.mode === "RAW-ONLY", "RAW-only required");
  assertOk(Array.isArray(result.representation.validatedTransformSet) && result.representation.validatedTransformSet.length === 0, "transform set must be empty");
  assertOk(Array.isArray(result.layers) && result.layers.length === 10, "ten complete layers required");
  const layers = [];
  for (let depth = 0; depth <= 9; depth += 1) {
    const layer = result.layers[depth];
    assertOk(layer.depth === depth && layer.complete === true, `bad layer ${depth}`);
    assertOk(depth <= 9, "holdout leakage");
    const raw = Number(layer.newRawStateCount);
    const tree = Number(layer.treeNodeOccurrences);
    assertOk(Number.isFinite(raw) && raw > 0 && Number.isFinite(tree) && tree > 0, `invalid counts at ${depth}`);
    layers.push({ depth, newRawStateCount: raw, treeNodeOccurrences: tree });
  }
  const core = {
    upstreamStudyId: result.studyId,
    upstreamFormalDecision: result.formalDecision,
    maximumDepthRead: 9,
    candidateEvaluationPerformed: false,
    freshHoldoutRead: false,
    layers,
  };
  return { ...core, sourceSummarySha256: digest(core) };
}

function makeRows(fn) {
  return Array.from({ length: 10 }, (_, depth) => ({ depth, syntheticCount: Math.exp(fn(depth)) }));
}

function syntheticChecks() {
  const cases = [
    ["geometric", CANDIDATES[0], (d) => 0.7 + 0.23 * d],
    ["logQuadratic", CANDIDATES[1], (d) => 0.3 + 0.11 * d + 0.012 * d * d],
    ["localIncrementTrend", CANDIDATES[2], (d) => 0.4 + 0.07 * d + 0.009 * d * d],
  ];
  const checks = cases.map(([fixture, candidateId, fn]) => {
    const result = predict(makeRows(fn), "syntheticCount", 10, candidateId);
    const expected = Math.exp(fn(10));
    return { fixture, candidateId, prediction: result.prediction, expected, absoluteLogError: Math.abs(Math.log(result.prediction) - Math.log(expected)) };
  });
  const core = { checks };
  return { ...core, syntheticCoreSha256: digest(core) };
}

function resourceDisposition(snapshot, limits) {
  const tests = [
    ["CUMULATIVE_RAW_STATE_CAP", snapshot.cumulativeRawStates, limits.maximumCumulativeDistinctRawStates, "RESOURCE-LIMIT"],
    ["DEPTH_LABELLED_EDGE_CAP", snapshot.depthLabelledEdges, limits.maximumCumulativeDepthLabelledLegalEdges, "RESOURCE-LIMIT"],
    ["PARENT_EXPANSION_CAP", snapshot.parentExpansions, limits.maximumUniqueParentStateExpansions, "RESOURCE-LIMIT"],
    ["MOVE_EVALUATION_CAP", snapshot.moveEvaluations, limits.maximumLegalMoveEvaluations, "RESOURCE-LIMIT"],
    ["TREE_OCCURRENCE_CAP", snapshot.cumulativeTreeNodeOccurrences, limits.maximumCumulativeTreeNodeOccurrences, "RESOURCE-LIMIT"],
    ["RSS_CAP", snapshot.residentSetBytes, limits.maximumResidentSetBytes, "RESOURCE-LIMIT"],
    ["ARTIFACT_BYTE_CAP", snapshot.artifactBytes, limits.maximumUncompressedScientificArtifactBytes, "RESOURCE-LIMIT"],
    ["WALL_CLOCK_CAP", snapshot.wallClockSeconds, limits.maximumWallClockSeconds, "ADMIN-CUTOFF"],
  ];
  for (const [reason, value, limit, classification] of tests) {
    assertOk(Number.isFinite(Number(value)) && Number.isFinite(Number(limit)), `non-finite resource: ${reason}`);
    if (Number(value) > Number(limit)) return { stopped: true, reason, classification };
  }
  return { stopped: false, reason: null, classification: null };
}

module.exports = {
  CANDIDATES,
  canonical,
  digest,
  predict,
  inspectDevelopmentSource,
  syntheticChecks,
  resourceDisposition,
};
