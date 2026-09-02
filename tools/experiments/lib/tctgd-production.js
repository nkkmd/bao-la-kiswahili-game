"use strict";

const U = require("./lgtgmiv-stage1-production.js");

const STUDY_ID = "TCTGD-STUDY1";
const HORIZON = 5;
const CANDIDATES = [
  "TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO",
  "TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION",
  "TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION",
  "TCTGD-C4-RECONVERGENCE-ONSET-SCORE",
  "TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION"
];

function requireTrue(x, message) {
  if (!x) throw new Error(message);
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function fraction(n, d) {
  n = BigInt(n);
  d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}

function subtract(a, b) {
  if (!a || !b || !a.defined || !b.defined) return fraction(0n, 0n);
  return fraction(
    BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator),
    BigInt(a.denominator) * BigInt(b.denominator)
  );
}

function signOf(q) {
  if (!q || !q.defined) return null;
  const n = BigInt(q.numerator);
  return n > 0n ? 1 : n < 0n ? -1 : 0;
}

function sumIntegerFields(rows, field) {
  return rows.reduce((a, row) => a + BigInt(row[field]), 0n);
}

function rootBranchOverlapFraction(branchGeometry) {
  const labels = branchGeometry.rootMoveLabels || [];
  const totalPairs = BigInt(labels.length * (labels.length - 1) / 2);
  if (totalPairs === 0n) return fraction(0n, 0n);
  const positivePairs = new Set();
  for (const depthRow of branchGeometry.rootBranchPairOverlapByDepth || []) {
    if (depthRow.depth < 1 || depthRow.depth > HORIZON) continue;
    for (const pair of depthRow.pairs || []) {
      if (pair.overlap && pair.overlap.defined && BigInt(pair.overlap.numerator) > 0n) {
        const a = pair.rootMoveA < pair.rootMoveB ? pair.rootMoveA : pair.rootMoveB;
        const b = pair.rootMoveA < pair.rootMoveB ? pair.rootMoveB : pair.rootMoveA;
        positivePairs.add(`${a}\u0000${b}`);
      }
    }
  }
  return fraction(BigInt(positivePairs.size), totalPairs);
}

function deriveFromMeasurement(measurement) {
  requireTrue(measurement && measurement.reconstructionCore, "measurement reconstructionCore required");
  const r = measurement.reconstructionCore;
  requireTrue(r.targetDepth === HORIZON, "TCTGD requires relative depth 5");
  requireTrue(r.representation && r.representation.mode === "RAW-ONLY", "RAW-only representation required");
  requireTrue(Array.isArray(r.representation.validatedTransformSet) && r.representation.validatedTransformSet.length === 0, "validated transform set must be empty");
  requireTrue(r.layers.length === HORIZON + 1 && r.parentLayers.length === HORIZON, "complete depth layers required");

  const treeOccurrences = sumIntegerFields(r.layers, "treeNodeOccurrences");
  const distinctRawStates = BigInt(r.cumulative.distinctRawStates);
  const duplicateEncounters = sumIntegerFields(r.parentLayers, "duplicateEncounterCount");
  const depthLabelledUniqueTransitions = sumIntegerFields(r.parentLayers, "uniqueTransitionCount");
  const multiParentLayerCount = sumIntegerFields(r.parentLayers, "multiParentRawStateCount");
  const nonRootDepthLabelledRawStates = r.layers.slice(1).reduce((a, row) => a + BigInt(row.uniqueRawStateCount), 0n);
  const firstReconvergenceDepth = r.firstReconvergenceDepth === null ? null : Number(r.firstReconvergenceDepth);
  const onsetScore = fraction(BigInt(firstReconvergenceDepth === null ? HORIZON + 1 : firstReconvergenceDepth), 1n);

  const endpoints = {
    "TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO": fraction(treeOccurrences, distinctRawStates),
    "TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION": fraction(duplicateEncounters, depthLabelledUniqueTransitions),
    "TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION": fraction(multiParentLayerCount, nonRootDepthLabelledRawStates),
    "TCTGD-C4-RECONVERGENCE-ONSET-SCORE": onsetScore,
    "TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION": rootBranchOverlapFraction(r.rootBranchGeometry)
  };

  return {
    rootRawSha256: r.rootRawSha256,
    targetDepth: r.targetDepth,
    rawPrimitives: {
      rootIncludedInC1: true,
      rootExcludedFromC3Denominator: true,
      treeOccurrenceCountDepth0To5: String(treeOccurrences),
      distinctRawStatesDepth0To5: String(distinctRawStates),
      duplicateEncounterCountParentDepth0To4: String(duplicateEncounters),
      depthLabelledUniqueTransitionCountParentDepth0To4: String(depthLabelledUniqueTransitions),
      multiParentRawStateCountLayerSumParentDepth0To4: String(multiParentLayerCount),
      nonRootDepthLabelledUniqueRawStateCountDepth1To5: String(nonRootDepthLabelledRawStates),
      firstReconvergenceDepth,
      layerReconvergentRawStateCount: r.layers.map(x => ({ depth: x.depth, count: x.reconvergentRawStateCount })),
      arrivalMultiplicityHistogramByParentDepth: r.parentLayers.map(x => ({ depth: x.depth, histogram: x.arrivalMultiplicityHistogram })),
      parentMultiplicityHistogramByParentDepth: r.parentLayers.map(x => ({ depth: x.depth, histogram: x.parentMultiplicityHistogram })),
      treeNodeOccurrencesByDepth: r.layers.map(x => ({ depth: x.depth, count: x.treeNodeOccurrences })),
      uniqueRawStateCountByDepth: r.layers.map(x => ({ depth: x.depth, count: x.uniqueRawStateCount })),
      duplicateEncounterCountByParentDepth: r.parentLayers.map(x => ({ depth: x.depth, count: x.duplicateEncounterCount })),
      multiParentRawStateCountByParentDepth: r.parentLayers.map(x => ({ depth: x.depth, count: x.multiParentRawStateCount }))
    },
    endpoints
  };
}

function measureRoot(engine, source) {
  const upstream = U.measureRoot(engine, source, HORIZON);
  return {
    upstreamRootReconstructionCoreSha256: upstream.rootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: {
      "LGTGMIV-F1-TREE-OCCURRENCE": upstream.rootFamilyCoreSha256["LGTGMIV-F1-TREE-OCCURRENCE"],
      "LGTGMIV-F2-RAW-GRAPH": upstream.rootFamilyCoreSha256["LGTGMIV-F2-RAW-GRAPH"],
      "LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE": upstream.rootFamilyCoreSha256["LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE"],
      "LGTGMIV-F4-TREE-GRAPH-RELATION": upstream.rootFamilyCoreSha256["LGTGMIV-F4-TREE-GRAPH-RELATION"]
    },
    source: upstream.source,
    tctgd: deriveFromMeasurement(upstream)
  };
}

function comparePair(pairId, namuaRoot, mtajiRoot) {
  const rows = {};
  for (const id of CANDIDATES) {
    const n = namuaRoot.tctgd.endpoints[id];
    const m = mtajiRoot.tctgd.endpoints[id];
    const delta = subtract(m, n);
    rows[id] = { namua: n, mtaji: m, deltaMtajiMinusNamua: delta, sign: signOf(delta) };
  }
  return { pairId, candidates: rows };
}

function minimumComparable(candidateId, expectedPairs) {
  return candidateId === "TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION"
    ? Math.ceil(expectedPairs * 5 / 6)
    : expectedPairs;
}

function summarizeDevelopment(pairComparisons, expectedPairs) {
  requireTrue(pairComparisons.length === expectedPairs, "development pair count mismatch");
  const promoted = [];
  const summaries = {};
  for (const id of CANDIDATES) {
    let comparable = 0, positive = 0, negative = 0, zero = 0;
    for (const p of pairComparisons) {
      const s = p.candidates[id].sign;
      if (s === null) continue;
      comparable++;
      if (s > 0) positive++; else if (s < 0) negative++; else zero++;
    }
    const nonZero = positive + negative;
    const dominant = Math.max(positive, negative);
    const direction = positive > negative ? "MTAJI-GREATER" : negative > positive ? "NAMUA-GREATER" : null;
    const coveragePass = comparable >= minimumComparable(id, expectedPairs);
    const nonZeroPass = 3 * nonZero >= 2 * comparable;
    const dominancePass = direction !== null && 3 * dominant >= 2 * nonZero;
    const promote = coveragePass && nonZeroPass && dominancePass;
    summaries[id] = { comparable, positive, negative, zero, nonZero, dominant, direction, coveragePass, nonZeroPass, dominancePass, promote };
    if (promote) promoted.push({ candidateId: id, direction });
  }
  return { expectedPairs, summaries, promotedCandidates: promoted };
}

function choose(n, k) {
  n = BigInt(n); k = BigInt(k);
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let out = 1n;
  for (let i = 1n; i <= k; i++) out = out * (n - k + i) / i;
  return out;
}

function signTestTwoSided(positive, negative) {
  const n = positive + negative;
  if (n === 0) return fraction(1n, 1n);
  const tail = Math.min(positive, negative);
  let count = 0n;
  for (let k = 0; k <= tail; k++) count += choose(n, k);
  let num = 2n * count;
  const den = 1n << BigInt(n);
  if (num > den) num = den;
  return fraction(num, den);
}

function lessOrEqual(a, b) {
  requireTrue(a.defined && b.defined, "defined fractions required");
  return BigInt(a.numerator) * BigInt(b.denominator) <= BigInt(b.numerator) * BigInt(a.denominator);
}

function validateFormal(pairComparisons, promotedCandidates, expectedPairs) {
  requireTrue(pairComparisons.length === expectedPairs, "formal pair count mismatch");
  const promoted = new Map(promotedCandidates.map(x => [x.candidateId, x.direction]));
  const rows = [];
  for (const [id, frozenDirection] of promoted) {
    let comparable = 0, positive = 0, negative = 0, zero = 0;
    for (const p of pairComparisons) {
      const s = p.candidates[id].sign;
      if (s === null) continue;
      comparable++;
      if (s > 0) positive++; else if (s < 0) negative++; else zero++;
    }
    const nonZero = positive + negative;
    const observedDirection = positive > negative ? "MTAJI-GREATER" : negative > positive ? "NAMUA-GREATER" : null;
    const coveragePass = comparable >= minimumComparable(id, expectedPairs);
    const nonZeroPass = 3 * nonZero >= 2 * comparable;
    const directionPass = observedDirection === frozenDirection;
    rows.push({ candidateId: id, frozenDirection, comparable, positive, negative, zero, nonZero, observedDirection, coveragePass, nonZeroPass, directionPass, rawP: signTestTwoSided(positive, negative) });
  }

  rows.sort((a, b) => {
    const left = BigInt(a.rawP.numerator) * BigInt(b.rawP.denominator);
    const right = BigInt(b.rawP.numerator) * BigInt(a.rawP.denominator);
    return left < right ? -1 : left > right ? 1 : a.candidateId.localeCompare(b.candidateId);
  });

  let holmOpen = true;
  const m = rows.length;
  for (let i = 0; i < rows.length; i++) {
    const threshold = fraction(1n, BigInt(20 * (m - i)));
    const rawPass = lessOrEqual(rows[i].rawP, threshold);
    rows[i].holmRank = i + 1;
    rows[i].holmThreshold = threshold;
    rows[i].holmPass = holmOpen && rawPass;
    rows[i].confirmed = rows[i].holmPass && rows[i].coveragePass && rows[i].nonZeroPass && rows[i].directionPass;
    if (!rawPass) holmOpen = false;
  }
  rows.sort((a, b) => a.candidateId.localeCompare(b.candidateId));
  return { expectedPairs, alpha: fraction(1n, 20n), candidates: rows, confirmedCandidates: rows.filter(x => x.confirmed).map(x => x.candidateId) };
}

module.exports = {
  STUDY_ID,
  HORIZON,
  CANDIDATES,
  upstreamImplementation: "LGTGMIV-PRODUCTION",
  fraction,
  deriveFromMeasurement,
  measureRoot,
  comparePair,
  summarizeDevelopment,
  signTestTwoSided,
  validateFormal
};
