"use strict";

const crypto = require("node:crypto");

const CANDIDATE_IDS = Object.freeze([
  "E1-TRAILING-LOG-LINEAR-W5",
  "E2-LOG-QUADRATIC-D2PLUS",
  "E3-LOCAL-LOG-INCREMENT-TREND-W4",
]);

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function finitePositive(value, label) {
  ensure(Number.isFinite(value) && value > 0, `${label} must be finite and positive`);
  return value;
}

function normalizeSeries(rows, field) {
  ensure(Array.isArray(rows) && rows.length > 0, "rows must be a non-empty array");
  const normalized = rows.map((row) => ({
    depth: Number(row.depth),
    value: Number(row[field]),
  }));
  normalized.sort((a, b) => a.depth - b.depth);
  for (let i = 0; i < normalized.length; i += 1) {
    ensure(Number.isInteger(normalized[i].depth) && normalized[i].depth >= 0, "depth must be a non-negative integer");
    finitePositive(normalized[i].value, `${field}@${normalized[i].depth}`);
    if (i > 0) ensure(normalized[i].depth === normalized[i - 1].depth + 1, "series depths must be contiguous");
  }
  return normalized;
}

function fitLinear(points) {
  ensure(points.length >= 2, "linear fit requires at least two points");
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const point of points) {
    sx += point.x;
    sy += point.y;
    sxx += point.x * point.x;
    sxy += point.x * point.y;
  }
  const n = points.length;
  const denom = n * sxx - sx * sx;
  ensure(Number.isFinite(denom) && Math.abs(denom) > 1e-15, "linear fit is singular");
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  finitePositive(Math.exp(intercept), "linear intercept exponential");
  ensure(Number.isFinite(slope), "linear slope must be finite");
  return { intercept, slope };
}

function solve3x3(matrix, vector) {
  const a = matrix.map((row, i) => [...row, vector[i]]);
  for (let col = 0; col < 3; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < 3; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    ensure(Math.abs(a[pivot][col]) > 1e-15, "quadratic fit is singular");
    if (pivot !== col) [a[pivot], a[col]] = [a[col], a[pivot]];
    const divisor = a[col][col];
    for (let j = col; j < 4; j += 1) a[col][j] /= divisor;
    for (let row = 0; row < 3; row += 1) {
      if (row === col) continue;
      const factor = a[row][col];
      for (let j = col; j < 4; j += 1) a[row][j] -= factor * a[col][j];
    }
  }
  return [a[0][3], a[1][3], a[2][3]];
}

function fitQuadratic(points) {
  ensure(points.length >= 3, "quadratic fit requires at least three points");
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let sy = 0;
  let sxy = 0;
  let sx2y = 0;
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
  const [a, b, c] = solve3x3(
    [[s0, s1, s2], [s1, s2, s3], [s2, s3, s4]],
    [sy, sxy, sx2y],
  );
  ensure([a, b, c].every(Number.isFinite), "quadratic coefficients must be finite");
  return { a, b, c };
}

function predictCandidate(rows, field, targetDepth, candidateId) {
  ensure(CANDIDATE_IDS.includes(candidateId), `unknown candidate: ${candidateId}`);
  const series = normalizeSeries(rows, field).filter((row) => row.depth < targetDepth);
  ensure(series.length > 0 && series[series.length - 1].depth === targetDepth - 1, "target must immediately follow available series");
  const points = series.map((row) => ({ x: row.depth, y: Math.log(row.value) }));
  let logPrediction;

  if (candidateId === CANDIDATE_IDS[0]) {
    ensure(points.length >= 5, "E1 requires five prior layers");
    const fit = fitLinear(points.slice(-5));
    logPrediction = fit.intercept + fit.slope * targetDepth;
  } else if (candidateId === CANDIDATE_IDS[1]) {
    const eligible = points.filter((point) => point.x >= 2);
    ensure(eligible.length >= 3, "E2 requires at least three depth>=2 layers");
    const fit = fitQuadratic(eligible);
    logPrediction = fit.a + fit.b * targetDepth + fit.c * targetDepth * targetDepth;
  } else {
    ensure(points.length >= 5, "E3 requires at least five prior layers");
    const increments = [];
    for (let i = 1; i < points.length; i += 1) {
      increments.push({ x: points[i].x, y: points[i].y - points[i - 1].y });
    }
    const fit = fitLinear(increments.slice(-4));
    const nextIncrement = fit.intercept + fit.slope * targetDepth;
    logPrediction = points[points.length - 1].y + nextIncrement;
  }

  ensure(Number.isFinite(logPrediction), "log prediction must be finite");
  const prediction = Math.exp(logPrediction);
  finitePositive(prediction, "prediction");
  return { candidateId, field, targetDepth, logPrediction, prediction };
}

function extractDevelopmentSource(drsseResult) {
  ensure(drsseResult && drsseResult.studyId === "DRSSE-STUDY1", "unexpected upstream study");
  ensure(drsseResult.formalDecision === "EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN", "unexpected upstream formal decision");
  ensure(drsseResult.targetDepth === 9 && drsseResult.targetComplete === true, "DRSSE depth-9 exact target required");
  ensure(drsseResult.representation && drsseResult.representation.mode === "RAW-ONLY", "RAW-only upstream representation required");
  ensure(Array.isArray(drsseResult.representation.validatedTransformSet) && drsseResult.representation.validatedTransformSet.length === 0, "validated transform set must remain empty");
  ensure(Array.isArray(drsseResult.layers) && drsseResult.layers.length === 10, "exact depths 0..9 required");

  const layers = drsseResult.layers.map((layer, index) => {
    ensure(layer.depth === index && layer.complete === true, `complete DRSSE layer ${index} required`);
    ensure(index <= 9, "Stage 0 may not read a layer deeper than 9");
    finitePositive(Number(layer.newRawStateCount), `newRawStateCount@${index}`);
    finitePositive(Number(layer.treeNodeOccurrences), `treeNodeOccurrences@${index}`);
    return {
      depth: index,
      newRawStateCount: Number(layer.newRawStateCount),
      treeNodeOccurrences: Number(layer.treeNodeOccurrences),
    };
  });

  const core = {
    upstreamStudyId: drsseResult.studyId,
    upstreamFormalDecision: drsseResult.formalDecision,
    maximumDepthRead: 9,
    candidateEvaluationPerformed: false,
    freshHoldoutRead: false,
    layers,
  };
  return { ...core, sourceSummarySha256: sha256Text(stableStringify(core)) };
}

function syntheticRows(logFunction, maxDepth = 9) {
  const rows = [];
  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const value = Math.exp(logFunction(depth));
    rows.push({ depth, syntheticCount: value });
  }
  return rows;
}

function runSyntheticTechnicalFixtures() {
  const fixtures = {
    geometric: syntheticRows((d) => 0.7 + 0.23 * d),
    logQuadratic: syntheticRows((d) => 0.3 + 0.11 * d + 0.012 * d * d),
    localIncrementTrend: syntheticRows((d) => 0.4 + 0.07 * d + 0.009 * d * d),
  };
  const checks = [
    { fixture: "geometric", candidateId: CANDIDATE_IDS[0] },
    { fixture: "logQuadratic", candidateId: CANDIDATE_IDS[1] },
    { fixture: "localIncrementTrend", candidateId: CANDIDATE_IDS[2] },
  ].map(({ fixture, candidateId }) => {
    const result = predictCandidate(fixtures[fixture], "syntheticCount", 10, candidateId);
    const expected = Math.exp(
      fixture === "geometric" ? 0.7 + 0.23 * 10
        : fixture === "logQuadratic" ? 0.3 + 0.11 * 10 + 0.012 * 100
          : 0.4 + 0.07 * 10 + 0.009 * 100,
    );
    return {
      fixture,
      candidateId,
      prediction: result.prediction,
      expected,
      absoluteLogError: Math.abs(Math.log(result.prediction) - Math.log(expected)),
    };
  });
  const core = { checks };
  return { ...core, syntheticCoreSha256: sha256Text(stableStringify(core)) };
}

function classifyResource(snapshot, ceilings) {
  const ordered = [
    ["CUMULATIVE_RAW_STATE_CAP", snapshot.cumulativeRawStates, ceilings.maximumCumulativeDistinctRawStates],
    ["DEPTH_LABELLED_EDGE_CAP", snapshot.depthLabelledEdges, ceilings.maximumCumulativeDepthLabelledLegalEdges],
    ["PARENT_EXPANSION_CAP", snapshot.parentExpansions, ceilings.maximumUniqueParentStateExpansions],
    ["MOVE_EVALUATION_CAP", snapshot.moveEvaluations, ceilings.maximumLegalMoveEvaluations],
    ["TREE_OCCURRENCE_CAP", snapshot.cumulativeTreeNodeOccurrences, ceilings.maximumCumulativeTreeNodeOccurrences],
    ["RSS_CAP", snapshot.residentSetBytes, ceilings.maximumResidentSetBytes],
    ["ARTIFACT_BYTE_CAP", snapshot.artifactBytes, ceilings.maximumUncompressedScientificArtifactBytes],
    ["WALL_CLOCK_CAP", snapshot.wallClockSeconds, ceilings.maximumWallClockSeconds],
  ];
  for (const [reason, value, limit] of ordered) {
    ensure(Number.isFinite(Number(value)) && Number.isFinite(Number(limit)), `resource value must be finite: ${reason}`);
    if (Number(value) > Number(limit)) {
      return { stopped: true, reason, classification: reason === "WALL_CLOCK_CAP" ? "ADMIN-CUTOFF" : "RESOURCE-LIMIT" };
    }
  }
  return { stopped: false, reason: null, classification: null };
}

module.exports = {
  CANDIDATE_IDS,
  stableStringify,
  sha256Text,
  normalizeSeries,
  predictCandidate,
  extractDevelopmentSource,
  runSyntheticTechnicalFixtures,
  classifyResource,
};
